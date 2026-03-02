// verify_app.test.ts
import { test, expect } from '@playwright/test';

test('verify app functionality', async ({ page }) => {
  // Listen for console logs and errors
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', exception => console.log('PAGE ERROR:', exception));

  await page.goto('http://localhost:3000');

  // Wait for the app to be ready (look for "Anatomy Explorer" header)
  await expect(page.locator('h1')).toHaveText(/Anatomy Explorer/);

  // 1. Initial State: Systems Tab, Full Body
  await page.screenshot({ path: 'verification/1_systems_tab.png' });
  console.log('Screenshot 1: Systems Tab');

  // 2. Click Skeletal Tab
  await page.getByRole('button', { name: 'Skeletal' }).click();
  await page.waitForTimeout(1000); // Wait a bit longer
  await page.screenshot({ path: 'verification/2_skeletal_tab.png' });
  console.log('Screenshot 2: Skeletal Tab');

  // Check if we can still see the sidebar
  await expect(page.locator('h1')).toBeVisible();

  // 3. Click Diseases Tab
  await page.getByRole('button', { name: 'Diseases' }).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'verification/3_diseases_tab.png' });
  console.log('Screenshot 3: Diseases Tab');

  // 4. Select a disease (e.g., Heart Attack)
  await page.getByRole('button', { name: /Heart Attack/ }).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'verification/4_disease_selected.png' });
  console.log('Screenshot 4: Disease Selected');

  // 5. Go back to Systems tab (should reset disease)
  await page.getByRole('button', { name: 'Systems' }).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'verification/5_back_to_systems.png' });
  console.log('Screenshot 5: Back to Systems (Reset)');
});
