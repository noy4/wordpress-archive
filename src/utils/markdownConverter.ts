import { WordPressPost } from '../types/wordpress';
import { promises as fs } from 'fs';
import path from 'path';

const HTML_PATTERNS = {
  SHORTCODE: /\[.*?\]/g,
  COMMENT: /<!--[\s\S]*?-->/g,
  WP_BLOCK: /<\/?wp:.*?>/g,
  DIV: /<\/?div[^>]*>/g,
  IFRAME: /<iframe[^>]*src="([^"]*)"[^>]*>.*?<\/iframe>/g,
  FIGURE_WITH_CAPTION: /<figure[^>]*>\s*<img[^>]*src="([^"]*)"[^>]*>\s*<figcaption>(.*?)<\/figcaption>\s*<\/figure>/g,
  FIGURE: /<figure[^>]*>\s*<img[^>]*src="([^"]*)"[^>]*>\s*<\/figure>/g,
  PARAGRAPH: /<p[^>]*>(.*?)<\/p>/g,
  REMAINING_TAGS: /<[^>]+>/g,
  MULTIPLE_NEWLINES: /\n{3,}/g,
  YAML_SPECIAL_CHARS: /[:#\[\]|>{}]/g
} as const;

const HTML_ENTITIES = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#039;': "'"
} as const;

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6] as const;

interface HTMLConverter {
  pattern: RegExp;
  convert: (match: string, ...args: string[]) => string;
}

export class MarkdownConverter {
  private outputDir: string;
  private converters: HTMLConverter[];

  constructor(outputDir: string) {
    this.outputDir = outputDir;
    this.converters = this.initializeConverters();
  }

  private initializeConverters(): HTMLConverter[] {
    return [
      {
        pattern: HTML_PATTERNS.SHORTCODE,
        convert: () => ''
      },
      {
        pattern: HTML_PATTERNS.COMMENT,
        convert: () => ''
      },
      {
        pattern: HTML_PATTERNS.WP_BLOCK,
        convert: () => ''
      },
      {
        pattern: HTML_PATTERNS.DIV,
        convert: () => ''
      },
      {
        pattern: HTML_PATTERNS.IFRAME,
        convert: (_, src) => `[外部コンテンツを表示](${src})`
      },
      {
        pattern: HTML_PATTERNS.FIGURE_WITH_CAPTION,
        convert: (_, src, caption) => `![${caption}](${src})\n*${caption}*`
      },
      {
        pattern: HTML_PATTERNS.FIGURE,
        convert: (_, src) => `![](${src})`
      },
      {
        pattern: HTML_PATTERNS.PARAGRAPH,
        convert: (_, content) => `${content}\n\n`
      }
    ];
  }

  async convertPost(post: WordPressPost): Promise<void> {
    try {
      const content = this.generateMarkdown(post);
      await this.writeMarkdownFile(post.post_name, content);
      console.log(`Converted: ${post.post_name}.md`);
    } catch (error) {
      this.handleError(`Error converting post ${post.post_name}`, error);
      throw error;
    }
  }

  private async writeMarkdownFile(postName: string, content: string): Promise<void> {
    const fileName = `${postName}.md`;
    const filePath = path.join(this.outputDir, fileName);
    await fs.mkdir(this.outputDir, { recursive: true });
    await fs.writeFile(filePath, content, 'utf-8');
  }

  private generateMarkdown(post: WordPressPost): string {
    const frontMatter = this.generateFrontMatter(post);
    const content = this.cleanupContent(post.content);
    return `${frontMatter}\n\n${content}`;
  }

  private generateFrontMatter(post: WordPressPost): string {
    const date = new Date(post.post_date_gmt).toISOString().split('T')[0];
    return `---
title: ${this.escapeYaml(post.title)}
date: ${date}
layout: doc
---`;
  }

  private cleanupContent(content: string): string {
    let result = content;

    // HTMLタグの変換
    result = this.applyConverters(result);

    // 見出しタグの変換
    result = this.convertHeadings(result);

    // 残りのHTMLタグを削除
    result = result.replace(HTML_PATTERNS.REMAINING_TAGS, '');

    // 空行の正規化
    result = result.replace(HTML_PATTERNS.MULTIPLE_NEWLINES, '\n\n');

    // HTMLエンティティのデコード
    result = this.decodeHTMLEntities(result);

    return result.trim();
  }

  private applyConverters(content: string): string {
    return this.converters.reduce(
      (result, converter) => result.replace(converter.pattern, converter.convert),
      content
    );
  }

  private convertHeadings(content: string): string {
    return HEADING_LEVELS.reduce((result, level) => {
      const pattern = new RegExp(`<h${level}[^>]*>(.*?)<\/h${level}>`, 'g');
      return result.replace(pattern, `${'#'.repeat(level)} $1`);
    }, content);
  }

  private decodeHTMLEntities(content: string): string {
    return Object.entries(HTML_ENTITIES).reduce(
      (result, [entity, char]) => result.replace(new RegExp(entity, 'g'), char),
      content
    );
  }

  private escapeYaml(text: string): string {
    return text.replace(HTML_PATTERNS.YAML_SPECIAL_CHARS, match => `\\${match}`);
  }

  private handleError(message: string, error: unknown): void {
    console.error(`${message}:`, error);
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack);
    }
  }
}