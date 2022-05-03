import { chromium, Browser, Page } from "playwright";
import path from "path";
import fs from "fs";

describe("Upload CSV", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch();
  });

  beforeEach(async () => {
    page = await browser.newPage();
  });

  afterEach(async () => {
    await page.close();
  });

  for (const csv of ["instituicoes", "bolsas", "programas"]) {
    it(`Should upload '${csv}' CSV`, async () => {
      await page.goto("http://localhost:3000/upload");
      await page.setInputFiles(`input[type='file']#${csv}`, {
        name: `${csv}.csv`,
        mimeType: "text/csv",
        // prettier-ignore
        buffer: fs.readFileSync(path.resolve(__dirname, `../unit/fixtures/${csv}.csv`))
      });

      const [response] = await Promise.all([
        // prettier-ignore
        page.waitForResponse((response) => response.url().endsWith(csv)),
        page.click("button[type='submit']")
      ]);

      expect(response.ok()).toBe(true);
    });
  }
});
