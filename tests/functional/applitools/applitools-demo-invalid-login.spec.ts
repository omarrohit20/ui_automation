// spec: Applitools Demo tests - Invalid Login
// seed: tests/functional/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Applitools Demo tests', () => {
  test('Invalid Login (observed accepted)', async ({ page }) => {
    // 1. Navigate to https://demo.applitools.com/
    await page.goto('https://demo.applitools.com/');

    // 2. Enter username "wrong" into the username field
    await page.getByRole('textbox', { name: 'Enter your username' }).fill('wrong');

    // 3. Enter password "wrong" into the password field
    await page.getByRole('textbox', { name: 'Enter your password' }).fill('wrong');

    // 4. Click the "Sign in" button
    await page.getByRole('link', { name: 'Sign in' }).click();

    // 5. Verify the dashboard loads (the demo accepts these credentials)
    await expect(page.getByText('Total Balance')).toBeVisible();
  });
});
