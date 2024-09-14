import { test, expect } from '@playwright/test';

test('should render the /settings page correclty',  async ({ page }) => {
  await page.goto('http://localhost:4173/settings');
});
