'use client';

import { useState, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  X,
  Link2,
  Copy,
  Check,
  Zap,
  Share2,
  ExternalLink,
  Wallet,
  AlertCircle,
} from 'lucide-react';

interface CreateBlinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchantName?: string;
}

export default function CreateBlinkModal({
  isOpen,
  onClose,
  merchantName = 'My Store',
}: CreateBlinkModalProps) {
  const { publicKey, connected } = useWallet();

  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<'SOL' | 'USDC'>('SOL');
  const [memo, setMemo] = useState('');
  const [loyaltyOverride, setLoyaltyOverride] = useState<string>('');
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState<'link' | 'blink' | null>(null);

  const walletAddress = publicKey?.toBase58() ?? '';

  const { blinkUrl, payUrl, qrUrl } = useMemo(() => {
    if (!walletAddress || !amount) {
      return { blinkUrl: '', payUrl: '', qrUrl: '' };
    }

    const encodedMemo = encodeURIComponent(memo);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';

    const baseParams = `amount=${amount}&merchant=${walletAddress}&memo=${encodedMemo}${
      loyaltyOverride ? `&loyalty=${loyaltyOverride}` : ''
    }`;

    const blink = `${origin}/api/actions/pay?${baseParams}`;
    const pay = `${origin}/pay?${baseParams}`;
    const qr = `/api/qr?url=${encodeURIComponent(blink)}`;

    return { blinkUrl: blink, payUrl: pay, qrUrl: qr };
  }, [walletAddress, amount, memo, loyaltyOverride]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || !connected || !publicKey) return;
    setGenerated(true);
  }

  function handleCopy(url: string, type: 'link' | 'blink') {
    navigator.clipboard.writeText(url);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }

  function handleWhatsApp() {
    const message = `Pagame ${amount} ${currency} via iPay: ${payUrl}`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  }

  function handleClose() {
    setGenerated(false);
    setAmount('');
    setMemo('');
    setLoyaltyOverride('');
    setCopied(null);
    onClose();
  }

  function handleReset() {
    setGenerated(false);
    setAmount('');
    setMemo('');
    setLoyaltyOverride('');
    setCopied(null);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with heavy blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xl"
        onClick={handleClose}
      />

      {/* Modal - Glass card */}
      <div className="relative bg-gray-900/90 backdrop-blur-2xl border border-white/10 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/50">
        {/* Mac-style window dots */}
        <div className="flex items-center gap-2 px-6 pt-5 pb-0">
          <button
            onClick={handleClose}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
          />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-4 pb-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-[#9945FF]/20 to-[#14F195]/20">
              <Zap className="w-5 h-5 text-[#14F195]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Crear Blink</h2>
              <p className="text-xs text-gray-500">Genera un enlace de pago</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl hover:bg-white/5 text-gray-500 hover:text-white transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wallet warning */}
        {!connected && (
          <div className="mx-6 mt-4 flex items-center gap-3 px-4 py-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
            <span className="text-sm text-yellow-400">
              Conecta tu wallet para generar Blinks
            </span>
          </div>
        )}

        {!generated ? (
          /* Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Merchant Wallet */}
            {connected && publicKey && (
              <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
                <Wallet className="w-4 h-4 text-[#9945FF]" />
                <span className="text-xs text-gray-400 font-mono truncate">
                  {walletAddress}
                </span>
              </div>
            )}

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Monto
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#9945FF]/50 focus:border-[#9945FF]/50 transition-all duration-200 text-lg font-medium"
                required
              />
            </div>

            {/* Currency Toggle - iOS Segment Control */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Moneda
              </label>
              <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                {(['SOL', 'USDC'] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCurrency(c)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      currency === c
                        ? 'bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white shadow-lg shadow-[#9945FF]/25'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Memo */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nota
              </label>
              <input
                type="text"
                placeholder="Ej: Pedido de cafe #42"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#9945FF]/50 focus:border-[#9945FF]/50 transition-all duration-200"
              />
            </div>

            {/* Loyalty Override */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Multiplicador de Lealtad{' '}
                <span className="text-gray-600">(opcional)</span>
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="10"
                placeholder="Dejar en blanco para usar el predeterminado"
                value={loyaltyOverride}
                onChange={(e) => setLoyaltyOverride(e.target.value)}
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#9945FF]/50 focus:border-[#9945FF]/50 transition-all duration-200"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!connected}
              className="w-full py-4 bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-[#9945FF]/25 hover:shadow-[#9945FF]/40 text-base"
            >
              {connected ? 'Generar Blink' : 'Conecta tu Wallet Primero'}
            </button>
          </form>
        ) : (
          /* Generated Result */
          <div className="p-6 space-y-6">
            {/* QR Code - REAL rendered image */}
            <div className="flex flex-col items-center">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                <div className="w-48 h-48 rounded-2xl overflow-hidden bg-white flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrUrl}
                    alt="Codigo QR de Pago"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-center text-[10px] text-gray-500 font-semibold uppercase tracking-widest mt-3">
                  Escanea para Pagar
                </p>
              </div>
            </div>

            {/* Payment Link URL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5" />
                Enlace de Pago
                <span className="text-[10px] text-gray-500 font-normal">(para navegadores)</span>
              </label>
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/5">
                  <div className="w-2 h-2 rounded-full bg-red-500/60" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                  <div className="w-2 h-2 rounded-full bg-green-500/60" />
                </div>
                <div className="flex items-center gap-2 px-4 py-3">
                  <Link2 className="w-4 h-4 text-gray-600 flex-shrink-0" />
                  <span className="text-sm text-[#14F195] truncate flex-1 font-mono">
                    {payUrl}
                  </span>
                  <button
                    onClick={() => handleCopy(payUrl, 'link')}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
                    title="Copiar enlace de pago"
                  >
                    {copied === 'link' ? (
                      <Check className="w-3.5 h-3.5 text-[#14F195]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Blink URL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5" />
                Blink URL
                <span className="text-[10px] text-gray-500 font-normal">(para Phantom / wallets)</span>
              </label>
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/5">
                  <div className="w-2 h-2 rounded-full bg-red-500/60" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                  <div className="w-2 h-2 rounded-full bg-green-500/60" />
                </div>
                <div className="flex items-center gap-2 px-4 py-3">
                  <Link2 className="w-4 h-4 text-gray-600 flex-shrink-0" />
                  <span className="text-sm text-[#9945FF] truncate flex-1 font-mono">
                    {blinkUrl}
                  </span>
                  <button
                    onClick={() => handleCopy(blinkUrl, 'blink')}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
                    title="Copiar URL del Blink"
                  >
                    {copied === 'blink' ? (
                      <Check className="w-3.5 h-3.5 text-[#14F195]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Monto</span>
                <span className="text-white font-semibold">
                  {amount} {currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Comerciante</span>
                <span className="text-gray-300 font-mono text-xs truncate ml-4 max-w-[200px]">
                  {walletAddress}
                </span>
              </div>
              {memo && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Nota</span>
                  <span className="text-gray-300">{memo}</span>
                </div>
              )}
              {loyaltyOverride && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Multiplicador de Lealtad</span>
                  <span className="text-[#14F195] font-semibold">{loyaltyOverride}x</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleCopy(payUrl, 'link')}
                className="flex items-center justify-center gap-2 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-all duration-200"
              >
                {copied === 'link' ? (
                  <>
                    <Check className="w-4 h-4 text-[#14F195]" />
                    <span className="text-[#14F195]">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Enlace</span>
                  </>
                )}
              </button>
              <button
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-2 py-3.5 bg-[#14F195]/10 hover:bg-[#14F195]/20 border border-[#14F195]/20 text-[#14F195] font-medium rounded-xl transition-all duration-200"
              >
                <Share2 className="w-4 h-4" />
                <span>Compartir en WhatsApp</span>
              </button>
            </div>

            {/* Create Another */}
            <button
              onClick={handleReset}
              className="w-full py-3 text-gray-500 hover:text-white text-sm font-medium transition-colors duration-200"
            >
              Crear otro Blink
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
