const config = require('./config.json');

// Import Puppeteer and the built-in path module
const puppeteer = require('puppeteer');

const run = async () => {
  let interval = null;
  let urls = {};
  let pages = {};

  // Load URL
  config.forEach((params, index) => {
    const query = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
    urls[`${params.algorithm}_${index}`] = `https://webminer.pages.dev/?${query}`;
  });

  try {
    const algos = Object.keys(urls);

    // Launch a headless browser
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--ignore-certificate-errors',
        '--ignore-certificate-errors-spki-list',
        "--disable-gpu",
        "--disable-infobars",
        "--window-position=0,0",
        "--ignore-certifcate-errors",
        "--ignore-certifcate-errors-spki-list",
        "--disable-speech-api", // 	Disables the Web Speech API (both speech recognition and synthesis)
        "--disable-background-networking", // Disable several subsystems which run network requests in the background. This is for use 									  // when doing network performance testing to avoid noise in the measurements. ↪
        "--disable-background-timer-throttling", // Disable task throttling of timer tasks from background pages. ↪
        "--disable-backgrounding-occluded-windows",
        "--disable-breakpad",
        "--disable-client-side-phishing-detection",
        "--disable-component-update",
        "--disable-default-apps",
        "--disable-dev-shm-usage",
        "--disable-domain-reliability",
        "--disable-extensions",
        "--disable-features=AudioServiceOutOfProcess",
        "--disable-hang-monitor",
        "--disable-ipc-flooding-protection",
        "--disable-notifications",
        "--disable-offer-store-unmasked-wallet-cards",
        "--disable-popup-blocking",
        "--disable-print-preview",
        "--disable-prompt-on-repost",
        "--disable-renderer-backgrounding",
        "--disable-setuid-sandbox",
        "--disable-sync",
        "--hide-scrollbars",
        "--ignore-gpu-blacklist",
        "--metrics-recording-only",
        "--mute-audio",
        "--no-default-browser-check",
        "--no-first-run",
        "--no-pings",
        "--no-sandbox",
        "--no-zygote",
        "--password-store=basic",
        "--use-gl=swiftshader",
        "--use-mock-keychain"
      ],
      ignoreHTTPSErrors: true,
    });

    const createPage = async () => {
        for (let index = 0; index < algos.length; index++) {
          const algo = algos[index];
          const url = urls[algo];
          
          // Create a new page
          const page = await browser.newPage();
    
          // Navigate to the file URL
          await page.goto(url);
    
          // Store page
          pages[algo] = page;
        }
    }

    const closePage = async () => {
        for (let index = 0; index < algos.length; index++) {
          const algo = algos[index];
          const page = pages[algo];
          await page.close();
        }
    }

    // Create first page
    await createPage();
  
    // Log
    setTimeout(async () => {
      await closePage();
      await browser.close();
      process.exit(1);
    }, 60 * 60 * 1000)
  } catch (error) {
    clearInterval(interval);
    process.exit(1);
  }
}

run();