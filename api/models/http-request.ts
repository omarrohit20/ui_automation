/**
 * HTTP Request/Response Models
 */

export interface IRequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';
  url: string;
  headers?: Record<string, string>;
  body?: any;
  queryParams?: Record<string, any>;
  timeout?: number;
}

export interface IHttpResponse {
  status: number;
  statusText?: string;
  headers?: Record<string, string>;
  body: any;
  ok: boolean;
}

export class RequestBuilder {
  private config: Partial<IRequestConfig> = {};

  withMethod(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD'): this {
    this.config.method = method;
    return this;
  }

  withUrl(url: string): this {
    this.config.url = url;
    return this;
  }

  withHeaders(headers: Record<string, string>): this {
    this.config.headers = { ...this.config.headers, ...headers };
    return this;
  }

  withBody(body: any): this {
    this.config.body = body;
    return this;
  }

  withQueryParams(params: Record<string, any>): this {
    this.config.queryParams = { ...this.config.queryParams, ...params };
    return this;
  }

  withTimeout(timeout: number): this {
    this.config.timeout = timeout;
    return this;
  }

  addHeader(key: string, value: string): this {
    if (!this.config.headers) {
      this.config.headers = {};
    }
    this.config.headers[key] = value;
    return this;
  }

  build(): IRequestConfig {
    if (!this.config.method || !this.config.url) {
      throw new Error('Method and URL are required for request');
    }
    return this.config as IRequestConfig;
  }
}
