use anchor_lang::prelude::*;
use crate::{state::*, errors::TipfinityError};

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

pub fn handle(ctx: Context<InitializeCreator>, username: String) -> Result<()> {
    require!(username.len() <= 32, TipfinityError::UsernameTooLong);

    let creator = &mut ctx.accounts.creator;
    creator.owner = ctx.accounts.authority.key();

    let mut buf = [0u8; 32];
    let bytes = username.as_bytes();
    let copy_len = bytes.len().min(32);
    buf[..copy_len].copy_from_slice(&bytes[..copy_len]);
    creator.username = buf;

    creator.tip_count = 0;
    creator.total_tips = 0;

    Ok(())
}
