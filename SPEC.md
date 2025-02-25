# Wordpress Archive

## プロジェクトの概要
過去に書いたワードプレス記事のデータを静的サイトとして再構築するプロジェクトです。

### 背景と目的
- WordPressで運営していた個人ブログのアーカイブを作成
- 静的サイトとして配信することで、保守性とパフォーマンスを向上
- 過去の記事資産を効率的に管理・公開

### データソース
- content/cocoon_settings.txt: WordPressテーマ(Cocoon)の設定データ
- content/WordPress.2020-07-24.xml: 記事データ、メディアファイル、メタ情報等

## 技術構成

### フレームワーク
- VitePress
  - Vue.jsベースの静的サイトジェネレーター
  - Markdownファイルからの静的サイト生成
  - 高速なビルドとホットリロード
  - カスタマイズ可能なテーマシステム

### 開発環境
- Node.js
- pnpm
- Git

## データ処理方針

### XMLデータの変換
1. WordPress.2020-07-24.xmlの解析
   - 記事本文
   - メタデータ（日付、カテゴリー等）
   - 画像・メディアファイル
2. Markdownファイルへの変換
   - フロントマターの生成
   - 本文のMarkdown化
   - 画像パスの調整

### 設定データの移行
- cocoon_settings.txtの必要な設定を抽出
- VitePressの設定ファイルへ反映

## 実装ロードマップ

1. データ解析フェーズ
   - XMLパーサーの実装
   - データ構造の設計
   - 変換ルールの定義

2. 変換フェーズ
   - Markdown変換スクリプトの実装
   - メディアファイルの移行処理
   - メタデータの整形

3. サイト構築フェーズ
   - VitePressプロジェクトの設定
   - テーマのカスタマイズ
   - ページレイアウトの実装

4. デプロイフェーズ
   - ビルドプロセスの確認
   - パフォーマンステスト
   - 本番環境へのデプロイ

## 非機能要件

### パフォーマンス
- ページロード時間: 2秒以内
- First Contentful Paint: 1秒以内
- Lighthouse スコア: 90以上

### SEO
- メタデータの適切な設定
- サイトマップの生成
- 適切なURL構造の維持

### アクセシビリティ
- WAI-ARIA対応
- キーボードナビゲーション
- 適切なコントラスト比

### セキュリティ
- 静的サイトによるセキュリティリスクの最小化
- コンテンツの完全性の確保

## 注意事項
`content/WordPress.2020-07-24.xml`は10000行近くのデータを含むため、以下の方針で処理します：

1. 段階的なデータ処理
   - 小規模なサンプルデータでの検証
   - バッチ処理による段階的な変換
   - メモリ使用量の最適化

2. エラーハンドリング
   - 変換エラーのログ記録
   - 失敗した項目の再処理機能
   - データの整合性チェック
