# 🚀 Enterprise API Testing Framework with Playwright & TypeScript

> **Production-Ready | Type-Safe | Data-Driven | Enterprise Design Patterns**

An **enterprise-grade API testing framework** built with Playwright and TypeScript implementing 6 industry-leading design patterns for maximum scalability and maintainability. Includes **50+ data-driven test scenarios** across user authentication and notes management APIs.

## ⭐ Key Features

- ✅ **Data-Driven Testing** - 40+ predefined scenarios, minimal code duplication
- ✅ **Enterprise Design Patterns** - Repository, Factory, Builder, Retry Strategy, Service Locator, Data-Driven
- ✅ **Type-Safe** - 100% TypeScript with full interface coverage
- ✅ **Automatic Retry** - Exponential backoff for transient failures
- ✅ **Multi-Environment** - Dev, QA, Staging, Production support
- ✅ **Rich Assertions** - 20+ custom assertion helpers
- ✅ **Comprehensive Logging** - Configurable levels per environment
- ✅ **Service Locator** - Centralized dependency injection
- ✅ **Repository Pattern** - Clean separation of API logic
- ✅ **Parallel Execution** - Runs 4 tests in parallel by default

## 📊 Test Coverage at a Glance

| Category | Tests | Status |
|----------|-------|--------|
| **Users API** | 20+ | ✅ Complete |
| **Notes API** | 25+ | ✅ Complete |
| **Integration** | 6+ | ✅ Complete |
| **Total Scenarios** | **50+** | **✅ Data-Driven** |

## 🎯 Quick Start (5 minutes)

### 1. Run Tests
```bash
npm run test:api
```

### 2. View Results
```bash
npm run report
```

### 3. Run Specific Suite
```bash
npm run test:api:users          # User tests
npm run test:api:notes          # Notes tests
npm run test:api:integration    # End-to-end
npm run test:api:smoke          # Positive tests only
npm run test:api:negative       # Negative tests
```

## 📁 Project Structure

```
api/                            # Framework core
├── config/environment.ts       # Multi-environment config
├── http-client.ts              # Smart HTTP client with retry
├── models/                     # API response/request models
├── services/                   # Repository pattern services
│   ├── base-api-service.ts     # Base service class
│   ├── users-api-service.ts    # Users API
│   ├── notes-api-service.ts    # Notes API
│   └── api-service-locator.ts  # Dependency injection
├── utils/                      # Utilities
│   ├── logger.ts               # Configurable logger
│   ├── retry-strategy.ts       # Retry with backoff
│   └── assertions.ts           # Custom assertions
├── fixtures/                   # Test data & scenarios
│   ├── test-data-factory.ts    # Factory pattern
│   └── test-scenarios.ts       # 40+ scenarios
└── tests/api-test-base.ts      # Base test class

tests/api/                      # Test suites
├── users.spec.ts               # 20+ user tests
├── notes.spec.ts               # 25+ notes tests
└── integration.spec.ts         # 6+ workflows

Documentation:
├── API_TESTING_QUICK_START.md  # Quick start guide
├── API_TESTING_GUIDE.md        # Comprehensive guide
├── API_TESTING_FRAMEWORK_SUMMARY.md  # Summary
├── API_TESTING_FILES_INVENTORY.md    # File listing
└── COMPLETION_REPORT.md        # What was built
```

## 🏗️ Design Patterns

### 1. **Repository Pattern** (services/)
Abstracts API endpoints into service classes
```typescript
const notesService = getNotesService();
const response = await notesService.createNote(data, token);
```

### 2. **Factory Pattern** (fixtures/test-data-factory.ts)
Centralized test data generation
```typescript
const user = TestDataFactory.generateUser();
const notes = TestDataFactory.generateNotes(5, 'Work');
```

### 3. **Builder Pattern** (models/http-request.ts)
Fluent API for request construction
```typescript
new RequestBuilder()
  .withMethod('POST')
  .withUrl('/notes')
  .withHeaders({...})
  .build();
```

### 4. **Retry Strategy** (utils/retry-strategy.ts)
Exponential backoff for resilience
```typescript
// Automatically retries with backoff
strategy.execute(async () => apiCall());
```

### 5. **Service Locator** (services/api-service-locator.ts)
Centralized dependency injection
```typescript
await ApiServiceLocator.initialize();
const service = getNotesService();
```

### 6. **Data-Driven** (fixtures/test-scenarios.ts)
40+ predefined test scenarios
```typescript
REGISTRATION_SCENARIOS.forEach(scenario => {
  test(scenario.name, async () => { /* test */ });
});
```

## 🧪 Test Examples

### Example 1: Basic Test
```typescript
test('should retrieve user profile', async () => {
  const authContext = await getAuthContext();
  const service = getUsersService();
  
  const response = await service.getProfile(authContext.token);
  
  expectStatus(response.getStatus(), 200);
  expectSuccess(response, true);
  expectDataExists(response);
});
```

### Example 2: Data-Driven Test
```typescript
LOGIN_SCENARIOS.forEach((scenario) => {
  test(`${scenario.name}`, async () => {
    const response = await service.login(
      scenario.input.email,
      scenario.input.password
    );
    expectStatus(response.getStatus(), scenario.expectedStatus);
  });
});
```

### Example 3: End-to-End Workflow
```typescript
test('complete user workflow', async () => {
  // Register
  const user = TestDataFactory.generateUser();
  const regResponse = await usersService.register(...);
  
  // Login
  const loginResponse = await usersService.login(...);
  const token = loginResponse.getData().token;
  
  // Create note
  const noteResponse = await notesService.createNote(note, token);
  
  // Delete note
  await notesService.deleteNote(noteId, token);
  
  // Logout
  await usersService.logout(token);
});
```

## 🛠️ Running Tests

### All Tests
```bash
npm run test:api
```

### By Environment
```bash
npm run test:api:qa              # QA
npm run test:api:staging         # Staging
npm run test:api:prod            # Production
```

### By Feature
```bash
npm run test:api:users           # User authentication
npm run test:api:notes           # Notes management
npm run test:api:integration     # End-to-end workflows
```

### By Type
```bash
npm run test:api:smoke           # Positive tests only
npm run test:api:negative        # Negative/validation tests
```

### Debug Mode
```bash
npm run test:api:debug           # With logging
npm run test:api:ui              # UI mode
npm run report                   # View HTML report
```

## 📖 Documentation

### Quick Start (5-10 min read)
Start here for immediate setup and running tests
→ [API_TESTING_QUICK_START.md](API_TESTING_QUICK_START.md)

### Comprehensive Guide (15-30 min read)
Deep dive into architecture, patterns, and extension
→ [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md)

### Framework Summary (5-10 min read)
Complete overview and statistics
→ [API_TESTING_FRAMEWORK_SUMMARY.md](API_TESTING_FRAMEWORK_SUMMARY.md)

### Files Inventory (5 min read)
What files were created and why
→ [API_TESTING_FILES_INVENTORY.md](API_TESTING_FILES_INVENTORY.md)

### Code Examples (15 min read)
13 practical examples of framework usage
→ [api/EXAMPLES.ts](api/EXAMPLES.ts)

### Completion Report (5 min read)
Detailed report of what was built
→ [COMPLETION_REPORT.md](COMPLETION_REPORT.md)

## 💡 Framework Components

### HttpClient
Smart HTTP wrapper with:
- Automatic retry with exponential backoff
- Request/response logging
- Type-safe responses
- Query parameter handling
- Multi-environment support

### ApiResponse<T>
Strongly-typed response wrapper:
```typescript
response.isSuccessful()          // boolean
response.getStatus()             // number
response.getMessage()            // string
response.getData()               // T | undefined
response.getErrors()             // errors object
```

### Logger
Configurable centralized logging:
```typescript
logger.debug('Debug message', data);
logger.info('Info message', data);
logger.warn('Warning message', data);
logger.error('Error message', data);
```

### Assertions
Rich custom assertions:
```typescript
ApiAssertions.assertSuccessfulResponse(response, 200);
ApiAssertions.assertDataHasProperty(response, 'data.id');
DataValidations.assertEmailValid(email);
DataValidations.assertPasswordStrong(password);
CollectionAssertions.assertNoDuplicates(array);
```

## 🔧 Configuration

### Environment Variables (.env)
```bash
ENV=dev|qa|staging|prod
TEST_USER_EMAIL=practice@expandtesting.com
TEST_USER_PASSWORD=practice123
API_RETRY_ATTEMPTS=3
API_RETRY_DELAY_MS=1000
API_REQUEST_TIMEOUT_MS=30000
```

### Environment-Specific Settings (api/config/environment.ts)
Each environment has:
- Base URL
- Timeout settings
- Retry configuration
- Log levels

## 📈 Scalability Features

- ✅ Easy to add new API endpoints
- ✅ Modular service architecture
- ✅ Reusable test data factory
- ✅ Environment-agnostic tests
- ✅ Parallel test execution
- ✅ Service locator for DI
- ✅ Extensible base classes
- ✅ Plugin-ready design

## ✨ Best Practices Implemented

1. **Single Responsibility** - Each class has one reason to change
2. **DRY** - Don't repeat yourself - shared logic in base classes
3. **SOLID** - All SOLID principles followed
4. **Type Safety** - 100% TypeScript with full interfaces
5. **Error Handling** - Comprehensive try-catch and logging
6. **Test Isolation** - Unique test data per test
7. **Documentation** - Clear comments and examples
8. **Maintainability** - Easy to understand and modify
9. **Performance** - Parallel execution, efficient operations
10. **Reliability** - Auto-retry, resilience to flakiness

## 🚀 Getting Started

### Step 1: Review Quick Start
```bash
# Read the quick start guide
cat API_TESTING_QUICK_START.md
```

### Step 2: Run Tests
```bash
# Run all tests
npm run test:api

# Or specific suite
npm run test:api:users
```

### Step 3: View Results
```bash
npm run report
```

### Step 4: Explore Code
- Check `tests/api/users.spec.ts` for test examples
- Review `api/services/users-api-service.ts` for service structure
- Look at `api/fixtures/test-scenarios.ts` for data-driven approach

## 🎓 Learning Path

### Beginner (30 min)
1. Read Quick Start guide
2. Run `npm run test:api`
3. View report

### Intermediate (1-2 hours)
1. Read Comprehensive Guide
2. Review test files
3. Explore service implementations
4. Check EXAMPLES.ts

### Advanced (2+ hours)
1. Understand design patterns
2. Study service locator
3. Review retry strategy
4. Create new service

## 🐛 Debugging

### Enable Debug Logging
```bash
npm run test:api:debug
```

### UI Mode
```bash
npm run test:api:ui
```

### Run Single Test
```bash
npx playwright test -g "test name"
```

### View Network Requests
Check console output during test execution

## 📞 FAQ

### Q: How do I add a new API endpoint?
A: Follow the 4-step guide in API_TESTING_GUIDE.md
1. Create service class
2. Add to service locator
3. Create test scenarios
4. Write tests

### Q: How do I run tests in QA?
A: Use `npm run test:api:qa`

### Q: Can I run tests in parallel?
A: Yes, 4 workers by default (configurable)

### Q: How do I debug failing tests?
A: Use `npm run test:api:debug`

### Q: Are the tests data-driven?
A: Yes, 40+ scenarios in `fixtures/test-scenarios.ts`

## 📊 Statistics

| Metric | Value |
|--------|-------|
| **Design Patterns** | 6 |
| **TypeScript Files** | 21 |
| **Test Scenarios** | 50+ |
| **Documentation Files** | 4 |
| **Code Examples** | 13 |
| **npm Scripts** | 14 |
| **Lines of Code** | 3000+ |
| **Test Coverage** | 50+ tests |

## 🎯 What's Included

- ✅ Complete framework ready to use
- ✅ 50+ test scenarios
- ✅ All best practices implemented
- ✅ Full documentation
- ✅ Code examples
- ✅ Multi-environment support
- ✅ Comprehensive assertions
- ✅ Error handling
- ✅ Retry mechanism
- ✅ Resource cleanup

## 🚀 Next Steps

1. **Start Testing**: `npm run test:api`
2. **View Results**: `npm run report`
3. **Review Guide**: Read `API_TESTING_GUIDE.md`
4. **Explore Code**: Check `tests/api/` and `api/services/`
5. **Extend**: Add new endpoints following the pattern

## 📝 License & Usage

This framework is production-ready and follows enterprise best practices. Feel free to extend and customize for your needs.

## 🎉 Ready to Test!

Everything is set up and ready to go. Start testing with:

```bash
npm run test:api
```

Happy Testing! 🚀

---

**Built with ❤️ using Playwright, TypeScript, and Enterprise Design Patterns**
