import { defineConfig } from 'vitepress';

export default defineConfig({
  title: '桑日記',
  description: '桑の日常をあなたにお届け',
  ignoreDeadLinks: true,

  // GitHub Pagesでのデプロイを想定したベースURL
  base: '/wordpress-archive/',

  // テーマの設定
  themeConfig: {
    // ロゴの設定
    logo: '/shacho.png',

    // サイトのナビゲーション
    nav: [
      { text: '記事一覧', link: '/posts/' },
      { text: 'Dev', link: '/dev/issues/' },
    ],

    // サイドバーの設定
    sidebar: {
      '/': [
        { text: '記事一覧', link: '/posts/' },
        { text: 'カテゴリー', link: '/categories/' },
        { text: 'タグ', link: '/tags/' },
      ],
      '/dev/': [
        { text: 'Issues', link: '/dev/issues/' }
      ]
    },

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

  // 多言語設定
  locales: {
    root: {
      label: '日本語',
      lang: 'ja'
    }
  }
});