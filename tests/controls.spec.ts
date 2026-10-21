import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
async function openControls(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.getByRole('navigation', { name: 'Start applications' }).getByRole('button', { name: 'New in v0.4' }).click();
}
test('collections: bounded ListView, selection, native ListBox and removable Chips', async ({ page }) => {
  await openControls(page);
  const list = page.getByRole('region', { name: 'Documents', exact: true });
  await expect(list.locator('li')).toHaveCount(6);
  await expect(list.getByRole('button', { name: /Document 2 / })).toBeDisabled();
  await list.getByRole('button', { name: 'Next', exact: true }).click();
  await list.getByRole('button', { name: /Document 7 / }).click();
  await expect(page.getByText('Selected document: 7', { exact: true })).toBeVisible();
  await page.getByRole('listbox', { name: 'Resources' }).selectOption(['maps', 'reports']);
  await expect(page.getByText('Resources: maps, reports', { exact: true })).toBeVisible();
  await page.getByRole('list', { name: 'Tags' }).getByRole('button', { name: 'Reports', exact: true }).click();
  await expect(page.getByText('Selected tags: maps, reports', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Remove Maps', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Remove Maps', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Remove Locked', exact: true })).toBeDisabled();
});
test('actions: group keyboard, split actions, context menu mouse and keyboard, rating and reduced motion', async ({ page }) => {
  await openControls(page); await page.getByRole('tab', { name: 'Actions', exact: true }).click();
  await page.getByRole('button', { name: 'List', exact: true }).focus(); await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('button', { name: 'Cards', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Save preview', exact: true }).click();
  await expect(page.getByText('Saved locally for preview', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'More save actions', exact: false }).click();
  await page.getByRole('menuitem', { name: 'Save a copy' }).click();
  await expect(page.getByText('Saved a copy for preview', { exact: true })).toBeVisible();
  const sample = page.getByText('Sample record', { exact: true });
  await sample.click({ button: 'right' });
  await expect(page.getByRole('menuitem', { name: 'Copy record' })).toBeFocused();
  await page.keyboard.press('ArrowDown'); await expect(page.getByRole('menuitem', { name: 'Archive record' })).toBeFocused();
  await page.keyboard.press('Enter'); await expect(page.getByText('Archive preview selected', { exact: true })).toBeVisible();
  await sample.focus(); await page.keyboard.press('Shift+F10'); await page.keyboard.press('Escape'); await expect(sample).toBeFocused();
  await page.getByRole('button', { name: 'Record actions', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Copy record' }).click();
  await expect(page.getByText('Copy preview selected', { exact: true })).toBeVisible();
  await page.getByRole('radio', { name: '3 of 5 stars' }).focus(); await page.keyboard.press('ArrowRight');
  await expect(page.getByText('Rating: 4', { exact: true })).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Start loading preview' }).click();
  expect(await page.locator('.cwd-spinner-ring').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  await page.getByRole('button', { name: 'Stop loading preview' }).click(); await expect(page.locator('.cwd-spinner')).toHaveCount(0);
  await page.getByRole('button', { name: 'Refresh preview' }).click(); await expect(page.getByText('AppBar refresh preview selected', { exact: true })).toBeVisible();
});
test('layout: splitter pointer/keyboard, prompt validation, confirm cancellation and alert', async ({ page }) => {
  await openControls(page); await page.getByRole('tab', { name: 'Layout & dialogs' }).click();
  const separator = page.getByRole('separator', { name: 'Pane size' });
  await separator.focus(); await page.keyboard.press('ArrowRight'); await expect(separator).toHaveAttribute('aria-valuenow', '41');
  await page.keyboard.press('End'); await expect(separator).toHaveAttribute('aria-valuenow', '85');
  await page.keyboard.press('Home'); await expect(separator).toHaveAttribute('aria-valuenow', '15');
  const box = await separator.boundingBox(); await page.mouse.move(box!.x + box!.width / 2, box!.y + 20); await page.mouse.down(); await page.mouse.move(box!.x + 100, box!.y + 20); await page.mouse.up();
  expect(Number(await separator.getAttribute('aria-valuenow'))).toBeGreaterThan(15);
  await page.getByRole('button', { name: 'Switch orientation' }).click(); await expect(separator).toHaveAttribute('aria-orientation', 'horizontal');
  await separator.focus(); await page.keyboard.press('Home'); await page.keyboard.press('ArrowDown'); await expect(separator).toHaveAttribute('aria-valuenow', '16');
  await page.getByRole('button', { name: 'Open prompt', exact: true }).click();
  const prompt = page.getByRole('dialog', { name: 'Preview decision' });
  await prompt.getByRole('textbox', { name: 'New title' }).fill('   '); await page.keyboard.press('Enter');
  await expect(prompt.getByText('Enter a value.', { exact: true })).toBeVisible();
  await prompt.getByRole('textbox', { name: 'New title' }).fill('Team map'); await page.keyboard.press('Enter');
  await expect(page.getByText('Title: Team map', { exact: true })).toBeVisible(); await expect(prompt).toHaveCount(0);
  await page.getByRole('button', { name: 'Open confirm', exact: true }).click(); await prompt.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.getByText('Title: Team map', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Open alert', exact: true }).click(); await prompt.getByRole('button', { name: 'OK', exact: true }).click();
  await expect(page.getByText('Decision confirmed', { exact: true })).toBeVisible();
  await expect(page.getByRole('list', { name: 'Release activity' }).getByRole('listitem')).toHaveCount(3);
});
test('new controls automated accessibility and narrow layout', async ({ page }) => {
  await openControls(page);
  for (const tab of ['Collections', 'Actions', 'Layout & dialogs']) {
    await page.getByRole('tab', { name: tab, exact: true }).click();
    const result = await new AxeBuilder({ page }).include('[data-window="new-controls"]').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(result.violations).toEqual([]);
  }
  await page.getByRole('button', { name: 'Open prompt', exact: true }).click();
  expect((await new AxeBuilder({ page }).include('dialog').withTags(['wcag2a', 'wcag2aa']).analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 360, height: 740 });
  await page.getByRole('tab', { name: 'Actions', exact: true }).click();
  await page.getByRole('button', { name: 'Record actions', exact: true }).click();
  const bounds = await page.getByRole('menu', { name: 'Record actions' }).boundingBox();
  expect(bounds!.x).toBeGreaterThanOrEqual(0); expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(360);
  await page.keyboard.press('Escape');
  await page.screenshot({ path: 'test-results/controls-mobile.png' });
});
