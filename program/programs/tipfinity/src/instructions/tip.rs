use anchor_lang::prelude::*;
use anchor_lang::solana_program::{system_instruction, program::invoke};
use crate::{state::*, errors::TipfinityError};

#[derive(Accounts)]
pub struct SendTip<'info> {
    #[account(mut)]
    pub tipper: Signer<'info>,

    #[account(
        mut,
        seeds = [b"creator", creator.owner.as_ref()],
        bump
    )]
    pub creator: Account<'info, Creator>,

    #[account(mut, constraint = creator_wallet.key() == creator.owner)]
    pub creator_wallet: SystemAccount<'info>,

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

pub fn handle(ctx: Context<SendTip>, amount: u64, tx_signature: [u8; 64]) -> Result<()> {
    require!(amount > 0, TipfinityError::InvalidAmount);

    let tipper = &ctx.accounts.tipper;
    let creator_wallet = &ctx.accounts.creator_wallet;

    // Transfer SOL (lamports)
    invoke(
        &system_instruction::transfer(&tipper.key(), &creator_wallet.key(), amount),
        &[
            tipper.to_account_info(),
            creator_wallet.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
    )?;

    // Save metadata
    let tip = &mut ctx.accounts.tip;
    tip.creator = ctx.accounts.creator.key();
    tip.tipper = tipper.key();
    tip.amount = amount;
    tip.timestamp = Clock::get()?.unix_timestamp;
    tip.tx_signature = tx_signature;
    tip.bump = *ctx.bumps.get("tip").unwrap();

    // Update creator stats
    let creator = &mut ctx.accounts.creator;
    creator.tip_count = creator.tip_count.checked_add(1).ok_or(TipfinityError::Overflow)?;
    creator.total_tips = creator.total_tips.checked_add(amount).ok_or(TipfinityError::Overflow)?;

    // Emit event for off-chain indexing
    emit!(TipEvent {
        creator: creator_wallet.key(),
        tipper: tipper.key(),
        amount,
        tx_signature,
    });

    Ok(())
}
