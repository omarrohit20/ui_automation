// spec: specs/sendpro360-create-shipping-labels.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ShippingPage } from '../pages/ShippingPage';

test.describe('Create Shipping Labels', () => {
  test('TC001 - Create & Print Shipping Label (Happy Path)', {
  annotation: {
    type: 'issue',
    description: 'JIRA-1234',
  },
}, async ({ page }) => {
    // 1. Navigate to Create Shipping Labels page.
    const login = new LoginPage(page);
    await login.goto();
    await login.login();
    await login.navigateToHomePage();

    // 2. Ensure 'Create New' shipping options are selected.
    await expect(page.getByRole('button', { name: 'Create New' })).toBeVisible();

    // 3. Under Recipient: enter Name 'John Doe', Country 'United States', Address Line 1 '1 Main St', ZIP '10001', City 'New York', State 'NY', Email 'john.doe@example.com', Phone '555-123-4567'.
    const ship = new ShippingPage(page);
    await ship.fillRecipientAddress(
      'John Doe',
      '',
      '1 Main St',
      '',
      '10001',
      'New York',
      'NY',
      'john.doe@example.com',
      '555-123-4567'
    );

    // 4. Under Packaging: select 'My Box' or 'Package', set Weight to 2 lbs and dimensions to 8x6x4.
    await ship.selectPackage('My Box');
    await ship.fillDimension('8', '6', '4', '2', '0');

    // 5. Click 'Select Rates and Services' and choose a suitable available service.
    await ship.selectServices();

    // 6. Click 'Print Label to PDF'.
    const result = await ship.LabelPrintAndVerify();

    // Verify the shipment appears in history/recents (quick check)
    await page.getByRole('link', { name: 'View All' }).click();
    await expect(page.getByText(/John Doe|1 Main St/i)).toBeVisible();
  });
});