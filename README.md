# MoneyBook

シンプルな家計簿アプリ。収入・支出の記録から月次サマリーとグラフによる可視化、CSV エクスポートまでを提供する。

## 機能

- 収支レコードの追加・編集・削除
- 月ナビゲーション（前月 / 翌月の切替）
- 支出カテゴリのドーナツチャート（Chart.js）
- CSV エクスポート（UTF-8 BOM 付き）
- データは LocalStorage に永続保存

## 技術スタック

| 分類 | 技術 |
|------|------|
| 言語 | バニラ JavaScript（ES Modules） |
| グラフ | Chart.js 4（CDN） |
| Lint | ESLint 8 |
| テスト | Node.js `node:test` + `node:assert` |
| CI | GitHub Actions |

## セットアップ

```bash
npm install
npm run lint
npm test
```

## 画面構成

[SCREEN-OVERVIEW.md](SCREEN-OVERVIEW.md) を参照。

## 設計

[DESIGN.md](DESIGN.md) および [docs/基本設計書/機能定義書.adoc](docs/基本設計書/機能定義書.adoc) を参照。

## ライセンス

© 2026 MONEYBOOK. All Rights Reserved.
