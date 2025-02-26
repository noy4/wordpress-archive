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
  transform(raw) {
    return raw.map(page => {
      const [_, year, timestamp, title] = page.url.match(/(\d{4})_(\d{10})_(.+?)\.html$/)!
      const dateTime = `${year}-${timestamp.slice(0, 2)}-${timestamp.slice(2, 4)}T${timestamp.slice(4, 6)}:${timestamp.slice(6, 8)}:${timestamp.slice(8, 10)}Z`

      return {
        title: title.replace(/-/g, ' '),
        number: parseInt(timestamp, 10),
        state: page.frontmatter.state || 'open',
        created_at: dateTime,
        html_url: page.url
      }
    })
  }
})

// TypeScript用に型を定義
export type { Issue }
declare const data: Issue[]
export { data }