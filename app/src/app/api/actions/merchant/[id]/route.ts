import { NextRequest, NextResponse } from "next/server";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  ACTIONS_CORS_HEADERS,
  createIPayPaymentTransaction,
  serializeTransaction,
} from "@/lib/actions";
import { DEVNET_ENDPOINT, LOYALTY_POINTS_PER_SOL } from "@/lib/constants";
import { fetchMerchant } from "@/lib/program";

// ---------------------------------------------------------------------------
// In-memory merchant directory — used as fallback / seed data
// On-chain merchant data takes priority when available.
// ---------------------------------------------------------------------------

interface MerchantInfo {
  name: string;
  wallet: string; // base-58 public key
  defaultAmount: number; // SOL
  description: string;
  memo?: string;
}

const MERCHANTS: Record<string, MerchantInfo> = {
  demo: {
    name: "iPay Demo Store",
    wallet: "GkXn6PUBcmhEqMBScVpu4FE6gKBJFnCMhRSGcMPVpZG3",
    defaultAmount: 0.1,
    description: "Demo merchant for iPay payments",
    memo: "iPay demo payment",
  },
  coffee: {
    name: "Crypto Coffee",
    wallet: "GkXn6PUBcmhEqMBScVpu4FE6gKBJFnCMhRSGcMPVpZG3",
    defaultAmount: 0.05,
    description: "Buy a coffee with SOL — earn loyalty tokens!",
    memo: "Coffee purchase",
  },
};

// ---------------------------------------------------------------------------
// SVG icon generator per merchant
// ---------------------------------------------------------------------------

function merchantIcon(name: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1"/>
      <stop offset="100%" style="stop-color:#06b6d4"/>
    </linearGradient>
  </defs>
  <rect width="256" height="256" rx="48" fill="url(#bg)"/>
  <text x="128" y="140" font-family="Arial,sans-serif" font-size="28" font-weight="bold"
        fill="white" text-anchor="middle">${name}</text>
  <text x="128" y="190" font-family="Arial,sans-serif" font-size="20"
        fill="rgba(255,255,255,0.7)" text-anchor="middle">via iPay</text>
</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

// ---------------------------------------------------------------------------
// Helper: resolve merchant info, preferring on-chain data
// ---------------------------------------------------------------------------

async function resolveMerchant(
  merchantId: string,
  connection: Connection,
): Promise<{
  name: string;
  wallet: string;
  defaultAmount: number;
  description: string;
  memo: string;
  onChain: boolean;
  totalPayments?: string;
  totalVolume?: string;
  loyaltyMultiplier?: number;
} | null> {
  const local = MERCHANTS[merchantId];

  if (!local) {
    // If the merchantId looks like a base-58 pubkey, try to resolve it on-chain
    try {
      const walletPubkey = new PublicKey(merchantId);
      const onChainData = await fetchMerchant(connection, walletPubkey);
      if (onChainData) {
        return {
          name: onChainData.name || merchantId,
          wallet: merchantId,
          defaultAmount: 0.1,
          description: onChainData.description || "iPay merchant",
          memo: `Payment to ${onChainData.name || merchantId}`,
          onChain: true,
          totalPayments: onChainData.totalPayments?.toString(),
          totalVolume: onChainData.totalVolume?.toString(),
          loyaltyMultiplier: onChainData.loyaltyMultiplier,
        };
      }
    } catch {
      // Not a valid pubkey — merchant not found
    }
    return null;
  }

  // We have local data — try to enrich with on-chain data
  try {
    const walletPubkey = new PublicKey(local.wallet);
    const onChainData = await fetchMerchant(connection, walletPubkey);
    if (onChainData) {
      return {
        name: onChainData.name || local.name,
        wallet: local.wallet,
        defaultAmount: local.defaultAmount,
        description: onChainData.description || local.description,
        memo: local.memo || `Payment to ${onChainData.name || local.name}`,
        onChain: true,
        totalPayments: onChainData.totalPayments?.toString(),
        totalVolume: onChainData.totalVolume?.toString(),
        loyaltyMultiplier: onChainData.loyaltyMultiplier,
      };
    }
  } catch {
    // On-chain fetch failed — use local data
  }

  return {
    name: local.name,
    wallet: local.wallet,
    defaultAmount: local.defaultAmount,
    description: local.description,
    memo: local.memo || `Payment to ${local.name}`,
    onChain: false,
  };
}

// ---------------------------------------------------------------------------
// GET — Return Blink metadata for a specific merchant
// ---------------------------------------------------------------------------

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const merchantId = params.id;
  const connection = new Connection(DEVNET_ENDPOINT, "confirmed");
  const merchant = await resolveMerchant(merchantId, connection);

  if (!merchant) {
    return NextResponse.json(
      { error: `Merchant "${merchantId}" not found` },
      { status: 404, headers: ACTIONS_CORS_HEADERS },
    );
  }

  const loyaltyInfo = merchant.loyaltyMultiplier
    ? ` (${merchant.loyaltyMultiplier / 100}x loyalty bonus!)`
    : ` — earn ${LOYALTY_POINTS_PER_SOL} loyalty tokens per SOL!`;

  const description = merchant.onChain
    ? `${merchant.description}${loyaltyInfo} | ${merchant.totalPayments || 0} payments processed on-chain`
    : merchant.description;

  const response = {
    title: `Pay ${merchant.name}`,
    icon: merchantIcon(merchant.name),
    description,
    label: `Pay ${merchant.defaultAmount} SOL`,
    links: {
      actions: [
        {
          href: `/api/actions/merchant/${merchantId}?amount={amount}`,
          label: "Pay",
          parameters: [
            {
              name: "amount",
              label: `Amount in SOL (default ${merchant.defaultAmount})`,
              type: "number",
              required: false,
            },
          ],
        },
      ],
    },
  };

  return NextResponse.json(response, { headers: ACTIONS_CORS_HEADERS });
}

// ---------------------------------------------------------------------------
// POST — Build payment transaction for this merchant via iPay program
// ---------------------------------------------------------------------------

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const merchantId = params.id;
    const connection = new Connection(DEVNET_ENDPOINT, "confirmed");
    const merchant = await resolveMerchant(merchantId, connection);

    if (!merchant) {
      return NextResponse.json(
        { error: `Merchant "${merchantId}" not found` },
        { status: 404, headers: ACTIONS_CORS_HEADERS },
      );
    }

    const body = await request.json();

    if (!body.account) {
      return NextResponse.json(
        { error: "Missing required field: account" },
        { status: 400, headers: ACTIONS_CORS_HEADERS },
      );
    }

    let payerPubkey: PublicKey;
    try {
      payerPubkey = new PublicKey(body.account);
    } catch {
      return NextResponse.json(
        { error: "Invalid account public key" },
        { status: 400, headers: ACTIONS_CORS_HEADERS },
      );
    }

    // Amount: use query param if provided, otherwise merchant default
    const { searchParams } = new URL(request.url);
    const amountStr = searchParams.get("amount");
    const amountSol = amountStr ? parseFloat(amountStr) : merchant.defaultAmount;

    if (isNaN(amountSol) || amountSol <= 0) {
      return NextResponse.json(
        { error: "amount must be a positive number" },
        { status: 400, headers: ACTIONS_CORS_HEADERS },
      );
    }

    const merchantPubkey = new PublicKey(merchant.wallet);
    const amountLamports = Math.round(amountSol * LAMPORTS_PER_SOL);

    // Build transaction using the real iPay program
    const transaction = await createIPayPaymentTransaction(
      payerPubkey,
      merchantPubkey,
      amountLamports,
      connection,
      merchant.memo,
    );

    const serialized = serializeTransaction(transaction);

    const loyaltyEstimate = Math.floor(amountSol * LOYALTY_POINTS_PER_SOL);

    return NextResponse.json(
      {
        transaction: serialized,
        message: `Payment of ${amountSol} SOL to ${merchant.name} via iPay. You earned ~${loyaltyEstimate} loyalty tokens!${merchant.memo ? ` — ${merchant.memo}` : ""}`,
      },
      { headers: ACTIONS_CORS_HEADERS },
    );
  } catch (error) {
    console.error("POST /api/actions/merchant/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500, headers: ACTIONS_CORS_HEADERS },
    );
  }
}

// ---------------------------------------------------------------------------
// OPTIONS — CORS preflight
// ---------------------------------------------------------------------------

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: ACTIONS_CORS_HEADERS,
  });
}
