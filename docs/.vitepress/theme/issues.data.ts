import { createContentLoader } from 'vitepress'

interface Issue {
  title: string
  number: number
  state: 'open' | 'closed'
  created_at: string
  html_url: string
}

// マークダウンファイルからIssuesデータを生成
export default createContentLoader('dev/issues/!(index).md', {
  includeSrc: true,
  transform(raw) {
    return raw.map((page) => {
      // ファイル名からx接頭辞とタイムスタンプを解析
      const fileName = page.url.split('/').pop()!
      const isClosed = fileName.startsWith('x')
      const [_, year, timestamp, title] = fileName.match(/x?(\d{4})_(\d{10})_(.+?)\.html$/)!

      // タイムスタンプからDateTime文字列を生成
      const dateTime = `${year}-${timestamp.slice(0, 2)}-${timestamp.slice(2, 4)}T${timestamp.slice(4, 6)}:${timestamp.slice(6, 8)}:${timestamp.slice(8, 10)}Z`

      // マークダウンから最初のh1を抽出
      const h1Match = page.src?.match(/^#\s+([^\n]+)/m)
      const h1Title = h1Match?.[1]?.trim()

      return {
        title: page.frontmatter.title || h1Title || title.replace(/-/g, ' '),
        number: Number.parseInt(timestamp, 10),
        state: isClosed ? 'closed' : (page.frontmatter.state || 'open'),
        created_at: dateTime,
        html_url: page.url.replace(/^\/dev\/issues\/x?\d{4}_\d{10}_/, '/dev/issues/'),
      }
    }).sort((a, b) => {
      // 作成日の降順でソート
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  },
})

// TypeScript用に型を定義
export type { Issue }
declare const data: Issue[]
export { data }
