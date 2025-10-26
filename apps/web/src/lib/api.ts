// API client for communicating with the backend
import { config } from '@/config/env';

const API_BASE_URL = config.API_BASE_URL;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface Creator {
  id: number;
  username: string;
  display_name: string;
  email: string;
  bio?: string;
  profile_image?: string;
  wallet_address?: string;
  created_at: string;
}

export interface CreateCreatorInput {
  username: string;
  display_name: string;
  email: string;
  bio?: string;
  profile_image?: string;
  wallet_address?: string;
}

export interface UpdateCreatorInput {
  display_name?: string;
  email?: string;
  bio?: string;
  profile_image?: string;
  wallet_address?: string;
}

export interface Tip {
  id: number;
  creator_id: number;
  tipper_wallet: string;
  tip_amount: number;
  message?: string;
  transaction_signature: string;
  created_at: string;
}

export interface CreateTipInput {
  creator_id: number;
  tipper_wallet: string;
  tip_amount: number;
  message?: string;
  transaction_signature: string;
}

export interface WalletLinkInput {
  public_key: string;
  message: string;
  signature: string;
  creator_id: number;
}

export interface WalletLinkResponse {
  verified: boolean;
  wallet_address: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; db: number }>> {
    return this.request('/health');
  }

  // Creator endpoints
  async createCreator(input: CreateCreatorInput): Promise<ApiResponse<{ id: number }>> {
    return this.request('/creators', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async getCreators(): Promise<ApiResponse<Creator[]>> {
    return this.request('/creators');
  }

  async getCreator(id: number): Promise<ApiResponse<Creator>> {
    return this.request(`/creator/${id}`);
  }

  async updateCreator(id: number, input: UpdateCreatorInput): Promise<ApiResponse<{ updated: boolean }>> {
    return this.request(`/creator/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  }

  async deleteCreator(id: number): Promise<ApiResponse<{ deleted: boolean }>> {
    return this.request(`/creator/${id}`, {
      method: 'DELETE',
    });
  }

  async checkUsernameAvailability(username: string): Promise<ApiResponse<{ available: boolean }>> {
    return this.request(`/username/${username}/available`);
  }

  // Wallet endpoints
  async linkWallet(input: WalletLinkInput): Promise<ApiResponse<WalletLinkResponse>> {
    return this.request('/wallet/link', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  // Tip endpoints
  async createTip(input: CreateTipInput): Promise<ApiResponse<{ id: number }>> {
    return this.request('/tips', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async getTipsForCreator(creatorId: number): Promise<ApiResponse<Tip[]>> {
    return this.request(`/tips/creator/${creatorId}`);
  }

  async getRecentTips(): Promise<ApiResponse<Tip[]>> {
    return this.request('/tips/recent');
  }

  // Webhook endpoints
  async handleTipWebhook(payload: any): Promise<ApiResponse<any>> {
    return this.request('/webhooks/tip', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
