'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  LayoutDashboard,
  CreditCard,
  Zap,
  Bot,
  Settings,
  Store,
  Menu,
  X,
  Wallet,
} from 'lucide-react';

const navItems = [
  { label: 'Panel', href: '/merchant', icon: LayoutDashboard },
  { label: 'Pagos', href: '/merchant/payments', icon: CreditCard },
  { label: 'Blinks', href: '/merchant/blinks', icon: Zap },
  { label: 'Asistente IA', href: '/merchant/ai', icon: Bot },
  { label: 'Configuracion', href: '/merchant/settings', icon: Settings },
];

export default function MerchantLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { publicKey } = useWallet();

  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-transform duration-300 ease-out
          w-72 bg-gray-900/80 backdrop-blur-xl border-r border-white/10
          lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6 py-6">
          <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px]">
              <path d="M12 2L8 10h3l-2 12 8-14h-4l3-6z" fill="white" fillOpacity="0.95"/>
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            iPay
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-2 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {/* Active: Solana gradient left border */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-[#9945FF] to-[#14F195]" />
                )}
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom: Wallet + Settings */}
        <div className="px-4 pb-6 space-y-3">
          <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#9945FF]/30 to-[#14F195]/30">
              <Wallet className="w-4 h-4 text-gray-300" />
            </div>
            <span className="text-xs font-mono text-gray-400 truncate flex-1">
              {publicKey ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}` : 'No conectada'}
            </span>
            <button className="p-1 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-colors">
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-30 p-2.5 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all lg:hidden"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 min-h-screen">
        {children}
      </main>
    </div>
  );
}
