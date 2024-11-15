import { test as base, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.resolve(__dirname, './tests/data/data.json');
const jsonData = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

const test = base.extend({
  page: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      await page.goto(jsonData.link);
      await page.waitForLoadState('load');
    } catch (error) {
      console.log('Retrying due to network error:', error);
      await new Promise(resolve => setTimeout(resolve, 5000));
      await page.goto(jsonData.link);
      await page.waitForLoadState('load');
    }

    await page.getByRole('link', { name: 'Créez un compte' }).click();

    await use(page);

    await page.close();
  }
});

export { test, expect };
