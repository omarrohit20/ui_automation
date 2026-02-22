/**
 * Integration Tests - End-to-End User Workflows
 * Tests complete workflows combining multiple API calls
 */

import { test, expect } from '@playwright/test';
import {
  ApiTestBase,
  expectStatus,
  expectSuccess,
  expectDataExists,
} from './api-test-base';
import { getUsersService, getNotesService } from '../api/services/api-service-locator';
import { TestDataFactory } from '../api/fixtures/test-data-factory';
import { ApiAssertions, DataValidations } from '../api/utils/assertions';

// Global setup/teardown
test.beforeAll(async () => {
  await ApiTestBase.globalSetup();
});

test.afterAll(async () => {
  await ApiTestBase.globalTeardown();
});

test.beforeEach(async () => {
  await ApiTestBase.beforeEachTest();
});

test.afterEach(async () => {
  await ApiTestBase.afterEachTest();
});

// ============================================================================
// WORKFLOW: User Registration -> Login -> Create Notes -> Manage
// ============================================================================

test.describe('Complete User Workflow', () => {
  test('should register, login, and manage notes end-to-end', async () => {
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
    expectDataExists(registerResponse);

    // Step 2: Login with new credentials
    const loginResponse = await usersService.login(
      newUser.email,
      newUser.password!
    );

    expectSuccess(loginResponse, true);
    expectDataExists(loginResponse);

    const loginData = loginResponse.getData();
    const token = loginData!.token;
    const userId = loginData!.id;

    // Validate token and user ID
    expect(token).toBeTruthy();
    expect(userId).toBeTruthy();

    // Step 3: Get user profile to verify login worked
    const profileResponse = await usersService.getProfile(token);
    expectSuccess(profileResponse, true);

    const profile = profileResponse.getData();
    expect(profile?.email).toBe(newUser.email);
    expect(profile?.id).toBe(userId);

    // Step 4: Create multiple notes
    const notesToCreate = TestDataFactory.generateNotes(3);
    const createdNoteIds: string[] = [];

    for (const note of notesToCreate) {
      const createResponse = await notesService.createNote(note, token);
      expectSuccess(createResponse, true);
      expectDataExists(createResponse);

      const createdNote = createResponse.getData();
      createdNoteIds.push(createdNote!.id);
    }

    // Step 5: Retrieve all notes and verify
    const allNotesResponse = await notesService.getAllNotes(token);
    expectSuccess(allNotesResponse, true);
    expectDataExists(allNotesResponse);

    const allNotes = allNotesResponse.getData();
    expect(allNotes?.length).toBeGreaterThanOrEqual(notesToCreate.length);

    // Step 6: Update a note
    const firstNoteId = createdNoteIds[0];
    const updateResponse = await notesService.updateNoteStatus(firstNoteId, true, token);
    expectSuccess(updateResponse, true);

    const updatedNote = updateResponse.getData();
    expect(updatedNote?.completed).toBe(true);

    // Step 7: Delete a note
    const noteToDelete = createdNoteIds[1];
    const deleteResponse = await notesService.deleteNote(noteToDelete, token);
    expectSuccess(deleteResponse, true);

    // Verify note is deleted
    const getDeletedResponse = await notesService.getNoteById(noteToDelete, token);
    expectSuccess(getDeletedResponse, false);

    // Step 8: Logout
    const logoutResponse = await usersService.logout(token);
    expectSuccess(logoutResponse, true);

    // Step 9: Verify token is invalidated (cannot get profile)
    const invalidateProfileResponse = await usersService.getProfile(token);
    expectSuccess(invalidateProfileResponse, false);
  });

  test('should handle profile update workflow', async () => {
    const usersService = getUsersService();

    // Create test user
    const newUser = TestDataFactory.generateUser();
    const registerResponse = await usersService.register(
      newUser.name,
      newUser.email,
      newUser.password!
    );

    const loginResponse = await usersService.login(newUser.email, newUser.password!);
    const token = loginResponse.getData()!.token;

    // Get initial profile
    const initialProfile = await usersService.getProfile(token);
    expect(initialProfile.getData()?.name).toBe(newUser.name);

    // Update profile
    const updatedData = {
      name: 'Updated User Name',
      phone: '1234567890',
      company: 'Updated Company Ltd',
    };

    const updateResponse = await usersService.updateProfile(updatedData, token);
    expectSuccess(updateResponse, true);

    const updated = updateResponse.getData();
    expect(updated?.name).toBe(updatedData.name);
    expect(updated?.phone).toBe(updatedData.phone);
    expect(updated?.company).toBe(updatedData.company);

    // Verify update persisted
    const verifyResponse = await usersService.getProfile(token);
    const verified = verifyResponse.getData();
    expect(verified?.name).toBe(updatedData.name);
  });
});

// ============================================================================
// WORKFLOW: Concurrent Note Operations
// ============================================================================

test.describe('Concurrent Operations', () => {
  test('should handle concurrent note creation', async () => {
    const usersService = getUsersService();
    const notesService = getNotesService();

    // Login
    const loginResponse = await usersService.login(
      'practice@expandtesting.com',
      'practice123'
    );
    const token = loginResponse.getData()!.token;

    // Create notes concurrently
    const notePromises = Array(5)
      .fill(null)
      .map(() => {
        const note = TestDataFactory.generateNote();
        return notesService.createNote(note, token);
      });

    const responses = await Promise.all(notePromises);

    // Verify all requests succeeded
    responses.forEach((response) => {
      expectSuccess(response, true);
      expectDataExists(response);
    });

    const createdIds = responses.map((r) => r.getData()!.id);

    // Verify all notes exist
    for (const noteId of createdIds) {
      const getResponse = await notesService.getNoteById(noteId, token);
      expectSuccess(getResponse, true);
    }

    // Cleanup
    for (const noteId of createdIds) {
      await notesService.deleteNote(noteId, token);
    }
  });

  test('should handle concurrent note updates', async () => {
    const usersService = getUsersService();
    const notesService = getNotesService();

    const loginResponse = await usersService.login(
      'practice@expandtesting.com',
      'practice123'
    );
    const token = loginResponse.getData()!.token;

    // Create a note
    const noteResponse = await notesService.createNote(
      TestDataFactory.generateNote(),
      token
    );
    const noteId = noteResponse.getData()!.id;

    // Update note concurrently (different operations)
    const updatePromises = [
      notesService.updateNoteStatus(noteId, true, token),
      notesService.updateNoteStatus(noteId, false, token),
      notesService.updateNoteStatus(noteId, true, token),
    ];

    const responses = await Promise.all(updatePromises);

    // All requests should succeed (last one wins)
    responses.forEach((response) => {
      expectSuccess(response, true);
    });

    // Cleanup
    await notesService.deleteNote(noteId, token);
  });
});

// ============================================================================
// WORKFLOW: Note Organization by Category
// ============================================================================

test.describe('Note Organization', () => {
  test('should organize notes by category and retrieve efficiently', async () => {
    const usersService = getUsersService();
    const notesService = getNotesService();

    const loginResponse = await usersService.login(
      'practice@expandtesting.com',
      'practice123'
    );
    const token = loginResponse.getData()!.token;

    const categories = ['Home', 'Work', 'Personal'] as const;
    const notesPerCategory = 3;
    const categoryNoteMap = new Map<string, string[]>();

    // Create notes in each category
    for (const category of categories) {
      const noteIds: string[] = [];
      const notesToCreate = TestDataFactory.generateNotes(notesPerCategory, category);

      for (const note of notesToCreate) {
        const response = await notesService.createNote(note, token);
        expectSuccess(response, true);
        noteIds.push(response.getData()!.id);
      }

      categoryNoteMap.set(category, noteIds);
    }

    // Retrieve all notes and organize by category
    const allNotesResponse = await notesService.getAllNotes(token);
    const allNotes = allNotesResponse.getData();

    expect(allNotes).toBeTruthy();
    expect(allNotes!.length).toBeGreaterThanOrEqual(notesPerCategory * categories.length);

    // Verify categorization
    for (const category of categories) {
      const categoryNotes = allNotes!.filter((n) => n.category === category);
      expect(categoryNotes.length).toBeGreaterThanOrEqual(notesPerCategory);
    }

    // Mark some as completed
    const homeNotes = categoryNoteMap.get('Home') || [];
    for (const noteId of homeNotes.slice(0, 2)) {
      await notesService.updateNoteStatus(noteId, true, token);
    }

    // Verify completion status
    const homeAllResponse = await notesService.getAllNotes(token);
    const homeCategory = homeAllResponse.getData()?.filter((n) => n.category === 'Home');
    const completedHome = homeCategory?.filter((n) => n.completed);
    expect((completedHome?.length || 0) >= 2).toBe(true);

    // Cleanup
    for (const categoryNotes of categoryNoteMap.values()) {
      for (const noteId of categoryNotes) {
        try {
          await notesService.deleteNote(noteId, token);
        } catch {
          // Ignore cleanup errors
        }
      }
    }
  });
});

// ============================================================================
// WORKFLOW: Data Validation Throughout Workflow
// ============================================================================

test.describe('Data Validation Workflow', () => {
  test('should validate data integrity throughout workflow', async () => {
    const usersService = getUsersService();
    const newUser = TestDataFactory.generateUser();

    // Validate email format before registration
    DataValidations.assertEmailValid(newUser.email);

    // Validate password strength before registration
    DataValidations.assertPasswordStrong(newUser.password!);

    // Register
    const registerResponse = await usersService.register(
      newUser.name,
      newUser.email,
      newUser.password!
    );

    // Validate response data
    ApiAssertions.assertSuccessfulResponse(registerResponse, 201);
    ApiAssertions.assertDataHasProperty(registerResponse, 'data.id');
    ApiAssertions.assertDataPropertyEquals(registerResponse, 'data.email', newUser.email);

    // Login and validate token
    const loginResponse = await usersService.login(newUser.email, newUser.password!);
    ApiAssertions.assertSuccessfulResponse(loginResponse, 200);
    ApiAssertions.assertDataHasProperty(loginResponse, 'data.token');

    const token = loginResponse.getData()!.token;
    expect(token.length).toBeGreaterThan(0);
  });
});
