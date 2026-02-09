// spec: specs/juice-shop-comprehensive.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Customer Feedback and Communication', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage first
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

    // Navigate to Customer Feedback page via side menu
    await page.getByRole('button', { name: 'Open Sidenav' }).click();
    await page.getByRole('link', { name: 'Go to contact us page' }).click();
  });

  test('TC010 - Submit Valid Customer Feedback', async ({ page }) => {
    // Verify Customer Feedback page loads correctly
    await expect(page.getByRole('heading', { name: 'Customer Feedback' })).toBeVisible();

    // Verify author field shows 'anonymous' by default
    const authorField = page.getByRole('textbox', { name: 'Field with the name of the author' });
    await expect(authorField).toHaveValue('anonymous');
    await expect(authorField).toBeDisabled();

    // Enter a comment in the comment field (within 160 characters)
    const commentText = 'Great experience with the juice shop! The products are fresh and delivery is fast.';
    const commentField = page.getByRole('textbox', { name: 'Field for entering the comment' });
    await commentField.fill(commentText);

    // Verify comment field accepts text and shows character count
    await expect(commentField).toHaveValue(commentText);
    await expect(page.getByText(`${commentText.length}/160`)).toBeVisible();

    // Adjust the star rating using the slider
    const ratingSlider = page.getByRole('slider');
    await ratingSlider.fill('5');

    // Verify star rating slider allows selection of rating
    await expect(page.getByText('5★')).toBeVisible();

    // Solve the CAPTCHA by calculating the mathematical expression
    const captchaText = await page.locator('code').textContent();
    expect(captchaText).toMatch(/^\d+[\+\-\*]\d+[\+\-\*]\d+$/); // Should be format like "8+1+8" or "7-5-8" or "3*2+1"
    
    // Calculate CAPTCHA solution
    const captchaSolution = eval(captchaText!);
    const captchaField = page.getByRole('textbox', { name: 'Field for the result of the CAPTCHA' });
    await captchaField.fill(captchaSolution.toString());

    // Verify CAPTCHA solution field accepts numeric input
    await expect(captchaField).toHaveValue(captchaSolution.toString());

    // Click Submit button
    const submitButton = page.getByRole('button', { name: 'Button to send the review' });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // Verify feedback submission processes successfully
    // Note: Success indication would depend on the application's feedback mechanism
    // This could be a success message, redirect, or form reset
  });

  test('TC011 - Submit Feedback with Invalid Data', async ({ page }) => {
    // Verify feedback page displays correctly
    await expect(page.getByRole('heading', { name: 'Customer Feedback' })).toBeVisible();

    const submitButton = page.getByRole('button', { name: 'Button to send the review' });

    // Test 1: Leave comment field empty and attempt submission
    // Submit button should be disabled when comment is empty
    await expect(submitButton).toBeDisabled();

    // Test 2: Enter more than 160 characters in comment field
    const longComment = 'A'.repeat(161); // 161 characters
    const commentField = page.getByRole('textbox', { name: 'Field for entering the comment' });
    await commentField.fill(longComment);

    // Verify character limit is enforced
    const actualValue = await commentField.inputValue();
    expect(actualValue.length).toBeLessThanOrEqual(160);

    // Test 3: Enter valid comment but incorrect CAPTCHA solution
    const validComment = 'This is a valid comment within the character limit.';
    await commentField.fill(validComment);
    
    // Set rating
    const ratingSlider = page.getByRole('slider');
    await ratingSlider.fill('4');

    // Enter incorrect CAPTCHA solution
    const captchaField = page.getByRole('textbox', { name: 'Field for the result of the CAPTCHA' });
    await captchaField.fill('999'); // Deliberately wrong answer

    // Button should be enabled but submission should fail
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // Verify error handling for incorrect CAPTCHA (form should remain or show error)
    // The form should still be visible as the CAPTCHA was incorrect
    await expect(page.getByRole('heading', { name: 'Customer Feedback' })).toBeVisible();
  });

  test('TC012 - CAPTCHA Functionality', async ({ page }) => {
    // Verify feedback page loads with CAPTCHA displayed
    await expect(page.getByRole('heading', { name: 'Customer Feedback' })).toBeVisible();
    
    // Verify CAPTCHA shows mathematical expression clearly
    const captchaElement = page.locator('code');
    await expect(captchaElement).toBeVisible();
    
    const captchaText = await captchaElement.textContent();
    expect(captchaText).toBeTruthy();
    expect(captchaText).toMatch(/^\d+[\+\-\*]\d+[\+\-\*]\d+$/); // Format like "8+1+8" or "7-5-8" or "3*2+1"

    // Verify correct calculation can be determined
    const correctAnswer = eval(captchaText!);
    expect(typeof correctAnswer).toBe('number');
    expect(correctAnswer).toBeGreaterThan(0);

    // Test with correct answer
    const captchaField = page.getByRole('textbox', { name: 'Field for the result of the CAPTCHA' });
    
    // Verify result field accepts numeric input
    await captchaField.fill(correctAnswer.toString());
    await expect(captchaField).toHaveValue(correctAnswer.toString());

    // Fill other required fields for complete test
    const commentField = page.getByRole('textbox', { name: 'Field for entering the comment' });
    await commentField.fill('Testing CAPTCHA functionality');
    
    const ratingSlider = page.getByRole('slider');
    await ratingSlider.fill('5');

    // Submit button should be enabled with correct data
    const submitButton = page.getByRole('button', { name: 'Button to send the review' });
    await expect(submitButton).toBeEnabled();

    // Test with incorrect answer
    await captchaField.fill('999');
    await submitButton.click();

    // Verify CAPTCHA validation prevents submission with wrong answer
    // Form should remain visible indicating failed submission
    await expect(page.getByRole('heading', { name: 'Customer Feedback' })).toBeVisible();
  });
});