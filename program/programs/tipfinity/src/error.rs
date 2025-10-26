use anchor_lang::prelude::*;

#[error_code]
pub enum TipfinityError {
    #[msg("Username too long (max 32 bytes)")]
    UsernameTooLong,
    #[msg("Invalid tip amount")]
    InvalidAmount,
    #[msg("Overflow occurred in counter")]
    Overflow,
}
