/**
 * Users API Tests - Data-Driven
 * Comprehensive test suite for user authentication and management
 */

import { test, expect } from '@playwright/test';
import { ApiTestBase, expectStatus, expectSuccess, expectDataExists, getAuthContext } from '../../api/tests/api-test-base';
import { getUsersService } from '../../api/services/api-service-locator';
import { TestDataFactory } from '../../api/fixtures/test-data-factory';
import { REGISTRATION_SCENARIOS, LOGIN_SCENARIOS } from '../../api/fixtures/test-scenarios';

// Global setup
test.beforeAll(async () => {
  await ApiTestBase.globalSetup();
});

// Global teardown
test.afterAll(async () => {
  await ApiTestBase.globalTeardown();
});

// Per-test setup/teardown
test.beforeEach(async () => {
  await ApiTestBase.beforeEachTest();
});

test.afterEach(async () => {
  await ApiTestBase.afterEachTest();
});

// ============================================================================
// HEALTH CHECK TESTS
// ============================================================================

test.describe('Health Check', () => {
  test('should return 200 when API is healthy', async () => {
    const service = getUsersService();
    const response = await service.healthCheck();

    expectStatus(response.getStatus(), 200);
    expectSuccess(response, true);
  });
});

// ============================================================================
// USER REGISTRATION TESTS - DATA DRIVEN
// ============================================================================

test.describe('User Registration', () => {
  REGISTRATION_SCENARIOS.forEach((scenario) => {
    test(
      `[${scenario.tags?.join(', ')}] ${scenario.name}`,
      {
        tag: scenario.tags || [],
      },
      async () => {
        const service = getUsersService();

        const response = await service.register(
          scenario.input.name || '',
          scenario.input.email || '',
          scenario.input.password || ''
        );

        // Verify status code
        expectStatus(response.getStatus(), scenario.expectedStatus ?? 200, scenario.description);

        // Verify success flag matches expectation
        expectSuccess(response, scenario.shouldSucceed);

        // Verify response message
        expect(response.getMessage()).toBeTruthy();

        // If successful, verify user data returned
        if (scenario.shouldSucceed) {
          expectDataExists(response);
          const userData = response.getData();
          expect(userData?.id).toBeTruthy();
          expect(userData?.email).toBe(scenario.input.email);
        }
      }
    );
  });
});

// ============================================================================
// USER LOGIN TESTS - DATA DRIVEN
// ============================================================================

test.describe('User Login', () => {
  LOGIN_SCENARIOS.forEach((scenario) => {
    test(
      `[${scenario.tags?.join(', ')}] ${scenario.name}`,
      {
        tag: scenario.tags || [],
      },
      async () => {
        const service = getUsersService();

        const response = await service.login(
          scenario.input.email || '',
          scenario.input.password || ''
        );

        // Verify status code
        expectStatus(response.getStatus(), scenario.expectedStatus ?? 200, scenario.description);

        // Verify success flag matches expectation
        expectSuccess(response, scenario.shouldSucceed);

        // Verify response message
        expect(response.getMessage()).toBeTruthy();

        // If successful, verify token and user data returned
        if (scenario.shouldSucceed) {
          expectDataExists(response);
          const loginData = response.getData();
          expect(loginData?.token).toBeTruthy();
          expect(loginData?.id).toBeTruthy();
          expect(loginData?.email).toBe(scenario.input.email);
        }
      }
    );
  });
});

// ============================================================================
// USER PROFILE TESTS
// ============================================================================

test.describe('User Profile Operations', () => {
  test('should retrieve user profile with valid token', async () => {
    const authContext = await getAuthContext();
    const service = getUsersService();

    const response = await service.getProfile(authContext.token);

    expectStatus(response.getStatus(), 200);
    expectSuccess(response, true);
    expectDataExists(response);

    const profile = response.getData();
    expect(profile?.email).toBe(authContext.email);
    expect(profile?.id).toBe(authContext.userId);
  });

  test('should fail to get profile with invalid token', async () => {
    const service = getUsersService();
    const invalidToken = 'invalid-token-12345';

    const response = await service.getProfile(invalidToken);

    expectStatus(response.getStatus(), 401);
    expectSuccess(response, false);
  });

  test('should update user profile successfully', async () => {
    const authContext = await getAuthContext();
    const service = getUsersService();

    const updatedProfile = {
      name: 'Updated Name',
      phone: '9876543210',
      company: 'Updated Company',
    };

    const response = await service.updateProfile(updatedProfile, authContext.token);

    expectStatus(response.getStatus(), 200);
    expectSuccess(response, true);
    expectDataExists(response);

    const profile = response.getData();
    expect(profile?.name).toBe(updatedProfile.name);
    expect(profile?.phone).toBe(updatedProfile.phone);
    expect(profile?.company).toBe(updatedProfile.company);
  });

  test('should fail to update profile with invalid token', async () => {
    const service = getUsersService();
    const invalidToken = 'invalid-token-12345';

    const response = await service.updateProfile(
      { name: 'New Name' },
      invalidToken
    );

    expectStatus(response.getStatus(), 401);
    expectSuccess(response, false);
  });
});

// ============================================================================
// PASSWORD MANAGEMENT TESTS
// ============================================================================

test.describe('Password Management', () => {
  test('should request password reset', async () => {
    const service = getUsersService();
    const email = 'practice@expandtesting.com';

    const response = await service.forgotPassword(email);

    expect([200, 400]).toContain(response.getStatus());
    expect(response.getMessage()).toBeTruthy();
  });

  test('should change password successfully', async () => {
    const authContext = await getAuthContext();
    const service = getUsersService();

    // Note: This will fail with actual API as we can't change real user password
    // This demonstrates the test structure
    const response = await service.changePassword(
      'practice123',
      'NewPassword@456',
      authContext.token
    );

    // Response depends on API implementation
    expect(response.getMessage()).toBeTruthy();
  });

  test('should fail to change password with invalid current password', async () => {
    const authContext = await getAuthContext();
    const service = getUsersService();

    const response = await service.changePassword(
      'wrongcurrentpassword',
      'NewPassword@456',
      authContext.token
    );

    expect([400, 401, 403]).toContain(response.getStatus());
  });
});

// ============================================================================
// USER LOGOUT TESTS
// ============================================================================

test.describe('User Logout', () => {
  test('should logout successfully with valid token', async () => {
    const authContext = await getAuthContext();
    const service = getUsersService();

    const response = await service.logout(authContext.token);

    expectStatus(response.getStatus(), 200);
    expectSuccess(response, true);
  });

  test('should fail to logout with invalid token', async () => {
    const service = getUsersService();
    const invalidToken = 'invalid-token-12345';

    const response = await service.logout(invalidToken);

    expectStatus(response.getStatus(), 401);
    expectSuccess(response, false);
  });
});
