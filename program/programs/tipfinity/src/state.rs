use anchor_lang::prelude::*;

/// On-chain record for a creator
#[account]
pub struct Creator {
    pub owner: Pubkey,       // wallet address
    pub username: [u8; 32],  // username (truncated UTF-8)
    pub tip_count: u64,      // number of tips received
    pub total_tips: u64,     // total amount received (in lamports)
}
impl Creator {
    pub const MAX_SIZE: usize = 32 + 32 + 8 + 8;
}

/// On-chain record for a single tip (metadata only)
#[account]
pub struct TipMetadata {
    pub creator: Pubkey,      // Creator account (PDA)
    pub tipper: Pubkey,       // Fan wallet
    pub amount: u64,          // Amount tipped in lamports
    pub timestamp: i64,       // Tip timestamp
    pub tx_signature: [u8; 64], // Transaction signature hash
    pub bump: u8,
}
impl TipMetadata {
    pub const MAX_SIZE: usize = 32 + 32 + 8 + 8 + 64 + 1; // 145 bytes
}

/// Event emitted when a tip occurs
#[event]
pub struct TipEvent {
    pub creator: Pubkey,
    pub tipper: Pubkey,
    pub amount: u64,
    pub tx_signature: [u8; 64],
}
