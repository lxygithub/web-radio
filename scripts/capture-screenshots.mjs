// Capture screenshots for README
// Run: npx playwright test --config=scripts/screenshot.config.ts
// Or: node scripts/capture-screenshots.mjs

import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE_URL = 'http://localhost:8080';
const OUT_DIR = 'screenshots';

mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch({ headless: true });

async function capture(name, url, viewport, action) {
  const page = await browser.newPage({ viewport });
  await page.goto(url, { waitUntil: 'networkidle' });
  if (action) await action(page);
  await page.screenshot({ path: `${OUT_DIR}/${name}.png`, fullPage: false });
  console.log(`  ✓ ${name}.png (${viewport.width}x${viewport.height})`);
  await page.close();
}

// 1. Home page - dark mode (default)
await capture('home-dark', BASE_URL, { width: 1280, height: 800 }, async (page) => {
  await page.waitForTimeout(1000);
});

// 2. Home page - light mode
await capture('home-light', BASE_URL, { width: 1280, height: 800 }, async (page) => {
  // Click theme toggle in sidebar
  await page.click('button[title*="theme"], button svg.lucide-sun, button svg.lucide-moon');
  await page.waitForTimeout(500);
});

// 3. Mobile view
await capture('mobile', BASE_URL, { width: 375, height: 812 }, async (page) => {
  await page.waitForTimeout(1000);
});

// 4. Player close-up
await capture('player', BASE_URL, { width: 1280, height: 800 }, async (page) => {
  // Click first station card to start playing
  await page.click('.group');
  await page.waitForTimeout(2000);
  // Crop would be full page, showing player at bottom
});

// 5. Station detail
await capture('detail', BASE_URL, { width: 1280, height: 800 }, async (page) => {
  // Click first station to open detail
  await page.click('.group');
  await page.waitForTimeout(500);
  // Click again or hover for detail panel
  const cards = page.locator('button.group');
  await cards.first().click();
  await page.waitForTimeout(1000);
});

// 6. Search page
await capture('search', `${BASE_URL}/search`, { width: 1280, height: 800 }, async (page) => {
  await page.fill('input[type="search"], input[placeholder*="earch"]', 'music');
  await page.waitForTimeout(1500);
});

await browser.close();
console.log('\nAll screenshots saved to screenshots/');
