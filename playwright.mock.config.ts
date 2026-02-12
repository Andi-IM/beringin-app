import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests/e2e/integration',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  timeout: 60000,
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
    navigationTimeout: 60000,
    actionTimeout: 30000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev -- -p 3001',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    timeout: 180000,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: 'http://localhost:3001/api/mock/supabase',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'mock-anon-key',
    }
  },
});
