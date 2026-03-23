import { NextRequest, NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";

// ============================================================================
// iPay Invoice API — Generate and manage invoices
// POST /api/invoices — Create an invoice
// GET /api/invoices/:id — Get invoice details
// ============================================================================

const invoiceStore = new Map<string, Invoice>();

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  merchantWallet: string;
  merchantName: string;
  customerEmail?: string;
  customerName?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  total: number;
  currency: string;
  memo: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  dueDate: string;
  createdAt: string;
  paidAt?: string;
  paymentUrl: string;
  blinkUrl: string;
}

function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const seq = Math.floor(Math.random() * 99999)
    .toString()
    .padStart(5, "0");
  return `INV-${year}-${seq}`;
}

// POST — Create invoice
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      merchantWallet,
      merchantName,
      customerEmail,
      customerName,
      items,
      taxRate,
      currency,
      dueDate,
      memo,
    } = body;

    if (!merchantWallet || !items || items.length === 0) {
      return NextResponse.json(
        { error: "merchantWallet and items[] are required" },
        { status: 400 }
      );
    }

    try {
      new PublicKey(merchantWallet);
    } catch {
      return NextResponse.json({ error: "Invalid merchantWallet" }, { status: 400 });
    }

    // Calculate totals
    const invoiceItems: InvoiceItem[] = items.map((item: any) => ({
      description: (item.description || "Item").slice(0, 100),
      quantity: Math.max(1, item.quantity || 1),
      unitPrice: Math.max(0, item.unitPrice || 0),
      total: (item.quantity || 1) * (item.unitPrice || 0),
    }));

    const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
    const effectiveTaxRate = Math.min(100, Math.max(0, taxRate || 0));
    const tax = subtotal * (effectiveTaxRate / 100);
    const total = subtotal + tax;

    const id = `inv_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    const origin = request.nextUrl.origin;

    const invoice: Invoice = {
      id,
      invoiceNumber: generateInvoiceNumber(),
      merchantWallet,
      merchantName: (merchantName || "iPay Merchant").slice(0, 32),
      customerEmail: customerEmail?.slice(0, 100),
      customerName: customerName?.slice(0, 64),
      items: invoiceItems,
      subtotal,
      tax,
      taxRate: effectiveTaxRate,
      total,
      currency: currency || "SOL",
      memo: (memo || `Invoice ${id}`).slice(0, 64),
      status: "sent",
      dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      paymentUrl: `${origin}/pay?merchant=${merchantWallet}&amount=${total}&memo=${encodeURIComponent(`Invoice ${id}`)}`,
      blinkUrl: `${origin}/api/actions/pay?merchant=${merchantWallet}&amount=${total}&memo=${encodeURIComponent(`Invoice ${id}`)}`,
    };

    invoiceStore.set(id, invoice);

    return NextResponse.json({ success: true, invoice });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET — Get invoice or list invoices
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const merchantWallet = request.nextUrl.searchParams.get("merchantWallet");

  if (id) {
    const invoice = invoiceStore.get(id);
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }
    return NextResponse.json({ invoice });
  }

  if (merchantWallet) {
    const invoices = Array.from(invoiceStore.values())
      .filter((inv) => inv.merchantWallet === merchantWallet)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json({ invoices, count: invoices.length });
  }

  // API documentation
  return NextResponse.json({
    name: "iPay Invoice API",
    version: "1.0",
    endpoints: {
      "POST /api/invoices": {
        description: "Create a new invoice",
        body: {
          merchantWallet: "string (required)",
          merchantName: "string",
          customerEmail: "string",
          customerName: "string",
          items: "[{ description, quantity, unitPrice }] (required)",
          taxRate: "number (percentage, default: 0)",
          currency: "string (default: SOL)",
          dueDate: "ISO 8601 string",
          memo: "string",
        },
      },
      "GET /api/invoices?id=<invoiceId>": "Get invoice details",
      "GET /api/invoices?merchantWallet=<address>": "List invoices for merchant",
    },
  });
}
