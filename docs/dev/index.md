# Wordpress Archive

## プロジェクトの概要と構成
過去に書いたワードプレス記事のデータを静的サイトとして再構築するプロジェクトです。

### データソース
- content/cocoon_settings.txt: WordPressテーマ(Cocoon)の設定データ
- content/WordPress.2020-07-24.xml: 記事データ、メタ情報等

### 技術スタック
- VitePress

## 実装ロードマップ

### 1. データ処理フェーズ
- XMLデータの解析（記事、メタデータ、メディア）
- Markdownへの変換（フロントマター、本文、画像パス）

### 2. サイト構築フェーズ
- VitePressプロジェクトのセットアップ
- テーマ・レイアウトのカスタマイズ
- ページ構成の実装

### 3. デプロイフェーズ
- 本番環境へのデプロイ

## プロジェクト構造
```
docs/
├── index.md          # トップページ
├── posts/           # 記事コンテンツ
├── categories/      # カテゴリーページ
├── tags/           # タグページ
├── dev/            # 開発ドキュメント
│   ├── index.md    # 仕様書（本ファイル）
│   └── issues/     # issue 管理
└── .vitepress/     # VitePress 設定・テーマ
```

