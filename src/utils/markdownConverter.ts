import type { WordPressPost } from '../types/wordpress'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import TurndownService from 'turndown'
import { HTML_PATTERNS } from './constants'
import { MarkdownConversionError } from './errors'

export class MarkdownConverter {
  private outputDir: string
  private turndown: TurndownService

  constructor(outputDir: string) {
    this.outputDir = outputDir
    this.turndown = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      bulletListMarker: '-',
    })

    // プリフォーマット済みテキストの変換をカスタマイズ
    this.turndown.addRule('pre', {
      filter: ['pre'],
      replacement: (content) => {
        return `\n\`\`\`\n${content}\n\`\`\`\n`
      },
    })
  }

  async convertPost(post: WordPressPost): Promise<void> {
    try {
      const content = this.generateMarkdown(post)
      const date = new Date(post.post_date_gmt).toISOString().split('T')[0]
      const fileName = post.post_name.includes('%')
        ? decodeURIComponent(post.post_name)
        : post.post_name
      await this.writeMarkdownFile(fileName, content, date)
      console.warn(`Converted: ${fileName}.md`)
    }
    catch (error) {
      const conversionError = new MarkdownConversionError(
        'Error converting post',
        post.post_name,
        error instanceof Error ? error : undefined,
      )
      console.error(conversionError.toString())
      throw conversionError
    }
  }

  private async writeMarkdownFile(postName: string, content: string, date: string): Promise<void> {
    const fileName = `${date}-${postName}.md`
    const filePath = path.join(this.outputDir, fileName)

    try {
      await fs.mkdir(this.outputDir, { recursive: true })
      await fs.writeFile(filePath, content, 'utf-8')
    }
    catch (error) {
      throw new MarkdownConversionError(
        'Error writing markdown file',
        postName,
        error instanceof Error ? error : undefined,
      )
    }
  }

  private generateMarkdown(post: WordPressPost): string {
    const frontMatter = this.generateFrontMatter(post)
    const content = this.turndown.turndown(post.content)
    return `${frontMatter}\n\n${content}`
  }

  private extractDescription(content: string): string {
    // 最初の段落のHTMLを直接Markdownに変換し、プレーンテキストとして扱う
    const firstParagraph = content.match(/<p[^>]*>(.*?)<\/p>/)?.[1] || ''
    const description = this.turndown.turndown(firstParagraph)
      .replace(/\s+/g, ' ') // 複数の空白を1つに
      .trim()

    // 120文字以内に収める
    return description.length > 120 ? `${description.slice(0, 117)}...` : description
  }

  private generateFrontMatter(post: WordPressPost): string {
    const date = new Date(post.post_date_gmt).toISOString().split('T')[0]
    const categories = post.categories.length > 0 ? `\ncategories: [${post.categories.map(c => `"${c}"`).join(', ')}]` : ''
    const tags = post.tags.length > 0 ? `\ntags: [${post.tags.map(t => `"${t}"`).join(', ')}]` : ''
    const description = this.extractDescription(post.content)

    const hasDescription = description && description.length > 0
    const descriptionSection = hasDescription ? `\ndescription: ${this.escapeYaml(description)}` : ''

    return `---
title: ${this.escapeYaml(post.title)}${descriptionSection}
date: ${date}${categories}${tags}
---`
  }

  private escapeYaml(text: string): string {
    return text.replace(HTML_PATTERNS.YAML_SPECIAL_CHARS, match => `\\${match}`)
  }
}
