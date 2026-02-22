/**
 * HTTP Client - Wrapper around Playwright's APIRequestContext
 * Implements retry logic and standardized request handling
 */

import { request, APIRequestContext } from '@playwright/test';
import { IRequestConfig, IHttpResponse, RequestBuilder } from '../models/http-request';
import { ApiResponse, parseApiResponse } from '../models/api-response';
import EnvironmentConfig from '../config/environment';
import logger from './logger';
import { RetryStrategy, IRetryConfig } from './retry-strategy';

export class HttpClient {
  private context: APIRequestContext | null = null;
  private retryStrategy: RetryStrategy;
  private baseUrl: string;

  constructor(retryConfig?: IRetryConfig) {
    this.baseUrl = EnvironmentConfig.getBaseUrl();
    this.retryStrategy = new RetryStrategy(
      retryConfig || {
        maxAttempts: 3,
        delayMs: 1000,
        backoffMultiplier: 2,
      }
    );
  }

  async initialize(): Promise<void> {
    if (!this.context) {
      this.context = await request.newContext({
        baseURL: this.baseUrl,
      });
    }
  }

  async dispose(): Promise<void> {
    if (this.context) {
      await this.context.dispose();
      this.context = null;
    }
  }

  private async ensureContext(): Promise<APIRequestContext> {
    if (!this.context) {
      await this.initialize();
    }
    return this.context!;
  }

  private buildUrl(endpoint: string, queryParams?: Record<string, any>): string {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    if (!queryParams || Object.keys(queryParams).length === 0) {
      return url;
    }

    const urlObj = new URL(url);
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        urlObj.searchParams.append(key, String(value));
      }
    });

    return urlObj.toString();
  }

  private buildHeaders(headers?: Record<string, string>): Record<string, string> {
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    return { ...defaultHeaders, ...headers };
  }

  async get<T = any>(
    endpoint: string,
    headers?: Record<string, string>,
    queryParams?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const req = new RequestBuilder()
      .withMethod('GET')
      .withUrl(this.buildUrl(endpoint, queryParams))
      .withHeaders(this.buildHeaders(headers));

    return this.send<T>(req.build());
  }

  async post<T = any>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>,
    queryParams?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const req = new RequestBuilder()
      .withMethod('POST')
      .withUrl(this.buildUrl(endpoint, queryParams))
      .withHeaders(this.buildHeaders(headers))
      .withBody(body);

    return this.send<T>(req.build());
  }

  async put<T = any>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>,
    queryParams?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const req = new RequestBuilder()
      .withMethod('PUT')
      .withUrl(this.buildUrl(endpoint, queryParams))
      .withHeaders(this.buildHeaders(headers))
      .withBody(body);

    return this.send<T>(req.build());
  }

  async patch<T = any>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>,
    queryParams?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const req = new RequestBuilder()
      .withMethod('PATCH')
      .withUrl(this.buildUrl(endpoint, queryParams))
      .withHeaders(this.buildHeaders(headers))
      .withBody(body);

    return this.send<T>(req.build());
  }

  async delete<T = any>(
    endpoint: string,
    headers?: Record<string, string>,
    queryParams?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const req = new RequestBuilder()
      .withMethod('DELETE')
      .withUrl(this.buildUrl(endpoint, queryParams))
      .withHeaders(this.buildHeaders(headers));

    return this.send<T>(req.build());
  }

  async deleteWithBody<T = any>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>,
    queryParams?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const req = new RequestBuilder()
      .withMethod('DELETE')
      .withUrl(this.buildUrl(endpoint, queryParams))
      .withHeaders(this.buildHeaders(headers))
      .withBody(body);

    return this.send<T>(req.build());
  }

  private async send<T = any>(config: IRequestConfig): Promise<ApiResponse<T>> {
    const context = await this.ensureContext();

    logger.debug('Sending HTTP request', {
      method: config.method,
      url: config.url,
      headers: config.headers,
    });

    return this.retryStrategy.execute(async () => {
      const response = await context.fetch(config.url, {
        method: config.method,
        headers: config.headers,
        data: config.body,
        timeout: config.timeout,
      });

      logger.debug('Received API response', {
        status: response.status(),
        statusText: response.statusText(),
      });

      const apiResponse = await parseApiResponse<T>(response);

      if (!apiResponse.isSuccessful()) {
        logger.warn('API returned non-success response', {
          status: apiResponse.getStatus(),
          message: apiResponse.getMessage(),
        });
      }

      return apiResponse;
    });
  }
}

export function createHttpClient(retryConfig?: IRetryConfig): HttpClient {
  return new HttpClient(retryConfig);
}
