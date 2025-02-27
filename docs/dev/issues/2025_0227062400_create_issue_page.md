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
- [x] IssueList.vueコンポーネントの作成と実装
- [x] Issue一覧の表示と状態管理の実装
- [x] UIデザインとレイアウトの調整
- [x] vitepressの設定とナビゲーション構造の整備