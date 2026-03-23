'use client';

import { useEffect, useRef } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  Star,
  ShoppingBag,
  BarChart3,
  Globe,
  Coins,
  Shield,
} from 'lucide-react';
import BlinkPreview from './BlinkPreview';

// ── Types ────────────────────────────────────────────────────────────────────

interface ChatAction {
  type: 'blink' | 'qr' | 'stats';
  url?: string;
  qrUrl?: string;
  solanaActionUrl?: string;
  data?: Record<string, unknown>;
}

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  action?: ChatAction;
  index: number;
  timestamp?: Date;
}

// ── Stats cards sub-component (supports on-chain data) ──────────────────────

function StatsCards({ data }: { data: Record<string, unknown> }) {
  const isLive = data.isLive as boolean;

  // On-chain stats layout
  const stats = [
    {
      label: 'Comercios',
      value: data.totalMerchants ?? '--',
      icon: ShoppingBag,
      gradient: 'from-[#9945FF] to-[#7B6CFF]',
    },
    {
      label: 'Pagos totales',
      value: data.totalPayments ?? '--',
      icon: BarChart3,
      gradient: 'from-[#14F195] to-[#0BC77B]',
    },
    {
      label: 'Volumen (SOL)',
      value: typeof data.totalVolume === 'number'
        ? `${(data.totalVolume as number).toFixed(4)}`
        : '--',
      icon: DollarSign,
      gradient: 'from-[#9945FF] to-[#14F195]',
    },
    {
      label: 'Tasa lealtad',
      value: data.loyaltyRate ? `${data.loyaltyRate} iPAY/SOL` : '--',
      icon: Coins,
      gradient: 'from-[#7B6CFF] to-[#14F195]',
    },
    {
      label: 'Fee plataforma',
      value: data.platformFeeBps ? `${(data.platformFeeBps as number) / 100}%` : '--',
      icon: Shield,
      gradient: 'from-[#9945FF] to-[#C77DFF]',
    },
    {
      label: 'Red',
      value: isLive ? 'Solana' : 'Offline',
      icon: Globe,
      gradient: isLive ? 'from-[#14F195] to-[#9945FF]' : 'from-gray-500 to-gray-600',
    },
  ];

  return (
    <div className="mt-3 space-y-2">
      {isLive && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/[0.08] border border-green-500/15 rounded-xl">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[11px] text-green-400 font-medium">
            Datos en vivo desde Solana
          </span>
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-3.5 flex flex-col gap-1.5"
            >
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                  <Icon className="w-3 h-3 text-white" />
                </div>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                  {stat.label}
                </span>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">{String(stat.value)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Time formatter ───────────────────────────────────────────────────────────

function formatTime(date?: Date): string {
  if (!date) return '';
  return date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
}

// ── Main component ───────────────────────────────────────────────────────────

export default function ChatMessage({
  role,
  content,
  action,
  index,
  timestamp,
}: ChatMessageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isUser = role === 'user';

  useEffect(() => {
    if (ref.current) {
      ref.current.style.opacity = '0';
      ref.current.style.transform = isUser
        ? 'translateX(24px)'
        : 'translateX(-24px)';

      requestAnimationFrame(() => {
        if (ref.current) {
          ref.current.style.transition =
            'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
          ref.current.style.opacity = '1';
          ref.current.style.transform = 'translateX(0)';
        }
      });
    }
  }, [isUser]);

  // Convert markdown-bold **text** to <strong>
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div
      ref={ref}
      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Label for AI messages */}
      {!isUser && (
        <span className="text-[11px] text-gray-600 font-medium ml-1 mb-1.5">
          iPay AI
        </span>
      )}

      {/* Message bubble */}
      <div className={`max-w-[85%] sm:max-w-[75%]`}>
        <div
          className={`px-4 py-3 text-[15px] leading-relaxed whitespace-pre-line ${
            isUser
              ? 'bg-gradient-to-br from-[#9945FF] to-[#6366F1] text-white rounded-2xl rounded-br-md shadow-lg shadow-[#9945FF]/10'
              : 'bg-white/[0.08] backdrop-blur-xl border border-white/[0.08] text-gray-200 rounded-2xl rounded-bl-md'
          }`}
        >
          {renderContent(content)}
        </div>

        {/* Blink preview — pass all real URLs */}
        {action && (action.type === 'blink' || action.type === 'qr') && action.url && (
          <BlinkPreview
            url={action.url}
            qrUrl={action.qrUrl}
            solanaActionUrl={action.solanaActionUrl}
            amount={action.data?.amount as number}
            currency={action.data?.currency as string}
            multiplier={action.data?.multiplier as number | null}
            loyaltyAmount={action.data?.loyaltyAmount as number}
          />
        )}

        {/* Stats cards — on-chain data */}
        {action && action.type === 'stats' && action.data && (
          <StatsCards data={action.data} />
        )}
      </div>

      {/* Timestamp */}
      {timestamp && (
        <span className={`text-[10px] text-gray-700 mt-1.5 ${isUser ? 'mr-1' : 'ml-1'}`}>
          {formatTime(timestamp)}
        </span>
      )}
    </div>
  );
}
