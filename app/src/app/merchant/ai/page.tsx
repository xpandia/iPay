'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import {
  Send,
  Sparkles,
  ArrowLeft,
  Zap,
  BarChart3,
  QrCode,
  Loader2,
  Wallet,
} from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import ChatMessage from '@/components/ChatMessage';

// ── Types ────────────────────────────────────────────────────────────────────

interface ChatAction {
  type: 'blink' | 'qr' | 'stats';
  url?: string;
  qrUrl?: string;
  solanaActionUrl?: string;
  data?: Record<string, unknown>;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  action?: ChatAction;
  timestamp?: Date;
}

// ── Constants ────────────────────────────────────────────────────────────────

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Hola! Soy tu asistente iPay. Puedo crear **Blinks**, generar QR codes, y mostrarte datos on-chain de tu negocio. En que te ayudo?',
  timestamp: new Date(),
};

const QUICK_ACTIONS = [
  { label: 'Cobro 0.1 SOL', icon: Zap, message: 'Crea un cobro de 0.1 SOL' },
  { label: 'Stats on-chain', icon: BarChart3, message: 'Muestra estadisticas de la plataforma' },
  { label: 'QR 2x puntos', icon: QrCode, message: 'Genera un QR de 0.05 SOL con doble puntos' },
];

// ── Page component ───────────────────────────────────────────────────────────

export default function AIAssistantPage() {
  const { publicKey } = useWallet();
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Welcome animation
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          // Pass the connected wallet as the merchant address
          merchantId: publicKey?.toBase58() || undefined,
        }),
      });

      if (!res.ok) throw new Error('API error');

      const data = await res.json();

      const assistantMessage: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        action: data.action,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content:
          'Lo siento, hubo un error procesando tu solicitud. Intenta de nuevo.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickAction = (message: string) => {
    sendMessage(message);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 font-[family-name:var(--font-geist-sans)]">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="shrink-0 bg-gray-950/80 backdrop-blur-2xl border-b border-white/[0.06] px-5 py-4 flex items-center gap-4 z-10">
        <a
          href="/merchant"
          className="p-2 -ml-2 rounded-xl hover:bg-white/[0.06] transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </a>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center shadow-lg shadow-[#9945FF]/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-semibold bg-gradient-to-r from-[#9945FF] via-[#7B6CFF] to-[#14F195] bg-clip-text text-transparent">
              iPay AI
            </h1>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#14F195] shadow-sm shadow-[#14F195]/50" />
              <span className="text-[11px] text-gray-500 font-medium">
                En linea
              </span>
            </div>
          </div>
        </div>
        {/* Connected wallet indicator */}
        {publicKey && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.05] border border-white/[0.08] rounded-full">
            <Wallet className="w-3 h-3 text-[#14F195]" />
            <span className="text-[10px] text-gray-400 font-mono">
              {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
            </span>
          </div>
        )}
      </header>

      {/* ── Messages area ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-5 scroll-smooth">
        {messages.map((msg, i) => (
          <div
            key={msg.id}
            className={`transition-all duration-700 ease-out ${
              showWelcome && i === 0 ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}
            style={{ transitionDelay: showWelcome ? '200ms' : '0ms' }}
          >
            <ChatMessage
              role={msg.role}
              content={msg.content}
              action={msg.action}
              index={i}
              timestamp={msg.timestamp}
            />
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex gap-3 items-end">
            <div className="bg-white/[0.08] backdrop-blur-xl border border-white/[0.08] rounded-2xl rounded-bl-md px-5 py-3.5">
              <div className="flex gap-1.5">
                <span
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms', animationDuration: '1.4s' }}
                />
                <span
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: '200ms', animationDuration: '1.4s' }}
                />
                <span
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: '400ms', animationDuration: '1.4s' }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Quick actions ───────────────────────────────────────────── */}
      <div className="shrink-0 px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => handleQuickAction(action.message)}
                disabled={isLoading}
                className="shrink-0 flex items-center gap-2 px-4 py-2 text-[13px] font-medium rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] text-gray-300 hover:bg-white/[0.12] hover:text-white hover:border-white/[0.15] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Icon className="w-3.5 h-3.5 text-[#9945FF]" />
                {action.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Input area ──────────────────────────────────────────────── */}
      <div className="shrink-0 bg-gray-950/80 backdrop-blur-2xl border-t border-white/[0.06] px-4 py-3">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-2xl px-4 py-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe un mensaje..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-[15px] text-white placeholder:text-gray-600 focus:outline-none disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white flex items-center justify-center hover:shadow-lg hover:shadow-[#9945FF]/25 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
            aria-label="Enviar mensaje"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>

        <p className="text-center text-[10px] text-gray-700 mt-2 tracking-wide">
          iPay AI · Powered by xpandia
        </p>
      </div>
    </div>
  );
}
