import { NextRequest, NextResponse } from "next/server";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  ACTIONS_CORS_HEADERS,
  createIPayPaymentTransaction,
  serializeTransaction,
} from "@/lib/actions";
import { DEVNET_ENDPOINT, LOYALTY_POINTS_PER_SOL } from "@/lib/constants";

// ---------------------------------------------------------------------------
// Types matching the Solana Actions specification
// ---------------------------------------------------------------------------

interface ActionGetResponse {
  title: string;
  icon: string;
  description: string;
  label: string;
  links?: {
    actions: Array<{
      href: string;
      label: string;
      parameters?: Array<{
        name: string;
        label: string;
        type?: string;
        required?: boolean;
      }>;
    }>;
  };
}

interface ActionPostRequest {
  account: string; // base-58 encoded public key of the payer
}

interface ActionPostResponse {
  transaction: string; // base-64 encoded serialized transaction
  message?: string;
}

// ---------------------------------------------------------------------------
// Simple SVG icon as a data URI — iPay branding with gradient
// ---------------------------------------------------------------------------

const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1"/>
      <stop offset="100%" style="stop-color:#06b6d4"/>
    </linearGradient>
  </defs>
  <rect width="256" height="256" rx="48" fill="url(#bg)"/>
  <text x="128" y="160" font-family="Arial,sans-serif" font-size="80" font-weight="bold"
        fill="white" text-anchor="middle">iPay</text>
</svg>`;

const ICON_DATA_URI = `data:image/svg+xml;base64,${Buffer.from(ICON_SVG).toString("base64")}`;

// ---------------------------------------------------------------------------
// GET  — Return Blink metadata (ActionGetResponse)
// ---------------------------------------------------------------------------

export async function GET() {
  const response: ActionGetResponse = {
    title: "Pay with iPay",
    icon: ICON_DATA_URI,
    description:
      "Pay merchant via iPay on Solana. Your payment is processed through the iPay smart contract — " +
      `you automatically earn ${LOYALTY_POINTS_PER_SOL} loyalty tokens per SOL spent!`,
    label: "Pay",
    links: {
      actions: [
        {
          href: "/api/actions/pay?amount={amount}&merchant={merchant}",
          label: "Pay",
          parameters: [
            {
              name: "amount",
              label: "Amount (SOL)",
              type: "number",
              required: true,
            },
            {
              name: "merchant",
              label: "Merchant wallet address",
              type: "text",
              required: true,
            },
          ],
        },
      ],
    },
  };

  return NextResponse.json(response, { headers: ACTIONS_CORS_HEADERS });
}

// ---------------------------------------------------------------------------
// POST — Build & return an unsigned payment transaction via iPay program
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const body: ActionPostRequest = await request.json();

    // Validate payer account
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

    // Parse query params
    const { searchParams } = new URL(request.url);
    const amountStr = searchParams.get("amount");
    const merchantStr = searchParams.get("merchant");

    if (!amountStr || !merchantStr) {
      return NextResponse.json(
        { error: "Missing required query params: amount, merchant" },
        { status: 400, headers: ACTIONS_CORS_HEADERS },
      );
    }

    const amountSol = parseFloat(amountStr);
    if (isNaN(amountSol) || amountSol <= 0) {
      return NextResponse.json(
        { error: "amount must be a positive number" },
        { status: 400, headers: ACTIONS_CORS_HEADERS },
      );
    }

    let merchantPubkey: PublicKey;
    try {
      merchantPubkey = new PublicKey(merchantStr);
    } catch {
      return NextResponse.json(
        { error: "Invalid merchant public key" },
        { status: 400, headers: ACTIONS_CORS_HEADERS },
      );
    }

    const amountLamports = Math.round(amountSol * LAMPORTS_PER_SOL);
    const memo = `iPay payment: ${amountSol} SOL`;

    // Build transaction using the real iPay program (falls back to SystemProgram.transfer)
    const connection = new Connection(DEVNET_ENDPOINT, "confirmed");
    const transaction = await createIPayPaymentTransaction(
      payerPubkey,
      merchantPubkey,
      amountLamports,
      connection,
      memo,
    );

    const serialized = serializeTransaction(transaction);

    const loyaltyEstimate = Math.floor(amountSol * LOYALTY_POINTS_PER_SOL);

    const response: ActionPostResponse = {
      transaction: serialized,
      message: `Payment of ${amountSol} SOL to merchant processed via iPay. You earned ~${loyaltyEstimate} loyalty tokens!`,
    };

    return NextResponse.json(response, { headers: ACTIONS_CORS_HEADERS });
  } catch (error) {
    console.error("POST /api/actions/pay error:", error);
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
