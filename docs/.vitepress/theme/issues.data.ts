import { createContentLoader } from 'vitepress'

interface Issue {
  title: string
  number: number
  state: 'open' | 'closed'
  created_at: string
  html_url: string
}

// マークダウンファイルからIssuesデータを生成
export default createContentLoader('dev/issues/*.md', {
  transform(raw) {
    return raw.map(page => {
      const filename = page.url.split('/').pop()?.replace('.html', '')
      if (!filename) return null

      // ファイル名から情報を抽出 (例: 2025_0227062400_create_issue_page.md)
      const [year, timestamp, ...titleParts] = filename.split('_')
      const dateTime = `${year}-${timestamp.slice(0, 2)}-${timestamp.slice(2, 4)}T${timestamp.slice(4, 6)}:${timestamp.slice(6, 8)}:${timestamp.slice(8, 10)}Z`

      const issue: Issue = {
        title: titleParts.join('_').replace(/-/g, ' ').replace('.md', ''),
        number: parseInt(timestamp, 10),
        state: page.frontmatter.state || 'open',
        created_at: dateTime,
        html_url: page.url
      }

      return issue
    }).filter((issue): issue is Issue => issue !== null)
  }
})

// TypeScript用に型を定義
export type { Issue }
declare const data: Issue[]
export { data }