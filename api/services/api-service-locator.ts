/**
 * API Service Locator - Dependency Injection
 * Centralized service initialization and management
 */

import { HttpClient } from '../http-client';
import { NotesApiService } from './notes-api-service';
import { UsersApiService } from './users-api-service';

export class ApiServiceLocator {
  private static httpClient: HttpClient;
  private static notesService: NotesApiService;
  private static usersService: UsersApiService;

  /**
   * Initialize all services (call once before tests)
   */
  static async initialize(): Promise<void> {
    this.httpClient = new HttpClient();
    await this.httpClient.initialize();

    this.notesService = new NotesApiService(this.httpClient);
    this.usersService = new UsersApiService(this.httpClient);
  }

  /**
   * Clean up resources (call after tests complete)
   */
  static async cleanup(): Promise<void> {
    if (this.httpClient) {
      await this.httpClient.dispose();
    }
  }

  /**
   * Get HTTP client instance
   */
  static getHttpClient(): HttpClient {
    if (!this.httpClient) {
      throw new Error('ApiServiceLocator not initialized. Call initialize() first.');
    }
    return this.httpClient;
  }

  /**
   * Get Notes API Service
   */
  static getNotesService(): NotesApiService {
    if (!this.notesService) {
      throw new Error('ApiServiceLocator not initialized. Call initialize() first.');
    }
    return this.notesService;
  }

  /**
   * Get Users API Service
   */
  static getUsersService(): UsersApiService {
    if (!this.usersService) {
      throw new Error('ApiServiceLocator not initialized. Call initialize() first.');
    }
    return this.usersService;
  }
}

// Export convenience functions
export function getNotesService(): NotesApiService {
  return ApiServiceLocator.getNotesService();
}

export function getUsersService(): UsersApiService {
  return ApiServiceLocator.getUsersService();
}
