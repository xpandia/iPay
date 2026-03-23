'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { BN } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { useLoyaltyBalance, useIPayProgram, usePlatform } from '@/hooks/useIPayProgram';
import { redeemLoyalty } from '@/lib/program';
import { LOYALTY_DECIMALS, LOYALTY_MINT } from '@/lib/constants';
import RedeemModal from '@/components/RedeemModal';

interface RedemptionOption {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: React.ReactNode;
  gradient: string;
}

const REDEMPTION_OPTIONS: RedemptionOption[] = [
  {
    id: 'discount-10',
    name: '10% descuento',
    description: 'En tu proxima compra',
    cost: 100,
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
      </svg>
    ),
    gradient: 'from-violet-500/20 to-purple-500/20',
  },
  {
    id: 'discount-20',
    name: '20% descuento',
    description: 'En tu proxima compra',
    cost: 250,
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    id: 'free-shipping',
    name: 'Envio gratis',
    description: 'En tu siguiente pedido',
    cost: 500,
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    gradient: 'from-emerald-500/20 to-teal-500/20',
  },
];

export default function RedeemPage() {
  const { publicKey, connected } = useWallet();
  const { program } = useIPayProgram();
  const { platform } = usePlatform();
  const { balance: rawBalance, loading: balanceLoading, refresh: refreshBalance } = useLoyaltyBalance();

  const tokenBalance = rawBalance / Math.pow(10, LOYALTY_DECIMALS);

  const [selectedOption, setSelectedOption] = useState<RedemptionOption | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSelectOption = (option: RedemptionOption) => {
    setSelectedOption(option);
    setShowCustom(false);
    setModalOpen(true);
  };

  const handleCustomRedeem = () => {
    const amount = Number(customAmount);
    if (!amount || amount <= 0) return;
    setSelectedOption({
      id: 'custom',
      name: 'Canje personalizado',
      description: `${amount} iPAY tokens`,
      cost: amount,
      icon: null,
      gradient: '',
    });
    setModalOpen(true);
  };

  const handleConfirmRedeem = async (): Promise<string | null> => {
    if (!program || !publicKey || !selectedOption || !platform) return null;

    const amountRaw = new BN(selectedOption.cost).mul(new BN(10).pow(new BN(LOYALTY_DECIMALS)));
    // Use platform authority as the merchant owner for general redemptions
    const merchantOwner = new PublicKey(platform.authority);
    const loyaltyMint = new PublicKey(platform.loyaltyMint);

    const sig = await redeemLoyalty(program, publicKey, merchantOwner, loyaltyMint, amountRaw);
    await refreshBalance();
    return sig;
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedOption(null);
  };

  // Not connected
  if (!connected || !publicKey) {
    return (
      <div className="relative min-h-screen bg-gray-950 flex flex-col items-center overflow-hidden">
        <div
          className="pointer-events-none absolute top-[-10%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-15 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #9945FF 0%, #14F195 50%, transparent 70%)' }}
        />
        <header className="relative z-10 w-full py-6 flex justify-center">
          <a href="/"><span className="text-2xl font-bold tracking-tight solana-gradient-text">iPay</span></a>
        </header>
        <main className="relative z-10 flex-1 flex items-center justify-center px-4">
          <div className="text-center space-y-8 max-w-sm">
            <div className="mx-auto w-20 h-20 rounded-3xl glass-card flex items-center justify-center">
              <svg className="w-9 h-9 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight mb-3">Canjear iPAY Tokens</h1>
              <p className="text-gray-400 text-sm leading-relaxed">
                Conecta tu wallet para canjear tus tokens iPAY por recompensas exclusivas.
              </p>
            </div>
            <div className="flex justify-center">
              <WalletMultiButton className="!bg-gradient-to-r !from-[#9945FF] !to-[#14F195] hover:!opacity-90 !rounded-2xl !h-14 !px-10 !font-bold !text-base !border-0 !shadow-xl !shadow-[#9945FF]/30" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-950 flex flex-col overflow-hidden">
      {/* Background orb */}
      <div
        className="pointer-events-none absolute top-[-15%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-15 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #9945FF 0%, #14F195 50%, transparent 70%)' }}
      />

      {/* Header */}
      <header className="relative z-10 w-full py-6 px-6 flex justify-between items-center">
        <a href="/wallet">
          <span className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            <span className="text-sm font-medium">Wallet</span>
          </span>
        </a>
        <a href="/">
          <span className="text-2xl font-bold tracking-tight solana-gradient-text">iPay</span>
        </a>
      </header>

      <main className="relative z-10 flex-1 px-4 py-4 max-w-lg mx-auto w-full space-y-6">
        {/* Page title */}
        <div className="animate-fade-up">
          <h1 className="text-3xl font-bold text-white tracking-tight">Canjear iPAY Tokens</h1>
          <p className="text-gray-400 text-sm mt-1">Elige una recompensa y canjea tus tokens</p>
        </div>

        {/* Balance card */}
        <div className="animate-fade-up delay-100 opacity-0" style={{ animationFillMode: 'forwards' }}>
          <div className="relative rounded-2xl p-[1px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#9945FF] to-[#14F195] opacity-30" />
            <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Tu balance</p>
                  {balanceLoading ? (
                    <div className="w-32 h-8 bg-white/10 rounded-lg animate-pulse mt-1" />
                  ) : (
                    <p className="text-3xl font-bold text-white tabular-nums tracking-tight mt-1">
                      {tokenBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      <span className="text-base font-medium ml-2 text-gray-400">iPAY</span>
                    </p>
                  )}
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Redemption options */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white tracking-tight animate-fade-up delay-150 opacity-0" style={{ animationFillMode: 'forwards' }}>
            Recompensas disponibles
          </h2>

          {REDEMPTION_OPTIONS.map((option, i) => {
            const canAfford = tokenBalance >= option.cost;
            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option)}
                disabled={!canAfford}
                className={`animate-fade-up opacity-0 w-full text-left group`}
                style={{ animationFillMode: 'forwards', animationDelay: `${200 + i * 80}ms` }}
              >
                <div className={`relative rounded-2xl border transition-all duration-200 ${
                  canAfford
                    ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12] active:scale-[0.98]'
                    : 'bg-white/[0.01] border-white/[0.03] opacity-50 cursor-not-allowed'
                } backdrop-blur-xl p-4`}>
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${option.gradient} flex items-center justify-center flex-shrink-0 text-white`}>
                      {option.icon}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-white">{option.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
                    </div>

                    {/* Cost */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold solana-gradient-text">{option.cost.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">iPAY</p>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom amount */}
        <div className="animate-fade-up delay-400 opacity-0" style={{ animationFillMode: 'forwards' }}>
          {!showCustom ? (
            <button
              onClick={() => setShowCustom(true)}
              className="w-full rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] backdrop-blur-xl p-4 text-center hover:bg-white/[0.04] hover:border-white/[0.15] transition-all duration-200 group"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center group-hover:bg-white/[0.1] transition-colors">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">Personalizado</p>
                  <p className="text-xs text-gray-500">Ingresa la cantidad que desees</p>
                </div>
              </div>
            </button>
          ) : (
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-5 space-y-4">
              <p className="text-sm font-semibold text-white">Cantidad personalizada</p>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="0"
                    min="1"
                    className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-lg font-medium placeholder-gray-600 focus:outline-none focus:border-[#9945FF]/50 focus:ring-1 focus:ring-[#9945FF]/30 transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">iPAY</span>
                </div>
                <button
                  onClick={handleCustomRedeem}
                  disabled={!customAmount || Number(customAmount) <= 0 || Number(customAmount) > tokenBalance}
                  className={`px-6 rounded-xl font-semibold text-sm transition-all ${
                    customAmount && Number(customAmount) > 0 && Number(customAmount) <= tokenBalance
                      ? 'bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white hover:opacity-90 active:scale-[0.98]'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Canjear
                </button>
              </div>
              {customAmount && Number(customAmount) > tokenBalance && (
                <p className="text-xs text-red-400">Balance insuficiente</p>
              )}
              <button
                onClick={() => { setShowCustom(false); setCustomAmount(''); }}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        {/* Info banner */}
        <div className="animate-fade-up delay-500 opacity-0" style={{ animationFillMode: 'forwards' }}>
          <div className="glass-card rounded-2xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#9945FF]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-[#9945FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Al canjear, tus tokens iPAY seran quemados permanentemente en la blockchain de Solana.
                La recompensa se aplicara automaticamente en tu proxima compra.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 pb-6 pt-4 text-center">
        <span className="text-xs text-gray-600 tracking-wide">
          Powered by <a href="https://xpandia.co" target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-400 hover:text-white transition-colors">xpandia</a>
        </span>
      </footer>

      {/* Redeem Modal */}
      {selectedOption && (
        <RedeemModal
          isOpen={modalOpen}
          onClose={handleModalClose}
          onConfirm={handleConfirmRedeem}
          rewardName={selectedOption.name}
          ipayCost={selectedOption.cost}
          currentBalance={tokenBalance}
        />
      )}
    </div>
  );
}
