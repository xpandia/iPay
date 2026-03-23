import { NextRequest, NextResponse } from "next/server";

/** Escape user-supplied strings before interpolating into HTML. */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Validate that a string looks like a base58-encoded Solana transaction signature. */
function isValidTxSignature(str: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{64,88}$/.test(str);
}

/**
 * GET /api/receipt?tx={signature}&amount={amount}&merchant={name}&loyalty={tokens}&currency={SOL|USDC}
 *
 * Returns a professional HTML receipt page (Comprobante de Pago) that can be
 * printed or shared as a URL. Dark-themed, matching the iPay brand with
 * Solana gradient accents.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const txRaw = searchParams.get("tx") ?? "";
  const amountRaw = searchParams.get("amount") ?? "0";
  const merchantRaw = searchParams.get("merchant") ?? "Comercio";
  const loyaltyRaw = searchParams.get("loyalty") ?? "0";
  const currencyRaw = searchParams.get("currency") ?? "SOL";

  if (!txRaw) {
    return NextResponse.json(
      { error: "Missing required query param: tx" },
      { status: 400 }
    );
  }

  if (!isValidTxSignature(txRaw)) {
    return NextResponse.json(
      { error: "Invalid tx signature format. Expected a base58 string (64-88 chars)." },
      { status: 400 }
    );
  }

  // Escape all user inputs for safe HTML interpolation
  const tx = escapeHtml(txRaw);
  const amount = escapeHtml(amountRaw);
  const merchant = escapeHtml(merchantRaw);
  const loyalty = escapeHtml(loyaltyRaw);
  const currency = escapeHtml(currencyRaw);

  // Use the validated raw tx for URLs (already confirmed base58, no special chars)
  const explorerUrl = `https://explorer.solana.com/tx/${txRaw}?cluster=devnet`;
  const txShort = `${tx.slice(0, 8)}...${tx.slice(-8)}`;
  const now = new Date();
  const fecha = now.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Bogota",
  });

  // Commission is 0.5% of amount
  const amountNum = parseFloat(amountRaw);
  const commission = (amountNum * 0.005).toFixed(currencyRaw === "SOL" ? 6 : 2);

  // QR code via the existing /api/qr endpoint — we embed it as a data URI
  // using a small inline SVG QR placeholder that links to explorer.
  // For simplicity, we use an external QR API that returns an image.
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(explorerUrl)}&bgcolor=0a0a0f&color=ffffff&format=svg`;

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>iPay — Comprobante de Pago</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #0a0a0f;
      --card: #12121a;
      --card-border: rgba(255,255,255,0.06);
      --text: #ffffff;
      --text-muted: #9ca3af;
      --text-dim: #6b7280;
      --purple: #9945FF;
      --green: #14F195;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      padding: 24px 16px;
      -webkit-font-smoothing: antialiased;
    }

    .receipt {
      width: 100%;
      max-width: 440px;
      background: var(--card);
      border: 1px solid var(--card-border);
      border-radius: 24px;
      overflow: hidden;
      position: relative;
    }

    /* Gradient top bar */
    .receipt::before {
      content: '';
      display: block;
      height: 4px;
      background: linear-gradient(90deg, var(--purple), var(--green));
    }

    .receipt-body {
      padding: 32px 28px 28px;
    }

    /* Logo */
    .logo {
      text-align: center;
      margin-bottom: 8px;
    }
    .logo-text {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -1px;
      background: linear-gradient(135deg, var(--purple), var(--green));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .logo-sub {
      font-size: 11px;
      color: var(--text-dim);
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-top: 2px;
    }

    .title {
      text-align: center;
      font-size: 18px;
      font-weight: 600;
      color: var(--text);
      margin: 20px 0 24px;
      letter-spacing: 0.5px;
    }

    /* Divider */
    .divider {
      border: none;
      height: 1px;
      background: var(--card-border);
      margin: 20px 0;
    }

    /* Detail rows */
    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
    }
    .detail-row + .detail-row {
      border-top: 1px solid rgba(255,255,255,0.03);
    }
    .detail-label {
      font-size: 13px;
      color: var(--text-muted);
      font-weight: 400;
    }
    .detail-value {
      font-size: 14px;
      color: var(--text);
      font-weight: 500;
      text-align: right;
      max-width: 60%;
      word-break: break-all;
    }

    /* Amount highlight */
    .amount-section {
      text-align: center;
      padding: 24px 0;
    }
    .amount-value {
      font-size: 42px;
      font-weight: 700;
      letter-spacing: -1.5px;
      background: linear-gradient(135deg, var(--purple), var(--green));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .amount-currency {
      font-size: 18px;
      font-weight: 500;
      color: var(--text-muted);
      margin-left: 6px;
    }

    /* Loyalty badge */
    .loyalty-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(20, 241, 149, 0.1);
      border: 1px solid rgba(20, 241, 149, 0.2);
      border-radius: 12px;
      padding: 8px 16px;
      margin: 8px 0;
    }
    .loyalty-badge span {
      font-size: 14px;
      font-weight: 600;
      color: var(--green);
    }

    /* QR section */
    .qr-section {
      text-align: center;
      margin: 24px 0 8px;
    }
    .qr-section img {
      width: 140px;
      height: 140px;
      border-radius: 12px;
      border: 1px solid var(--card-border);
    }
    .qr-label {
      font-size: 11px;
      color: var(--text-dim);
      margin-top: 8px;
    }

    /* Transaction link */
    .tx-link {
      display: block;
      text-align: center;
      color: var(--purple);
      text-decoration: none;
      font-size: 12px;
      font-weight: 500;
      margin-top: 12px;
      transition: opacity 0.2s;
    }
    .tx-link:hover { opacity: 0.8; }

    /* Signature display */
    .tx-sig {
      text-align: center;
      font-family: 'SF Mono', 'Fira Code', monospace;
      font-size: 11px;
      color: var(--text-dim);
      word-break: break-all;
      padding: 10px 16px;
      background: rgba(255,255,255,0.02);
      border-radius: 10px;
      margin: 12px 0;
      line-height: 1.5;
    }

    /* Footer */
    .footer {
      text-align: center;
      padding: 20px 0 4px;
    }
    .footer-text {
      font-size: 13px;
      color: var(--text-muted);
      font-weight: 400;
    }
    .footer-powered {
      font-size: 11px;
      color: var(--text-dim);
      margin-top: 8px;
    }

    /* Status badge */
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(20, 241, 149, 0.08);
      border: 1px solid rgba(20, 241, 149, 0.15);
      border-radius: 100px;
      padding: 6px 14px;
      margin-bottom: 4px;
    }
    .status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--green);
    }
    .status-text {
      font-size: 12px;
      font-weight: 600;
      color: var(--green);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Print styles */
    @media print {
      body {
        background: #fff;
        color: #111;
        padding: 0;
      }
      .receipt {
        border: 1px solid #e5e7eb;
        background: #fff;
        box-shadow: none;
        max-width: 100%;
        border-radius: 0;
      }
      .receipt::before {
        height: 3px;
      }
      .logo-text {
        -webkit-text-fill-color: #9945FF;
        color: #9945FF;
      }
      .title, .detail-value, .detail-label, .footer-text {
        color: #111 !important;
      }
      .detail-label { color: #666 !important; }
      .amount-value {
        -webkit-text-fill-color: #9945FF;
      }
      .tx-sig {
        background: #f3f4f6;
        color: #333;
      }
      .divider { background: #e5e7eb; }
      .detail-row + .detail-row { border-color: #f3f4f6; }
      .receipt-body { padding: 24px 20px 20px; }
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="receipt-body">
      <!-- Logo -->
      <div class="logo">
        <div class="logo-text">iPay</div>
        <div class="logo-sub">Pagos Inteligentes</div>
      </div>

      <hr class="divider" />

      <!-- Status -->
      <div style="text-align:center; margin-bottom: 4px;">
        <div class="status-badge">
          <div class="status-dot"></div>
          <div class="status-text">Confirmado</div>
        </div>
      </div>

      <!-- Title -->
      <div class="title">Comprobante de Pago</div>

      <!-- Amount -->
      <div class="amount-section">
        <span class="amount-value">${amount}</span>
        <span class="amount-currency">${currency}</span>
      </div>

      <hr class="divider" />

      <!-- Details -->
      <div class="detail-row">
        <span class="detail-label">Fecha</span>
        <span class="detail-value">${fecha}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Comercio</span>
        <span class="detail-value">${merchant}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Monto</span>
        <span class="detail-value">${amount} ${currency}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Comisi&oacute;n iPay (0.5%)</span>
        <span class="detail-value">${commission} ${currency}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Red</span>
        <span class="detail-value">Solana (Devnet)</span>
      </div>

      <hr class="divider" />

      <!-- Loyalty -->
      <div style="text-align:center;">
        <div class="detail-label" style="margin-bottom:8px;">Loyalty Tokens Ganados</div>
        <div class="loyalty-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#14F195" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <span>+${loyalty} iPay Tokens</span>
        </div>
      </div>

      <hr class="divider" />

      <!-- Transaction signature -->
      <div class="detail-label" style="text-align:center; margin-bottom:8px;">Firma de Transacci&oacute;n</div>
      <div class="tx-sig">${tx}</div>

      <!-- QR Code -->
      <div class="qr-section">
        <img src="${qrUrl}" alt="QR Code - Solana Explorer" />
        <div class="qr-label">Escanea para verificar en Solana Explorer</div>
      </div>

      <!-- Explorer link -->
      <a href="${explorerUrl}" target="_blank" rel="noopener noreferrer" class="tx-link">
        Ver en Solana Explorer &rarr;
      </a>

      <hr class="divider" />

      <!-- Footer -->
      <div class="footer">
        <div class="footer-text">Gracias por pagar con iPay</div>
        <div class="footer-powered">Powered by <a href="https://xpandia.co" style="color:#9945FF;text-decoration:none;font-weight:600">xpandia</a> &bull; ${fecha}</div>
      </div>
    </div>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
