import { WordPressPost } from '../types/wordpress.js';
import { promises as fs } from 'fs';
import path from 'path';

export class MarkdownConverter {
  private outputDir: string;

  constructor(outputDir: string) {
    this.outputDir = outputDir;
  }

  async convertPost(post: WordPressPost): Promise<void> {
    const content = this.generateMarkdown(post);
    const fileName = `${post.post_name}.md`;
    const filePath = path.join(this.outputDir, fileName);

    try {
      await fs.mkdir(this.outputDir, { recursive: true });
      await fs.writeFile(filePath, content, 'utf-8');
      console.log(`Converted: ${fileName}`);
    } catch (error) {
      console.error(`Error converting post ${post.post_name}:`, error);
      throw error;
    }
  }

  private generateMarkdown(post: WordPressPost): string {
    const frontMatter = this.generateFrontMatter(post);
    const content = this.cleanupContent(post.content);

    return `${frontMatter}

${content}`;
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
    // WordPress特有のショートコードを削除
    content = content.replace(/\[.*?\]/g, '');

    // HTMLコメントを削除
    content = content.replace(/<!--[\s\S]*?-->/g, '');

    // WordPressのブロックタグを変換
    content = content.replace(/<\/?wp:.*?>/g, '');

    // divタグを削除
    content = content.replace(/<\/?div[^>]*>/g, '');

    // iframeをMarkdownリンクに変換
    content = content.replace(
      /<iframe[^>]*src="([^"]*)"[^>]*>.*?<\/iframe>/g,
      (match, src) => `[外部コンテンツを表示](${src})`
    );

    // 画像タグをMarkdown形式に変換
    content = content.replace(
      /<figure[^>]*>\s*<img[^>]*src="([^"]*)"[^>]*>\s*<figcaption>(.*?)<\/figcaption>\s*<\/figure>/g,
      (match, src, caption) => `![${caption}](${src})\n*${caption}*`
    );
    content = content.replace(
      /<figure[^>]*>\s*<img[^>]*src="([^"]*)"[^>]*>\s*<\/figure>/g,
      '![]($1)'
    );

    // 残りのHTMLタグを削除
    content = content.replace(/<[^>]+>/g, '');

    // 空行の正規化
    content = content.replace(/\n{3,}/g, '\n\n');

    // エスケープされた文字を戻す
    content = content.replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");

    return content.trim();
  }

  private escapeYaml(text: string): string {
    // YAMLフロントマターでの特殊文字をエスケープ
    return text.replace(/[:#\[\]|>{}]/g, match => `\\${match}`);
  }
}