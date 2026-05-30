import { defineConfig, devices } from "@playwright/test";

/**
 * E2E proti Qwik demo v `demo/`. Viz UI_TEST.md.
 * baseURL + cesty z e2e/support/demo-routes.ts (výchozí route /qui-demo, uilib base).
 */
const DEMO_DEV_PORT = 5173;
const baseURL = `http://127.0.0.1:${DEMO_DEV_PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : [["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npm run dev -- --port ${DEMO_DEV_PORT} --strictPort --host 127.0.0.1`,
    cwd: "demo",
    url: `${baseURL}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
