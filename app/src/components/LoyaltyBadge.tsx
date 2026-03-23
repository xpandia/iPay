'use client';

import { useEffect, useState } from 'react';

interface LoyaltyBadgeProps {
  tokens: number;
  animate?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoyaltyBadge({ tokens, animate = true, size = 'md' }: LoyaltyBadgeProps) {
  const [displayCount, setDisplayCount] = useState(animate ? 0 : tokens);

  useEffect(() => {
    if (!animate) {
      setDisplayCount(tokens);
      return;
    }

    const duration = 1200;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayCount(Math.floor(eased * tokens));

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setDisplayCount(tokens);
      }
    };

    requestAnimationFrame(tick);
  }, [tokens, animate]);

  const sizeConfig = {
    sm: { wrapper: 'px-3 py-2 gap-2 text-xs', icon: 'w-5 h-5', star: 'w-2.5 h-2.5' },
    md: { wrapper: 'px-4 py-2.5 gap-2.5 text-sm', icon: 'w-6 h-6', star: 'w-3 h-3' },
    lg: { wrapper: 'px-5 py-3 gap-3 text-lg', icon: 'w-7 h-7', star: 'w-3.5 h-3.5' },
  };

  const cfg = sizeConfig[size];

  return (
    <div className="relative inline-flex rounded-2xl p-[1px] overflow-hidden">
      {/* Gradient border */}
      <div className="absolute inset-0 solana-gradient opacity-40 rounded-2xl" />

      {/* Inner content */}
      <div
        className={`
          relative inline-flex items-center rounded-[15px] font-semibold
          bg-gray-950 text-white
          ${cfg.wrapper}
          shadow-[0_0_20px_rgba(153,69,255,0.15)]
        `}
      >
        {/* Star icon */}
        <div
          className={`${cfg.icon} rounded-full solana-gradient flex items-center justify-center flex-shrink-0`}
        >
          <svg viewBox="0 0 24 24" fill="none" className={cfg.star}>
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill="white"
            />
          </svg>
        </div>

        <span className="solana-gradient-text font-bold tracking-tight">iPAY</span>

        <span className="tabular-nums text-white">
          +{displayCount.toLocaleString()}
        </span>

        {/* Shimmer effect */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>
      </div>
    </div>
  );
}
