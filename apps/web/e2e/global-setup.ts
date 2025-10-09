import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  
  // Start MSW worker for API mocking
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Initialize MSW worker
  await page.goto(baseURL || 'http://localhost:3000');
  await page.evaluate(() => {
    // MSW worker will be started in each test
    console.log('Global setup complete');
  });
  
  await browser.close();
}

export default globalSetup;

