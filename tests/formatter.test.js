import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { formatCurrency, formatDateShort, formatYearMonth } from '../src/utils/formatter.js';

describe('formatDateShort', () => {

  it('YYYY-MM-DD を M/D に変換する', () => {
    assert.strictEqual(formatDateShort('2026-04-05'), '4/5');
  });

  it('月と日のゼロパディングを除去する', () => {
    assert.strictEqual(formatDateShort('2026-01-01'), '1/1');
  });

  it('空文字は空文字を返す', () => {
    assert.strictEqual(formatDateShort(''), '');
  });

  it('null は空文字を返す', () => {
    assert.strictEqual(formatDateShort(null), '');
  });

});

describe('formatYearMonth', () => {

  it('YYYY-MM を YYYY年M月 に変換する', () => {
    assert.strictEqual(formatYearMonth('2026-04'), '2026年4月');
  });

  it('月のゼロパディングを除去する', () => {
    assert.strictEqual(formatYearMonth('2026-01'), '2026年1月');
  });

  it('空文字は空文字を返す', () => {
    assert.strictEqual(formatYearMonth(''), '');
  });

});

describe('formatCurrency', () => {

  it('0 を ¥0 にフォーマットする', () => {
    assert.strictEqual(formatCurrency(0), '¥0');
  });

  it('正の整数を通貨表記にフォーマットする', () => {
    assert.strictEqual(formatCurrency(1000), '¥1,000');
  });

  it('大きな数値をカンマ区切りにフォーマットする', () => {
    assert.strictEqual(formatCurrency(300000), '¥300,000');
  });

});
