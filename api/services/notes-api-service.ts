/**
 * Notes API Service
 * Handles all Notes API endpoints from Expand Testing API
 */

import { BaseApiService } from './base-api-service';
import { HttpClient } from '../http-client';
import { ApiResponse } from '../models/api-response';

export interface INote {
  id?: string;
  title: string;
  description: string;
  category: 'Home' | 'Work' | 'Personal';
  completed?: boolean;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface INoteResponse extends INote {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export class NotesApiService extends BaseApiService {
  protected basePath = '/notes/api';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Create a new note
   */
  async createNote(
    note: INote,
    token: string
  ): Promise<ApiResponse<INoteResponse>> {
    const headers = this.getAuthHeaders(token);
    const formData = this.buildFormData(note);

    return this.handleResponse(
      this.httpClient.post<INoteResponse>(
        this.getEndpoint('/notes'),
        formData,
        headers
      ),
      'Create Note'
    );
  }

  /**
   * Get all notes for authenticated user
   */
  async getAllNotes(token: string): Promise<ApiResponse<INoteResponse[]>> {
    const headers = this.getAuthHeaders(token);

    return this.handleResponse(
      this.httpClient.get<INoteResponse[]>(
        this.getEndpoint('/notes'),
        headers
      ),
      'Get All Notes'
    );
  }

  /**
   * Get a note by ID
   */
  async getNoteById(
    noteId: string,
    token: string
  ): Promise<ApiResponse<INoteResponse>> {
    const headers = this.getAuthHeaders(token);

    return this.handleResponse(
      this.httpClient.get<INoteResponse>(
        this.getEndpoint(`/notes/${noteId}`),
        headers
      ),
      `Get Note by ID: ${noteId}`
    );
  }

  /**
   * Update an existing note
   */
  async updateNote(
    noteId: string,
    note: INote,
    token: string
  ): Promise<ApiResponse<INoteResponse>> {
    const headers = this.getAuthHeaders(token);
    const formData = this.buildFormData(note);

    return this.handleResponse(
      this.httpClient.put<INoteResponse>(
        this.getEndpoint(`/notes/${noteId}`),
        formData,
        headers
      ),
      `Update Note: ${noteId}`
    );
  }

  /**
   * Partially update note (completed status)
   */
  async updateNoteStatus(
    noteId: string,
    completed: boolean,
    token: string
  ): Promise<ApiResponse<INoteResponse>> {
    const headers = this.getAuthHeaders(token);
    const formData = this.buildFormData({ completed });

    return this.handleResponse(
      this.httpClient.patch<INoteResponse>(
        this.getEndpoint(`/notes/${noteId}`),
        formData,
        headers
      ),
      `Update Note Status: ${noteId}`
    );
  }

  /**
   * Delete a note
   */
  async deleteNote(noteId: string, token: string): Promise<ApiResponse<void>> {
    const headers = this.getAuthHeaders(token);

    return this.handleResponse(
      this.httpClient.delete<void>(
        this.getEndpoint(`/notes/${noteId}`),
        headers
      ),
      `Delete Note: ${noteId}`
    );
  }

  /**
   * Helper: Build auth headers with token
   */
  private getAuthHeaders(token: string): Record<string, string> {
    return {
      'x-auth-token': token,
    };
  }

  /**
   * Helper: Build form data (URL encoded format expected by API)
   */
  private buildFormData(data: any): Record<string, any> {
    // Playwright sends form data as-is, backend should handle it
    return data;
  }
}
