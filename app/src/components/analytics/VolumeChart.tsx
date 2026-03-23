'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface VolumeDataPoint {
  date: string;
  volume: number;
}

const mockData: VolumeDataPoint[] = [
  { date: 'Mar 14', volume: 18.4 },
  { date: 'Mar 15', volume: 24.7 },
  { date: 'Mar 16', volume: 31.2 },
  { date: 'Mar 17', volume: 22.1 },
  { date: 'Mar 18', volume: 45.6 },
  { date: 'Mar 19', volume: 38.9 },
  { date: 'Mar 20', volume: 52.3 },
];

interface VolumeChartProps {
  data?: VolumeDataPoint[];
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-gray-900/95 backdrop-blur-xl border border-white/[0.1] rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-gray-500 text-xs font-medium mb-1">{label}</p>
      <p className="text-white font-bold text-base tracking-tight">
        {payload[0].value.toFixed(2)} SOL
      </p>
    </div>
  );
}

export default function VolumeChart({ data }: VolumeChartProps) {
  const isDemo = !data;
  const chartData = data ?? mockData;

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Volumen de Pagos</h3>
            <p className="text-sm text-gray-500 mt-1">Volumen diario de transacciones en SOL</p>
          </div>
          {isDemo && (
            <span className="text-[10px] font-medium text-gray-600 bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-full uppercase tracking-wider">
              Datos de Muestra
            </span>
          )}
        </div>
        {isDemo && (
          <p className="text-xs text-gray-600 mt-2 italic">
            Datos historicos disponibles despues de mas transacciones on-chain
          </p>
        )}
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="volumeGradientSolana" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9945FF" stopOpacity={0.35} />
                <stop offset="50%" stopColor="#14F195" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#14F195" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="0"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 500 }}
              dy={12}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 500 }}
              tickFormatter={(v: number) => `${v}`}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="volume"
              stroke="url(#volumeStrokeSolana)"
              strokeWidth={2.5}
              fill="url(#volumeGradientSolana)"
              dot={false}
              activeDot={{
                r: 6,
                fill: '#9945FF',
                stroke: '#14F195',
                strokeWidth: 2,
              }}
            />
            <defs>
              <linearGradient id="volumeStrokeSolana" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#9945FF" />
                <stop offset="100%" stopColor="#14F195" />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
