'use client';

interface ReceiptButtonProps {
  txSignature: string;
  amount: number;
  merchant: string;
  loyaltyEarned: number;
  currency: string;
}

export default function ReceiptButton({
  txSignature,
  amount,
  merchant,
  loyaltyEarned,
  currency,
}: ReceiptButtonProps) {
  const handleClick = () => {
    const params = new URLSearchParams({
      tx: txSignature,
      amount: amount.toString(),
      merchant,
      loyalty: loyaltyEarned.toString(),
      currency,
    });
    window.open(`/api/receipt?${params.toString()}`, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-2xl text-sm font-semibold
                 bg-gradient-to-r from-purple-500/10 to-emerald-500/10
                 border border-white/[0.06] hover:border-white/[0.12]
                 text-gray-300 hover:text-white
                 transition-all duration-200 active:scale-[0.98]"
    >
      {/* Receipt icon */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2-3-2z" />
        <path d="M8 10h8" />
        <path d="M8 14h4" />
        <path d="M8 6h8" />
      </svg>
      Ver Comprobante
    </button>
  );
}
