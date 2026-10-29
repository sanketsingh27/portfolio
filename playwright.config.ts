import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  use: { baseURL: "http://127.0.0.1:3000", trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "node e2e/provider.mjs",
      url: "http://127.0.0.1:4319/health",
      reuseExistingServer: false,
    },
    {
      command: "npm run dev -- --hostname 127.0.0.1",
      url: "http://127.0.0.1:3000",
      reuseExistingServer: false,
      timeout: 120000,
      env: {
        PLAYWRIGHT_TEST: "true",
        CONTENT_TEST_DIR: "e2e/fixtures",
        AI_ENABLED: "true",
        AI_SPEND_LIMIT_CONFIGURED: "true",
        AI_ABUSE_PROTECTION_CONFIGURED: "true",
        AI_BASE_URL: "http://127.0.0.1:4319/v1",
        AI_API_KEY: "local-fixture",
        AI_MODEL: "fixture",
      },
    },
  ],
});
