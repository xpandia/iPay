'use client';

import { useState, useEffect, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
  Zap,
  Plus,
  Copy,
  Check,
  Share2,
  QrCode,
  Trash2,
  Wallet,
  X,
  Link2,
  Calendar,
  FileText,
} from 'lucide-react';
import CreateBlinkModal from '@/components/CreateBlinkModal';
import { useMerchant } from '@/hooks/useIPayProgram';

// ---------- Types ----------
interface SavedBlink {
  id: string;
  amount: string;
  currency: 'SOL' | 'USDC';
  memo: string;
  createdAt: string;
  blinkUrl: string;
  payUrl: string;
  qrUrl: string;
  merchantAddress: string;
}

const STORAGE_KEY = 'ipay_saved_blinks';

function loadBlinks(): SavedBlink[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveBlinks(blinks: SavedBlink[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(blinks));
}

export default function BlinksPage() {
  const { connected, publicKey } = useWallet();
  const { merchant } = useMerchant();
  const [blinks, setBlinks] = useState<SavedBlink[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [qrPreview, setQrPreview] = useState<SavedBlink | null>(null);

  // Load saved blinks from localStorage
  useEffect(() => {
    setBlinks(loadBlinks());
  }, []);

  // Filter blinks for current wallet
  const myBlinks = useMemo(() => {
    if (!publicKey) return blinks;
    const addr = publicKey.toBase58();
    return blinks.filter((b) => b.merchantAddress === addr);
  }, [blinks, publicKey]);

  function handleCopy(url: string, id: string) {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  function handleWhatsApp(blink: SavedBlink) {
    const message = `Págame ${blink.amount} ${blink.currency} con iPay: ${blink.payUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  }

  function handleDelete(id: string) {
    const updated = blinks.filter((b) => b.id !== id);
    setBlinks(updated);
    saveBlinks(updated);
  }

  // Listen for modal close to save new blink
  function handleModalClose() {
    setModalOpen(false);
    // After modal closes, check if there's a new blink to save
    // We use a small timeout so the modal can set its state
  }

  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-gray-950/60 backdrop-blur-2xl border-b border-white/5">
        <div className="flex items-center justify-between px-6 lg:px-10 py-5">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Mis Blinks
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{today}</p>
          </div>
          <WalletMultiButton className="!bg-gradient-to-r !from-[#9945FF] !to-[#14F195] hover:!opacity-90 !rounded-xl !h-11 !font-semibold !text-sm !border-0 !shadow-lg !shadow-[#9945FF]/20" />
        </div>
      </header>

      <div className="px-6 lg:px-10 py-8">
        {/* Not Connected */}
        {!connected && (
          <div className="flex flex-col items-center justify-center min-h-[65vh] text-center">
            <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 mb-8 group hover:bg-white/10 transition-all duration-500">
              <Wallet className="w-16 h-16 text-[#9945FF] group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
              Conecta tu wallet para gestionar Blinks
            </h2>
            <p className="text-gray-500 max-w-md mb-10 leading-relaxed text-base">
              Crea y gestiona links de pago instantáneos para tu comercio en Solana.
            </p>
            <WalletMultiButton className="!bg-gradient-to-r !from-[#9945FF] !to-[#14F195] hover:!opacity-90 !rounded-xl !h-14 !px-10 !font-bold !text-base !border-0 !shadow-xl !shadow-[#9945FF]/30" />
          </div>
        )}

        {connected && (
          <div className="space-y-8">
            {/* Action Bar */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {myBlinks.length} blink{myBlinks.length !== 1 ? 's' : ''} creado{myBlinks.length !== 1 ? 's' : ''}
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:opacity-90 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-[#9945FF]/25 hover:shadow-[#9945FF]/40 text-sm"
              >
                <Plus className="w-4 h-4" />
                Crear Nuevo Blink
              </button>
            </div>

            {/* Empty State */}
            {myBlinks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 mb-6">
                  <Zap className="w-12 h-12 text-[#14F195]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                  No tienes Blinks todavía
                </h3>
                <p className="text-gray-500 max-w-sm mb-6">
                  Crea tu primer link de pago para empezar a recibir pagos instantáneos en Solana.
                </p>
                <button
                  onClick={() => setModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:opacity-90 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-[#9945FF]/25"
                >
                  <Zap className="w-4 h-4" />
                  Crear mi primer Blink
                </button>
              </div>
            )}

            {/* Blinks Grid */}
            {myBlinks.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {myBlinks.map((blink) => {
                  const createdDate = new Date(blink.createdAt);
                  const dateStr = createdDate.toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });
                  const timeStr = createdDate.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={blink.id}
                      className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-500"
                    >
                      {/* Hover gradient accent */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#9945FF]/5 to-[#14F195]/5 rounded-2xl pointer-events-none" />

                      <div className="relative z-10 p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-5">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-[#9945FF]/20 to-[#14F195]/20 group-hover:from-[#9945FF]/30 group-hover:to-[#14F195]/30 transition-all duration-500">
                              <Zap className="w-5 h-5 text-[#14F195]" />
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-white tracking-tight">
                                {blink.amount}{' '}
                                <span className="text-base text-gray-400 font-medium">
                                  {blink.currency}
                                </span>
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDelete(blink.id)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition-all duration-200 opacity-0 group-hover:opacity-100"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Memo */}
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                          <p className="text-sm text-gray-400 truncate">{blink.memo}</p>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-2 mb-5">
                          <Calendar className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                          <p className="text-xs text-gray-500">
                            {dateStr} a las {timeStr}
                          </p>
                        </div>

                        {/* URL preview */}
                        <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 mb-5 flex items-center gap-2">
                          <Link2 className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                          <span className="text-xs text-[#9945FF] font-mono truncate flex-1">
                            {blink.payUrl}
                          </span>
                        </div>

                        {/* QR Preview (small) */}
                        <div className="flex justify-center mb-5">
                          <div
                            className="w-24 h-24 bg-white rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200 shadow-lg shadow-black/20"
                            onClick={() => setQrPreview(blink)}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={blink.qrUrl}
                              alt="QR Code"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => handleCopy(blink.payUrl, blink.id)}
                            className="flex flex-col items-center gap-1.5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all duration-200"
                          >
                            {copied === blink.id ? (
                              <Check className="w-4 h-4 text-[#14F195]" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                            <span className="text-[10px] font-medium">
                              {copied === blink.id ? '¡Copiado!' : 'Copiar'}
                            </span>
                          </button>
                          <button
                            onClick={() => handleWhatsApp(blink)}
                            className="flex flex-col items-center gap-1.5 py-3 bg-[#14F195]/5 hover:bg-[#14F195]/10 border border-[#14F195]/20 rounded-xl text-[#14F195] transition-all duration-200"
                          >
                            <Share2 className="w-4 h-4" />
                            <span className="text-[10px] font-medium">WhatsApp</span>
                          </button>
                          <button
                            onClick={() => setQrPreview(blink)}
                            className="flex flex-col items-center gap-1.5 py-3 bg-[#9945FF]/5 hover:bg-[#9945FF]/10 border border-[#9945FF]/20 rounded-xl text-[#9945FF] transition-all duration-200"
                          >
                            <QrCode className="w-4 h-4" />
                            <span className="text-[10px] font-medium">QR</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* QR Preview Modal */}
      {qrPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            onClick={() => setQrPreview(null)}
          />
          <div className="relative bg-gray-900/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl shadow-black/50">
            <button
              onClick={() => setQrPreview(null)}
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/5 text-gray-500 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-white tracking-tight">Código QR</h3>
              <p className="text-sm text-gray-500 mt-1">
                {qrPreview.amount} {qrPreview.currency} — {qrPreview.memo}
              </p>
            </div>

            <div className="flex justify-center mb-6">
              <div className="bg-white rounded-2xl p-4 shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrPreview.qrUrl}
                  alt="QR Code"
                  className="w-56 h-56 object-contain"
                />
              </div>
            </div>

            <p className="text-center text-[10px] text-gray-600 font-semibold uppercase tracking-widest mb-6">
              Escanear para Pagar
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleCopy(qrPreview.payUrl, `qr-${qrPreview.id}`)}
                className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-all duration-200 text-sm"
              >
                {copied === `qr-${qrPreview.id}` ? (
                  <>
                    <Check className="w-4 h-4 text-[#14F195]" />
                    <span className="text-[#14F195]">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Link</span>
                  </>
                )}
              </button>
              <button
                onClick={() => handleWhatsApp(qrPreview)}
                className="flex items-center justify-center gap-2 py-3 bg-[#14F195]/10 hover:bg-[#14F195]/20 border border-[#14F195]/20 text-[#14F195] font-medium rounded-xl transition-all duration-200 text-sm"
              >
                <Share2 className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Blink Modal */}
      <CreateBlinkModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        merchantName={merchant?.name || 'Mi Comercio'}
      />
    </div>
  );
}

