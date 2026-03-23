import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { BN } from "@coral-xyz/anchor";
import {
  PLATFORM_PDA,
  LOYALTY_MINT,
  PLATFORM_AUTHORITY,
  PROGRAM_ID,
} from "./constants";
import {
  getPlatformPDA,
  getMerchantPDA,
  getPaymentPDA,
  fetchPlatform,
} from "./program";

/**
 * CORS headers required by the Solana Actions specification.
 * Must be included in every Actions API response.
 */
export const ACTIONS_CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
};

// ---------------------------------------------------------------------------
// process_payment instruction discriminator (from IDL)
// ---------------------------------------------------------------------------

const PROCESS_PAYMENT_DISCRIMINATOR = Buffer.from([
  189, 81, 30, 198, 139, 186, 115, 23,
]);

// ---------------------------------------------------------------------------
// Encode process_payment instruction data: discriminator + amount (u64 LE) + memo (borsh string)
// ---------------------------------------------------------------------------

function encodeProcessPaymentData(amount: BN, memo: string): Buffer {
  // Borsh string = 4-byte LE length prefix + UTF-8 bytes
  const memoBytes = Buffer.from(memo, "utf-8");
  const memoLen = Buffer.alloc(4);
  memoLen.writeUInt32LE(memoBytes.length, 0);

  // amount as 8-byte little-endian
  const amountBuf = amount.toArrayLike(Buffer, "le", 8);

  return Buffer.concat([
    PROCESS_PAYMENT_DISCRIMINATOR,
    amountBuf,
    memoLen,
    memoBytes,
  ]);
}

// ---------------------------------------------------------------------------
// createIPayPaymentTransaction — builds a process_payment instruction
// ---------------------------------------------------------------------------

/**
 * Builds a transaction that calls the iPay program's `process_payment` instruction.
 * The payer sends SOL to the merchant through the program, which also:
 *   - Records the payment on-chain (PaymentRecord PDA)
 *   - Collects a platform fee
 *   - Mints loyalty tokens to the payer
 *
 * Falls back to a plain SystemProgram.transfer if program accounts cannot be resolved.
 *
 * @param payer           Public key of the wallet paying
 * @param merchantWallet  Public key of the merchant's wallet (the owner who registered)
 * @param amountLamports  Payment amount in lamports
 * @param connection      Solana RPC connection
 * @param memo            Optional memo string (max 64 chars)
 */
export async function createIPayPaymentTransaction(
  payer: PublicKey,
  merchantWallet: PublicKey,
  amountLamports: number,
  connection: Connection,
  memo: string = "iPay payment",
): Promise<Transaction> {
  try {
    // ----- Fetch platform state to get the current payment_counter -----
    const platformData = await fetchPlatform(connection);
    if (!platformData) {
      throw new Error("Platform account not found — falling back");
    }

    const paymentCounter: BN =
      platformData.paymentCounter instanceof BN
        ? platformData.paymentCounter
        : new BN(platformData.paymentCounter.toString());

    // ----- Derive all PDAs -----
    const [platformPDA] = getPlatformPDA();
    const [merchantPDA] = getMerchantPDA(merchantWallet);
    const [paymentRecordPDA] = getPaymentPDA(paymentCounter);

    const loyaltyMint = LOYALTY_MINT;
    const platformAuthority = PLATFORM_AUTHORITY;

    // Payer's Associated Token Account for loyalty tokens
    const payerLoyaltyAccount = getAssociatedTokenAddressSync(
      loyaltyMint,
      payer,
      true, // allowOwnerOffCurve = true for safety
    );

    // ----- Build the instruction data -----
    const amount = new BN(amountLamports);
    const trimmedMemo = memo.length > 64 ? memo.slice(0, 64) : memo;
    const data = encodeProcessPaymentData(amount, trimmedMemo);

    // ----- Build the instruction with all required accounts (order matters!) -----
    const keys = [
      { pubkey: platformPDA, isSigner: false, isWritable: true },          // platform
      { pubkey: merchantPDA, isSigner: false, isWritable: true },          // merchant
      { pubkey: paymentRecordPDA, isSigner: false, isWritable: true },     // payment_record
      { pubkey: loyaltyMint, isSigner: false, isWritable: true },          // loyalty_mint
      { pubkey: payerLoyaltyAccount, isSigner: false, isWritable: true },  // payer_loyalty_account
      { pubkey: payer, isSigner: true, isWritable: true },                 // payer (signer)
      { pubkey: merchantWallet, isSigner: false, isWritable: true },       // merchant_wallet
      { pubkey: platformAuthority, isSigner: false, isWritable: true },    // platform_wallet
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // system_program
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },    // token_program
      { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // associated_token_program
    ];

    const instruction = new TransactionInstruction({
      programId: PROGRAM_ID,
      keys,
      data,
    });

    const transaction = new Transaction().add(instruction);

    // Set blockhash & fee payer
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.lastValidBlockHeight = lastValidBlockHeight;
    transaction.feePayer = payer;

    return transaction;
  } catch (error) {
    console.warn(
      "iPay program transaction failed, falling back to SystemProgram.transfer:",
      error,
    );
    return createPaymentTransaction(payer, merchantWallet, amountLamports, connection);
  }
}

// ---------------------------------------------------------------------------
// Fallback: plain SOL transfer (SystemProgram.transfer)
// ---------------------------------------------------------------------------

/**
 * Creates a simple SOL transfer transaction from payer to merchant.
 * Used as a fallback when the iPay program accounts cannot be derived.
 */
export async function createPaymentTransaction(
  payer: PublicKey,
  merchant: PublicKey,
  amountLamports: number,
  connection: Connection,
): Promise<Transaction> {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: payer,
      toPubkey: merchant,
      lamports: amountLamports,
    }),
  );

  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.lastValidBlockHeight = lastValidBlockHeight;
  transaction.feePayer = payer;

  return transaction;
}

// ---------------------------------------------------------------------------
// Serialization helper
// ---------------------------------------------------------------------------

/**
 * Serializes a transaction to a base64 string for ActionPostResponse.
 * Serialized WITHOUT requiring all signatures so the client wallet can sign it.
 */
export function serializeTransaction(transaction: Transaction): string {
  return transaction
    .serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    })
    .toString("base64");
}
