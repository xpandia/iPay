import { NextRequest, NextResponse } from "next/server";
import { Connection } from "@solana/web3.js";
import Anthropic from "@anthropic-ai/sdk";
import { DEVNET_ENDPOINT, LOYALTY_POINTS_PER_SOL, PLATFORM_FEE_BPS } from "@/lib/constants";
import { fetchPlatform } from "@/lib/program";

// Initialize Claude API
const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

// ─────────────────────────────────────────────────────────────────────────────
// iPay AI Chat — Real Blink integration with deployed Solana contract
// ─────────────────────────────────────────────────────────────────────────────

interface ChatAction {
  type: "blink" | "qr" | "stats";
  url?: string;
  qrUrl?: string;
  solanaActionUrl?: string;
  data?: Record<string, unknown>;
}

interface ChatResponse {
  response: string;
  action?: ChatAction;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getBaseUrl(request: NextRequest): string {
  const host = request.headers.get("host") || "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

function extractAmount(text: string): number | null {
  const patterns = [
    /\$\s?([\d,]+(?:\.\d{1,2})?)/,
    /([\d,]+(?:\.\d{1,2})?)\s*(?:USDC|usdc|SOL|sol|USD|usd)/,
    /(?:cobro|pago|payment|charge|link|qr|codigo)\s+(?:de|for|of|por)?\s*\$?\s*([\d,]+(?:\.\d{1,2})?)/i,
    /(?:de|for|of|por)\s+\$?\s*([\d,]+(?:\.\d{1,2})?)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return parseFloat(match[1].replace(/,/g, ""));
    }
  }
  return null;
}

function extractCurrency(text: string): "SOL" | "USDC" {
  if (/\bsol\b/i.test(text)) return "SOL";
  return "USDC";
}

function extractMultiplier(text: string): number | null {
  const map: Record<string, number> = {
    double: 2, doble: 2, "2x": 2,
    triple: 3, "3x": 3,
    "4x": 4, "5x": 5, "10x": 10,
  };

  const lower = text.toLowerCase();
  for (const [keyword, value] of Object.entries(map)) {
    if (lower.includes(keyword)) return value;
  }
  return null;
}

function extractMerchant(text: string): string | null {
  // Match a Solana base-58 pubkey (32–44 chars of [1-9A-HJ-NP-Za-km-z])
  const match = text.match(/\b([1-9A-HJ-NP-Za-km-z]{32,44})\b/);
  return match ? match[1] : null;
}

// ── Intent detection ─────────────────────────────────────────────────────────

type Intent = "create_blink" | "generate_qr" | "show_stats" | "greeting" | "help" | "unknown";

function detectIntent(text: string): Intent {
  const lower = text.toLowerCase();

  if (
    /(?:estad[ií]stic|stats|analytics|ventas|sales|reporte|report|resumen|summary|cuánta|cuanta|how many|dashboard)/i.test(lower)
  ) {
    return "show_stats";
  }
  if (/\bqr\b/i.test(lower)) return "generate_qr";
  if (
    /(?:crea|create|genera|generate|cobro|pago|payment|charge|link|blink|factura|invoice)/i.test(lower)
  ) {
    return "create_blink";
  }
  if (/^(hola|hi|hello|hey|buenas|buenos|qué tal|que tal|sup)/i.test(lower)) return "greeting";
  if (/(?:ayuda|help|qué puedes|que puedes|what can you)/i.test(lower)) return "help";

  return "unknown";
}

// ── Fetch on-chain platform stats ────────────────────────────────────────────

async function getOnChainStats(): Promise<Record<string, unknown> | null> {
  try {
    const connection = new Connection(DEVNET_ENDPOINT, "confirmed");
    const platform = await fetchPlatform(connection);
    if (!platform) return null;

    return {
      totalMerchants: Number(platform.merchantCount ?? 0),
      totalPayments: Number(platform.paymentCounter ?? 0),
      totalVolume: Number(platform.totalVolume ?? 0) / 1e9, // lamports → SOL
      loyaltyRate: LOYALTY_POINTS_PER_SOL,
      platformFeeBps: PLATFORM_FEE_BPS,
      isLive: true,
    };
  } catch (e) {
    console.error("[AI Chat] Failed to fetch on-chain stats:", e);
    return null;
  }
}

// ── Response builders ────────────────────────────────────────────────────────

function buildBlinkResponse(
  baseUrl: string,
  amount: number,
  currency: string,
  multiplier: number | null,
  merchantAddress: string | null
): ChatResponse {
  // Use the platform authority as default merchant if none provided
  const merchant = merchantAddress || "EPasYQuqK2ix9jnn8SVdiJc1FWWXq5SHfHt8mwt7U9ZW";

  // Build the real Solana Actions URL
  const actionParams = new URLSearchParams({
    amount: amount.toString(),
    merchant,
  });
  if (multiplier) actionParams.set("multiplier", multiplier.toString());

  const blinkPath = `/api/actions/pay?${actionParams.toString()}`;
  const blinkUrl = `${baseUrl}${blinkPath}`;
  const solanaActionUrl = `solana-action:${blinkUrl}`;
  const qrUrl = `${baseUrl}/api/qr?url=${encodeURIComponent(solanaActionUrl)}`;

  // Calculate loyalty tokens
  const loyaltyBase = amount * LOYALTY_POINTS_PER_SOL;
  const loyaltyAmount = multiplier ? loyaltyBase * multiplier / 100 : loyaltyBase / 100;
  const fee = amount * PLATFORM_FEE_BPS / 10000;

  const multiplierText = multiplier ? ` con ${multiplier}x puntos de lealtad` : "";

  return {
    response:
      `Listo! He creado un Blink de pago por **${amount} ${currency}**${multiplierText}.\n\n` +
      `El cliente recibira **${loyaltyAmount.toFixed(0)} iPAY** tokens de lealtad.\n` +
      `Fee de plataforma: ${fee.toFixed(4)} SOL (${PLATFORM_FEE_BPS / 100}%).\n\n` +
      `Comparte el enlace con tu cliente o abrelo en Phantom.`,
    action: {
      type: "blink",
      url: blinkUrl,
      qrUrl,
      solanaActionUrl,
      data: { amount, currency, multiplier, merchant, loyaltyAmount },
    },
  };
}

function buildQRResponse(
  baseUrl: string,
  amount: number,
  currency: string,
  multiplier: number | null,
  merchantAddress: string | null
): ChatResponse {
  const merchant = merchantAddress || "EPasYQuqK2ix9jnn8SVdiJc1FWWXq5SHfHt8mwt7U9ZW";

  const actionParams = new URLSearchParams({
    amount: amount.toString(),
    merchant,
  });
  if (multiplier) actionParams.set("multiplier", multiplier.toString());

  const blinkPath = `/api/actions/pay?${actionParams.toString()}`;
  const blinkUrl = `${baseUrl}${blinkPath}`;
  const solanaActionUrl = `solana-action:${blinkUrl}`;
  const qrUrl = `${baseUrl}/api/qr?url=${encodeURIComponent(solanaActionUrl)}`;

  const loyaltyBase = amount * LOYALTY_POINTS_PER_SOL;
  const loyaltyAmount = multiplier ? loyaltyBase * multiplier / 100 : loyaltyBase / 100;

  const multiplierText = multiplier ? ` con ${multiplier}x puntos de lealtad` : "";

  return {
    response:
      `Aqui tienes tu QR de cobro por **${amount} ${currency}**${multiplierText}.\n\n` +
      `El cliente ganara **${loyaltyAmount.toFixed(0)} iPAY** tokens.\n` +
      `Solo necesita escanearlo con cualquier wallet de Solana.`,
    action: {
      type: "qr",
      url: blinkUrl,
      qrUrl,
      solanaActionUrl,
      data: { amount, currency, multiplier, merchant, loyaltyAmount },
    },
  };
}

async function buildStatsResponse(): Promise<ChatResponse> {
  const onChain = await getOnChainStats();

  if (onChain && onChain.isLive) {
    return {
      response:
        `Aqui tienes los datos **en vivo** de la plataforma iPay:\n\n` +
        `- **${onChain.totalMerchants}** comercios registrados\n` +
        `- **${onChain.totalPayments}** pagos procesados\n` +
        `- **${(onChain.totalVolume as number).toFixed(4)} SOL** volumen total\n` +
        `- Tasa de lealtad: **${onChain.loyaltyRate} iPAY** por SOL\n` +
        `- Fee de plataforma: **${(onChain.platformFeeBps as number) / 100}%**\n\n` +
        `Datos leidos directamente del smart contract en Solana.`,
      action: {
        type: "stats",
        data: onChain,
      },
    };
  }

  // Fallback if on-chain fetch fails
  return {
    response:
      "No pude obtener los datos on-chain en este momento. La plataforma esta desplegada en Solana con el programa **2DhfCmG1sUiX8ZJc4wZkq42hfbhNf6PPnhR7bXPyxEAc**. Intenta de nuevo en un momento.",
    action: {
      type: "stats",
      data: {
        totalMerchants: "--",
        totalPayments: "--",
        totalVolume: "--",
        loyaltyRate: LOYALTY_POINTS_PER_SOL,
        platformFeeBps: PLATFORM_FEE_BPS,
        isLive: false,
      },
    },
  };
}

function buildGreeting(): ChatResponse {
  return {
    response:
      "Hola! Soy tu asistente iPay. Puedo ayudarte a:\n\n" +
      "- **Crear cobros** (Blinks de pago reales en Solana)\n" +
      "- **Generar codigos QR** funcionales para cobrar en persona\n" +
      "- **Ver estadisticas** on-chain de la plataforma\n\n" +
      "Los Blinks que genero son **reales** y funcionan con el smart contract desplegado. Dime, en que te ayudo?",
  };
}

function buildHelp(): ChatResponse {
  return {
    response:
      "Estos son algunos comandos que entiendo:\n\n" +
      '- "Crea un cobro de 0.5 SOL"\n' +
      '- "Create a payment link for 1 SOL"\n' +
      '- "Genera un QR de 0.1 SOL con doble puntos"\n' +
      '- "Muestra estadisticas de la plataforma"\n' +
      '- "Show my stats"\n\n' +
      "Todos los Blinks generados usan el smart contract real en Solana. Tambien puedes usar los botones rapidos de abajo.",
  };
}

function buildUnknown(): ChatResponse {
  return {
    response:
      "No estoy seguro de que necesitas. Puedo ayudarte a crear cobros, generar QR codes, o mostrarte estadisticas on-chain. Intenta algo como: \"Crea un cobro de 0.5 SOL\" o \"Ver estadisticas\".",
  };
}

// ── Rate Limiting ────────────────────────────────────────────────────────────

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 20; // requests per window
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_CLEANUP_INTERVAL = 5 * 60_000; // cleanup every 5 minutes

// Periodically purge expired entries to prevent memory leaks
let lastCleanup = Date.now();
function cleanupRateLimitMap() {
  const now = Date.now();
  if (now - lastCleanup < RATE_LIMIT_CLEANUP_INTERVAL) return;
  lastCleanup = now;
  rateLimitMap.forEach((data, key) => {
    if (now > data.resetAt) {
      rateLimitMap.delete(key);
    }
  });
}

function isRateLimited(ip: string): boolean {
  cleanupRateLimitMap();
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// ── Claude AI Integration ────────────────────────────────────────────────────

async function getClaudeResponse(
  message: string,
  baseUrl: string,
  merchantAddress: string | null
): Promise<ChatResponse | null> {
  if (!anthropic) return null;

  try {
    const onChainStats = await getOnChainStats();
    const statsContext = onChainStats
      ? `Platform stats: ${JSON.stringify(onChainStats)}`
      : "Platform stats unavailable";

    const systemPrompt = `You are iPay AI Assistant — an intelligent payment assistant for the iPay platform built on Solana.

You help merchants:
1. Create payment links (Blinks) — when a merchant asks to create a charge/payment/cobro
2. Generate QR codes — when they ask for QR
3. Show platform statistics — when they ask about stats/ventas/analytics
4. Answer questions about iPay, payments, loyalty tokens, and the platform

IMPORTANT CONTEXT:
- iPay accepts SOL, USDC, EURC, and PYUSD on Solana
- Each payment automatically mints iPAY loyalty tokens via Transfer Hooks
- Loyalty rate: ${LOYALTY_POINTS_PER_SOL} iPAY per SOL
- Platform fee: ${PLATFORM_FEE_BPS / 100}%
- Merchant address: ${merchantAddress || "not provided"}
- ${statsContext}

When the user wants to create a payment or QR, you MUST respond with a JSON block at the end of your message in this exact format:
\`\`\`json
{"action": "create_blink", "amount": <number>, "currency": "SOL", "multiplier": <number or null>}
\`\`\`
or for QR:
\`\`\`json
{"action": "generate_qr", "amount": <number>, "currency": "SOL", "multiplier": <number or null>}
\`\`\`
or for stats:
\`\`\`json
{"action": "show_stats"}
\`\`\`

If the user is just chatting, asking questions, or greeting — respond naturally WITHOUT a JSON block.

Respond in the same language the user uses (Spanish or English). Be friendly, professional, and concise.`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system: systemPrompt,
      messages: [{ role: "user", content: message }],
    });

    const aiText = response.content[0].type === "text" ? response.content[0].text : "";

    // Parse action JSON from response if present
    const jsonMatch = aiText.match(/```json\s*\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
      const actionData = JSON.parse(jsonMatch[1]);
      const cleanText = aiText.replace(/```json[\s\S]*?```/, "").trim();

      if (actionData.action === "create_blink") {
        const blinkResult = buildBlinkResponse(
          baseUrl,
          actionData.amount || 0.1,
          actionData.currency || "SOL",
          actionData.multiplier || null,
          merchantAddress
        );
        return { ...blinkResult, response: cleanText || blinkResult.response };
      }

      if (actionData.action === "generate_qr") {
        const qrResult = buildQRResponse(
          baseUrl,
          actionData.amount || 0.1,
          actionData.currency || "SOL",
          actionData.multiplier || null,
          merchantAddress
        );
        return { ...qrResult, response: cleanText || qrResult.response };
      }

      if (actionData.action === "show_stats") {
        const statsResult = await buildStatsResponse();
        return { ...statsResult, response: cleanText || statsResult.response };
      }
    }

    // No action — just a conversational response
    return { response: aiText };
  } catch (error) {
    console.error("[Claude AI] Error:", error);
    return null; // Fall back to regex parser
  }
}

// ── POST handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, merchantId: merchantAddress } = body as {
      message: string;
      merchantId?: string;
    };

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Input length validation
    if (message.length > 500) {
      return NextResponse.json(
        { error: "Message too long (max 500 characters)" },
        { status: 400 }
      );
    }

    // Rate limiting
    const clientIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429 }
      );
    }

    const baseUrl = getBaseUrl(request);
    const extractedMerchant = extractMerchant(message) || merchantAddress || null;

    // Try Claude AI first
    const claudeResult = await getClaudeResponse(message, baseUrl, extractedMerchant);
    if (claudeResult) {
      return NextResponse.json(claudeResult);
    }

    // Fallback to regex parser if Claude unavailable
    const intent = detectIntent(message);
    let result: ChatResponse;

    switch (intent) {
      case "create_blink": {
        const amount = extractAmount(message) ?? 0.1;
        const currency = extractCurrency(message);
        const multiplier = extractMultiplier(message);
        result = buildBlinkResponse(baseUrl, amount, currency, multiplier, extractedMerchant);
        break;
      }
      case "generate_qr": {
        const amount = extractAmount(message) ?? 0.1;
        const currency = extractCurrency(message);
        const multiplier = extractMultiplier(message);
        result = buildQRResponse(baseUrl, amount, currency, multiplier, extractedMerchant);
        break;
      }
      case "show_stats":
        result = await buildStatsResponse();
        break;
      case "greeting":
        result = buildGreeting();
        break;
      case "help":
        result = buildHelp();
        break;
      default:
        result = buildUnknown();
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[AI Chat] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
