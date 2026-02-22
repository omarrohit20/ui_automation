/**
 * Users API Service
 * Handles all Users API endpoints from Expand Testing API
 */

import { BaseApiService } from './base-api-service';
import { HttpClient } from '../http-client';
import { ApiResponse } from '../models/api-response';

export interface IUser {
  id?: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  company?: string;
}

export interface IUserResponse extends IUser {
  id: string;
}

export interface ILoginResponse extends IUserResponse {
  token: string;
}

export class UsersApiService extends BaseApiService {
  protected basePath = '/notes/api';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Register a new user
   */
  async register(
    name: string,
    email: string,
    password: string
  ): Promise<ApiResponse<IUserResponse>> {
    const body = { name, email, password };

    return this.handleResponse(
      this.httpClient.post<IUserResponse>(
        this.getEndpoint('/users/register'),
        body
      ),
      'User Registration'
    );
  }

  /**
   * Login user and get authentication token
   */
  async login(
    email: string,
    password: string
  ): Promise<ApiResponse<ILoginResponse>> {
    const body = { email, password };

    return this.handleResponse(
      this.httpClient.post<ILoginResponse>(
        this.getEndpoint('/users/login'),
        body
      ),
      'User Login'
    );
  }

  /**
   * Get user profile information
   */
  async getProfile(token: string): Promise<ApiResponse<IUserResponse>> {
    const headers = this.getAuthHeaders(token);

    return this.handleResponse(
      this.httpClient.get<IUserResponse>(
        this.getEndpoint('/users/profile'),
        headers
      ),
      'Get User Profile'
    );
  }

  /**
   * Update user profile
   */
  async updateProfile(
    user: Partial<IUser>,
    token: string
  ): Promise<ApiResponse<IUserResponse>> {
    const headers = this.getAuthHeaders(token);
    const body = {
      name: user.name,
      phone: user.phone || '',
      company: user.company || '',
    };

    return this.handleResponse(
      this.httpClient.patch<IUserResponse>(
        this.getEndpoint('/users/profile'),
        body,
        headers
      ),
      'Update User Profile'
    );
  }

  /**
   * Request password reset (send email)
   */
  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    const body = { email };

    return this.handleResponse(
      this.httpClient.post<void>(
        this.getEndpoint('/users/forgot-password'),
        body
      ),
      'Forgot Password'
    );
  }

  /**
   * Verify password reset token
   */
  async verifyResetToken(token: string): Promise<ApiResponse<void>> {
    const body = { token };

    return this.handleResponse(
      this.httpClient.post<void>(
        this.getEndpoint('/users/verify-reset-password-token'),
        body
      ),
      'Verify Reset Token'
    );
  }

  /**
   * Reset password with token
   */
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<ApiResponse<void>> {
    const body = { token, newPassword };

    return this.handleResponse(
      this.httpClient.post<void>(
        this.getEndpoint('/users/reset-password'),
        body
      ),
      'Reset Password'
    );
  }

  /**
   * Change password (requires current password)
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
    token: string
  ): Promise<ApiResponse<void>> {
    const headers = this.getAuthHeaders(token);
    const body = { currentPassword, newPassword };

    return this.handleResponse(
      this.httpClient.post<void>(
        this.getEndpoint('/users/change-password'),
        body,
        headers
      ),
      'Change Password'
    );
  }

  /**
   * Logout user
   */
  async logout(token: string): Promise<ApiResponse<void>> {
    const headers = this.getAuthHeaders(token);

    return this.handleResponse(
      this.httpClient.delete<void>(
        this.getEndpoint('/users/logout'),
        headers
      ),
      'User Logout'
    );
  }

  /**
   * Delete user account
   */
  async deleteAccount(token: string): Promise<ApiResponse<void>> {
    const headers = this.getAuthHeaders(token);

    return this.handleResponse(
      this.httpClient.delete<void>(
        this.getEndpoint('/users/delete-account'),
        headers
      ),
      'Delete Account'
    );
  }

  /**
   * Health check endpoint (no auth required)
   */
  async healthCheck(): Promise<ApiResponse<void>> {
    return this.handleResponse(
      this.httpClient.get<void>(this.getEndpoint('/health-check')),
      'Health Check'
    );
  }

  /**
   * Helper: Build auth headers with token
   */
  private getAuthHeaders(token: string): Record<string, string> {
    return {
      'x-auth-token': token,
    };
  }
}
