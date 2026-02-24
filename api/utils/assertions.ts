/**
 * Advanced API Test Utilities
 * Assertion helpers and custom matchers for API testing
 */

import { expect } from '@playwright/test';
import { ApiResponse } from '../models/api-response';

/**
 * Custom API Response Assertions
 */
export class ApiAssertions {
  /**
   * Assert response is successful with expected status
   */
  static assertSuccessfulResponse<T>(
    response: ApiResponse<T>,
    expectedStatus: number = 200,
    message?: string
  ): void {
    expect(response.isSuccessful(), message).toBe(true);
    expect(response.getStatus(), `Expected status ${expectedStatus}`).toBe(expectedStatus);
  }

  /**
   * Assert response failed with expected status
   */
  static assertFailedResponse<T>(
    response: ApiResponse<T>,
    expectedStatus: number = 400,
    message?: string
  ): void {
    expect(response.isFailed(), message).toBe(true);
    expect(response.getStatus(), `Expected status ${expectedStatus}`).toBe(expectedStatus);
  }

  /**
   * Assert response contains specific status codes
   */
  static assertStatusInRange<T>(
    response: ApiResponse<T>,
    statusCodes: number[],
    message?: string
  ): void {
    expect(statusCodes, message).toContain(response.getStatus());
  }

  /**
   * Assert response data exists and has property
   */
  static assertDataHasProperty<T>(
    response: ApiResponse<T>,
    propertyPath: string,
    message?: string
  ): void {
    const data = response.getData();
    expect(data, 'Response data should exist').toBeDefined();

    const value = getNestedProperty(data, propertyPath);
    expect(value, message || `Property ${propertyPath} should exist`).toBeDefined();
  }

  /**
   * Assert response data property equals value
   */
  static assertDataPropertyEquals<T>(
    response: ApiResponse<T>,
    propertyPath: string,
    expectedValue: any,
    message?: string
  ): void {
    const data = response.getData();
    const value = getNestedProperty(data, propertyPath);
    expect(value, message).toBe(expectedValue);
  }

  /**
   * Assert response contains error
   */
  static assertHasError<T>(
    response: ApiResponse<T>,
    errorPath?: string,
    message?: string
  ): void {
    const errors = response.getErrors();
    expect(errors, message || 'Response should contain errors').toBeDefined();

    if (errorPath) {
      const error = getNestedProperty(errors, errorPath);
      expect(error, `Error at ${errorPath} should exist`).toBeDefined();
    }
  }

  /**
   * Assert response has message containing text
   */
  static assertMessageContains<T>(
    response: ApiResponse<T>,
    text: string,
    message?: string
  ): void {
    const msg = response.getMessage().toLowerCase();
    expect(msg, message).toContain(text.toLowerCase());
  }
}

/**
 * Helper: Get nested property from object
 */
function getNestedProperty(obj: any, path: string): any {
  return path.split('.').reduce((current, prop) => {
    return current?.[prop];
  }, obj);
}

/**
 * Performance Assertion Helper
 */
export class PerformanceAssertions {
  /**
   * Assert response time is within threshold
   */
  static assertResponseTime(actualTime: number, maxTimeMs: number, message?: string): void {
    expect(actualTime, message || `Response time should be less than ${maxTimeMs}ms`).toBeLessThanOrEqual(
      maxTimeMs
    );
  }

  /**
   * Assert response time is acceptable
   */
  static assertResponseTimeAcceptable(actualTime: number, message?: string): void {
    const threshold = 5000; // 5 seconds
    this.assertResponseTime(actualTime, threshold, message);
  }
}

/**
 * Data Validation Helper
 */
export class DataValidations {
  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  static isStrongPassword(password: string): boolean {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  }

  /**
   * Validate UUID v4 format
   */
  static isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Validate ISO date format
   */
  static isValidISODate(date: string): boolean {
    try {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime()) && date.includes('T');
    } catch {
      return false;
    }
  }

  /**
   * Assert email is valid
   */
  static assertEmailValid(email: string, message?: string): void {
    expect(this.isValidEmail(email), message || `Invalid email: ${email}`).toBe(true);
  }

  /**
   * Assert password is strong
   */
  static assertPasswordStrong(password: string, message?: string): void {
    expect(
      this.isStrongPassword(password),
      message || 'Password should be at least 8 chars with uppercase, lowercase, and number'
    ).toBe(true);
  }
}

/**
 * Collection Assertions
 */
export class CollectionAssertions {
  /**
   * Assert array contains object with property value
   */
  static assertArrayContainsObjectWithProperty<T extends Record<string, any>>(
    array: T[],
    propertyPath: string,
    expectedValue: any,
    message?: string
  ): void {
    const found = array.some((item) => {
      const value = getNestedProperty(item, propertyPath);
      return value === expectedValue;
    });

    expect(found, message || `Array should contain object with ${propertyPath}=${expectedValue}`).toBe(true);
  }

  /**
   * Assert array has no duplicates
   */
  static assertNoDuplicates<T>(array: T[], selector?: (item: T) => any, message?: string): void {
    const values = selector ? array.map(selector) : array;
    const unique = new Set(values);
    expect(unique.size, message || 'Array should have no duplicates').toBe(values.length);
  }

  /**
   * Assert array is sorted
   */
  static assertSorted<T>(
    array: T[],
    compareFn?: (a: T, b: T) => number,
    message?: string
  ): void {
    const sorted = [...array].sort(compareFn);
    expect(JSON.stringify(array), message || 'Array should be sorted').toBe(JSON.stringify(sorted));
  }
}
