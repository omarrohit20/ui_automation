import { Page, Locator, expect } from '@playwright/test';
import config from '../data/config.json';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly nextButton: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByRole('textbox', { name: 'Email' });
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.submitButton = page.getByRole('button', { name: 'Sign In' });
  }

  async goto() {
    await this.page.goto(config.baseUrl);
  }

  async login() {
    await this.usernameInput.fill(config.credentials.username);
    await this.nextButton.click();
    await this.passwordInput.fill(config.credentials.password);
    await this.submitButton.click();
    await expect(this.page.getByRole('link', { name: 'PitneyShip' })).toBeVisible();
  }

  async navigateToHomePage() {
    await this.page.getByRole('button', { name: 'Create Shipping Labels' }).click();
  }
}
