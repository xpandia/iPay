'use client';

import { useEffect, useState } from 'react';
import { getExplorerUrl } from '@/lib/constants';

interface RedeemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<string | null>;
  rewardName: string;
  ipayCost: number;
  currentBalance: number;
}

export default function RedeemModal({
  isOpen,
  onClose,
  onConfirm,
  rewardName,
  ipayCost,
  currentBalance,
}: RedeemModalProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showContent, setShowContent] = useState(false);

  const balanceAfter = currentBalance - ipayCost;
  const canAfford = currentBalance >= ipayCost;

  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setTxSignature(null);
      setErrorMsg(null);
      setTimeout(() => setShowContent(true), 50);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    setStatus('loading');
    setErrorMsg(null);
    try {
      const sig = await onConfirm();
      if (sig) {
        setTxSignature(sig);
        setStatus('success');
      } else {
        setErrorMsg('La transaccion no fue completada.');
        setStatus('error');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Error al procesar el canje.');
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          showContent ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={status === 'loading' ? undefined : onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-sm bg-gray-900/90 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-6 shadow-2xl shadow-black/50 transition-all duration-400 ${
          showContent ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
        }`}
      >
        {/* Close button */}
        {status !== 'loading' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.1] transition-colors"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* === IDLE / CONFIRM STATE === */}
        {status === 'idle' && (
          <div className="space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9945FF]/20 to-[#14F195]/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#14F195]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold text-white tracking-tight">Confirmar Canje</h3>
              <p className="text-sm text-gray-400 mt-1">Vas a canjear tus tokens por:</p>
            </div>

            {/* Reward name */}
            <div className="text-center">
              <span className="inline-block px-4 py-2 rounded-2xl bg-gradient-to-r from-[#9945FF]/10 to-[#14F195]/10 border border-white/[0.06]">
                <span className="text-lg font-bold solana-gradient-text">{rewardName}</span>
              </span>
            </div>

            {/* Details card */}
            <div className="bg-white/[0.03] rounded-2xl p-4 space-y-3 border border-white/[0.04]">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Costo</span>
                <span className="text-sm font-semibold text-white">{ipayCost.toLocaleString()} iPAY</span>
              </div>
              <div className="border-t border-white/[0.06]" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Balance actual</span>
                <span className="text-sm font-medium text-white">{currentBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })} iPAY</span>
              </div>
              <div className="border-t border-white/[0.06]" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Balance despues</span>
                <span className={`text-sm font-semibold ${canAfford ? 'text-[#14F195]' : 'text-red-400'}`}>
                  {canAfford ? balanceAfter.toLocaleString(undefined, { maximumFractionDigits: 2 }) : 'Insuficiente'} {canAfford ? 'iPAY' : ''}
                </span>
              </div>
            </div>

            {/* Confirm button */}
            <button
              onClick={handleConfirm}
              disabled={!canAfford}
              className={`w-full py-4 rounded-2xl font-semibold text-base transition-all duration-200 ${
                canAfford
                  ? 'bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white hover:opacity-90 shadow-lg shadow-[#9945FF]/25 active:scale-[0.98]'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              {canAfford ? 'Confirmar Canje' : 'Balance insuficiente'}
            </button>
          </div>
        )}

        {/* === LOADING STATE === */}
        {status === 'loading' && (
          <div className="py-8 space-y-6 text-center">
            <div className="flex justify-center">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-2 border-white/[0.06]" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#9945FF] border-r-[#14F195] animate-spin" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Procesando canje...</h3>
              <p className="text-sm text-gray-400 mt-1">Quemando tokens en la blockchain</p>
            </div>
          </div>
        )}

        {/* === SUCCESS STATE === */}
        {status === 'success' && (
          <div className="py-4 space-y-6 text-center">
            {/* Animated checkmark */}
            <div className="flex justify-center">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20" viewBox="0 0 80 80">
                  <circle
                    cx="40" cy="40" r="36"
                    fill="none"
                    stroke="url(#redeemCheckGradient)"
                    strokeWidth="2.5"
                    strokeDasharray="226"
                    strokeDashoffset="226"
                    strokeLinecap="round"
                    className="animate-[draw-circle_0.8s_ease-out_0.2s_forwards]"
                  />
                  <path
                    d="M24 42 L34 52 L56 30"
                    fill="none"
                    stroke="#14F195"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="50"
                    strokeDashoffset="50"
                    className="animate-[draw-check_0.4s_ease-out_0.9s_forwards]"
                  />
                  <defs>
                    <linearGradient id="redeemCheckGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#9945FF" />
                      <stop offset="100%" stopColor="#14F195" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Canje exitoso</h3>
              <p className="text-sm text-gray-400 mt-1">
                Has canjeado <span className="text-white font-medium">{ipayCost.toLocaleString()} iPAY</span> por{' '}
                <span className="solana-gradient-text font-medium">{rewardName}</span>
              </p>
            </div>

            {txSignature && (
              <a
                href={getExplorerUrl(txSignature)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Ver en Solana Explorer
              </a>
            )}

            <button
              onClick={onClose}
              className="w-full py-4 rounded-2xl font-semibold text-base bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white hover:opacity-90 transition-opacity shadow-lg shadow-[#9945FF]/25 active:scale-[0.98]"
            >
              Listo
            </button>
          </div>
        )}

        {/* === ERROR STATE === */}
        {status === 'error' && (
          <div className="py-4 space-y-6 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Error en el canje</h3>
              <p className="text-sm text-gray-400 mt-1">{errorMsg}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl font-medium text-sm bg-white/[0.06] text-gray-300 hover:bg-white/[0.1] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 rounded-2xl font-medium text-sm bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white hover:opacity-90 transition-opacity"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {/* Keyframe styles */}
        <style jsx>{`
          @keyframes draw-circle {
            to { stroke-dashoffset: 0; }
          }
          @keyframes draw-check {
            to { stroke-dashoffset: 0; }
          }
        `}</style>
      </div>
    </div>
  );
}
