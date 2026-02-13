import puppeteer from "puppeteer-core";
import dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.BROWSERLESS_TOKEN;
const BROWSERLESS_WS = `wss://production-sfo.browserless.io?token=${TOKEN}`;

async function getAllWebsiteContent(url) {
  const browser = await puppeteer.connect({
    browserWSEndpoint: BROWSERLESS_WS,
  });

  const page = await browser.newPage();

  // Act like a real user
  await page.setViewport({ width: 1366, height: 768 });
  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-US,en;q=0.9",
  });

  // Go to page and wait for JS to finish
  await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

  // Scroll to load lazy content
  await page.evaluate(async () => {
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    for (let i = 0; i < 10; i++) {
      window.scrollBy(0, window.innerHeight);
      await delay(500);
    }
  });

  // Extract ALL visible text
  const text = await page.evaluate(() => {
    return document.body.innerText;
  });

  await browser.close();
  return text;
}

// ---- Run ----
getAllWebsiteContent("https://en.wikipedia.org/wiki/Finding_Nemo")
  .then((content) => {
    console.log("===== PAGE CONTENT START =====");
    console.log(content.slice(0, 5000)); // preview
    console.log("===== PAGE CONTENT END =====");
  })
  .catch(console.error);
