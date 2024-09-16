import { test, expect } from '@playwright/test';
import { config } from '../config';

test('should render the overview page correclty', async ({ page }) => {
  await page.goto(config.PAGE_BASE_URL);
  await page.waitForLoadState('networkidle');
  expect(await page.getByTestId('METRIC_VALUE_status').innerText()).toBe('HEALTHY');
});

test('should redirect to /settings if the user is not authorized', async ({ page }) => {
  await page.route(`${config.API_URL}/health`, async (route) => {
    await route.fulfill({
      status: 401,
      json: {
        message: 'Unauthorized',
      },
    });
  });

  await page.goto(config.PAGE_BASE_URL);
  await page.waitForLoadState('networkidle');

  expect(page.url()).toBe(`${config.PAGE_BASE_URL}/settings`);
});
