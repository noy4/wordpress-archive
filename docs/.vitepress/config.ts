import { defineConfig } from 'vitepress';

export default defineConfig({
  title: '桑日記',
  description: '桑の日常をあなたにお届け',

  // GitHub Pagesでのデプロイを想定したベースURL
  base: '/wordpress-archive/',

  // テーマの設定
  themeConfig: {
    // サイトのナビゲーション
    nav: [
      { text: 'ホーム', link: '/' },
      { text: '記事一覧', link: '/posts/' },
      { text: 'カテゴリー', link: '/categories/' },
      { text: 'タグ', link: '/tags/' }
    ],

    // サイドバーの設定
    sidebar: [
      {
        text: 'ナビゲーション',
        items: [
          { text: 'ホーム', link: '/' },
          { text: '記事一覧', link: '/posts/' },
          { text: 'カテゴリー', link: '/categories/' },
          { text: 'タグ', link: '/tags/' }
        ]
      }
    ],

    // フッターの設定
    footer: {
      message: 'Powered by VitePress',
      copyright: `© ${new Date().getFullYear()} 桑日記`
    },

    // ソーシャルリンク
    socialLinks: [
      { icon: 'github', link: 'https://github.com/noy4/wordpress-archive' }
    ]
  },

  // Markdownの設定
  markdown: {
    lineNumbers: true,
    // コードブロックの設定
    theme: 'github-dark',
    // 目次の設定
    toc: { level: [2, 3] }
  },

  // 多言語設定
  locales: {
    root: {
      label: '日本語',
      lang: 'ja'
    }
  }
});