import { NextRequest, NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";

// ============================================================================
// iPay Subscriptions API — Recurring payment management
// POST /api/subscriptions — Create a subscription plan
// GET /api/subscriptions — List subscription plans
// ============================================================================

const subscriptionPlans = new Map<string, SubscriptionPlan>();

interface SubscriptionPlan {
  id: string;
  merchantWallet: string;
  merchantName: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  interval: "hourly" | "daily" | "weekly" | "monthly" | "yearly";
  intervalSeconds: number;
  maxCycles: number;
  trialDays: number;
  loyaltyMultiplier: number;
  isActive: boolean;
  createdAt: string;
  subscriberCount: number;
  subscribeUrl: string;
}

const INTERVALS: Record<string, number> = {
  hourly: 3600,
  daily: 86400,
  weekly: 604800,
  monthly: 2592000, // 30 days
  yearly: 31536000,
};

// POST — Create subscription plan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      merchantWallet,
      merchantName,
      name,
      description,
      amount,
      currency,
      interval,
      maxCycles,
      trialDays,
    } = body;

    if (!merchantWallet || !name || !amount || !interval) {
      return NextResponse.json(
        {
          error: "Required: merchantWallet, name, amount, interval",
          intervals: Object.keys(INTERVALS),
        },
        { status: 400 }
      );
    }

    try {
      new PublicKey(merchantWallet);
    } catch {
      return NextResponse.json({ error: "Invalid merchantWallet" }, { status: 400 });
    }

    if (!INTERVALS[interval]) {
      return NextResponse.json(
        { error: `Invalid interval. Use: ${Object.keys(INTERVALS).join(", ")}` },
        { status: 400 }
      );
    }

    const id = `plan_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    const origin = request.nextUrl.origin;

    const plan: SubscriptionPlan = {
      id,
      merchantWallet,
      merchantName: (merchantName || "iPay Merchant").slice(0, 32),
      name: name.slice(0, 32),
      description: (description || "").slice(0, 128),
      amount,
      currency: currency || "SOL",
      interval,
      intervalSeconds: INTERVALS[interval],
      maxCycles: Math.min(1200, maxCycles || 12),
      trialDays: Math.min(90, trialDays || 0),
      loyaltyMultiplier: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      subscriberCount: 0,
      subscribeUrl: `${origin}/pay?merchant=${merchantWallet}&amount=${amount}&type=subscription&interval=${interval}&plan=${id}`,
    };

    subscriptionPlans.set(id, plan);

    return NextResponse.json({ success: true, plan });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET — List subscription plans
export async function GET(request: NextRequest) {
  const merchantWallet = request.nextUrl.searchParams.get("merchantWallet");
  const planId = request.nextUrl.searchParams.get("id");

  if (planId) {
    const plan = subscriptionPlans.get(planId);
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }
    return NextResponse.json({ plan });
  }

  if (merchantWallet) {
    const plans = Array.from(subscriptionPlans.values())
      .filter((p) => p.merchantWallet === merchantWallet)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json({ plans, count: plans.length });
  }

  return NextResponse.json({
    name: "iPay Subscriptions API",
    version: "1.0",
    endpoints: {
      "POST /api/subscriptions": {
        description: "Create a subscription plan",
        body: {
          merchantWallet: "string (required)",
          name: "string (required) — Plan name (e.g. 'Pro Monthly')",
          amount: "number (required) — Amount per cycle",
          interval: "string (required) — hourly, daily, weekly, monthly, yearly",
          merchantName: "string — Business name",
          description: "string — Plan description",
          currency: "string (default: SOL)",
          maxCycles: "number (default: 12, max: 1200)",
          trialDays: "number (default: 0, max: 90)",
        },
      },
      "GET /api/subscriptions?merchantWallet=<address>": "List plans for merchant",
      "GET /api/subscriptions?id=<planId>": "Get plan details",
    },
    supported_intervals: Object.keys(INTERVALS),
  });
}
