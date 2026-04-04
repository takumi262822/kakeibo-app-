# MoneyBook — 設計概要

## アーキテクチャ方針

バニラ JS（ES Modules）+ ビルドツールなし。単一 HTML ページ上でクラスを組み合わせて動作する SPA。

## モジュール構成

| 層 | クラス / モジュール | 役割 |
|----|------------------|------|
| core | `KakeiboEngine` | 初期化・イベント委譲・画面更新の統括 |
| core | `BudgetService` | CRUD・集計ロジック（DOM 非依存） |
| managers | `StorageManager` | LocalStorage への読み書き |
| managers | `StateManager` | 表示月・モーダル状態の保持 |
| managers | `ChartManager` | Chart.js ラッパー |
| managers | `CsvManager` | CSV 生成・ダウンロード |
| ui | `header.js` / `footer.js` / `components.js` | HTML テンプレート関数群（純粋関数） |
| utils | `validator.js` | 入力バリデーション（純粋関数） |
| utils | `xss.js` | XSS フィルタリング |
| utils | `formatter.js` | 通貨・日付フォーマット（純粋関数） |

## データモデル

**Record**（LocalStorage key: `moneybook_records`）

```json
{
  "id": "1712345678901-abc123",
  "date": "2026-04-01",
  "type": "expense",
  "category": "食費",
  "amount": 1500,
  "memo": "スーパー",
  "createdAt": "2026-04-01T10:00:00.000Z"
}
```

## 設計方針

- **BudgetService は StorageManager を DI**で受け取ることでテスト可能にする
- イベントは `KakeiboEngine` がバブルアップで委譲し、リスナーを 1 本に集約する
- UI 関数はすべて純粋関数（DOM 操作なし、HTML 文字列を返す）
- XSS は `escapeHtml()` で全ユーザー入力をエスケープしてから `innerHTML` に代入する

## セキュリティ

- LocalStorage の読み取りは `try/catch` でパース例外を吸収する
- ユーザー入力の表示前に `escapeHtml()` を適用する
- CSV エクスポートは `"` をエスケープしたセルを BOM 付き UTF-8 で書き出す

## テスト戦略

- `node:test` + `node:assert` でユニットテスト（37 件）
- `BudgetService` はモック `StorageManager` を DI して DOM 依存なしでテスト
- `validator` / `formatter` は純粋関数のため直接インポートしてテスト
