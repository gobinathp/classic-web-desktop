import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fitRect, reducer, windowLimit } from '../src/model.ts';
import type { DesktopState } from '../src/model.ts';
const bounds = { width: 1024, height: 700 };
const empty: DesktopState = { windows: [], active: null };
const open = (s: DesktopState, id: string, limit = 8) => reducer(s, { type: 'open', id, bounds, limit });
test('open limit, duplicate restore, and bounded focus order', () => {
  let state = open(open(empty, 'a', 2), 'b', 2);
  assert.equal(open(state, 'c', 2), state);
  state = reducer(state, { type: 'minimize', id: 'a' });
  state = open(state, 'a', 2);
  assert.equal(state.windows.length, 2);
  assert.equal(state.active, 'a');
  assert.equal(state.windows.at(-1)?.minimized, false);
  for (let i = 0; i < 10000; i++) state = reducer(state, { type: 'focus', id: i % 2 ? 'a' : 'b' });
  assert.equal(state.windows.length, 2);
});
test('close and minimize select a visible window', () => {
  let state = open(open(empty, 'a'), 'b');
  state = reducer(state, { type: 'minimize', id: 'b' });
  assert.equal(state.active, 'a');
  state = reducer(state, { type: 'close', id: 'a' });
  assert.equal(state.active, null);
});
test('maximize retains original rect and restore flag', () => {
  let state = open(empty, 'a'); const rect = state.windows[0].rect;
  state = reducer(state, { type: 'maximize', id: 'a' });
  assert.equal(state.windows[0].maximized, true);
  state = reducer(state, { type: 'maximize', id: 'a' });
  assert.deepEqual(state.windows[0].rect, rect);
  assert.equal(state.windows[0].maximized, false);
});
test('geometry stays finite and on screen, including tiny containers', () => {
  for (const bounds of [{ width: 80, height: 90 }, { width: 1024, height: 700 }]) {
    for (let i = 0; i < 1000; i++) {
      const r = fitRect({ x: i * 9 - 500, y: i - 600, width: i * 2, height: i }, bounds);
      assert.ok(r.x >= 0 && r.y >= 0 && r.width > 0 && r.height > 0);
      assert.ok(r.x + r.width <= bounds.width && r.y + r.height <= bounds.height);
    }
  }
  assert.ok(Object.values(fitRect({ x: NaN, y: Infinity, width: NaN, height: -1 }, bounds)).every(Number.isFinite));
  assert.equal(windowLimit(Infinity), 8);
  assert.equal(windowLimit(10000), 32);
});
test('removed apps and lowered limits release windows', () => {
  let state = open(open(open(empty, 'a'), 'b'), 'c');
  state = reducer(state, { type: 'sync', ids: ['a', 'c'], limit: 1 });
  assert.equal(state.windows.length, 1);
  assert.equal(state.active, 'a');
});
test('resize clamps open windows to new viewport', () => {
  const state = reducer(open(empty, 'a'), { type: 'bounds', bounds: { width: 320, height: 240 } });
  assert.ok(state.windows[0].rect.width <= 320);
  assert.ok(state.windows[0].rect.height <= 240);
});
