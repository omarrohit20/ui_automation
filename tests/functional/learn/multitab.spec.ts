import { test, expect, chromium} from '@playwright/test';
https://www.checklyhq.com/docs/learn/playwright/

test.skip('has title', async ({ browser }) => {
    const context = await browser.newContext();
    const page1 = await context.newPage();
    await page1.goto('https://example.com');
    
    const page2 = await context.newPage();
    await page2.goto('https://playwright.dev');
    console.log(await page1.title());
    console.log(await page2.title());
    await browser.close(); 

    const [newPage] = await Promise.all(
        [ 
            context.waitForEvent('page'), 
            page1.click('text=Open new window') 
        ]); 
    await newPage.waitForLoadState(); 
    console.log(await newPage.title());

    await page1.bringToFront();
    await page1.click('text=Login');
    await page2.bringToFront();
    await page2.fill('#search', 'Playwright Testing');

});


test('block image requests', async ({ page }) => {
  // Block image requests
  await page.route('**/*', route => {
    if (route.request().resourceType() === 'image') {
      route.abort();
    } else {
      route.continue();
    }
  });

  await page.goto('https://danube-web.shop/');
});


test('intercept and modify response', async ({ page }) => {
  // Intercept API calls and return custom data
  await page.route('**/api/best-sellers', route => {
    const customResponse = {
      books: [
        {
          title: 'Custom Book Title',
          author: 'Custom Author',
          genre: 'Custom Genre',
          price: '$19.99',
          rating: '4.5 stars'
        }
      ]
    };

    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(customResponse)
    });
  });

  await page.goto('https://danube-web.shop/');
});


