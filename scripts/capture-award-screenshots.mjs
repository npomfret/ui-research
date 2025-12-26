import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const outputDir = path.resolve('inspiration', 'screenshots');
fs.mkdirSync(outputDir, { recursive: true });

const targets = [
  {
    slug: 'cap-plastic-now',
    url: 'https://capplasticproduction.org',
    waitMs: 7000,
  },
  {
    slug: 'dvf',
    url: 'https://www.dvf.com',
    waitMs: 8000,
  },
  {
    slug: 'schumacher-house',
    url: 'https://www.awwwards.com/sites/schumacher-house',
    waitMs: 7000,
  },
  {
    slug: 'period-planet',
    url: 'https://winners.webbyawards.com/winners/2024/websites-and-mobile-sites/general-websites/health/period-planet',
    waitMs: 7000,
  },
  {
    slug: 'more-nutrition',
    url: 'https://www.awwwards.com/sites/more-nutrition',
    waitMs: 7000,
  },
  {
    slug: 'beyond-design-into-experience',
    url: 'https://www.awwwards.com/sites/beyond-design-into-experience',
    waitMs: 7000,
  },
];

const viewport = { width: 1400, height: 900 };

async function captureScreenshots() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport });

  for (const target of targets) {
    const filePath = path.join(outputDir, `${target.slug}.png`);
    try {
      console.log(`Capturing ${target.url} → ${filePath}`);
      await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 90000 });
      await page.waitForLoadState('networkidle', { timeout: 90000 }).catch(() => {});
      await page.waitForTimeout(target.waitMs ?? 7000);
      await dismissCookieBanners(page);
      await page.screenshot({ path: filePath, fullPage: true });
    } catch (error) {
      console.error(`Failed to capture ${target.url}:`, error.message);
    }
  }

  await browser.close();
}

captureScreenshots();

async function dismissCookieBanners(page) {
  const roleMatchers = [
    /accept all/i,
    /accept/i,
    /agree/i,
    /allow all/i,
    /continue/i,
  ];

  for (const matcher of roleMatchers) {
    const button = page.getByRole('button', { name: matcher });
    if (await button.count()) {
      try {
        await button.first().click({ timeout: 2000 });
        return;
      } catch (_) {
        // ignore and try next selector
      }
    }
  }

  const genericSelectors = [
    '#onetrust-accept-btn-handler',
    '[data-testid=\"uc-accept-all-button\"]',
    'button.cookie-accept',
    'button[aria-label=\"Accept cookies\"]',
    'button[title=\"Accept\"]',
  ];

  for (const selector of genericSelectors) {
    const locator = page.locator(selector);
    if (await locator.count()) {
      try {
        await locator.first().click({ timeout: 2000 });
        return;
      } catch (_) {
        // continue to next selector
      }
    }
  }
}
