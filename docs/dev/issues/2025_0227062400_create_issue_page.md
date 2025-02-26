---
title: Issue管理ページの作成
---

# Issue管理ページの作成

## 概要
ローカルのMarkdownファイルを使用してIssueを管理するページを作成する。

## 要件
- Issueファイルは `/docs/dev/issues/` に配置
- ファイル名のフォーマット: `YYYY_MMDDHHMMSS_title.md`
- フロントマターで状態管理
- closed の issue は `xYYYY_MMDDHHMMSS_title.md` のようにファイル名の先頭に `x` を付ける
- 作成日順でソート

## 進捗
- [x] コンポーネントの作成
  - IssueList.vueコンポーネントを実装
  - レスポンシブなレイアウト
  - ステータスバッジのデザイン
- [x] ファイル読み込み処理の実装
  - フロントマターでの状態管理
  - xプレフィックスでのclosed状態の判定
  - 作成日順でのソート
- [x] UIの実装
  - hover効果の追加
  - 見やすい余白とタイポグラフィ
- [x] vitepressのbase config対応
  - ナビゲーションメニューの整理
  - サイドバー構造の改善
  - Dev セクションの階層構造の追加
- [] vitepress の base path 対応