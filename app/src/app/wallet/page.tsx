'use client';

import { useEffect, useState, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL, ConfirmedSignatureInfo } from '@solana/web3.js';
import { useLoyaltyBalance, usePlatform } from '@/hooks/useIPayProgram';
import { getExplorerUrl, getAddressUrl, LOYALTY_DECIMALS } from '@/lib/constants';
import LoyaltyBadge from '@/components/LoyaltyBadge';

export default function WalletPage() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const { balance: rawBalance, loading: balanceLoading, refresh: refreshBalance } = useLoyaltyBalance();
  const { platform, loading: platformLoading } = usePlatform();

  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [solLoading, setSolLoading] = useState(false);
  const [transactions, setTransactions] = useState<ConfirmedSignatureInfo[]>([]);
  const [txLoading, setTxLoading] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);

  // Human-readable iPAY balance (accounting for decimals)
  const tokenBalance = rawBalance / Math.pow(10, LOYALTY_DECIMALS);

  // Fetch SOL balance
  useEffect(() => {
    if (!publicKey) {
      setSolBalance(null);
      return;
    }
    let cancelled = false;
    setSolLoading(true);
    connection.getBalance(publicKey, 'confirmed').then((lamports) => {
      if (!cancelled) {
        setSolBalance(lamports / LAMPORTS_PER_SOL);
        setSolLoading(false);
      }
    }).catch(() => {
      if (!cancelled) {
        setSolBalance(null);
        setSolLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [connection, publicKey]);

  // Fetch recent transaction signatures
  useEffect(() => {
    if (!publicKey) {
      setTransactions([]);
      return;
    }
    let cancelled = false;
    setTxLoading(true);
    setTxError(null);
    connection
      .getSignaturesForAddress(publicKey, { limit: 15 }, 'confirmed')
      .then((sigs) => {
        if (!cancelled) {
          setTransactions(sigs);
          setTxLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setTxError('Error al cargar transacciones');
          setTxLoading(false);
          console.error('tx fetch error:', err);
        }
      });
    return () => { cancelled = true; };
  }, [connection, publicKey]);

  const truncateAddress = (addr: string) =>
    addr.length > 16 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr;

  const truncateSig = (sig: string) => `${sig.slice(0, 8)}...${sig.slice(-8)}`;

  const formatTimestamp = (ts: number | null | undefined) => {
    if (!ts) return '—';
    const d = new Date(ts * 1000);
    return d.toLocaleDateString('es', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const merchantCount = platform?.totalMerchants
    ? Number(platform.totalMerchants)
    : null;

  // Not connected state
  if (!connected || !publicKey) {
    return (
      <div className="relative min-h-screen bg-gray-950 flex flex-col items-center overflow-hidden">
        {/* Background orb */}
        <div
          className="pointer-events-none absolute top-[-10%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-15 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, #9945FF 0%, #14F195 50%, transparent 70%)',
          }}
        />

        {/* Header */}
        <header className="relative z-10 w-full py-6 flex justify-center">
          <a href="/">
            <span className="text-2xl font-bold tracking-tight solana-gradient-text">iPay</span>
          </a>
        </header>

        <main className="relative z-10 flex-1 flex items-center justify-center px-4">
          <div className="text-center space-y-8 max-w-sm">
            {/* Wallet icon */}
            <div className="mx-auto w-20 h-20 rounded-3xl glass-card flex items-center justify-center">
              <svg className="w-9 h-9 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
              </svg>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight mb-3">Mi Wallet</h1>
              <p className="text-gray-400 text-sm leading-relaxed">
                Conecta tu wallet para ver tus tokens de lealtad iPAY y tu historial de transacciones.
              </p>
            </div>

            <div className="flex justify-center">
              <WalletMultiButton className="!bg-gradient-to-r !from-[#9945FF] !to-[#14F195] hover:!opacity-90 !rounded-2xl !h-14 !px-10 !font-bold !text-base !border-0 !shadow-xl !shadow-[#9945FF]/30" />
            </div>
          </div>
        </main>

        <footer className="relative z-10 pb-6 text-center">
          <span className="text-xs text-gray-600 tracking-wide">
            Powered by <a href="https://xpandia.co" target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-400 hover:text-white transition-colors">xpandia</a>
          </span>
        </footer>
      </div>
    );
  }

  const walletAddress = publicKey.toBase58();

  // Connected state
  return (
    <div className="relative min-h-screen bg-gray-950 flex flex-col overflow-hidden">
      {/* Background orb */}
      <div
        className="pointer-events-none absolute top-[-15%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-15 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, #9945FF 0%, #14F195 50%, transparent 70%)',
        }}
      />

      {/* Header */}
      <header className="relative z-10 w-full py-6 px-6 flex justify-between items-center">
        <a href="/">
          <span className="text-2xl font-bold tracking-tight solana-gradient-text">iPay</span>
        </a>
        <a
          href={getAddressUrl(walletAddress)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 glass-card rounded-full px-3 py-1.5 hover:bg-white/[0.06] transition-colors"
        >
          <div className="w-2 h-2 rounded-full bg-[#14F195] animate-pulse" />
          <span className="text-xs text-gray-400 font-mono">
            {truncateAddress(walletAddress)}
          </span>
        </a>
      </header>

      <main className="relative z-10 flex-1 px-4 py-4 max-w-lg mx-auto w-full space-y-6">
        {/* Page title */}
        <h1 className="text-3xl font-bold text-white tracking-tight animate-fade-up">
          Mi Wallet
        </h1>

        {/* Credit card style glass card */}
        <div className="animate-fade-up delay-100 opacity-0" style={{ animationFillMode: 'forwards' }}>
          <div
            className="relative rounded-3xl overflow-hidden aspect-[1.6/1] p-6 flex flex-col justify-between"
            style={{
              background: 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)',
            }}
          >
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }} />

            {/* Top row: logo + SOL balance */}
            <div className="relative z-10 flex justify-between items-start">
              <span className="text-2xl font-bold text-white tracking-tight drop-shadow-lg">
                iPAY
              </span>
              <div className="text-right">
                {solLoading ? (
                  <div className="w-16 h-4 bg-white/20 rounded animate-pulse" />
                ) : solBalance !== null ? (
                  <span className="text-sm font-medium text-white/70">
                    {solBalance.toFixed(4)} SOL
                  </span>
                ) : null}
              </div>
            </div>

            {/* Token balance */}
            <div className="relative z-10">
              <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-1">
                Balance de Tokens
              </p>
              {balanceLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-32 h-10 bg-white/20 rounded-lg animate-pulse" />
                </div>
              ) : (
                <div className="text-4xl font-bold text-white tabular-nums tracking-tight drop-shadow-lg">
                  {tokenBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  <span className="text-lg font-medium ml-2 opacity-70">iPAY</span>
                </div>
              )}
            </div>

            {/* Bottom row: wallet address */}
            <div className="relative z-10">
              <p className="text-white/50 text-xs font-mono tracking-wider">
                {walletAddress}
              </p>
            </div>
          </div>
        </div>

        {/* SOL Balance detail card */}
        <div className="animate-fade-up delay-150 opacity-0" style={{ animationFillMode: 'forwards' }}>
          <div className="glass-card rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9945FF]/20 to-[#14F195]/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#14F195]" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10" opacity="0.2" />
                  <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor">S</text>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Balance SOL</p>
                <p className="text-xs text-gray-500">Solana</p>
              </div>
            </div>
            <div className="text-right">
              {solLoading ? (
                <div className="w-20 h-5 bg-white/10 rounded animate-pulse" />
              ) : (
                <p className="text-sm font-semibold text-white tabular-nums">
                  {solBalance !== null ? `${solBalance.toFixed(4)} SOL` : '—'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Loyalty badge */}
        {!balanceLoading && tokenBalance > 0 && (
          <div className="flex justify-center animate-fade-up delay-150 opacity-0" style={{ animationFillMode: 'forwards' }}>
            <LoyaltyBadge tokens={tokenBalance} size="lg" />
          </div>
        )}

        {/* Canjear Tokens CTA */}
        <div className="animate-fade-up delay-150 opacity-0" style={{ animationFillMode: 'forwards' }}>
          <a
            href="/wallet/redeem"
            className="block w-full py-4 rounded-2xl text-base font-semibold text-center text-white bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:opacity-90 transition-opacity shadow-lg shadow-[#9945FF]/25 active:scale-[0.98]"
          >
            Canjear Tokens
          </a>
        </div>

        {/* Valor de tus tokens */}
        <div className="space-y-3 animate-fade-up delay-200 opacity-0" style={{ animationFillMode: 'forwards' }}>
          <h2 className="text-lg font-semibold text-white tracking-tight">
            Valor de tus tokens
          </h2>
          <div className="glass-card rounded-2xl p-4 space-y-3">
            {[
              { tokens: '100 iPAY', reward: '10% descuento en tu proxima compra' },
              { tokens: '250 iPAY', reward: '20% descuento en tu proxima compra' },
              { tokens: '500 iPAY', reward: 'Envio gratis en tu siguiente pedido' },
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-3 ${i > 0 ? 'pt-3 border-t border-white/[0.06]' : ''}`}>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#9945FF]/15 to-[#14F195]/15 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#14F195" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">
                    <span className="font-semibold solana-gradient-text">{item.tokens}</span>
                    <span className="text-gray-400"> = {item.reward}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div className="space-y-3 animate-fade-up delay-200 opacity-0" style={{ animationFillMode: 'forwards' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white tracking-tight">
              Transacciones Recientes
            </h2>
            {transactions.length > 0 && (
              <a
                href={getAddressUrl(walletAddress)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#14F195] hover:text-[#14F195]/80 transition-colors"
              >
                Ver todo
              </a>
            )}
          </div>

          {txLoading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass-card rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse" />
                      <div className="space-y-2">
                        <div className="w-24 h-3 bg-white/10 rounded animate-pulse" />
                        <div className="w-16 h-2 bg-white/5 rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="w-16 h-3 bg-white/10 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : txError ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <p className="text-red-400 text-sm">{txError}</p>
              <p className="text-xs text-gray-600 mt-1">Intenta refrescar la pagina</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <p className="text-gray-500">Aun no hay transacciones</p>
              <p className="text-sm text-gray-600 mt-1">Realiza tu primer pago para comenzar a ganar tokens iPAY</p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx, i) => (
                <a
                  key={tx.signature}
                  href={getExplorerUrl(tx.signature)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block glass-card-hover rounded-2xl p-4 group"
                  style={{
                    animationDelay: `${300 + i * 80}ms`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Tx icon */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm flex-shrink-0 ${
                        tx.err ? 'bg-red-500/20' : 'solana-gradient-subtle'
                      }`}>
                        {tx.err ? (
                          <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-[#14F195]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white group-hover:text-white/90 transition-colors font-mono">
                          {truncateSig(tx.signature)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTimestamp(tx.blockTime)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        tx.err
                          ? 'bg-red-500/10 text-red-400'
                          : 'bg-[#14F195]/10 text-[#14F195]'
                      }`}>
                        {tx.err ? 'Fallida' : 'Exitosa'}
                      </span>
                      <svg className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </div>
                  </div>
                  {tx.memo && (
                    <p className="text-xs text-gray-500 mt-2 truncate pl-13">
                      {tx.memo}
                    </p>
                  )}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Accepted at merchants banner */}
        <div className="animate-fade-up delay-400 opacity-0" style={{ animationFillMode: 'forwards' }}>
          <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#14F195]/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#14F195]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {platformLoading
                  ? 'Cargando comercios...'
                  : merchantCount !== null
                    ? `Aceptado en ${merchantCount} comercio${merchantCount !== 1 ? 's' : ''}`
                    : 'Aceptado en comercios asociados'}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Canjea tokens iPAY por descuentos en tiendas asociadas</p>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3 animate-fade-up delay-300 opacity-0" style={{ animationFillMode: 'forwards' }}>
          <a
            href="/wallet/send"
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)',
              boxShadow: '0 6px 24px rgba(153, 69, 255, 0.25)',
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
            Enviar
          </a>
          <a
            href="/discover"
            className="flex items-center justify-center gap-2 btn-glass py-3.5 rounded-2xl text-sm font-semibold"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72" />
            </svg>
            Descubrir Comercios
          </a>
        </div>

        {/* Make a payment */}
        <a
          href="/pay?amount=1&merchant=CafeDemo&memo=Coffee"
          className="block w-full btn-glass py-3 rounded-2xl text-sm font-medium text-center"
        >
          Realizar un Pago
        </a>
      </main>

      {/* Footer */}
      <footer className="relative z-10 pb-6 pt-4 text-center">
        <span className="text-xs text-gray-600 tracking-wide">
          Powered by <a href="https://xpandia.co" target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-400 hover:text-white transition-colors">xpandia</a>
        </span>
      </footer>
    </div>
  );
}
