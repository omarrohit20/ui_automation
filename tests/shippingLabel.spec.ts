import { test } from '@playwright/test';
import dataset from '../data/tasks.json';
import { LoginPage } from '../pages/LoginPage';
import { ShippingPage } from '../pages/ShippingPage';

type TaskData = {
  id: string;
  app: string;
  task: string;
  tags: string[];
  name: string,
  company: string,
  addressLine1: string,
  addressLine2: string,
  zip: string,
  city: string,
  state: string,
  email: string,
  phone: string,
  package: string,
  length: string,
  width: string,
  height: string,
  weightlb: string,
  weightoz: string,
  service: string,
  splService: string
};

const tasks: TaskData[] = dataset as TaskData[];

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login();
  await loginPage.navigateToHomePage();
});

for (const t of tasks) {
  test(`${t.id} - Verify test "${t.task}" in ${t.app}`, async ({ page }) => {
    const shippingPage = new ShippingPage(page);
    await shippingPage.fillRecipientAddress(t.name, t.company, t.addressLine1, t.addressLine2, t.zip, t.city, t.state, t.email, t.phone);
    await shippingPage.selectPackage(t.package);
    await shippingPage.fillDimension(t.length, t.width, t.height, t.weightlb, t.weightoz);
    await shippingPage.selectServices(t.service);
    await shippingPage.LabelPrintAndVerify();
  });
}
