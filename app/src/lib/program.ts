import { AnchorProvider, Program, BN } from "@coral-xyz/anchor";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { DEVNET_ENDPOINT } from "./constants";

// Program ID deployed on Solana
export const PROGRAM_ID = new PublicKey("2DhfCmG1sUiX8ZJc4wZkq42hfbhNf6PPnhR7bXPyxEAc");

// Import IDL
import IDL from "./ipay_protocol.json";

// PDA Seeds
export const PLATFORM_SEED = "platform";
export const MERCHANT_SEED = "merchant";
export const PAYMENT_SEED = "payment";

// Derive PDAs
export function getPlatformPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(PLATFORM_SEED)],
    PROGRAM_ID
  );
}

export function getMerchantPDA(owner: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(MERCHANT_SEED), owner.toBuffer()],
    PROGRAM_ID
  );
}

export function getPaymentPDA(paymentCounter: BN): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(PAYMENT_SEED), paymentCounter.toArrayLike(Buffer, "le", 8)],
    PROGRAM_ID
  );
}

// Get Anchor Program instance
export function getProgram(provider: AnchorProvider) {
  return new Program(IDL as any, provider);
}

// Get read-only connection
export function getConnection(): Connection {
  return new Connection(DEVNET_ENDPOINT, "confirmed");
}

// ============================================================================
// READ FUNCTIONS
// ============================================================================

export async function fetchPlatform(connection: Connection) {
  const [platformPDA] = getPlatformPDA();
  try {
    const accountInfo = await connection.getAccountInfo(platformPDA);
    if (!accountInfo) return null;
    const provider = new AnchorProvider(connection, {} as any, {});
    const program = getProgram(provider);
    return await (program.account as any).platform.fetch(platformPDA);
  } catch {
    return null;
  }
}

export async function fetchMerchant(connection: Connection, owner: PublicKey) {
  const [merchantPDA] = getMerchantPDA(owner);
  try {
    const accountInfo = await connection.getAccountInfo(merchantPDA);
    if (!accountInfo) return null;
    const provider = new AnchorProvider(connection, {} as any, {});
    const program = getProgram(provider);
    return await (program.account as any).merchant.fetch(merchantPDA);
  } catch {
    return null;
  }
}

export async function fetchLoyaltyBalance(
  connection: Connection,
  owner: PublicKey,
  loyaltyMint: PublicKey
): Promise<number> {
  try {
    const ata = await getAssociatedTokenAddress(loyaltyMint, owner);
    const balance = await connection.getTokenAccountBalance(ata);
    return Number(balance.value.uiAmount || 0);
  } catch {
    return 0;
  }
}

// ============================================================================
// WRITE FUNCTIONS (Instructions)
// ============================================================================

export async function registerMerchant(
  program: Program<any>,
  owner: PublicKey,
  name: string,
  description: string,
  category: string,
  loyaltyMultiplier: number
) {
  const [platformPDA] = getPlatformPDA();
  const [merchantPDA] = getMerchantPDA(owner);

  return await (program.methods as any)
    .registerMerchant(name, description, category, loyaltyMultiplier)
    .accounts({
      merchant: merchantPDA,
      platform: platformPDA,
      owner: owner,
      systemProgram: SystemProgram.programId,
    })
    .rpc();
}

export async function processPayment(
  program: Program<any>,
  payer: PublicKey,
  merchantOwner: PublicKey,
  amount: BN,
  memo: string,
  platformAuthority: PublicKey,
  loyaltyMint: PublicKey,
  paymentCounter: BN
) {
  const [platformPDA] = getPlatformPDA();
  const [merchantPDA] = getMerchantPDA(merchantOwner);
  const [paymentPDA] = getPaymentPDA(paymentCounter);
  const payerLoyaltyAccount = await getAssociatedTokenAddress(loyaltyMint, payer);

  return await (program.methods as any)
    .processPayment(amount, memo)
    .accounts({
      platform: platformPDA,
      merchant: merchantPDA,
      paymentRecord: paymentPDA,
      loyaltyMint: loyaltyMint,
      payerLoyaltyAccount: payerLoyaltyAccount,
      payer: payer,
      merchantWallet: merchantOwner,
      platformWallet: platformAuthority,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    })
    .rpc();
}

export async function redeemLoyalty(
  program: Program<any>,
  user: PublicKey,
  merchantOwner: PublicKey,
  loyaltyMint: PublicKey,
  amount: BN
) {
  const [platformPDA] = getPlatformPDA();
  const [merchantPDA] = getMerchantPDA(merchantOwner);
  const userLoyaltyAccount = await getAssociatedTokenAddress(loyaltyMint, user);

  return await (program.methods as any)
    .redeemLoyalty(amount)
    .accounts({
      merchant: merchantPDA,
      platform: platformPDA,
      loyaltyMint: loyaltyMint,
      userLoyaltyAccount: userLoyaltyAccount,
      user: user,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .rpc();
}

export async function updateMerchant(
  program: Program<any>,
  owner: PublicKey,
  name: string | null,
  description: string | null,
  merchantCategory: string | null,
  loyaltyMultiplier: number | null,
  isActive: boolean | null
) {
  const [merchantPDA] = getMerchantPDA(owner);

  return await (program.methods as any)
    .updateMerchant(name, description, merchantCategory, loyaltyMultiplier, isActive)
    .accounts({
      merchant: merchantPDA,
      owner: owner,
    })
    .rpc();
}

export async function processRefund(
  program: Program<any>,
  merchantOwner: PublicKey,
  paymentIndex: BN,
  payer: PublicKey,
  amount: BN
) {
  const [merchantPDA] = getMerchantPDA(merchantOwner);
  const [paymentPDA] = getPaymentPDA(paymentIndex);
  const [refundPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("refund"), paymentPDA.toBuffer()],
    PROGRAM_ID
  );

  return await (program.methods as any)
    .processRefund(amount)
    .accounts({
      merchant: merchantPDA,
      paymentRecord: paymentPDA,
      refundRecord: refundPDA,
      merchantOwner: merchantOwner,
      payer: payer,
      systemProgram: SystemProgram.programId,
    })
    .rpc();
}

export async function releaseEscrow(
  program: Program<any>,
  authority: PublicKey,
  merchantOwner: PublicKey,
  payerKey: PublicKey,
  platformAuthority: PublicKey
) {
  const [platformPDA] = getPlatformPDA();
  const [merchantPDA] = getMerchantPDA(merchantOwner);
  const [escrowPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("escrow"), payerKey.toBuffer(), merchantPDA.toBuffer()],
    PROGRAM_ID
  );

  return await (program.methods as any)
    .releaseEscrow()
    .accounts({
      platform: platformPDA,
      merchant: merchantPDA,
      escrow: escrowPDA,
      authority: authority,
      merchantWallet: merchantOwner,
      platformWallet: platformAuthority,
      systemProgram: SystemProgram.programId,
    })
    .rpc();
}

export async function unstakeLoyalty(
  program: Program<any>,
  user: PublicKey,
  loyaltyMint: PublicKey
) {
  const [platformPDA] = getPlatformPDA();
  const userLoyaltyAccount = await getAssociatedTokenAddress(loyaltyMint, user);
  const [platformPDAKey] = getPlatformPDA();
  const stakeVault = await getAssociatedTokenAddress(loyaltyMint, platformPDAKey, true);
  const [stakeRecordPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("stake"), user.toBuffer()],
    PROGRAM_ID
  );

  return await (program.methods as any)
    .unstakeLoyalty()
    .accounts({
      platform: platformPDA,
      loyaltyMint: loyaltyMint,
      userLoyaltyAccount: userLoyaltyAccount,
      stakeVault: stakeVault,
      stakeRecord: stakeRecordPDA,
      user: user,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .rpc();
}
