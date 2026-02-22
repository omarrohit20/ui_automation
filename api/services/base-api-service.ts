/**
 * Base API Service - Abstract service for API endpoints
 * Implements Repository Pattern for clean separation of concerns
 */

import { HttpClient } from '../http-client';
import { ApiResponse } from '../models/api-response';
import logger from '../utils/logger';

export abstract class BaseApiService {
  protected httpClient: HttpClient;
  protected basePath: string; // Override in subclass

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
    this.basePath = '';
  }

  protected getEndpoint(path: string): string {
    return `${this.basePath}${path}`;
  }

  protected async handleResponse<T>(
    promise: Promise<ApiResponse<T>>,
    operationName: string
  ): Promise<ApiResponse<T>> {
    try {
      const response = await promise;
      logger.info(`${operationName} completed`, { status: response.getStatus() });
      return response;
    } catch (error) {
      logger.error(`${operationName} failed`, error);
      throw error;
    }
  }
}
