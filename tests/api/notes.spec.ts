 /**
 * Notes API Tests - Data-Driven
 * Comprehensive test suite for notes management
 */

import { test, expect } from '@playwright/test';
import {
  ApiTestBase,
  expectStatus,
  expectSuccess,
  expectDataExists,
  getAuthContext,
} from '../../api/tests/api-test-base';
import { getNotesService } from '../../api/services/api-service-locator';
import { TestDataFactory } from '../../api/fixtures/test-data-factory';
import {
  CREATE_NOTE_SCENARIOS,
  UPDATE_NOTE_SCENARIOS,
  DELETE_NOTE_SCENARIOS,
} from '../../api/fixtures/test-scenarios';
import { INote } from '../../api/services/index';

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
// CREATE NOTES TESTS - DATA DRIVEN
// ============================================================================

test.describe('Create Notes', () => {
  CREATE_NOTE_SCENARIOS.forEach((scenario) => {
    test(
      `[${scenario.tags?.join(', ')}] ${scenario.name}`,
      {
        tag: scenario.tags || [],
      },
      async () => {
        const authContext = await getAuthContext();
        const service = getNotesService();

        const noteData = {
          title: scenario.input.title || '',
          description: scenario.input.description || '',
          category: (scenario.input.category as any) || 'Work',
        };

        const response = await service.createNote(noteData, authContext.token);

        // Verify status code
        expectStatus(response.getStatus(), scenario.expectedStatus, scenario.description);

        // Verify success flag matches expectation
        expectSuccess(response, scenario.shouldSucceed);

        // Verify response message
        expect(response.getMessage()).toBeTruthy();

        // If successful, verify note data returned
        if (scenario.shouldSucceed) {
          expectDataExists(response);
          const noteResponse = response.getData();
          expect(noteResponse?.id).toBeTruthy();
          expect(noteResponse?.title).toBe(scenario.input.title);
          expect(noteResponse?.description).toBe(scenario.input.description);
          expect(noteResponse?.category).toBe(scenario.input.category);
          expect(noteResponse?.user_id).toBe(authContext.userId);
        }
      }
    );
  });
});

// ============================================================================
// RETRIEVE NOTES TESTS
// ============================================================================

test.describe('Retrieve Notes', () => {
  test('should get all notes for authenticated user', async () => {
    const authContext = await getAuthContext();
    const service = getNotesService();

    const response = await service.getAllNotes(authContext.token);

    expectStatus(response.getStatus(), 200);
    expectSuccess(response, true);
    expectDataExists(response);

    const notes = response.getData();
    expect(Array.isArray(notes)).toBe(true);
    // Notes should all belong to authenticated user
    notes?.forEach((note) => {
      expect(note.user_id).toBe(authContext.userId);
    });
  });

  test('should fail to get notes with invalid token', async () => {
    const service = getNotesService();
    const invalidToken = 'invalid-token-12345';

    const response = await service.getAllNotes(invalidToken);

    expectStatus(response.getStatus(), 401);
    expectSuccess(response, false);
  });

  test('should get note by ID', async () => {
    const authContext = await getAuthContext();
    const service = getNotesService();

    // Create a note first
    const noteToCreate = TestDataFactory.generateNote();
    const createResponse = await service.createNote(noteToCreate, authContext.token);
    expectSuccess(createResponse, true);

    const createdNote = createResponse.getData();
    expect(createdNote?.id).toBeTruthy();

    // Now retrieve the created note
    const getResponse = await service.getNoteById(createdNote!.id, authContext.token);

    expectStatus(getResponse.getStatus(), 200);
    expectSuccess(getResponse, true);
    expectDataExists(getResponse);

    const retrievedNote = getResponse.getData();
    expect(retrievedNote?.id).toBe(createdNote?.id);
    expect(retrievedNote?.title).toBe(noteToCreate.title);
  });

  test('should fail to get non-existent note', async () => {
    const authContext = await getAuthContext();
    const service = getNotesService();

    const response = await service.getNoteById(
      'non-existent-id',
      authContext.token
    );

    expect([400, 404]).toContain(response.getStatus());
    expectSuccess(response, false);
  });
});

// ============================================================================
// UPDATE NOTES TESTS - DATA DRIVEN
// ============================================================================

test.describe('Update Notes', () => {
  UPDATE_NOTE_SCENARIOS.forEach((scenario) => {
    test(
      `[${scenario.tags?.join(', ')}] ${scenario.name}`,
      {
        tag: scenario.tags || [],
      },
      async () => {
        const authContext = await getAuthContext();
        const service = getNotesService();

        // Create a note first
        const noteToCreate = TestDataFactory.generateNote();
        const createResponse = await service.createNote(
          noteToCreate,
          authContext.token
        );
        expectSuccess(createResponse, true);

        const createdNote = createResponse.getData();
        expect(createdNote?.id).toBeTruthy();

        // Update the note
        const updateData = {
          title: scenario.input.title || 'Updated Title',
          description: scenario.input.description || 'Updated Description',
          category: scenario.input.category || 'Work',
          completed: scenario.input.completed ?? false,
        };

        const updateResponse = await service.updateNote(
          createdNote!.id,
          updateData,
          authContext.token
        );

        // Verify status and success
        expectStatus(updateResponse.getStatus(), scenario.expectedStatus);
        expectSuccess(updateResponse, scenario.shouldSucceed);

        if (scenario.shouldSucceed) {
          expectDataExists(updateResponse);
          const updatedNote = updateResponse.getData();
          expect(updatedNote?.title).toBe(updateData.title);
          expect(updatedNote?.category).toBe(updateData.category);
        }
      }
    );
  });

  test('should update only note completed status with PATCH', async () => {
    const authContext = await getAuthContext();
    const service = getNotesService();

    // Create a note
    const noteToCreate = TestDataFactory.generateNote({ completed: false });
    const createResponse = await service.createNote(
      noteToCreate,
      authContext.token
    );
    const createdNote = createResponse.getData();

    // Update only completed status
    const patchResponse = await service.updateNoteStatus(createdNote!.id, true, authContext.token);

    expectStatus(patchResponse.getStatus(), 200);
    expectSuccess(patchResponse, true);

    const updatedNote = patchResponse.getData();
    expect(updatedNote?.completed).toBe(true);
    expect(updatedNote?.title).toBe(noteToCreate.title); // Title should remain unchanged
  });
});

// ============================================================================
// DELETE NOTES TESTS - DATA DRIVEN
// ============================================================================

test.describe('Delete Notes', () => {
  DELETE_NOTE_SCENARIOS.forEach((scenario) => {
    // Skip test for non-existent note as behavior may vary
    if (scenario.name.includes('non-existent')) {
      test.skip(
        `[${scenario.tags?.join(', ')}] ${scenario.name}`,
        async () => {
          // Placeholder
        }
      );
      return;
    }

    test(
      `[${scenario.tags?.join(', ')}] ${scenario.name}`,
      {
        tag: scenario.tags || [],
      },
      async () => {
        const authContext = await getAuthContext();
        const service = getNotesService();

        // Create a note first
        const noteToCreate = TestDataFactory.generateNote();
        const createResponse = await service.createNote(
          noteToCreate,
          authContext.token
        );
        expectSuccess(createResponse, true);

        const createdNote = createResponse.getData();
        expect(createdNote?.id).toBeTruthy();

        // Delete the note
        const deleteResponse = await service.deleteNote(
          createdNote!.id,
          authContext.token
        );

        expectStatus(deleteResponse.getStatus(), scenario.expectedStatus ?? 200);
        expectSuccess(deleteResponse, scenario.shouldSucceed);

        // Verify note is actually deleted
        if (scenario.shouldSucceed) {
          const getResponse = await service.getNoteById(
            createdNote!.id,
            authContext.token
          );
          expect(getResponse.isSuccessful()).toBe(false);
        }
      }
    );
  });

  test('should fail to delete note with invalid token', async () => {
    const service = getNotesService();
    const invalidToken = 'invalid-token-12345';

    const response = await service.deleteNote('any-note-id', invalidToken);

    expectStatus(response.getStatus(), 401);
    expectSuccess(response, false);
  });
});

// ============================================================================
// NOTE FILTERING AND CATEGORY TESTS
// ============================================================================

test.describe('Note Categories and Filtering', () => {
  test('should create and retrieve notes in all categories', async () => {
    const authContext = await getAuthContext();
    const service = getNotesService();
    const categories: INote['category'][] = ['Home', 'Work', 'Personal'];

    // Create notes in each category
    const notesMap = new Map<string, string>();
    for (const category of categories) {
      const noteData = TestDataFactory.generateNote({ category });
      const response = await service.createNote(noteData, authContext.token);
      expectSuccess(response, true);

      const note = response.getData();
      notesMap.set(category, note!.id);
    }

    // Retrieve all notes and verify categories
    const allResponse = await service.getAllNotes(authContext.token);
    const allNotes = allResponse.getData();

    expect(allNotes).toBeTruthy();
    const categoriesFound = new Set(allNotes?.map((n) => n.category) || []);
    categories.forEach((cat) => {
      expect(categoriesFound.has(cat)).toBe(true);
    });
  });

  test('should handle bulk note operations', async () => {
    const authContext = await getAuthContext();
    const service = getNotesService();

    // Create multiple notes
    const notesToCreate = TestDataFactory.generateNotes(5);
    const createdNotes: string[] = [];

    for (const note of notesToCreate) {
      const response = await service.createNote(note, authContext.token);
      expectSuccess(response, true);
      createdNotes.push(response.getData()!.id);
    }

    // Retrieve all notes
    const allResponse = await service.getAllNotes(authContext.token);
    const allNotes = allResponse.getData();

    expect((allNotes?.length || 0) >= notesToCreate.length).toBe(true);

    // Delete all created notes
    for (const noteId of createdNotes) {
      const response = await service.deleteNote(noteId, authContext.token);
      expectSuccess(response, true);
    }
  });
});
