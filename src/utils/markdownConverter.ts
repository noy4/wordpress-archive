import { WordPressPost } from '../types/wordpress';
import { promises as fs } from 'fs';
import path from 'path';
import { HTML_PATTERNS, HTML_ENTITIES, HEADING_LEVELS } from './constants';
import { HTMLConverter } from './converters/types';
import { createDefaultConverters } from './converters/implementations';
import { MarkdownConversionError } from './errors';

export class MarkdownConverter {
  private outputDir: string;
  private converters: HTMLConverter[];

  constructor(outputDir: string) {
    this.outputDir = outputDir;
    this.converters = createDefaultConverters();
  }

  async convertPost(post: WordPressPost): Promise<void> {
    try {
      const content = this.generateMarkdown(post);
      const date = new Date(post.post_date_gmt).toISOString().split('T')[0];
      const fileName = post.post_name.includes('%')
        ? decodeURIComponent(post.post_name)
        : post.post_name;
      await this.writeMarkdownFile(fileName, content, date);
      console.log(`Converted: ${fileName}.md`);
    } catch (error) {
      const conversionError = new MarkdownConversionError(
        'Error converting post',
        post.post_name,
        error instanceof Error ? error : undefined
      );
      console.error(conversionError.toString());
      throw conversionError;
    }
  }

  private async writeMarkdownFile(postName: string, content: string, date: string): Promise<void> {
    const fileName = `${date}-${postName}.md`;
    const filePath = path.join(this.outputDir, fileName);

    try {
      await fs.mkdir(this.outputDir, { recursive: true });
      await fs.writeFile(filePath, content, 'utf-8');
    } catch (error) {
      throw new MarkdownConversionError(
        'Error writing markdown file',
        postName,
        error instanceof Error ? error : undefined
      );
    }
  }

  private generateMarkdown(post: WordPressPost): string {
    const frontMatter = this.generateFrontMatter(post);
    const title = `# ${post.title}`;
    const content = this.cleanupContent(post.content);
    return `${frontMatter}\n\n${title}\n\n${content}`;
  }

  private generateFrontMatter(post: WordPressPost): string {
    const date = new Date(post.post_date_gmt).toISOString().split('T')[0];
    const categories = post.categories.length > 0 ? `\ncategories: [${post.categories.map(c => `"${c}"`).join(', ')}]` : '';
    const tags = post.tags.length > 0 ? `\ntags: [${post.tags.map(t => `"${t}"`).join(', ')}]` : '';

    return `---
title: ${this.escapeYaml(post.title)}
date: ${date}${categories}${tags}
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
      (result, converter) => result.replace(converter.pattern, (...args) => converter.convert(...args)),
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
}