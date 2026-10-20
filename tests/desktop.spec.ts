import { test, expect } from '@playwright/test';
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
