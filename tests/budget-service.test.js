import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { BudgetService } from '../src/core/budget-service.js';

// LocalStorage の代替モック
class MockStorage {
  constructor() {
    this._records = [];
  }
  getRecords()       { return [...this._records]; }
  saveRecords(r)     { this._records = r; }
  getBudgets()       { return {}; }
  saveBudgets() {}
}

const sample = (overrides = {}) => ({
  date:     '2026-04-01',
  type:     'expense',
  category: '食費',
  amount:   '1000',
  memo:     '',
  ...overrides,
});

describe('BudgetService', () => {

  let service;
  let storage;

  beforeEach(() => {
    storage = new MockStorage();
    service = new BudgetService(storage);
  });

  it('レコードを追加できる', () => {
    service.addRecord(sample());
    assert.strictEqual(storage.getRecords().length, 1);
  });

  it('追加したレコードに id が付与される', () => {
    const id = service.addRecord(sample());
    assert.ok(typeof id === 'string' && id.length > 0);
  });

  it('レコードを削除できる', () => {
    const id = service.addRecord(sample());
    service.deleteRecord(id);
    assert.strictEqual(storage.getRecords().length, 0);
  });

  it('存在しない id の削除は何も変えない', () => {
    service.addRecord(sample());
    service.deleteRecord('non-existent-id');
    assert.strictEqual(storage.getRecords().length, 1);
  });

  it('レコードを更新できる', () => {
    const id = service.addRecord(sample());
    service.updateRecord(id, { ...sample(), amount: '2000' });
    const updated = storage.getRecords().find(r => r.id === id);
    assert.strictEqual(updated.amount, 2000);
  });

  it('存在しない id の更新はエラーをスローする', () => {
    assert.throws(() => service.updateRecord('no-id', sample()));
  });

  it('月別サマリーが正しく計算される', () => {
    service.addRecord(sample({ type: 'income', category: '給与', amount: '300000' }));
    service.addRecord(sample({ type: 'expense', amount: '50000' }));
    const { income, expense, balance } = service.getSummary('2026-04');
    assert.strictEqual(income,  300000);
    assert.strictEqual(expense, 50000);
    assert.strictEqual(balance, 250000);
  });

  it('別月のレコードはサマリーに含まれない', () => {
    service.addRecord(sample({ date: '2026-03-31', amount: '9999' }));
    const { expense } = service.getSummary('2026-04');
    assert.strictEqual(expense, 0);
  });

  it('カテゴリ別集計が正しい', () => {
    service.addRecord(sample({ category: '食費', amount: '1000' }));
    service.addRecord(sample({ category: '食費', amount: '2000' }));
    service.addRecord(sample({ category: '交通費', amount: '500' }));
    const data = service.getExpenseByCategory('2026-04');
    assert.strictEqual(data['食費'],  3000);
    assert.strictEqual(data['交通費'], 500);
  });

  it('収入はカテゴリ集計に含まれない', () => {
    service.addRecord(sample({ type: 'income', category: '給与', amount: '200000' }));
    const data = service.getExpenseByCategory('2026-04');
    assert.strictEqual(Object.keys(data).length, 0);
  });

  it('getRecordsByMonth は日付降順で返す', () => {
    service.addRecord(sample({ date: '2026-04-01' }));
    service.addRecord(sample({ date: '2026-04-15' }));
    service.addRecord(sample({ date: '2026-04-10' }));
    const records = service.getRecordsByMonth('2026-04');
    assert.strictEqual(records[0].date, '2026-04-15');
    assert.strictEqual(records[1].date, '2026-04-10');
    assert.strictEqual(records[2].date, '2026-04-01');
  });

  it('不正な入力（金額 0）はエラーをスローする', () => {
    assert.throws(() => service.addRecord(sample({ amount: '0' })));
  });

  it('不正な入力（日付フォーマット誤り）はエラーをスローする', () => {
    assert.throws(() => service.addRecord(sample({ date: '2026/04/01' })));
  });

});
