"use client";

import { useConnection, useWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, Program, BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  PROGRAM_ID,
  getProgram,
  getPlatformPDA,
  getMerchantPDA,
  getPaymentPDA,
  fetchPlatform,
  fetchMerchant,
  fetchLoyaltyBalance,
  registerMerchant as registerMerchantTx,
  processPayment as processPaymentTx,
  redeemLoyalty as redeemLoyaltyTx,
  updateMerchant as updateMerchantTx,
  processRefund as processRefundTx,
  releaseEscrow as releaseEscrowTx,
  unstakeLoyalty as unstakeLoyaltyTx,
} from "@/lib/program";
import IDL from "@/lib/ipay_protocol.json";

// ============================================================================
// useIPayProgram — Core hook for program interaction
// ============================================================================
export function useIPayProgram() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const provider = useMemo(() => {
    if (!wallet) return null;
    return new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });
  }, [connection, wallet]);

  const program = useMemo(() => {
    if (!provider) return null;
    return getProgram(provider);
  }, [provider]);

  return { program, provider, connection };
}

// ============================================================================
// usePlatform — Fetch platform state
// ============================================================================
export function usePlatform() {
  const { connection } = useConnection();
  const [platform, setPlatform] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPlatform(connection);
      setPlatform(data);
    } catch (e) {
      console.error("Failed to fetch platform:", e);
    }
    setLoading(false);
  }, [connection]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { platform, loading, refresh };
}

// ============================================================================
// useMerchant — Fetch merchant state for connected wallet
// ============================================================================
export function useMerchant() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [merchant, setMerchant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);

  const refresh = useCallback(async () => {
    if (!publicKey) {
      setMerchant(null);
      setIsRegistered(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchMerchant(connection, publicKey);
      setMerchant(data);
      setIsRegistered(data !== null);
    } catch {
      setMerchant(null);
      setIsRegistered(false);
    }
    setLoading(false);
  }, [connection, publicKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { merchant, loading, isRegistered, refresh };
}

// ============================================================================
// useLoyaltyBalance — Fetch iPAY token balance
// ============================================================================
export function useLoyaltyBalance() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { platform } = usePlatform();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!publicKey || !platform) {
      setBalance(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const bal = await fetchLoyaltyBalance(
        connection,
        publicKey,
        new PublicKey(platform.loyaltyMint)
      );
      setBalance(bal);
    } catch {
      setBalance(0);
    }
    setLoading(false);
  }, [connection, publicKey, platform]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { balance, loading, refresh };
}

// ============================================================================
// useRegisterMerchant — Register merchant on-chain
// ============================================================================
export function useRegisterMerchant() {
  const { program } = useIPayProgram();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(
    async (name: string, description: string, category: string, loyaltyMultiplier: number) => {
      if (!program || !publicKey) {
        setError("Wallet not connected");
        return null;
      }
      setLoading(true);
      setError(null);
      try {
        const tx = await registerMerchantTx(
          program,
          publicKey,
          name,
          description,
          category,
          loyaltyMultiplier
        );
        setLoading(false);
        return tx;
      } catch (e: any) {
        setError(e.message || "Registration failed");
        setLoading(false);
        return null;
      }
    },
    [program, publicKey]
  );

  return { register, loading, error };
}

// ============================================================================
// useProcessPayment — Process payment on-chain
// ============================================================================
export function useProcessPayment() {
  const { program } = useIPayProgram();
  const { publicKey } = useWallet();
  const { platform } = usePlatform();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pay = useCallback(
    async (merchantOwner: PublicKey, amountLamports: BN, memo: string) => {
      if (!program || !publicKey || !platform) {
        setError("Not ready");
        return null;
      }
      setLoading(true);
      setError(null);
      try {
        const tx = await processPaymentTx(
          program,
          publicKey,
          merchantOwner,
          amountLamports,
          memo,
          new PublicKey(platform.authority),
          new PublicKey(platform.loyaltyMint),
          new BN(platform.paymentCounter)
        );
        setLoading(false);
        return tx;
      } catch (e: any) {
        setError(e.message || "Payment failed");
        setLoading(false);
        return null;
      }
    },
    [program, publicKey, platform]
  );

  return { pay, loading, error };
}

// ============================================================================
// useRedeemLoyalty — Redeem (burn) iPAY tokens on-chain
// ============================================================================
export function useRedeemLoyalty() {
  const { program } = useIPayProgram();
  const { publicKey } = useWallet();
  const { platform } = usePlatform();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redeem = useCallback(
    async (amount: BN, merchantOwner?: PublicKey) => {
      if (!program || !publicKey || !platform) {
        setError("No conectado");
        return null;
      }
      setLoading(true);
      setError(null);
      try {
        const owner = merchantOwner || new PublicKey(platform.authority);
        const loyaltyMint = new PublicKey(platform.loyaltyMint);
        const tx = await redeemLoyaltyTx(
          program,
          publicKey,
          owner,
          loyaltyMint,
          amount
        );
        setLoading(false);
        return tx;
      } catch (e: any) {
        setError(e.message || "Error al canjear tokens");
        setLoading(false);
        return null;
      }
    },
    [program, publicKey, platform]
  );

  return { redeem, loading, error };
}

// ============================================================================
// useCreateEscrow — Create escrow payment on-chain
// ============================================================================
export function useCreateEscrow() {
  const { program } = useIPayProgram();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEscrow = useCallback(
    async (merchantOwner: PublicKey, amount: BN, memo: string, releaseAfter: BN) => {
      if (!program || !publicKey) {
        setError("Wallet not connected");
        return null;
      }
      setLoading(true);
      setError(null);
      try {
        const [merchantPDA] = PublicKey.findProgramAddressSync(
          [Buffer.from("merchant"), merchantOwner.toBuffer()],
          PROGRAM_ID
        );
        const [platformPDA] = getPlatformPDA();
        const [escrowPDA] = PublicKey.findProgramAddressSync(
          [Buffer.from("escrow"), publicKey.toBuffer(), merchantPDA.toBuffer()],
          PROGRAM_ID
        );

        const tx = await program.methods
          .createEscrowPayment(amount, memo, releaseAfter)
          .accounts({
            platform: platformPDA,
            merchant: merchantPDA,
            escrow: escrowPDA,
            payer: publicKey,
            systemProgram: PublicKey.default,
          })
          .rpc();

        setLoading(false);
        return tx;
      } catch (e: any) {
        setError(e.message || "Escrow creation failed");
        setLoading(false);
        return null;
      }
    },
    [program, publicKey]
  );

  return { createEscrow, loading, error };
}

// ============================================================================
// useCreateSubscription — Create recurring payment on-chain
// ============================================================================
export function useCreateSubscription() {
  const { program } = useIPayProgram();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribe = useCallback(
    async (merchantOwner: PublicKey, amount: BN, intervalSeconds: BN, maxCycles: number) => {
      if (!program || !publicKey) {
        setError("Wallet not connected");
        return null;
      }
      setLoading(true);
      setError(null);
      try {
        const [merchantPDA] = PublicKey.findProgramAddressSync(
          [Buffer.from("merchant"), merchantOwner.toBuffer()],
          PROGRAM_ID
        );
        const [subscriptionPDA] = PublicKey.findProgramAddressSync(
          [Buffer.from("subscription"), publicKey.toBuffer(), merchantPDA.toBuffer()],
          PROGRAM_ID
        );

        const tx = await program.methods
          .createSubscription(amount, intervalSeconds, maxCycles)
          .accounts({
            merchant: merchantPDA,
            subscription: subscriptionPDA,
            subscriber: publicKey,
            systemProgram: PublicKey.default,
          })
          .rpc();

        setLoading(false);
        return tx;
      } catch (e: any) {
        setError(e.message || "Subscription creation failed");
        setLoading(false);
        return null;
      }
    },
    [program, publicKey]
  );

  return { subscribe, loading, error };
}

// ============================================================================
// useStakeLoyalty — Stake iPAY tokens for benefits
// ============================================================================
export function useStakeLoyalty() {
  const { program } = useIPayProgram();
  const { publicKey } = useWallet();
  const { platform } = usePlatform();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stake = useCallback(
    async (amount: BN, lockDurationSeconds: BN) => {
      if (!program || !publicKey || !platform) {
        setError("Not ready");
        return null;
      }
      setLoading(true);
      setError(null);
      try {
        const loyaltyMint = new PublicKey(platform.loyaltyMint);
        const [platformPDA] = getPlatformPDA();

        const tx = await program.methods
          .stakeLoyalty(amount, lockDurationSeconds)
          .accounts({
            platform: platformPDA,
            loyaltyMint,
            user: publicKey,
          })
          .rpc();

        setLoading(false);
        return tx;
      } catch (e: any) {
        setError(e.message || "Staking failed");
        setLoading(false);
        return null;
      }
    },
    [program, publicKey, platform]
  );

  return { stake, loading, error };
}

// ============================================================================
// useUpdateMerchant — Update merchant profile on-chain
// ============================================================================
export function useUpdateMerchant() {
  const { program } = useIPayProgram();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (
      name: string | null,
      description: string | null,
      category: string | null,
      loyaltyMultiplier: number | null,
      isActive: boolean | null
    ) => {
      if (!program || !publicKey) {
        setError("Wallet not connected");
        return null;
      }
      setLoading(true);
      setError(null);
      try {
        const tx = await updateMerchantTx(
          program,
          publicKey,
          name,
          description,
          category,
          loyaltyMultiplier,
          isActive
        );
        setLoading(false);
        return tx;
      } catch (e: any) {
        setError(e.message || "Update failed");
        setLoading(false);
        return null;
      }
    },
    [program, publicKey]
  );

  return { execute, loading, error };
}

// ============================================================================
// useProcessRefund — Process a refund for a payment on-chain
// ============================================================================
export function useProcessRefund() {
  const { program } = useIPayProgram();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (paymentIndex: BN, payer: PublicKey, amount: BN) => {
      if (!program || !publicKey) {
        setError("Wallet not connected");
        return null;
      }
      setLoading(true);
      setError(null);
      try {
        const tx = await processRefundTx(
          program,
          publicKey,
          paymentIndex,
          payer,
          amount
        );
        setLoading(false);
        return tx;
      } catch (e: any) {
        setError(e.message || "Refund failed");
        setLoading(false);
        return null;
      }
    },
    [program, publicKey]
  );

  return { execute, loading, error };
}

// ============================================================================
// useReleaseEscrow — Release escrowed funds to merchant
// ============================================================================
export function useReleaseEscrow() {
  const { program } = useIPayProgram();
  const { publicKey } = useWallet();
  const { platform } = usePlatform();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (merchantOwner: PublicKey, payerKey: PublicKey) => {
      if (!program || !publicKey || !platform) {
        setError("Not ready");
        return null;
      }
      setLoading(true);
      setError(null);
      try {
        const tx = await releaseEscrowTx(
          program,
          publicKey,
          merchantOwner,
          payerKey,
          new PublicKey(platform.authority)
        );
        setLoading(false);
        return tx;
      } catch (e: any) {
        setError(e.message || "Escrow release failed");
        setLoading(false);
        return null;
      }
    },
    [program, publicKey, platform]
  );

  return { execute, loading, error };
}

// ============================================================================
// useUnstakeLoyalty — Unstake iPAY tokens after lock period
// ============================================================================
export function useUnstakeLoyalty() {
  const { program } = useIPayProgram();
  const { publicKey } = useWallet();
  const { platform } = usePlatform();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async () => {
      if (!program || !publicKey || !platform) {
        setError("Not ready");
        return null;
      }
      setLoading(true);
      setError(null);
      try {
        const loyaltyMint = new PublicKey(platform.loyaltyMint);
        const tx = await unstakeLoyaltyTx(
          program,
          publicKey,
          loyaltyMint
        );
        setLoading(false);
        return tx;
      } catch (e: any) {
        setError(e.message || "Unstaking failed");
        setLoading(false);
        return null;
      }
    },
    [program, publicKey, platform]
  );

  return { execute, loading, error };
}
