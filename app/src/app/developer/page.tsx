"use client";

import { useState } from "react";

interface Endpoint {
  method: string;
  path: string;
  description: string;
  body?: string;
  response?: string;
}

interface ApiSection {
  id: string;
  title: string;
  description: string;
  endpoints: Endpoint[];
}

const API_SECTIONS: ApiSection[] = [
  {
    id: "payments",
    title: "Payments API",
    description: "Create payment intents, generate Blinks, and process payments",
    endpoints: [
      {
        method: "POST",
        path: "/api/payments",
        description: "Create a payment intent with Blink URL, checkout URL, and QR code",
        body: `{
  "merchantWallet": "YourSolanaAddress...",
  "amount": 0.5,
  "currency": "SOL",
  "memo": "Coffee order #123",
  "type": "one-time",
  "metadata": { "orderId": "123" }
}`,
        response: `{
  "success": true,
  "payment": {
    "id": "pi_abc123",
    "blinkUrl": "https://ipay.xpandia.co/api/actions/pay?...",
    "checkoutUrl": "https://ipay.xpandia.co/pay?...",
    "qrUrl": "https://ipay.xpandia.co/api/qr?...",
    "status": "pending",
    "expiresAt": "2026-03-22T..."
  }
}`,
      },
      {
        method: "GET",
        path: "/api/payments?merchantWallet=<address>",
        description: "List recent payments for a merchant",
        response: `{
  "merchantWallet": "...",
  "transactions": [
    {
      "signature": "5xK...",
      "timestamp": "2026-03-22T...",
      "status": "confirmed"
    }
  ]
}`,
      },
    ],
  },
  {
    id: "invoices",
    title: "Invoices API",
    description: "Create and manage professional invoices with automatic payment links",
    endpoints: [
      {
        method: "POST",
        path: "/api/invoices",
        description: "Create a new invoice",
        body: `{
  "merchantWallet": "YourSolanaAddress...",
  "merchantName": "My Store",
  "customerEmail": "customer@email.com",
  "items": [
    { "description": "Widget", "quantity": 2, "unitPrice": 0.1 },
    { "description": "Gadget", "quantity": 1, "unitPrice": 0.5 }
  ],
  "taxRate": 19,
  "currency": "SOL"
}`,
        response: `{
  "invoice": {
    "id": "inv_abc123",
    "invoiceNumber": "INV-2026-00042",
    "total": 0.833,
    "paymentUrl": "https://ipay.xpandia.co/pay?...",
    "blinkUrl": "https://ipay.xpandia.co/api/actions/pay?...",
    "status": "sent"
  }
}`,
      },
    ],
  },
  {
    id: "webhooks",
    title: "Webhooks API",
    description: "Receive real-time notifications when payment events occur",
    endpoints: [
      {
        method: "POST",
        path: "/api/webhooks",
        description: "Register a webhook endpoint",
        body: `{
  "merchantWallet": "YourSolanaAddress...",
  "url": "https://yourserver.com/webhooks/ipay",
  "events": [
    "payment.completed",
    "refund.processed",
    "loyalty.earned",
    "subscription.payment"
  ]
}`,
        response: `{
  "webhook": {
    "id": "wh_abc123",
    "secret": "whsec_...",
    "events": ["payment.completed", ...]
  }
}`,
      },
    ],
  },
  {
    id: "actions",
    title: "Solana Actions / Blinks",
    description: "Shareable payment links that work on any platform (WhatsApp, X, Instagram)",
    endpoints: [
      {
        method: "GET",
        path: "/api/actions/pay?merchant=<address>&amount=<amount>",
        description: "Get Blink metadata (Solana Actions spec)",
        response: `{
  "icon": "https://ipay.xpandia.co/icon.png",
  "title": "Pay Merchant",
  "description": "Pay 0.5 SOL",
  "label": "Pay Now"
}`,
      },
      {
        method: "POST",
        path: "/api/actions/pay",
        description: "Generate payment transaction for signing",
        body: `{ "account": "PayerWalletAddress..." }`,
        response: `{
  "transaction": "base64-encoded-transaction",
  "message": "Payment of 0.5 SOL processed"
}`,
      },
    ],
  },
  {
    id: "qr",
    title: "QR Code API",
    description: "Generate QR codes for payment links",
    endpoints: [
      {
        method: "GET",
        path: "/api/qr?data=<url>&size=<pixels>",
        description: "Generate a QR code PNG image",
        response: "PNG image (binary)",
      },
    ],
  },
  {
    id: "receipt",
    title: "Receipt API",
    description: "Generate verifiable payment receipts",
    endpoints: [
      {
        method: "GET",
        path: "/api/receipt?tx=<signature>",
        description: "Get receipt for a transaction",
      },
    ],
  },
];

const QUICK_START = `# iPay Quick Start — Accept payments in 5 minutes

## 1. Install (optional — you can use REST directly)
npm install @ipay/sdk  # coming soon

## 2. Create a payment
curl -X POST https://ipay.xpandia.co/api/payments \\
  -H "Content-Type: application/json" \\
  -d '{
    "merchantWallet": "YOUR_SOLANA_WALLET",
    "amount": 0.5,
    "currency": "SOL",
    "memo": "Order #123"
  }'

## 3. Share the Blink URL
# The response includes blinkUrl, checkoutUrl, and qrUrl
# Share any of these with your customer

## 4. Set up webhooks to get notified
curl -X POST https://ipay.xpandia.co/api/webhooks \\
  -H "Content-Type: application/json" \\
  -d '{
    "merchantWallet": "YOUR_SOLANA_WALLET",
    "url": "https://yourserver.com/webhooks/ipay",
    "events": ["payment.completed"]
  }'

## 5. Done! You're accepting crypto payments
# Customers pay with any Solana wallet
# You receive SOL/USDC instantly
# Customers earn iPAY loyalty tokens automatically
`;

export default function DeveloperPortal() {
  const [activeSection, setActiveSection] = useState("quickstart");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">
              iPay
            </span>
            <span className="text-sm text-gray-400 border-l border-gray-700 pl-3">
              Developer Documentation
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Home
            </a>
            <a
              href="/merchant"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Dashboard
            </a>
            <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded-full border border-green-500/20">
              v1.0
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <nav className="w-64 border-r border-gray-800 min-h-screen p-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="space-y-1">
            <button
              onClick={() => setActiveSection("quickstart")}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                activeSection === "quickstart"
                  ? "bg-green-500/10 text-green-400"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              Quick Start
            </button>

            <div className="pt-4 pb-2">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                API Reference
              </p>
            </div>

            {API_SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === section.id
                    ? "bg-green-500/10 text-green-400"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                {section.title}
              </button>
            ))}

            <div className="pt-4 pb-2">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Smart Contract
              </p>
            </div>
            <button
              onClick={() => setActiveSection("contract")}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                activeSection === "contract"
                  ? "bg-green-500/10 text-green-400"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              On-chain Instructions
            </button>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 p-8 max-w-4xl">
          {activeSection === "quickstart" && (
            <div>
              <h1 className="text-3xl font-bold mb-2">Quick Start</h1>
              <p className="text-gray-400 mb-8">
                Start accepting crypto payments in 5 minutes. No crypto knowledge required.
              </p>

              <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
                  <span className="text-xs text-gray-500">Terminal</span>
                  <button
                    onClick={() => copyToClipboard(QUICK_START, "quickstart")}
                    className="text-xs text-gray-500 hover:text-white"
                  >
                    {copiedCode === "quickstart" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="p-4 text-sm text-green-400 overflow-x-auto whitespace-pre-wrap">
                  {QUICK_START}
                </pre>
              </div>

              {/* Features grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {[
                  {
                    title: "Instant Settlement",
                    desc: "Payments settle in <1 second on Solana",
                    icon: "⚡",
                  },
                  {
                    title: "0.5% Fees",
                    desc: "85-93% cheaper than credit cards",
                    icon: "💰",
                  },
                  {
                    title: "Auto Loyalty",
                    desc: "iPAY tokens minted automatically on every payment",
                    icon: "🎁",
                  },
                  {
                    title: "Blinks",
                    desc: "Shareable payment links for WhatsApp, X, email",
                    icon: "🔗",
                  },
                  {
                    title: "Webhooks",
                    desc: "Real-time notifications on payment events",
                    icon: "🔔",
                  },
                  {
                    title: "Escrow",
                    desc: "Built-in escrow for e-commerce trust",
                    icon: "🔒",
                  },
                ].map((feature) => (
                  <div
                    key={feature.title}
                    className="bg-gray-900 rounded-xl border border-gray-800 p-4"
                  >
                    <div className="text-2xl mb-2">{feature.icon}</div>
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-400">{feature.desc}</p>
                  </div>
                ))}
              </div>

              {/* Platform info */}
              <div className="mt-8 bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h2 className="text-xl font-bold mb-4">Platform Details</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Program ID:</span>
                    <p className="text-white font-mono text-xs mt-1 break-all">
                      2DhfCmG1sUiX8ZJc4wZkq42hfbhNf6PPnhR7bXPyxEAc
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Network:</span>
                    <p className="text-white mt-1">Solana Devnet</p>
                  </div>
                  <div>
                    <span className="text-gray-500">iPAY Token Mint:</span>
                    <p className="text-white font-mono text-xs mt-1 break-all">
                      CRJqookT2EuxZtCJmG8Z69S1qUSTV2rHGh62CQowwFsZ
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Base Fee:</span>
                    <p className="text-white mt-1">0.5% (50 basis points)</p>
                  </div>
                </div>
              </div>

              {/* On-chain instructions */}
              <div className="mt-8 bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h2 className="text-xl font-bold mb-4">
                  Smart Contract Instructions (21 total)
                </h2>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    "initialize_platform",
                    "register_merchant",
                    "update_merchant",
                    "verify_merchant",
                    "process_payment",
                    "process_payment_spl",
                    "process_payment_with_tip",
                    "process_split_payment",
                    "process_refund",
                    "create_escrow_payment",
                    "release_escrow",
                    "dispute_escrow",
                    "resolve_dispute",
                    "create_subscription",
                    "execute_subscription_payment",
                    "cancel_subscription",
                    "redeem_loyalty",
                    "stake_loyalty",
                    "unstake_loyalty",
                    "pause_platform",
                    "unpause_platform",
                  ].map((ix) => (
                    <div
                      key={ix}
                      className="px-3 py-2 bg-gray-800 rounded-lg font-mono text-xs text-green-400"
                    >
                      {ix}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === "contract" && (
            <div>
              <h1 className="text-3xl font-bold mb-2">Smart Contract</h1>
              <p className="text-gray-400 mb-6">
                iPay Protocol — 21 on-chain instructions on Solana (Anchor framework)
              </p>

              <div className="space-y-6">
                {[
                  {
                    name: "Core Payments",
                    instructions: [
                      "process_payment(amount, memo) — SOL payment + auto loyalty mint",
                      "process_payment_spl(amount, memo) — SPL token (USDC) payment + loyalty",
                      "process_payment_with_tip(amount, memo, tip) — Payment with tip (fee only on base)",
                      "process_split_payment(amount, memo, split_bps) — Split between merchant + secondary",
                    ],
                  },
                  {
                    name: "Escrow (E-commerce)",
                    instructions: [
                      "create_escrow_payment(amount, memo, release_after) — Hold funds in escrow",
                      "release_escrow() — Release funds to merchant (payer or auto after deadline)",
                      "dispute_escrow() — Payer disputes the escrow",
                      "resolve_dispute(refund_payer) — Platform authority resolves dispute",
                    ],
                  },
                  {
                    name: "Subscriptions",
                    instructions: [
                      "create_subscription(amount, interval_seconds, max_cycles) — Recurring payment",
                      "execute_subscription_payment() — Process next subscription payment",
                      "cancel_subscription() — Cancel active subscription",
                    ],
                  },
                  {
                    name: "Loyalty (iPAY Token)",
                    instructions: [
                      "redeem_loyalty(loyalty_amount) — Burn iPAY for merchant discounts",
                      "stake_loyalty(amount, lock_duration) — Stake iPAY for benefits",
                      "unstake_loyalty() — Unstake after lock period",
                    ],
                  },
                  {
                    name: "Merchant Management",
                    instructions: [
                      "register_merchant(name, description, category, loyalty_multiplier)",
                      "update_merchant(name?, description?, category?, multiplier?, is_active?)",
                      "verify_merchant(tier) — Platform verifies merchant KYC level (0-3)",
                    ],
                  },
                  {
                    name: "Platform Admin",
                    instructions: [
                      "initialize_platform(loyalty_points_per_sol, platform_fee_bps, max_supply)",
                      "pause_platform() — Emergency pause all payments",
                      "unpause_platform() — Resume platform operations",
                      "process_refund(amount) — Refund a payment",
                    ],
                  },
                ].map((group) => (
                  <div
                    key={group.name}
                    className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-gray-800 bg-gray-800/50">
                      <h3 className="font-semibold text-white">{group.name}</h3>
                    </div>
                    <div className="p-4 space-y-2">
                      {group.instructions.map((ix) => (
                        <div key={ix} className="font-mono text-sm text-gray-300">
                          <span className="text-green-400">▸</span> {ix}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* API sections */}
          {API_SECTIONS.map((section) =>
            activeSection === section.id ? (
              <div key={section.id}>
                <h1 className="text-3xl font-bold mb-2">{section.title}</h1>
                <p className="text-gray-400 mb-8">{section.description}</p>

                <div className="space-y-8">
                  {section.endpoints.map((endpoint, i) => (
                    <div
                      key={i}
                      className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            endpoint.method === "GET"
                              ? "bg-blue-500/10 text-blue-400"
                              : "bg-green-500/10 text-green-400"
                          }`}
                        >
                          {endpoint.method}
                        </span>
                        <code className="text-sm text-white">{endpoint.path}</code>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-400 mb-4">
                          {endpoint.description}
                        </p>

                        {endpoint.body && (
                          <div className="mb-4">
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                              Request Body
                            </p>
                            <div className="bg-gray-800 rounded-lg p-3 relative">
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    endpoint.body!,
                                    `${section.id}-${i}-body`
                                  )
                                }
                                className="absolute top-2 right-2 text-xs text-gray-500 hover:text-white"
                              >
                                {copiedCode === `${section.id}-${i}-body`
                                  ? "Copied!"
                                  : "Copy"}
                              </button>
                              <pre className="text-sm text-green-400 overflow-x-auto">
                                {endpoint.body}
                              </pre>
                            </div>
                          </div>
                        )}

                        {endpoint.response && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                              Response
                            </p>
                            <div className="bg-gray-800 rounded-lg p-3">
                              <pre className="text-sm text-blue-400 overflow-x-auto">
                                {typeof endpoint.response === "string"
                                  ? endpoint.response
                                  : JSON.stringify(endpoint.response, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null
          )}
        </main>
      </div>
    </div>
  );
}
