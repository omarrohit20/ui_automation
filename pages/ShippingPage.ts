import { Page } from '@playwright/test';

export class ShippingPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async fillRecipientAddress(name: string, company: string, addressLine1: string, addressLine2: string, zip: string, city: string, state: string, email: string, phone: string) {
    await this.page.getByLabel('name').waitFor({ state: 'visible', timeout: 15000 });
    await this.page.getByLabel('name').fill(name);
    await this.page.getByLabel('company optional').fill(company);
    await this.page.getByLabel('addressLine1').fill(addressLine1);
    await this.page.getByRole('textbox', { name: 'ZIP Code' }).fill(zip);
    await this.page.getByRole('textbox', { name: 'City' }).fill(city);
    await this.page.locator('spa-state-selector').getByRole('combobox').click();
    await this.page.getByLabel('Options list').getByText(state).click();
    await this.page.getByRole('textbox', { name: 'Email', exact: true }).fill(email);
    await this.page.getByRole('textbox', { name: 'Phone' }).fill(phone);
    await this.page.getByRole('button', { name: ' Verify Address' }).click();
  }

  async selectCarrier(carrierName: string){
    await this.page.locator('#subCarrier > div').first().click();
    await this.page.getByRole('option', { name: carrierName }).click();
  }

  async selectPackage(packageName: string){
    await this.page.locator('.mb-3 > .ng-select-searchable > .ng-select-container > .ng-arrow-wrapper').click();
    await this.page.locator('.package-menu-item').first().click();
  }

  async fillDimension(length: string, width: string, height: string, weightlb: string, weightoz: string){
    await this.page.getByRole('spinbutton', { name: 'Length of package in inches' }).fill(length);
    await this.page.getByRole('spinbutton', { name: 'Width of package in inches' }).fill(width);
    await this.page.getByRole('spinbutton', { name: 'Height of package in inches' }).fill(height);
    await this.page.getByRole('spinbutton', { name: 'weight of package in pounds' }).fill(weightlb);
    await this.page.getByRole('spinbutton', { name: 'weight of package in ounces' }).fill(weightoz);
  }

  async selectServices(){
    await this.page.getByRole('button', { name: 'Select Rates and Services' }).click();
    await this.page.getByRole('row', { name: 'Carrier: CARRIER.USPS Priority Mail® more info Best value for any envelope or' }).getByLabel('', { exact: true }).check();
    await this.page.getByRole('button', { name: 'Choose Service' }).click();
  }

  async LabelPrintAndVerify(){
    await this.page.getByRole('button', { name: 'Print Label to PDF' }).click();
    const page1Promise = this.page.waitForEvent('popup');
    await this.page.getByRole('button', { name: 'Print', exact: true }).click();
  }

  async verifyAddress() {
    await this.page.getByRole('button', { name: 'Verify Address' }).click();
    // Wait for the Verify Address dialog or verification feedback to appear
    try {
      await this.page.getByRole('heading', { name: /Verify Recipient Address/i }).waitFor({ state: 'visible', timeout: 10000 });
    } catch {
      // Fallback to looking for common verification messages
      try {
        await Promise.any([
          this.page.getByText(/verified/i).waitFor({ state: 'visible', timeout: 8000 }),
          this.page.getByText(/suggested|did you mean|multiple matches|original address provided/i).waitFor({ state: 'visible', timeout: 8000 })
        ]);
      } catch {
        throw new Error('Address verification did not show expected feedback');
      }
    }
  }

  
}