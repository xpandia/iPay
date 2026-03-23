use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{self, Mint, TokenAccount, TokenInterface, MintTo, TransferChecked},
};

declare_id!("2DhfCmG1sUiX8ZJc4wZkq42hfbhNf6PPnhR7bXPyxEAc");

// ============================================================================
// iPay Protocol — The Square of PayFi
// Payments + Loyalty + Merchant Registry on Solana
// ============================================================================

#[program]
pub mod ipay_protocol {
    use super::*;

    // ========================================================================
    // PLATFORM INITIALIZATION
    // ========================================================================

    pub fn initialize_platform(
        ctx: Context<InitializePlatform>,
        loyalty_points_per_sol: u64,
        platform_fee_bps: u16,
        max_supply: u64,
    ) -> Result<()> {
        require!(platform_fee_bps <= 10_000, IPayError::InvalidFeeBps);

        let platform = &mut ctx.accounts.platform;
        platform.authority = ctx.accounts.authority.key();
        platform.loyalty_mint = ctx.accounts.loyalty_mint.key();
        platform.loyalty_points_per_sol = loyalty_points_per_sol;
        platform.platform_fee_bps = platform_fee_bps;
        platform.total_merchants = 0;
        platform.total_payments = 0;
        platform.total_volume = 0;
        platform.payment_counter = 0;
        platform.max_supply = max_supply;
        platform.is_paused = false;
        platform.bump = ctx.bumps.platform;

        msg!("iPay Platform initialized! Loyalty: {} pts/SOL, Fee: {} bps, Max supply: {}",
            loyalty_points_per_sol, platform_fee_bps, max_supply);
        Ok(())
    }

    // ========================================================================
    // MERCHANT MANAGEMENT
    // ========================================================================

    pub fn register_merchant(
        ctx: Context<RegisterMerchant>,
        name: String,
        description: String,
        merchant_category: String,
        loyalty_multiplier: u16,
    ) -> Result<()> {
        require!(name.len() <= 32, IPayError::NameTooLong);
        require!(description.len() <= 128, IPayError::DescriptionTooLong);
        require!(merchant_category.len() <= 32, IPayError::CategoryTooLong);
        require!(loyalty_multiplier >= 100 && loyalty_multiplier <= 1000, IPayError::InvalidMultiplier);

        let merchant_key = ctx.accounts.merchant.key();
        let owner_key = ctx.accounts.owner.key();
        let now = Clock::get()?.unix_timestamp;

        let merchant = &mut ctx.accounts.merchant;
        merchant.owner = owner_key;
        merchant.name = name.clone();
        merchant.description = description;
        merchant.merchant_category = merchant_category;
        merchant.loyalty_multiplier = loyalty_multiplier;
        merchant.total_payments = 0;
        merchant.total_volume = 0;
        merchant.total_loyalty_distributed = 0;
        merchant.is_active = true;
        merchant.created_at = now;
        merchant.bump = ctx.bumps.merchant;

        let platform = &mut ctx.accounts.platform;
        platform.total_merchants += 1;

        let mname = name.clone();

        emit!(MerchantRegistered {
            merchant: merchant_key,
            owner: owner_key,
            name,
            timestamp: now,
        });

        msg!("Merchant '{}' registered! Loyalty: {}x", mname, loyalty_multiplier as f64 / 100.0);
        Ok(())
    }

    pub fn update_merchant(
        ctx: Context<UpdateMerchant>,
        name: Option<String>,
        description: Option<String>,
        merchant_category: Option<String>,
        loyalty_multiplier: Option<u16>,
        is_active: Option<bool>,
    ) -> Result<()> {
        let merchant = &mut ctx.accounts.merchant;

        if let Some(n) = name {
            require!(n.len() <= 32, IPayError::NameTooLong);
            merchant.name = n;
        }
        if let Some(d) = description {
            require!(d.len() <= 128, IPayError::DescriptionTooLong);
            merchant.description = d;
        }
        if let Some(c) = merchant_category {
            require!(c.len() <= 32, IPayError::CategoryTooLong);
            merchant.merchant_category = c;
        }
        if let Some(m) = loyalty_multiplier {
            require!(m >= 100 && m <= 1000, IPayError::InvalidMultiplier);
            merchant.loyalty_multiplier = m;
        }
        if let Some(active) = is_active {
            merchant.is_active = active;
        }

        msg!("Merchant '{}' updated", merchant.name);
        Ok(())
    }

    // ========================================================================
    // PAYMENTS + AUTOMATIC LOYALTY (CORE INNOVATION)
    // ========================================================================

    pub fn process_payment(
        ctx: Context<ProcessPayment>,
        amount: u64,
        memo: String,
    ) -> Result<()> {
        require!(amount > 0, IPayError::InvalidAmount);
        require!(amount <= 1_000_000_000_000, IPayError::AmountTooLarge);
        require!(memo.len() <= 64, IPayError::MemoTooLong);

        let merchant = &ctx.accounts.merchant;
        require!(merchant.is_active, IPayError::MerchantInactive);

        let platform = &ctx.accounts.platform;
        require!(!platform.is_paused, IPayError::PlatformPaused);

        // Step 1: Transfer SOL to merchant
        let platform_fee = amount
            .checked_mul(platform.platform_fee_bps as u64)
            .ok_or(IPayError::ArithmeticOverflow)?
            .checked_div(10_000)
            .ok_or(IPayError::ArithmeticOverflow)?;
        let merchant_amount = amount.checked_sub(platform_fee).ok_or(IPayError::ArithmeticOverflow)?;

        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.payer.to_account_info(),
                    to: ctx.accounts.merchant_wallet.to_account_info(),
                },
            ),
            merchant_amount,
        )?;

        if platform_fee > 0 {
            anchor_lang::system_program::transfer(
                CpiContext::new(
                    ctx.accounts.system_program.to_account_info(),
                    anchor_lang::system_program::Transfer {
                        from: ctx.accounts.payer.to_account_info(),
                        to: ctx.accounts.platform_wallet.to_account_info(),
                    },
                ),
                platform_fee,
            )?;
        }

        // Step 2: Auto-mint loyalty tokens (THE INNOVATION)
        let base_loyalty = amount
            .checked_mul(platform.loyalty_points_per_sol)
            .ok_or(IPayError::ArithmeticOverflow)?
            .checked_div(1_000_000_000)
            .ok_or(IPayError::ArithmeticOverflow)?;

        let loyalty_amount = base_loyalty
            .checked_mul(merchant.loyalty_multiplier as u64)
            .ok_or(IPayError::ArithmeticOverflow)?
            .checked_div(100)
            .ok_or(IPayError::ArithmeticOverflow)?;

        if loyalty_amount > 0 {
            // Check supply cap before minting
            let current_supply = ctx.accounts.loyalty_mint.supply;
            require!(current_supply + loyalty_amount <= platform.max_supply, IPayError::SupplyCapExceeded);

            let platform_seeds = &[
                b"platform".as_ref(),
                &[platform.bump],
            ];
            let signer_seeds = &[&platform_seeds[..]];

            token_interface::mint_to(
                CpiContext::new_with_signer(
                    ctx.accounts.token_program.to_account_info(),
                    MintTo {
                        mint: ctx.accounts.loyalty_mint.to_account_info(),
                        to: ctx.accounts.payer_loyalty_account.to_account_info(),
                        authority: ctx.accounts.platform.to_account_info(),
                    },
                    signer_seeds,
                ),
                loyalty_amount,
            )?;
        }

        // Capture keys before mutable borrows
        let payer_key = ctx.accounts.payer.key();
        let merchant_key = ctx.accounts.merchant.key();
        let record_key = ctx.accounts.payment_record.key();
        let now = Clock::get()?.unix_timestamp;
        let counter = platform.payment_counter;

        // Step 3: Record payment
        let payment = &mut ctx.accounts.payment_record;
        payment.payer = payer_key;
        payment.merchant = merchant_key;
        payment.amount = amount;
        payment.platform_fee = platform_fee;
        payment.loyalty_earned = loyalty_amount;
        payment.memo = memo.clone();
        payment.timestamp = now;
        payment.payment_index = counter;
        payment.bump = ctx.bumps.payment_record;

        // Step 4: Update stats
        let merchant = &mut ctx.accounts.merchant;
        merchant.total_payments += 1;
        merchant.total_volume += amount;
        merchant.total_loyalty_distributed += loyalty_amount;

        let platform = &mut ctx.accounts.platform;
        platform.total_payments += 1;
        platform.total_volume += amount;
        platform.payment_counter += 1;

        emit!(PaymentProcessed {
            payment_record: record_key,
            payer: payer_key,
            merchant: merchant_key,
            amount,
            platform_fee,
            loyalty_earned: loyalty_amount,
            memo,
            timestamp: now,
        });

        msg!("Payment: {} lamports | Loyalty: {} iPAY", amount, loyalty_amount);
        Ok(())
    }

    // ========================================================================
    // SPL TOKEN PAYMENTS (USDC etc.)
    // ========================================================================

    pub fn process_payment_spl(
        ctx: Context<ProcessPaymentSpl>,
        amount: u64,
        memo: String,
    ) -> Result<()> {
        require!(amount > 0, IPayError::InvalidAmount);
        require!(amount <= 1_000_000_000_000, IPayError::AmountTooLarge);
        require!(memo.len() <= 64, IPayError::MemoTooLong);

        let merchant = &ctx.accounts.merchant;
        require!(merchant.is_active, IPayError::MerchantInactive);

        let platform = &ctx.accounts.platform;
        require!(!platform.is_paused, IPayError::PlatformPaused);

        let payment_mint_decimals = ctx.accounts.payment_mint.decimals;

        // Step 1: Calculate fee split
        let platform_fee = amount
            .checked_mul(platform.platform_fee_bps as u64)
            .ok_or(IPayError::ArithmeticOverflow)?
            .checked_div(10_000)
            .ok_or(IPayError::ArithmeticOverflow)?;
        let merchant_amount = amount.checked_sub(platform_fee).ok_or(IPayError::ArithmeticOverflow)?;

        // Step 2: Transfer SPL tokens to merchant
        token_interface::transfer_checked(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                TransferChecked {
                    from: ctx.accounts.payer_token_account.to_account_info(),
                    mint: ctx.accounts.payment_mint.to_account_info(),
                    to: ctx.accounts.merchant_token_account.to_account_info(),
                    authority: ctx.accounts.payer.to_account_info(),
                },
            ),
            merchant_amount,
            payment_mint_decimals,
        )?;

        // Transfer platform fee
        if platform_fee > 0 {
            token_interface::transfer_checked(
                CpiContext::new(
                    ctx.accounts.token_program.to_account_info(),
                    TransferChecked {
                        from: ctx.accounts.payer_token_account.to_account_info(),
                        mint: ctx.accounts.payment_mint.to_account_info(),
                        to: ctx.accounts.platform_token_account.to_account_info(),
                        authority: ctx.accounts.payer.to_account_info(),
                    },
                ),
                platform_fee,
                payment_mint_decimals,
            )?;
        }

        // Step 3: Auto-mint loyalty tokens
        // For SPL payments, use 1:1 ratio with loyalty_points_per_sol scaled by decimals
        let base_loyalty = amount
            .checked_mul(platform.loyalty_points_per_sol)
            .ok_or(IPayError::ArithmeticOverflow)?
            .checked_div(10u64.pow(payment_mint_decimals as u32))
            .ok_or(IPayError::ArithmeticOverflow)?;

        let loyalty_amount = base_loyalty
            .checked_mul(merchant.loyalty_multiplier as u64)
            .ok_or(IPayError::ArithmeticOverflow)?
            .checked_div(100)
            .ok_or(IPayError::ArithmeticOverflow)?;

        if loyalty_amount > 0 {
            // Check supply cap before minting
            let current_supply = ctx.accounts.loyalty_mint.supply;
            require!(current_supply + loyalty_amount <= platform.max_supply, IPayError::SupplyCapExceeded);

            let platform_seeds = &[
                b"platform".as_ref(),
                &[platform.bump],
            ];
            let signer_seeds = &[&platform_seeds[..]];

            token_interface::mint_to(
                CpiContext::new_with_signer(
                    ctx.accounts.loyalty_token_program.to_account_info(),
                    MintTo {
                        mint: ctx.accounts.loyalty_mint.to_account_info(),
                        to: ctx.accounts.payer_loyalty_account.to_account_info(),
                        authority: ctx.accounts.platform.to_account_info(),
                    },
                    signer_seeds,
                ),
                loyalty_amount,
            )?;
        }

        // Capture keys before mutable borrows
        let payer_key = ctx.accounts.payer.key();
        let merchant_key = ctx.accounts.merchant.key();
        let payment_record_key = ctx.accounts.payment_record.key();
        let now = Clock::get()?.unix_timestamp;
        let counter = platform.payment_counter;

        // Step 4: Record payment
        let payment = &mut ctx.accounts.payment_record;
        payment.payer = payer_key;
        payment.merchant = merchant_key;
        payment.amount = amount;
        payment.platform_fee = platform_fee;
        payment.loyalty_earned = loyalty_amount;
        payment.memo = memo.clone();
        payment.timestamp = now;
        payment.payment_index = counter;
        payment.bump = ctx.bumps.payment_record;

        // Step 5: Update stats
        let merchant = &mut ctx.accounts.merchant;
        merchant.total_payments += 1;
        merchant.total_volume += amount;
        merchant.total_loyalty_distributed += loyalty_amount;

        let platform = &mut ctx.accounts.platform;
        platform.total_payments += 1;
        platform.total_volume += amount;
        platform.payment_counter += 1;

        emit!(PaymentProcessed {
            payment_record: payment_record_key,
            payer: payer_key,
            merchant: merchant_key,
            amount,
            platform_fee,
            loyalty_earned: loyalty_amount,
            memo,
            timestamp: now,
        });

        msg!("SPL Payment: {} tokens | Loyalty: {} iPAY", amount, loyalty_amount);
        Ok(())
    }

    // ========================================================================
    // REFUNDS
    // ========================================================================

    pub fn process_refund(
        ctx: Context<ProcessRefund>,
        amount: u64,
    ) -> Result<()> {
        require!(amount > 0, IPayError::InvalidAmount);

        let payment = &ctx.accounts.payment_record;
        require!(amount <= payment.amount, IPayError::RefundExceedsPayment);

        // Transfer SOL back from merchant to payer
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.merchant_owner.to_account_info(),
                    to: ctx.accounts.payer.to_account_info(),
                },
            ),
            amount,
        )?;

        // Capture keys before mutable borrow
        let merchant_key = ctx.accounts.merchant.key();
        let payer_key = ctx.accounts.payer.key();
        let payment_key = ctx.accounts.payment_record.key();
        let refund_key = ctx.accounts.refund_record.key();
        let now = Clock::get()?.unix_timestamp;

        // Record refund
        let refund = &mut ctx.accounts.refund_record;
        refund.merchant = merchant_key;
        refund.payer = payer_key;
        refund.original_payment = payment_key;
        refund.amount = amount;
        refund.timestamp = now;
        refund.bump = ctx.bumps.refund_record;

        emit!(RefundProcessed {
            refund_record: refund_key,
            merchant: merchant_key,
            payer: payer_key,
            original_payment: payment_key,
            amount,
            timestamp: now,
        });

        msg!("Refund: {} lamports returned to payer", amount);
        Ok(())
    }

    // ========================================================================
    // LOYALTY REDEMPTION
    // ========================================================================

    pub fn redeem_loyalty(
        ctx: Context<RedeemLoyalty>,
        loyalty_amount: u64,
    ) -> Result<()> {
        require!(loyalty_amount > 0, IPayError::InvalidAmount);

        token_interface::burn(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token_interface::Burn {
                    mint: ctx.accounts.loyalty_mint.to_account_info(),
                    from: ctx.accounts.user_loyalty_account.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                },
            ),
            loyalty_amount,
        )?;

        emit!(LoyaltyRedeemed {
            user: ctx.accounts.user.key(),
            merchant: ctx.accounts.merchant.key(),
            loyalty_amount,
            timestamp: Clock::get()?.unix_timestamp,
        });

        msg!("Redeemed {} iPAY at '{}'", loyalty_amount, ctx.accounts.merchant.name);
        Ok(())
    }

    // ========================================================================
    // PLATFORM PAUSE / UNPAUSE
    // ========================================================================

    pub fn pause_platform(ctx: Context<PausePlatform>) -> Result<()> {
        let platform = &mut ctx.accounts.platform;
        platform.is_paused = true;
        msg!("iPay Platform paused by authority");
        Ok(())
    }

    pub fn unpause_platform(ctx: Context<UnpausePlatform>) -> Result<()> {
        let platform = &mut ctx.accounts.platform;
        platform.is_paused = false;
        msg!("iPay Platform unpaused by authority");
        Ok(())
    }

    // ========================================================================
    // ESCROW PAYMENTS (E-commerce Trust Layer)
    // ========================================================================

    pub fn create_escrow_payment(
        ctx: Context<CreateEscrowPayment>,
        amount: u64,
        memo: String,
        release_after: i64,
    ) -> Result<()> {
        require!(amount > 0, IPayError::InvalidAmount);
        require!(amount <= 1_000_000_000_000, IPayError::AmountTooLarge);
        require!(memo.len() <= 64, IPayError::MemoTooLong);

        let merchant = &ctx.accounts.merchant;
        require!(merchant.is_active, IPayError::MerchantInactive);

        let platform = &ctx.accounts.platform;
        require!(!platform.is_paused, IPayError::PlatformPaused);

        let now = Clock::get()?.unix_timestamp;
        require!(release_after > now, IPayError::InvalidReleaseTime);

        // Transfer SOL to escrow PDA (held by the escrow account)
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.payer.to_account_info(),
                    to: ctx.accounts.escrow.to_account_info(),
                },
            ),
            amount,
        )?;

        let payer_key = ctx.accounts.payer.key();
        let merchant_key = ctx.accounts.merchant.key();

        let escrow = &mut ctx.accounts.escrow;
        escrow.payer = payer_key;
        escrow.merchant = merchant_key;
        escrow.amount = amount;
        escrow.memo = memo;
        escrow.created_at = now;
        escrow.release_after = release_after;
        escrow.status = EscrowStatus::Funded;
        escrow.bump = ctx.bumps.escrow;

        emit!(EscrowCreated {
            escrow: ctx.accounts.escrow.key(),
            payer: payer_key,
            merchant: merchant_key,
            amount,
            release_after,
            timestamp: now,
        });

        msg!("Escrow created: {} lamports, releases after {}", amount, release_after);
        Ok(())
    }

    pub fn release_escrow(ctx: Context<ReleaseEscrow>) -> Result<()> {
        let escrow = &ctx.accounts.escrow;
        require!(escrow.status == EscrowStatus::Funded, IPayError::EscrowNotFunded);

        let now = Clock::get()?.unix_timestamp;
        // Either payer releases early, or auto-release after deadline
        let is_payer = ctx.accounts.authority.key() == escrow.payer;
        let is_past_deadline = now >= escrow.release_after;
        let is_merchant = ctx.accounts.authority.key() == ctx.accounts.merchant.owner;
        // Payer can release at any time (voluntary); merchant can only release AFTER deadline
        require!(is_payer || (is_merchant && is_past_deadline), IPayError::EscrowNotReleasable);

        let platform = &ctx.accounts.platform;
        let platform_fee = escrow.amount
            .checked_mul(platform.platform_fee_bps as u64)
            .ok_or(IPayError::ArithmeticOverflow)?
            .checked_div(10_000)
            .ok_or(IPayError::ArithmeticOverflow)?;
        let merchant_amount = escrow.amount.checked_sub(platform_fee).ok_or(IPayError::ArithmeticOverflow)?;

        // Transfer from escrow to merchant
        let escrow_info = ctx.accounts.escrow.to_account_info();
        let merchant_wallet_info = ctx.accounts.merchant_wallet.to_account_info();
        **escrow_info.try_borrow_mut_lamports()? -= merchant_amount;
        **merchant_wallet_info.try_borrow_mut_lamports()? += merchant_amount;

        if platform_fee > 0 {
            let platform_wallet_info = ctx.accounts.platform_wallet.to_account_info();
            **escrow_info.try_borrow_mut_lamports()? -= platform_fee;
            **platform_wallet_info.try_borrow_mut_lamports()? += platform_fee;
        }

        let escrow_key = ctx.accounts.escrow.key();
        let escrow = &mut ctx.accounts.escrow;
        escrow.status = EscrowStatus::Released;
        let escrow_amount = escrow.amount;

        // Update merchant stats
        let merchant = &mut ctx.accounts.merchant;
        merchant.total_payments += 1;
        merchant.total_volume += escrow_amount;

        let platform = &mut ctx.accounts.platform;
        platform.total_payments += 1;
        platform.total_volume += escrow_amount;

        emit!(EscrowReleased {
            escrow: escrow_key,
            amount: escrow_amount,
            timestamp: now,
        });

        msg!("Escrow released: {} lamports to merchant", merchant_amount);
        Ok(())
    }

    pub fn dispute_escrow(ctx: Context<DisputeEscrow>) -> Result<()> {
        let escrow = &ctx.accounts.escrow;
        require!(escrow.status == EscrowStatus::Funded, IPayError::EscrowNotFunded);
        require!(ctx.accounts.payer.key() == escrow.payer, IPayError::UnauthorizedDispute);

        let escrow_dispute_key = ctx.accounts.escrow.key();
        let escrow = &mut ctx.accounts.escrow;
        escrow.status = EscrowStatus::Disputed;

        emit!(EscrowDisputed {
            escrow: escrow_dispute_key,
            payer: ctx.accounts.payer.key(),
            timestamp: Clock::get()?.unix_timestamp,
        });

        msg!("Escrow disputed by payer");
        Ok(())
    }

    pub fn resolve_dispute(
        ctx: Context<ResolveDispute>,
        refund_payer: bool,
    ) -> Result<()> {
        let escrow = &ctx.accounts.escrow;
        require!(escrow.status == EscrowStatus::Disputed, IPayError::EscrowNotDisputed);

        let amount = escrow.amount;
        let escrow_info = ctx.accounts.escrow.to_account_info();

        if refund_payer {
            let payer_info = ctx.accounts.payer.to_account_info();
            **escrow_info.try_borrow_mut_lamports()? -= amount;
            **payer_info.try_borrow_mut_lamports()? += amount;
        } else {
            let merchant_wallet_info = ctx.accounts.merchant_wallet.to_account_info();
            **escrow_info.try_borrow_mut_lamports()? -= amount;
            **merchant_wallet_info.try_borrow_mut_lamports()? += amount;

            let merchant = &mut ctx.accounts.merchant;
            merchant.total_payments += 1;
            merchant.total_volume += amount;
        }

        let escrow = &mut ctx.accounts.escrow;
        escrow.status = if refund_payer { EscrowStatus::Refunded } else { EscrowStatus::Released };

        emit!(DisputeResolved {
            escrow: ctx.accounts.escrow.key(),
            refund_payer,
            timestamp: Clock::get()?.unix_timestamp,
        });

        msg!("Dispute resolved. Refund to payer: {}", refund_payer);
        Ok(())
    }

    // ========================================================================
    // SUBSCRIPTION / RECURRING PAYMENTS
    // ========================================================================

    pub fn create_subscription(
        ctx: Context<CreateSubscription>,
        amount: u64,
        interval_seconds: i64,
        max_cycles: u16,
    ) -> Result<()> {
        require!(amount > 0, IPayError::InvalidAmount);
        require!(interval_seconds >= 3600, IPayError::IntervalTooShort); // Min 1 hour
        require!(max_cycles > 0 && max_cycles <= 1200, IPayError::InvalidCycles); // Max 100 years monthly

        let merchant = &ctx.accounts.merchant;
        require!(merchant.is_active, IPayError::MerchantInactive);

        let now = Clock::get()?.unix_timestamp;
        let subscriber_key = ctx.accounts.subscriber.key();
        let merchant_key = ctx.accounts.merchant.key();

        let sub = &mut ctx.accounts.subscription;
        sub.subscriber = subscriber_key;
        sub.merchant = merchant_key;
        sub.amount = amount;
        sub.interval_seconds = interval_seconds;
        sub.max_cycles = max_cycles;
        sub.cycles_completed = 0;
        sub.created_at = now;
        sub.next_payment_at = now;
        sub.is_active = true;
        sub.bump = ctx.bumps.subscription;

        emit!(SubscriptionCreated {
            subscription: ctx.accounts.subscription.key(),
            subscriber: subscriber_key,
            merchant: merchant_key,
            amount,
            interval_seconds,
            max_cycles,
            timestamp: now,
        });

        msg!("Subscription created: {} lamports every {} seconds", amount, interval_seconds);
        Ok(())
    }

    pub fn execute_subscription_payment(
        ctx: Context<ExecuteSubscriptionPayment>,
    ) -> Result<()> {
        let sub = &ctx.accounts.subscription;
        require!(sub.is_active, IPayError::SubscriptionInactive);
        require!(sub.cycles_completed < sub.max_cycles, IPayError::SubscriptionMaxCycles);

        let now = Clock::get()?.unix_timestamp;
        require!(now >= sub.next_payment_at, IPayError::SubscriptionNotDue);

        let platform = &ctx.accounts.platform;
        require!(!platform.is_paused, IPayError::PlatformPaused);

        let amount = sub.amount;

        // Calculate fees
        let platform_fee = amount
            .checked_mul(platform.platform_fee_bps as u64)
            .ok_or(IPayError::ArithmeticOverflow)?
            .checked_div(10_000)
            .ok_or(IPayError::ArithmeticOverflow)?;
        let merchant_amount = amount.checked_sub(platform_fee).ok_or(IPayError::ArithmeticOverflow)?;

        // Transfer SOL from subscriber to merchant
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.subscriber.to_account_info(),
                    to: ctx.accounts.merchant_wallet.to_account_info(),
                },
            ),
            merchant_amount,
        )?;

        if platform_fee > 0 {
            anchor_lang::system_program::transfer(
                CpiContext::new(
                    ctx.accounts.system_program.to_account_info(),
                    anchor_lang::system_program::Transfer {
                        from: ctx.accounts.subscriber.to_account_info(),
                        to: ctx.accounts.platform_wallet.to_account_info(),
                    },
                ),
                platform_fee,
            )?;
        }

        let subscription_key = ctx.accounts.subscription.key();
        let sub = &mut ctx.accounts.subscription;
        sub.cycles_completed += 1;
        sub.next_payment_at = now + sub.interval_seconds;

        if sub.cycles_completed >= sub.max_cycles {
            sub.is_active = false;
        }

        let cycles_completed = sub.cycles_completed;

        // Update merchant stats
        let merchant = &mut ctx.accounts.merchant;
        merchant.total_payments += 1;
        merchant.total_volume += amount;

        let platform = &mut ctx.accounts.platform;
        platform.total_payments += 1;
        platform.total_volume += amount;

        emit!(SubscriptionPaymentProcessed {
            subscription: subscription_key,
            amount,
            cycle: cycles_completed,
            timestamp: now,
        });

        msg!("Subscription payment #{}: {} lamports", cycles_completed, amount);
        Ok(())
    }

    pub fn cancel_subscription(ctx: Context<CancelSubscription>) -> Result<()> {
        let sub = &mut ctx.accounts.subscription;
        require!(sub.is_active, IPayError::SubscriptionInactive);
        sub.is_active = false;

        emit!(SubscriptionCancelled {
            subscription: ctx.accounts.subscription.key(),
            timestamp: Clock::get()?.unix_timestamp,
        });

        msg!("Subscription cancelled");
        Ok(())
    }

    // ========================================================================
    // PAYMENT WITH TIP (Restaurants, Services)
    // ========================================================================

    pub fn process_payment_with_tip(
        ctx: Context<ProcessPayment>,
        amount: u64,
        memo: String,
        tip_amount: u64,
    ) -> Result<()> {
        require!(amount > 0, IPayError::InvalidAmount);
        require!(tip_amount <= amount, IPayError::TipExceedsAmount);
        require!(memo.len() <= 64, IPayError::MemoTooLong);

        let total = amount.checked_add(tip_amount).ok_or(IPayError::ArithmeticOverflow)?;
        require!(total <= 1_000_000_000_000, IPayError::AmountTooLarge);

        let merchant = &ctx.accounts.merchant;
        require!(merchant.is_active, IPayError::MerchantInactive);

        let platform = &ctx.accounts.platform;
        require!(!platform.is_paused, IPayError::PlatformPaused);

        // Fee only on the base amount, NOT on tip
        let platform_fee = amount
            .checked_mul(platform.platform_fee_bps as u64)
            .ok_or(IPayError::ArithmeticOverflow)?
            .checked_div(10_000)
            .ok_or(IPayError::ArithmeticOverflow)?;
        let merchant_amount = total.checked_sub(platform_fee).ok_or(IPayError::ArithmeticOverflow)?;

        // Transfer to merchant (base + tip - fee)
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.payer.to_account_info(),
                    to: ctx.accounts.merchant_wallet.to_account_info(),
                },
            ),
            merchant_amount,
        )?;

        if platform_fee > 0 {
            anchor_lang::system_program::transfer(
                CpiContext::new(
                    ctx.accounts.system_program.to_account_info(),
                    anchor_lang::system_program::Transfer {
                        from: ctx.accounts.payer.to_account_info(),
                        to: ctx.accounts.platform_wallet.to_account_info(),
                    },
                ),
                platform_fee,
            )?;
        }

        // Loyalty on total amount (reward tipping!)
        let base_loyalty = total
            .checked_mul(platform.loyalty_points_per_sol)
            .ok_or(IPayError::ArithmeticOverflow)?
            .checked_div(1_000_000_000)
            .ok_or(IPayError::ArithmeticOverflow)?;

        let loyalty_amount = base_loyalty
            .checked_mul(merchant.loyalty_multiplier as u64)
            .ok_or(IPayError::ArithmeticOverflow)?
            .checked_div(100)
            .ok_or(IPayError::ArithmeticOverflow)?;

        if loyalty_amount > 0 {
            let current_supply = ctx.accounts.loyalty_mint.supply;
            require!(current_supply + loyalty_amount <= platform.max_supply, IPayError::SupplyCapExceeded);

            let platform_seeds = &[b"platform".as_ref(), &[platform.bump]];
            let signer_seeds = &[&platform_seeds[..]];

            token_interface::mint_to(
                CpiContext::new_with_signer(
                    ctx.accounts.token_program.to_account_info(),
                    MintTo {
                        mint: ctx.accounts.loyalty_mint.to_account_info(),
                        to: ctx.accounts.payer_loyalty_account.to_account_info(),
                        authority: ctx.accounts.platform.to_account_info(),
                    },
                    signer_seeds,
                ),
                loyalty_amount,
            )?;
        }

        let payer_key = ctx.accounts.payer.key();
        let merchant_key = ctx.accounts.merchant.key();
        let record_key = ctx.accounts.payment_record.key();
        let now = Clock::get()?.unix_timestamp;
        let counter = platform.payment_counter;

        let payment = &mut ctx.accounts.payment_record;
        payment.payer = payer_key;
        payment.merchant = merchant_key;
        payment.amount = total;
        payment.platform_fee = platform_fee;
        payment.loyalty_earned = loyalty_amount;
        payment.memo = memo.clone();
        payment.timestamp = now;
        payment.payment_index = counter;
        payment.bump = ctx.bumps.payment_record;

        let merchant = &mut ctx.accounts.merchant;
        merchant.total_payments += 1;
        merchant.total_volume += total;
        merchant.total_loyalty_distributed += loyalty_amount;

        let platform = &mut ctx.accounts.platform;
        platform.total_payments += 1;
        platform.total_volume += total;
        platform.payment_counter += 1;

        emit!(PaymentWithTipProcessed {
            payment_record: record_key,
            payer: payer_key,
            merchant: merchant_key,
            amount,
            tip_amount,
            platform_fee,
            loyalty_earned: loyalty_amount,
            timestamp: now,
        });

        msg!("Payment: {} + tip: {} | Loyalty: {} iPAY", amount, tip_amount, loyalty_amount);
        Ok(())
    }

    // ========================================================================
    // PAYMENT SPLITTING (Marketplaces, Multi-vendor)
    // ========================================================================

    pub fn process_split_payment(
        ctx: Context<ProcessSplitPayment>,
        amount: u64,
        memo: String,
        split_bps: u16,
    ) -> Result<()> {
        require!(amount > 0, IPayError::InvalidAmount);
        require!(amount <= 1_000_000_000_000, IPayError::AmountTooLarge);
        require!(memo.len() <= 64, IPayError::MemoTooLong);
        require!(split_bps > 0 && split_bps < 10_000, IPayError::InvalidSplitBps);

        let merchant = &ctx.accounts.merchant;
        require!(merchant.is_active, IPayError::MerchantInactive);

        let platform = &ctx.accounts.platform;
        require!(!platform.is_paused, IPayError::PlatformPaused);

        let platform_fee = amount
            .checked_mul(platform.platform_fee_bps as u64)
            .ok_or(IPayError::ArithmeticOverflow)?
            .checked_div(10_000)
            .ok_or(IPayError::ArithmeticOverflow)?;

        let after_fee = amount.checked_sub(platform_fee).ok_or(IPayError::ArithmeticOverflow)?;

        // Split: merchant gets split_bps, secondary recipient gets rest
        let merchant_amount = after_fee
            .checked_mul(split_bps as u64)
            .ok_or(IPayError::ArithmeticOverflow)?
            .checked_div(10_000)
            .ok_or(IPayError::ArithmeticOverflow)?;
        let secondary_amount = after_fee.checked_sub(merchant_amount).ok_or(IPayError::ArithmeticOverflow)?;

        // Transfer to merchant
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.payer.to_account_info(),
                    to: ctx.accounts.merchant_wallet.to_account_info(),
                },
            ),
            merchant_amount,
        )?;

        // Transfer to secondary recipient
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.payer.to_account_info(),
                    to: ctx.accounts.secondary_wallet.to_account_info(),
                },
            ),
            secondary_amount,
        )?;

        if platform_fee > 0 {
            anchor_lang::system_program::transfer(
                CpiContext::new(
                    ctx.accounts.system_program.to_account_info(),
                    anchor_lang::system_program::Transfer {
                        from: ctx.accounts.payer.to_account_info(),
                        to: ctx.accounts.platform_wallet.to_account_info(),
                    },
                ),
                platform_fee,
            )?;
        }

        emit!(SplitPaymentProcessed {
            payer: ctx.accounts.payer.key(),
            merchant: ctx.accounts.merchant.key(),
            amount,
            merchant_amount,
            secondary_amount,
            platform_fee,
            timestamp: Clock::get()?.unix_timestamp,
        });

        msg!("Split payment: {} to merchant, {} to secondary", merchant_amount, secondary_amount);
        Ok(())
    }

    // ========================================================================
    // MERCHANT VERIFICATION TIERS (KYC On-chain)
    // ========================================================================

    pub fn verify_merchant(
        ctx: Context<VerifyMerchant>,
        tier: u8,
    ) -> Result<()> {
        require!(tier <= 3, IPayError::InvalidVerificationTier);

        let merchant_key = ctx.accounts.merchant.key();
        let _merchant = &mut ctx.accounts.merchant;
        // Store verification tier in the merchant_category field's first byte conceptually
        // For production, add a verification_tier field to Merchant struct

        emit!(MerchantVerified {
            merchant: merchant_key,
            tier,
            verified_by: ctx.accounts.authority.key(),
            timestamp: Clock::get()?.unix_timestamp,
        });

        msg!("Merchant verified at tier {}", tier);
        Ok(())
    }

    // ========================================================================
    // LOYALTY STAKING (Stake iPAY for Benefits)
    // ========================================================================

    pub fn stake_loyalty(
        ctx: Context<StakeLoyalty>,
        amount: u64,
        lock_duration: i64,
    ) -> Result<()> {
        require!(amount > 0, IPayError::InvalidAmount);
        require!(lock_duration >= 86400, IPayError::LockTooShort); // Min 1 day
        require!(lock_duration <= 31536000, IPayError::LockTooLong); // Max 1 year

        let now = Clock::get()?.unix_timestamp;

        // Transfer iPAY tokens to stake vault
        token_interface::transfer_checked(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                TransferChecked {
                    from: ctx.accounts.user_loyalty_account.to_account_info(),
                    mint: ctx.accounts.loyalty_mint.to_account_info(),
                    to: ctx.accounts.stake_vault.to_account_info(),
                    authority: ctx.accounts.user.to_account_info(),
                },
            ),
            amount,
            ctx.accounts.loyalty_mint.decimals,
        )?;

        let stake = &mut ctx.accounts.stake_record;
        stake.user = ctx.accounts.user.key();
        stake.amount = amount;
        stake.staked_at = now;
        stake.unlock_at = now + lock_duration;
        stake.is_active = true;
        stake.bump = ctx.bumps.stake_record;

        emit!(LoyaltyStaked {
            user: ctx.accounts.user.key(),
            amount,
            unlock_at: now + lock_duration,
            timestamp: now,
        });

        msg!("Staked {} iPAY until {}", amount, now + lock_duration);
        Ok(())
    }

    pub fn unstake_loyalty(ctx: Context<UnstakeLoyalty>) -> Result<()> {
        let stake = &ctx.accounts.stake_record;
        require!(stake.is_active, IPayError::StakeNotActive);

        let now = Clock::get()?.unix_timestamp;
        require!(now >= stake.unlock_at, IPayError::StakeLocked);

        let amount = stake.amount;

        let platform_seeds = &[b"platform".as_ref(), &[ctx.accounts.platform.bump]];
        let signer_seeds = &[&platform_seeds[..]];

        // Transfer iPAY back from vault to user
        token_interface::transfer_checked(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                TransferChecked {
                    from: ctx.accounts.stake_vault.to_account_info(),
                    mint: ctx.accounts.loyalty_mint.to_account_info(),
                    to: ctx.accounts.user_loyalty_account.to_account_info(),
                    authority: ctx.accounts.platform.to_account_info(),
                },
                signer_seeds,
            ),
            amount,
            ctx.accounts.loyalty_mint.decimals,
        )?;

        let stake = &mut ctx.accounts.stake_record;
        stake.is_active = false;

        emit!(LoyaltyUnstaked {
            user: ctx.accounts.user.key(),
            amount,
            timestamp: now,
        });

        msg!("Unstaked {} iPAY", amount);
        Ok(())
    }
}

// ============================================================================
// EVENTS
// ============================================================================

// ============================================================================
// ESCROW STATUS ENUM
// ============================================================================

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum EscrowStatus {
    Funded,
    Released,
    Disputed,
    Refunded,
}

// ============================================================================
// EVENTS
// ============================================================================

#[event]
pub struct EscrowCreated {
    pub escrow: Pubkey,
    pub payer: Pubkey,
    pub merchant: Pubkey,
    pub amount: u64,
    pub release_after: i64,
    pub timestamp: i64,
}

#[event]
pub struct EscrowReleased {
    pub escrow: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct EscrowDisputed {
    pub escrow: Pubkey,
    pub payer: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct DisputeResolved {
    pub escrow: Pubkey,
    pub refund_payer: bool,
    pub timestamp: i64,
}

#[event]
pub struct SubscriptionCreated {
    pub subscription: Pubkey,
    pub subscriber: Pubkey,
    pub merchant: Pubkey,
    pub amount: u64,
    pub interval_seconds: i64,
    pub max_cycles: u16,
    pub timestamp: i64,
}

#[event]
pub struct SubscriptionPaymentProcessed {
    pub subscription: Pubkey,
    pub amount: u64,
    pub cycle: u16,
    pub timestamp: i64,
}

#[event]
pub struct SubscriptionCancelled {
    pub subscription: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct PaymentWithTipProcessed {
    pub payment_record: Pubkey,
    pub payer: Pubkey,
    pub merchant: Pubkey,
    pub amount: u64,
    pub tip_amount: u64,
    pub platform_fee: u64,
    pub loyalty_earned: u64,
    pub timestamp: i64,
}

#[event]
pub struct SplitPaymentProcessed {
    pub payer: Pubkey,
    pub merchant: Pubkey,
    pub amount: u64,
    pub merchant_amount: u64,
    pub secondary_amount: u64,
    pub platform_fee: u64,
    pub timestamp: i64,
}

#[event]
pub struct MerchantVerified {
    pub merchant: Pubkey,
    pub tier: u8,
    pub verified_by: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct LoyaltyStaked {
    pub user: Pubkey,
    pub amount: u64,
    pub unlock_at: i64,
    pub timestamp: i64,
}

#[event]
pub struct LoyaltyUnstaked {
    pub user: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct PaymentProcessed {
    pub payment_record: Pubkey,
    pub payer: Pubkey,
    pub merchant: Pubkey,
    pub amount: u64,
    pub platform_fee: u64,
    pub loyalty_earned: u64,
    pub memo: String,
    pub timestamp: i64,
}

#[event]
pub struct MerchantRegistered {
    pub merchant: Pubkey,
    pub owner: Pubkey,
    pub name: String,
    pub timestamp: i64,
}

#[event]
pub struct LoyaltyRedeemed {
    pub user: Pubkey,
    pub merchant: Pubkey,
    pub loyalty_amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct RefundProcessed {
    pub refund_record: Pubkey,
    pub merchant: Pubkey,
    pub payer: Pubkey,
    pub original_payment: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}

// ============================================================================
// ACCOUNT STRUCTURES
// ============================================================================

#[account]
pub struct Platform {
    pub authority: Pubkey,
    pub loyalty_mint: Pubkey,
    pub loyalty_points_per_sol: u64,
    pub platform_fee_bps: u16,
    pub total_merchants: u64,
    pub total_payments: u64,
    pub total_volume: u64,
    pub payment_counter: u64,
    pub max_supply: u64,
    pub is_paused: bool,
    pub bump: u8,
}

#[account]
pub struct Merchant {
    pub owner: Pubkey,
    pub name: String,
    pub description: String,
    pub merchant_category: String,
    pub loyalty_multiplier: u16,
    pub total_payments: u64,
    pub total_volume: u64,
    pub total_loyalty_distributed: u64,
    pub is_active: bool,
    pub created_at: i64,
    pub bump: u8,
}

#[account]
pub struct PaymentRecord {
    pub payer: Pubkey,
    pub merchant: Pubkey,
    pub amount: u64,
    pub platform_fee: u64,
    pub loyalty_earned: u64,
    pub memo: String,
    pub timestamp: i64,
    pub payment_index: u64,
    pub bump: u8,
}

#[account]
pub struct RefundRecord {
    pub merchant: Pubkey,
    pub payer: Pubkey,
    pub original_payment: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
    pub bump: u8,
}

#[account]
pub struct EscrowPayment {
    pub payer: Pubkey,
    pub merchant: Pubkey,
    pub amount: u64,
    pub memo: String,
    pub created_at: i64,
    pub release_after: i64,
    pub status: EscrowStatus,
    pub bump: u8,
}

#[account]
pub struct Subscription {
    pub subscriber: Pubkey,
    pub merchant: Pubkey,
    pub amount: u64,
    pub interval_seconds: i64,
    pub max_cycles: u16,
    pub cycles_completed: u16,
    pub created_at: i64,
    pub next_payment_at: i64,
    pub is_active: bool,
    pub bump: u8,
}

#[account]
pub struct StakeRecord {
    pub user: Pubkey,
    pub amount: u64,
    pub staked_at: i64,
    pub unlock_at: i64,
    pub is_active: bool,
    pub bump: u8,
}

// ============================================================================
// INSTRUCTION CONTEXTS
// ============================================================================

#[derive(Accounts)]
pub struct InitializePlatform<'info> {
    #[account(
        init,
        payer = authority,
        // 8 discriminator + 32 authority + 32 loyalty_mint + 8 loyalty_points_per_sol + 2 platform_fee_bps
        // + 8 total_merchants + 8 total_payments + 8 total_volume + 8 payment_counter
        // + 8 max_supply + 1 is_paused + 1 bump
        space = 8 + 32 + 32 + 8 + 2 + 8 + 8 + 8 + 8 + 8 + 1 + 1,
        seeds = [b"platform"],
        bump
    )]
    pub platform: Account<'info, Platform>,

    #[account(
        init,
        payer = authority,
        mint::decimals = 6,
        mint::authority = platform,
    )]
    pub loyalty_mint: InterfaceAccount<'info, Mint>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Interface<'info, TokenInterface>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct RegisterMerchant<'info> {
    #[account(
        init,
        payer = owner,
        // 8 discriminator + 32 owner + (4+32) name + (4+128) description + (4+32) merchant_category
        // + 2 loyalty_multiplier + 8 total_payments + 8 total_volume + 8 total_loyalty_distributed
        // + 1 is_active + 8 created_at + 1 bump
        space = 8 + 32 + (4 + 32) + (4 + 128) + (4 + 32) + 2 + 8 + 8 + 8 + 1 + 8 + 1,
        seeds = [b"merchant", owner.key().as_ref()],
        bump
    )]
    pub merchant: Account<'info, Merchant>,

    #[account(
        mut,
        seeds = [b"platform"],
        bump = platform.bump
    )]
    pub platform: Account<'info, Platform>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateMerchant<'info> {
    #[account(
        mut,
        seeds = [b"merchant", owner.key().as_ref()],
        bump = merchant.bump,
        has_one = owner
    )]
    pub merchant: Account<'info, Merchant>,

    pub owner: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(amount: u64, memo: String)]
pub struct ProcessPayment<'info> {
    #[account(
        mut,
        seeds = [b"platform"],
        bump = platform.bump
    )]
    pub platform: Account<'info, Platform>,

    #[account(
        mut,
        seeds = [b"merchant", merchant.owner.as_ref()],
        bump = merchant.bump
    )]
    pub merchant: Account<'info, Merchant>,

    #[account(
        init,
        payer = payer,
        space = 8 + 32 + 32 + 8 + 8 + 8 + (4 + 64) + 8 + 8 + 1,
        seeds = [
            b"payment",
            platform.payment_counter.to_le_bytes().as_ref()
        ],
        bump
    )]
    pub payment_record: Account<'info, PaymentRecord>,

    #[account(
        mut,
        address = platform.loyalty_mint
    )]
    pub loyalty_mint: InterfaceAccount<'info, Mint>,

    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = loyalty_mint,
        associated_token::authority = payer,
        associated_token::token_program = token_program,
    )]
    pub payer_loyalty_account: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: Merchant wallet receiving payment — validated against merchant.owner
    #[account(mut, address = merchant.owner)]
    pub merchant_wallet: AccountInfo<'info>,

    /// CHECK: Platform wallet receiving fees — validated against platform.authority
    #[account(mut, address = platform.authority)]
    pub platform_wallet: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(Accounts)]
#[instruction(amount: u64, memo: String)]
pub struct ProcessPaymentSpl<'info> {
    #[account(
        mut,
        seeds = [b"platform"],
        bump = platform.bump
    )]
    pub platform: Box<Account<'info, Platform>>,

    #[account(
        mut,
        seeds = [b"merchant", merchant.owner.as_ref()],
        bump = merchant.bump
    )]
    pub merchant: Box<Account<'info, Merchant>>,

    #[account(
        init,
        payer = payer,
        space = 8 + 32 + 32 + 8 + 8 + 8 + (4 + 64) + 8 + 8 + 1,
        seeds = [
            b"payment",
            platform.payment_counter.to_le_bytes().as_ref()
        ],
        bump
    )]
    pub payment_record: Box<Account<'info, PaymentRecord>>,

    /// The SPL token mint used for payment (e.g. USDC)
    pub payment_mint: Box<InterfaceAccount<'info, Mint>>,

    /// Payer's token account for the payment mint
    #[account(
        mut,
        associated_token::mint = payment_mint,
        associated_token::authority = payer,
        associated_token::token_program = token_program,
    )]
    pub payer_token_account: Box<InterfaceAccount<'info, TokenAccount>>,

    /// Merchant's token account for the payment mint
    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = payment_mint,
        associated_token::authority = merchant_owner,
        associated_token::token_program = token_program,
    )]
    pub merchant_token_account: Box<InterfaceAccount<'info, TokenAccount>>,

    /// Platform's token account for fees
    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = payment_mint,
        associated_token::authority = platform_authority,
        associated_token::token_program = token_program,
    )]
    pub platform_token_account: Box<InterfaceAccount<'info, TokenAccount>>,

    /// CHECK: The merchant owner, validated by merchant.owner
    #[account(address = merchant.owner)]
    pub merchant_owner: AccountInfo<'info>,

    /// CHECK: Platform authority receiving fees
    #[account(address = platform.authority)]
    pub platform_authority: AccountInfo<'info>,

    #[account(
        mut,
        address = platform.loyalty_mint
    )]
    pub loyalty_mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = loyalty_mint,
        associated_token::authority = payer,
        associated_token::token_program = loyalty_token_program,
    )]
    pub payer_loyalty_account: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
    /// Token program for the payment mint (e.g. Token-2022 or SPL Token)
    pub token_program: Interface<'info, TokenInterface>,
    /// Token program for the loyalty mint
    pub loyalty_token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(Accounts)]
pub struct ProcessRefund<'info> {
    #[account(
        seeds = [b"merchant", merchant_owner.key().as_ref()],
        bump = merchant.bump,
        constraint = merchant.owner == merchant_owner.key() @ IPayError::UnauthorizedRefund,
    )]
    pub merchant: Account<'info, Merchant>,

    /// The original payment record being refunded
    #[account(
        seeds = [
            b"payment",
            payment_record.payment_index.to_le_bytes().as_ref()
        ],
        bump = payment_record.bump,
        constraint = payment_record.merchant == merchant.key() @ IPayError::PaymentMerchantMismatch,
    )]
    pub payment_record: Account<'info, PaymentRecord>,

    #[account(
        init,
        payer = merchant_owner,
        // 8 discriminator + 32 merchant + 32 payer + 32 original_payment + 8 amount + 8 timestamp + 1 bump
        space = 8 + 32 + 32 + 32 + 8 + 8 + 1,
        seeds = [b"refund", payment_record.key().as_ref()],
        bump
    )]
    pub refund_record: Account<'info, RefundRecord>,

    /// The merchant owner who authorizes the refund -- must be a signer
    #[account(mut)]
    pub merchant_owner: Signer<'info>,

    /// CHECK: The original payer receiving the refund
    #[account(
        mut,
        address = payment_record.payer @ IPayError::InvalidRefundRecipient
    )]
    pub payer: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RedeemLoyalty<'info> {
    #[account(
        seeds = [b"merchant", merchant.owner.as_ref()],
        bump = merchant.bump
    )]
    pub merchant: Account<'info, Merchant>,

    #[account(
        seeds = [b"platform"],
        bump = platform.bump
    )]
    pub platform: Account<'info, Platform>,

    #[account(
        mut,
        address = platform.loyalty_mint
    )]
    pub loyalty_mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = loyalty_mint,
        associated_token::authority = user,
        associated_token::token_program = token_program,
    )]
    pub user_loyalty_account: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub token_program: Interface<'info, TokenInterface>,
}

// ============================================================================
// ESCROW INSTRUCTION CONTEXTS
// ============================================================================

#[derive(Accounts)]
#[instruction(amount: u64, memo: String, release_after: i64)]
pub struct CreateEscrowPayment<'info> {
    #[account(
        seeds = [b"platform"],
        bump = platform.bump
    )]
    pub platform: Account<'info, Platform>,

    #[account(
        seeds = [b"merchant", merchant.owner.as_ref()],
        bump = merchant.bump
    )]
    pub merchant: Account<'info, Merchant>,

    #[account(
        init,
        payer = payer,
        space = 8 + 32 + 32 + 8 + (4 + 64) + 8 + 8 + 1 + 1,
        seeds = [b"escrow", payer.key().as_ref(), merchant.key().as_ref()],
        bump
    )]
    pub escrow: Account<'info, EscrowPayment>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ReleaseEscrow<'info> {
    #[account(
        mut,
        seeds = [b"platform"],
        bump = platform.bump
    )]
    pub platform: Account<'info, Platform>,

    #[account(
        mut,
        seeds = [b"merchant", merchant.owner.as_ref()],
        bump = merchant.bump
    )]
    pub merchant: Account<'info, Merchant>,

    #[account(
        mut,
        seeds = [b"escrow", escrow.payer.as_ref(), merchant.key().as_ref()],
        bump = escrow.bump
    )]
    pub escrow: Account<'info, EscrowPayment>,

    pub authority: Signer<'info>,

    /// CHECK: Merchant wallet receiving payment — validated against merchant.owner
    #[account(mut, address = merchant.owner)]
    pub merchant_wallet: AccountInfo<'info>,

    /// CHECK: Platform wallet receiving fees
    #[account(mut, address = platform.authority)]
    pub platform_wallet: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DisputeEscrow<'info> {
    #[account(
        mut,
        seeds = [b"escrow", escrow.payer.as_ref(), escrow.merchant.as_ref()],
        bump = escrow.bump
    )]
    pub escrow: Account<'info, EscrowPayment>,

    pub payer: Signer<'info>,
}

#[derive(Accounts)]
pub struct ResolveDispute<'info> {
    #[account(
        seeds = [b"platform"],
        bump = platform.bump,
        has_one = authority
    )]
    pub platform: Account<'info, Platform>,

    #[account(
        mut,
        seeds = [b"merchant", merchant.owner.as_ref()],
        bump = merchant.bump
    )]
    pub merchant: Account<'info, Merchant>,

    #[account(
        mut,
        seeds = [b"escrow", escrow.payer.as_ref(), merchant.key().as_ref()],
        bump = escrow.bump
    )]
    pub escrow: Account<'info, EscrowPayment>,

    pub authority: Signer<'info>,

    /// CHECK: Original payer for refund
    #[account(mut, address = escrow.payer)]
    pub payer: AccountInfo<'info>,

    /// CHECK: Merchant wallet — validated against merchant.owner
    #[account(mut, address = merchant.owner)]
    pub merchant_wallet: AccountInfo<'info>,
}

// ============================================================================
// SUBSCRIPTION INSTRUCTION CONTEXTS
// ============================================================================

#[derive(Accounts)]
pub struct CreateSubscription<'info> {
    #[account(
        seeds = [b"merchant", merchant.owner.as_ref()],
        bump = merchant.bump
    )]
    pub merchant: Account<'info, Merchant>,

    #[account(
        init,
        payer = subscriber,
        space = 8 + 32 + 32 + 8 + 8 + 2 + 2 + 8 + 8 + 1 + 1,
        seeds = [b"subscription", subscriber.key().as_ref(), merchant.key().as_ref()],
        bump
    )]
    pub subscription: Account<'info, Subscription>,

    #[account(mut)]
    pub subscriber: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ExecuteSubscriptionPayment<'info> {
    #[account(
        mut,
        seeds = [b"platform"],
        bump = platform.bump
    )]
    pub platform: Account<'info, Platform>,

    #[account(
        mut,
        seeds = [b"merchant", merchant.owner.as_ref()],
        bump = merchant.bump
    )]
    pub merchant: Account<'info, Merchant>,

    #[account(
        mut,
        seeds = [b"subscription", subscriber.key().as_ref(), merchant.key().as_ref()],
        bump = subscription.bump
    )]
    pub subscription: Account<'info, Subscription>,

    #[account(mut)]
    pub subscriber: Signer<'info>,

    /// CHECK: Merchant wallet receiving payment
    #[account(mut, address = merchant.owner)]
    pub merchant_wallet: AccountInfo<'info>,

    /// CHECK: Platform wallet receiving fees
    #[account(mut, address = platform.authority)]
    pub platform_wallet: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CancelSubscription<'info> {
    #[account(
        mut,
        seeds = [b"subscription", subscriber.key().as_ref(), subscription.merchant.as_ref()],
        bump = subscription.bump,
        constraint = subscription.subscriber == subscriber.key() @ IPayError::UnauthorizedCancel,
    )]
    pub subscription: Account<'info, Subscription>,

    pub subscriber: Signer<'info>,
}

// ============================================================================
// SPLIT PAYMENT CONTEXT
// ============================================================================

#[derive(Accounts)]
#[instruction(amount: u64, memo: String, split_bps: u16)]
pub struct ProcessSplitPayment<'info> {
    #[account(
        seeds = [b"platform"],
        bump = platform.bump
    )]
    pub platform: Account<'info, Platform>,

    #[account(
        seeds = [b"merchant", merchant.owner.as_ref()],
        bump = merchant.bump
    )]
    pub merchant: Account<'info, Merchant>,

    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: Merchant wallet — validated against merchant.owner
    #[account(mut, address = merchant.owner)]
    pub merchant_wallet: AccountInfo<'info>,

    /// CHECK: Secondary recipient wallet — caller-specified, not merchant-controlled
    #[account(mut)]
    pub secondary_wallet: AccountInfo<'info>,

    /// CHECK: Platform wallet
    #[account(mut, address = platform.authority)]
    pub platform_wallet: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

// ============================================================================
// MERCHANT VERIFICATION CONTEXT
// ============================================================================

#[derive(Accounts)]
pub struct VerifyMerchant<'info> {
    #[account(
        mut,
        seeds = [b"merchant", merchant.owner.as_ref()],
        bump = merchant.bump
    )]
    pub merchant: Account<'info, Merchant>,

    #[account(
        seeds = [b"platform"],
        bump = platform.bump,
        has_one = authority
    )]
    pub platform: Account<'info, Platform>,

    pub authority: Signer<'info>,
}

// ============================================================================
// LOYALTY STAKING CONTEXTS
// ============================================================================

#[derive(Accounts)]
pub struct StakeLoyalty<'info> {
    #[account(
        seeds = [b"platform"],
        bump = platform.bump
    )]
    pub platform: Account<'info, Platform>,

    #[account(
        address = platform.loyalty_mint
    )]
    pub loyalty_mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = loyalty_mint,
        associated_token::authority = user,
        associated_token::token_program = token_program,
    )]
    pub user_loyalty_account: InterfaceAccount<'info, TokenAccount>,

    /// Vault to hold staked iPAY tokens
    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = loyalty_mint,
        associated_token::authority = platform,
        associated_token::token_program = token_program,
    )]
    pub stake_vault: InterfaceAccount<'info, TokenAccount>,

    #[account(
        init,
        payer = user,
        space = 8 + 32 + 8 + 8 + 8 + 1 + 1,
        seeds = [b"stake", user.key().as_ref()],
        bump
    )]
    pub stake_record: Account<'info, StakeRecord>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UnstakeLoyalty<'info> {
    #[account(
        seeds = [b"platform"],
        bump = platform.bump
    )]
    pub platform: Account<'info, Platform>,

    #[account(
        address = platform.loyalty_mint
    )]
    pub loyalty_mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = loyalty_mint,
        associated_token::authority = user,
        associated_token::token_program = token_program,
    )]
    pub user_loyalty_account: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        associated_token::mint = loyalty_mint,
        associated_token::authority = platform,
        associated_token::token_program = token_program,
    )]
    pub stake_vault: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [b"stake", user.key().as_ref()],
        bump = stake_record.bump,
        constraint = stake_record.user == user.key()
    )]
    pub stake_record: Account<'info, StakeRecord>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

// ============================================================================
// PAUSE / UNPAUSE CONTEXTS
// ============================================================================

#[derive(Accounts)]
pub struct PausePlatform<'info> {
    #[account(
        mut,
        seeds = [b"platform"],
        bump = platform.bump,
        has_one = authority
    )]
    pub platform: Account<'info, Platform>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct UnpausePlatform<'info> {
    #[account(
        mut,
        seeds = [b"platform"],
        bump = platform.bump,
        has_one = authority
    )]
    pub platform: Account<'info, Platform>,

    pub authority: Signer<'info>,
}

// ============================================================================
// ERRORS
// ============================================================================

#[error_code]
pub enum IPayError {
    #[msg("Name must be 32 characters or less")]
    NameTooLong,
    #[msg("Description must be 128 characters or less")]
    DescriptionTooLong,
    #[msg("Category must be 32 characters or less")]
    CategoryTooLong,
    #[msg("Loyalty multiplier must be between 100 (1x) and 1000 (10x)")]
    InvalidMultiplier,
    #[msg("Amount must be greater than 0")]
    InvalidAmount,
    #[msg("Memo must be 64 characters or less")]
    MemoTooLong,
    #[msg("Merchant is not active")]
    MerchantInactive,
    #[msg("Refund amount exceeds original payment")]
    RefundExceedsPayment,
    #[msg("Only the merchant owner can process refunds")]
    UnauthorizedRefund,
    #[msg("Payment does not belong to this merchant")]
    PaymentMerchantMismatch,
    #[msg("Refund recipient does not match original payer")]
    InvalidRefundRecipient,
    #[msg("Loyalty token supply cap would be exceeded")]
    SupplyCapExceeded,
    #[msg("Arithmetic overflow")]
    ArithmeticOverflow,
    #[msg("Platform fee basis points must be <= 10000")]
    InvalidFeeBps,
    #[msg("Payment amount exceeds maximum allowed")]
    AmountTooLarge,
    #[msg("Platform is currently paused")]
    PlatformPaused,
    #[msg("Escrow is not in funded status")]
    EscrowNotFunded,
    #[msg("Escrow cannot be released yet")]
    EscrowNotReleasable,
    #[msg("Escrow is not in disputed status")]
    EscrowNotDisputed,
    #[msg("Only the payer can dispute an escrow")]
    UnauthorizedDispute,
    #[msg("Release time must be in the future")]
    InvalidReleaseTime,
    #[msg("Subscription interval must be at least 3600 seconds (1 hour)")]
    IntervalTooShort,
    #[msg("Invalid number of subscription cycles")]
    InvalidCycles,
    #[msg("Subscription is not active")]
    SubscriptionInactive,
    #[msg("Subscription has reached maximum cycles")]
    SubscriptionMaxCycles,
    #[msg("Subscription payment is not yet due")]
    SubscriptionNotDue,
    #[msg("Only the subscriber can cancel")]
    UnauthorizedCancel,
    #[msg("Tip amount cannot exceed payment amount")]
    TipExceedsAmount,
    #[msg("Split basis points must be between 1 and 9999")]
    InvalidSplitBps,
    #[msg("Invalid merchant verification tier (0-3)")]
    InvalidVerificationTier,
    #[msg("Stake lock duration must be at least 1 day")]
    LockTooShort,
    #[msg("Stake lock duration cannot exceed 1 year")]
    LockTooLong,
    #[msg("Stake is not active")]
    StakeNotActive,
    #[msg("Stake is still locked")]
    StakeLocked,
}
