import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'iPay — Pay',
  description: 'Completa tu pago con iPay en Solana',
};

export default function PayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-gray-950 flex flex-col items-center overflow-hidden">
      {/* Background gradient orb */}
      <div
        className="pointer-events-none absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, #9945FF 0%, #14F195 50%, transparent 70%)',
        }}
      />

      {/* iPay logo */}
      <header className="relative z-10 w-full py-6 flex justify-center">
        <a href="/" className="group">
          <span className="text-2xl font-bold tracking-tight solana-gradient-text">
            iPay
          </span>
        </a>
      </header>

      {/* Centered content */}
      <main className="relative z-10 flex-1 flex items-start justify-center w-full px-4 py-6 sm:py-10">
        <div className="w-full max-w-lg">
          {children}
        </div>
      </main>

      {/* Powered by xpandia */}
      <footer className="relative z-10 pb-6 pt-4 text-center">
        <a href="https://xpandia.co" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-600 hover:text-gray-400 transition-colors tracking-wide">
          Powered by <span className="font-semibold text-gray-400">xpandia</span>
        </a>
      </footer>
    </div>
  );
}
