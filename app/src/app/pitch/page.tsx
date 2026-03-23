"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════
   iPay — Investor Pitch Deck
   Cinematic full-screen presentation with scroll-snap navigation
   ═══════════════════════════════════════════════════════════════ */

// ── Animated counter hook ──
function useCounter(end: number, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(!startOnView);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!startOnView) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!started) return;
    let frame: number;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(ease * end));
      if (p < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [started, end, duration]);

  return { count, ref };
}

// ── Slide wrapper ──
function Slide({
  children,
  id,
  className = "",
}: {
  children: React.ReactNode;
  id: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      className={`relative min-h-screen w-full snap-start snap-always flex items-center justify-center overflow-hidden px-6 py-16 md:px-16 lg:px-24 ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {children}
    </section>
  );
}

// ── Glow orb ──
function Orb({ color, size, top, left, delay = 0 }: { color: string; size: string; top: string; left: string; delay?: number }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        background: color,
        width: size,
        height: size,
        top,
        left,
        filter: "blur(120px)",
        opacity: 0.15,
        animation: `float 8s ease-in-out ${delay}s infinite alternate`,
      }}
    />
  );
}

// ── Competitor row ──
function CompRow({ name, val, desc, better }: { name: string; val: string; desc: string; better: string }) {
  return (
    <div className="grid grid-cols-4 gap-4 py-4 border-b border-white/[0.06] text-sm">
      <div className="font-semibold text-white">{name}</div>
      <div className="text-[#14F195] font-mono">{val}</div>
      <div className="text-gray-400">{desc}</div>
      <div className="text-gray-300">{better}</div>
    </div>
  );
}

// ── Stat card ──
function Stat({ value, label, prefix = "", suffix = "" }: { value: number; label: string; prefix?: string; suffix?: string }) {
  const { count, ref } = useCounter(value);
  return (
    <div className="text-center px-4">
      <span ref={ref} className="block text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-[#9945FF] via-[#14F195] to-[#9945FF] bg-clip-text text-transparent bg-[length:200%] animate-[gradient-shift_4s_ease_infinite]">
        {prefix}{count.toLocaleString()}{suffix}
      </span>
      <span className="block mt-2 text-sm text-gray-400 uppercase tracking-widest">{label}</span>
    </div>
  );
}

// ── Timeline node ──
function Phase({ phase, title, items, done = false }: { phase: string; title: string; items: string[]; done?: boolean }) {
  return (
    <div className="relative pl-8 pb-10 border-l border-white/[0.08] last:border-l-transparent last:pb-0 group">
      <div className={`absolute -left-[9px] top-0 w-[18px] h-[18px] rounded-full border-2 ${done ? "bg-[#14F195] border-[#14F195]" : "bg-transparent border-[#9945FF]"} transition-all group-hover:scale-125`} />
      <span className="text-xs font-mono text-[#9945FF] uppercase tracking-widest">{phase}</span>
      <h4 className="text-lg font-bold text-white mt-1">{title}</h4>
      <ul className="mt-2 space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
            <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${done ? "bg-[#14F195]" : "bg-white/20"}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════ */

export default function PitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const totalSlides = 14;

  // Track current slide via intersection
  useEffect(() => {
    const sections = document.querySelectorAll("[data-slide-index]");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number(e.target.getAttribute("data-slide-index"));
            setCurrentSlide(idx);
          }
        });
      },
      { threshold: 0.5 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const goTo = useCallback((idx: number) => {
    const el = document.getElementById(`slide-${idx}`);
    el?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
      style={{ scrollbarWidth: "none" }}
    >
      {/* ─── Progress dots ─── */}
      <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2.5 mix-blend-difference">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="group relative flex items-center justify-end"
          >
            <span className={`block rounded-full transition-all duration-300 ${currentSlide === i ? "w-7 h-2 bg-white" : "w-2 h-2 bg-white/30 hover:bg-white/60"}`} />
          </button>
        ))}
      </nav>

      {/* ─── Slide counter ─── */}
      <div className="fixed bottom-6 left-6 z-50 font-mono text-xs text-white/30 mix-blend-difference">
        {String(currentSlide + 1).padStart(2, "0")} / {totalSlides}
      </div>

      {/* ═══════════════════════════════════════
          SLIDE 0 — COVER
          ═══════════════════════════════════════ */}
      {/* ─── Breaking news ticker ─── */}
      <div className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-red-600/90 via-red-500/90 to-red-600/90 backdrop-blur-sm border-b border-red-400/30 overflow-hidden">
        <div
          className="flex whitespace-nowrap py-2"
          style={{ animation: "ticker-scroll 30s linear infinite" }}
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-6 px-6 text-xs font-semibold text-white tracking-wide">
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />BREAKING: Mastercard acquires BVNK for $1.8B (Mar 17)</span>
              <span className="text-red-200">|</span>
              <span>Stripe acquired Bridge for $1.1B</span>
              <span className="text-red-200">|</span>
              <span>Rain raised $250M at $1.95B</span>
              <span className="text-red-200">|</span>
              <span>YC now pays in stablecoins</span>
              <span className="text-red-200">|</span>
              <span className="text-yellow-300 font-black">PayFi is the #1 narrative in crypto</span>
              <span className="text-red-200 ml-6">|</span>
            </div>
          ))}
        </div>
      </div>

      <section
        id="slide-0"
        data-slide-index={0}
        className="relative min-h-screen w-full snap-start snap-always flex items-center justify-center overflow-hidden"
      >
        <Orb color="#9945FF" size="600px" top="-200px" left="-200px" />
        <Orb color="#14F195" size="500px" top="60%" left="70%" delay={2} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(153,69,255,0.08),transparent_70%)]" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs text-gray-400 mb-8 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#14F195] animate-pulse" />
            Live on Solana Devnet
          </div>

          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] font-black tracking-tight leading-[0.9]">
            <span className="block bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">iPay</span>
          </h1>

          <p className="mt-3 text-sm text-gray-500 font-medium tracking-widest uppercase">
            A <a href="https://xpandia.co" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">xpandia</a> company
          </p>

          <p className="mt-6 text-xl sm:text-2xl md:text-3xl font-light text-gray-300 tracking-tight">
            The <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent font-semibold">Square of PayFi</span>
          </p>

          <p className="mt-4 text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
            Payments + Loyalty + AI on Solana — Built for Latin America
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="https://ipay.xpandia.co" target="_blank" className="px-8 py-3.5 rounded-full font-semibold text-sm text-black bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:opacity-90 transition-opacity">
              Live Demo →
            </Link>
            <Link href="https://github.com/xpandia/iPay" target="_blank" className="px-8 py-3.5 rounded-full font-semibold text-sm text-white border border-white/20 hover:border-white/40 transition-colors bg-white/[0.03]">
              GitHub
            </Link>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
            <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent animate-pulse" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SLIDE 1 — THE PROBLEM
          ═══════════════════════════════════════ */}
      <Slide id="slide-1">
        <div data-slide-index={1} className="w-full max-w-5xl">
          <span className="text-xs font-mono text-[#9945FF] uppercase tracking-[0.3em]">The Problem</span>
          <h2 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
            LATAM merchants are <br />
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">bleeding money.</span>
          </h2>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: "3–7%", label: "Payment processor fees", sub: "vs 0.5% with iPay" },
              { num: "14–30", label: "Days to receive settlement", sub: "vs sub-second with Solana" },
              { num: "130M", label: "Unbanked adults in LATAM", sub: "Zero access to digital payments" },
            ].map((item, i) => (
              <div key={i} className="relative p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm group hover:border-red-500/20 transition-colors">
                <div className="text-4xl sm:text-5xl font-black text-white">{item.num}</div>
                <div className="mt-2 text-sm font-medium text-gray-300">{item.label}</div>
                <div className="mt-1 text-xs text-gray-500">{item.sub}</div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-lg text-gray-400 max-w-2xl">
            Latin American merchants lose <span className="text-white font-semibold">$21B+ annually</span> in payment processing fees.
            Settlement delays cripple cash flow. And 130 million people remain completely locked out of digital commerce.
          </p>
        </div>
      </Slide>

      {/* ═══════════════════════════════════════
          SLIDE 2 — THE SOLUTION
          ═══════════════════════════════════════ */}
      <Slide id="slide-2">
        <div data-slide-index={2} className="w-full max-w-5xl">
          <span className="text-xs font-mono text-[#14F195] uppercase tracking-[0.3em]">The Solution</span>
          <h2 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
            One platform.<br />
            <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">Five capabilities.</span>
          </h2>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { icon: "⚡", title: "Instant Payments", desc: "Sub-second settlement, 0.5% fees" },
              { icon: "🎁", title: "Auto Loyalty", desc: "iPAY tokens minted on every transaction" },
              { icon: "🤖", title: "AI Assistant", desc: "AI-powered payment management" },
              { icon: "🔗", title: "Solana Blinks", desc: "Shareable payment links anywhere" },
              { icon: "💱", title: "Multi-currency", desc: "SOL, USDC, EURC, PYUSD" },
            ].map((item, i) => (
              <div
                key={i}
                className="relative p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm group hover:border-[#9945FF]/30 transition-all hover:-translate-y-1"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-white text-sm">{item.title}</h3>
                <p className="mt-1 text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-2xl border border-[#14F195]/10 bg-[#14F195]/[0.02]">
            <p className="text-sm text-gray-300 text-center">
              <span className="text-[#14F195] font-bold">Key differentiator:</span> No one else combines Blinks + Loyalty + AI on Solana. iPay is the <span className="text-white font-semibold">ONLY</span> platform.
            </p>
          </div>
        </div>
      </Slide>

      {/* ═══════════════════════════════════════
          SLIDE 3 — MARKET OPPORTUNITY
          ═══════════════════════════════════════ */}
      <Slide id="slide-3">
        <div data-slide-index={3} className="w-full max-w-5xl">
          <Orb color="#9945FF" size="400px" top="10%" left="-10%" />
          <span className="text-xs font-mono text-[#9945FF] uppercase tracking-[0.3em]">Market Opportunity</span>
          <h2 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
            <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">$730B</span> and growing.
          </h2>

          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Stat value={730} suffix="B" label="LATAM Crypto Volume" prefix="$" />
            <Stat value={324} suffix="B" label="Stablecoin Volume" prefix="$" />
            <Stat value={57} suffix="M" label="LATAM Crypto Users" />
            <Stat value={89} suffix="%" label="Stablecoin YoY Growth" />
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-1">
            {[
              { label: "TAM", value: "$10T", desc: "Global payments" },
              { label: "SAM", value: "$730B", desc: "LATAM crypto" },
              { label: "SOM", value: "$5B", desc: "LATAM merchant crypto payments" },
            ].map((item, i) => (
              <div key={i} className="relative p-6 bg-white/[0.02] border border-white/[0.04] first:rounded-l-2xl last:rounded-r-2xl text-center">
                <div className="text-xs text-gray-500 uppercase tracking-widest">{item.label}</div>
                <div className="text-3xl font-black text-white mt-2">{item.value}</div>
                <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </Slide>

      {/* ═══════════════════════════════════════
          SLIDE 4 — HOW IT WORKS
          ═══════════════════════════════════════ */}
      <Slide id="slide-4">
        <div data-slide-index={4} className="w-full max-w-5xl">
          <span className="text-xs font-mono text-[#14F195] uppercase tracking-[0.3em]">How It Works</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-black text-white leading-tight">Three steps. Zero complexity.</h2>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xs font-mono text-[#9945FF] uppercase tracking-[0.2em] mb-6">For Merchants</h3>
              {[
                { step: "01", title: "Register", desc: "Connect Solana wallet, set loyalty multiplier, go live in 60 seconds" },
                { step: "02", title: "Create", desc: "\"Create a $50 payment with double rewards\" — AI generates your Blink instantly" },
                { step: "03", title: "Earn", desc: "Share via WhatsApp, QR, or widget. Get paid in sub-seconds. 0.5% fee." },
              ].map((item, i) => (
                <div key={i} className="flex gap-5 mb-8">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#9945FF]/20 to-[#14F195]/20 border border-white/[0.06] flex items-center justify-center font-mono text-sm text-white/60">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{item.title}</h4>
                    <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-xs font-mono text-[#14F195] uppercase tracking-[0.2em] mb-6">For Consumers</h3>
              {[
                { step: "01", title: "Click or Scan", desc: "Open a Blink link or scan QR code — no app download needed" },
                { step: "02", title: "Pay", desc: "Connect wallet, pay in SOL or USDC — confirmed in 400ms" },
                { step: "03", title: "Earn Rewards", desc: "iPAY loyalty tokens minted automatically. No extra steps." },
              ].map((item, i) => (
                <div key={i} className="flex gap-5 mb-8">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#14F195]/20 to-[#9945FF]/20 border border-white/[0.06] flex items-center justify-center font-mono text-sm text-white/60">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{item.title}</h4>
                    <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Slide>

      {/* ═══════════════════════════════════════
          SLIDE 5 — TECHNOLOGY
          ═══════════════════════════════════════ */}
      <Slide id="slide-5">
        <div data-slide-index={5} className="w-full max-w-5xl">
          <span className="text-xs font-mono text-[#9945FF] uppercase tracking-[0.3em]">Technology</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-black text-white leading-tight">
            <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">21</span> on-chain instructions.
          </h2>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { cat: "Payments", items: ["process_payment (SOL)", "process_payment_spl", "payment_with_tip", "split_payment"], color: "#9945FF" },
              { cat: "Escrow", items: ["create_escrow", "release_escrow", "dispute_escrow", "resolve_dispute"], color: "#14F195" },
              { cat: "Subscriptions", items: ["create_subscription", "execute_payment", "cancel_subscription"], color: "#FF6B6B" },
              { cat: "Loyalty", items: ["auto-mint (hooks)", "redeem_loyalty", "stake_loyalty", "unstake_loyalty"], color: "#FFD93D" },
            ].map((group, i) => (
              <div key={i} className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: group.color }} />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{group.cat}</span>
                </div>
                {group.items.map((item, j) => (
                  <div key={j} className="text-xs text-gray-500 font-mono py-1 border-b border-white/[0.03] last:border-0">
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Frontend", value: "Next.js 14", sub: "30 routes" },
              { label: "APIs", value: "7 REST", sub: "Rate limited" },
              { label: "AI", value: "LLM", sub: "Integrated" },
              { label: "Security", value: "6 patches", sub: "Audited" },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.01] text-center">
                <div className="text-lg font-bold text-white">{item.value}</div>
                <div className="text-xs text-gray-500">{item.label} · {item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </Slide>

      {/* ═══════════════════════════════════════
          SLIDE 6 — COMPETITIVE LANDSCAPE
          ═══════════════════════════════════════ */}
      <Slide id="slide-6">
        <div data-slide-index={6} className="w-full max-w-5xl">
          <span className="text-xs font-mono text-[#14F195] uppercase tracking-[0.3em]">Competitive Landscape</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-black text-white leading-tight">
            We stand <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">alone.</span>
          </h2>

          <div className="mt-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            <div className="grid grid-cols-4 gap-4 px-6 py-3 border-b border-white/[0.06] text-xs text-gray-500 uppercase tracking-wider">
              <div>Company</div><div>Valuation</div><div>Focus</div><div>iPay Advantage</div>
            </div>
            <div className="px-6">
              <CompRow name="Bridge (Stripe)" val="$1.1B" desc="Stablecoin infra" better="+ Loyalty + AI + Blinks" />
              <CompRow name="Rain" val="$1.95B" desc="Stablecoin cards" better="+ Loyalty + AI + SMBs" />
              <CompRow name="Mesh" val="$482M" desc="Crypto payments" better="+ Loyalty + LATAM focus" />
              <CompRow name="Blackbird" val="~$300M" desc="Restaurant loyalty" better="Multi-vertical + AI" />
              <CompRow name="Huma Finance" val="~$200M" desc="PayFi lending" better="Consumer-facing + loyalty" />
              <CompRow name="Helio" val="MoonPay acq." desc="Solana payments" better="+ Loyalty + AI + escrow" />
            </div>
          </div>
        </div>
      </Slide>

      {/* ═══════════════════════════════════════
          SLIDE 7 — UNIT ECONOMICS
          ═══════════════════════════════════════ */}
      <Slide id="slide-7">
        <div data-slide-index={7} className="w-full max-w-5xl">
          <span className="text-xs font-mono text-[#9945FF] uppercase tracking-[0.3em]">Unit Economics</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-black text-white leading-tight">
            <span className="bg-gradient-to-r from-[#14F195] to-[#9945FF] bg-clip-text text-transparent">99.2%</span> gross margin.
          </h2>

          <div className="mt-12 grid grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { metric: "Cost per tx", value: "$0.004", note: "Solana network fee" },
              { metric: "Revenue per $100 tx", value: "$0.50", note: "0.5% platform fee" },
              { metric: "Gross margin", value: "99.2%", note: "Near-zero marginal cost" },
              { metric: "Merchant CAC", value: "$20–50", note: "Target acquisition cost" },
              { metric: "Merchant LTV", value: "$500–5K", note: "12-month lifetime value" },
              { metric: "LTV:CAC", value: "25–100x", note: "Best-in-class ratio" },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <div className="text-xs text-gray-500 uppercase tracking-wider">{item.metric}</div>
                <div className="text-3xl font-black text-white mt-2">{item.value}</div>
                <div className="text-xs text-gray-500 mt-1">{item.note}</div>
              </div>
            ))}
          </div>
        </div>
      </Slide>

      {/* ═══════════════════════════════════════
          SLIDE 8 — BUSINESS MODEL
          ═══════════════════════════════════════ */}
      <Slide id="slide-8">
        <div data-slide-index={8} className="w-full max-w-5xl">
          <span className="text-xs font-mono text-[#14F195] uppercase tracking-[0.3em]">Business Model</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-black text-white leading-tight">
            Built to <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">scale.</span>
          </h2>

          <div className="mt-12 space-y-3">
            {[
              { tier: "Starter", fee: "0%", target: "Freelancers · up to $1K/mo", color: "#6B7280", purpose: "User acquisition" },
              { tier: "Business", fee: "0.5%", target: "SMBs · $1K–$50K/mo", color: "#9945FF", purpose: "Core revenue" },
              { tier: "Pro", fee: "0.3% + $49/mo", target: "Medium business · AI features", color: "#14F195", purpose: "Upsell" },
              { tier: "Enterprise", fee: "Custom 0.2%", target: "Large merchants · Full API", color: "#FFD93D", purpose: "High-value" },
              { tier: "White-label", fee: "License", target: "Banks & fintechs", color: "#FF6B6B", purpose: "B2B enterprise" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-5 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:border-white/[0.1] transition-colors">
                <div className="w-2 h-full min-h-[40px] rounded-full" style={{ background: item.color }} />
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                  <div className="font-bold text-white">{item.tier}</div>
                  <div className="font-mono text-sm text-[#14F195]">{item.fee}</div>
                  <div className="text-sm text-gray-400">{item.target}</div>
                  <div className="text-xs text-gray-500">{item.purpose}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Slide>

      {/* ═══════════════════════════════════════
          SLIDE 9 — TRACTION
          ═══════════════════════════════════════ */}
      <Slide id="slide-9">
        <div data-slide-index={9} className="w-full max-w-5xl">
          <Orb color="#14F195" size="400px" top="20%" left="80%" delay={1} />
          <span className="text-xs font-mono text-[#9945FF] uppercase tracking-[0.3em]">Traction</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-black text-white leading-tight">
            Built in <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">4 days.</span>
          </h2>

          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Stat value={21} label="On-chain instructions" />
            <Stat value={30} label="Frontend routes" />
            <Stat value={7} label="REST APIs" />
            <Stat value={56} label="Files shipped" />
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <h3 className="font-bold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                {["Smart contract deployed on Solana devnet", "17 pages: dashboard, checkout, AI, analytics, developer portal", "7 APIs with rate limiting & security hardening", "Legal: ToS, Privacy Policy, Merchant Agreement", "Live demo: ipay.xpandia.co"].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#14F195] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <h3 className="font-bold text-white mb-4">Documentation</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                {["Complete business plan (5-phase roadmap)", "Tokenomics (anti-speculation, utility-only)", "Compliance roadmap for 13 jurisdictions ($720K budget)", "Global expansion report (competitive, market, regulatory)", "4 audit reports (business, legal, market, UX)"].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#9945FF] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Slide>

      {/* ═══════════════════════════════════════
          SLIDE 10 — ROADMAP
          ═══════════════════════════════════════ */}
      <Slide id="slide-10">
        <div data-slide-index={10} className="w-full max-w-5xl">
          <span className="text-xs font-mono text-[#14F195] uppercase tracking-[0.3em]">Roadmap</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-black text-white leading-tight mb-12">
            From hackathon to <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">$2B TPV.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
            <div>
              <Phase phase="Phase 1 — Mar 2026" title="Hackathon MVP" done items={["21 on-chain instructions", "Full frontend + 7 APIs", "AI merchant assistant", "Live on devnet"]} />
              <Phase phase="Phase 2 — Apr–Aug 2026" title="Incubation & Beta" items={["Security audit", "Beta with 20-50 merchants (Colombia)", "Fiat on/off-ramp (Bridge/Circle)", "KYC/AML integration (Metamap)"]} />
            </div>
            <div>
              <Phase phase="Phase 3 — Q3-Q4 2026" title="LATAM Launch" items={["Mainnet deploy, 500 merchants", "Shopify plugin", "Nequi/Bitso partnerships", "$5M TPV milestone"]} />
              <Phase phase="Phase 4 — 2027" title="Scale" items={["Mexico + Brazil expansion", "50K merchants, $2B TPV", "Multi-chain (Base, ETH L2s)", "Series A: $15-25M"]} />
            </div>
          </div>
        </div>
      </Slide>

      {/* ═══════════════════════════════════════
          SLIDE 11 — WHY NOW
          ═══════════════════════════════════════ */}
      <Slide id="slide-11">
        <div data-slide-index={11} className="w-full max-w-5xl">
          <span className="text-xs font-mono text-[#9945FF] uppercase tracking-[0.3em]">Why Now</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-black text-white leading-tight">
            Perfect <span className="bg-gradient-to-r from-[#FFD93D] to-[#FF6B6B] bg-clip-text text-transparent">timing.</span>
          </h2>

          <div className="mt-12 space-y-4">
            {[
              { date: "Mar 17, 2026", event: "Mastercard acquires BVNK", amount: "$1.8B", note: "Stablecoin infra" },
              { date: "Feb 2025", event: "Stripe acquires Bridge", amount: "$1.1B", note: "Stablecoin orchestration" },
              { date: "Mar 2026", event: "Rain Series C", amount: "$250M", note: "$1.95B valuation" },
              { date: "2025", event: "YC offers funding in stablecoins", amount: "$500K", note: "Instead of wire transfers" },
              { date: "Q4 2025", event: "Record crypto VC quarter", amount: "$8.5B", note: "3-year high" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-6 p-5 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <span className="text-xs font-mono text-gray-500 w-28 flex-shrink-0">{item.date}</span>
                <span className="text-sm text-white flex-1">{item.event}</span>
                <span className="text-lg font-black text-[#14F195] w-24 text-right">{item.amount}</span>
                <span className="text-xs text-gray-500 w-40 text-right hidden md:block">{item.note}</span>
              </div>
            ))}
          </div>

          <p className="mt-10 text-base text-gray-400 max-w-3xl">
            The smart money is betting <span className="text-white font-semibold">massively</span> on stablecoin payment infrastructure.
            <span className="text-[#14F195]"> PayFi</span> is the concept created by Lily Liu, President of Solana Foundation. iPay is PayFi.
          </p>

          {/* Urgency callout */}
          <div className="mt-8 p-6 rounded-2xl border-2 border-red-500/40 bg-red-500/[0.06] backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-black text-red-400 uppercase tracking-wider">The Acquisition Window is NOW</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Companies building stablecoin payment infrastructure are being acquired at <span className="text-white font-bold">$1-2B valuations</span>.
              iPay is the <span className="text-red-400 font-bold">ONLY</span> platform combining payments + loyalty + AI on Solana
              for the <span className="text-white font-bold">fastest-growing crypto market in the world</span>.
              This window will not stay open.
            </p>
          </div>
        </div>
      </Slide>

      {/* ═══════════════════════════════════════
          SLIDE 12 — THE ASK
          ═══════════════════════════════════════ */}
      <Slide id="slide-12">
        <div data-slide-index={12} className="w-full max-w-5xl">
          <Orb color="#9945FF" size="500px" top="50%" left="60%" delay={1} />
          <span className="text-xs font-mono text-[#14F195] uppercase tracking-[0.3em]">The Ask</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-black text-white leading-tight">
            Seeking <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">incubation + seed.</span>
          </h2>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl border border-[#9945FF]/20 bg-[#9945FF]/[0.03]">
              <h3 className="text-lg font-bold text-white mb-6">Use of Funds</h3>
              {[
                { label: "Engineering", pct: 40, color: "#9945FF" },
                { label: "BD & Sales", pct: 25, color: "#14F195" },
                { label: "Compliance", pct: 15, color: "#FFD93D" },
                { label: "Operations", pct: 10, color: "#FF6B6B" },
                { label: "Reserve", pct: 10, color: "#6B7280" },
              ].map((item, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{item.label}</span>
                    <span className="text-white font-mono">{item.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${item.pct}%`, background: item.color }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <div className="text-xs text-gray-500 uppercase tracking-wider">Seed Target</div>
                <div className="text-3xl font-black text-white mt-1">$10–15M</div>
                <div className="text-xs text-gray-500 mt-1">Pre-money valuation</div>
              </div>
              <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <div className="text-xs text-gray-500 uppercase tracking-wider">Series A (w/ $50M+ TPV)</div>
                <div className="text-3xl font-black text-white mt-1">$100–150M</div>
                <div className="text-xs text-gray-500 mt-1">Pre-money valuation target</div>
              </div>
              <div className="p-6 rounded-2xl border border-[#14F195]/10 bg-[#14F195]/[0.02]">
                <div className="text-xs text-[#14F195] uppercase tracking-wider">Acquisition Comps</div>
                <div className="text-sm text-gray-300 mt-2">Bridge $1.1B · BVNK $1.8B · Rain $1.95B</div>
              </div>
            </div>
          </div>
        </div>
      </Slide>

      {/* ═══════════════════════════════════════
          SLIDE 13 — TEAM & CLOSE
          ═══════════════════════════════════════ */}
      <section
        id="slide-13"
        data-slide-index={13}
        className="relative min-h-screen w-full snap-start snap-always flex items-center justify-center overflow-hidden px-6"
      >
        <Orb color="#9945FF" size="600px" top="30%" left="20%" />
        <Orb color="#14F195" size="500px" top="60%" left="70%" delay={3} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,241,149,0.05),transparent_70%)]" />

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <span className="text-xs font-mono text-[#9945FF] uppercase tracking-[0.3em]">Team</span>

          <div className="mt-8 inline-flex items-center gap-5 p-6 pr-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center text-2xl font-black text-white">
              D
            </div>
            <div className="text-left">
              <div className="font-bold text-white text-lg">Daniel Ospina</div>
              <div className="text-sm text-gray-400">Founder & Lead Developer</div>
              <div className="text-xs text-gray-500 mt-1">Full-stack · Solana builder · LATAM fintech</div>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[0.9]">
              <span className="bg-gradient-to-r from-[#9945FF] via-[#14F195] to-[#9945FF] bg-clip-text text-transparent bg-[length:200%] animate-[gradient-shift_4s_ease_infinite]">
                iPay is PayFi<br />for LATAM.
              </span>
            </h2>

            <p className="mt-6 text-lg text-gray-400">
              Instant payments. Automatic loyalty. Artificial intelligence.<br />
              All on Solana. All open source.
            </p>

            <p className="mt-4 text-base font-semibold text-white/80">
              Built by <a href="https://xpandia.co" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent hover:opacity-80 transition-opacity">xpandia</a> — Building the financial infrastructure LATAM deserves.
            </p>

            <p className="mt-6 text-2xl sm:text-3xl font-black text-white">
              4 days of building. <span className="bg-gradient-to-r from-[#FFD93D] to-[#FF6B6B] bg-clip-text text-transparent">$1.8B of validation.</span>
            </p>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link href="https://ipay.xpandia.co" target="_blank" className="px-14 py-5 rounded-full font-bold text-base text-black bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-[#9945FF]/25">
              Try Live Demo
            </Link>
            <Link href="https://github.com/xpandia/iPay" target="_blank" className="px-14 py-5 rounded-full font-bold text-base text-white border-2 border-white/30 hover:border-white/60 transition-all hover:scale-105 bg-white/[0.03]">
              View Source
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-xs text-gray-500">
            <span>ipay.xpandia.co</span>
            <span className="w-1 h-1 rounded-full bg-gray-700" />
            <span>github.com/xpandia/iPay</span>
            <span className="w-1 h-1 rounded-full bg-gray-700" />
            <span>daniel@xpandia.co</span>
          </div>

          <div className="mt-6 text-sm text-gray-500 font-medium">
            A{' '}
            <a href="https://xpandia.co" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors font-bold">
              xpandia
            </a>
            {' '}company · xpandia.co
          </div>
        </div>
      </section>
    </div>
  );
}
