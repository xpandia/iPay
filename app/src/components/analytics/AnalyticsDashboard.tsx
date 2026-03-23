'use client';

import { useState, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMerchant, usePlatform } from '@/hooks/useIPayProgram';
import { getAddressUrl } from '@/lib/constants';
import { PROGRAM_ID } from '@/lib/constants';
import VolumeChart from './VolumeChart';
import LoyaltyChart from './LoyaltyChart';
import TopCustomers from './TopCustomers';
import RevenueMetrics from './RevenueMetrics';

type DateRange = '7d' | '30d' | 'all';

const dateRangeLabels: Record<DateRange, string> = {
  '7d': '7D',
  '30d': '30D',
  all: 'Todo',
};

/** Filter time-series data by selected date range */
function filterByRange<T extends { date: string }>(
  data: T[] | undefined,
  range: DateRange,
): T[] | undefined {
  if (!data) return undefined;
  if (range === 'all') return data;

  const now = new Date();
  const days = range === '7d' ? 7 : 30;
  const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const filtered = data.filter((d) => {
    // Support both "Mar 14" short format and ISO dates
    const parsed = new Date(d.date);
    if (isNaN(parsed.getTime())) return true; // keep if unparseable
    return parsed >= cutoff;
  });

  return filtered.length > 0 ? filtered : undefined;
}

export interface AnalyticsDashboardProps {
  volumeData?: { date: string; volume: number }[];
  loyaltyData?: { date: string; tokens: number }[];
  customers?: { wallet: string; totalSpent: number; loyaltyEarned: number; visits: number }[];
}

export default function AnalyticsDashboard({
  volumeData,
  loyaltyData,
  customers,
}: AnalyticsDashboardProps) {
  const [selectedRange, setSelectedRange] = useState<DateRange>('7d');
  const { connected } = useWallet();
  const { platform, loading: platformLoading } = usePlatform();
  const { merchant, isRegistered } = useMerchant();

  const isLive = connected && platform !== null;

  // Apply date-range filter to any provided time-series data
  const filteredVolume = useMemo(
    () => filterByRange(volumeData, selectedRange),
    [volumeData, selectedRange],
  );
  const filteredLoyalty = useMemo(
    () => filterByRange(loyaltyData, selectedRange),
    [loyaltyData, selectedRange],
  );

  return (
    <div className="min-h-screen bg-gray-950 p-5 sm:p-8 lg:p-10">
      {/* Network Status Banner */}
      <div className="mb-6">
        <a
          href={getAddressUrl(PROGRAM_ID.toBase58())}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full border backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] ${
            isLive
              ? 'bg-[#14F195]/[0.06] border-[#14F195]/20 hover:border-[#14F195]/30'
              : 'bg-white/[0.04] border-white/[0.08] hover:border-white/[0.12]'
          }`}
        >
          <span className="relative flex h-2.5 w-2.5">
            {isLive && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14F195] opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isLive ? 'bg-[#14F195]' : 'bg-gray-500'
              }`}
            />
          </span>
          <span className={`text-sm font-semibold ${isLive ? 'text-[#14F195]' : 'text-gray-400'}`}>
            {isLive ? 'Conectado a la Red Solana' : 'Modo Demo'}
          </span>
          {isRegistered && merchant && (
            <span className="text-xs text-gray-500 ml-1">
              — {merchant.name}
            </span>
          )}
          {isLive && (
            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          )}
        </a>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Analiticas
          </h1>
          <p className="text-base text-gray-500 mt-1">
            {isRegistered
              ? 'Metricas de negocio on-chain en tiempo real'
              : 'Rastrea el rendimiento de tu negocio'}
          </p>
        </div>

        {/* Date range pills */}
        <div className="flex items-center bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-full p-1">
          {(Object.entries(dateRangeLabels) as [DateRange, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedRange(key)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                selectedRange === key
                  ? 'bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white shadow-lg shadow-[#9945FF]/20'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Revenue Metrics — top row stat cards */}
      <div className="mb-8">
        <RevenueMetrics />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <VolumeChart data={filteredVolume} />
        <LoyaltyChart data={filteredLoyalty} />
      </div>

      {/* Top Customers */}
      <TopCustomers customers={customers} />
    </div>
  );
}
