import { createContentLoader } from 'vitepress'

export interface Post {
  title: string
  url: string
  date: string
  categories?: string[]
  tags?: string[]
}

export default createContentLoader('posts/!(index).md', {
  transform(raw): Post[] {
    return raw
      .map(page => ({
        title: page.frontmatter.title,
        url: page.url.replace(/^\/posts\/(\d{4}-\d{2}-\d{2}-)/, '/posts/'),
        date: page.frontmatter.date || '',
        categories: page.frontmatter.categories || [],
        tags: page.frontmatter.tags || [],
      }))
      .sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })
  },
})

// Type-only export for the data
declare const data: Post[]
export { data }
