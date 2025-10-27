use axum::{
    extract::{Extension, Json},
    http::StatusCode,
};
use serde::{Deserialize, Serialize};
use serde_json::json;
use sqlx::PgPool;

use crate::utils::response::ApiResponse;

#[derive(Deserialize)]
pub struct LinkWalletInput {
    pub wallet_address: String,
    pub email: Option<String>,  // email only required during onboarding
}

#[derive(Serialize)]
pub struct CreatorResponse {
    pub id: i32,
    pub username: String,
    pub wallet_address: String,
    pub email: Option<String>,
    pub bio: Option<String>,
    pub profile_image: Option<String>,
}

/// POST /wallet/link
/// - If wallet doesn't exist → create new creator (signup)
/// - If wallet exists → login existing creator
pub async fn link_wallet(
    Extension(pool): Extension<PgPool>,
    Json(payload): Json<LinkWalletInput>,
) -> (StatusCode, Json<ApiResponse<serde_json::Value>>) {
    let wallet_address = payload.wallet_address.trim();

    // Check if wallet already exists
    let existing_creator = sqlx::query!(
        "SELECT id, username, email, bio, profile_image, wallet_address
         FROM creators WHERE wallet_address = $1",
        wallet_address
    )
    .fetch_optional(&pool)
    .await;

    match existing_creator {
        Ok(Some(creator)) => {
            // Existing wallet → login success
            (
                StatusCode::OK,
                Json(ApiResponse::success(json!({
                    "message": "Wallet login successful",
                    "creator_id": creator.id,
                    "username": creator.username,
                    "wallet_address": creator.wallet_address,
                    "email": creator.email,
                    "bio": creator.bio,
                    "profile_image": creator.profile_image,
                }))),
            )
        }
        Ok(None) => {
            //  New wallet → require email for onboarding
            if payload.email.is_none() {
                return (
                    StatusCode::BAD_REQUEST,
                    Json(ApiResponse::error(
                        "Email required for new wallet onboarding".to_string(),
                    )),
                );
            }

            let email = payload.email.as_ref().unwrap();

            // Generate a simple username: user + 4 random digits
            let random_id = rand::random::<u16>();
            let username = format!("user{}", random_id);

            // Create new creator
            let result = sqlx::query!(
                "INSERT INTO creators (username, email, wallet_address)
                 VALUES ($1, $2, $3)
                 RETURNING id",
                username,
                email,
                wallet_address
            )
            .fetch_one(&pool)
            .await;

            match result {
                Ok(record) => (
                    StatusCode::CREATED,
                    Json(ApiResponse::success(json!({
                        "message": "New creator registered successfully",
                        "creator_id": record.id,
                        "username": username,
                        "wallet_address": wallet_address,
                    }))),
                ),
                Err(e) => (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(ApiResponse::error(e.to_string())),
                ),
            }
        }
        Err(e) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(ApiResponse::error(e.to_string())),
        ),
    }
}
