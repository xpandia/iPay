'use client';

import { useState, useEffect, useCallback } from 'react';
import { useConnection, useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import {
  Settings,
  Store,
  Wallet,
  ExternalLink,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Shield,
  Copy,
  Check,
  Code2,
  Coins,
  Tag,
  FileText,
  Layers,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { useMerchant, useIPayProgram } from '@/hooks/useIPayProgram';
import {
  PROGRAM_ID,
  PLATFORM_PDA,
  LOYALTY_MINT,
  PLATFORM_AUTHORITY,
  getExplorerUrl,
  getAddressUrl,
  PLATFORM_FEE_BPS,
} from '@/lib/constants';
import { getMerchantPDA, getPlatformPDA } from '@/lib/program';

export default function SettingsPage() {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const { program } = useIPayProgram();
  const { merchant, loading: merchantLoading, isRegistered, refresh: refreshMerchant } = useMerchant();

  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formLoyaltyMultiplier, setFormLoyaltyMultiplier] = useState(2);

  // Update state
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateTx, setUpdateTx] = useState<string | null>(null);

  // Deactivate
  const [deactivating, setDeactivating] = useState(false);

  // Fetch SOL balance
  const fetchBalance = useCallback(async () => {
    if (!publicKey || !connection) return;
    try {
      const bal = await connection.getBalance(publicKey);
      setSolBalance(bal / LAMPORTS_PER_SOL);
    } catch {
      setSolBalance(null);
    }
  }, [publicKey, connection]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Populate form when merchant data loads
  useEffect(() => {
    if (merchant) {
      setFormName(merchant.name || '');
      setFormDescription(merchant.description || '');
      setFormCategory(merchant.category || '');
      setFormLoyaltyMultiplier((merchant.loyaltyMultiplier || 200) / 100);
    }
  }, [merchant]);

  function handleCopy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleUpdateMerchant(e: React.FormEvent) {
    e.preventDefault();
    if (!program || !publicKey) return;

    setUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      const [platformPDA] = getPlatformPDA();
      const [merchantPDA] = getMerchantPDA(publicKey);

      const tx = await (program.methods as any)
        .updateMerchant(
          formName,
          formDescription,
          formCategory,
          formLoyaltyMultiplier * 100
        )
        .accounts({
          merchant: merchantPDA,
          platform: platformPDA,
          owner: publicKey,
        })
        .rpc();

      setUpdateTx(tx);
      setUpdateSuccess(true);
      setTimeout(() => refreshMerchant(), 2000);
    } catch (err: any) {
      setUpdateError(err.message || 'Error al actualizar');
    }
    setUpdating(false);
  }

  function getCategoryLabel(category: string): string {
    const map: Record<string, string> = {
      food: 'Alimentos y Bebidas',
      retail: 'Retail',
      services: 'Servicios',
      entertainment: 'Entretenimiento',
      health: 'Salud y Bienestar',
      education: 'Educación',
      other: 'Otro',
    };
    return map[category] || category;
  }

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
              Configuración
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
              Conecta tu wallet para configurar
            </h2>
            <p className="text-gray-500 max-w-md mb-10 leading-relaxed text-base">
              Conecta tu wallet de Solana para acceder a la configuración de tu comercio.
            </p>
            <WalletMultiButton className="!bg-gradient-to-r !from-[#9945FF] !to-[#14F195] hover:!opacity-90 !rounded-xl !h-14 !px-10 !font-bold !text-base !border-0 !shadow-xl !shadow-[#9945FF]/30" />
          </div>
        )}

        {/* Loading */}
        {connected && merchantLoading && (
          <div className="flex flex-col items-center justify-center min-h-[65vh] text-center">
            <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 mb-6">
              <Loader2 className="w-12 h-12 text-[#9945FF] animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
              Cargando datos del comercio...
            </h2>
            <p className="text-gray-500 text-sm">Obteniendo tu cuenta on-chain</p>
          </div>
        )}

        {/* Not Registered */}
        {connected && !merchantLoading && !isRegistered && (
          <div className="flex flex-col items-center justify-center min-h-[65vh] text-center">
            <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 mb-6">
              <Store className="w-12 h-12 text-[#14F195]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
              Comercio no registrado
            </h2>
            <p className="text-gray-500 text-sm max-w-md mb-6">
              Primero debes registrar tu comercio desde el Dashboard para acceder a la configuración.
            </p>
            <a
              href="/merchant"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:opacity-90 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-[#9945FF]/25"
            >
              <Store className="w-4 h-4" />
              Ir al Dashboard
            </a>
          </div>
        )}

        {/* Settings Content */}
        {connected && !merchantLoading && isRegistered && merchant && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Current Merchant Info */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-[#9945FF]/20 to-[#14F195]/20">
                  <Store className="w-5 h-5 text-[#14F195]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Información del Comercio</h2>
                  <p className="text-xs text-gray-500">Datos actuales registrados on-chain</p>
                </div>
                <button
                  onClick={() => refreshMerchant()}
                  className="ml-auto p-2 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-all"
                  title="Actualizar datos"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Store className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Nombre</span>
                  </div>
                  <p className="text-white font-semibold">{merchant.name}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Categoría</span>
                  </div>
                  <p className="text-white font-semibold">{getCategoryLabel(merchant.category)}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Descripción</span>
                  </div>
                  <p className="text-gray-300 text-sm">{merchant.description}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Coins className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Multiplicador Loyalty</span>
                  </div>
                  <p className="text-2xl font-bold bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">
                    {(merchant.loyaltyMultiplier / 100).toFixed(0)}x
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Estado</span>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    merchant.isActive
                      ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                      : 'bg-red-500/15 text-red-400 border border-red-500/20'
                  }`}>
                    {merchant.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            </div>

            {/* Update Form */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-[#9945FF]/20 to-[#14F195]/20">
                  <Save className="w-5 h-5 text-[#9945FF]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Actualizar Información</h2>
                  <p className="text-xs text-gray-500">Modifica los datos de tu comercio on-chain</p>
                </div>
              </div>

              {/* Success Banner */}
              {updateSuccess && updateTx && (
                <div className="mb-6 p-4 bg-[#14F195]/10 border border-[#14F195]/20 rounded-xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#14F195] mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#14F195] mb-1">¡Actualización exitosa!</p>
                    <p className="text-xs text-gray-400 mb-2">Tu comercio ha sido actualizado on-chain.</p>
                    <a
                      href={getExplorerUrl(updateTx)}
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

              {/* Error Banner */}
              {updateError && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-red-400 mb-1">Error al actualizar</p>
                    <p className="text-xs text-gray-400 break-all">{updateError}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleUpdateMerchant} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nombre del Comercio</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    disabled={updating}
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#9945FF]/50 focus:border-[#9945FF]/50 transition-all duration-200 disabled:opacity-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    disabled={updating}
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#9945FF]/50 focus:border-[#9945FF]/50 transition-all duration-200 resize-none disabled:opacity-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Categoría</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    disabled={updating}
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#9945FF]/50 focus:border-[#9945FF]/50 transition-all duration-200 appearance-none disabled:opacity-50"
                    required
                  >
                    <option value="" disabled>Selecciona una categoría</option>
                    <option value="food">Alimentos y Bebidas</option>
                    <option value="retail">Retail</option>
                    <option value="services">Servicios</option>
                    <option value="entertainment">Entretenimiento</option>
                    <option value="health">Salud y Bienestar</option>
                    <option value="education">Educación</option>
                    <option value="other">Otro</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-300">Multiplicador de Loyalty</label>
                    <span className="text-2xl font-bold bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">
                      {formLoyaltyMultiplier}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={formLoyaltyMultiplier}
                    onChange={(e) => setFormLoyaltyMultiplier(Number(e.target.value))}
                    disabled={updating}
                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#9945FF] [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-[#9945FF] [&::-webkit-slider-thumb]:to-[#14F195] [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-[#9945FF]/30 disabled:opacity-50"
                  />
                  <div className="flex justify-between text-[10px] text-gray-600 mt-2 font-medium uppercase tracking-widest">
                    <span>1x</span>
                    <span>5x</span>
                    <span>10x</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full py-4 bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:opacity-90 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-[#9945FF]/25 hover:shadow-[#9945FF]/40 flex items-center justify-center gap-2 text-base disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Confirmando en Solana...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Actualizar Información
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-gray-600">
                  Esta transacción se confirmará en Solana Devnet
                </p>
              </form>
            </div>

            {/* Wallet Info */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-[#9945FF]/20 to-[#14F195]/20">
                  <Wallet className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Información de Wallet</h2>
                  <p className="text-xs text-gray-500">Detalles de tu wallet conectada</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Address */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-1">Dirección</p>
                    <code className="text-sm text-[#9945FF] font-mono break-all">
                      {publicKey?.toBase58()}
                    </code>
                  </div>
                  <button
                    onClick={() => handleCopy(publicKey?.toBase58() || '', 'wallet')}
                    className="p-2 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-all flex-shrink-0"
                  >
                    {copied === 'wallet' ? (
                      <Check className="w-4 h-4 text-[#14F195]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <a
                    href={getAddressUrl(publicKey?.toBase58() || '')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-all flex-shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* SOL Balance */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-1">Balance SOL</p>
                  <p className="text-2xl font-bold text-white">
                    {solBalance !== null ? `${solBalance.toFixed(4)} SOL` : '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* Platform Info */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-[#9945FF]/20 to-[#14F195]/20">
                  <Layers className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Información de la Plataforma</h2>
                  <p className="text-xs text-gray-500">Datos del protocolo iPay</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Program ID', value: PROGRAM_ID.toBase58(), key: 'program' },
                  { label: 'Platform PDA', value: PLATFORM_PDA.toBase58(), key: 'platform' },
                  { label: 'Loyalty Mint', value: LOYALTY_MINT.toBase58(), key: 'mint' },
                  { label: 'Platform Authority', value: PLATFORM_AUTHORITY.toBase58(), key: 'authority' },
                ].map((item) => (
                  <div key={item.key} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-1">{item.label}</p>
                      <code className="text-xs text-gray-400 font-mono break-all">{item.value}</code>
                    </div>
                    <button
                      onClick={() => handleCopy(item.value, item.key)}
                      className="p-2 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-all flex-shrink-0"
                    >
                      {copied === item.key ? (
                        <Check className="w-4 h-4 text-[#14F195]" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <a
                      href={getAddressUrl(item.value)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-all flex-shrink-0"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                ))}

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-1">Comisión de Plataforma</p>
                  <p className="text-white font-semibold">{PLATFORM_FEE_BPS / 100}%</p>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-500/5 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-red-500/10">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-red-400 tracking-tight">Zona de Peligro</h2>
                  <p className="text-xs text-gray-500">Acciones irreversibles</p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">Desactivar Comercio</h3>
                  <p className="text-xs text-gray-500">
                    Tu comercio dejará de aceptar pagos. Puedes reactivarlo más tarde.
                  </p>
                </div>
                <button
                  onClick={() => setDeactivating(!deactivating)}
                  className="flex-shrink-0 ml-4"
                  title={merchant.isActive ? 'Desactivar' : 'Activar'}
                >
                  {merchant.isActive ? (
                    <ToggleRight className="w-10 h-10 text-green-400 hover:text-red-400 transition-colors" />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-red-400 hover:text-green-400 transition-colors" />
                  )}
                </button>
              </div>

              {deactivating && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-sm text-red-400 mb-3">
                    {merchant.isActive
                      ? '¿Estás seguro de que deseas desactivar tu comercio? No podrás recibir pagos.'
                      : '¿Deseas reactivar tu comercio?'}
                  </p>
                  <div className="flex gap-3">
                    <button
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-medium rounded-lg text-sm transition-all"
                      onClick={() => {
                        // Placeholder - would call toggle_merchant instruction
                        setDeactivating(false);
                      }}
                    >
                      {merchant.isActive ? 'Sí, Desactivar' : 'Sí, Reactivar'}
                    </button>
                    <button
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 font-medium rounded-lg text-sm transition-all"
                      onClick={() => setDeactivating(false)}
                    >
                      Cancelar
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
