use reqwest::Client;
use serde_json::Value;

pub async fn get_sol_price_usd() -> Result<f64, String> {
    let url = "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd";
    let client = Client::new();

    let res = client.get(url)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let json: Value = res.json().await.map_err(|e| e.to_string())?;
    Ok(json["solana"]["usd"].as_f64().unwrap_or(0.0))
}
