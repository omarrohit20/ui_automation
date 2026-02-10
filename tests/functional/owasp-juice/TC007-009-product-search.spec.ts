// spec: specs/juice-shop-comprehensive.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Product Catalog and Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage and dismiss initial dialogs
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
  });

  test('TC007 - Product Search with Valid Keywords', async ({ page }) => {
    // Verify homepage loads with product grid
    await expect(page).toHaveTitle('OWASP Juice Shop');
    await expect(page.getByText('All Products')).toBeVisible();

    // Click on the search field to activate it
    await page.getByLabel('Click to search').click();

    // Verify search field becomes active and accepts input
    const searchField = page.locator('input[type="text"]').first();
    await expect(searchField).toBeVisible();

    // Enter 'apple' as search term
    await searchField.fill('apple');

    // Press Enter to execute search
    await page.keyboard.press('Enter');

    // Verify search executes and shows results page
    await expect(page).toHaveURL(/.*search\?q=apple/);
    await expect(page.getByText('Search Results - apple')).toBeVisible();

    // Verify results show products matching 'apple' keyword
    await expect(page.getByText('Apple Juice')).toBeVisible();
    await expect(page.getByText('Apple Pomace')).toBeVisible();

    // Clear search and try different keywords like 'juice'
    await searchField.fill('juice');
    await page.keyboard.press('Enter');

    // Verify different search terms return appropriate results
    await expect(page).toHaveURL(/.*search\?q=juice/);
    await expect(page.getByText('Search Results - juice')).toBeVisible();
    
    // Should show multiple juice products
    const productCards = page.locator('mat-card');
    const productCount = await productCards.count();
    expect(productCount).toBeGreaterThan(1);
  });

  test('TC008 - Product Search with No Results', async ({ page }) => {
    // Click on the search field
    await page.getByLabel('Click to search').click();

    // Enter a search term that yields no results
    const searchField = page.locator('input[type="text"]').first();
    await searchField.fill('xyz123nonexistent');

    // Execute the search
    await page.keyboard.press('Enter');

    // Verify search term with no matches is entered and executed
    await expect(page).toHaveURL(/.*search\?q=xyz123nonexistent/);
    await expect(page.getByText('Search Results - xyz123nonexistent')).toBeVisible();

    // Verify appropriate 'no results' state
    // The application might show a placeholder card or message, so check for actual product cards
    const productCards = page.locator('mat-card').filter({ hasText: /\d+\.\d+¤/ }); // Only cards with prices are actual products
    const productCount = await productCards.count();
    expect(productCount).toBe(0);

    // Check for pagination showing 0 results
    await expect(page.getByText('0 of 0')).toBeVisible();
  });

  test('TC009 - Product Details View', async ({ page }) => {
    // Verify homepage displays product grid
    await expect(page.getByText('All Products')).toBeVisible();

    // Click on any product card (Apple Juice)
    const appleJuiceCard = page.getByRole('button', { name: 'Apple Juice (1000ml)' });
    await appleJuiceCard.click();

    // Verify product details dialog opens
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Check product image, name, description, and price are visible
    await expect(page.getByRole('heading', { name: 'Apple Juice (1000ml)' })).toBeVisible();
    await expect(dialog.getByText('1.99¤')).toBeVisible(); // Use dialog scope to avoid multiple matches
    await expect(page.getByText('The all-time classic')).toBeVisible();

    // Expand the reviews section
    const reviewsButton = page.getByRole('button', { name: /Reviews/ });
    await reviewsButton.click();

    // Verify reviews section shows customer reviews
    await expect(page.getByText('admin@juice-sh.op')).toBeVisible();
    await expect(page.getByText('One of my favorites!')).toBeVisible();

    // Close the product details dialog
    await page.getByRole('button', { name: 'Close Dialog' }).click();

    // Verify dialog closes properly
    await expect(dialog).not.toBeVisible();
  });
});