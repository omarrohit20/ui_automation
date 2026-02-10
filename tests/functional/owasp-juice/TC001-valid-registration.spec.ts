// spec: specs/juice-shop-comprehensive.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('User Authentication and Account Management', () => {
  test('TC001 - User Registration with Valid Data', async ({ page }) => {
    // 1. Navigate to the homepage
    await page.goto('https://juice-shop.herokuapp.com/#/');

    // Dismiss cookie consent if present
    try {
      await page.getByRole('button', { name: 'dismiss cookie message' }).click();
    } catch (error) {
      // Cookie banner might not be present
    }

    // Dismiss welcome banner if present
    try {
      await page.getByRole('button', { name: 'Close Welcome Banner' }).click();
    } catch (error) {
      // Welcome banner might not be present
    }

    // Verify homepage loads successfully
    await expect(page).toHaveTitle('OWASP Juice Shop');
    await expect(page.getByText('All Products')).toBeVisible();

    // 2. Click on the Account menu
    await page.getByRole('button', { name: 'Show/hide account menu' }).click();

    // Verify account menu dropdown appears
    await expect(page.getByRole('menu')).toBeVisible();

    // 3. Click on 'Login'
    await page.getByRole('menuitem', { name: 'Go to login page' }).click();

    // Verify login page displays with login form
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Text field for the login email' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Text field for the login password' })).toBeVisible();

    // 4. Click on 'Not yet a customer?' to go to registration page
    await page.getByRole('link', { name: 'Not yet a customer?' }).click();

    // Verify registration page displays with all required fields
    await expect(page.getByRole('heading', { name: 'User Registration' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Email address field' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Field for the password' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Field to confirm the password' })).toBeVisible();
    await expect(page.getByRole('combobox', { name: 'Selection list for the security question' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Field for the answer to the security question' })).toBeVisible();

    // 5. Enter a valid email address in the Email field
    const testEmail = `testuser${Date.now()}@example.com`;
    await page.getByRole('textbox', { name: 'Email address field' }).fill(testEmail);

    // Verify email field accepts valid email format
    const emailField = page.getByRole('textbox', { name: 'Email address field' });
    await expect(emailField).toHaveValue(testEmail);

    // 6. Enter a valid password (5-40 characters) in the Password field
    const testPassword = 'TestPass123!';
    await page.getByRole('textbox', { name: 'Field for the password' }).fill(testPassword);

    // Verify password field accepts text and shows character count
    await expect(page.getByRole('textbox', { name: 'Field for the password' })).toHaveValue(testPassword);
    await expect(page.locator('text=12/20')).toBeVisible(); // Character count indicator

    // 7. Re-enter the same password in the Repeat Password field
    await page.getByRole('textbox', { name: 'Field to confirm the password' }).fill(testPassword);

    // Verify repeat password field accepts matching password
    await expect(page.getByRole('textbox', { name: 'Field to confirm the password' })).toHaveValue(testPassword);
    await expect(page.locator('text=12/40')).toBeVisible(); // Character count indicator

    // 8. Click on the Security Question dropdown and select a question
    await page.getByRole('combobox', { name: 'Selection list for the security question' }).click();
    await page.getByRole('option', { name: 'Your favorite movie?' }).click();

    // 9. Enter an answer to the security question
    const securityAnswer = 'The Matrix';
    await page.getByRole('textbox', { name: 'Field for the answer to the security question' }).fill(securityAnswer);

    // Verify answer field accepts text input
    await expect(page.getByRole('textbox', { name: 'Field for the answer to the security question' })).toHaveValue(securityAnswer);

    // 10. Click the Register button
    await page.getByRole('button', { name: 'Button to complete the registration' }).click();

    // Verify registration completes successfully and user is redirected
    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByText('Registration completed successfully')).toBeVisible();
    
    // Additional verification: Check we're on login page after successful registration
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });
});