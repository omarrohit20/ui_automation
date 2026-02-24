/**
 * Test Data Provider - Data-driven test scenarios
 * Each scenario defines input parameters and expected outcomes
 */

import { IUser, INote } from '../services/index';

export interface ITestScenario<T = any> {
  name: string;
  input: T;
  expectedStatus?: number;
  shouldSucceed?: boolean;
  expectedError?: string;
  tags?: string[];
  description?: string;
}

export interface IUserTestScenario extends ITestScenario<Partial<IUser>> {
  expectedStatus: number;
}

export interface INoteTestScenario extends ITestScenario<Partial<INote>> {
  expectedStatus: number;
}

/**
 * Registration test scenarios
 */
export const REGISTRATION_SCENARIOS: IUserTestScenario[] = [
  {
    name: 'Valid user registration',
    input: {
      name: 'John Doe',
      email: 'john.doe@test.com',
      password: 'SecurePass@123',
    },
    expectedStatus: 201,
    shouldSucceed: true,
    tags: ['@positive', '@registration'],
    description: 'User should be able to register with valid credentials',
  },
  {
    name: 'Registration with missing name',
    input: {
      name: '',
      email: 'test@test.com',
      password: 'SecurePass@123',
    },
    expectedStatus: 400,
    shouldSucceed: false,
    tags: ['@negative', '@registration', '@validation'],
    description: 'Registration should fail with empty name',
  },
  {
    name: 'Registration with invalid email',
    input: {
      name: 'Test User',
      email: 'not-an-email',
      password: 'SecurePass@123',
    },
    expectedStatus: 400,
    shouldSucceed: false,
    tags: ['@negative', '@registration', '@validation'],
    description: 'Registration should fail with invalid email format',
  },
  {
    name: 'Registration with weak password',
    input: {
      name: 'Test User',
      email: 'test@test.com',
      password: 'weak',
    },
    expectedStatus: 400,
    shouldSucceed: false,
    tags: ['@negative', '@registration', '@validation'],
    description: 'Registration should fail with weak password',
  },
  {
    name: 'Registration with missing email',
    input: {
      name: 'Test User',
      password: 'SecurePass@123',
    },
    expectedStatus: 400,
    shouldSucceed: false,
    tags: ['@negative', '@registration', '@validation'],
    description: 'Registration should fail with missing email',
  },
];

/**
 * Login test scenarios
 */
export const LOGIN_SCENARIOS: ITestScenario<{ email: string; password: string }>[] = [
  {
    name: 'Valid login credentials',
    input: {
      email: 'practice@expandtesting.com',
      password: 'practice123',
    },
    expectedStatus: 200,
    shouldSucceed: true,
    tags: ['@positive', '@login', '@auth'],
    description: 'User should login with valid credentials',
  },
  {
    name: 'Login with incorrect password',
    input: {
      email: 'practice@expandtesting.com',
      password: 'wrongpassword',
    },
    expectedStatus: 401,
    shouldSucceed: false,
    tags: ['@negative', '@login', '@auth'],
    description: 'Login should fail with incorrect password',
  },
  {
    name: 'Login with non-existent email',
    input: {
      email: 'nonexistent@test.com',
      password: 'password123',
    },
    expectedStatus: 401,
    shouldSucceed: false,
    tags: ['@negative', '@login', '@auth'],
    description: 'Login should fail with non-existent email',
  },
  {
    name: 'Login with empty email',
    input: {
      email: '',
      password: 'password123',
    },
    expectedStatus: 400,
    shouldSucceed: false,
    tags: ['@negative', '@login', '@validation'],
    description: 'Login should fail with empty email',
  },
  {
    name: 'Login with empty password',
    input: {
      email: 'practice@expandtesting.com',
      password: '',
    },
    expectedStatus: 400,
    shouldSucceed: false,
    tags: ['@negative', '@login', '@validation'],
    description: 'Login should fail with empty password',
  },
];

/**
 * Create note test scenarios
 */
export const CREATE_NOTE_SCENARIOS: INoteTestScenario[] = [
  {
    name: 'Create note with valid data',
    input: {
      title: 'Important Meeting',
      description: 'Meeting with team at 2 PM',
      category: 'Work',
    },
    expectedStatus: 200,
    shouldSucceed: true,
    tags: ['@positive', '@notes', '@create'],
    description: 'User should create note with valid data',
  },
  {
    name: 'Create personal note',
    input: {
      title: 'Personal Reminder',
      description: 'Remember to call mom',
      category: 'Personal',
    },
    expectedStatus: 200,
    shouldSucceed: true,
    tags: ['@positive', '@notes', '@create'],
    description: 'User should create personal category note',
  },
  {
    name: 'Create home note',
    input: {
      title: 'Shopping List',
      description: 'Buy milk, eggs, bread',
      category: 'Home',
    },
    expectedStatus: 200,
    shouldSucceed: true,
    tags: ['@positive', '@notes', '@create'],
    description: 'User should create home category note',
  },
  {
    name: 'Create note with empty title',
    input: {
      title: '',
      description: 'Valid description',
      category: 'Work',
    },
    expectedStatus: 400,
    shouldSucceed: false,
    tags: ['@negative', '@notes', '@validation'],
    description: 'Note creation should fail with empty title',
  },
  {
    name: 'Create note with empty description',
    input: {
      title: 'Valid Title',
      description: '',
      category: 'Work',
    },
    expectedStatus: 400,
    shouldSucceed: false,
    tags: ['@negative', '@notes', '@validation'],
    description: 'Note creation should fail with empty description',
  },
  {
    name: 'Create note with invalid category',
    input: {
      title: 'Valid Title',
      description: 'Valid Description',
      category: 'InvalidCategory' as any,
    },
    expectedStatus: 400,
    shouldSucceed: false,
    tags: ['@negative', '@notes', '@validation'],
    description: 'Note creation should fail with invalid category',
  },
];

/**
 * Update note test scenarios
 */
export const UPDATE_NOTE_SCENARIOS: INoteTestScenario[] = [
  {
    name: 'Update note title and description',
    input: {
      title: 'Updated Title',
      description: 'Updated Description',
      category: 'Work',
      completed: false,
    },
    expectedStatus: 200,
    shouldSucceed: true,
    tags: ['@positive', '@notes', '@update'],
    description: 'User should update note with valid data',
  },
  {
    name: 'Mark note as completed',
    input: {
      title: 'Existing Title',
      description: 'Existing Description',
      category: 'Work',
      completed: true,
    },
    expectedStatus: 200,
    shouldSucceed: true,
    tags: ['@positive', '@notes', '@update'],
    description: 'User should mark note as completed',
  },
  {
    name: 'Change note category',
    input: {
      title: 'Title',
      description: 'Description',
      category: 'Personal',
      completed: false,
    },
    expectedStatus: 200,
    shouldSucceed: true,
    tags: ['@positive', '@notes', '@update'],
    description: 'User should change note category',
  },
];

/**
 * Delete note test scenarios
 */
export const DELETE_NOTE_SCENARIOS: ITestScenario<{ noteId: string }>[] = [
  {
    name: 'Delete existing note',
    input: { noteId: 'valid-note-id' },
    expectedStatus: 200,
    shouldSucceed: true,
    tags: ['@positive', '@notes', '@delete'],
    description: 'User should delete existing note',
  },
  {
    name: 'Delete non-existent note',
    input: { noteId: 'non-existent-id' },
    expectedStatus: 400,
    shouldSucceed: false,
    tags: ['@negative', '@notes', '@delete'],
    description: 'Delete should fail for non-existent note',
  },
  {
    name: 'Delete with invalid note ID',
    input: { noteId: '' },
    expectedStatus: 400,
    shouldSucceed: false,
    tags: ['@negative', '@notes', '@delete'],
    description: 'Delete should fail with empty note ID',
  },
];
