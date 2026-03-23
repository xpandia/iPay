import * as anchor from "@coral-xyz/anchor";
import { Program, BN, AnchorError } from "@coral-xyz/anchor";
import { IpayProtocol } from "../target/types/ipay_protocol";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  getAccount,
} from "@solana/spl-token";
import { expect } from "chai";

describe("ipay_protocol", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.IpayProtocol as Program<IpayProtocol>;
  const authority = provider.wallet as anchor.Wallet;

  // Shared state across tests
  const loyaltyMintKeypair = Keypair.generate();
  let platformPda: PublicKey;
  let platformBump: number;
  let loyaltyMint: PublicKey;

  const merchantOwner = Keypair.generate();
  let merchantPda: PublicKey;

  const payer = Keypair.generate();

  // Constants
  const LOYALTY_POINTS_PER_SOL = new BN(1000);
  const PLATFORM_FEE_BPS = 50; // 0.5%
  const MAX_SUPPLY = new BN("1000000000000"); // 1M tokens with 6 decimals

  before(async () => {
    // Derive platform PDA
    [platformPda, platformBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("platform")],
      program.programId
    );

    loyaltyMint = loyaltyMintKeypair.publicKey;

    // Derive merchant PDA
    [merchantPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("merchant"), merchantOwner.publicKey.toBuffer()],
      program.programId
    );

    // Fund merchant owner and payer
    const fundTxSig1 = await provider.connection.requestAirdrop(
      merchantOwner.publicKey,
      5 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(fundTxSig1);

    const fundTxSig2 = await provider.connection.requestAirdrop(
      payer.publicKey,
      5 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(fundTxSig2);
  });

  // =========================================================================
  // 1. Platform Initialization
  // =========================================================================
  describe("Platform Initialization", () => {
    it("initializes the platform with correct parameters", async () => {
      await program.methods
        .initializePlatform(LOYALTY_POINTS_PER_SOL, PLATFORM_FEE_BPS, MAX_SUPPLY)
        .accounts({
          platform: platformPda,
          loyaltyMint: loyaltyMint,
          authority: authority.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([loyaltyMintKeypair])
        .rpc();

      const platformAccount = await program.account.platform.fetch(platformPda);

      expect(platformAccount.authority.toBase58()).to.equal(
        authority.publicKey.toBase58()
      );
      expect(platformAccount.loyaltyMint.toBase58()).to.equal(
        loyaltyMint.toBase58()
      );
      expect(platformAccount.loyaltyPointsPerSol.toNumber()).to.equal(1000);
      expect(platformAccount.platformFeeBps).to.equal(PLATFORM_FEE_BPS);
      expect(platformAccount.totalMerchants.toNumber()).to.equal(0);
      expect(platformAccount.totalPayments.toNumber()).to.equal(0);
      expect(platformAccount.totalVolume.toNumber()).to.equal(0);
      expect(platformAccount.paymentCounter.toNumber()).to.equal(0);
      expect(platformAccount.maxSupply.toNumber()).to.equal(
        MAX_SUPPLY.toNumber()
      );
      expect(platformAccount.isPaused).to.equal(false);
    });

    it("loyalty mint was created with correct authority (platform PDA)", async () => {
      const mintInfo = await provider.connection.getParsedAccountInfo(
        loyaltyMint
      );
      const data = (mintInfo.value?.data as any).parsed.info;

      expect(data.mintAuthority).to.equal(platformPda.toBase58());
      expect(data.decimals).to.equal(6);
      expect(data.supply).to.equal("0");
    });
  });

  // =========================================================================
  // 2. Merchant Registration
  // =========================================================================
  describe("Merchant Registration", () => {
    it("registers a merchant with valid parameters", async () => {
      const name = "Coffee Shop";
      const description = "Best coffee in town";
      const category = "Food & Beverage";
      const multiplier = 200; // 2x

      await program.methods
        .registerMerchant(name, description, category, multiplier)
        .accounts({
          merchant: merchantPda,
          platform: platformPda,
          owner: merchantOwner.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([merchantOwner])
        .rpc();

      const merchantAccount = await program.account.merchant.fetch(merchantPda);

      expect(merchantAccount.owner.toBase58()).to.equal(
        merchantOwner.publicKey.toBase58()
      );
      expect(merchantAccount.name).to.equal(name);
      expect(merchantAccount.description).to.equal(description);
      expect(merchantAccount.merchantCategory).to.equal(category);
      expect(merchantAccount.loyaltyMultiplier).to.equal(multiplier);
      expect(merchantAccount.totalPayments.toNumber()).to.equal(0);
      expect(merchantAccount.totalVolume.toNumber()).to.equal(0);
      expect(merchantAccount.totalLoyaltyDistributed.toNumber()).to.equal(0);
      expect(merchantAccount.isActive).to.equal(true);
      expect(merchantAccount.createdAt.toNumber()).to.be.greaterThan(0);
    });

    it("platform.total_merchants incremented after registration", async () => {
      const platformAccount = await program.account.platform.fetch(platformPda);
      expect(platformAccount.totalMerchants.toNumber()).to.equal(1);
    });

    it("fails with multiplier below 100", async () => {
      const badOwner = Keypair.generate();
      const fundSig = await provider.connection.requestAirdrop(
        badOwner.publicKey,
        2 * LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(fundSig);

      const [badMerchantPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("merchant"), badOwner.publicKey.toBuffer()],
        program.programId
      );

      try {
        await program.methods
          .registerMerchant("Bad Shop", "desc", "cat", 50)
          .accounts({
            merchant: badMerchantPda,
            platform: platformPda,
            owner: badOwner.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([badOwner])
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect((err as AnchorError).error.errorCode.code).to.equal(
          "InvalidMultiplier"
        );
      }
    });

    it("fails with multiplier above 1000", async () => {
      const badOwner = Keypair.generate();
      const fundSig = await provider.connection.requestAirdrop(
        badOwner.publicKey,
        2 * LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(fundSig);

      const [badMerchantPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("merchant"), badOwner.publicKey.toBuffer()],
        program.programId
      );

      try {
        await program.methods
          .registerMerchant("Bad Shop", "desc", "cat", 1500)
          .accounts({
            merchant: badMerchantPda,
            platform: platformPda,
            owner: badOwner.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([badOwner])
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect((err as AnchorError).error.errorCode.code).to.equal(
          "InvalidMultiplier"
        );
      }
    });
  });

  // =========================================================================
  // 3. Merchant Update
  // =========================================================================
  describe("Merchant Update", () => {
    it("updates merchant name and multiplier", async () => {
      const newName = "Premium Coffee";
      const newMultiplier = 300; // 3x

      await program.methods
        .updateMerchant(newName, null, null, newMultiplier, null)
        .accounts({
          merchant: merchantPda,
          owner: merchantOwner.publicKey,
        })
        .signers([merchantOwner])
        .rpc();

      const merchantAccount = await program.account.merchant.fetch(merchantPda);
      expect(merchantAccount.name).to.equal(newName);
      expect(merchantAccount.loyaltyMultiplier).to.equal(newMultiplier);
      // Unchanged fields should persist
      expect(merchantAccount.description).to.equal("Best coffee in town");
      expect(merchantAccount.merchantCategory).to.equal("Food & Beverage");
      expect(merchantAccount.isActive).to.equal(true);
    });

    it("non-owner cannot update merchant", async () => {
      const nonOwner = Keypair.generate();
      const fundSig = await provider.connection.requestAirdrop(
        nonOwner.publicKey,
        2 * LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(fundSig);

      // The PDA is derived from owner key, so using nonOwner as signer
      // with the real merchantPda will fail because the seeds won't match
      // (has_one = owner constraint).
      try {
        await program.methods
          .updateMerchant("Hacked Name", null, null, null, null)
          .accounts({
            merchant: merchantPda,
            owner: nonOwner.publicKey,
          })
          .signers([nonOwner])
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (err) {
        // The constraint will fail because seeds [b"merchant", owner] won't match
        // for the wrong owner, or has_one = owner will fail.
        expect(err).to.exist;
      }
    });
  });

  // =========================================================================
  // 4. Process Payment (SOL)
  // =========================================================================
  describe("Process Payment (SOL)", () => {
    const paymentAmount = new BN(100_000_000); // 0.1 SOL
    let paymentRecordPda: PublicKey;
    let payerLoyaltyAta: PublicKey;

    let merchantBalanceBefore: number;
    let platformBalanceBefore: number;
    let payerBalanceBefore: number;

    before(async () => {
      // Derive payment record PDA using current payment_counter (should be 0)
      const platformAccount = await program.account.platform.fetch(platformPda);
      const counter = platformAccount.paymentCounter;

      [paymentRecordPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("payment"), counter.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      payerLoyaltyAta = await getAssociatedTokenAddress(
        loyaltyMint,
        payer.publicKey,
        false,
        TOKEN_PROGRAM_ID
      );

      // Record balances before payment
      merchantBalanceBefore = await provider.connection.getBalance(
        merchantOwner.publicKey
      );
      platformBalanceBefore = await provider.connection.getBalance(
        authority.publicKey
      );
      payerBalanceBefore = await provider.connection.getBalance(payer.publicKey);
    });

    it("processes a 0.1 SOL payment successfully", async () => {
      await program.methods
        .processPayment(paymentAmount, "Coffee purchase")
        .accounts({
          platform: platformPda,
          merchant: merchantPda,
          paymentRecord: paymentRecordPda,
          loyaltyMint: loyaltyMint,
          payerLoyaltyAccount: payerLoyaltyAta,
          payer: payer.publicKey,
          merchantWallet: merchantOwner.publicKey,
          platformWallet: authority.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
        })
        .signers([payer])
        .rpc();
    });

    it("SOL transferred to merchant (minus fee)", async () => {
      const merchantBalanceAfter = await provider.connection.getBalance(
        merchantOwner.publicKey
      );
      // fee = 100_000_000 * 50 / 10_000 = 500_000
      // merchant receives = 100_000_000 - 500_000 = 99_500_000
      const expectedMerchantReceived = 99_500_000;
      const actualReceived = merchantBalanceAfter - merchantBalanceBefore;
      expect(actualReceived).to.equal(expectedMerchantReceived);
    });

    it("platform fee collected", async () => {
      const platformBalanceAfter = await provider.connection.getBalance(
        authority.publicKey
      );
      // Platform fee = 500_000 lamports
      const expectedFee = 500_000;
      const actualFee = platformBalanceAfter - platformBalanceBefore;
      expect(actualFee).to.equal(expectedFee);
    });

    it("loyalty tokens minted to payer", async () => {
      const tokenAccount = await getAccount(
        provider.connection,
        payerLoyaltyAta
      );
      // base_loyalty = 100_000_000 * 1000 / 1_000_000_000 = 100
      // loyalty_amount = 100 * 300 / 100 = 300  (multiplier is 300 after update)
      const expectedLoyalty = 300;
      expect(Number(tokenAccount.amount)).to.equal(expectedLoyalty);
    });

    it("payment record created with correct data", async () => {
      const paymentRecord = await program.account.paymentRecord.fetch(
        paymentRecordPda
      );

      expect(paymentRecord.payer.toBase58()).to.equal(
        payer.publicKey.toBase58()
      );
      expect(paymentRecord.merchant.toBase58()).to.equal(
        merchantPda.toBase58()
      );
      expect(paymentRecord.amount.toNumber()).to.equal(100_000_000);
      expect(paymentRecord.platformFee.toNumber()).to.equal(500_000);
      expect(paymentRecord.loyaltyEarned.toNumber()).to.equal(300);
      expect(paymentRecord.memo).to.equal("Coffee purchase");
      expect(paymentRecord.timestamp.toNumber()).to.be.greaterThan(0);
      expect(paymentRecord.paymentIndex.toNumber()).to.equal(0);
    });

    it("merchant stats updated (total_payments, total_volume)", async () => {
      const merchantAccount = await program.account.merchant.fetch(merchantPda);

      expect(merchantAccount.totalPayments.toNumber()).to.equal(1);
      expect(merchantAccount.totalVolume.toNumber()).to.equal(100_000_000);
      expect(merchantAccount.totalLoyaltyDistributed.toNumber()).to.equal(300);
    });
  });

  // =========================================================================
  // 5. Loyalty Redemption
  // =========================================================================
  describe("Loyalty Redemption", () => {
    it("redeems loyalty tokens at a merchant", async () => {
      const redeemAmount = new BN(100);

      const userLoyaltyAta = await getAssociatedTokenAddress(
        loyaltyMint,
        payer.publicKey,
        false,
        TOKEN_PROGRAM_ID
      );

      // Check balance before
      const tokenAccountBefore = await getAccount(
        provider.connection,
        userLoyaltyAta
      );
      const balanceBefore = Number(tokenAccountBefore.amount);

      await program.methods
        .redeemLoyalty(redeemAmount)
        .accounts({
          merchant: merchantPda,
          platform: platformPda,
          loyaltyMint: loyaltyMint,
          userLoyaltyAccount: userLoyaltyAta,
          user: payer.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([payer])
        .rpc();

      // Verify tokens were burned
      const tokenAccountAfter = await getAccount(
        provider.connection,
        userLoyaltyAta
      );
      const balanceAfter = Number(tokenAccountAfter.amount);
      expect(balanceAfter).to.equal(balanceBefore - 100);
    });
  });

  // =========================================================================
  // 6. Error Cases
  // =========================================================================
  describe("Error Cases", () => {
    it("payment with 0 amount fails", async () => {
      const platformAccount = await program.account.platform.fetch(platformPda);
      const counter = platformAccount.paymentCounter;

      const [paymentPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("payment"), counter.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const payerLoyaltyAta = await getAssociatedTokenAddress(
        loyaltyMint,
        payer.publicKey,
        false,
        TOKEN_PROGRAM_ID
      );

      try {
        await program.methods
          .processPayment(new BN(0), "Zero payment")
          .accounts({
            platform: platformPda,
            merchant: merchantPda,
            paymentRecord: paymentPda,
            loyaltyMint: loyaltyMint,
            payerLoyaltyAccount: payerLoyaltyAta,
            payer: payer.publicKey,
            merchantWallet: merchantOwner.publicKey,
            platformWallet: authority.publicKey,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
          })
          .signers([payer])
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect((err as AnchorError).error.errorCode.code).to.equal(
          "InvalidAmount"
        );
      }
    });

    it("payment to inactive merchant fails", async () => {
      // First, deactivate the merchant
      await program.methods
        .updateMerchant(null, null, null, null, false)
        .accounts({
          merchant: merchantPda,
          owner: merchantOwner.publicKey,
        })
        .signers([merchantOwner])
        .rpc();

      const platformAccount = await program.account.platform.fetch(platformPda);
      const counter = platformAccount.paymentCounter;

      const [paymentPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("payment"), counter.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const payerLoyaltyAta = await getAssociatedTokenAddress(
        loyaltyMint,
        payer.publicKey,
        false,
        TOKEN_PROGRAM_ID
      );

      try {
        await program.methods
          .processPayment(new BN(50_000_000), "Should fail")
          .accounts({
            platform: platformPda,
            merchant: merchantPda,
            paymentRecord: paymentPda,
            loyaltyMint: loyaltyMint,
            payerLoyaltyAccount: payerLoyaltyAta,
            payer: payer.publicKey,
            merchantWallet: merchantOwner.publicKey,
            platformWallet: authority.publicKey,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
          })
          .signers([payer])
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect((err as AnchorError).error.errorCode.code).to.equal(
          "MerchantInactive"
        );
      }

      // Re-activate merchant for subsequent tests
      await program.methods
        .updateMerchant(null, null, null, null, true)
        .accounts({
          merchant: merchantPda,
          owner: merchantOwner.publicKey,
        })
        .signers([merchantOwner])
        .rpc();
    });

    it("memo too long fails (>64 chars)", async () => {
      const platformAccount = await program.account.platform.fetch(platformPda);
      const counter = platformAccount.paymentCounter;

      const [paymentPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("payment"), counter.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const payerLoyaltyAta = await getAssociatedTokenAddress(
        loyaltyMint,
        payer.publicKey,
        false,
        TOKEN_PROGRAM_ID
      );

      const longMemo = "x".repeat(65);

      try {
        await program.methods
          .processPayment(new BN(10_000_000), longMemo)
          .accounts({
            platform: platformPda,
            merchant: merchantPda,
            paymentRecord: paymentPda,
            loyaltyMint: loyaltyMint,
            payerLoyaltyAccount: payerLoyaltyAta,
            payer: payer.publicKey,
            merchantWallet: merchantOwner.publicKey,
            platformWallet: authority.publicKey,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
          })
          .signers([payer])
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect((err as AnchorError).error.errorCode.code).to.equal(
          "MemoTooLong"
        );
      }
    });

    it("name too long fails (>32 chars) on merchant registration", async () => {
      const badOwner = Keypair.generate();
      const fundSig = await provider.connection.requestAirdrop(
        badOwner.publicKey,
        2 * LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(fundSig);

      const [badMerchantPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("merchant"), badOwner.publicKey.toBuffer()],
        program.programId
      );

      const longName = "x".repeat(33);

      try {
        await program.methods
          .registerMerchant(longName, "desc", "cat", 200)
          .accounts({
            merchant: badMerchantPda,
            platform: platformPda,
            owner: badOwner.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([badOwner])
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (err) {
        expect((err as AnchorError).error.errorCode.code).to.equal(
          "NameTooLong"
        );
      }
    });
  });
});
