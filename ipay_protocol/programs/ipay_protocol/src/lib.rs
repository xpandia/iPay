use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{self, Mint, TokenAccount, TokenInterface, MintTo},
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
    ) -> Result<()> {
        let platform = &mut ctx.accounts.platform;
        platform.authority = ctx.accounts.authority.key();
        platform.loyalty_mint = ctx.accounts.loyalty_mint.key();
        platform.loyalty_points_per_sol = loyalty_points_per_sol;
        platform.platform_fee_bps = platform_fee_bps;
        platform.total_merchants = 0;
        platform.total_payments = 0;
        platform.total_volume = 0;
        platform.payment_counter = 0;
        platform.bump = ctx.bumps.platform;

        msg!("iPay Platform initialized! Loyalty: {} pts/SOL, Fee: {} bps",
            loyalty_points_per_sol, platform_fee_bps);
        Ok(())
    }

    // ========================================================================
    // MERCHANT MANAGEMENT
    // ========================================================================

    pub fn register_merchant(
        ctx: Context<RegisterMerchant>,
        name: String,
        description: String,
        loyalty_multiplier: u16,
    ) -> Result<()> {
        require!(name.len() <= 32, IPayError::NameTooLong);
        require!(description.len() <= 128, IPayError::DescriptionTooLong);
        require!(loyalty_multiplier >= 100 && loyalty_multiplier <= 1000, IPayError::InvalidMultiplier);

        let merchant = &mut ctx.accounts.merchant;
        merchant.owner = ctx.accounts.owner.key();
        merchant.name = name.clone();
        merchant.description = description;
        merchant.loyalty_multiplier = loyalty_multiplier;
        merchant.total_payments = 0;
        merchant.total_volume = 0;
        merchant.total_loyalty_distributed = 0;
        merchant.is_active = true;
        merchant.created_at = Clock::get()?.unix_timestamp;
        merchant.bump = ctx.bumps.merchant;

        let platform = &mut ctx.accounts.platform;
        platform.total_merchants += 1;

        msg!("Merchant '{}' registered! Loyalty: {}x", name, loyalty_multiplier as f64 / 100.0);
        Ok(())
    }

    pub fn update_merchant(
        ctx: Context<UpdateMerchant>,
        name: Option<String>,
        description: Option<String>,
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
        require!(memo.len() <= 64, IPayError::MemoTooLong);

        let merchant = &ctx.accounts.merchant;
        require!(merchant.is_active, IPayError::MerchantInactive);

        let platform = &ctx.accounts.platform;

        // Step 1: Transfer SOL to merchant
        let platform_fee = amount
            .checked_mul(platform.platform_fee_bps as u64)
            .unwrap()
            .checked_div(10_000)
            .unwrap();
        let merchant_amount = amount.checked_sub(platform_fee).unwrap();

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
            .unwrap()
            .checked_div(1_000_000_000)
            .unwrap();

        let loyalty_amount = base_loyalty
            .checked_mul(merchant.loyalty_multiplier as u64)
            .unwrap()
            .checked_div(100)
            .unwrap();

        if loyalty_amount > 0 {
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

        // Step 3: Record payment
        let payment = &mut ctx.accounts.payment_record;
        payment.payer = ctx.accounts.payer.key();
        payment.merchant = ctx.accounts.merchant.key();
        payment.amount = amount;
        payment.platform_fee = platform_fee;
        payment.loyalty_earned = loyalty_amount;
        payment.memo = memo.clone();
        payment.timestamp = Clock::get()?.unix_timestamp;
        payment.payment_index = platform.payment_counter;
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

        msg!("Payment: {} lamports | Loyalty: {} iPAY | {}", amount, loyalty_amount, memo);
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

        msg!("Redeemed {} iPAY at '{}'", loyalty_amount, ctx.accounts.merchant.name);
        Ok(())
    }
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
    pub bump: u8,
}

#[account]
pub struct Merchant {
    pub owner: Pubkey,
    pub name: String,
    pub description: String,
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

// ============================================================================
// INSTRUCTION CONTEXTS
// ============================================================================

#[derive(Accounts)]
pub struct InitializePlatform<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 32 + 8 + 2 + 8 + 8 + 8 + 8 + 1,
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
        space = 8 + 32 + (4 + 32) + (4 + 128) + 2 + 8 + 8 + 8 + 1 + 8 + 1,
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
        seeds = [b"merchant", merchant_wallet.key().as_ref()],
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

    /// CHECK: Merchant wallet receiving payment
    #[account(mut)]
    pub merchant_wallet: AccountInfo<'info>,

    /// CHECK: Platform wallet receiving fees
    #[account(mut)]
    pub platform_wallet: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
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
// ERRORS
// ============================================================================

#[error_code]
pub enum IPayError {
    #[msg("Name must be 32 characters or less")]
    NameTooLong,
    #[msg("Description must be 128 characters or less")]
    DescriptionTooLong,
    #[msg("Loyalty multiplier must be between 100 (1x) and 1000 (10x)")]
    InvalidMultiplier,
    #[msg("Amount must be greater than 0")]
    InvalidAmount,
    #[msg("Memo must be 64 characters or less")]
    MemoTooLong,
    #[msg("Merchant is not active")]
    MerchantInactive,
}
