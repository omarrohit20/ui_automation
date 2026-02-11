// spec: Applitools Demo tests - Logout
// seed: tests/functional/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Applitools Demo tests', () => {
  test('Logout', async ({ page }) => {
    // 1. Navigate to https://demo.applitools.com/
    await page.goto('https://demo.applitools.com/');

    // 2. Log in with username "john" and password "Demo1234!"
    await page.getByRole('textbox', { name: 'Enter your username' }).fill('john');
    await page.getByRole('textbox', { name: 'Enter your password' }).fill('Demo1234!');
    await page.getByRole('link', { name: 'Sign in' }).click();

    // 3. Open the user menu (click the user name)
    await page.getByText('Jack Gomez').click();

    // 4. Click "Log out" or the logout menu item
    await page.getByText(/log out|logout|sign out/i).click();

    // 5. Verify the login page is shown again
    await expect(page.getByRole('heading', { name: 'Login Form' })).toBeVisible();
  });
});
