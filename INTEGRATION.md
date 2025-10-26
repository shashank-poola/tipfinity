# Tipfinity Frontend-Backend Integration

This document describes the integration between the Tipfinity frontend (React) and backend (Rust/Axum).

## Architecture Overview

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Rust + Axum + PostgreSQL + Solana integration
- **Communication**: REST API with JSON over HTTP

## API Endpoints

### Health Check
- `GET /health` - Check server and database status

### Creators
- `POST /creators` - Create a new creator
- `GET /creators` - List all creators
- `GET /creator/{id}` - Get creator by ID
- `PUT /creator/{id}` - Update creator
- `DELETE /creator/{id}` - Delete creator
- `GET /username/{username}/available` - Check username availability

### Wallet
- `POST /wallet/link` - Link wallet with signature verification

### Tips
- `POST /tips` - Create a new tip
- `GET /tips/creator/{creator_id}` - Get tips for a creator
- `GET /tips/recent` - Get recent tips

### Webhooks
- `POST /webhooks/tip` - Handle tip webhooks

## Frontend Integration

### API Client
- Located in `src/lib/api.ts`
- Provides typed interfaces for all API calls
- Handles error responses and success states

### React Query Hooks
- Located in `src/hooks/use-api.ts`
- Provides React Query hooks for data fetching and mutations
- Includes caching and optimistic updates

### User Context
- Located in `src/contexts/UserContext.tsx`
- Manages current user state across the application
- Persists user data in localStorage

## Key Features Implemented

1. **Creator Registration Flow**
   - Email verification (mock)
   - Username availability checking
   - Profile customization
   - Wallet connection

2. **Dashboard Integration**
   - Real-time tip data loading
   - Creator profile display
   - Tip history with proper formatting

3. **Tip Creation**
   - Wallet connection validation
   - Amount input with presets
   - Message support
   - Transaction signature handling (mock)

4. **Wallet Integration**
   - Solana wallet adapter support
   - Signature verification for wallet linking
   - Multiple wallet support (Phantom, Solflare, Torus)

## Environment Configuration

The frontend uses environment variables for configuration:
- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:3000)
- `VITE_SOLANA_NETWORK` - Solana network (default: devnet)

## Running the Integration

1. **Start the Backend**:
   ```bash
   cd tipfinity/apps/server
   cargo run
   ```

2. **Start the Frontend**:
   ```bash
   cd tipfinity/apps/web
   npm run dev
   ```

3. **Access the Application**:
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3000

## Database Setup

The backend automatically runs migrations on startup. Make sure PostgreSQL is running and the `DATABASE_URL` environment variable is set.

## Notes

- The tip transaction signatures are currently mocked for development
- Real Solana transaction integration would require additional blockchain interaction
- Email verification is simulated (no actual emails sent)
- All API responses follow a consistent `ApiResponse<T>` format
