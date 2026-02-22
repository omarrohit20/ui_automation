/**
 * Test Data Factory
 * Generates consistent test data across test suites
 */

import { IUser, INote } from '../services/index';

export class TestDataFactory {
  private static idCounter = 0;

  /**
   * Generate valid user data for registration
   */
  static generateUser(overrides?: Partial<IUser>): IUser {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return {
      name: 'Test User',
      email: `testuser_${timestamp}_${random}@test.com`,
      password: 'SecurePassword@123',
      phone: '+1234567890',
      company: 'Test Company',
      ...overrides,
    };
  }

  /**
   * Generate valid note for creation
   */
  static generateNote(overrides?: Partial<INote>): INote {
    return {
      title: `Test Note ${++this.idCounter}`,
      description: `This is a test note description for testing purposes ${Date.now()}`,
      category: 'Work',
      completed: false,
      ...overrides,
    };
  }

  /**
   * Generate multiple notes for bulk testing
   */
  static generateNotes(count: number, category?: INote['category']): INote[] {
    const categories: INote['category'][] = ['Home', 'Work', 'Personal'];
    return Array.from({ length: count }, (_, i) => {
      return {
        title: `Test Note ${i + 1}`,
        description: `Description for note ${i + 1}`,
        category: category || categories[i % categories.length],
        completed: i % 2 === 0,
      };
    });
  }

  /**
   * Invalid user data for negative testing
   */
  static getInvalidUsers(): Array<Partial<IUser>> {
    return [
      { name: '', email: 'test@test.com', password: 'pass' }, // Empty name
      { name: 'Test User', email: 'invalid-email', password: 'pass' }, // Invalid email
      { name: 'Test User', email: 'test@test.com', password: '' }, // Empty password
      { name: 'Test User', email: 'test@test.com', password: 'short' }, // Short password
      { name: 'Test User', email: 'test@test.com' }, // Missing password
    ];
  }

  /**
   * Invalid note data for negative testing
   */
  static getInvalidNotes(): Array<Partial<INote>> {
    return [
      { title: '', description: 'Valid description', category: 'Work' }, // Empty title
      { title: 'Valid title', description: '', category: 'Work' }, // Empty description
      { title: 'Valid title', description: 'Valid description', category: 'Invalid' as any }, // Invalid category
      { title: 'Valid title', description: 'Valid description' }, // Missing category
    ];
  }

  /**
   * Reset internal counters (useful for test isolation)
   */
  static reset(): void {
    this.idCounter = 0;
  }
}
