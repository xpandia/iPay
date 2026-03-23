import { NextRequest, NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";

// ============================================================================
// iPay Payments REST API — Developer-facing payment endpoints
// GET /api/payments — List payments for a merchant
// POST /api/payments — Create a payment intent (generates Blink)
// ============================================================================

const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.devnet.solana.com";

// Rate limiting
const rateLimiter = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 100; // requests per minute
const RATE_WINDOW = 60_000;
const CLEANUP_INTERVAL = 5 * 60_000; // cleanup every 5 minutes

// Periodically purge expired entries to prevent memory leaks
let lastCleanup = Date.now();
function cleanupRateLimiter() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  rateLimiter.forEach((data, key) => {
    if (now > data.resetAt) {
      rateLimiter.delete(key);
    }
  });
}

function checkRateLimit(ip: string): boolean {
  cleanupRateLimiter();
  const now = Date.now();
  const entry = rateLimiter.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimiter.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  entry.count++;
  return entry.count <= RATE_LIMIT;
}

// POST — Create payment intent
export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { merchantWallet, amount, currency, memo, metadata, type } = body;

    // Validation
    if (!merchantWallet) {
      return NextResponse.json({ error: "merchantWallet is required" }, { status: 400 });
    }
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "amount must be positive" }, { status: 400 });
    }

    try {
      new PublicKey(merchantWallet);
    } catch {
      return NextResponse.json({ error: "Invalid merchantWallet address" }, { status: 400 });
    }

    const paymentCurrency = currency || "SOL";
    const paymentType = type || "one-time"; // one-time, escrow, subscription
    const paymentMemo = (memo || "iPay Payment").slice(0, 64);

    // Generate payment intent
    const paymentIntent = {
      id: `pi_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
      merchantWallet,
      amount,
      currency: paymentCurrency,
      memo: paymentMemo,
      type: paymentType,
      metadata: metadata || {},
      status: "pending",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min expiry
      // Generate Blink URL
      blinkUrl: `${request.nextUrl.origin}/api/actions/pay?merchant=${merchantWallet}&amount=${amount}&currency=${paymentCurrency}&memo=${encodeURIComponent(paymentMemo)}`,
      // Generate checkout URL
      checkoutUrl: `${request.nextUrl.origin}/pay?merchant=${merchantWallet}&amount=${amount}&memo=${encodeURIComponent(paymentMemo)}`,
      // QR code URL
      qrUrl: `${request.nextUrl.origin}/api/qr?data=${encodeURIComponent(`${request.nextUrl.origin}/pay?merchant=${merchantWallet}&amount=${amount}`)}`,
    };

    return NextResponse.json({
      success: true,
      payment: paymentIntent,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET — List payments / Get payment details
export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const merchantWallet = request.nextUrl.searchParams.get("merchantWallet");
  const paymentId = request.nextUrl.searchParams.get("id");

  if (!merchantWallet && !paymentId) {
    // Return API documentation
    return NextResponse.json({
      name: "iPay Payments API",
      version: "1.0",
      endpoints: {
        "POST /api/payments": {
          description: "Create a payment intent",
          body: {
            merchantWallet: "string (required) — Solana wallet address",
            amount: "number (required) — Amount in SOL or token units",
            currency: "string (optional, default: SOL) — SOL, USDC, or SPL token mint",
            memo: "string (optional) — Payment memo (max 64 chars)",
            type: "string (optional) — one-time, escrow, subscription",
            metadata: "object (optional) — Custom metadata",
          },
          response: {
            payment: {
              id: "Payment intent ID",
              blinkUrl: "Solana Blink URL for sharing",
              checkoutUrl: "Hosted checkout page URL",
              qrUrl: "QR code image URL",
              status: "pending | completed | failed | expired",
            },
          },
        },
        "GET /api/payments?merchantWallet=<address>": {
          description: "List payments for a merchant (on-chain query)",
        },
        "GET /api/payments?id=<paymentId>": {
          description: "Get payment status",
        },
      },
      authentication: "API key via X-iPay-Key header (coming soon)",
      rateLimit: `${RATE_LIMIT} requests per minute`,
    });
  }

  // Query on-chain payments for merchant
  if (merchantWallet) {
    try {
      const connection = new Connection(RPC_URL);
      const walletPubkey = new PublicKey(merchantWallet);

      // For now, return recent transaction signatures
      const signatures = await connection.getSignaturesForAddress(walletPubkey, { limit: 20 });

      const transactions = signatures.map((sig) => ({
        signature: sig.signature,
        slot: sig.slot,
        timestamp: sig.blockTime ? new Date(sig.blockTime * 1000).toISOString() : null,
        status: sig.err ? "failed" : "confirmed",
        memo: sig.memo || null,
      }));

      return NextResponse.json({
        merchantWallet,
        transactions,
        count: transactions.length,
      });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
