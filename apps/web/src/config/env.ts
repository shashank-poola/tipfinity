// Environment configuration
export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  SOLANA_NETWORK: import.meta.env.VITE_SOLANA_NETWORK || 'devnet',
  APP_NAME: 'Tipfinity',
  APP_VERSION: '1.0.0',
} as const;
