// spec: specs/juice-shop-comprehensive.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('User Authentication and Account Management - Invalid Registration', () => {
  
  async function dismissInitialDialogs(page) {
    // Dismiss cookie consent if present
    try {
      await page.getByRole('button', { name: 'dismiss cookie message' }).click({ timeout: 3000 });
    } catch (error) {
      // Cookie banner might not be present
    }

    // Dismiss welcome banner if present
    try {
      await page.getByRole('button', { name: 'Close Welcome Banner' }).click({ timeout: 3000 });
    } catch (error) {
      // Welcome banner might not be present
    }
  }

  test.beforeEach(async ({ page }) => {
    // Navigate to the registration page
    await page.goto('https://juice-shop.herokuapp.com/#/register');
    await dismissInitialDialogs(page);
    
    // Verify registration page loads properly
    await expect(page.getByRole('heading', { name: 'User Registration' })).toBeVisible();
  });

  test('TC002a - Invalid Email Format', async ({ page }) => {
    // Attempt registration with invalid email format
    await page.getByRole('textbox', { name: 'Email address field' }).fill('invalid-email');
    await page.getByRole('textbox', { name: 'Field for the password' }).fill('ValidPass123');
    
    // Verify invalid email shows validation error
    await expect(page.getByText('Email address is not valid')).toBeVisible();
    
    // Register button should be disabled with invalid email
    await expect(page.getByRole('button', { name: 'Button to complete the registration' })).toBeDisabled();
  });

  test('TC002b - Password Too Short', async ({ page }) => {
    // Fill valid email and short password
    await page.getByRole('textbox', { name: 'Email address field' }).fill('test@example.com');
    await page.getByRole('textbox', { name: 'Field for the password' }).fill('123');
    
    // Verify short password validation (register button should be disabled)
    await expect(page.getByRole('button', { name: 'Button to complete the registration' })).toBeDisabled();
    
    // Check if password length indicator shows the issue
    await expect(page.getByText('3/20')).toBeVisible();
  });

  test('TC002c - Password Too Long', async ({ page }) => {
    // Fill valid email and attempt very long password
    await page.getByRole('textbox', { name: 'Email address field' }).fill('test@example.com');
    
    const longPassword = 'A'.repeat(50); // 50 characters
    const passwordField = page.getByRole('textbox', { name: 'Field for the password' });
    await passwordField.fill(longPassword);
    
    // The application accepts long passwords, so verify it accepts the input
    // The UI shows character count indicator (X/20 for display, but allows longer passwords)
    const passwordValue = await passwordField.inputValue();
    expect(passwordValue.length).toEqual(50); // Application allows long passwords
    
    // Check that character count indicator shows the actual length
    await expect(page.getByText('50/20')).toBeVisible();
  });

  test('TC002d - Mismatched Passwords', async ({ page }) => {
    // Fill valid data with mismatched passwords
    await page.getByRole('textbox', { name: 'Email address field' }).fill('test@example.com');
    await page.getByRole('textbox', { name: 'Field for the password' }).fill('ValidPass123');
    await page.getByRole('textbox', { name: 'Field to confirm the password' }).fill('DifferentPass456');
    
    // Fill security question and answer
    await page.getByRole('combobox', { name: 'Selection list for the security question' }).click();
    await page.getByRole('option', { name: 'Your favorite movie?' }).click();
    await page.getByRole('textbox', { name: 'Field for the answer to the security question' }).fill('Test Movie');
    
    // Verify mismatched passwords prevent registration (button should be disabled)
    await expect(page.getByRole('button', { name: 'Button to complete the registration' })).toBeDisabled();
  });

  test('TC002e - Missing Security Question', async ({ page }) => {
    // Fill all fields except security question
    await page.getByRole('textbox', { name: 'Email address field' }).fill('test@example.com');
    await page.getByRole('textbox', { name: 'Field for the password' }).fill('ValidPass123');
    await page.getByRole('textbox', { name: 'Field to confirm the password' }).fill('ValidPass123');
    await page.getByRole('textbox', { name: 'Field for the answer to the security question' }).fill('Test Answer');
    
    // Verify missing security question prevents submission
    await expect(page.getByRole('button', { name: 'Button to complete the registration' })).toBeDisabled();
  });

  test('TC002f - Empty Security Answer', async ({ page }) => {
    // Fill all fields with valid data
    await page.getByRole('textbox', { name: 'Email address field' }).fill('test@example.com');
    await page.getByRole('textbox', { name: 'Field for the password' }).fill('ValidPass123');
    await page.getByRole('textbox', { name: 'Field to confirm the password' }).fill('ValidPass123');
    
    // Select security question but leave answer empty
    await page.getByRole('combobox', { name: 'Selection list for the security question' }).click();
    await page.getByRole('option', { name: 'Your favorite movie?' }).click();
    await page.getByRole('textbox', { name: 'Field for the answer to the security question' }).fill('');
    
    // Verify empty answer field prevents submission
    await expect(page.getByRole('button', { name: 'Button to complete the registration' })).toBeDisabled();
  });
});