'use client';

import { Crown } from 'lucide-react';

interface Customer {
  wallet: string;
  totalSpent: number;
  loyaltyEarned: number;
  visits: number;
}

const mockCustomers: Customer[] = [
  {
    wallet: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    totalSpent: 124.5,
    loyaltyEarned: 2490,
    visits: 32,
  },
  {
    wallet: 'QwE12CW87d97TXJSDpbD5jBkheTqA83TZRuJosgFfBC',
    totalSpent: 89.2,
    loyaltyEarned: 1784,
    visits: 21,
  },
  {
    wallet: 'BvE12CW87d97TXJSDpbD5jBkheTqA83TZRuJosgCcXY',
    totalSpent: 67.8,
    loyaltyEarned: 1356,
    visits: 18,
  },
  {
    wallet: '9aE12CW87d97TXJSDpbD5jBkheTqA83TZRuJosgBbVW',
    totalSpent: 54.3,
    loyaltyEarned: 1086,
    visits: 14,
  },
  {
    wallet: 'RtKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgGgD',
    totalSpent: 41.9,
    loyaltyEarned: 838,
    visits: 11,
  },
];

function truncateWallet(wallet: string): string {
  return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
}

function getInitials(wallet: string): string {
  return wallet.slice(0, 2).toUpperCase();
}

const rankGradients = [
  'from-yellow-400 to-amber-500',     // 1st - gold
  'from-gray-300 to-gray-400',        // 2nd - silver
  'from-amber-600 to-amber-700',      // 3rd - bronze
  'from-[#9945FF] to-[#7B6CFF]',     // 4th
  'from-[#14F195] to-[#0BC77B]',     // 5th
];

interface TopCustomersProps {
  customers?: Customer[];
}

export default function TopCustomers({ customers }: TopCustomersProps) {
  const isDemo = !customers;
  const displayCustomers = customers ?? mockCustomers;

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-yellow-400/20 to-amber-500/20">
          <Crown className="w-5 h-5 text-yellow-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white tracking-tight">Mejores Clientes</h3>
          <p className="text-sm text-gray-500 mt-0.5">Por volumen de transacciones</p>
        </div>
        {isDemo && (
          <span className="text-[10px] font-medium text-gray-600 bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-full uppercase tracking-wider">
            Datos de Muestra
          </span>
        )}
      </div>
      {isDemo && (
        <p className="text-xs text-gray-600 mb-4 -mt-2 italic">
          El ranking de clientes se llena despues de mas transacciones on-chain
        </p>
      )}

      <div className="space-y-3">
        {displayCustomers.map((customer, index) => (
          <div
            key={customer.wallet}
            className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-300"
          >
            {/* Avatar circle with gradient initials */}
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${
                rankGradients[index] || 'from-gray-600 to-gray-700'
              } flex items-center justify-center shadow-lg`}
            >
              <span className="text-xs font-bold text-white">
                {getInitials(customer.wallet)}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <code className="text-[#C77DFF] bg-[#9945FF]/10 px-2.5 py-1 rounded-lg text-xs font-mono border border-[#9945FF]/15">
                {truncateWallet(customer.wallet)}
              </code>
              <div className="flex items-center gap-4 mt-2 text-xs">
                <span className="text-gray-500">{customer.visits} visitas</span>
                <span className="text-[#14F195] font-medium">+{customer.loyaltyEarned.toLocaleString()} tokens</span>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="text-white font-bold text-base tracking-tight">{customer.totalSpent.toFixed(1)} SOL</p>
              <p className="text-[11px] text-gray-600 mt-0.5">total gastado</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
