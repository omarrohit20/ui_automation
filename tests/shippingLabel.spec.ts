import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ShippingPage } from '../pages/ShippingPage';
import dataset from '../data/tasks.json';

test.beforeEach(async ({ page }) => {
  //test.fixme('Settings page does not work in mobile yet');

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login();
  await loginPage.navigateToHomePage();
});

for (const t of dataset) {
  test(`${t.id} - Verify test "${t.task}" in ${t.app}`, async ({ page }) => {
    const shippingPage = new ShippingPage(page);
    await shippingPage.fillRecipientAddress(t.name, t.company, t.addressLine1, t.addressLine2, t.zip, t.city, t.state, t.email, t.phone);
    await shippingPage.selectCarrier(t.carrier);
    await shippingPage.selectPackage(t.package);
    await shippingPage.fillDimension(t.length, t.width, t.height, t.weightlb, t.weightoz);
    await shippingPage.selectServices();
    await shippingPage.LabelPrintAndVerify();
  });
}
