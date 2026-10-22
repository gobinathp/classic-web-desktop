import { test } from 'node:test';
import assert from 'node:assert/strict';
import { safeLimit, validateStructure } from '../src/structure/protocol.ts';
test('structure preflight rejects empty, oversized and annotated input', () => {
  assert.throws(() => validateStructure('', 'smiles', 100), /empty/);
  assert.throws(() => validateStructure('C'.repeat(1001), 'smiles', 1000), /byte limit/);
  assert.throws(() => validateStructure('C'.repeat(2001), 'smiles', 10000), /character limit/);
  assert.throws(() => validateStructure('CCO __payload__', 'smiles', 100), /annotations/);
  assert.throws(() => validateStructure('CCO>O>C', 'smiles', 100), /reaction/);
  assert.doesNotThrow(() => validateStructure('C[C@H](N)C(=O)O', 'smiles', 100));
});
test('structure preflight requires coordinate-bearing formats', () => {
  assert.throws(() => validateStructure('protein name', 'pdb', 100), /coordinate/);
  assert.throws(() => validateStructure('CCO', 'sdf', 100), /complete/);
  assert.doesNotThrow(() => validateStructure('ATOM      1  CA  ALA A   1      10.000  10.000  10.000', 'pdb', 100));
});
test('structure limits are finite positive integers with explicit ceilings', () => {
  assert.equal(safeLimit(NaN, 500, 1000), 500);
  assert.equal(safeLimit(Infinity, 500, 1000), 500);
  assert.equal(safeLimit(-1, 500, 1000), 500);
  assert.equal(safeLimit(5000, 500, 1000), 1000);
  assert.equal(safeLimit(23.9, 500, 1000), 23);
  assert.equal(safeLimit(.1, 500, 1000), 1);
});
