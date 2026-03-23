'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { useProcessPayment, usePlatform } from '@/hooks/useIPayProgram';
import { fetchMerchant } from '@/lib/program';
import { useConnection } from '@solana/wallet-adapter-react';
import LoyaltyBadge from '@/components/LoyaltyBadge';
import PaymentSuccess from '@/components/PaymentSuccess';

const DEFAULT_MERCHANT = new PublicKey('EPasYQuqK2ix9jnn8SVdiJc1FWWXq5SHfHt8mwt7U9ZW');
const LAMPORTS_PER_SOL = 1_000_000_000;
const LOYALTY_RATE = 1000; // 1000 iPAY per SOL

type PaymentState = 'idle' | 'connecting' | 'confirming' | 'success' | 'error';

function isValidPublicKey(value: string): boolean {
  try {
    new PublicKey(value);
    return true;
  } catch {
    return false;
  }
}

function PayContent() {
  const searchParams = useSearchParams();
  const { connection } = useConnection();
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const { pay, loading: payLoading, error: payError } = useProcessPayment();
  const { platform, loading: platformLoading } = usePlatform();

  // URL params
  const amount = parseFloat(searchParams.get('amount') || '1');
  const merchantParam = searchParams.get('merchant') || '';
  const memo = searchParams.get('memo') || 'Payment';
  const currency = searchParams.get('currency') || 'SOL';

  // Resolve merchant pubkey: if valid pubkey use it, otherwise default
  const merchantPubkey = useMemo(() => {
    if (merchantParam && isValidPublicKey(merchantParam)) {
      return new PublicKey(merchantParam);
    }
    return DEFAULT_MERCHANT;
  }, [merchantParam]);

  // Merchant display name — use param if not a pubkey, otherwise fetch on-chain name
  const [merchantName, setMerchantName] = useState<string>(
    merchantParam && !isValidPublicKey(merchantParam) ? merchantParam : 'Merchant'
  );
  const [merchantMultiplier, setMerchantMultiplier] = useState<number>(100); // basis points, 100 = 1x

  // Fetch merchant on-chain data for name + multiplier
  useEffect(() => {
    async function loadMerchant() {
      try {
        const data = await fetchMerchant(connection, merchantPubkey);
        if (data) {
          if (data.name) setMerchantName(data.name);
          if (data.loyaltyMultiplier) setMerchantMultiplier(Number(data.loyaltyMultiplier));
        }
      } catch {
        // Merchant may not be registered yet — use defaults
      }
    }
    loadMerchant();
  }, [connection, merchantPubkey]);

  // Loyalty reward calculation: amount_in_SOL * 1000 * merchant_multiplier / 100
  const loyaltyReward = Math.round(amount * LOYALTY_RATE * merchantMultiplier / 100);

  const [state, setState] = useState<PaymentState>('idle');
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync payError from hook
  useEffect(() => {
    if (payError) {
      setErrorMessage(payError);
      setState('error');
    }
  }, [payError]);

  const handleConnectWallet = useCallback(() => {
    setState('connecting');
    setVisible(true);
  }, [setVisible]);

  // Watch for wallet connection after modal
  useEffect(() => {
    if (connected && state === 'connecting') {
      setState('idle');
    }
  }, [connected, state]);

  const handlePay = useCallback(async () => {
    if (!connected) {
      handleConnectWallet();
      return;
    }

    if (!platform) {
      setErrorMessage('Datos de la plataforma aun no cargados. Por favor espera...');
      setState('error');
      return;
    }

    setState('confirming');
    setErrorMessage(null);

    try {
      const amountLamports = new BN(Math.round(amount * LAMPORTS_PER_SOL));
      const signature = await pay(merchantPubkey, amountLamports, memo);

      if (signature) {
        setTxSignature(signature);
        setState('success');
      } else {
        // Error is handled by the hook's error state via useEffect
        if (!payError) {
          setErrorMessage('La transaccion fallo. Por favor intenta de nuevo.');
        }
        setState('error');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'La transaccion fallo. Por favor intenta de nuevo.';
      setErrorMessage(message);
      setState('error');
    }
  }, [connected, platform, amount, merchantPubkey, memo, pay, payError, handleConnectWallet]);

  const resetPayment = useCallback(() => {
    setState('idle');
    setTxSignature(null);
    setErrorMessage(null);
  }, []);

  // Success view — full takeover
  if (state === 'success') {
    return (
      <PaymentSuccess
        amount={amount}
        currency={currency}
        merchant={merchantName}
        loyaltyTokens={loyaltyReward}
        txSignature={txSignature || undefined}
        onReset={resetPayment}
      />
    );
  }

  const walletAddress = publicKey?.toBase58() || null;
  const isReady = connected && platform && !platformLoading;

  return (
    <div className="flex justify-center animate-fade-in">
      <div className="w-full max-w-md glass-card rounded-3xl p-8 space-y-6">
        {/* Merchant name + via iPay */}
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold text-white tracking-tight">{merchantName}</h1>
          <p className="text-xs text-gray-500 font-medium">
            via <span className="solana-gradient-text">iPay</span>
          </p>
        </div>

        {/* Amount — HUGE */}
        <div className="text-center py-4">
          <div className="text-5xl font-bold text-white tabular-nums tracking-tight">
            {amount}
          </div>
          <div className="mt-2 text-sm text-gray-400 font-medium uppercase tracking-wider">
            {currency}
          </div>
        </div>

        {/* Memo */}
        {memo && (
          <p className="text-center text-sm text-gray-400">{memo}</p>
        )}

        {/* Divider */}
        <div className="border-t border-white/5" />

        {/* Fee info */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Comision de plataforma (0.5%)</span>
          <span className="text-gray-400 tabular-nums">{(amount * 0.005).toFixed(4)} SOL</span>
        </div>

        {/* Loyalty Reward */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill="#14F195"
                />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-300">Recompensa de Lealtad</span>
          </div>
          <LoyaltyBadge tokens={loyaltyReward} animate={false} size="sm" />
        </div>

        {/* Wallet status indicator */}
        {connected && walletAddress && (
          <div className="flex items-center justify-center gap-2 py-2">
            <div className="w-2 h-2 rounded-full bg-[#14F195] animate-pulse" />
            <span className="text-xs text-gray-500 font-mono">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </span>
          </div>
        )}

        {/* Platform loading indicator */}
        {connected && platformLoading && (
          <div className="flex items-center justify-center gap-2 py-2">
            <svg className="w-4 h-4 animate-spin text-gray-500" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" />
            </svg>
            <span className="text-xs text-gray-500">Cargando datos de la plataforma...</span>
          </div>
        )}

        {/* Error message */}
        {state === 'error' && errorMessage && (
          <div className="glass-card rounded-2xl p-3 border-red-500/20 text-sm text-red-400 text-center">
            {errorMessage}
          </div>
        )}

        {/* Action button */}
        {!connected ? (
          <button
            onClick={handleConnectWallet}
            disabled={state === 'connecting'}
            className="w-full btn-glass py-4 rounded-2xl text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {state === 'connecting' ? (
              <>
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="url(#spinGrad)" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="spinGrad" x1="0" y1="0" x2="24" y2="24">
                      <stop stopColor="#9945FF" />
                      <stop offset="1" stopColor="#14F195" />
                    </linearGradient>
                  </defs>
                </svg>
                Conectando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                </svg>
                Conectar Wallet
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handlePay}
            disabled={state === 'confirming' || payLoading || !isReady}
            className="w-full py-4 px-6 rounded-2xl text-lg font-semibold text-white solana-gradient shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
          >
            {state === 'confirming' || payLoading ? (
              <>
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="url(#spinGrad2)" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="spinGrad2" x1="0" y1="0" x2="24" y2="24">
                      <stop stopColor="#9945FF" />
                      <stop offset="1" stopColor="#14F195" />
                    </linearGradient>
                  </defs>
                </svg>
                Confirmando en Solana...
              </>
            ) : (
              `Pagar Ahora`
            )}
          </button>
        )}

        {/* Retry on error */}
        {state === 'error' && (
          <button
            onClick={resetPayment}
            className="w-full btn-glass py-3 rounded-2xl text-sm font-medium"
          >
            Intentar de Nuevo
          </button>
        )}

        {/* Security note */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-600 pt-2">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Asegurado por la blockchain de Solana
        </div>
      </div>
    </div>
  );
}

export default function PayPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <svg className="w-8 h-8 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="url(#loadGrad)" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" />
            <defs>
              <linearGradient id="loadGrad" x1="0" y1="0" x2="24" y2="24">
                <stop stopColor="#9945FF" />
                <stop offset="1" stopColor="#14F195" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      }
    >
      <PayContent />
    </Suspense>
  );
}
