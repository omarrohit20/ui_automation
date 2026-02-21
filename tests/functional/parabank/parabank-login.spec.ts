import { test, expect } from '@playwright/test';
import ParabankLoginPage from '../../../pages/ParabankLoginPage';

test.describe('Parabank login', () => {
  test('valid credentials should login and show accounts overview', async ({ page }) => {
    const login = new ParabankLoginPage(page);
    await login.goto();
    // Known demo credentials for Parabank
    await login.login('john', 'demo');
    const loggedIn = await login.isLoggedIn();
    expect(loggedIn).toBeTruthy();
    // cleanup: log out if present
    const logout = page.getByRole('link', { name: 'Log Out' });
    if (await logout.isVisible().catch(() => false)) {
      await logout.click();
    }
  });

  test('invalid credentials should show error message', async ({ page }) => {
    const login = new ParabankLoginPage(page);
    await login.goto();
    await login.login('invalid-user', 'bad-pass');
    // Expect an error message in the right panel
    const err = await login.getErrorText();
    expect(err.length).toBeGreaterThan(0);
    expect(err).toMatch(/(username.*password|could not be verified|invalid|error|failed)/i);
  });
});
