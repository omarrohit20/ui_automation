// spec: Applitools Demo tests
// seed: tests/functional/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Applitools Demo tests', () => {
  test('Valid Login', async ({ page }) => {
    // 1. Navigate to https://demo.applitools.com/
    await page.goto('https://demo.applitools.com/');

    // 2. Enter username "john" into the username field
    await page.getByRole('textbox', { name: 'Enter your username' }).fill('john');

    // 3. Enter password "Demo1234!" into the password field
    await page.getByRole('textbox', { name: 'Enter your password' }).fill('Demo1234!');

    // 4. Click the "Sign in" button to log in
    await page.getByRole('link', { name: 'Sign in' }).click();

    // 5. Verify successful login by checking for text like "Total Balance"
    await expect(page.getByText('Total Balance')).toBeVisible();
  });
});
