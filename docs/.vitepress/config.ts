import type { HeadConfig } from 'vitepress'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vitepress'

const title = '桑日記'
const base = '/wordpress-archive/'

export default defineConfig({
  // UnoCSSの設定
  vite: {
    plugins: [UnoCSS()],
  },

  title,
  description: '桑の日常をあなたにお届け',
  ignoreDeadLinks: true,

  // GitHub Pagesでのデプロイを想定したベースURL
  base,

  // faviconとOGPの設定
  head: [
    ['link', { rel: 'icon', href: `${base}shacho.png` }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:image', content: `https://noy4.github.io${base}shacho.png` }],
    ['meta', { property: 'og:url', content: `https://noy4.github.io${base}` }],
    ['meta', { property: 'twitter:card', content: 'summary' }],
    ['meta', { property: 'twitter:image', content: `https://noy4.github.io${base}shacho.png` }],
  ],

  // headタグの変換
  transformHead({ pageData }) {
    const head: HeadConfig[] = []

    const pageTitle = pageData.frontmatter.layout === 'home'
      ? title
      : `${pageData.title} | ${title}`

    // title用のメタタグを追加
    head.push(
      ['meta', { property: 'og:title', content: pageTitle }],
      ['meta', { property: 'twitter:title', content: pageTitle }],
    )

    // descriptionがある場合のみdescription用のメタタグを追加
    const description = pageData.description
    if (description) {
      head.push(
        ['meta', { property: 'og:description', content: description }],
        ['meta', { property: 'twitter:description', content: description }],
      )
    }

    return head
  },

  // URLリライトの設定
  rewrites(id) {
    // issuesディレクトリ内のファイルの日時情報を除去
    if (id.startsWith('dev/issues/'))
      return id.replace(/^dev\/issues\/x?\d{4}_\d{10}_/, 'dev/issues/')

    // postsディレクトリ内のファイルのタイムスタンプを除去
    if (id.startsWith('posts/'))
      return id.replace(/^posts\/\d{4}-\d{2}-\d{2}-/, 'posts/')

    return id
  },

  // テーマの設定
  themeConfig: {
    // ロゴの設定
    logo: '/shacho.png',

    // サイトのナビゲーション
    nav: [
      { text: '記事一覧', link: '/posts/', activeMatch: '/posts/' },
      {
        text: 'Dev',
        activeMatch: '/dev/',
        items: [
          { text: '仕様', link: '/dev/' },
          { text: 'Issues', link: '/dev/issues/' },
        ],
      },
    ],

    // サイドバーの設定
    sidebar: {
      '/': [
        { text: '記事一覧', link: '/posts/' },
        { text: 'カテゴリー', link: '/categories/' },
        { text: 'タグ', link: '/tags/' },
      ],
      '/dev/': [
        {
          text: 'Dev',
          items: [
            { text: '仕様', link: '/dev/' },
            { text: '記事一覧', link: '/dev/posts' },
            { text: 'Issues', link: '/dev/issues/' },
          ],
        },
      ],
    },

    // フッターの設定
    footer: {
      message: 'Powered by VitePress',
      copyright: `© ${new Date().getFullYear()} 桑日記`,
    },

    // ソーシャルリンク
    socialLinks: [
      { icon: 'github', link: 'https://github.com/noy4/wordpress-archive' },
    ],
  },

  // 多言語設定
  locales: {
    root: {
      label: '日本語',
      lang: 'ja',
    },
  },
})
