import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
async function open(page: import('@playwright/test').Page, name: string) {
  await page.getByRole('button', { name: 'PhytoTB', exact: true }).click();
  await page.getByRole('navigation', { name: 'Start applications' }).getByRole('button', { name, exact: true }).click();
}
test('research catalogue, graph, heatmap and comparison remain connected', async ({ page }) => {
  const errors: string[] = [], external: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('request', r => { if (!r.url().startsWith('http://127.0.0.1:4173/')) external.push(r.url()); });
  await page.goto('/phytotb.html');
  await page.screenshot({ path: 'test-results/phytotb-desktop.png' });
  await page.getByRole('searchbox', { name: 'Search catalogue' }).fill('marine');
  await expect(page.getByRole('status')).toContainText('1 records found');
  await page.getByRole('button', { name: 'Marine metabolite A', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Marine metabolite A', exact: true })).toContainText('Synthetic marine-metabolite fixture');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Remove M01', exact: true }).click();
  await open(page, 'Compound comparison');
  const table = page.getByRole('table', { name: 'Compound comparison', exact: true });
  await expect(table).toContainText('Plant compound A');
  await expect(table).not.toContainText('Marine metabolite A');
  await open(page, 'Evidence network');
  await expect(page.getByRole('button', { name: 'M01 · Marine metabolite', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'H02 · Host target', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.phy-callout').filter({ hasText: 'Host target B' })).toContainText('2 illustrative links');
  await open(page, 'Expression heatmap');
  await page.getByRole('button', { name: 'Host target A, Study fixture 03: Not available' }).click();
  await expect(page.locator('.phy-callout').filter({ hasText: 'H01 / S03' })).toContainText('No accession');
  expect(errors).toEqual([]); expect(external).toEqual([]);
});
test('research notes survive window teardown and export explicit synthetic provenance', async ({ page }) => {
  await page.goto('/phytotb.html'); await open(page, 'Research notebook');
  await page.getByRole('textbox', { name: 'Research notes', exact: true }).fill('<script>example</script> Curation pending');
  await page.getByRole('button', { name: 'Close Research notebook', exact: true }).click();
  await open(page, 'Research notebook');
  await expect(page.getByRole('textbox', { name: 'Research notes', exact: true })).toHaveValue('<script>example</script> Curation pending');
  const download = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export research notes' }).click();
  const file = await download, stream = await file.createReadStream(); const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(chunk);
  const data = JSON.parse(Buffer.concat(chunks).toString());
  expect(data.dataStatus).toBe('SYNTHETIC_UI_FIXTURES_NOT_RESEARCH_FINDINGS'); expect(data.selectedRecords).toHaveLength(2); expect(data.notes).toContain('<script>');
  await page.reload(); await open(page, 'Research notebook');
  await expect(page.getByRole('textbox', { name: 'Research notes', exact: true })).toHaveValue('');
});
test('research workspace accessibility and narrow layout', async ({ page }) => {
  await page.goto('/phytotb.html');
  for (const name of ['Research overview', 'Target & compound catalogue', 'Evidence network', 'Expression heatmap', 'Compound comparison', 'Research notebook']) {
    await open(page, name);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(results.violations, name).toEqual([]);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page, 'Expression heatmap');
  await page.screenshot({ path: 'test-results/phytotb-mobile.png' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});
