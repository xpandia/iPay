'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL, ConfirmedSignatureInfo, ParsedTransactionWithMeta } from '@solana/web3.js';
import {
  CreditCard,
  TrendingUp,
  Hash,
  CalendarDays,
  Search,
  Download,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  ExternalLink,
  Loader2,
  Wallet,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  X,
} from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import { getExplorerUrl, getAddressUrl } from '@/lib/constants';

// ---------- Types ----------
interface Payment {
  id: string;
  signature: string;
  date: string;
  timestamp: number;
  payer: string;
  amount: number;
  currency: string;
  fee: number;
  loyaltyGiven: number;
  memo: string;
  status: 'completed' | 'pending' | 'failed';
}

// ---------- Demo data ----------
const demoPayments: Payment[] = [
  { id: '1', signature: '5Tz1...aKbR', date: '2026-03-22 14:32', timestamp: Date.now() - 3600000, payer: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', amount: 2.5, currency: 'SOL', fee: 0.025, loyaltyGiven: 50, memo: 'Café + pastelería', status: 'completed' },
  { id: '2', signature: '3Qw2...bLcS', date: '2026-03-22 13:15', timestamp: Date.now() - 7200000, payer: '9aE12CW87d97TXJSDpbD5jBkheTqA83TZRuJosgBbVW', amount: 15.0, currency: 'USDC', fee: 0.15, loyaltyGiven: 150, memo: 'Almuerzo especial', status: 'completed' },
  { id: '3', signature: '8Rk3...cMdT', date: '2026-03-22 11:48', timestamp: Date.now() - 10800000, payer: '3kPXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosg77K', amount: 0.8, currency: 'SOL', fee: 0.008, loyaltyGiven: 16, memo: 'Espresso doble', status: 'completed' },
  { id: '4', signature: '1Lm4...dNeU', date: '2026-03-22 10:22', timestamp: Date.now() - 14400000, payer: 'BvE12CW87d97TXJSDpbD5jBkheTqA83TZRuJosgCcXY', amount: 5.0, currency: 'SOL', fee: 0.05, loyaltyGiven: 100, memo: 'Tarjeta de regalo', status: 'pending' },
  { id: '5', signature: '9Xn5...eOfV', date: '2026-03-21 18:55', timestamp: Date.now() - 72000000, payer: 'HmKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgDdZ', amount: 42.0, currency: 'USDC', fee: 0.42, loyaltyGiven: 420, memo: 'Pedido de catering', status: 'completed' },
  { id: '6', signature: '2Yp6...fPgW', date: '2026-03-21 16:30', timestamp: Date.now() - 86400000, payer: '4nPXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgEeA', amount: 1.2, currency: 'SOL', fee: 0.012, loyaltyGiven: 24, memo: 'Smoothie tropical', status: 'failed' },
  { id: '7', signature: '6Zq7...gQhX', date: '2026-03-21 14:10', timestamp: Date.now() - 100000000, payer: 'QwE12CW87d97TXJSDpbD5jBkheTqA83TZRuJosgFfBC', amount: 8.75, currency: 'USDC', fee: 0.088, loyaltyGiven: 175, memo: 'Brunch para 2', status: 'completed' },
  { id: '8', signature: '4Ar8...hRiY', date: '2026-03-21 09:45', timestamp: Date.now() - 120000000, payer: 'RtKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgGgD', amount: 3.3, currency: 'SOL', fee: 0.033, loyaltyGiven: 66, memo: 'Combo desayuno', status: 'completed' },
  { id: '9', signature: '7Bs9...iSjZ', date: '2026-03-20 20:15', timestamp: Date.now() - 150000000, payer: '5mPXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHhE', amount: 12.5, currency: 'SOL', fee: 0.125, loyaltyGiven: 250, memo: 'Cena privada', status: 'completed' },
  { id: '10', signature: '0Ct0...jTkA', date: '2026-03-20 17:30', timestamp: Date.now() - 180000000, payer: 'XyE12CW87d97TXJSDpbD5jBkheTqA83TZRuJosgIiF', amount: 0.5, currency: 'SOL', fee: 0.005, loyaltyGiven: 10, memo: 'Agua mineral', status: 'completed' },
  { id: '11', signature: '8Du1...kUlB', date: '2026-03-20 14:00', timestamp: Date.now() - 200000000, payer: 'FgKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgJjG', amount: 25.0, currency: 'USDC', fee: 0.25, loyaltyGiven: 500, memo: 'Pedido corporativo', status: 'completed' },
  { id: '12', signature: '1Ev2...lVmC', date: '2026-03-19 19:30', timestamp: Date.now() - 250000000, payer: '8qPXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgKkH', amount: 6.8, currency: 'SOL', fee: 0.068, loyaltyGiven: 136, memo: 'Cóctel especial', status: 'completed' },
];

function truncateWallet(wallet: string): string {
  return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
}

function StatusBadge({ status }: { status: Payment['status'] }) {
  const config = {
    completed: { text: 'Completado', dot: 'bg-[#14F195]', className: 'text-[#14F195]' },
    pending: { text: 'Pendiente', dot: 'bg-yellow-400', className: 'text-yellow-400' },
    failed: { text: 'Fallido', dot: 'bg-red-400', className: 'text-red-400' },
  };
  const { text, dot, className } = config[status];
  return (
    <span className={`inline-flex items-center gap-2 text-xs font-medium ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {text}
    </span>
  );
}

const ROWS_PER_PAGE = 8;

export default function PaymentsPage() {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();

  const [payments, setPayments] = useState<Payment[]>(demoPayments);
  const [loadingOnChain, setLoadingOnChain] = useState(false);
  const [onChainLoaded, setOnChainLoaded] = useState(false);
  const [usingDemoData, setUsingDemoData] = useState(false);
  const [showDemoBanner, setShowDemoBanner] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Try fetching on-chain signatures and parse actual transaction data
  const fetchOnChainPayments = useCallback(async () => {
    if (!publicKey || !connection) return;
    setLoadingOnChain(true);
    try {
      const signatures: ConfirmedSignatureInfo[] = await connection.getSignaturesForAddress(publicKey, { limit: 50 });

      if (signatures.length === 0) {
        // No on-chain transactions found — fall back to demo data
        setUsingDemoData(true);
        setShowDemoBanner(true);
        setLoadingOnChain(false);
        return;
      }

      // Fetch parsed transactions in batches to extract real amounts
      const sigStrings = signatures.map((s) => s.signature);
      const parsedTxs = await connection.getParsedTransactions(sigStrings, {
        maxSupportedTransactionVersion: 0,
      });

      const walletAddress = publicKey.toBase58();

      const onChainPayments: Payment[] = signatures.map((sig, idx) => {
        const isErr = sig.err !== null;
        const ts = sig.blockTime ? sig.blockTime * 1000 : Date.now();
        const date = new Date(ts);
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

        // Try extracting amount and fee from the parsed transaction
        let amount = -1; // -1 means unknown
        let fee = 0;
        let payer = sig.signature.slice(0, 44); // fallback

        const parsed: ParsedTransactionWithMeta | null = parsedTxs[idx] ?? null;
        if (parsed) {
          // Transaction fee in SOL
          fee = (parsed.meta?.fee ?? 0) / LAMPORTS_PER_SOL;

          // Find SOL amount received by this wallet via pre/post balances
          const accountKeys = parsed.transaction.message.accountKeys;
          const walletIdx = accountKeys.findIndex(
            (k) => k.pubkey.toBase58() === walletAddress
          );
          if (walletIdx !== -1 && parsed.meta) {
            const pre = parsed.meta.preBalances[walletIdx] ?? 0;
            const post = parsed.meta.postBalances[walletIdx] ?? 0;
            const diff = (post - pre) / LAMPORTS_PER_SOL;
            // Only show positive incoming amounts; for outgoing we show 0
            amount = diff > 0 ? parseFloat(diff.toFixed(9)) : 0;
          }

          // Identify the fee-payer (first signer) as the payer
          if (accountKeys.length > 0) {
            payer = accountKeys[0].pubkey.toBase58();
          }
        }

        return {
          id: `onchain-${idx}`,
          signature: sig.signature,
          date: dateStr,
          timestamp: ts,
          payer,
          amount,
          currency: 'SOL',
          fee: parseFloat(fee.toFixed(9)),
          loyaltyGiven: 0,
          memo: sig.memo || 'Transacción on-chain',
          status: isErr ? ('failed' as const) : ('completed' as const),
        };
      });

      setPayments(onChainPayments);
      setOnChainLoaded(true);
    } catch (err) {
      console.error('Error al obtener transacciones on-chain:', err);
      // Show fallback banner so user knows they are seeing demo data
      setUsingDemoData(true);
      setShowDemoBanner(true);
    }
    setLoadingOnChain(false);
  }, [publicKey, connection]);

  useEffect(() => {
    if (connected && publicKey && !onChainLoaded) {
      fetchOnChainPayments();
    }
  }, [connected, publicKey, onChainLoaded, fetchOnChainPayments]);

  // Filtered payments
  const filteredPayments = useMemo(() => {
    let result = [...payments];

    if (statusFilter !== 'all') {
      result = result.filter((p) => p.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.payer.toLowerCase().includes(q) || p.memo.toLowerCase().includes(q) || p.signature.toLowerCase().includes(q)
      );
    }

    if (dateFrom) {
      const from = new Date(dateFrom).getTime();
      result = result.filter((p) => p.timestamp >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo).getTime() + 86400000;
      result = result.filter((p) => p.timestamp <= to);
    }

    return result;
  }, [payments, statusFilter, searchQuery, dateFrom, dateTo]);

  // Stats
  const stats = useMemo(() => {
    const completed = payments.filter((p) => p.status === 'completed');
    const withKnownAmount = completed.filter((p) => p.amount >= 0);
    const totalReceived = withKnownAmount.reduce((sum, p) => sum + p.amount, 0);
    const avgPayment = withKnownAmount.length > 0 ? totalReceived / withKnownAmount.length : 0;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayRevenue = completed
      .filter((p) => p.timestamp >= todayStart.getTime())
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      totalReceived: totalReceived.toFixed(2),
      numPayments: payments.length,
      avgPayment: avgPayment.toFixed(2),
      todayRevenue: todayRevenue.toFixed(2),
    };
  }, [payments]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / ROWS_PER_PAGE));
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery, dateFrom, dateTo]);

  // CSV export handler
  const handleExportCSV = useCallback(() => {
    const headers = ['Fecha', 'Pagador', 'Monto', 'Moneda', 'Comisión', 'Loyalty', 'Memo', 'Estado', 'Firma'];
    const escapeCSV = (val: string) => {
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };
    const rows = filteredPayments.map((p) => [
      escapeCSV(p.date),
      escapeCSV(p.payer),
      p.amount >= 0 ? p.amount.toString() : 'N/A',
      p.currency,
      p.fee.toString(),
      p.loyaltyGiven.toString(),
      escapeCSV(p.memo),
      p.status,
      escapeCSV(p.signature),
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ipay-pagos-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [filteredPayments]);

  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-gray-950/60 backdrop-blur-2xl border-b border-white/5">
        <div className="flex items-center justify-between px-6 lg:px-10 py-5">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Historial de Pagos
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{today}</p>
          </div>
          <WalletMultiButton className="!bg-gradient-to-r !from-[#9945FF] !to-[#14F195] hover:!opacity-90 !rounded-xl !h-11 !font-semibold !text-sm !border-0 !shadow-lg !shadow-[#9945FF]/20" />
        </div>
      </header>

      <div className="px-6 lg:px-10 py-8">
        {/* Not connected */}
        {!connected && (
          <div className="flex flex-col items-center justify-center min-h-[65vh] text-center">
            <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 mb-8 group hover:bg-white/10 transition-all duration-500">
              <Wallet className="w-16 h-16 text-[#9945FF] group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
              Conecta tu wallet para ver los pagos
            </h2>
            <p className="text-gray-500 max-w-md mb-10 leading-relaxed text-base">
              Conecta tu wallet de Solana para acceder al historial completo de pagos de tu comercio.
            </p>
            <WalletMultiButton className="!bg-gradient-to-r !from-[#9945FF] !to-[#14F195] hover:!opacity-90 !rounded-xl !h-14 !px-10 !font-bold !text-base !border-0 !shadow-xl !shadow-[#9945FF]/30" />
          </div>
        )}

        {connected && (
          <div className="space-y-8">
            {/* Demo data fallback banner */}
            {showDemoBanner && (
              <div className="flex items-center justify-between gap-3 px-5 py-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <p className="text-sm text-amber-300">
                    No se pudieron cargar los datos on-chain. Mostrando datos de ejemplo.
                  </p>
                </div>
                <button
                  onClick={() => setShowDemoBanner(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-amber-400 hover:text-white transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatsCard
                icon={TrendingUp}
                label="Total Recibido"
                value={`${stats.totalReceived} SOL`}
                iconColor="text-[#14F195]"
              />
              <StatsCard
                icon={Hash}
                label="Número de Pagos"
                value={String(stats.numPayments)}
                iconColor="text-[#9945FF]"
              />
              <StatsCard
                icon={CreditCard}
                label="Pago Promedio"
                value={`${stats.avgPayment} SOL`}
                iconColor="text-blue-400"
              />
              <StatsCard
                icon={CalendarDays}
                label="Ingresos de Hoy"
                value={`${stats.todayRevenue} SOL`}
                iconColor="text-amber-400"
              />
            </div>

            {/* Filters */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-semibold text-white">Filtros</span>
                {loadingOnChain && (
                  <span className="ml-auto flex items-center gap-2 text-xs text-gray-500">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Cargando datos on-chain...
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Buscar por dirección o memo..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#9945FF]/50 focus:border-[#9945FF]/50 transition-all duration-200 text-sm"
                  />
                </div>

                {/* Status */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#9945FF]/50 focus:border-[#9945FF]/50 transition-all duration-200 text-sm appearance-none"
                >
                  <option value="all">Todos los estados</option>
                  <option value="completed">Completado</option>
                  <option value="pending">Pendiente</option>
                  <option value="failed">Fallido</option>
                </select>

                {/* Date from */}
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#9945FF]/50 focus:border-[#9945FF]/50 transition-all duration-200 text-sm [color-scheme:dark]"
                  placeholder="Desde"
                />

                {/* Date to */}
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#9945FF]/50 focus:border-[#9945FF]/50 transition-all duration-200 text-sm [color-scheme:dark]"
                  placeholder="Hasta"
                />
              </div>
            </div>

            {/* Export + Count */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {filteredPayments.length} pago{filteredPayments.length !== 1 ? 's' : ''} encontrado{filteredPayments.length !== 1 ? 's' : ''}
                {onChainLoaded && (
                  <span className="ml-2 inline-flex items-center gap-1 text-[#14F195]">
                    <CheckCircle className="w-3 h-3" /> Datos on-chain
                  </span>
                )}
              </p>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                Exportar CSV
              </button>
            </div>

            {/* Table */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Fecha</th>
                      <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Pagador</th>
                      <th className="text-right px-6 py-3 text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Monto</th>
                      <th className="text-right px-6 py-3 text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Comisión</th>
                      <th className="text-right px-6 py-3 text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Loyalty</th>
                      <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Memo</th>
                      <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Estado</th>
                      <th className="text-center px-6 py-3 text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Tx</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPayments.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-16 text-center text-gray-500">
                          No se encontraron pagos con estos filtros.
                        </td>
                      </tr>
                    ) : (
                      paginatedPayments.map((payment) => (
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
                            {payment.amount < 0 ? 'N/A' : payment.amount > 0 ? payment.amount : '—'}{' '}
                            <span className="text-gray-500 font-normal">{payment.currency}</span>
                          </td>
                          <td className="px-6 py-4 text-right text-gray-500 whitespace-nowrap text-xs">
                            {payment.fee} {payment.currency}
                          </td>
                          <td className="px-6 py-4 text-right text-[#14F195] font-medium text-xs">
                            {payment.loyaltyGiven > 0 ? `+${payment.loyaltyGiven}` : '—'}
                          </td>
                          <td className="px-6 py-4 text-gray-400 max-w-[160px] truncate text-xs">
                            {payment.memo}
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={payment.status} />
                          </td>
                          <td className="px-6 py-4 text-center">
                            <a
                              href={getExplorerUrl(payment.signature)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
                              title="Ver en Solana Explorer"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
                  <p className="text-xs text-gray-500">
                    Página {currentPage} de {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
