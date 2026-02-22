# API Testing Framework - Best Practices & Design Patterns

A comprehensive, enterprise-grade API testing framework built with **Playwright** and **TypeScript** using industry-best design patterns for maximum maintainability and scalability.

## 🏗️ Architecture & Design Patterns

### **1. Repository Pattern**
- **Location**: `api/services/`
- **Purpose**: Abstracts API endpoints into service classes
- **Benefits**: 
  - Clean separation of concerns
  - Easy to mock/swap implementations
  - Centralized API logic

```typescript
// Example usage
const notesService = getNotesService();
const response = await notesService.createNote(noteData, token);
```

### **2. Service Locator Pattern (Dependency Injection)**
- **Location**: `api/services/api-service-locator.ts`
- **Purpose**: Centralized service initialization and access
- **Benefits**:
  - Single source of truth for service initialization
  - Easy cleanup and resource management
  - Promotes loose coupling

```typescript
// Global setup once
await ApiServiceLocator.initialize();

// Access anywhere
const usersService = getUsersService();
```

### **3. Builder Pattern**
- **Location**: `api/models/http-request.ts`
- **Purpose**: Fluent API for constructing requests
- **Benefits**:
  - Readable request construction
  - Chainable API for flexibility
  - Type-safe configurations

```typescript
const request = new RequestBuilder()
  .withMethod('POST')
  .withUrl('/notes')
  .withHeaders({ 'Authorization': 'Bearer token' })
  .withBody({ title: 'Test' })
  .build();
```

### **4. Retry Strategy Pattern**
- **Location**: `api/utils/retry-strategy.ts`
- **Purpose**: Handles transient failures with exponential backoff
- **Benefits**:
  - Configurable retry logic
  - Reduces flaky tests
  - Production-like error handling

```typescript
const strategy = new RetryStrategy({
  maxAttempts: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504]
});
```

### **5. Factory Pattern**
- **Location**: `api/fixtures/test-data-factory.ts`
- **Purpose**: Generates consistent, valid test data
- **Benefits**:
  - Single source of test data generation
  - Easy maintenance of test data
  - Supports overrides for custom scenarios

```typescript
const user = TestDataFactory.generateUser();
const notes = TestDataFactory.generateNotes(5, 'Work');
```

### **6. Data-Driven Testing**
- **Location**: `api/fixtures/test-scenarios.ts`
- **Purpose**: Parametrized tests with multiple scenarios
- **Benefits**:
  - Reduced test code duplication
  - Easy to add new test cases
  - Clear test intent and expectations

```typescript
REGISTRATION_SCENARIOS.forEach((scenario) => {
  test(`${scenario.name}`, async () => {
    // Test with scenario data
  });
});
```

## 📁 Project Structure

```
api/
├── config/
│   └── environment.ts          # Environment configuration
├── http-client.ts              # HTTP client with retry logic
├── models/
│   ├── api-response.ts         # Response model
│   └── http-request.ts         # Request builder
├── services/
│   ├── base-api-service.ts     # Base service class
│   ├── users-api-service.ts    # Users API endpoints
│   ├── notes-api-service.ts    # Notes API endpoints
│   ├── api-service-locator.ts  # Service locator/DI
│   └── index.ts                # Barrel exports
├── utils/
│   ├── logger.ts               # Logging utility
│   └── retry-strategy.ts       # Retry mechanism
├── fixtures/
│   ├── test-data-factory.ts    # Test data generation
│   └── test-scenarios.ts       # Data-driven scenarios
└── tests/
    └── api-test-base.ts        # Base test class with helpers

tests/api/
├── users.spec.ts               # User authentication tests
└── notes.spec.ts               # Notes CRUD tests
```

## 🎯 Key Features

### **1. Multi-Environment Support**
```typescript
// Automatically switches based on ENV variable
EnvironmentConfig.setEnvironment('dev|qa|staging|prod');
```

### **2. Centralized Logging**
```typescript
logger.debug('Message', data);
logger.info('Message');
logger.warn('Message');
logger.error('Message');
```

### **3. Type-Safe API Responses**
```typescript
const response: ApiResponse<INote> = await notesService.getNoteById(id, token);
const data: INote | undefined = response.getData();
```

### **4. Automatic Retry with Backoff**
- Retries configurable HTTP status codes
- Exponential backoff to prevent server overload
- Network error handling

### **5. Comprehensive Error Handling**
```typescript
if (response.isFailed()) {
  const errors = response.getErrors();
  const message = response.getMessage();
}
```

## 🚀 Running Tests

### **Run all API tests**
```bash
npm test -- api-test.config.ts
```

### **Run specific test suite**
```bash
npm test -- tests/api/users.spec.ts
```

### **Run with specific environment**
```bash
ENV=qa npm test -- api-test.config.ts
```

### **Run only positive tests**
```bash
npm test -- --grep @positive
```

### **Run only negative tests**
```bash
npm test -- --grep @negative
```

### **Run with debug logging**
```bash
DEBUG=pw:api npm test -- api-test.config.ts
```

## 📊 Test Coverage

### **User Authentication**
- ✅ Registration with valid/invalid data
- ✅ Login with various credentials
- ✅ Profile retrieval and updates
- ✅ Password management
- ✅ Token validation
- ✅ Logout functionality

### **Notes Management**
- ✅ Create notes with data validation
- ✅ Retrieve notes (all and by ID)
- ✅ Update notes with partial updates
- ✅ Delete notes with verification
- ✅ Category filtering
- ✅ Bulk operations

### **Error Scenarios**
- ✅ Missing required fields
- ✅ Invalid data types
- ✅ Unauthorized access
- ✅ Non-existent resources
- ✅ Malformed requests

## 🔧 Adding New Tests

### **Step 1: Create Test Scenarios**
```typescript
// api/fixtures/test-scenarios.ts
export const MY_SCENARIOS: ITestScenario[] = [
  {
    name: 'Should do something',
    input: { /* test data */ },
    expectedStatus: 200,
    shouldSucceed: true,
    tags: ['positive', 'my-feature'],
  },
  // More scenarios...
];
```

### **Step 2: Create API Service**
```typescript
// api/services/my-api-service.ts
export class MyApiService extends BaseApiService {
  async doSomething(data: any, token: string): Promise<ApiResponse<T>> {
    return this.handleResponse(
      this.httpClient.post<T>(this.getEndpoint('/endpoint'), data, headers),
      'Do Something'
    );
  }
}
```

### **Step 3: Write Tests**
```typescript
// tests/api/my-feature.spec.ts
MY_SCENARIOS.forEach((scenario) => {
  test(`${scenario.name}`, async () => {
    const service = getMyService();
    const response = await service.doSomething(scenario.input, token);
    
    expectStatus(response.getStatus(), scenario.expectedStatus);
    expectSuccess(response, scenario.shouldSucceed);
  });
});
```

## 🛡️ Best Practices Implemented

1. **Single Responsibility Principle**: Each class has one reason to change
2. **DRY (Don't Repeat Yourself)**: Shared logic in base classes and utilities
3. **Type Safety**: Full TypeScript coverage with interfaces
4. **Logging**: Centralized, configurable logging at all levels
5. **Error Handling**: Comprehensive error catching and logging
6. **Testability**: Easy to mock, extendable, and maintainable
7. **Documentation**: Clear comments and meaningful naming
8. **Data Isolation**: Test data factory ensures clean test data
9. **Resource Management**: Proper initialization and cleanup
10. **Configuration Management**: Environment-specific configurations

## 📈 Scalability Features

- **Parallel Execution**: Tests run in parallel by default (configurable workers)
- **Modular Services**: Easy to add new API endpoints
- **Reusable Scenarios**: Data-driven approach reduces code duplication
- **Environment Agnostic**: Same tests work across all environments
- **Extensible Base Classes**: New features inherit base functionality
- **Service Locator**: Centralized dependency management
- **Retry Logic**: Built-in resilience for flaky network issues

## 🔍 Debugging

### **Enable debug logs**
```bash
DEBUG=* npm test -- tests/api/users.spec.ts
```

### **Run single test**
```bash
npm test -- tests/api/users.spec.ts -g "should login"
```

### **Generate HTML report**
```bash
npm test && npx playwright show-report api-test-results/html
```

## 📝 Example Test File

```typescript
import { test } from '@playwright/test';
import { ApiTestBase, expectStatus, getAuthContext } from './api-test-base';
import { getUsersService } from '../api/services/api-service-locator';

test.beforeAll(async () => {
  await ApiTestBase.globalSetup();
});

test('should get user profile', async () => {
  const authContext = await getAuthContext();
  const service = getUsersService();
  
  const response = await service.getProfile(authContext.token);
  
  expectStatus(response.getStatus(), 200);
  expect(response.isSuccessful()).toBe(true);
});
```

## 🎓 Learning Resources

- **Repository Pattern**: Separates data access logic from business logic
- **Service Locator**: Manages dependency injection and service lifecycle
- **Builder Pattern**: Makes complex object construction readable
- **Retry Strategy**: Handles transient failures gracefully
- **Factory Pattern**: Centralizes object creation logic
- **Data-Driven Testing**: Reduces test maintenance overhead

## 📞 Support

For questions or issues:
1. Check existing test examples in `tests/api/`
2. Review service implementations in `api/services/`
3. Check test data factory for generating realistic data
4. Enable debug logging for troubleshooting
