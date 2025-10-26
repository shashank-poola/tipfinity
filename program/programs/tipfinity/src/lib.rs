use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;
use anchor_lang::solana_program::program::invoke;

declare_id!("G9SJrR5U29xGBG1dGnu83poJ3bMcsT5r37kZXz4tqaPF");

#[program]
pub mod tipfinity {
    use super::*;

    /// Initialize a creator account (on-chain metadata). Caller = creator (signer).
    pub fn initialize_creator(
        ctx: Context<InitializeCreator>,
        username: String,
    ) -> Result<()> {
        let creator = &mut ctx.accounts.creator;
        require!(username.len() <= 32, TipfinityError::UsernameTooLong);

        creator.owner = ctx.accounts.authority.key();
        // store username as fixed 32 bytes (utf-8 truncated)
        let mut buf = [0u8; 32];
        let bytes = username.as_bytes();
        let copy_len = bytes.len().min(32);
        buf[..copy_len].copy_from_slice(&bytes[..copy_len]);
        creator.username = buf;
        creator.tip_count = 0;
        creator.total_tips = 0;

        Ok(())
    }

    /// Tip: Fan sends SOL -> creator_wallet (transfer), and program writes Tip metadata and emits event.
    /// Client MUST include a transfer instruction (or we call invoke to transfer inside program as done here).
    pub fn tip(
        ctx: Context<Tip>,
        amount: u64,
        message: Option<String>,
    ) -> Result<()> {
        require!(amount > 0, TipfinityError::InvalidAmount);
        if let Some(ref m) = message {
            require!(m.len() <= 256, TipfinityError::MessageTooLong);
        }

        // Transfer lamports from tipper to creator_wallet (direct)
        let tipper = &ctx.accounts.tipper;
        let creator_wallet = &ctx.accounts.creator_wallet;

        // Perform system transfer (this will deduct lamports from tipper and add to creator)
        invoke(
            &system_instruction::transfer(&tipper.key(), &creator_wallet.key(), amount),
            &[
                tipper.to_account_info(),
                creator_wallet.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        // Initialize tip metadata account (PDA)
        let tip = &mut ctx.accounts.tip;
        tip.creator = ctx.accounts.creator.key();
        tip.tipper = tipper.key();
        tip.amount = amount;
        tip.timestamp = Clock::get()?.unix_timestamp;
        tip.bump = *ctx.bumps.get("tip").unwrap();

        if let Some(m) = message {
            // store message as bytes into fixed-size field (up to 256 bytes) - here we store as variable Option<String>
            tip.message = Some(m);
        } else {
            tip.message = None;
        }

        // Update creator counters (stored on-chain)
        let creator = &mut ctx.accounts.creator;
        creator.tip_count = creator.tip_count.checked_add(1).ok_or(TipfinityError::Overflow)?;
        creator.total_tips = creator.total_tips.checked_add(amount).ok_or(TipfinityError::Overflow)?;

        // Emit event for backend indexing
        emit!(TipEvent {
            creator: creator_wallet.key(),
            tipper: tipper.key(),
            amount,
            message: tip.message.clone(),
        });

        Ok(())
    }
}

/// Accounts / Contexts

#[derive(Accounts)]
#[instruction(username: String)]
pub struct InitializeCreator<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = 8 + Creator::MAX_SIZE,
        seeds = [b"creator", authority.key().as_ref()],
        bump
    )]
    pub creator: Account<'info, Creator>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Tip<'info> {
    #[account(mut)]
    pub tipper: Signer<'info>,

    /// On-chain creator metadata account (PDA)
    #[account(mut, seeds = [b"creator", creator.owner.as_ref()], bump)]
    pub creator: Account<'info, Creator>,

    /// The actual creator wallet account (must equal creator.owner)
    /// We use a constraint to ensure it matches the declared owner.
    #[account(mut, constraint = creator_wallet.key() == creator.owner)]
    pub creator_wallet: SystemAccount<'info>,

    /// Tip metadata PDA saved for audit / indexing
    #[account(
        init,
        payer = tipper,
        space = 8 + TipMetadata::MAX_SIZE,
        seeds = [b"tip", creator.key().as_ref(), &creator.tip_count.to_le_bytes()],
        bump
    )]
    pub tip: Account<'info, TipMetadata>,

    pub system_program: Program<'info, System>,
}

/// Creator account stored on-chain
#[account]
pub struct Creator {
    pub owner: Pubkey,          // 32
    pub username: [u8; 32],     // 32
    pub tip_count: u64,         // 8
    pub total_tips: u64,        // 8 (lamports)
}

impl Creator {
    // 32 + 32 + 8 + 8 = 80
    pub const MAX_SIZE: usize = 32 + 32 + 8 + 8;
}

/// Tip metadata account
#[account]
pub struct TipMetadata {
    pub creator: Pubkey,              // 32
    pub tipper: Pubkey,               // 32
    pub amount: u64,                  // 8
    pub timestamp: i64,               // 8
    pub message: Option<String>,      // variable (Anchor handles dynamic)
    pub bump: u8,                     // 1
}

impl TipMetadata {
    // approximate sizing; Anchor serializes variable-size fields, so give enough room:
    pub const MAX_SIZE: usize = 32 + 32 + 8 + 8 + 4 + 256 + 1;
}

/// Event emitted for easier off-chain indexing
#[event]
pub struct TipEvent {
    pub creator: Pubkey,
    pub tipper: Pubkey,
    pub amount: u64,
    pub message: Option<String>,
}

/// Program errors
#[error_code]
pub enum TipfinityError {
    #[msg("Username too long (max 32 bytes)")]
    UsernameTooLong,
    #[msg("Invalid tip amount")]
    InvalidAmount,
    #[msg("Message too long (max 256 bytes)")]
    MessageTooLong,
    #[msg("Overflow error")]
    Overflow,
}
