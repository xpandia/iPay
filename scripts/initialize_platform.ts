// Script to initialize iPay platform on Solana devnet
// Run: npx ts-node --esm scripts/initialize_platform.ts

import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, BN, Wallet } from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEVNET_URL = "https://api.devnet.solana.com";
const IDL_PATH = path.join(__dirname, "../ipay_protocol/target/idl/ipay_protocol.json");
const KEYPAIR_PATH = path.join(process.env.HOME || "~", ".config/solana/id.json");

async function main() {
  // Load keypair
  const keypairData = JSON.parse(fs.readFileSync(KEYPAIR_PATH, "utf-8"));
  const authority = Keypair.fromSecretKey(Uint8Array.from(keypairData));
  console.log("Authority:", authority.publicKey.toBase58());

  // Connection
  const connection = new Connection(DEVNET_URL, "confirmed");
  const balance = await connection.getBalance(authority.publicKey);
  console.log("Balance:", balance / 1e9, "SOL");

  // Provider
  const wallet = new Wallet(authority);
  const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });

  // Program
  const idl = JSON.parse(fs.readFileSync(IDL_PATH, "utf-8"));
  const program = new Program(idl, provider);

  // Derive Platform PDA
  const [platformPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("platform")],
    program.programId
  );
  console.log("Platform PDA:", platformPDA.toBase58());

  // Check if already initialized
  const existing = await connection.getAccountInfo(platformPDA);
  if (existing) {
    console.log("Platform already initialized!");
    const platformData = await (program.account as any).platform.fetch(platformPDA);
    console.log("Loyalty Mint:", platformData.loyaltyMint.toBase58());
    console.log("Total Merchants:", platformData.totalMerchants.toString());
    console.log("Total Payments:", platformData.totalPayments.toString());
    console.log("Payment Counter:", platformData.paymentCounter.toString());
    return;
  }

  // Generate loyalty mint keypair
  const loyaltyMint = Keypair.generate();
  console.log("Loyalty Mint:", loyaltyMint.publicKey.toBase58());

  // Initialize platform
  // 1000 loyalty points per SOL, 50 bps (0.5%) platform fee
  const tx = await (program.methods as any)
    .initializePlatform(new BN(1000), 50)
    .accounts({
      platform: platformPDA,
      loyaltyMint: loyaltyMint.publicKey,
      authority: authority.publicKey,
      systemProgram: PublicKey.default,
      tokenProgram: TOKEN_PROGRAM_ID,
      rent: new PublicKey("SysvarRent111111111111111111111111111111111"),
    })
    .signers([loyaltyMint])
    .rpc();

  console.log("\n✅ Platform initialized!");
  console.log("Transaction:", tx);
  console.log("Loyalty Mint:", loyaltyMint.publicKey.toBase58());
  console.log("\nSave this info - needed for frontend!");
}

main().catch(console.error);
