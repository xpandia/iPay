'use client';

import { useState, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { getExplorerUrl } from '@/lib/constants';

type SendState = 'idle' | 'sending' | 'success' | 'error';

function isValidPublicKey(value: string): boolean {
  try {
    new PublicKey(value);
    return true;
  } catch {
    return false;
  }
}

export default function SendPage() {
  const { connection } = useConnection();
  const { publicKey, connected, sendTransaction } = useWallet();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'SOL' | 'USDC'>('SOL');
  const [memo, setMemo] = useState('');
  const [state, setState] = useState<SendState>('idle');
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setRecipient(text.trim());
    } catch {
      // Clipboard API not available
    }
  }, []);

  const handleSend = useCallback(async () => {
    if (!publicKey || !sendTransaction) return;
    if (!recipient || !isValidPublicKey(recipient)) {
      setError('Dirección de wallet inválida');
      setState('error');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Monto inválido');
      setState('error');
      return;
    }

    if (currency === 'USDC') {
      setError('Transferencia de USDC próximamente. Usa SOL por ahora.');
      setState('error');
      return;
    }

    setState('sending');
    setError(null);
    setTxSignature(null);

    try {
      const recipientPubkey = new PublicKey(recipient);
      const lamports = Math.round(parsedAmount * LAMPORTS_PER_SOL);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports,
        })
      );

      if (memo.trim()) {
        const { TransactionInstruction } = await import('@solana/web3.js');
        const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');
        transaction.add(
          new TransactionInstruction({
            keys: [{ pubkey: publicKey, isSigner: true, isWritable: true }],
            programId: MEMO_PROGRAM_ID,
            data: Buffer.from(memo.trim(), 'utf-8'),
          })
        );
      }

      const { blockhash } = await connection.getLatestBlockhash('confirmed');
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');

      setTxSignature(signature);
      setState('success');
    } catch (err: any) {
      console.error('Send error:', err);
      setError(err?.message || 'Error al enviar la transacción');
      setState('error');
    }
  }, [publicKey, sendTransaction, recipient, amount, currency, memo, connection]);

  const handleReset = () => {
    setState('idle');
    setRecipient('');
    setAmount('');
    setMemo('');
    setTxSignature(null);
    setError(null);
  };

  // Not connected
  if (!connected || !publicKey) {
    return (
      <div className="relative min-h-screen bg-gray-950 flex flex-col items-center overflow-hidden">
        <div
          className="pointer-events-none absolute top-[-10%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-15 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, #9945FF 0%, #14F195 50%, transparent 70%)',
          }}
        />
        <header className="relative z-10 w-full py-6 flex justify-center">
          <a href="/">
            <span className="text-2xl font-bold tracking-tight solana-gradient-text">iPay</span>
          </a>
        </header>
        <main className="relative z-10 flex-1 flex items-center justify-center px-4">
          <div className="text-center space-y-8 max-w-sm">
            <div className="mx-auto w-20 h-20 rounded-3xl glass-card flex items-center justify-center">
              <svg className="w-9 h-9 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight mb-3">Enviar</h1>
              <p className="text-gray-400 text-sm leading-relaxed">
                Conecta tu wallet para enviar SOL o USDC a cualquier dirección.
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

  // Success state
  if (state === 'success' && txSignature) {
    return (
      <div className="relative min-h-screen bg-gray-950 flex flex-col overflow-hidden">
        <div
          className="pointer-events-none absolute top-[-15%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-15 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, #9945FF 0%, #14F195 50%, transparent 70%)',
          }}
        />
        <header className="relative z-10 w-full py-6 px-6 flex justify-between items-center">
          <a href="/">
            <span className="text-2xl font-bold tracking-tight solana-gradient-text">iPay</span>
          </a>
          <a href="/wallet" className="text-sm text-gray-400 hover:text-white transition-colors">
            Mi Wallet
          </a>
        </header>

        <main className="relative z-10 flex-1 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center space-y-8">
            {/* Success icon */}
            <div className="mx-auto w-24 h-24 rounded-full bg-[#14F195]/10 flex items-center justify-center animate-fade-up">
              <svg className="w-12 h-12 text-[#14F195]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>

            <div className="animate-fade-up" style={{ animationDelay: '100ms' }}>
              <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Enviado</h1>
              <p className="text-gray-400 text-sm">Tu transferencia ha sido confirmada en Solana.</p>
            </div>

            {/* Tx details */}
            <div className="glass-card rounded-2xl p-5 space-y-4 animate-fade-up" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Monto</span>
                <span className="text-sm font-semibold text-white">{amount} {currency}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Destinatario</span>
                <span className="text-xs font-mono text-gray-300">{recipient.slice(0, 8)}...{recipient.slice(-6)}</span>
              </div>
              {memo.trim() && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Memo</span>
                  <span className="text-xs text-gray-300">{memo}</span>
                </div>
              )}
              <div className="border-t border-white/[0.06] pt-3">
                <p className="text-xs text-gray-500 mb-1">Firma de transacción</p>
                <p className="text-xs font-mono text-[#14F195] break-all">{txSignature}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 animate-fade-up" style={{ animationDelay: '300ms' }}>
              <a
                href={getExplorerUrl(txSignature)}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3.5 rounded-2xl text-sm font-semibold text-white text-center"
                style={{ background: 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)' }}
              >
                Ver en Solana Explorer
              </a>
              <button
                onClick={handleReset}
                className="w-full btn-glass py-3.5 rounded-2xl text-sm font-medium text-center"
              >
                Enviar otro
              </button>
              <a
                href="/wallet"
                className="block text-sm text-gray-500 hover:text-gray-300 transition-colors text-center mt-1"
              >
                Volver a Mi Wallet
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Send form
  return (
    <div className="relative min-h-screen bg-gray-950 flex flex-col overflow-hidden">
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
        <a href="/wallet" className="text-sm text-gray-400 hover:text-white transition-colors">
          Mi Wallet
        </a>
      </header>

      <main className="relative z-10 flex-1 px-4 py-4 max-w-lg mx-auto w-full space-y-6">
        {/* Title */}
        <div className="animate-fade-up">
          <a href="/wallet" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-300 transition-colors mb-3">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Mi Wallet
          </a>
          <h1 className="text-3xl font-bold text-white tracking-tight">Enviar</h1>
          <p className="text-gray-500 text-sm mt-1">Transfiere SOL o USDC a cualquier wallet de Solana</p>
        </div>

        {/* Form */}
        <div className="space-y-4 animate-fade-up delay-100 opacity-0" style={{ animationFillMode: 'forwards' }}>
          {/* Recipient */}
          <div className="glass-card rounded-2xl p-4 space-y-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Dirección del destinatario
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={recipient}
                onChange={(e) => { setRecipient(e.target.value); setError(null); setState('idle'); }}
                placeholder="Ej: 7xKX...3nPq"
                className="flex-1 bg-transparent text-white text-sm font-mono placeholder-gray-600 outline-none"
              />
              <button
                onClick={handlePaste}
                className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-xs text-gray-400 hover:text-white hover:bg-white/[0.1] transition-all"
              >
                Pegar
              </button>
            </div>
            {recipient && !isValidPublicKey(recipient) && (
              <p className="text-xs text-red-400">Dirección inválida</p>
            )}
          </div>

          {/* Amount + Currency */}
          <div className="glass-card rounded-2xl p-4 space-y-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Monto
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setError(null); setState('idle'); }}
                placeholder="0.00"
                min="0"
                step="0.001"
                className="flex-1 bg-transparent text-white text-2xl font-bold placeholder-gray-600 outline-none tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              {/* Currency toggle */}
              <div className="flex items-center rounded-xl overflow-hidden border border-white/[0.08]">
                <button
                  onClick={() => setCurrency('SOL')}
                  className={`px-3 py-1.5 text-xs font-semibold transition-all ${
                    currency === 'SOL'
                      ? 'bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white'
                      : 'bg-transparent text-gray-500 hover:text-gray-300'
                  }`}
                >
                  SOL
                </button>
                <button
                  onClick={() => setCurrency('USDC')}
                  className={`px-3 py-1.5 text-xs font-semibold transition-all ${
                    currency === 'USDC'
                      ? 'bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white'
                      : 'bg-transparent text-gray-500 hover:text-gray-300'
                  }`}
                >
                  USDC
                </button>
              </div>
            </div>
          </div>

          {/* Memo */}
          <div className="glass-card rounded-2xl p-4 space-y-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Memo <span className="text-gray-600">(opcional)</span>
            </label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Ej: Pago almuerzo"
              maxLength={280}
              className="w-full bg-transparent text-white text-sm placeholder-gray-600 outline-none"
            />
          </div>

          {/* Error */}
          {state === 'error' && error && (
            <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={state === 'sending' || !recipient || !amount}
            className="w-full py-4 rounded-2xl text-base font-semibold text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: state === 'sending'
                ? 'rgba(255,255,255,0.08)'
                : 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)',
              boxShadow: state !== 'sending' ? '0 8px 32px rgba(153, 69, 255, 0.25)' : 'none',
            }}
          >
            {state === 'sending' ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Enviando...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
                Enviar {currency}
              </span>
            )}
          </button>
        </div>

        {/* Info card */}
        <div className="glass-card rounded-2xl p-4 animate-fade-up delay-200 opacity-0" style={{ animationFillMode: 'forwards' }}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#9945FF]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-[#9945FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Las transferencias de SOL se procesan directamente en Solana con fees menores a $0.001.
                Verifica la dirección antes de enviar — las transacciones son irreversibles.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 pb-6 pt-4 text-center">
        <span className="text-xs text-gray-600 tracking-wide">
          Powered by <a href="https://xpandia.co" target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-400 hover:text-white transition-colors">xpandia</a>
        </span>
      </footer>
    </div>
  );
}
