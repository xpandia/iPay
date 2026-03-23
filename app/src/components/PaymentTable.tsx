'use client';

import { CheckCircle, Clock, XCircle, ArrowUpRight } from 'lucide-react';

interface Payment {
  id: string;
  date: string;
  payer: string;
  amount: number;
  currency: string;
  fee: number;
  loyaltyGiven: number;
  memo: string;
  status: 'completed' | 'pending' | 'failed';
}

const mockPayments: Payment[] = [
  {
    id: '1',
    date: '2026-03-20 14:32',
    payer: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    amount: 2.5,
    currency: 'SOL',
    fee: 0.025,
    loyaltyGiven: 50,
    memo: 'Coffee + pastry',
    status: 'completed',
  },
  {
    id: '2',
    date: '2026-03-20 13:15',
    payer: '9aE12CW87d97TXJSDpbD5jBkheTqA83TZRuJosgBbVW',
    amount: 15.0,
    currency: 'USDC',
    fee: 0.15,
    loyaltyGiven: 150,
    memo: 'Lunch special',
    status: 'completed',
  },
  {
    id: '3',
    date: '2026-03-20 11:48',
    payer: '3kPXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosg77K',
    amount: 0.8,
    currency: 'SOL',
    fee: 0.008,
    loyaltyGiven: 16,
    memo: 'Espresso',
    status: 'completed',
  },
  {
    id: '4',
    date: '2026-03-20 10:22',
    payer: 'BvE12CW87d97TXJSDpbD5jBkheTqA83TZRuJosgCcXY',
    amount: 5.0,
    currency: 'SOL',
    fee: 0.05,
    loyaltyGiven: 100,
    memo: 'Gift card purchase',
    status: 'pending',
  },
  {
    id: '5',
    date: '2026-03-19 18:55',
    payer: 'HmKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgDdZ',
    amount: 42.0,
    currency: 'USDC',
    fee: 0.42,
    loyaltyGiven: 420,
    memo: 'Catering order',
    status: 'completed',
  },
  {
    id: '6',
    date: '2026-03-19 16:30',
    payer: '4nPXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgEeA',
    amount: 1.2,
    currency: 'SOL',
    fee: 0.012,
    loyaltyGiven: 24,
    memo: 'Smoothie',
    status: 'failed',
  },
  {
    id: '7',
    date: '2026-03-19 14:10',
    payer: 'QwE12CW87d97TXJSDpbD5jBkheTqA83TZRuJosgFfBC',
    amount: 8.75,
    currency: 'USDC',
    fee: 0.088,
    loyaltyGiven: 175,
    memo: 'Brunch for 2',
    status: 'completed',
  },
  {
    id: '8',
    date: '2026-03-19 09:45',
    payer: 'RtKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgGgD',
    amount: 3.3,
    currency: 'SOL',
    fee: 0.033,
    loyaltyGiven: 66,
    memo: 'Breakfast combo',
    status: 'completed',
  },
];

function truncateWallet(wallet: string): string {
  return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
}

function StatusBadge({ status }: { status: Payment['status'] }) {
  const config = {
    completed: {
      icon: CheckCircle,
      text: 'Completado',
      dot: 'bg-[#14F195]',
      className: 'text-[#14F195]',
    },
    pending: {
      icon: Clock,
      text: 'Pendiente',
      dot: 'bg-yellow-400',
      className: 'text-yellow-400',
    },
    failed: {
      icon: XCircle,
      text: 'Fallido',
      dot: 'bg-red-400',
      className: 'text-red-400',
    },
  };

  const { text, dot, className } = config[status];

  return (
    <span className={`inline-flex items-center gap-2 text-xs font-medium ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {text}
    </span>
  );
}

export default function PaymentTable() {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Pagos Recientes</h3>
            <p className="text-sm text-gray-500 mt-0.5">Tus ultimas transacciones</p>
          </div>
          <button className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
            Ver Todo
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Fecha</th>
              <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Pagador</th>
              <th className="text-right px-6 py-3 text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Monto</th>
              <th className="text-right px-6 py-3 text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Comision</th>
              <th className="text-right px-6 py-3 text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Lealtad</th>
              <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Nota</th>
              <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Estado</th>
            </tr>
          </thead>
          <tbody>
            {mockPayments.map((payment) => (
              <tr
                key={payment.id}
                className="border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors duration-200"
              >
                <td className="px-6 py-4 text-gray-400 whitespace-nowrap text-xs">
                  {payment.date}
                </td>
                <td className="px-6 py-4">
                  <code className="text-[#9945FF] bg-[#9945FF]/10 px-2.5 py-1 rounded-lg text-xs font-mono tracking-wide">
                    {truncateWallet(payment.payer)}
                  </code>
                </td>
                <td className="px-6 py-4 text-right text-white font-semibold whitespace-nowrap">
                  {payment.amount} <span className="text-gray-500 font-normal">{payment.currency}</span>
                </td>
                <td className="px-6 py-4 text-right text-gray-500 whitespace-nowrap text-xs">
                  {payment.fee} {payment.currency}
                </td>
                <td className="px-6 py-4 text-right text-[#14F195] font-medium text-xs">
                  +{payment.loyaltyGiven}
                </td>
                <td className="px-6 py-4 text-gray-400 max-w-[160px] truncate text-xs">
                  {payment.memo}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={payment.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
