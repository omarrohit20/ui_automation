import { Page, Locator } from '@playwright/test';

export class ParabankLoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly logoutLink: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('input[value="Log In"]');
    this.logoutLink = page.getByRole('link', { name: 'Log Out' });
    this.errorMessage = page.locator('#rightPanel .error, #rightPanel .message');
  }

  async goto() {
    await this.page.goto('https://parabank.parasoft.com/parabank/index.htm');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      await this.page.getByText('Accounts Overview').waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      // Fallback: check for logout link
      return await this.logoutLink.isVisible().catch(() => false);
    }
  }

  async getErrorText(): Promise<string> {
    try {
      await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    } catch {
      // if it doesn't become visible, still try to read any content
    }
    return (await this.errorMessage.textContent())?.trim() || '';
  }
}

export default ParabankLoginPage;
