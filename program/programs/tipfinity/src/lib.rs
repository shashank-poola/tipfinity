use anchor_lang::prelude::*;

pub mod state;
pub mod instructions;
pub mod errors;

use instructions::*;

declare_id!("G9SJrR5U29xGBG1dGnu83poJ3bMcsT5r37kZXz4tqaPF");

#[program]
pub mod tipfinity {
    use super::*;

    /// Initialize on-chain creator metadata (once per creator)
    pub fn initialize_creator(ctx: Context<InitializeCreator>, username: String) -> Result<()> {
        initialize_creator::handle(ctx, username)
    }

    /// Send a tip from fan to creator (wallet-to-wallet transfer)
    pub fn send_tip(ctx: Context<SendTip>, amount: u64, tx_signature: [u8; 64]) -> Result<()> {
        send_tip::handle(ctx, amount, tx_signature)
    }
}
