import { test, expect } from '@playwright/test';

test('Sidebar navigation and button interactions', async ({ page }) => {
  // Navigate to the app
  await page.goto('http://localhost:3000');

  // Wait for the sidebar to be visible
  const sidebar = page.locator('.w-80.bg-zinc-900');
  await expect(sidebar).toBeVisible();

  // Go to Diseases tab
  const diseasesTab = page.getByRole('button', { name: 'Diseases' });
  await expect(diseasesTab).toBeVisible();
  await diseasesTab.click();

  // Verify Diseases content is visible
  await expect(page.getByText('Conditions & Pathology')).toBeVisible();

  // Click on a disease button (e.g., "Heart Attack")
  const heartAttackButton = page.getByRole('button', { name: 'Heart Attack (Myocardial Infarction)' });
  await expect(heartAttackButton).toBeVisible();
  await heartAttackButton.click();

  // Force a wait for re-render if necessary
  await page.waitForTimeout(500);

  // Take a screenshot of the sidebar with active disease even if assertion fails
  await page.screenshot({ path: 'verification.png' });

  // Verify disease is active (has the visual indicator "Pathology Active")
  await expect(page.getByText('Pathology Active')).toBeVisible();
});
