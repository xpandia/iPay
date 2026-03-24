"use client";

import Link from "next/link";
import {
  Zap,
  QrCode,
  Wallet,
  Gift,
  Layers,
  Sparkles,
  Store,
  BarChart3,
  ArrowRight,
  CreditCard,
  ShoppingCart,
  Smartphone,
  Coins,
  Check,
  X,
  Monitor,
  Globe,
  DollarSign,
  Clock,
  TrendingUp,
  MessageSquare,
  Link2,
  Cpu,
  CheckCircle2,
  Circle,
  Building2,
  Users,
  Target,
  Rocket,
  Shield,
  ChevronRight,
  ExternalLink,
  Code,
  BookOpen,
  Mail,
  FileText,
  Bot,
  Send,
  Landmark,
  BadgeDollarSign,
} from "lucide-react";
import { useEffect, useState, useCallback, type ReactNode } from "react";
import { Connection } from "@solana/web3.js";

const LIVE_PROGRAM_ID = "2DhfCmG1sUiX8ZJc4wZkq42hfbhNf6PPnhR7bXPyxEAc";
const LIVE_TOKEN_MINT = "CRJqookT2EuxZtCJmG8Z69S1qUSTV2rHGh62CQowwFsZ";
const EXPLORER_BASE = "https://explorer.solana.com";

function LiveMetrics() {
  const [slot, setSlot] = useState<number | null>(null);
  const [tps, setTps] = useState<number | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      const conn = new Connection("https://api.devnet.solana.com", "confirmed");
      const currentSlot = await conn.getSlot();
      setSlot(currentSlot);
      const perfSamples = await conn.getRecentPerformanceSamples(1);
      if (perfSamples.length > 0) {
        const sample = perfSamples[0];
        setTps(Math.round(sample.numTransactions / sample.samplePeriodSecs));
      }
    } catch {
      // silent fail — metrics are best-effort
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 12000);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  const truncate = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

  return (
    <div className="relative z-20 w-full border-y border-white/[0.06] bg-black/60 backdrop-blur-xl">
      {/* Subtle green glow on top edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#14F195]/40 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-xs sm:text-[13px] text-gray-400">
        {/* Live status */}
        <div className="flex items-center gap-2 text-[#14F195] font-semibold tracking-wide">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14F195] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#14F195]" />
          </span>
          LIVE ON SOLANA DEVNET
        </div>

        <span className="hidden sm:inline text-white/10">|</span>

        {/* Program ID */}
        <a
          href={`${EXPLORER_BASE}/address/${LIVE_PROGRAM_ID}?cluster=devnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-white transition-colors duration-200"
        >
          <span className="text-gray-500">Program</span>
          <span className="text-gray-300">{truncate(LIVE_PROGRAM_ID)}</span>
          <ExternalLink className="w-3 h-3 text-gray-600" />
        </a>

        <span className="hidden sm:inline text-white/10">|</span>

        {/* Token */}
        <a
          href={`${EXPLORER_BASE}/address/${LIVE_TOKEN_MINT}?cluster=devnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-white transition-colors duration-200"
        >
          <span className="text-gray-500">iPAY Token</span>
          <span className="text-gray-300">{truncate(LIVE_TOKEN_MINT)}</span>
          <ExternalLink className="w-3 h-3 text-gray-600" />
        </a>

        <span className="hidden sm:inline text-white/10">|</span>

        {/* Slot */}
        <div className="flex items-center gap-1.5">
          <span className="text-gray-500">Slot</span>
          <span className="text-gray-300 tabular-nums">
            {slot !== null ? slot.toLocaleString() : "---"}
          </span>
        </div>

        <span className="hidden sm:inline text-white/10">|</span>

        {/* TPS */}
        <div className="flex items-center gap-1.5">
          <span className="text-gray-500">TPS</span>
          <span className="text-gray-300 tabular-nums">
            {tps !== null ? tps.toLocaleString() : "---"}
          </span>
        </div>
      </div>

      {/* Bottom edge glow */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#14F195]/20 to-transparent" />
    </div>
  );
}

/* ───────────────────── Intersection Observer Hook ───────────────────── */
function useInView(threshold = 0.1) {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold }
    );
    obs.observe(ref);
    return () => obs.disconnect();
  }, [ref, threshold]);

  return { setRef, visible };
}

/* ───────────────────── Animated Section ───────────────────── */
function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const { setRef, visible } = useInView(0.05);
  return (
    <section
      id={id}
      ref={setRef}
      className={`transition-all duration-1000 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </section>
  );
}

/* ───────────────────── Waitlist Section ───────────────────── */
const ROLE_OPTIONS = [
  { value: "merchant" as const, label: "Soy comerciante" },
  { value: "developer" as const, label: "Soy desarrollador" },
  { value: "investor" as const, label: "Quiero invertir" },
];

function WaitlistSection() {
  const { setRef, visible } = useInView(0.05);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"merchant" | "developer" | "investor">("merchant");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [position, setPosition] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/waitlist")
      .then((r) => r.json())
      .then((d) => setCount(d.count))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name || undefined, role }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Error al registrarte");
        return;
      }

      setStatus("success");
      setPosition(data.position);
      setCount(data.position);
    } catch {
      setStatus("error");
      setErrorMsg("Error de conexión. Intenta de nuevo.");
    }
  };

  return (
    <section
      id="waitlist"
      ref={setRef}
      className={`py-28 px-6 relative transition-all duration-1000 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#14F195]/8 blur-[180px]" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-[#9945FF]/10 blur-[160px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-gray-400 text-sm mb-8">
          <Mail className="w-4 h-4 text-[#14F195]" />
          Early Access
          {count !== null && count > 0 && (
            <span className="ml-1 text-[#14F195] font-medium">
              — {count} {count === 1 ? "registrado" : "registrados"}
            </span>
          )}
        </div>

        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Únete a la{" "}
          <span className="solana-gradient-text">lista de espera</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          S&eacute; de los primeros en usar iPay cuando lancemos.
          Sin costo, sin compromiso.
        </p>

        {status === "success" ? (
          <div className="glass-card rounded-2xl p-8 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full solana-gradient flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              ¡Estás en la lista!
            </h3>
            <p className="text-[#14F195] text-lg font-semibold mb-1">
              Posición #{position}
            </p>
            <p className="text-gray-400 text-sm">
              Te notificaremos cuando iPay esté disponible.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 max-w-md mx-auto space-y-4 text-left">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Email <span className="text-[#9945FF]">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder-gray-500 focus:outline-none focus:border-[#9945FF]/50 focus:ring-1 focus:ring-[#9945FF]/30 transition-all"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Nombre <span className="text-gray-500 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder-gray-500 focus:outline-none focus:border-[#9945FF]/50 focus:ring-1 focus:ring-[#9945FF]/30 transition-all"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                ¿Cómo quieres usar iPay?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ROLE_OPTIONS.map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setRole(opt.value)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-medium border transition-all duration-200 ${
                      role === opt.value
                        ? "border-[#9945FF] bg-[#9945FF]/15 text-white"
                        : "border-white/[0.08] bg-white/[0.03] text-gray-400 hover:border-white/20"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {status === "error" && (
              <p className="text-red-400 text-sm">{errorMsg}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full mt-2 py-3.5 rounded-xl solana-gradient text-white font-semibold text-sm shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Registrando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Unirme a la lista de espera
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*                       iPay — Landing Page                              */
/*                    Apple + Solana Aesthetic                             */
/* ═══════════════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <main className="bg-gray-950 text-gray-100 min-h-screen overflow-hidden font-[var(--font-inter)]">
      {/* ════════════════════ NAVIGATION ════════════════════ */}
      <nav className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
        <div className="glass-nav max-w-5xl w-full rounded-2xl px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-105">
              <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px]">
                <path d="M12 2L8 10h3l-2 12 8-14h-4l3-6z" fill="white" fillOpacity="0.95"/>
              </svg>
            </div>
            <span className="text-[19px] font-extrabold tracking-tight leading-none">iPay</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#currencies" className="hover:text-white transition-colors duration-300">
              Monedas
            </a>
            <a href="#how" className="hover:text-white transition-colors duration-300">
              Como funciona
            </a>
            <a href="#features" className="hover:text-white transition-colors duration-300">
              Features
            </a>
            <a href="#comparison" className="hover:text-white transition-colors duration-300">
              vs Tarjetas
            </a>
            <a href="#roadmap" className="hover:text-white transition-colors duration-300">
              Roadmap
            </a>
            <Link href="/discover" className="hover:text-white transition-colors duration-300">
              Descubrir
            </Link>
            <a href="#waitlist" className="hover:text-white transition-colors duration-300 text-[#14F195]">
              Waitlist
            </a>
            <Link
              href="/pitch"
              className="relative hover:text-white transition-colors duration-300"
            >
              <span className="relative z-10 px-2.5 py-1 rounded-lg border border-purple-500/40 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition-all duration-300">
                Inversores
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/merchant"
              className="hidden sm:inline-flex text-sm px-5 py-2 rounded-xl solana-gradient text-white font-medium shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.03] transition-all duration-300"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* ════════════════════ SECTION 1: HERO ════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16">
        {/* Background ambient glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] rounded-full bg-[#9945FF]/15 blur-[160px] animate-pulse-glow" />
          <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] rounded-full bg-[#14F195]/10 blur-[160px] animate-pulse-glow delay-200" />
          <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-[#9945FF]/8 blur-[140px] animate-pulse-glow delay-400" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Powered by xpandia badge */}
          <a href="https://xpandia.co" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-gray-400 text-sm mb-10 animate-fade-in backdrop-blur-xl hover:border-white/20 transition-colors">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14F195] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#14F195]" />
            </span>
            Powered by <span className="font-semibold text-white">xpandia</span>
          </a>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight leading-[1.05] animate-fade-up">
            <span className="solana-gradient-text">The Future</span>
            <br />
            <span className="text-white">of Payments</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed animate-fade-up delay-200 opacity-0">
            La plataforma global de pagos con wallet que combina pagos instant&aacute;neos,
            loyalty autom&aacute;tico e inteligencia artificial. Para comercios, freelancers
            y personas. Acepta SOL, USDC, EURC y PYUSD con settlement instant&aacute;neo.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 animate-fade-up delay-400 opacity-0">
            <Link href="/merchant" className="btn-gradient text-base">
              <Store className="w-5 h-5" />
              Empezar como Comercio
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/pay"
              className="relative inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-base text-black bg-[#14F195] hover:bg-[#14F195]/90 transition-all shadow-lg shadow-[#14F195]/20 hover:shadow-[#14F195]/30"
            >
              <Send className="w-5 h-5" />
              Enviar un Pago
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/wallet" className="btn-glass text-base">
              <Wallet className="w-5 h-5" />
              Mi Wallet
            </Link>
          </div>

          {/* Demo tip for judges */}
          <p className="mt-5 text-sm text-gray-500 animate-fade-up delay-400 opacity-0">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#14F195]" />
              Tip: Usa Solana devnet con Phantom para probar un pago real &mdash; sin costo
            </span>
          </p>

          {/* macOS Window Mockup — Merchant Dashboard Preview */}
          <div className="mt-20 animate-fade-up delay-600 opacity-0">
            <div className="relative mx-auto max-w-3xl">
              {/* Glow behind window */}
              <div className="absolute -inset-2 solana-gradient rounded-2xl blur-2xl opacity-20" />

              <div className="relative glass-card rounded-2xl overflow-hidden">
                {/* Title bar */}
                <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
                  <div className="mac-dot-red" />
                  <div className="mac-dot-yellow" />
                  <div className="mac-dot-green" />
                  <span className="ml-3 text-xs text-gray-500 font-mono tracking-wide">
                    iPay — Merchant Dashboard
                  </span>
                </div>

                {/* Dashboard content */}
                <div className="p-6 sm:p-8 space-y-6">
                  {/* Top row — Revenue + Badge */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        Revenue Today
                      </p>
                      <p className="text-4xl font-bold tracking-tight text-white">
                        $4,280
                        <span className="text-lg text-gray-600">.50</span>
                      </p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-[#14F195]/10 text-[#14F195] text-sm font-medium">
                      +23.5%
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Transacciones", value: "142", change: "+18%" },
                      { label: "Avg Ticket", value: "$30.14", change: "+5.2%" },
                      { label: "iPAY Rewards", value: "2,840", change: "+142" },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                      >
                        <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                        <p className="text-xl font-semibold text-white">
                          {s.value}
                        </p>
                        <p className="text-xs text-[#14F195]">{s.change}</p>
                      </div>
                    ))}
                  </div>

                  {/* AI suggestion */}
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-[#9945FF]/5 border border-[#9945FF]/10">
                    <Sparkles className="w-5 h-5 text-[#9945FF] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-white">
                        AI Insight
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Tus ventas suben 34% los viernes. Activa &quot;Happy
                        Hour 2x Tokens&quot; para maximizar la retenci&oacute;n.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ LIVE ON-CHAIN METRICS ════════════════════ */}
      <LiveMetrics />

      {/* ════════════════════ SECTION 2: POWERED BY ════════════════════ */}
      <Section className="py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-8">
            Ecosistema de tecnolog&iacute;as
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Solana",
              "USDC",
              "EURC",
              "PYUSD",
              "PayFi",
              "Blinks",
              "Token-2022",
              "AI",
            ].map((tech) => (
              <span
                key={tech}
                className="px-5 py-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-sm text-gray-300 backdrop-blur-sm hover:border-white/[0.15] hover:bg-white/[0.06] transition-all duration-300 cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* ════════════════════ SECTION 3: MULTI-CURRENCY ════════════════════ */}
      <Section id="currencies" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Acepta cualquier{" "}
              <span className="solana-gradient-text">moneda digital</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              iPay soporta las principales stablecoins del ecosistema Solana
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "USDC",
                issuer: "Circle",
                icon: <DollarSign className="w-8 h-8" />,
                color: "#2775CA",
                desc: "D\u00f3lar digital. La stablecoin m\u00e1s usada del mundo. 1 USDC = 1 USD siempre.",
              },
              {
                name: "SOL",
                issuer: "Solana",
                icon: <Zap className="w-8 h-8" />,
                color: "#9945FF",
                desc: "Token nativo de Solana. Pagos ultrarr\u00e1pidos con fees menores a $0.001.",
              },
              {
                name: "EURC",
                issuer: "Circle",
                icon: <Globe className="w-8 h-8" />,
                color: "#14F195",
                desc: "Euro digital. Ideal para comercios europeos y pagos internacionales.",
              },
              {
                name: "PYUSD",
                issuer: "PayPal",
                icon: <BadgeDollarSign className="w-8 h-8" />,
                color: "#0070BA",
                desc: "Stablecoin de PayPal. Conecta el mundo crypto con el ecosistema PayPal.",
              },
            ].map((coin) => (
              <div
                key={coin.name}
                className="glass-card-hover p-6 rounded-2xl group"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: `${coin.color}15`, color: coin.color }}
                >
                  {coin.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {coin.name}
                </h3>
                <p className="text-xs text-gray-500 mb-3">{coin.issuer}</p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {coin.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-sm text-gray-500 max-w-xl mx-auto">
              Visa ya soporta settlements en USDC, EURC, PYUSD y USDG en
              Solana.
            </p>
          </div>
        </div>
      </Section>

      {/* ════════════════════ SECTION 4: ON-RAMP ════════════════════ */}
      <Section id="onramp" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Compra crypto{" "}
              <span className="solana-gradient-text">desde tu banco</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Carga tu wallet directamente con pesos colombianos, mexicanos, o
              cualquier moneda local
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Transferencia bancaria",
                icon: <Building2 className="w-7 h-7" />,
                desc: "PSE (Colombia), SPEI (M\u00e9xico), PIX (Brasil). Transfiere desde tu banco y recibe USDC en tu wallet en minutos.",
              },
              {
                title: "Tarjeta de cr\u00e9dito/d\u00e9bito",
                icon: <CreditCard className="w-7 h-7" />,
                desc: "Visa, Mastercard, American Express. Compra SOL o USDC instant\u00e1neamente con tu tarjeta.",
              },
              {
                title: "Apps locales",
                icon: <Smartphone className="w-7 h-7" />,
                desc: "Nequi, Mercado Pago, Rappi Pay. Carga tu wallet desde las apps que ya usas.",
              },
            ].map((method) => (
              <div
                key={method.title}
                className="glass-card-hover p-8 rounded-2xl"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 bg-[#9945FF]/10 text-[#9945FF]">
                  {method.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  {method.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {method.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Integration banner */}
          <div className="mt-12 glass-card rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Globe className="w-5 h-5 text-[#14F195]" />
              <p className="text-sm font-medium text-white">
                Integraci&oacute;n global
              </p>
            </div>
            <p className="text-sm text-gray-400">
              Integrado con MoonPay, Transak y Ramp Network. 160+ pa&iacute;ses
              soportados.
            </p>
          </div>
        </div>
      </Section>

      {/* ════════════════════ SECTION 5: CÓMO FUNCIONA ════════════════════ */}
      <Section id="how" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-[#14F195] mb-4">
              Proceso
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              C&oacute;mo{" "}
              <span className="solana-gradient-text">funciona</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Tres pasos. Cero complicaciones. Pagos del futuro, hoy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "El comercio crea un cobro",
                icon: <Store className="w-7 h-7" />,
                details: [
                  "Dashboard con AI Assistant integrado",
                  "Genera QR \u00fanico por transacci\u00f3n",
                  "Comparte link por WhatsApp o redes",
                  "Sin POS, sin hardware, sin fricci\u00f3n",
                ],
              },
              {
                step: "02",
                title: "El cliente paga en 3 segundos",
                icon: <Smartphone className="w-7 h-7" />,
                details: [
                  "Abre Phantom y escanea el QR",
                  "O simplemente abre el link compartido",
                  "Confirma con un tap \u2014 listo",
                  "Settlement instant\u00e1neo en ~400ms",
                ],
              },
              {
                step: "03",
                title: "Loyalty autom\u00e1tico + rewards",
                icon: <Gift className="w-7 h-7" />,
                details: [
                  "Smart contract mintea iPAY tokens",
                  "El cliente acumula sin registrarse",
                  "Canjea en toda la red de comercios",
                  "Valor real, no puntos que expiran",
                ],
              },
            ].map((s) => (
              <div key={s.step} className="glass-card-hover p-8 rounded-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl solana-gradient flex items-center justify-center text-white font-bold text-sm">
                    {s.step}
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.05] flex items-center justify-center text-gray-400">
                    {s.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {s.title}
                </h3>
                <ul className="space-y-3">
                  {s.details.map((d) => (
                    <li
                      key={d}
                      className="flex items-start gap-2 text-sm text-gray-400"
                    >
                      <Check className="w-4 h-4 text-[#14F195] flex-shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ════════════════════ SECTION 5.5: USE CASES ════════════════════ */}
      <Section id="usecases" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-[#14F195] mb-4">
              Casos de uso
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Un protocolo,{" "}
              <span className="solana-gradient-text">infinitas posibilidades</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Lo que otros construyen como proyectos separados, iPay lo resuelve con un solo protocolo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: "\uD83C\uDFEA",
                title: "Comercios",
                description:
                  "Acepta pagos crypto con 0.5% de comisi\u00f3n y loyalty autom\u00e1tico para tus clientes",
              },
              {
                icon: "\uD83D\uDCBC",
                title: "Freelancers",
                description:
                  "Escrow protegido: tu cliente deposita, t\u00fa entregas, el pago se libera. Sin Upwork, sin 20%",
              },
              {
                icon: "\uD83D\uDC65",
                title: "P2P Global",
                description:
                  "Env\u00eda dinero a cualquier wallet del mundo. Ambos ganan iPAY tokens",
              },
              {
                icon: "\uD83C\uDFAB",
                title: "Eventos",
                description:
                  "Vende tickets como Blinks. Anti-fraude, anti-reventa, con loyalty incluido",
              },
              {
                icon: "\uD83D\uDD04",
                title: "Suscripciones",
                description:
                  "Cobros recurrentes on-chain. Membres\u00edas, SaaS, servicios \u2014 todo automatizado",
              },
              {
                icon: "\uD83E\uDD1D",
                title: "Partners",
                description:
                  "Integra tu marca al ecosistema. Ofrece descuentos y premios canjeables con iPAY",
              },
              {
                icon: "\uD83D\uDC9D",
                title: "Donaciones",
                description:
                  "Blinks de donaci\u00f3n transparentes. Cada centavo rastreable on-chain",
              },
              {
                icon: "\uD83C\uDF0D",
                title: "Remesas",
                description:
                  "Env\u00eda dinero a tu familia sin bancos, sin fees abusivos, confirmaci\u00f3n instant\u00e1nea",
              },
              {
                icon: "\uD83D\uDEE1\uFE0F",
                title: "Servicios",
                description:
                  "Escrow para cualquier servicio: m\u00e9dico, legal, t\u00e9cnico. Pago solo cuando se entrega",
              },
            ].map((useCase) => (
              <div
                key={useCase.title}
                className="glass-card-hover p-6 rounded-2xl text-center"
              >
                <div className="text-3xl mb-3">{useCase.icon}</div>
                <h3 className="text-base font-semibold text-white mb-2">
                  {useCase.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-500 text-sm mt-10">
            21 instrucciones on-chain. Un protocolo que reemplaza a 10 plataformas.
          </p>
        </div>
      </Section>

      {/* ════════════════════ SECTION 6: PARA NEGOCIOS FÍSICOS ════════════════════ */}
      <Section id="physical" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#14F195] mb-4">
                Punto de Venta
              </p>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                Para negocios{" "}
                <span className="solana-gradient-text">f&iacute;sicos</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Cafeter&iacute;as, restaurantes, tiendas, food trucks. Cualquier
                negocio que quiera aceptar pagos digitales sin hardware costoso.
              </p>

              <div className="space-y-4">
                {[
                  {
                    icon: <QrCode className="w-5 h-5" />,
                    text: "QR en mostrador \u2014 el cliente escanea y paga",
                  },
                  {
                    icon: <MessageSquare className="w-5 h-5" />,
                    text: "Env\u00eda link de pago por WhatsApp en un tap",
                  },
                  {
                    icon: <Sparkles className="w-5 h-5" />,
                    text: "AI Assistant sugiere promos basadas en data",
                  },
                  {
                    icon: <Gift className="w-5 h-5" />,
                    text: "Loyalty autom\u00e1tico sin tarjetas ni stickers",
                  },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-4 text-gray-300"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center text-[#9945FF]">
                      {item.icon}
                    </div>
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Phone mockup */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 solana-gradient rounded-[3rem] blur-2xl opacity-15" />
                <div className="relative w-[280px] glass-card rounded-[2.5rem] overflow-hidden border-2 border-white/[0.1]">
                  {/* Phone notch */}
                  <div className="flex justify-center pt-3 pb-6 bg-white/[0.02]">
                    <div className="w-28 h-6 rounded-full bg-black/80 border border-white/[0.05]" />
                  </div>
                  {/* QR content */}
                  <div className="px-6 pb-8 text-center">
                    <p className="text-xs text-gray-500 mb-2">Caf&eacute; Para&iacute;so</p>
                    <p className="text-2xl font-bold text-white mb-4">
                      $12.50 USDC
                    </p>
                    <div className="w-40 h-40 mx-auto rounded-2xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center mb-4">
                      <QrCode className="w-24 h-24 text-white/40" />
                    </div>
                    <p className="text-[10px] text-gray-600">
                      Escanea con Phantom
                    </p>
                    <div className="mt-4 w-28 h-1 rounded-full bg-white/20 mx-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ════════════════════ SECTION 7: PARA E-COMMERCE ════════════════════ */}
      <Section id="ecommerce" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Checkout mockup */}
            <div className="order-2 md:order-1 flex justify-center">
              <div className="relative max-w-sm w-full">
                <div className="absolute -inset-3 solana-gradient rounded-2xl blur-2xl opacity-10" />
                <div className="relative glass-card rounded-2xl overflow-hidden">
                  <div className="p-6 border-b border-white/[0.06]">
                    <p className="text-xs text-gray-500 mb-1">Tu compra</p>
                    <p className="text-sm text-white">
                      Sneakers Edici&oacute;n Limitada
                    </p>
                    <p className="text-3xl font-bold text-white mt-2">
                      $189.00
                      <span className="text-sm text-gray-500 ml-2">USDC</span>
                    </p>
                  </div>
                  <div className="p-6 space-y-3">
                    <button className="w-full py-4 rounded-2xl solana-gradient text-white font-semibold text-sm flex items-center justify-center gap-2">
                      <Wallet className="w-4 h-4" />
                      Pagar con Solana
                    </button>
                    <div className="flex items-center gap-3 text-[10px] text-gray-600 justify-center">
                      <Shield className="w-3 h-3" />
                      Pago seguro en blockchain
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <p className="text-xs uppercase tracking-[0.25em] text-[#14F195] mb-4">
                Online
              </p>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                Para{" "}
                <span className="solana-gradient-text">e-commerce</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Integra pagos blockchain en tu tienda online con nuestra API, bot&oacute;n web, o links compartibles.
              </p>

              <div className="space-y-4">
                {[
                  {
                    icon: <Code className="w-5 h-5" />,
                    text: "Bot\u00f3n de pago embebible en cualquier web",
                  },
                  {
                    icon: <Link2 className="w-5 h-5" />,
                    text: "Links de pago compartibles por cualquier canal",
                  },
                  {
                    icon: <Cpu className="w-5 h-5" />,
                    text: "Webhooks para confirmaci\u00f3n en tiempo real",
                  },
                  {
                    icon: <Layers className="w-5 h-5" />,
                    text: "API RESTful para integraci\u00f3n custom",
                  },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-4 text-gray-300"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center text-[#9945FF]">
                      {item.icon}
                    </div>
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ════════════════════ SECTION 8: QUÉ NECESITA EL CLIENTE ════════════════════ */}
      <Section id="client" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Qu&eacute; necesita{" "}
              <span className="solana-gradient-text">el cliente</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Tres cosas. Menos de 2 minutos para empezar.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Descargar Phantom",
                desc: "La wallet m\u00e1s popular de Solana. Disponible en iOS, Android y como extensi\u00f3n de navegador.",
                icon: <Wallet className="w-7 h-7" />,
              },
              {
                step: "2",
                title: "Tener SOL o USDC",
                desc: "Compra con tarjeta dentro de Phantom, transfiere desde un exchange, o recarga con on-ramp.",
                icon: <Coins className="w-7 h-7" />,
              },
              {
                step: "3",
                title: "Escanear y pagar",
                desc: "Escanea el QR del comercio o abre el link. Confirma en Phantom. Listo en 3 segundos.",
                icon: <QrCode className="w-7 h-7" />,
              },
            ].map((s) => (
              <div key={s.step} className="glass-card-hover p-8 rounded-2xl text-center">
                <div className="w-14 h-14 rounded-2xl solana-gradient flex items-center justify-center text-white font-bold text-lg mx-auto mb-5">
                  {s.step}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white/[0.05] flex items-center justify-center text-gray-400 mx-auto mb-5">
                  {s.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  {s.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ════════════════════ SECTION 9: FEATURES ════════════════════ */}
      <Section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-[#14F195] mb-4">
              Plataforma
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Features que{" "}
              <span className="solana-gradient-text">importan</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                icon: <Layers className="w-7 h-7" />,
                title: "Multi-Canal",
                desc: "Dashboard web, QR codes, Blinks de Solana, links compartibles, API. Un sistema, todos los canales.",
                color: "#9945FF",
              },
              {
                icon: <Gift className="w-7 h-7" />,
                title: "Loyalty Autom\u00e1tico",
                desc: "Smart contracts que mintean iPAY tokens en cada compra. Sin setup, sin costo extra, sin fricci\u00f3n.",
                color: "#14F195",
              },
              {
                icon: <Sparkles className="w-7 h-7" />,
                title: "AI Assistant",
                desc: "Insights de ventas, sugerencias de promociones, detecci\u00f3n de patrones. Inteligencia artificial al servicio de tu negocio.",
                color: "#9945FF",
              },
              {
                icon: <BarChart3 className="w-7 h-7" />,
                title: "Analytics en Tiempo Real",
                desc: "M\u00e9tricas de ventas, loyalty, clientes y transacciones. Todo en tu dashboard, actualizado al instante.",
                color: "#14F195",
              },
            ].map((f) => (
              <div key={f.title} className="glass-card-hover p-8 rounded-2xl">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: `${f.color}15`, color: f.color }}
                >
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ════════════════════ SECTION 10: COMPARISON TABLE ════════════════════ */}
      <Section id="comparison" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              iPay vs{" "}
              <span className="solana-gradient-text">Tarjetas Tradicionales</span>
            </h2>
            <p className="text-gray-400 text-lg">
              La diferencia es clara.
            </p>
          </div>

          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left p-5 text-gray-500 font-medium" />
                    <th className="p-5 text-gray-400 font-medium text-center">
                      Tarjetas
                    </th>
                    <th className="p-5 text-center">
                      <span className="solana-gradient-text font-bold">
                        iPay
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      label: "Fee por transacci\u00f3n",
                      old: "3-7%",
                      now: "0.5%",
                    },
                    {
                      label: "Settlement",
                      old: "14-30 d\u00edas",
                      now: "Instant\u00e1neo",
                    },
                    {
                      label: "Loyalty",
                      old: "Costoso",
                      now: "Autom\u00e1tico y gratis",
                    },
                    {
                      label: "Hardware",
                      old: "POS $200+",
                      now: "Solo celular",
                    },
                    {
                      label: "Cross-border",
                      old: "Complicado",
                      now: "Autom\u00e1tico",
                    },
                    {
                      label: "Chargebacks",
                      old: "Riesgo merchant",
                      now: "Pagos finales",
                    },
                    {
                      label: "Monedas",
                      old: "Una sola",
                      now: "SOL, USDC, EURC, PYUSD",
                    },
                  ].map((row) => (
                    <tr
                      key={row.label}
                      className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="p-5 text-gray-300 font-medium">
                        {row.label}
                      </td>
                      <td className="p-5 text-center text-gray-500">
                        <span className="inline-flex items-center gap-1.5">
                          <X className="w-4 h-4 text-red-400/60" />
                          {row.old}
                        </span>
                      </td>
                      <td className="p-5 text-center text-white">
                        <span className="inline-flex items-center gap-1.5">
                          <Check className="w-4 h-4 text-[#14F195]" />
                          {row.now}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Section>

      {/* ════════════════════ SECTION 11: IMPACTO Y PROYECCIONES ════════════════════ */}
      <Section id="impact" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-[#14F195] mb-4">
              Visi&oacute;n
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Nuestro impacto{" "}
              <span className="solana-gradient-text">en el mercado</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Proyecciones desde nuestro lanzamiento el 20 de marzo de 2026
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#9945FF]/50 via-[#14F195]/30 to-transparent" />

            <div className="space-y-8">
              {[
                {
                  period: "Q2 2026",
                  metrics: "100 comercios registrados | 10,000 transacciones | $500K en volumen procesado",
                },
                {
                  period: "Q3 2026",
                  metrics: "1,000 comercios | 100,000 transacciones | $5M en volumen | Integraci\u00f3n Shopify",
                },
                {
                  period: "Q4 2026",
                  metrics: "5,000 comercios | 500,000 transacciones | $25M en volumen | Expansi\u00f3n a 5 pa\u00edses LATAM",
                },
                {
                  period: "2027",
                  metrics: "25,000 comercios | 5M transacciones | $200M en volumen | Multi-chain | CRM integrations",
                },
                {
                  period: "2028",
                  metrics: "100,000+ comercios | 50M+ transacciones | $2B+ volumen | Red de loyalty cross-merchant | White-label para bancos",
                },
              ].map((item, i) => (
                <div
                  key={item.period}
                  className={`flex flex-col md:flex-row items-center gap-6 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="flex-1 w-full md:w-auto">
                    <div
                      className={`glass-card-hover p-6 rounded-2xl ${
                        i % 2 === 0 ? "md:mr-8" : "md:ml-8"
                      }`}
                    >
                      <p className="text-sm font-bold solana-gradient-text mb-2">
                        {item.period}
                      </p>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {item.metrics}
                      </p>
                    </div>
                  </div>
                  {/* Center dot */}
                  <div className="hidden md:flex w-4 h-4 rounded-full solana-gradient flex-shrink-0 shadow-lg shadow-purple-500/30" />
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>

          {/* Impact stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
            {[
              {
                stat: "$150M+",
                label: "en fees evitados vs tarjetas tradicionales",
                icon: <DollarSign className="w-6 h-6" />,
              },
              {
                stat: "500M+",
                label: "iPAY tokens de lealtad distribuidos",
                icon: <Coins className="w-6 h-6" />,
              },
              {
                stat: "14d \u2192 0.4s",
                label: "tiempo de settlement ahorrado",
                icon: <Clock className="w-6 h-6" />,
              },
              {
                stat: "10M+",
                label: "usuarios impactados en LATAM",
                icon: <Users className="w-6 h-6" />,
              },
            ].map((item) => (
              <div key={item.stat} className="glass-card p-6 rounded-2xl text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#14F195]/10 flex items-center justify-center text-[#14F195] mx-auto mb-4">
                  {item.icon}
                </div>
                <p className="text-2xl font-bold text-white mb-2">
                  {item.stat}
                </p>
                <p className="text-xs text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ════════════════════ SECTION 12: STATS ════════════════════ */}
      <Section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                value: "$5B+",
                label: "PayFi infrastructure funded",
                icon: <TrendingUp className="w-5 h-5" />,
              },
              {
                value: "57.7M",
                label: "Crypto holders en LATAM",
                icon: <Users className="w-5 h-5" />,
              },
              {
                value: "<$0.001",
                label: "Costo por transacci\u00f3n",
                icon: <Zap className="w-5 h-5" />,
              },
              {
                value: "~400ms",
                label: "Tiempo de settlement",
                icon: <Clock className="w-5 h-5" />,
              },
            ].map((s) => (
              <div key={s.label} className="glass-card p-6 rounded-2xl text-center">
                <div className="text-gray-500 flex justify-center mb-3">
                  {s.icon}
                </div>
                <p className="text-3xl sm:text-4xl font-bold solana-gradient-text mb-2">
                  {s.value}
                </p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ════════════════════ SECTION 13: DISPOSITIVOS ════════════════════ */}
      <Section id="devices" className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Dispositivos{" "}
            <span className="solana-gradient-text">compatibles</span>
          </h2>
          <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto">
            iPay funciona donde t&uacute; est&eacute;s. Sin descargas extra para el comercio.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "iPhone", icon: <Smartphone className="w-8 h-8" />, desc: "iOS 15+" },
              { name: "Android", icon: <Smartphone className="w-8 h-8" />, desc: "Android 10+" },
              {
                name: "Chrome / Brave",
                icon: <Monitor className="w-8 h-8" />,
                desc: "Extension wallet",
              },
              {
                name: "Cualquier browser",
                icon: <Globe className="w-8 h-8" />,
                desc: "Dashboard web",
              },
            ].map((d) => (
              <div
                key={d.name}
                className="glass-card-hover p-6 rounded-2xl flex flex-col items-center gap-3"
              >
                <div className="text-gray-400">{d.icon}</div>
                <p className="text-sm font-medium text-white">{d.name}</p>
                <p className="text-xs text-gray-500">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ════════════════════ SECTION 14: ROADMAP ════════════════════ */}
      <Section id="roadmap" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-[#14F195] mb-4">
              Producto
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              <span className="solana-gradient-text">Roadmap</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              De plataforma a red global de pagos inteligentes.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                period: "Marzo 2026",
                title: "Lanzamiento",
                items: [
                  "Plataforma live en Solana",
                  "Smart contracts desplegados",
                  "Pagos SOL / USDC",
                  "Loyalty autom\u00e1tico (iPAY tokens)",
                  "AI Assistant integrado",
                  "Blinks + QR codes",
                ],
                active: true,
              },
              {
                period: "Mayo 2026",
                title: "Crecimiento",
                items: [
                  "On-ramp integrado (MoonPay / Transak)",
                  "Beta con 100 comercios",
                  "App m\u00f3vil nativa",
                  "Soporte multi-idioma",
                ],
                active: false,
              },
              {
                period: "Q3 2026",
                title: "Expansi\u00f3n LATAM",
                items: [
                  "Mainnet completo",
                  "Shopify plugin",
                  "Partnerships con Bitso",
                  "Soporte EURC / PYUSD",
                  "Webhooks API",
                ],
                active: false,
              },
              {
                period: "Q4 2026",
                title: "Escala",
                items: [
                  "5,000 comercios activos",
                  "CRM connectors (Salesforce, HubSpot)",
                  "Off-ramp a bancos locales",
                  "White-label beta",
                ],
                active: false,
              },
              {
                period: "2027",
                title: "Global",
                items: [
                  "Multi-chain (Ethereum, Base)",
                  "White-label para bancos y fintechs",
                  "Marketplace de AI agents",
                  "25,000+ comercios",
                ],
                active: false,
              },
              {
                period: "2028",
                title: "Network Effects",
                items: [
                  "Red cross-merchant de loyalty",
                  "Governance DAO",
                  "iPAY como token de utilidad global",
                  "100,000+ comercios",
                ],
                active: false,
              },
            ].map((phase) => (
              <div
                key={phase.period}
                className={`glass-card-hover p-6 rounded-2xl relative ${
                  phase.active
                    ? "border-[#14F195]/30 bg-[#14F195]/[0.02]"
                    : ""
                }`}
              >
                {phase.active && (
                  <div className="absolute top-4 right-4">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14F195] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#14F195]" />
                    </span>
                  </div>
                )}
                <p className="text-xs font-bold solana-gradient-text uppercase tracking-wider mb-1">
                  {phase.period}
                </p>
                <h3 className="text-lg font-semibold text-white mb-4">
                  {phase.title}
                </h3>
                <ul className="space-y-2">
                  {phase.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-gray-400"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-[#9945FF] flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ════════════════════ SECTION 15: INTEGRACIONES BANCARIAS ════════════════════ */}
      <Section id="banks" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Conectado con{" "}
              <span className="solana-gradient-text">tu banco</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Integraci&oacute;n directa con los principales bancos y plataformas de pago en LATAM
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                country: "Colombia",
                flag: "\ud83c\udde8\ud83c\uddf4",
                services: ["Bancolombia (Wenia)", "PSE", "Nequi", "Davivienda"],
              },
              {
                country: "M\u00e9xico",
                flag: "\ud83c\uddf2\ud83c\uddfd",
                services: ["SPEI", "Bitso", "Banorte", "OXXO Pay"],
              },
              {
                country: "Brasil",
                flag: "\ud83c\udde7\ud83c\uddf7",
                services: ["PIX", "Nubank", "Mercado Pago"],
              },
              {
                country: "Argentina",
                flag: "\ud83c\udde6\ud83c\uddf7",
                services: ["CBU/CVU", "Mercado Pago", "Ual\u00e1"],
              },
              {
                country: "Global",
                flag: "\ud83c\udf0e",
                services: ["Visa", "Mastercard", "Apple Pay", "Google Pay"],
              },
              {
                country: "On-Ramp",
                flag: "\ud83d\udd17",
                services: ["MoonPay", "Transak", "Ramp Network"],
              },
            ].map((region) => (
              <div key={region.country} className="glass-card p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{region.flag}</span>
                  <h3 className="text-base font-semibold text-white">
                    {region.country}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {region.services.map((service) => (
                    <span
                      key={service}
                      className="px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] text-xs text-gray-400"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-sm text-gray-500 max-w-lg mx-auto">
              Una API, todos los bancos de LATAM. Powered by Bitso Business +
              Alfred Pay.
            </p>
          </div>
        </div>
      </Section>

      {/* ════════════════════ SECTION 16: WAITLIST ════════════════════ */}
      <WaitlistSection />

      {/* ════════════════════ SECTION 17: CTA FINAL ════════════════════ */}
      <Section className="py-32 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Ambient glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#9945FF]/10 blur-[200px]" />
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
              El futuro de los pagos
              <br />
              <span className="solana-gradient-text">empieza hoy</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
              Reg&iacute;strate como comercio en 2 minutos. Sin costo. Sin hardware.
              Sin intermediarios.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/merchant" className="btn-gradient text-base">
                <Store className="w-5 h-5" />
                Crear mi cuenta
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://github.com/xpandia/iPay"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glass text-base"
              >
                <Code className="w-5 h-5" />
                Explorar la tecnolog&iacute;a
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* ════════════════════ SECTION 17: FOOTER ════════════════════ */}
      <footer className="border-t border-white/[0.06] py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
            {/* Producto */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">
                Producto
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "Dashboard", href: "/merchant" },
                  { label: "Pagos", href: "/pay" },
                  { label: "Descubrir", href: "/discover" },
                  { label: "Wallet", href: "/wallet" },
                  { label: "Enviar", href: "/wallet/send" },
                  { label: "Blinks", href: "#" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-white transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Monedas */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">
                Monedas
              </h4>
              <ul className="space-y-3">
                {["SOL", "USDC", "EURC", "PYUSD"].map((coin) => (
                  <li key={coin}>
                    <span className="text-sm text-gray-500">{coin}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Desarrolladores */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">
                Desarrolladores
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "API", href: "#" },
                  {
                    label: "GitHub",
                    href: "https://github.com/xpandia/iPay",
                  },
                  { label: "Documentaci\u00f3n", href: "#" },
                  { label: "Smart Contract", href: "#" },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        link.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="text-sm text-gray-500 hover:text-white transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">
                Empresa
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "Sobre iPay", href: "#" },
                  { label: "Blog", href: "#" },
                  { label: "Contacto", href: "#" },
                  { label: "T\u00e9rminos", href: "/legal/terms" },
                  { label: "Privacidad", href: "/legal/privacy" },
                  { label: "Acuerdo Comercial", href: "/legal/merchant-agreement" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-white transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg solana-gradient flex items-center justify-center font-bold text-white text-[10px]">
                iP
              </div>
              <p className="text-sm text-gray-500">
                &copy; 2026 iPay. Plataforma de pagos inteligentes en Solana.
              </p>
              <a href="https://xpandia.co" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-600 hover:text-gray-400 transition-colors ml-2">
                Powered by <strong className="font-semibold">xpandia</strong>
              </a>
            </div>
            <a
              href="https://explorer.solana.com/address/2DhfCmG1sUiX8ZJc4wZkq42hfbhNf6PPnhR7bXPyxEAc?cluster=devnet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors font-mono"
            >
              Programa: 2DhfCm...xEAc
              <ExternalLink className="w-3 h-3 inline ml-1" />
            </a>
          </div>
        </div>
      </footer>

      {/* ════════════════════ FLOATING INVESTORS BUTTON ════════════════════ */}
      <Link
        href="/pitch"
        className="fixed bottom-6 right-6 z-50 group flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.05] transition-all duration-300"
        style={{
          background: "linear-gradient(135deg, #9945FF 0%, #14F195 100%)",
        }}
      >
        <Rocket className="w-4 h-4" />
        <span>Investor Pitch</span>
        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
      </Link>
    </main>
  );
}
