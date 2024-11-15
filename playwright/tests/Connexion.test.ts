import { test, expect } from '../KlivarSignIn';

test('test de connexion', async ({ page }) => {
  await expect(page.getByRole('img', { name: 'klivar logo' })).toBeVisible();
  await expect(page.getByRole('navigation')).toBeVisible();
  await page.getByRole('link', { name: 'cartographier' }).click();
  await page.waitForLoadState('networkidle');

  await expect(page.getByText('Effectif')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Taille de l\'organisation' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Situation budgétaire' })).toBeVisible();
});
