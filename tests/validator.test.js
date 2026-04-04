import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateRecord, validateBudget } from '../src/utils/validator.js';
import { ERROR_CODES } from '../src/constants/code-definitions.js';

const valid = {
  date:     '2026-04-01',
  type:     'expense',
  category: '食費',
  amount:   '1000',
};

describe('validateRecord', () => {

  it('有効なレコードはエラーなし', () => {
    assert.deepStrictEqual(validateRecord(valid), []);
  });

  it('収入カテゴリも有効', () => {
    assert.deepStrictEqual(validateRecord({ ...valid, type: 'income', category: '給与' }), []);
  });

  it('金額が 0 はエラー', () => {
    const errors = validateRecord({ ...valid, amount: '0' });
    assert.ok(errors.includes(ERROR_CODES.INVALID_AMOUNT));
  });

  it('金額が負数はエラー', () => {
    const errors = validateRecord({ ...valid, amount: '-500' });
    assert.ok(errors.includes(ERROR_CODES.INVALID_AMOUNT));
  });

  it('金額が小数はエラー', () => {
    const errors = validateRecord({ ...valid, amount: '100.5' });
    assert.ok(errors.includes(ERROR_CODES.INVALID_AMOUNT));
  });

  it('金額が空はエラー', () => {
    const errors = validateRecord({ ...valid, amount: '' });
    assert.ok(errors.includes(ERROR_CODES.INVALID_AMOUNT));
  });

  it('日付形式が不正（スラッシュ区切り）はエラー', () => {
    const errors = validateRecord({ ...valid, date: '2026/04/01' });
    assert.ok(errors.includes(ERROR_CODES.INVALID_DATE));
  });

  it('日付が空はエラー', () => {
    const errors = validateRecord({ ...valid, date: '' });
    assert.ok(errors.includes(ERROR_CODES.INVALID_DATE));
  });

  it('存在しないカテゴリはエラー', () => {
    const errors = validateRecord({ ...valid, category: '存在しない' });
    assert.ok(errors.includes(ERROR_CODES.MISSING_CATEGORY));
  });

  it('種別が不正はエラー', () => {
    const errors = validateRecord({ ...valid, type: 'invalid' });
    assert.ok(errors.includes(ERROR_CODES.INVALID_TYPE));
  });

});

describe('validateBudget', () => {

  it('有効な予算はエラーなし', () => {
    assert.deepStrictEqual(validateBudget({ category: '食費', limit: 30000 }), []);
  });

  it('予算 0 は有効', () => {
    assert.deepStrictEqual(validateBudget({ category: '食費', limit: 0 }), []);
  });

  it('予算が負数はエラー', () => {
    const errors = validateBudget({ category: '食費', limit: -1 });
    assert.ok(errors.includes(ERROR_CODES.INVALID_AMOUNT));
  });

  it('カテゴリが空はエラー', () => {
    const errors = validateBudget({ category: '', limit: 10000 });
    assert.ok(errors.includes(ERROR_CODES.MISSING_CATEGORY));
  });

});
