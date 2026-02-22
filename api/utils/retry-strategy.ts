/**
 * Retry Strategy Pattern
 * Handles retryable failures with configurable backoff
 */

export interface IRetryConfig {
  maxAttempts: number;
  delayMs: number;
  backoffMultiplier?: number;
  retryableStatusCodes?: number[];
}

export class RetryStrategy {
  private readonly config: Required<IRetryConfig>;

  constructor(config: IRetryConfig) {
    this.config = {
      backoffMultiplier: 1.5,
      retryableStatusCodes: [408, 429, 500, 502, 503, 504],
      ...config,
    };
  }

  async execute<T>(
    operation: () => Promise<T>,
    isRetryable?: (error: any) => boolean
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 1; attempt <= this.config.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        const shouldRetry = isRetryable
          ? isRetryable(error)
          : this.isRetryableError(error);

        if (!shouldRetry || attempt === this.config.maxAttempts) {
          throw error;
        }

        const delay = this.calculateDelay(attempt);
        await this.sleep(delay);
      }
    }

    throw lastError;
  }

  private isRetryableError(error: any): boolean {
    // Network errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      return true;
    }

    // HTTP status codes
    if (error.status) {
      return this.config.retryableStatusCodes.includes(error.status);
    }

    return false;
  }

  private calculateDelay(attempt: number): number {
    return this.config.delayMs * Math.pow(this.config.backoffMultiplier, attempt - 1);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
