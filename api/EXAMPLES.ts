/**
 * Example: How to Use the API Testing Framework
 * This file demonstrates common usage patterns and best practices
 */

// ============================================================================
// EXAMPLE 1: Basic Test
// ============================================================================

/*
import { test, expect } from '@playwright/test';
import { ApiTestBase, expectStatus, expectSuccess } from './api-test-base';
import { getUsersService } from '../api/services/api-service-locator';

test.beforeAll(async () => {
  await ApiTestBase.globalSetup();
});

test('health check should return 200', async () => {
  const usersService = getUsersService();
  const response = await usersService.healthCheck();

  expectStatus(response.getStatus(), 200);
  expectSuccess(response, true);
});
*/

// ============================================================================
// EXAMPLE 2: Data-Driven Test
// ============================================================================

/*
import { test } from '@playwright/test';
import { ApiTestBase } from './api-test-base';
import { getUsersService } from '../api/services/api-service-locator';
import { LOGIN_SCENARIOS } from '../api/fixtures/test-scenarios';

test.beforeAll(async () => {
  await ApiTestBase.globalSetup();
});

// One test template, multiple scenarios
test.describe('Login Tests', () => {
  LOGIN_SCENARIOS.forEach((scenario) => {
    test(
      `[${scenario.tags?.join(', ')}] ${scenario.name}`,
      { tag: scenario.tags || [] },
      async () => {
        const service = getUsersService();
        const response = await service.login(
          scenario.input.email || '',
          scenario.input.password || ''
        );

        expect(response.getStatus()).toBe(scenario.expectedStatus);
        expect(response.isSuccessful()).toBe(scenario.shouldSucceed);
      }
    );
  });
});
*/

// ============================================================================
// EXAMPLE 3: Using Test Factory
// ============================================================================

/*
import { TestDataFactory } from '../api/fixtures/test-data-factory';

// Generate valid test data
const user = TestDataFactory.generateUser();
const userWithOverride = TestDataFactory.generateUser({
  name: 'Custom Name',
});

// Generate multiple items
const notes = TestDataFactory.generateNotes(5, 'Work');

// Get invalid data for negative testing
const invalidUsers = TestDataFactory.getInvalidUsers();
const invalidNotes = TestDataFactory.getInvalidNotes();
*/

// ============================================================================
// EXAMPLE 4: Custom Assertions
// ============================================================================

/*
import { ApiResponse } from '../api/models/api-response';
import {
  ApiAssertions,
  DataValidations,
  CollectionAssertions,
  PerformanceAssertions,
} from '../api/utils/assertions';

// Assert API response
const response: ApiResponse<any> = await service.doSomething();
ApiAssertions.assertSuccessfulResponse(response, 200);
ApiAssertions.assertDataHasProperty(response, 'data.id');
ApiAssertions.assertDataPropertyEquals(response, 'data.email', 'test@test.com');
ApiAssertions.assertMessageContains(response, 'success');

// Validate data format
DataValidations.assertEmailValid('test@test.com');
DataValidations.assertPasswordStrong('SecurePass@123');

// Verify collections
const notes = response.getData();
CollectionAssertions.assertNoDuplicates(notes, (n) => n.id);
CollectionAssertions.assertArrayContainsObjectWithProperty(
  notes,
  'category',
  'Work'
);

// Performance monitoring
PerformanceAssertions.assertResponseTime(150, 5000); // 150ms < 5s
PerformanceAssertions.assertResponseTimeAcceptable(150);
*/

// ============================================================================
// EXAMPLE 5: End-to-End Workflow
// ============================================================================

/*
import { test } from '@playwright/test';
import { ApiTestBase, expectSuccess, expectStatus } from './api-test-base';
import { getUsersService, getNotesService } from '../api/services/api-service-locator';
import { TestDataFactory } from '../api/fixtures/test-data-factory';

test.beforeAll(async () => {
  await ApiTestBase.globalSetup();
});

test('complete user workflow: register -> login -> create note', async () => {
  const usersService = getUsersService();
  const notesService = getNotesService();

  // Step 1: Register new user
  const newUser = TestDataFactory.generateUser();
  const registerResponse = await usersService.register(
    newUser.name,
    newUser.email,
    newUser.password!
  );
  expectSuccess(registerResponse, true);

  // Step 2: Login
  const loginResponse = await usersService.login(
    newUser.email,
    newUser.password!
  );
  expectSuccess(loginResponse, true);
  const token = loginResponse.getData()!.token;

  // Step 3: Create note
  const note = TestDataFactory.generateNote();
  const noteResponse = await notesService.createNote(note, token);
  expectSuccess(noteResponse, true);
  expectStatus(noteResponse.getStatus(), 200);

  // Step 4: Verify note
  const createdNote = noteResponse.getData();
  expect(createdNote?.title).toBe(note.title);
  expect(createdNote?.category).toBe(note.category);
});
*/

// ============================================================================
// EXAMPLE 6: Logging & Debugging
// ============================================================================

/*
import logger, { LogLevel } from '../api/utils/logger';

// Set log level
logger.setLevel(LogLevel.DEBUG);

// Log at different levels
logger.debug('Debug information', { userId: 123 });
logger.info('Test starting', { testName: 'my-test' });
logger.warn('API rate limit approaching', { remaining: 10 });
logger.error('Test failed', new Error('Network timeout'));
*/

// ============================================================================
// EXAMPLE 7: Retry Strategy
// ============================================================================

/*
import { RetryStrategy } from '../api/utils/retry-strategy';

const strategy = new RetryStrategy({
  maxAttempts: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
});

// Use with any async operation
const result = await strategy.execute(
  async () => {
    return await someApiCall();
  },
  (error) => {
    // Custom logic to determine if retryable
    return error.status >= 500;
  }
);
*/

// ============================================================================
// EXAMPLE 8: Environment Configuration
// ============================================================================

/*
import EnvironmentConfig from '../api/config/environment';

// Get current environment configuration
const config = EnvironmentConfig.getConfig();
console.log(config.baseUrl);
console.log(config.timeout);
console.log(config.retryAttempts);

// Set environment
EnvironmentConfig.setEnvironment('qa');

// Get base URL
const baseUrl = EnvironmentConfig.getBaseUrl();
*/

// ============================================================================
// EXAMPLE 9: Building Custom Requests
// ============================================================================

/*
import { RequestBuilder } from '../api/models/http-request';
import { HttpClient } from '../api/http-client';

const client = new HttpClient();
await client.initialize();

// Fluent API for request building
const response = await client.post(
  '/notes',
  {
    title: 'My Note',
    description: 'Note description',
    category: 'Work',
  },
  {
    'x-auth-token': 'my-token-here',
  }
);

// Or with query parameters
const notesResponse = await client.get(
  '/notes',
  { 'x-auth-token': 'token' },
  { limit: 10, offset: 0 }
);

await client.dispose();
*/

// ============================================================================
// EXAMPLE 10: Testing Different Categories
// ============================================================================

/*
import { test } from '@playwright/test';
import { getNotesService } from '../api/services/api-service-locator';
import { TestDataFactory } from '../api/fixtures/test-data-factory';
import { getAuthContext } from './api-test-base';

test('should handle all note categories', async () => {
  const authContext = await getAuthContext();
  const notesService = getNotesService();

  const categories = ['Home', 'Work', 'Personal'] as const;

  for (const category of categories) {
    const note = TestDataFactory.generateNote({ category });
    const response = await notesService.createNote(note, authContext.token);

    expect(response.isSuccessful()).toBe(true);
    expect(response.getData()?.category).toBe(category);
  }
});
*/

// ============================================================================
// EXAMPLE 11: Handling Errors
// ============================================================================

/*
import { ApiResponse } from '../api/models/api-response';

async function handleApiResponse<T>(response: ApiResponse<T>) {
  if (response.isSuccessful()) {
    const data = response.getData();
    console.log('Operation successful:', data);
    return data;
  } else {
    const status = response.getStatus();
    const message = response.getMessage();
    const errors = response.getErrors();

    if (status === 401) {
      console.log('Unauthorized - invalid token');
    } else if (status === 400) {
      console.log('Bad request - validation errors:', errors);
    } else if (status === 404) {
      console.log('Resource not found');
    } else {
      console.log('Unexpected error:', message);
    }

    throw new Error(message);
  }
}
*/

// ============================================================================
// EXAMPLE 12: Concurrent Operations
// ============================================================================

/*
import { test } from '@playwright/test';
import { getNotesService } from '../api/services/api-service-locator';
import { TestDataFactory } from '../api/fixtures/test-data-factory';
import { getAuthContext } from './api-test-base';

test('should handle concurrent requests', async () => {
  const authContext = await getAuthContext();
  const notesService = getNotesService();

  // Create 5 notes concurrently
  const notePromises = Array(5)
    .fill(null)
    .map(() => {
      const note = TestDataFactory.generateNote();
      return notesService.createNote(note, authContext.token);
    });

  const responses = await Promise.all(notePromises);

  // Verify all succeeded
  responses.forEach((response) => {
    expect(response.isSuccessful()).toBe(true);
  });

  const createdIds = responses.map((r) => r.getData()!.id);

  // Update all concurrently
  const updatePromises = createdIds.map((id) =>
    notesService.updateNoteStatus(id, true, authContext.token)
  );

  await Promise.all(updatePromises);
});
*/

// ============================================================================
// EXAMPLE 13: Reusing Authentication
// ============================================================================

/*
import { test } from '@playwright/test';
import { getAuthContext } from './api-test-base';
import { getNotesService, getUsersService } from '../api/services/api-service-locator';

test('should reuse auth token across multiple operations', async () => {
  // Get authenticated context once
  const authContext = await getAuthContext();

  const usersService = getUsersService();
  const notesService = getNotesService();

  // Use same token for all operations
  const profile = await usersService.getProfile(authContext.token);
  const notes = await notesService.getAllNotes(authContext.token);

  expect(profile.isSuccessful()).toBe(true);
  expect(notes.isSuccessful()).toBe(true);
});
*/

// Export notice
export const frameworkExamples = {
  message:
    'See comments above for comprehensive usage examples. Uncomment sections as needed.',
  location: __filename,
};
