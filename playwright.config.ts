import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,

  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: [
    {
      stdout: 'pipe',
      command: 'node ./tests/server/server.js',
      env: {
        PORT: '5002',
      },
    },
    {
      command: 'pnpm run build && pnpm run preview',
      env: {
        VITE_GARAGE_ADMIN_API_URL: 'http://localhost:5002',
      },
      url: 'http://localhost:5001',
      reuseExistingServer: !process.env.CI,
    },
  ],
});
