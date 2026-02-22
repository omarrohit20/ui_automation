/**
 * API Test Configuration
 * Overrides default Playwright config specifically for API tests
 */

import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: path.join(__dirname, 'tests/api'),
  testMatch: '**/*.spec.ts',

  // Global timeout settings
  timeout: 30000, // 30 seconds per test
  expect: {
    timeout: 5000,
  },

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 4,

  // Reporter settings
  reporter: [
    ['html', { outputFolder: 'api-test-results/html' }],
    ['json', { outputFile: 'api-test-results/results.json' }],
    ['junit', { outputFile: 'api-test-results/junit.xml' }],
    ['list'],
  ],

  // Configure projects for different environments
  projects: [
    {
      name: 'API Tests - Dev',
      use: {
        baseURL: process.env.DEV_BASE_URL || 'https://practice.expandtesting.com',
      },
    },
    {
      name: 'API Tests - QA',
      use: {
        baseURL: process.env.QA_BASE_URL || 'https://practice.expandtesting.com',
      },
    },
  ],

  // Web server configuration (if needed for local testing)
  webServer: undefined,

  // Output folder
  outputDir: 'api-test-results/output',
});
