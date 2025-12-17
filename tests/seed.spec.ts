import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login();
  await loginPage.navigateToHomePage();
});

test.describe('Test group', () => {
  test('seed', async ({ page }) => {
    // generate code here.
  });
});
