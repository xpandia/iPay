"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useRegisterMerchant } from "@/hooks/useIPayProgram";

const STEPS = [
  { id: 1, title: "Connect Wallet", description: "Link your Solana wallet" },
  { id: 2, title: "Business Details", description: "Tell us about your business" },
  { id: 3, title: "Loyalty Setup", description: "Configure rewards for customers" },
  { id: 4, title: "Launch!", description: "Create your first payment link" },
];

const CATEGORIES = [
  { value: "restaurant", label: "Restaurant & Food", icon: "🍔" },
  { value: "retail", label: "Retail & Shopping", icon: "🛍️" },
  { value: "services", label: "Professional Services", icon: "💼" },
  { value: "freelance", label: "Freelance & Creator", icon: "✨" },
  { value: "ecommerce", label: "E-commerce", icon: "🛒" },
  { value: "saas", label: "SaaS & Software", icon: "💻" },
  { value: "travel", label: "Travel & Hospitality", icon: "✈️" },
  { value: "health", label: "Health & Wellness", icon: "🏥" },
  { value: "education", label: "Education", icon: "📚" },
  { value: "other", label: "Other", icon: "📦" },
];

const MULTIPLIER_OPTIONS = [
  { value: 100, label: "1x Standard", desc: "1,000 iPAY per SOL spent" },
  { value: 200, label: "2x Double", desc: "2,000 iPAY per SOL — great for new businesses" },
  { value: 300, label: "3x Triple", desc: "3,000 iPAY per SOL — attract more customers" },
  { value: 500, label: "5x Premium", desc: "5,000 iPAY per SOL — grand opening special" },
];

export default function OnboardingPage() {
  const { connected, publicKey } = useWallet();
  const { register, loading: registering, error: registerError } = useRegisterMerchant();

  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [multiplier, setMultiplier] = useState(200);
  const [success, setSuccess] = useState(false);

  const canProceedStep2 = businessName.length > 0 && category.length > 0;
  const canProceedStep3 = multiplier > 0;

  const handleRegister = async () => {
    const tx = await register(
      businessName.slice(0, 32),
      description.slice(0, 128) || `${businessName} on iPay`,
      category.slice(0, 32),
      multiplier
    );
    if (tx) {
      setSuccess(true);
      setStep(4);
    }
  };

  // Auto-advance when wallet connects
  if (connected && step === 1) {
    setStep(2);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white flex flex-col items-center justify-center p-6">
      {/* Progress bar */}
      <div className="w-full max-w-2xl mb-12">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step >= s.id
                    ? "bg-green-500 text-white"
                    : "bg-gray-800 text-gray-500"
                }`}
              >
                {step > s.id ? "✓" : s.id}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`w-16 sm:w-24 h-1 mx-2 rounded transition-all ${
                    step > s.id ? "bg-green-500" : "bg-gray-800"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-white">
            {STEPS[step - 1].title}
          </h2>
          <p className="text-sm text-gray-400">{STEPS[step - 1].description}</p>
        </div>
      </div>

      {/* Step content */}
      <div className="w-full max-w-lg">
        {/* Step 1: Connect Wallet */}
        {step === 1 && (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto bg-gray-800 rounded-full flex items-center justify-center text-4xl">
              🔗
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">Connect your Solana wallet</h1>
              <p className="text-gray-400">
                Use Phantom, Solflare, or any Solana wallet to get started
              </p>
            </div>
            <div className="flex justify-center">
              <WalletMultiButton />
            </div>
          </div>
        )}

        {/* Step 2: Business Details */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value.slice(0, 32))}
                placeholder="My Coffee Shop"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">{businessName.length}/32</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 128))}
                placeholder="Best coffee in town"
                rows={2}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                      category === cat.value
                        ? "bg-green-500/20 border-green-500 text-green-400 border"
                        : "bg-gray-800 border border-gray-700 text-gray-300 hover:border-gray-600"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(3)}
              disabled={!canProceedStep2}
              className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-xl transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 3: Loyalty Setup */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <p className="text-gray-400">
                Choose how many iPAY loyalty tokens your customers earn per purchase
              </p>
            </div>

            <div className="space-y-3">
              {MULTIPLIER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setMultiplier(opt.value)}
                  className={`w-full flex items-center justify-between px-4 py-4 rounded-xl text-left transition-all ${
                    multiplier === opt.value
                      ? "bg-green-500/20 border-green-500 border-2"
                      : "bg-gray-800 border border-gray-700 hover:border-gray-600"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-white">{opt.label}</p>
                    <p className="text-sm text-gray-400">{opt.desc}</p>
                  </div>
                  {multiplier === opt.value && (
                    <span className="text-green-400 text-xl">✓</span>
                  )}
                </button>
              ))}
            </div>

            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <p className="text-sm text-gray-400">
                <strong className="text-white">Pro tip:</strong> Higher multipliers attract more
                customers. You can change this anytime from your dashboard.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-gray-800 text-gray-300 font-semibold rounded-xl hover:bg-gray-700 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleRegister}
                disabled={registering || !canProceedStep3}
                className="flex-1 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
              >
                {registering ? "Registering on Solana..." : "Register on Blockchain"}
              </button>
            </div>

            {registerError && (
              <p className="text-red-400 text-sm text-center">{registerError}</p>
            )}
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && success && (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto bg-green-500/20 rounded-full flex items-center justify-center text-5xl animate-bounce">
              🎉
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">You&apos;re Live!</h1>
              <p className="text-gray-400">
                {businessName} is now registered on the Solana blockchain
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-4 text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Business</span>
                <span className="text-white font-semibold">{businessName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Category</span>
                <span className="text-white">{category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Loyalty</span>
                <span className="text-green-400">
                  {multiplier / 100}x multiplier
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Wallet</span>
                <span className="text-white font-mono text-xs">
                  {publicKey?.toBase58().slice(0, 8)}...
                  {publicKey?.toBase58().slice(-8)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href="/merchant"
                className="py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors text-center"
              >
                Go to Dashboard
              </a>
              <a
                href="/merchant/blinks"
                className="py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors text-center"
              >
                Create First Blink
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-xs text-gray-600">
        <p>iPay — The Square of PayFi | Powered by <a href="https://xpandia.co" target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-gray-400 transition-colors">xpandia</a></p>
      </div>
    </div>
  );
}
