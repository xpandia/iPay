'use client';

import { useEffect, useState } from 'react';
import LoyaltyBadge from './LoyaltyBadge';
import ReceiptButton from './ReceiptButton';

interface PaymentSuccessProps {
  amount: number;
  currency: string;
  merchant: string;
  loyaltyTokens: number;
  txSignature?: string;
  onReset: () => void;
}

export default function PaymentSuccess({
  amount,
  currency,
  merchant,
  loyaltyTokens,
  txSignature,
  onReset,
}: PaymentSuccessProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 700);
    return () => clearTimeout(timer);
  }, []);

  const explorerUrl = txSignature
    ? `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`
    : '#';

  return (
    <div className="relative flex flex-col items-center text-center py-2">
      {/* CSS Confetti particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-0"
            style={{
              width: `${4 + Math.random() * 4}px`,
              height: `${4 + Math.random() * 4}px`,
              left: `${10 + Math.random() * 80}%`,
              bottom: '-10px',
              background: [
                '#9945FF', '#14F195', '#a78bfa', '#34d399',
                '#c084fc', '#4ade80', '#818cf8', '#2dd4bf',
              ][i % 8],
              animation: `confetti-rise ${2 + Math.random() * 2}s ease-out ${0.3 + Math.random() * 0.8}s forwards`,
            }}
          />
        ))}
      </div>

      {/* Animated checkmark */}
      <div className="relative w-28 h-28 mb-8">
        <svg className="w-28 h-28" viewBox="0 0 112 112">
          <circle
            cx="56"
            cy="56"
            r="50"
            fill="none"
            stroke="url(#checkGradient)"
            strokeWidth="3"
            strokeDasharray="314"
            strokeDashoffset="314"
            strokeLinecap="round"
            style={{ animation: 'draw-circle 0.8s ease-out 0.2s forwards' }}
          />
          <path
            d="M34 58 L48 72 L78 42"
            fill="none"
            stroke="#14F195"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="70"
            strokeDashoffset="70"
            style={{ animation: 'draw-check 0.4s ease-out 0.9s forwards' }}
          />
          <defs>
            <linearGradient id="checkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9945FF" />
              <stop offset="100%" stopColor="#14F195" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Success text */}
      <div
        className={`space-y-2 mb-8 transition-all duration-600 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <h2 className="text-3xl font-bold text-white tracking-tight">
          Pago Completado
        </h2>
        <p className="text-gray-400 text-base">
          <span className="text-white font-medium">{amount} {currency}</span>
          {' '}a{' '}
          <span className="text-white font-medium">{merchant}</span>
        </p>
      </div>

      {/* Loyalty tokens earned — glass card with gradient border */}
      <div
        className={`w-full mb-8 transition-all duration-600 delay-200 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="relative rounded-3xl p-[1px] overflow-hidden">
          <div className="absolute inset-0 solana-gradient opacity-30" />
          <div className="relative glass-card rounded-3xl p-6 space-y-4 !border-0">
            <p className="text-sm text-gray-400 font-medium">Ganaste</p>
            <div className="flex justify-center">
              <LoyaltyBadge tokens={loyaltyTokens} animate={true} size="lg" />
            </div>
            <p className="text-xs text-gray-500">Tokens de lealtad agregados a tu wallet</p>
          </div>
        </div>
      </div>

      {/* Explorer link */}
      {txSignature && (
        <div
          className={`mb-6 transition-all duration-600 delay-300 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Ver en Explorer
          </a>
        </div>
      )}

      {/* Receipt button */}
      {txSignature && (
        <div
          className={`w-full mb-3 transition-all duration-600 delay-400 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <ReceiptButton
            txSignature={txSignature}
            amount={amount}
            merchant={merchant}
            loyaltyEarned={loyaltyTokens}
            currency={currency}
          />
        </div>
      )}

      {/* Done button */}
      <div
        className={`w-full transition-all duration-600 delay-500 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <button
          onClick={onReset}
          className="w-full btn-glass py-4 rounded-2xl text-base font-semibold"
        >
          Listo
        </button>
      </div>

      {/* Keyframe styles for this component */}
      <style jsx>{`
        @keyframes draw-circle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes draw-check {
          to { stroke-dashoffset: 0; }
        }
        @keyframes confetti-rise {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translateY(-600px) scale(0.5) rotate(720deg);
          }
        }
      `}</style>
    </div>
  );
}
