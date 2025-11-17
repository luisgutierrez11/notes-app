import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: ['**/*.spec.js'],
  testIgnore: [
    '**/unit/**',
    '**/*.test.jsx',
    '**/*.test.js',
    '**/*.test.tsx',
  ],
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  workers: 1,
  retries: 1,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:5173', 
    headless: true,
    trace: 'on-first-retry',
  },

  webServer: [
    {
      command: 'npm --prefix ../notes-backend run start:test',
      port: 3001,                 // Ajustá si tu backend usa otro puerto
      reuseExistingServer: true,
      timeout: 20 * 1000,
    },
    {
      command: 'npm run dev',
      port: 5173,                 // Puerto típico de Vite
      reuseExistingServer: true,
      timeout: 30 * 1000,
    }
  ],

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
})