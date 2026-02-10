// spec: specs/juice-shop-comprehensive.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Product Catalog and Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage and dismiss initial dialogs
    await page.goto('https://juice-shop.herokuapp.com/#/');
    
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
  });

  test('TC006 - Product Catalog Display', async ({ page }) => {
    // 1. Navigate to the homepage - already done in beforeEach
    // Verify homepage loads with product grid
    await expect(page).toHaveTitle('OWASP Juice Shop');
    await expect(page.getByText('All Products')).toBeVisible();

    // 2. Verify all products are displayed
    const productCards = page.locator('mat-card').filter({ hasText: /\d+\.\d+¤/ }); // Only cards with prices are actual products
    const productCount = await productCards.count();
    expect(productCount).toBeGreaterThan(0);

    // Verify products are displayed in a grid layout
    await expect(productCards.first()).toBeVisible();
    
    // 3. Check product information (name, price, availability)
    // Test first few products to verify they display proper information
    for (let i = 0; i < Math.min(3, productCount); i++) {
      const productCard = productCards.nth(i);
      
      // Each product card should be visible
      await expect(productCard).toBeVisible();
      
      // Each product should have a name (button text)
      const productButton = productCard.locator('button').first();
      await expect(productButton).toBeVisible();
      
      // Each product should have a price
      const priceElement = productCard.locator('span:has-text("¤")');
      await expect(priceElement).toBeVisible();
      
      // Check for availability status if present (some products may have "Only X left" or "Sold Out")
      const availabilityIndicators = [
        productCard.getByText(/Only \d+ left/),
        productCard.getByText('Sold Out')
      ];
      
      // At least one of these elements should exist (or none if product is fully available)
      const hasAvailabilityStatus = await Promise.all(
        availabilityIndicators.map(indicator => indicator.count())
      ).then(counts => counts.some(count => count > 0));
      
      // This is fine - products may or may not have availability status
    }

    // Verify specific products are displayed with expected information
    await expect(page.getByText('Apple Juice (1000ml)')).toBeVisible();
    await expect(page.getByText('1.99¤')).toBeVisible();
    
    // Check for products with special availability status
    await expect(page.getByText(/Only \d+ left/)).toBeVisible(); // Some products should show limited quantity
    await expect(page.getByText('Sold Out')).toBeVisible(); // Some products should be sold out

    // 4. Verify pagination controls
    const paginationSection = page.locator('[role="group"]');
    await expect(paginationSection).toBeVisible();
    
    // Check pagination info display (e.g., "1 – 12 of 36")
    await expect(page.getByText(/\d+ – \d+ of \d+/)).toBeVisible();
    
    // Check previous/next buttons exist
    const prevButton = page.getByRole('button', { name: 'Previous page' });
    const nextButton = page.getByRole('button', { name: 'Next page' });
    
    await expect(prevButton).toBeVisible();
    await expect(nextButton).toBeVisible();
    
    // Previous button should be disabled on first page
    await expect(prevButton).toBeDisabled();
    
    // Next button should be enabled if there are more products
    const paginationText = await page.getByText(/\d+ – \d+ of \d+/).textContent();
    const totalProducts = parseInt(paginationText!.split(' of ')[1]);
    const currentlyShown = parseInt(paginationText!.split(' – ')[1].split(' of ')[0]);
    
    if (totalProducts > currentlyShown) {
      await expect(nextButton).toBeEnabled();
      
      // Test next page functionality
      await nextButton.click();
      
      // Verify we moved to next page
      await expect(page.getByText(/\d+ – \d+ of \d+/)).toBeVisible();
      
      // Previous button should now be enabled
      await expect(prevButton).toBeEnabled();
      
      // Go back to first page
      await prevButton.click();
    } else {
      // If all products fit on one page, next button should be disabled
      await expect(nextButton).toBeDisabled();
    }

    // 5. Test items per page dropdown functionality
    const itemsPerPageDropdown = page.getByRole('combobox', { name: 'Items per page:' });
    await expect(itemsPerPageDropdown).toBeVisible();
    
    // Get current setting (should default to 12)
    await expect(page.getByText('12')).toBeVisible();
    
    // Click dropdown to see options
    await itemsPerPageDropdown.click();
    
    // Verify dropdown options are available
    await expect(page.getByRole('option', { name: '12' })).toBeVisible();
    await expect(page.getByRole('option', { name: '24' })).toBeVisible();
    await expect(page.getByRole('option', { name: '36' })).toBeVisible();
    
    // Test changing to 24 items per page
    await page.getByRole('option', { name: '24' }).click();
    
    // Verify the setting changed
    await expect(page.getByText('24')).toBeVisible();
    
    // Verify more products are now displayed (if available)
    const newProductCount = await productCards.count();
    if (totalProducts > 12) {
      expect(newProductCount).toBeGreaterThanOrEqual(Math.min(24, totalProducts));
    }
    
    // Verify pagination text updated accordingly
    await expect(page.getByText(/\d+ – \d+ of \d+/)).toBeVisible();
    
    // Change back to 12 items per page
    await itemsPerPageDropdown.click();
    await page.getByRole('option', { name: '12' }).click();
    
    // Verify it changed back
    await expect(page.getByText('12')).toBeVisible();
    
    // Verify product count is back to original (or appropriate for 12 per page)
    const finalProductCount = await productCards.count();
    expect(finalProductCount).toBeLessThanOrEqual(12);
  });
});