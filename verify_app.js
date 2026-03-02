import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:3000');

  // Wait for the app to be ready (look for "Anatomy Explorer" header)
  try {
      await page.waitForSelector('h1:has-text("Anatomy Explorer")', { timeout: 10000 });
      console.log('App loaded');
  } catch (e) {
      console.error('Timeout waiting for app to load');
      await page.screenshot({ path: 'error_load.png' });
      await browser.close();
      process.exit(1);
  }

  // 1. Initial State: Systems Tab, Full Body
  await page.screenshot({ path: '1_systems_tab.png' });
  console.log('Screenshot 1: Systems Tab');

  // 2. Click Skeletal Tab
  await page.click('button:has-text("Skeletal")');
  await page.waitForTimeout(500); // Wait for transition
  await page.screenshot({ path: '2_skeletal_tab.png' });
  console.log('Screenshot 2: Skeletal Tab');

  // 3. Click Diseases Tab
  await page.click('button:has-text("Diseases")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: '3_diseases_tab.png' });
  console.log('Screenshot 3: Diseases Tab');

  // 4. Select a disease (e.g., Heart Attack)
  // Assuming disease buttons have text like "Heart Attack" or similar from data.ts
  // Looking at data.ts: "Heart Attack (Myocardial Infarction)"
  await page.click('button:has-text("Heart Attack")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: '4_disease_selected.png' });
  console.log('Screenshot 4: Disease Selected');

  // 5. Go back to Systems tab (should reset disease)
  await page.click('button:has-text("Systems")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: '5_back_to_systems.png' });
  console.log('Screenshot 5: Back to Systems (Reset)');

  await browser.close();
})();
