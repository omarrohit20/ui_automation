/**
 * Generic API Response Model
 * Standardizes API response structure
 */

export interface IResponseData {
  [key: string]: any;
}

export class ApiResponse<T = IResponseData> {
  constructor(
    public success: boolean,
    public status: number,
    public message: string,
    public data?: T,
    public errors?: Record<string, any>
  ) {}

  isSuccessful(): boolean {
    return this.success;
  }

  isFailed(): boolean {
    return !this.success;
  }

  getData(): T | undefined {
    return this.data;
  }

  getErrors(): Record<string, any> | undefined {
    return this.errors;
  }

  getStatus(): number {
    return this.status;
  }

  getMessage(): string {
    return this.message;
  }
}

/**
 * Parses raw response and converts to typed ApiResponse
 */
export async function parseApiResponse<T = IResponseData>(
  rawResponse: any
): Promise<ApiResponse<T>> {
  const { success, status, message, data, errors } = await rawResponse.json();
  return new ApiResponse<T>(success, status, message, data, errors);
}
