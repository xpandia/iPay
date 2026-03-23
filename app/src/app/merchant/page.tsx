'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
  Wallet,
  CreditCard,
  TrendingUp,
  Gift,
  CalendarDays,
  Zap,
  ShieldCheck,
  Store,
  BarChart3,
  ArrowUpRight,
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import PaymentTable from '@/components/PaymentTable';
import CreateBlinkModal from '@/components/CreateBlinkModal';
import { useMerchant, useRegisterMerchant } from '@/hooks/useIPayProgram';
import { getExplorerUrl } from '@/lib/constants';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

const LOYALTY_DECIMALS = 6;

export default function MerchantDashboard() {
  const { connected, publicKey } = useWallet();
  const { merchant, loading: merchantLoading, isRegistered, refresh: refreshMerchant } = useMerchant();
  const { register, loading: registering, error: registerError } = useRegisterMerchant();

  const [blinkModalOpen, setBlinkModalOpen] = useState(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState(false);

  // Registration form state
  const [regForm, setRegForm] = useState({
    name: '',
    description: '',
    category: '',
    loyaltyMultiplier: 2,
  });

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setTxSignature(null);
    setRegSuccess(false);

    const sig = await register(
      regForm.name,
      regForm.description,
      regForm.category,
      regForm.loyaltyMultiplier * 100
    );

    if (sig) {
      setTxSignature(sig);
      setRegSuccess(true);
      // Refresh merchant data after a short delay for confirmation
      setTimeout(() => {
        refreshMerchant();
      }, 2000);
    }
  }

  // Format on-chain data for display
  function formatVolume(lamports: any): string {
    if (!lamports) return '0 SOL';
    const sol = Number(lamports) / LAMPORTS_PER_SOL;
    return `${sol.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })} SOL`;
  }

  function formatLoyalty(raw: any): string {
    if (!raw) return '0';
    const amount = Number(raw) / Math.pow(10, LOYALTY_DECIMALS);
    return amount.toLocaleString(undefined, { maximumFractionDigits: 0 });
  }

  function formatDate(timestamp: any): string {
    if (!timestamp) return 'N/A';
    try {
      const ts = Number(timestamp);
      if (isNaN(ts) || ts <= 0) return 'N/A';
      // Anchor BN timestamps are in seconds
      const date = new Date(ts * 1000);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('es', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  }

  function getCategoryLabel(category: string): string {
    const map: Record<string, string> = {
      food: 'Comida y Bebida',
      retail: 'Comercio',
      services: 'Servicios',
      entertainment: 'Entretenimiento',
      health: 'Salud y Bienestar',
      education: 'Educacion',
      other: 'Otro',
    };
    return map[category] || category;
  }

  const today = new Date().toLocaleDateString('es', {
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
              Panel
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{today}</p>
          </div>
          <WalletMultiButton className="!bg-gradient-to-r !from-[#9945FF] !to-[#14F195] hover:!opacity-90 !rounded-xl !h-11 !font-semibold !text-sm !border-0 !shadow-lg !shadow-[#9945FF]/20" />
        </div>
      </header>

      <div className="px-6 lg:px-10 py-8">
        {/* Not Connected */}
        {!connected && (
          <div className="flex flex-col items-center justify-center min-h-[65vh] text-center">
            <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 mb-8 group hover:bg-white/10 transition-all duration-500">
              <Wallet className="w-16 h-16 text-[#9945FF] group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
              Conecta tu wallet para comenzar
            </h2>
            <p className="text-gray-500 max-w-md mb-10 leading-relaxed text-base">
              Conecta tu wallet de Solana para acceder al panel de comerciante. Acepta pagos, crea Blinks y gestiona tu programa de lealtad.
            </p>
            <WalletMultiButton className="!bg-gradient-to-r !from-[#9945FF] !to-[#14F195] hover:!opacity-90 !rounded-xl !h-14 !px-10 !font-bold !text-base !border-0 !shadow-xl !shadow-[#9945FF]/30" />
          </div>
        )}

        {/* Loading State */}
        {connected && merchantLoading && (
          <div className="flex flex-col items-center justify-center min-h-[65vh] text-center">
            <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 mb-6">
              <Loader2 className="w-12 h-12 text-[#9945FF] animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
              Cargando datos del comercio...
            </h2>
            <p className="text-gray-500 text-sm">
              Obteniendo tu cuenta on-chain
            </p>
          </div>
        )}

        {/* Connected but Not Registered */}
        {connected && !merchantLoading && !isRegistered && (
          <div className="flex flex-col items-center justify-center min-h-[65vh]">
            <div className="w-full max-w-xl">
              <div className="text-center mb-8">
                <div className="inline-flex p-4 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 mb-5">
                  <Store className="w-10 h-10 text-[#14F195]" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
                  Registra tu Negocio
                </h2>
                <p className="text-gray-500">
                  Configura tu perfil de comerciante en Solana para comenzar a aceptar pagos
                </p>
              </div>

              {/* Registration Success Banner */}
              {regSuccess && txSignature && (
                <div className="mb-6 p-4 bg-[#14F195]/10 border border-[#14F195]/20 rounded-xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#14F195] mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#14F195] mb-1">
                      Registro exitoso!
                    </p>
                    <p className="text-xs text-gray-400 mb-2">
                      Tu cuenta de comerciante ha sido creada on-chain.
                    </p>
                    <a
                      href={getExplorerUrl(txSignature)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#9945FF] hover:text-[#14F195] transition-colors"
                    >
                      Ver en Solana Explorer
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {/* Registration Error Banner */}
              {registerError && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-red-400 mb-1">
                      Error en el registro
                    </p>
                    <p className="text-xs text-gray-400 break-all">
                      {registerError}
                    </p>
                  </div>
                </div>
              )}

              <form
                onSubmit={handleRegister}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6"
              >
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre del Negocio
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., La Tienda de Juan"
                    value={regForm.name}
                    onChange={(e) =>
                      setRegForm({ ...regForm, name: e.target.value })
                    }
                    disabled={registering}
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#9945FF]/50 focus:border-[#9945FF]/50 transition-all duration-200 disabled:opacity-50"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Descripcion
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Cuenta a tus clientes sobre tu negocio..."
                    value={regForm.description}
                    onChange={(e) =>
                      setRegForm({ ...regForm, description: e.target.value })
                    }
                    disabled={registering}
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#9945FF]/50 focus:border-[#9945FF]/50 transition-all duration-200 resize-none disabled:opacity-50"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Categoria
                  </label>
                  <select
                    required
                    value={regForm.category}
                    onChange={(e) =>
                      setRegForm({ ...regForm, category: e.target.value })
                    }
                    disabled={registering}
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#9945FF]/50 focus:border-[#9945FF]/50 transition-all duration-200 appearance-none disabled:opacity-50"
                  >
                    <option value="" disabled>
                      Selecciona una categoria
                    </option>
                    <option value="food">Comida y Bebida</option>
                    <option value="retail">Comercio</option>
                    <option value="services">Servicios</option>
                    <option value="entertainment">Entretenimiento</option>
                    <option value="health">Salud y Bienestar</option>
                    <option value="education">Educacion</option>
                    <option value="other">Otro</option>
                  </select>
                </div>

                {/* Loyalty Multiplier Slider */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-300">
                      Multiplicador de Lealtad
                    </label>
                    <span className="text-2xl font-bold bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">
                      {regForm.loyaltyMultiplier}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={regForm.loyaltyMultiplier}
                    onChange={(e) =>
                      setRegForm({
                        ...regForm,
                        loyaltyMultiplier: Number(e.target.value),
                      })
                    }
                    disabled={registering}
                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#9945FF] [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-[#9945FF] [&::-webkit-slider-thumb]:to-[#14F195] [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-[#9945FF]/30 disabled:opacity-50"
                  />
                  <div className="flex justify-between text-[10px] text-gray-600 mt-2 font-medium uppercase tracking-widest">
                    <span>1x</span>
                    <span>5x</span>
                    <span>10x</span>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={registering}
                  className="w-full py-4 bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:opacity-90 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-[#9945FF]/25 hover:shadow-[#9945FF]/40 flex items-center justify-center gap-2 text-base disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {registering ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Confirmando en Solana...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      Registrar Comercio
                    </>
                  )}
                </button>

                {/* Network note */}
                <p className="text-center text-[11px] text-gray-600">
                  Esta transaccion sera confirmada en Solana
                </p>
              </form>
            </div>
          </div>
        )}

        {/* Registered Dashboard */}
        {connected && !merchantLoading && isRegistered && merchant && (
          <div className="space-y-8">
            {/* Merchant Info Banner */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#9945FF]/20 to-[#14F195]/20">
                <Store className="w-6 h-6 text-[#14F195]" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {merchant.name}
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  {merchant.description}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#9945FF]/15 text-[#9945FF] border border-[#9945FF]/20">
                    {getCategoryLabel(merchant.category)}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#14F195]/15 text-[#14F195] border border-[#14F195]/20">
                    {(merchant.loyaltyMultiplier / 100).toFixed(0)}x Lealtad
                  </span>
                  {merchant.isActive !== undefined && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      merchant.isActive
                        ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                        : 'bg-red-500/15 text-red-400 border border-red-500/20'
                    }`}>
                      {merchant.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  )}
                </div>
              </div>
              <a
                href={`https://explorer.solana.com/address/${publicKey?.toBase58()}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
              >
                Ver en Explorer
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Stats Grid — REAL on-chain data */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatsCard
                icon={CreditCard}
                label="Total de Pagos"
                value={String(Number(merchant.totalPayments || 0))}
                iconColor="text-[#9945FF]"
              />
              <StatsCard
                icon={TrendingUp}
                label="Volumen Total"
                value={formatVolume(merchant.totalVolume)}
                iconColor="text-blue-400"
              />
              <StatsCard
                icon={Gift}
                label="Lealtad Distribuida"
                value={formatLoyalty(merchant.totalLoyaltyDistributed)}
                iconColor="text-[#14F195]"
              />
              <StatsCard
                icon={CalendarDays}
                label="Activo Desde"
                value={formatDate(merchant.createdAt)}
                iconColor="text-amber-400"
              />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left: Payments Table (2 cols) */}
              <div className="xl:col-span-2">
                <PaymentTable />
              </div>

              {/* Right: Loyalty Chart + Quick Actions */}
              <div className="space-y-6">
                {/* Loyalty Summary */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <h3 className="text-sm font-semibold text-white mb-1 tracking-tight">Resumen de Lealtad</h3>
                  <p className="text-xs text-gray-500 mb-5">Datos on-chain de tu programa</p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Total distribuido</span>
                      <span className="text-sm font-bold text-[#14F195]">
                        {formatLoyalty(merchant.totalLoyaltyDistributed)} pts
                      </span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-[#9945FF] to-[#14F195]"
                        style={{
                          width: `${Math.min(100, Number(merchant.totalLoyaltyDistributed || 0) > 0 ? Math.max(5, Math.min(100, Number(merchant.totalLoyaltyDistributed) / Math.pow(10, LOYALTY_DECIMALS) / 10)) : 0)}%`,
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Multiplicador</span>
                      <span className="text-sm font-bold bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">
                        {(merchant.loyaltyMultiplier / 100).toFixed(0)}x
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Pagos procesados</span>
                      <span className="text-sm font-bold text-white">
                        {String(Number(merchant.totalPayments || 0))}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Promedio lealtad/pago</span>
                      <span className="text-sm font-bold text-white">
                        {Number(merchant.totalPayments || 0) > 0
                          ? (Number(merchant.totalLoyaltyDistributed || 0) / Math.pow(10, LOYALTY_DECIMALS) / Number(merchant.totalPayments)).toFixed(1)
                          : '0'} pts
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-3">
                  <h3 className="text-sm font-semibold text-white tracking-tight mb-4">Acciones Rapidas</h3>
                  <button
                    onClick={() => setBlinkModalOpen(true)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-[#9945FF]/10 to-[#14F195]/10 hover:from-[#9945FF]/20 hover:to-[#14F195]/20 border border-white/10 rounded-xl text-white font-medium transition-all duration-200 group"
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-br from-[#9945FF]/30 to-[#14F195]/30">
                      <Zap className="w-4 h-4 text-[#14F195]" />
                    </div>
                    <span className="flex-1 text-left text-sm">Crear Blink</span>
                    <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                  </button>
                  <button
                    onClick={() => refreshMerchant()}
                    className="w-full flex items-center gap-3 px-4 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all duration-200 group"
                  >
                    <div className="p-2 rounded-lg bg-white/10">
                      <BarChart3 className="w-4 h-4 text-gray-300" />
                    </div>
                    <span className="flex-1 text-left text-sm">Actualizar Datos</span>
                    <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                  </button>
                </div>
              </div>
            </div>

            {/* Create Blink Modal */}
            <CreateBlinkModal
              isOpen={blinkModalOpen}
              onClose={() => setBlinkModalOpen(false)}
              merchantName={merchant.name || 'Mi Tienda'}
            />
          </div>
        )}
      </div>
    </div>
  );
}
