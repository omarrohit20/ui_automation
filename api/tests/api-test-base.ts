/**
 * Test Base Class
 * Provides common setup, teardown, and utilities for all API tests
 */

import { test, expect } from '@playwright/test';
import { ApiServiceLocator } from '../services/api-service-locator';
import EnvironmentConfig from '../config/environment';
import logger, { LogLevel } from '../utils/logger';
import { TestDataFactory } from '../fixtures/test-data-factory';

export class ApiTestBase {
  protected static isInitialized = false;

  /**
   * Global setup - runs once before all tests
   */
  static async globalSetup(): Promise<void> {
    if (!this.isInitialized) {
      // Set environment from env variable
      const env = process.env.ENV || 'dev';
      EnvironmentConfig.setEnvironment(env);

      // Initialize services
      await ApiServiceLocator.initialize();

      // Set log level based on environment
      const config = EnvironmentConfig.getConfig();
      const logLevelMap: Record<string, LogLevel> = {
        debug: LogLevel.DEBUG,
        info: LogLevel.INFO,
        warn: LogLevel.WARN,
        error: LogLevel.ERROR,
      };
      logger.setLevel(logLevelMap[config.logLevel]);

      logger.info(`Test environment: ${env}`);
      logger.info(`Base URL: ${EnvironmentConfig.getBaseUrl()}`);

      this.isInitialized = true;
    }
  }

  /**
   * Global teardown - runs once after all tests
   */
  static async globalTeardown(): Promise<void> {
    await ApiServiceLocator.cleanup();
    TestDataFactory.reset();
  }

  /**
   * Per-test setup
   */
  static async beforeEachTest(): Promise<void> {
    TestDataFactory.reset();
    logger.debug('Test setup complete');
  }

  /**
   * Per-test teardown
   */
  static async afterEachTest(): Promise<void> {
    logger.debug('Test teardown complete');
  }
}

/**
 * Helper: Verify response status
 */
export function expectStatus(
  actual: number,
  expected: number,
  message?: string
): void {
  expect(actual, message || `Expected status ${expected}, got ${actual}`).toBe(
    expected
  );
}

/**
 * Helper: Verify response success
 */
export function expectSuccess(actual: any, shouldBeSuccess: boolean = true): void {
  if (shouldBeSuccess) {
    expect(
      actual.success,
      'Expected successful response'
    ).toBe(true);
  } else {
    expect(
      actual.success,
      'Expected failed response'
    ).toBe(false);
  }
}

/**
 * Helper: Verify response has data
 */
export function expectDataExists(actual: any, message: string = 'Expected data in response'): void {
  expect(actual.data, message).toBeDefined();
  expect(actual.data, 'Data should not be null').not.toBeNull();
}

/**
 * Helper: Verify response message
 */
export function expectMessageContains(actual: any, expectedText: string): void {
  expect(actual.message.toLowerCase()).toContain(expectedText.toLowerCase());
}

/**
 * Helper: Create auth context for tests requiring token
 */
export interface IAuthContext {
  token: string;
  userId: string;
  email: string;
}

export async function getAuthContext(email?: string, password?: string): Promise<IAuthContext> {
  const { getUsersService } = await import('../services/api-service-locator');
  const usersService = getUsersService();

  const testEmail = email || 'practice@expandtesting.com';
  const testPassword = password || 'practice123';

  const response = await usersService.login(testEmail, testPassword);

  if (!response.isSuccessful() || !response.getData()) {
    throw new Error(`Failed to login: ${response.getMessage()}`);
  }

  const loginData = response.getData()!;
  return {
    token: loginData.token,
    userId: loginData.id,
    email: loginData.email,
  };
}
