import { Page, Locator, expect } from '@playwright/test';
import config from '../data/config.json';
import dotenv from 'dotenv';
dotenv.config();

export class LoginPage {
  readonly page: Page;
  readonly env: string;
  readonly usernameInput: Locator;
  readonly nextButton: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.env = process.env.ENVIRONMENT || process.env.environment || process.env.test_env || 'stage';
    this.usernameInput = page.getByRole('textbox', { name: 'Email' });
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.submitButton = page.getByRole('button', { name: 'Sign In' });
  }

  async goto() {
    await this.page.goto(config[this.env].baseUrl);
  }

  async login() {
    await this.usernameInput.fill(config[this.env].username);
    await this.nextButton.click();
    await this.passwordInput.fill(config[this.env].password);
    await this.submitButton.click();
    // Wait for one of several reliable post-login elements that indicate the app is ready
    await Promise.any([
      this.page.getByRole('link', { name: 'PitneyShip' }).waitFor({ state: 'visible', timeout: 180000 }),
      this.page.getByRole('button', { name: 'Create Shipping Labels' }).waitFor({ state: 'visible', timeout: 180000 }),
      this.page.getByRole('button', { name: /B\s+\w+/ }).waitFor({ state: 'visible', timeout: 180000 })
    ]);
  }

  async navigateToHomePage() {
    await this.page.getByRole('button', { name: 'Shipping & Mailing' }).click();
    await this.page.getByRole('menuitem', { name: 'Create Shipping Label' }).click();
    // Ensure the Create Shipping Labels page has loaded and recipient inputs are ready
    await this.page.getByLabel('name').waitFor({ state: 'visible', timeout: 15000 });
  }
}
