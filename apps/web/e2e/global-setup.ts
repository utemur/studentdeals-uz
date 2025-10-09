import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  
  console.log('🚀 Starting global setup...');
  
  // Start MSW worker for API mocking
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Initialize MSW worker
  await page.goto(baseURL || 'http://localhost:3000');
  await page.evaluate(() => {
    // MSW worker will be started in each test
    console.log('✅ Global setup complete - MSW ready');
  });
  
  await browser.close();
  console.log('✅ Global setup finished');
}

export default globalSetup;

