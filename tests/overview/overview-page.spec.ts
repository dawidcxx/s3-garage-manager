import { test } from '@playwright/test';
import { config } from '../config';

test('should render the overview page correclty', async ({ page }) => {
  await page.route(`${config.API_URL}/health`, async (route) => {
    await route.fulfill({
      json: {
        status: 'healthy',
        knownNodes: 1,
        connectedNodes: 1,
        storageNodes: 1,
        storageNodesOk: 1,
        partitions: 256,
        partitionsQuorum: 256,
        partitionsAllOk: 256,
      },
    });
  });

  const g = await page.goto(`${config.PAGE_BASE_URL}/`);
  await page.waitForLoadState('networkidle', { timeout: 5000 });
  

});
