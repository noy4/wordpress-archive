import type { WordPressPost } from '../types/wordpress'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import TurndownService from 'turndown'
import { YAML_PATTERNS } from './constants'
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
      const fileName = this.generateFileName(post)
      await this.writeMarkdownFile(fileName, content)
      console.warn(`Converted: ${fileName}`)
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

  private generateFileName(post: WordPressPost): string {
    const date = this.formatDate(post.post_date_gmt)
    const name = post.post_name.includes('%')
      ? decodeURIComponent(post.post_name)
      : post.post_name
    return `${date}-${name}.md`
  }

  private formatDate(dateStr: string): string {
    return new Date(dateStr).toISOString().split('T')[0]
  }

  private async writeMarkdownFile(fileName: string, content: string): Promise<void> {
    const filePath = path.join(this.outputDir, fileName)

    try {
      await fs.mkdir(this.outputDir, { recursive: true })
      await fs.writeFile(filePath, content, 'utf-8')
    }
    catch (error) {
      throw new MarkdownConversionError(
        'Error writing markdown file',
        fileName,
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
    // HTMLから最初のテキストブロックを抽出
    const text = content
      .replace(/<[^>]*>/g, '') // HTMLタグを削除
      .replace(/\s+/g, ' ') // 複数の空白を1つに
      .trim() // 前後の空白を削除

    // 120文字以上なら117文字に切り詰めて「...」を追加
    return text.length > 120
      ? `${text.slice(0, 117)}...`
      : text
  }

  private generateFrontMatter(post: WordPressPost): string {
    const date = this.formatDate(post.post_date_gmt)
    const categories = post.categories.length > 0
      ? `\ncategories: [${post.categories.map(c => `"${c}"`).join(', ')}]`
      : ''
    const tags = post.tags.length > 0
      ? `\ntags: [${post.tags.map(t => `"${t}"`).join(', ')}]`
      : ''
    const description = this.extractDescription(post.content)
    const descriptionSection = description
      ? `\ndescription: ${this.escapeYaml(description)}`
      : ''

    return `---
title: ${this.escapeYaml(post.title)}${descriptionSection}
date: ${date}${categories}${tags}
---`
  }

  private escapeYaml(text: string): string {
    return text.replace(YAML_PATTERNS.SPECIAL_CHARS, match => `\\${match}`)
  }
}
