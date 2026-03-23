'use client';

import { useState } from 'react';
import {
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Share2,
  Coins,
} from 'lucide-react';

interface BlinkPreviewProps {
  url: string;
  qrUrl?: string;
  solanaActionUrl?: string;
  amount?: number;
  currency?: string;
  multiplier?: number | null;
  loyaltyAmount?: number;
}

export default function BlinkPreview({
  url,
  qrUrl,
  solanaActionUrl,
  amount,
  currency = 'SOL',
  multiplier,
  loyaltyAmount,
}: BlinkPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Build real URLs from the Blink URL
  const actionUrl = solanaActionUrl || `solana-action:${url}`;
  const qrEndpoint = qrUrl || `/api/qr?url=${encodeURIComponent(actionUrl)}`;
  const phantomDeepLink = `https://phantom.app/ul/browse/${encodeURIComponent(url)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `Paga con iPay en Solana:\n${url}`
  )}`;

  const handleCopy = async (text: string, field: string = 'url') => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const input = document.createElement('input');
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    if (field === 'url') {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  return (
    <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 mt-3 space-y-3">
      {/* Header with metadata tags */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center shadow-md shadow-[#9945FF]/15">
          <span className="text-white text-xs font-bold">iP</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">iPay Blink</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {amount && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#9945FF]/15 text-[#C77DFF] border border-[#9945FF]/20">
                {amount} {currency}
              </span>
            )}
            {multiplier && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#14F195]/10 text-[#14F195] border border-[#14F195]/20">
                {multiplier}x puntos
              </span>
            )}
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
              live
            </span>
          </div>
        </div>
      </div>

      {/* Loyalty info */}
      {loyaltyAmount && loyaltyAmount > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 bg-[#14F195]/[0.06] border border-[#14F195]/10 rounded-xl">
          <Coins className="w-3.5 h-3.5 text-[#14F195]" />
          <span className="text-[12px] text-[#14F195] font-medium">
            Cliente recibe {loyaltyAmount.toFixed(0)} iPAY tokens
          </span>
        </div>
      )}

      {/* URL bar — shows the real Blink URL */}
      <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-xl p-3">
        <p className="text-xs text-gray-400 truncate flex-1 font-mono">
          {url}
        </p>
        <button
          onClick={() => handleCopy(url)}
          className="shrink-0 p-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] transition-all duration-200"
          aria-label="Copiar enlace"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-[#14F195]" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-gray-400" />
          )}
        </button>
      </div>

      {/* QR preview — uses real /api/qr endpoint */}
      <div className="flex items-center gap-3.5 p-3 bg-white/[0.03] border border-white/[0.05] rounded-xl">
        <a
          href={qrEndpoint}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrEndpoint}
            alt="QR Code"
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback to icon if QR generation fails
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement!.innerHTML =
                '<div class="w-full h-full flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-900"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg></div>';
            }}
          />
        </a>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-gray-500 mb-1">
            Escanea con cualquier wallet de Solana
          </p>
          <p className="text-base font-bold text-white tracking-tight">
            {amount ?? '--'} {currency}
          </p>
          <button
            onClick={() => handleCopy(actionUrl, 'action')}
            className="text-[10px] text-[#9945FF] hover:text-[#C77DFF] mt-1 transition-colors"
          >
            {copiedField === 'action' ? 'Copiado!' : 'Copiar solana-action URL'}
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleCopy(url)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium rounded-full bg-white/[0.08] text-gray-300 hover:bg-white/[0.15] transition-all duration-200"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-[#14F195]" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          {copied ? 'Copiado!' : 'Copiar'}
        </button>

        <a
          href={qrEndpoint}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium rounded-full bg-white/[0.08] text-gray-300 hover:bg-white/[0.15] transition-all duration-200"
        >
          <QrCode className="w-3.5 h-3.5" />
          QR
        </a>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium rounded-full bg-white/[0.08] text-gray-300 hover:bg-white/[0.15] transition-all duration-200"
        >
          <Share2 className="w-3.5 h-3.5" />
          WhatsApp
        </a>

        <a
          href={phantomDeepLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium rounded-full bg-gradient-to-r from-[#9945FF]/20 to-[#14F195]/20 text-white border border-white/[0.08] hover:from-[#9945FF]/30 hover:to-[#14F195]/30 transition-all duration-200"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Phantom
        </a>
      </div>
    </div>
  );
}
