'use client';

import {
  DollarSign,
  Receipt,
  PiggyBank,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Info,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { useMerchant } from '@/hooks/useIPayProgram';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { LOYALTY_DECIMALS } from '@/lib/constants';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subtitle?: string;
  trend: {
    direction: 'up' | 'down';
    percentage: number;
  };
  gradient: string;
  isDemo?: boolean;
}

// Mock fallback constants
const MOCK_VOLUME = 233.2;
const MOCK_TRANSACTIONS = 96;
const MOCK_LOYALTY = 4356;
const CARD_FEE_RATE = 0.03;
const SOLANA_FEE_RATE = 0.005;
const LOYALTY_COST_PER_TOKEN = 0.001;

function MetricCard({ icon: Icon, label, value, subtitle, trend, gradient, isDemo }: MetricCardProps) {
  return (
    <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-500 group relative">
      {isDemo && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
          <Info className="w-3 h-3 text-yellow-500/70" />
          <span className="text-[10px] font-medium text-yellow-500/70 tracking-wide uppercase">Demo</span>
        </div>
      )}
      <div className="flex items-center justify-between mb-5">
        <div
          className={`p-3 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-500`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div
          className={`flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-full ${
            trend.direction === 'up'
              ? 'text-[#14F195] bg-[#14F195]/10'
              : 'text-red-400 bg-red-400/10'
          }`}
        >
          {trend.direction === 'up' ? (
            <TrendingUp className="w-3.5 h-3.5" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" />
          )}
          <span>{trend.percentage}%</span>
        </div>
      </div>
      <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
      {subtitle && <p className="text-xs text-gray-600 mt-1.5">{subtitle}</p>}
    </div>
  );
}

export default function RevenueMetrics() {
  const { merchant, loading, isRegistered } = useMerchant();

  // Determine if we have real on-chain data
  const hasRealData = isRegistered && merchant;

  // Parse real data from on-chain (BN values in lamports / token decimals)
  const totalVolume = hasRealData
    ? Number(merchant.totalVolume) / LAMPORTS_PER_SOL
    : MOCK_VOLUME;
  const totalPayments = hasRealData
    ? Number(merchant.totalPayments)
    : MOCK_TRANSACTIONS;
  const totalLoyalty = hasRealData
    ? Number(merchant.totalLoyaltyDistributed) / Math.pow(10, LOYALTY_DECIMALS)
    : MOCK_LOYALTY;

  const feesSaved = totalVolume * CARD_FEE_RATE - totalVolume * SOLANA_FEE_RATE;
  const loyaltyCost = totalLoyalty * LOYALTY_COST_PER_TOKEN;
  const loyaltyROI = loyaltyCost > 0 ? ((feesSaved - loyaltyCost) / loyaltyCost) * 100 : 0;
  const avgTransaction = totalPayments > 0 ? totalVolume / totalPayments : 0;

  const isDemo = !hasRealData;

  const metrics: MetricCardProps[] = [
    {
      icon: DollarSign,
      label: 'Ingresos Totales',
      value: `${totalVolume.toFixed(totalVolume < 1 ? 4 : 1)} SOL`,
      subtitle: `${totalPayments} transaccion${totalPayments !== 1 ? 'es' : ''}`,
      trend: { direction: 'up', percentage: isDemo ? 18.2 : totalPayments > 0 ? 100 : 0 },
      gradient: 'from-[#14F195] to-[#0BC77B]',
      isDemo,
    },
    {
      icon: Receipt,
      label: 'Transaccion Promedio',
      value: `${avgTransaction.toFixed(avgTransaction < 1 ? 4 : 2)} SOL`,
      subtitle: 'Por pago',
      trend: { direction: 'up', percentage: isDemo ? 5.4 : totalPayments > 0 ? 100 : 0 },
      gradient: 'from-[#9945FF] to-[#7B6CFF]',
      isDemo,
    },
    {
      icon: PiggyBank,
      label: 'Ahorro vs Tarjetas',
      value: `${feesSaved.toFixed(feesSaved < 1 ? 4 : 2)} SOL`,
      subtitle: `${(CARD_FEE_RATE * 100).toFixed(1)}% tarjeta vs ${(SOLANA_FEE_RATE * 100).toFixed(1)}% Solana`,
      trend: { direction: 'up', percentage: isDemo ? 22.1 : totalVolume > 0 ? 100 : 0 },
      gradient: 'from-[#9945FF] to-[#14F195]',
      isDemo,
    },
    {
      icon: Sparkles,
      label: 'ROI de Lealtad',
      value: loyaltyROI > 0 ? `${loyaltyROI.toFixed(0)}%` : '--',
      subtitle: `${totalLoyalty.toLocaleString()} tokens distribuidos`,
      trend: { direction: 'up', percentage: isDemo ? 12.8 : loyaltyROI > 0 ? 100 : 0 },
      gradient: 'from-[#14F195] to-[#9945FF]',
      isDemo,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 animate-pulse">
            <div className="h-12 w-12 rounded-2xl bg-white/[0.06] mb-5" />
            <div className="h-4 w-24 bg-white/[0.06] rounded mb-2" />
            <div className="h-7 w-32 bg-white/[0.06] rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {metrics.map((metric) => (
        <MetricCard key={metric.label} {...metric} />
      ))}
    </div>
  );
}
