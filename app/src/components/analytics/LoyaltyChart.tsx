'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface LoyaltyDataPoint {
  date: string;
  tokens: number;
}

const mockData: LoyaltyDataPoint[] = [
  { date: 'Mar 14', tokens: 320 },
  { date: 'Mar 15', tokens: 480 },
  { date: 'Mar 16', tokens: 590 },
  { date: 'Mar 17', tokens: 410 },
  { date: 'Mar 18', tokens: 870 },
  { date: 'Mar 19', tokens: 685 },
  { date: 'Mar 20', tokens: 1001 },
];

interface LoyaltyChartProps {
  data?: LoyaltyDataPoint[];
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
        {payload[0].value.toLocaleString()} tokens
      </p>
    </div>
  );
}

export default function LoyaltyChart({ data }: LoyaltyChartProps) {
  const isDemo = !data;
  const chartData = data ?? mockData;

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Tokens de Lealtad Distribuidos</h3>
            <p className="text-sm text-gray-500 mt-1">Distribucion diaria de tokens a clientes</p>
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
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="loyaltyBarSolana" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9945FF" stopOpacity={1} />
                <stop offset="100%" stopColor="#14F195" stopOpacity={0.8} />
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
              dx={-5}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(153, 69, 255, 0.06)' }}
            />
            <Bar
              dataKey="tokens"
              fill="url(#loyaltyBarSolana)"
              radius={[8, 8, 0, 0]}
              maxBarSize={44}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
