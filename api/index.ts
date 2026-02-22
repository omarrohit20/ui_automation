/**
 * API Testing Framework - Main Export Index
 * Central point for importing all framework components
 */

// ============================================================================
// Configuration
// ============================================================================
export { default as EnvironmentConfig } from './config/environment';
export type { IEnvironmentConfig, IEnvironments } from './config/environment';

// ============================================================================
// HTTP Client & Request Building
// ============================================================================
export { HttpClient, createHttpClient } from './http-client';
export { RequestBuilder } from './models/http-request';
export type { IRequestConfig, IHttpResponse } from './models/http-request';

// ============================================================================
// API Response Models
// ============================================================================
export { ApiResponse, parseApiResponse } from './models/api-response';
export type { IResponseData } from './models/api-response';

// ============================================================================
// Services
// ============================================================================
export {
  BaseApiService,
  NotesApiService,
  UsersApiService,
  ApiServiceLocator,
  getNotesService,
  getUsersService,
} from './services/index';

export type {
  INote,
  INoteResponse,
  IUser,
  IUserResponse,
  ILoginResponse,
} from './services/index';

// ============================================================================
// Utilities
// ============================================================================
export { default as logger, LogLevel } from './utils/logger';
export { RetryStrategy } from './utils/retry-strategy';
export type { IRetryConfig } from './utils/retry-strategy';

export {
  ApiAssertions,
  PerformanceAssertions,
  DataValidations,
  CollectionAssertions,
} from './utils/assertions';

// ============================================================================
// Test Fixtures
// ============================================================================
export { TestDataFactory } from './fixtures/test-data-factory';
export {
  REGISTRATION_SCENARIOS,
  LOGIN_SCENARIOS,
  CREATE_NOTE_SCENARIOS,
  UPDATE_NOTE_SCENARIOS,
  DELETE_NOTE_SCENARIOS,
} from './fixtures/test-scenarios';

export type {
  ITestScenario,
  IUserTestScenario,
  INoteTestScenario,
} from './fixtures/test-scenarios';

// ============================================================================
// Test Base & Helpers
// ============================================================================
export {
  ApiTestBase,
  expectStatus,
  expectSuccess,
  expectDataExists,
  expectMessageContains,
  getAuthContext,
} from './tests/api-test-base';

export type { IAuthContext } from './tests/api-test-base';
