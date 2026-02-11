import "dotenv/config";
import { test, chromium, Browser, BrowserContext, Page, expect } from "@playwright/test";
import { generateZAPReport, waitForZAP } from "../../../helpers/zap-helper";
import ZapClient from "zaproxy";

const proxyUrl = "http://127.0.0.1:8080";
const zapOptions = {
  apiKey: "6afgdusj4e1l5ote86npfn45jj",
  proxy: {
    host: "127.0.0.1",
    port: 8080,
  },
};

let zapClient: InstanceType<typeof ZapClient>;
let browser: Browser;
let context: BrowserContext;
let page: Page;

test.describe("juice-shop.herokuapp.com", () => {
  test.setTimeout(100_000); // 100 seconds

  test.beforeAll(async () => {
    await waitForZAP(); // Ensure ZAP is ready
    zapClient = new ZapClient(zapOptions);
  });

  test.beforeEach(async ({ page }) => {
    const browser = await chromium.launch({
      headless: true,
      proxy: { server: proxyUrl },
    });
    const context = await browser.newContext({ ignoreHTTPSErrors: true });
    page = await context.newPage();

    console.log("Running ZAP security test for ...");
  });

  test.afterEach(async ({ page }) => {
    await generateZAPReport(
      zapClient, // Pass the ZAP client instance
      "Home Page",
      "traditional-html-plus",
      "Home Page",
      "home"
    );
    console.log("ZAP security test completed.");
    await page.close();
  });

  test("login test", async ({ page }) => {
    await page.goto('https://demo.applitools.com/');

    // 2. Enter username "john" into the username field
    await page.getByRole('textbox', { name: 'Enter your username' }).fill('john');

    // 3. Enter password "Demo1234!" into the password field
    await page.getByRole('textbox', { name: 'Enter your password' }).fill('Demo1234!');

    // 4. Click the "Sign in" button to log in
    await page.getByRole('link', { name: 'Sign in' }).click();

    // 5. Verify successful login by checking for text like "Total Balance"
    await expect(page.getByText('Total Balance')).toBeVisible();

  });
});