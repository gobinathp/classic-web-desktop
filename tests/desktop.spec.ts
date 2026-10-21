import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('opens, minimizes, releases contents, restores and closes; no external requests', async ({ page }) => {
  const errors: string[] = [], external: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('request', r => { if (!r.url().startsWith('http://127.0.0.1:4173')) external.push(r.url()); });
  await page.goto('/');
  await expect(page.getByRole('dialog')).toHaveCount(3);
  await page.screenshot({ path: 'test-results/desktop.png' });
  await page.getByRole('navigation', { name: 'Desktop applications' }).getByRole('button', { name: 'Notepad' }).click();
  await page.getByRole('textbox', { name: 'Scratchpad' }).fill('temporary note');
  await page.getByRole('button', { name: 'Minimize Notepad' }).click();
  await expect(page.getByRole('textbox', { name: 'Scratchpad' })).toHaveCount(0);
  await page.getByRole('navigation', { name: 'Open windows' }).getByRole('button', { name: 'Notepad' }).click();
  await expect(page.getByRole('textbox', { name: 'Scratchpad' })).not.toHaveValue('temporary note');
  await page.getByRole('button', { name: 'Close Notepad' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(3);
  expect(errors).toEqual([]); expect(external).toEqual([]);
});
test('drag, resize, maximize, keyboard move and viewport containment', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Open windows' }).getByRole('button', { name: 'Welcome' }).click();
  const win = page.getByRole('dialog', { name: 'Welcome' });
  const before = (await win.boundingBox())!;
  const title = win.locator('.cwd-titlebar');
  const box = (await title.boundingBox())!;
  await page.mouse.move(box.x + 100, box.y + 12); await page.mouse.down(); await page.mouse.move(box.x + 180, box.y + 65, { steps: 10 }); await page.mouse.up();
  const dragged = (await win.boundingBox())!;
  expect(dragged.x).toBeGreaterThan(before.x + 60);
  await win.focus(); await page.keyboard.press('Alt+ArrowRight');
  expect((await win.boundingBox())!.x).toBe(dragged.x + 16);
  await page.keyboard.press('Alt+Shift+ArrowRight');
  expect((await win.boundingBox())!.width).toBe(before.width + 16);
  const resizeBefore = (await win.boundingBox())!;
  await page.mouse.move(resizeBefore.x + resizeBefore.width - 5, resizeBefore.y + resizeBefore.height - 5); await page.mouse.down(); await page.mouse.move(resizeBefore.x + resizeBefore.width + 35, resizeBefore.y + resizeBefore.height + 20, { steps: 5 }); await page.mouse.up();
  expect((await win.boundingBox())!.width).toBeGreaterThan(resizeBefore.width);
  await page.getByRole('button', { name: 'Maximize Welcome' }).click();
  expect((await win.boundingBox())!.width).toBe(1280);
  await page.getByRole('button', { name: 'Restore Welcome' }).click();
  await page.setViewportSize({ width: 360, height: 640 });
  await expect.poll(async () => (await win.boundingBox())!.width).toBeLessThanOrEqual(360);
  for (const dialog of await page.getByRole('dialog').all()) { const r = (await dialog.boundingBox())!; expect(r.x).toBeGreaterThanOrEqual(0); expect(r.x + r.width).toBeLessThanOrEqual(360); }
  await page.screenshot({ path: 'test-results/mobile.png' });
});
test('table mounts one page and hostile text is treated as text', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Open windows' }).getByRole('button', { name: 'Projects' }).click();
  await expect(page.locator('tbody tr')).toHaveCount(20);
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.locator('tbody tr').first()).toContainText('21');
  await page.getByRole('navigation', { name: 'Desktop applications' }).getByRole('button', { name: 'Notepad' }).click();
  const attack = '<img src=x onerror="window.injected=true">';
  await page.getByRole('textbox', { name: 'Scratchpad' }).fill(attack);
  expect(await page.evaluate(() => (window as unknown as { injected?: boolean }).injected)).toBeUndefined();
  await expect(page.locator('img')).toHaveCount(0);
});
test('start launcher keyboard dismissal and repeated open-close do not accumulate DOM', async ({ page }) => {
  await page.goto('/');
  const start = page.getByRole('button', { name: 'Start', exact: true });
  await start.click(); await expect(page.getByRole('navigation', { name: 'Start applications' })).toBeVisible();
  await page.keyboard.press('Escape'); await expect(start).toBeFocused();
  const before = await page.locator('*').count();
  for (let i = 0; i < 30; i++) {
    await page.getByRole('navigation', { name: 'Desktop applications' }).getByRole('button', { name: 'Notepad' }).click();
    await page.getByRole('button', { name: 'Close Notepad' }).click();
  }
  expect(await page.locator('*').count()).toBe(before);
});

test('component tabs implement keyboard activation and unmount inactive forms', async ({ page }) => {
  await page.goto('/');
  const overview = page.getByRole('tab', { name: 'Overview', exact: true });
  await overview.focus(); await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Forms', exact: true })).toBeFocused();
  await expect(page.getByLabel('Display name', { exact: true })).toHaveValue('Gobinath');
  await page.getByLabel('Display name', { exact: true }).fill('');
  await expect(page.getByLabel('Display name', { exact: true })).toHaveAttribute('aria-invalid', 'true');
  await page.getByRole('switch', { name: 'Enable notifications', exact: true }).uncheck();
  await expect(page.getByRole('switch', { name: 'Enable notifications', exact: true })).not.toBeChecked();
  await page.getByRole('tab', { name: 'Navigation', exact: true }).click();
  await expect(page.getByLabel('Display name', { exact: true })).toHaveCount(0);
  await page.getByRole('tab', { name: 'Forms', exact: true }).click();
  await expect(page.getByLabel('Display name', { exact: true })).toHaveValue('Gobinath');
});
test('modal dialog traps focus, Escape closes and returns focus', async ({ page }) => {
  await page.goto('/'); await page.getByRole('tab', { name: 'Overlays', exact: true }).click();
  const trigger = page.getByRole('button', { name: 'Open dialog', exact: true });
  await trigger.click();
  const modal = page.getByRole('dialog', { name: 'Create workspace', exact: true });
  await expect(modal).toBeVisible();
  await expect(page.getByLabel('Workspace name', { exact: true })).toBeFocused();
  for (let i = 0; i < 7; i++) { await page.keyboard.press('Tab'); expect(await modal.evaluate(el => el.contains(document.activeElement))).toBe(true); }
  await page.keyboard.press('Escape'); await expect(modal).toHaveCount(0); await expect(trigger).toBeFocused();
  await page.getByRole('button', { name: 'Open drawer', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Workspace details', exact: true })).toBeVisible();
  await page.keyboard.press('Escape'); await expect(page.getByRole('button', { name: 'Open drawer', exact: true })).toBeFocused();
});
test('menu skips disabled actions, supports keyboard and popover dismissal', async ({ page }) => {
  await page.goto('/'); await page.getByRole('tab', { name: 'Overlays', exact: true }).click();
  const trigger = page.getByRole('button', { name: 'Project actions' });
  await trigger.focus(); await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Open project', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowDown'); await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Archive project', exact: true })).toBeFocused();
  await page.keyboard.press('Home'); await page.keyboard.press('Enter');
  await expect(page.getByRole('menu')).toHaveCount(0); await expect(trigger).toBeFocused();
  await expect(page.getByText('Open selected', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Workspace info', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Workspace info', exact: true })).toBeVisible();
  await page.keyboard.press('Escape'); await expect(page.getByRole('region', { name: 'Workspace info', exact: true })).toHaveCount(0);
});
test('notifications stay capped and tree/accordion children mount on demand', async ({ page }) => {
  await page.goto('/'); await page.getByRole('tab', { name: 'Feedback', exact: true }).click();
  for (let i = 0; i < 8; i++) await page.getByRole('button', { name: 'Add notification', exact: true }).click();
  await expect(page.locator('.cwd-toast')).toHaveCount(3);
  await page.getByRole('button', { name: 'Dismiss Notification 8', exact: true }).click();
  await expect(page.locator('.cwd-toast')).toHaveCount(2);
  await page.getByRole('tab', { name: 'Navigation', exact: true }).click();
  const folders = page.getByRole('navigation', { name: 'Sample folders', exact: true });
  await expect(folders.getByRole('button', { name: 'Projects', exact: true })).toHaveCount(0);
  await folders.locator('summary').first().click();
  await expect(folders.getByRole('button', { name: 'Projects', exact: true })).toBeVisible();
  await folders.locator('summary').first().click();
  await expect(folders.getByRole('button', { name: 'Projects', exact: true })).toHaveCount(0);
});
test('table sorts with accessible column state before pagination', async ({ page }) => {
  await page.goto('/'); await page.getByRole('navigation', { name: 'Open windows' }).getByRole('button', { name: 'Projects', exact: true }).click();
  const header = page.getByRole('columnheader').first();
  await header.getByRole('button').click(); await expect(header).toHaveAttribute('aria-sort', 'ascending');
  await header.getByRole('button').click(); await expect(header).toHaveAttribute('aria-sort', 'descending');
  await expect(page.locator('tbody tr').first().locator('td').first()).toHaveText('240');
  await expect(page.locator('tbody tr')).toHaveCount(20);
});

 test('component studio has no detected WCAG A/AA violations in each category', async ({ page }) => {
  await page.goto('/');
  for (const category of ['Overview', 'Forms', 'Navigation', 'Feedback', 'Overlays']) {
    await page.getByRole('tab', { name: category, exact: true }).click();
    const result = await new AxeBuilder({ page }).include('[data-window="components"]').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), category).toEqual([]);
  }
  await page.getByRole('button', { name: 'Open dialog', exact: true }).click();
  const result = await new AxeBuilder({ page }).include('.cwd-modal').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(result.violations.map(v => v.id)).toEqual([]);
});

test('customization updates branding, theme, layout, limits and hidden-content policy', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Desktop applications' }).getByRole('button', { name: 'Customization' }).click();
  await page.getByLabel('Custom branding, green theme and French sample labels').check();
  await expect(page.getByRole('button', { name: 'Démarrer', exact: true })).toBeVisible();
  await expect(page.locator('.cwd-desktop')).toHaveAttribute('data-taskbar', 'top');
  await expect(page.locator('.cwd-desktop')).toHaveAttribute('data-shortcuts', 'right');
  await expect(page.locator('.cwd-watermark')).toHaveText('Mon espace');
  expect(await page.locator('.cwd-surface').evaluate(el => getComputedStyle(el).backgroundImage)).toContain('50, 111, 99');
  await page.getByLabel('Preserve hidden content').check();
  await page.getByRole('button', { name: 'Fermer Customization' }).click();
  await page.getByRole('navigation', { name: 'Open windows' }).getByRole('button', { name: 'Projects', exact: true }).click();
  await expect(page.locator('[data-window="projects"] tbody tr')).toHaveCount(5);
  await expect(page.getByRole('button', { name: 'Suivant' })).toBeVisible();
  await page.getByRole('button', { name: 'Démarrer', exact: true }).click();
  await page.getByRole('navigation', { name: 'Start applications' }).getByRole('button', { name: 'Notepad' }).click();
  await page.getByRole('textbox', { name: 'Scratchpad' }).fill('retained through minimize');
  const note = page.locator('[data-window="notes"]');
  const before = await note.boundingBox();
  await note.focus(); await page.keyboard.press('Alt+ArrowRight');
  expect((await note.boundingBox())!.x - before!.x).toBe(8);
  await page.getByRole('button', { name: 'Minimize Notepad' }).click();
  await expect(page.locator('textarea.notes')).toHaveCount(1);
  await page.getByRole('navigation', { name: 'Open windows' }).getByRole('button', { name: 'Notepad' }).click();
  await expect(page.getByRole('textbox', { name: 'Scratchpad' })).toHaveValue('retained through minimize');
  await page.getByRole('button', { name: 'Fermer Notepad' }).click();
  await page.screenshot({ path: 'test-results/customization.png' });
});

test('review regressions: bounded overlays, hover/click tooltip and nonblank workspace', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: 'Overlays', exact: true }).click();
  await page.getByRole('button', { name: 'Project actions' }).click();
  const menu = page.getByRole('menu', { name: 'Project actions' });
  const bounds = await page.locator('[data-window="components"] .cwd-window-content').boundingBox();
  const box = await menu.boundingBox();
  expect(box!.x).toBeGreaterThanOrEqual(bounds!.x);
  expect(box!.x + box!.width).toBeLessThanOrEqual(bounds!.x + bounds!.width);
  expect(box!.y + box!.height).toBeLessThanOrEqual(bounds!.y + bounds!.height);
  await expect(page.getByRole('menuitem', { name: 'Duplicate project' })).toBeVisible();
  await page.keyboard.press('Escape');
  const help = page.getByRole('button', { name: 'Overlay help' });
  await help.hover(); await expect(page.getByRole('tooltip')).toBeVisible();
  const tip = await page.getByRole('tooltip').boundingBox();
  expect(tip!.width).toBeGreaterThan(100);
  expect(tip!.x).toBeGreaterThanOrEqual(bounds!.x);
  await page.mouse.move(5, 5); await expect(page.getByRole('tooltip')).toHaveCount(0);
  await help.click(); await expect(page.getByRole('tooltip')).toBeVisible();
  await page.keyboard.press('Escape'); await expect(page.getByRole('tooltip')).toHaveCount(0);
  await page.getByRole('button', { name: 'Open dialog', exact: true }).click();
  const name = page.getByRole('textbox', { name: 'Workspace name' });
  await page.getByRole('button', { name: 'Create preview', exact: true }).click();
  await expect(name).toHaveAttribute('aria-invalid', 'true');
  await name.fill('   '); await page.keyboard.press('Enter');
  await expect(page.getByText('Enter a workspace name.', { exact: true })).toBeVisible();
  await name.fill('Team tools'); await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog', { name: 'Create workspace', exact: true })).toHaveCount(0);
  await expect(page.getByText('Workspace preview created: Team tools', { exact: true })).toBeVisible();
});

test('review regressions: stable taskbar, owner search, explorer and demo feedback', async ({ page }) => {
  await page.goto('/');
  const tasks = page.getByRole('navigation', { name: 'Open windows' });
  const order = await tasks.getByRole('button').allTextContents();
  await tasks.getByRole('button', { name: 'Welcome', exact: true }).click();
  await tasks.getByRole('button', { name: 'Projects', exact: true }).click();
  expect(await tasks.getByRole('button').allTextContents()).toEqual(order);
  await page.getByRole('searchbox', { name: 'Find project' }).fill('Priya');
  const rows = page.locator('[data-window="projects"] tbody tr');
  await expect(rows).toHaveCount(20);
  for (const owner of await rows.locator('td:nth-child(3)').allTextContents()) expect(owner).toBe('Priya');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.getByRole('navigation', { name: 'Start applications' }).getByRole('button', { name: 'Explorer' }).click();
  const archive = page.locator('[data-window="explorer"] details').filter({ has: page.locator('summary', { hasText: 'Archive' }) });
  await archive.locator('summary').click();
  await expect(archive).toHaveAttribute('open', '');
  expect(await archive.locator('summary').evaluate(el => getComputedStyle(el).listStyleType)).toBe('disclosure-open');
  await page.locator('[data-window="explorer"]').getByRole('button', { name: 'Documents', exact: true }).click();
  await expect(page.getByText('Documents selected — sample folder only.', { exact: true })).toBeVisible();
  await tasks.getByRole('button', { name: 'Component studio', exact: true }).click();
  await page.getByRole('button', { name: 'Primary action', exact: true }).click();
  await expect(page.getByText('Primary action clicked — local demonstration only.', { exact: true })).toBeVisible();
});
