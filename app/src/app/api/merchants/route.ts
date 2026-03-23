import { NextRequest, NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider } from "@coral-xyz/anchor";

// ============================================================================
// iPay Merchants API — Query merchant data from on-chain
// GET /api/merchants?wallet=<address> — Get merchant details
// GET /api/merchants — API documentation
// ============================================================================

const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.devnet.solana.com";
const PROGRAM_ID = new PublicKey("2DhfCmG1sUiX8ZJc4wZkq42hfbhNf6PPnhR7bXPyxEAc");

function getMerchantPDA(owner: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("merchant"), owner.toBuffer()],
    PROGRAM_ID
  );
}

function getPlatformPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([Buffer.from("platform")], PROGRAM_ID);
}

export async function GET(request: NextRequest) {
  const wallet = request.nextUrl.searchParams.get("wallet");

  if (!wallet) {
    return NextResponse.json({
      name: "iPay Merchants API",
      version: "1.0",
      programId: PROGRAM_ID.toBase58(),
      network: "devnet",
      endpoints: {
        "GET /api/merchants?wallet=<ownerAddress>": {
          description: "Get merchant details by owner wallet address",
          response: {
            merchant: {
              address: "Merchant PDA address",
              owner: "Owner wallet address",
              name: "Business name",
              description: "Business description",
              category: "Merchant category",
              loyaltyMultiplier: "Loyalty token multiplier (100 = 1x)",
              totalPayments: "Number of payments received",
              totalVolume: "Total volume in lamports",
              totalLoyaltyDistributed: "Total iPAY tokens distributed",
              isActive: "Whether merchant is active",
              createdAt: "Registration timestamp",
            },
          },
        },
        "GET /api/merchants/platform": {
          description: "Get platform-wide statistics",
          response: {
            totalMerchants: "Number",
            totalPayments: "Number",
            totalVolume: "Lamports",
          },
        },
      },
    });
  }

  try {
    const ownerPubkey = new PublicKey(wallet);
    const connection = new Connection(RPC_URL);
    const [merchantPDA] = getMerchantPDA(ownerPubkey);

    const accountInfo = await connection.getAccountInfo(merchantPDA);

    if (!accountInfo) {
      return NextResponse.json(
        {
          exists: false,
          wallet,
          merchantPDA: merchantPDA.toBase58(),
          message: "No merchant registered for this wallet",
          registerUrl: "/onboarding",
        },
        { status: 404 }
      );
    }

    // Basic account data parsing (simplified — in production use Anchor deserialization)
    return NextResponse.json({
      exists: true,
      wallet,
      merchantPDA: merchantPDA.toBase58(),
      accountSize: accountInfo.data.length,
      lamports: accountInfo.lamports,
      owner: accountInfo.owner.toBase58(),
      message: "Merchant found. Use the Anchor SDK for full deserialization.",
      dashboardUrl: `/merchant`,
      blinkBase: `/api/actions/pay?merchant=${wallet}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Invalid wallet address: ${error.message}` },
      { status: 400 }
    );
  }
}
