'use client';

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: {
    direction: 'up' | 'down';
    percentage: number;
  };
  iconColor?: string;
}

export default function StatsCard({
  icon: Icon,
  label,
  value,
  trend,
  iconColor = 'text-purple-400',
}: StatsCardProps) {
  return (
    <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-500 ease-out cursor-default overflow-hidden">
      {/* Subtle gradient accent on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#9945FF]/5 to-[#14F195]/5 rounded-2xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          {/* Icon in gradient circle */}
          <div className="p-3 rounded-2xl bg-gradient-to-br from-[#9945FF]/20 to-[#14F195]/20 group-hover:from-[#9945FF]/30 group-hover:to-[#14F195]/30 transition-all duration-500">
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                trend.direction === 'up'
                  ? 'text-[#14F195] bg-[#14F195]/10'
                  : 'text-red-400 bg-red-400/10'
              }`}
            >
              {trend.direction === 'up' ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{trend.percentage}%</span>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-400 mb-1 font-medium">{label}</p>
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
      </div>
    </div>
  );
}
