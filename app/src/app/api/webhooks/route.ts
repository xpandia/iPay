import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { Connection, PublicKey } from "@solana/web3.js";

// ============================================================================
// iPay Webhook API — Real-time payment notifications for developers
// POST /api/webhooks — Register a webhook endpoint
// GET /api/webhooks — List registered webhooks
// ============================================================================

// In-memory store (replace with database in production)
const webhookStore = new Map<string, WebhookConfig>();

interface WebhookConfig {
  id: string;
  merchantWallet: string;
  url: string;
  events: string[];
  secret: string;
  createdAt: string;
  isActive: boolean;
}

const SUPPORTED_EVENTS = [
  "payment.completed",
  "payment.failed",
  "refund.processed",
  "loyalty.earned",
  "loyalty.redeemed",
  "subscription.created",
  "subscription.payment",
  "subscription.cancelled",
  "escrow.created",
  "escrow.released",
  "escrow.disputed",
  "merchant.registered",
  "merchant.updated",
];

function generateSecret(): string {
  return `whsec_${randomBytes(32).toString('hex')}`;
}

function generateId(): string {
  return "wh_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// POST — Register a new webhook
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { merchantWallet, url, events } = body;

    if (!merchantWallet || !url || !events) {
      return NextResponse.json(
        { error: "Missing required fields: merchantWallet, url, events" },
        { status: 400 }
      );
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid webhook URL" }, { status: 400 });
    }

    // Validate events
    const invalidEvents = events.filter((e: string) => !SUPPORTED_EVENTS.includes(e));
    if (invalidEvents.length > 0) {
      return NextResponse.json(
        { error: `Invalid events: ${invalidEvents.join(", ")}`, supported: SUPPORTED_EVENTS },
        { status: 400 }
      );
    }

    // Validate wallet address
    try {
      new PublicKey(merchantWallet);
    } catch {
      return NextResponse.json({ error: "Invalid Solana wallet address" }, { status: 400 });
    }

    const webhook: WebhookConfig = {
      id: generateId(),
      merchantWallet,
      url,
      events,
      secret: generateSecret(),
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    webhookStore.set(webhook.id, webhook);

    return NextResponse.json({
      success: true,
      webhook: {
        id: webhook.id,
        url: webhook.url,
        events: webhook.events,
        secret: webhook.secret,
        createdAt: webhook.createdAt,
      },
      message: "Webhook registered. Save your secret — it won't be shown again.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET — List webhooks for a merchant
export async function GET(request: NextRequest) {
  const merchantWallet = request.nextUrl.searchParams.get("merchantWallet");

  if (!merchantWallet) {
    return NextResponse.json(
      {
        supported_events: SUPPORTED_EVENTS,
        documentation: {
          register: "POST /api/webhooks with { merchantWallet, url, events[] }",
          list: "GET /api/webhooks?merchantWallet=<address>",
          payload_format: {
            event: "payment.completed",
            data: {
              paymentId: "string",
              payer: "string (Solana address)",
              merchant: "string (Solana address)",
              amount: "number (lamports)",
              loyaltyEarned: "number",
              memo: "string",
              timestamp: "number (unix)",
              signature: "string (tx signature)",
            },
            timestamp: "ISO 8601",
            signature: "HMAC-SHA256 of payload using webhook secret",
          },
        },
      },
      { status: 200 }
    );
  }

  const webhooks = Array.from(webhookStore.values())
    .filter((w) => w.merchantWallet === merchantWallet)
    .map((w) => ({
      id: w.id,
      url: w.url,
      events: w.events,
      isActive: w.isActive,
      createdAt: w.createdAt,
    }));

  return NextResponse.json({ webhooks });
}

// ============================================================================
// Webhook delivery function (called internally when events occur)
// ============================================================================
async function deliverWebhook(
  event: string,
  data: Record<string, any>,
  merchantWallet: string
) {
  const webhooks = Array.from(webhookStore.values()).filter(
    (w) => w.merchantWallet === merchantWallet && w.isActive && w.events.includes(event)
  );

  const deliveryPromises = webhooks.map(async (webhook) => {
    const payload = {
      event,
      data,
      timestamp: new Date().toISOString(),
      webhookId: webhook.id,
    };

    try {
      const response = await fetch(webhook.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-iPay-Event": event,
          "X-iPay-Webhook-Id": webhook.id,
          "X-iPay-Timestamp": payload.timestamp,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
      });

      return { webhookId: webhook.id, status: response.status, success: response.ok };
    } catch (error: any) {
      return { webhookId: webhook.id, status: 0, success: false, error: error.message };
    }
  });

  return Promise.allSettled(deliveryPromises);
}
