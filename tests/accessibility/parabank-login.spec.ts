import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import ParabankLoginPage from '../../pages/ParabankLoginPage';

test.describe('Parabank login', () => {

  test('login page accessibility checks (axe)', async ({ page }) => {
    const login = new ParabankLoginPage(page);
    await login.goto();

    const results = await new AxeBuilder({ page }).analyze();
    // Fail the test if there are any accessibility violations
    expect(results.violations).toEqual([]);
  });
});
