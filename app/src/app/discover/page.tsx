'use client';

import { useEffect, useState, useMemo } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { fetchMerchant, PROGRAM_ID, MERCHANT_SEED } from '@/lib/program';

/* ─────────────── Types ─────────────── */

interface MerchantCard {
  name: string;
  category: string;
  description: string;
  loyaltyMultiplier: number;
  owner: string;
  isOnChain: boolean;
  totalPayments?: number;
  totalVolume?: number;
}

type Category = 'Todos' | 'Restaurantes' | 'Cafeterías' | 'Tecnología' | 'Retail' | 'Servicios';

const CATEGORIES: Category[] = ['Todos', 'Restaurantes', 'Cafeterías', 'Tecnología', 'Retail', 'Servicios'];

/* ─────────────── Featured merchants ─────────────── */

const DEMO_MERCHANTS: MerchantCard[] = [
  {
    name: 'Café Solana',
    category: 'Cafeterías',
    description: 'Café artesanal de especialidad. Pagos crypto con descuento 5%.',
    loyaltyMultiplier: 150,
    owner: 'CafeDemo111111111111111111111111111111111',
    isOnChain: false,
    totalPayments: 342,
  },
  {
    name: 'Taquería El Blockchain',
    category: 'Restaurantes',
    description: 'Los mejores tacos de la ciudad. Acepta SOL, USDC y iPAY tokens.',
    loyaltyMultiplier: 200,
    owner: 'TacoDemo111111111111111111111111111111111',
    isOnChain: false,
    totalPayments: 1287,
  },
  {
    name: 'TechStore MX',
    category: 'Tecnología',
    description: 'Electrónica y gadgets. Envío gratis pagando con crypto.',
    loyaltyMultiplier: 100,
    owner: 'TechDemo111111111111111111111111111111111',
    isOnChain: false,
    totalPayments: 89,
  },
  {
    name: 'Farmacia Vida',
    category: 'Servicios',
    description: 'Salud y bienestar. Acumula puntos iPAY en cada compra.',
    loyaltyMultiplier: 120,
    owner: 'FarmDemo111111111111111111111111111111111',
    isOnChain: false,
    totalPayments: 567,
  },
  {
    name: 'Ropa Luna',
    category: 'Retail',
    description: 'Moda sustentable. 2x puntos de lealtad los viernes.',
    loyaltyMultiplier: 250,
    owner: 'RopaDemo111111111111111111111111111111111',
    isOnChain: false,
    totalPayments: 203,
  },
  {
    name: 'Panadería Sol',
    category: 'Restaurantes',
    description: 'Pan artesanal y repostería. Desayunos con café incluido.',
    loyaltyMultiplier: 130,
    owner: 'PanDemo1111111111111111111111111111111111',
    isOnChain: false,
    totalPayments: 445,
  },
  {
    name: 'Cowork Cripto',
    category: 'Servicios',
    description: 'Espacios de coworking web3-friendly. Paga membresía con SOL.',
    loyaltyMultiplier: 180,
    owner: 'CowDemo1111111111111111111111111111111111',
    isOnChain: false,
    totalPayments: 156,
  },
  {
    name: 'ByteGames',
    category: 'Tecnología',
    description: 'Videojuegos, accesorios y NFTs. Loyalty multiplier alto.',
    loyaltyMultiplier: 300,
    owner: 'BytDemo1111111111111111111111111111111111',
    isOnChain: false,
    totalPayments: 78,
  },
];

/* ─────────────── Category icons ─────────────── */

function CategoryIcon({ category, className }: { category: string; className?: string }) {
  const cls = className || 'w-5 h-5';
  switch (category) {
    case 'Restaurantes':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37" />
        </svg>
      );
    case 'Cafeterías':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
        </svg>
      );
    case 'Tecnología':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
        </svg>
      );
    case 'Retail':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      );
    case 'Servicios':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-5.1a1.5 1.5 0 010-2.12l.88-.88a1.5 1.5 0 012.12 0l2.1 2.1 5.1-5.1a1.5 1.5 0 012.12 0l.88.88a1.5 1.5 0 010 2.12l-8.1 8.1z" />
        </svg>
      );
    default:
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.15c0 .415.336.75.75.75z" />
        </svg>
      );
  }
}

/* ─────────────── Multiplier color ─────────────── */

function getMultiplierColor(m: number): string {
  if (m >= 250) return 'text-[#14F195]';
  if (m >= 150) return 'text-[#9945FF]';
  return 'text-gray-400';
}

function getMultiplierBg(m: number): string {
  if (m >= 250) return 'bg-[#14F195]/10';
  if (m >= 150) return 'bg-[#9945FF]/10';
  return 'bg-white/[0.05]';
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  Discover Page                                                         */
/* ═══════════════════════════════════════════════════════════════════════ */

export default function DiscoverPage() {
  const { connection } = useConnection();
  const [onChainMerchants, setOnChainMerchants] = useState<MerchantCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('Todos');

  // Try to fetch on-chain merchants from known addresses
  useEffect(() => {
    let cancelled = false;

    async function fetchOnChainMerchants() {
      setLoading(true);
      try {
        // Try to scan for merchant accounts using getProgramAccounts
        const MERCHANT_DISCRIMINATOR = Buffer.from([71, 235, 30, 40, 231, 21, 32, 64]);
        const accounts = await connection.getProgramAccounts(PROGRAM_ID, {
          filters: [
            { memcmp: { offset: 0, bytes: MERCHANT_DISCRIMINATOR.toString('base64'), encoding: 'base64' } },
          ],
        });

        if (!cancelled && accounts.length > 0) {
          const { AnchorProvider, Program } = await import('@coral-xyz/anchor');
          const IDL = (await import('@/lib/ipay_protocol.json')).default;
          const provider = new AnchorProvider(connection, {} as any, {});
          const program = new Program(IDL as any, provider);

          const merchants: MerchantCard[] = [];
          for (const acc of accounts) {
            try {
              const data = (program.coder as any).accounts.decode('merchant', acc.account.data);
              if (data.isActive) {
                merchants.push({
                  name: data.name,
                  category: data.merchantCategory || 'Servicios',
                  description: data.description,
                  loyaltyMultiplier: data.loyaltyMultiplier,
                  owner: data.owner.toBase58(),
                  isOnChain: true,
                  totalPayments: Number(data.totalPayments || 0),
                  totalVolume: Number(data.totalVolume || 0),
                });
              }
            } catch {
              // Skip accounts that can't be decoded
            }
          }
          if (!cancelled) setOnChainMerchants(merchants);
        }
      } catch (err) {
        console.error('Failed to fetch on-chain merchants:', err);
      }
      if (!cancelled) setLoading(false);
    }

    fetchOnChainMerchants();
    return () => { cancelled = true; };
  }, [connection]);

  // Combine on-chain + demo, dedup by name
  const allMerchants = useMemo(() => {
    const onChainNames = new Set(onChainMerchants.map((m) => m.name.toLowerCase()));
    const demos = DEMO_MERCHANTS.filter((d) => !onChainNames.has(d.name.toLowerCase()));
    return [...onChainMerchants, ...demos];
  }, [onChainMerchants]);

  // Filter
  const filtered = useMemo(() => {
    let result = allMerchants;
    if (activeCategory !== 'Todos') {
      result = result.filter((m) => m.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [allMerchants, activeCategory, search]);

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
        <div className="flex items-center gap-4">
          <a href="/wallet" className="text-sm text-gray-400 hover:text-white transition-colors">
            Mi Wallet
          </a>
          <a href="/pay" className="text-sm text-gray-400 hover:text-white transition-colors">
            Pagar
          </a>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-4 py-4 max-w-4xl mx-auto w-full space-y-6">
        {/* Title */}
        <div className="animate-fade-up">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Descubrir <span className="solana-gradient-text">Comercios</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Encuentra comercios que aceptan pagos con Solana y acumula iPAY tokens
          </p>
        </div>

        {/* Search bar */}
        <div className="animate-fade-up delay-100 opacity-0" style={{ animationFillMode: 'forwards' }}>
          <div className="glass-card rounded-2xl px-4 py-3 flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar comercios..."
              className="flex-1 bg-transparent text-white text-sm placeholder-gray-600 outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-gray-500 hover:text-gray-300 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category filters */}
        <div className="animate-fade-up delay-150 opacity-0" style={{ animationFillMode: 'forwards' }}>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                  activeCategory === cat
                    ? 'text-white shadow-lg shadow-[#9945FF]/20'
                    : 'bg-white/[0.04] text-gray-500 border border-white/[0.06] hover:text-gray-300 hover:border-white/[0.12]'
                }`}
                style={
                  activeCategory === cat
                    ? { background: 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)' }
                    : undefined
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* On-chain badge */}
        {onChainMerchants.length > 0 && (
          <div className="flex items-center gap-2 animate-fade-up delay-150 opacity-0" style={{ animationFillMode: 'forwards' }}>
            <div className="w-2 h-2 rounded-full bg-[#14F195] animate-pulse" />
            <span className="text-xs text-gray-500">
              {onChainMerchants.length} comercio{onChainMerchants.length !== 1 ? 's' : ''} registrado{onChainMerchants.length !== 1 ? 's' : ''} on-chain
            </span>
          </div>
        )}

        {/* Merchants grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.05] animate-pulse" />
                  <div className="space-y-2 flex-1">
                    <div className="w-28 h-4 bg-white/[0.08] rounded animate-pulse" />
                    <div className="w-16 h-3 bg-white/[0.05] rounded animate-pulse" />
                  </div>
                </div>
                <div className="w-full h-3 bg-white/[0.05] rounded animate-pulse" />
                <div className="w-3/4 h-3 bg-white/[0.04] rounded animate-pulse" />
                <div className="w-full h-10 bg-white/[0.06] rounded-xl animate-pulse" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72" />
            </svg>
            <p className="text-gray-500 text-sm">No se encontraron comercios</p>
            <p className="text-gray-600 text-xs mt-1">Intenta con otro término de búsqueda o categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-up delay-200 opacity-0" style={{ animationFillMode: 'forwards' }}>
            {filtered.map((merchant, i) => (
              <div
                key={`${merchant.name}-${i}`}
                className="glass-card-hover rounded-2xl p-5 flex flex-col justify-between group"
                style={{ animationDelay: `${200 + i * 60}ms` }}
              >
                {/* Top: icon + info */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl solana-gradient-subtle flex items-center justify-center flex-shrink-0">
                        <CategoryIcon category={merchant.category} className="w-6 h-6 text-[#14F195]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-white">{merchant.name}</h3>
                          {merchant.isOnChain && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#14F195]/10 text-[10px] font-medium text-[#14F195]">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#14F195]" />
                              On-chain
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{merchant.category}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                    {merchant.description}
                  </p>

                  {/* Stats row */}
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${getMultiplierBg(merchant.loyaltyMultiplier)}`}>
                      <svg className={`w-3.5 h-3.5 ${getMultiplierColor(merchant.loyaltyMultiplier)}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                      <span className={`text-[11px] font-semibold ${getMultiplierColor(merchant.loyaltyMultiplier)}`}>
                        {(merchant.loyaltyMultiplier / 100).toFixed(1)}x iPAY
                      </span>
                    </div>
                    {merchant.totalPayments !== undefined && merchant.totalPayments > 0 && (
                      <span className="text-[11px] text-gray-600">
                        {merchant.totalPayments.toLocaleString()} pagos
                      </span>
                    )}
                  </div>
                </div>

                {/* Pay button */}
                <a
                  href={`/pay?merchant=${encodeURIComponent(merchant.owner)}&memo=Pago+${encodeURIComponent(merchant.name)}`}
                  className="mt-4 block w-full py-2.5 rounded-xl text-xs font-semibold text-white text-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)',
                    boxShadow: '0 4px 20px rgba(153, 69, 255, 0.2)',
                  }}
                >
                  Pagar
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Register CTA */}
        <div className="glass-card rounded-2xl p-5 flex items-center gap-4 animate-fade-up delay-400 opacity-0" style={{ animationFillMode: 'forwards' }}>
          <div className="w-12 h-12 rounded-xl bg-[#9945FF]/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-[#9945FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Eres comerciante?</p>
            <p className="text-xs text-gray-500 mt-0.5">Registra tu negocio en iPay y empieza a aceptar pagos con Solana</p>
          </div>
          <a
            href="/merchant"
            className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-[1.03]"
            style={{ background: 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)' }}
          >
            Registrar
          </a>
        </div>
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
