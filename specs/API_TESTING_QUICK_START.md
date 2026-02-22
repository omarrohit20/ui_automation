# 🚀 API Testing Framework - Quick Start Guide

## 📋 Overview

Enterprise-grade API testing framework built with **Playwright** + **TypeScript** implementing industry best practices and design patterns for maximum scalability and maintainability.

## ✨ Key Highlights

- ✅ **Data-Driven Tests**: Multiple test scenarios without code duplication
- ✅ **Design Patterns**: Repository, Factory, Builder, Strategy, Service Locator patterns
- ✅ **Type-Safe**: Full TypeScript with interfaces for all API responses
- ✅ **Automatic Retry**: Exponential backoff for transient failures
- ✅ **Multi-Environment**: Dev, QA, Staging, Production configurations
- ✅ **Comprehensive Logging**: Centralized, configurable logging at all levels
- ✅ **Modular Services**: Easy to extend and add new API endpoints
- ✅ **Assertion Helpers**: Rich custom assertions for API testing
- ✅ **Integration Tests**: End-to-end workflow testing
- ✅ **Parallel Execution**: Run tests in parallel for speed

## 📁 Project Structure

```
api/
├── config/              # Environment configuration
├── http-client.ts       # HTTP client with retry
├── models/              # API response/request models
├── services/            # API service layer (Repository pattern)
├── utils/               # Utilities (Logger, Retry, Assertions)
└── fixtures/            # Test data (Factory) & Test scenarios

tests/api/
├── api-test-base.ts     # Base class with helpers
├── users.spec.ts        # User auth tests (data-driven)
├── notes.spec.ts        # Notes CRUD tests (data-driven)
└── integration.spec.ts  # End-to-end workflows
```

## 🎯 Quick Start

### 1. **Setup Environment**

```bash
# Copy example env file
cp .env.example .env

# Install dependencies (already done if you have the repo)
npm install
```

### 2. **Run Tests**

```bash
# Run all API tests with default (dev) environment
npm run test:api

# Run with specific environment
npm run test:api:qa
npm run test:api:staging
npm run test:api:prod

# Run specific test suites
npm run test:api:users          # User tests only
npm run test:api:notes          # Notes tests only
npm run test:api:integration    # Integration tests only

# Run with tag filters
npm run test:api:smoke          # Only positive tests (@positive)
npm run test:api:negative       # Only negative tests (@negative)

# View results
npm run report
```

### 3. **Debug Tests**

```bash
# Run with debug logging
npm run test:api:debug

# Run with UI mode
npm run test:api:ui

# Run single test
npx playwright test tests/api/users.spec.ts -g "should login"
```

## 📚 Writing Your First Test

### **Step 1: Define Test Scenario**

```typescript
// api/fixtures/test-scenarios.ts
export const MY_SCENARIOS: ITestScenario[] = [
  {
    name: 'Valid operation',
    input: { /* your test data */ },
    expectedStatus: 200,
    shouldSucceed: true,
    tags: ['positive', 'myfeature'],
  },
];
```

### **Step 2: Create API Service**

```typescript
// api/services/my-api-service.ts
import { BaseApiService } from './base-api-service';

export class MyApiService extends BaseApiService {
  async doOperation(data: any, token: string) {
    const headers = { 'x-auth-token': token };
    return this.handleResponse(
      this.httpClient.post('/endpoint', data, headers),
      'Do Operation'
    );
  }
}
```

### **Step 3: Write Tests**

```typescript
// tests/api/my-feature.spec.ts
import { test } from '@playwright/test';
import { ApiTestBase, expectStatus, expectSuccess } from './api-test-base';
import { getMyService } from '../api/services';
import { MY_SCENARIOS } from '../api/fixtures/test-scenarios';

test.beforeAll(async () => {
  await ApiTestBase.globalSetup();
});

test.describe('My Feature', () => {
  MY_SCENARIOS.forEach((scenario) => {
    test(`[${scenario.tags?.join(', ')}] ${scenario.name}`, async () => {
      const service = getMyService();
      const response = await service.doOperation(scenario.input, 'token');

      expectStatus(response.getStatus(), scenario.expectedStatus);
      expectSuccess(response, scenario.shouldSucceed);
    });
  });
});
```

## 🏗️ Design Patterns Explained

### **Repository Pattern** (services/)
Abstracts API endpoints into service classes for clean separation.

```typescript
// Before (mixed concerns)
const response = await fetch('/api/notes', { headers: { token } });

// After (clean)
const notesService = getNotesService();
const response = await notesService.getAllNotes(token);
```

### **Factory Pattern** (fixtures/test-data-factory.ts)
Generates consistent test data centrally.

```typescript
const user = TestDataFactory.generateUser();
const notes = TestDataFactory.generateNotes(5, 'Work');
```

### **Builder Pattern** (models/http-request.ts)
Fluent API for request construction.

```typescript
new RequestBuilder()
  .withMethod('POST')
  .withUrl('/notes')
  .withHeaders({ 'Authorization': 'Bearer token' })
  .withBody({ title: 'Test' })
  .build();
```

### **Retry Strategy Pattern** (utils/retry-strategy.ts)
Handles transient failures with exponential backoff.

```typescript
const strategy = new RetryStrategy({
  maxAttempts: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
});
```

### **Service Locator Pattern** (services/api-service-locator.ts)
Centralized dependency injection and service management.

```typescript
// Setup once
await ApiServiceLocator.initialize();

// Use anywhere
const service = getNotesService();
```

### **Data-Driven Pattern** (fixtures/test-scenarios.ts)
Multiple test cases without code duplication.

```typescript
REGISTRATION_SCENARIOS.forEach((scenario) => {
  test(`${scenario.name}`, async () => {
    // One test template, many scenarios
  });
});
```

## 🧩 Key Components

### **HttpClient** - Smart HTTP wrapper
- Automatic retry with exponential backoff
- Centralized header management
- Query parameter handling
- Type-safe responses

### **ApiResponse<T>** - Typed responses
```typescript
const response: ApiResponse<IUser> = await getUsersService().getProfile(token);
if (response.isSuccessful()) {
  const user: IUser = response.getData();
}
```

### **Logger** - Configurable logging
```typescript
logger.debug('Debug message', { data: 'value' });
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message');
```

### **Test Base Class** - Common test utilities
- Global setup/teardown
- Before/after each test
- Common assertion helpers
- Auth context management

### **Assertion Helpers** - Rich assertions
```typescript
expectStatus(response.getStatus(), 200);
expectSuccess(response, true);
expectDataExists(response);

// Advanced assertions
ApiAssertions.assertSuccessfulResponse(response, 200);
ApiAssertions.assertDataPropertyEquals(response, 'data.email', 'test@test.com');
DataValidations.assertEmailValid(email);
```

## 📊 Test Coverage

### **Users API** (15+ tests)
- Registration (positive & negative)
- Login (valid & invalid credentials)
- Profile operations
- Password management
- Logout & cleanup

### **Notes API** (20+ tests)
- Create notes (positive & negative)
- Retrieve notes (all, by ID)
- Update notes (full & partial)
- Delete notes
- Category filtering
- Bulk operations

### **Integration Tests** (6+ scenarios)
- User registration → Login → CRUD workflow
- Profile update workflow
- Concurrent operations
- Note organization
- Data validation throughout workflow

## 🔧 Configuration

### **Environment Variables** (.env)
```bash
ENV=dev|qa|staging|prod
TEST_USER_EMAIL=practice@expandtesting.com
TEST_USER_PASSWORD=practice123
API_RETRY_ATTEMPTS=3
API_RETRY_DELAY_MS=1000
API_REQUEST_TIMEOUT_MS=30000
```

### **Environment Settings** (api/config/environment.ts)
```typescript
const config = {
  dev: { baseUrl: '...', timeout: 10000, retryAttempts: 2 },
  qa: { baseUrl: '...', timeout: 15000, retryAttempts: 3 },
  staging: { baseUrl: '...', timeout: 15000, retryAttempts: 3 },
  prod: { baseUrl: '...', timeout: 20000, retryAttempts: 1 },
};
```

## 🚦 Running Test Suites

```bash
# All API tests
npm run test:api

# Specific suite
npm run test:api:users

# Positive tests (smoke)
npm run test:api:smoke

# Negative tests (validation)
npm run test:api:negative

# Specific environment
ENV=qa npm run test:api:qa

# With UI
npm run test:api:ui

# With debug
npm run test:api:debug
```

## 📈 Extending the Framework

### **Add New API Endpoint**

1. **Create service** (api/services/my-service.ts)
```typescript
export class MyService extends BaseApiService {
  async newEndpoint(data: any, token: string) {
    return this.handleResponse(
      this.httpClient.post('/endpoint', data, { 'x-auth-token': token }),
      'New Endpoint'
    );
  }
}
```

2. **Add to locator** (api/services/api-service-locator.ts)
```typescript
private static myService: MyService;

static getMyService(): MyService {
  if (!this.myService) throw new Error('Not initialized');
  return this.myService;
}
```

3. **Create test scenarios** (api/fixtures/test-scenarios.ts)
```typescript
export const MY_SCENARIOS: ITestScenario[] = [
  { name: 'Test case 1', input: {...}, expectedStatus: 200 },
  { name: 'Test case 2', input: {...}, expectedStatus: 400 },
];
```

4. **Write tests** (tests/api/my-feature.spec.ts)
```typescript
MY_SCENARIOS.forEach((scenario) => {
  test(`${scenario.name}`, async () => {
    const response = await getMyService().newEndpoint(scenario.input, token);
    expectStatus(response.getStatus(), scenario.expectedStatus);
  });
});
```

## 💡 Best Practices

1. **Use Data Factory** for all test data generation
2. **Add meaningful tags** (positive, negative, smoke, regression)
3. **Create test scenarios** for each feature
4. **Use base service class** to reduce code duplication
5. **Enable logging** at appropriate levels per environment
6. **Implement retry logic** for network calls
7. **Type everything** for better IDE support
8. **Document complex flows** in integration tests
9. **Organize tests** by API feature/service
10. **Review assertion helpers** to use rich assertions

## 🐛 Debugging Tips

- Enable debug logs: `DEBUG=* npm run test:api:debug`
- Run single test: `npx playwright test -g "test name"`
- Use UI mode: `npm run test:api:ui`
- Check network requests: Look at console output
- Review test data: Check TestDataFactory generation
- Inspect responses: Use logger.debug in services

## 📞 Common Issues

### **Tests timeout**
- Increase timeout in environment config
- Check API server is running
- Verify network connectivity

### **Flaky tests**
- Ensure test data isolation with Factory
- Check retry settings in HttpClient
- Avoid hardcoded waits, use proper synchronization

### **Failed assertions**
- Review actual vs expected in logs
- Check test scenario expectations
- Verify API response format

## 📖 Additional Resources

- [Playwright Testing Guide](https://playwright.dev/docs/intro)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [API Testing Best Practices](https://restfulapi.net/)
- [Design Patterns](https://refactoring.guru/design-patterns)

## 🎓 Key Takeaways

✅ Scalable - Add new tests without modifying existing code
✅ Maintainable - Services & scenarios in one place
✅ Reliable - Automatic retry & comprehensive error handling
✅ Type-Safe - Full TypeScript coverage with interfaces
✅ Data-Driven - 40+ test scenarios without duplication
✅ Well-Documented - Clear code structure & comments
✅ Professional - Enterprise design patterns & best practices

---

**Happy Testing! 🚀**
