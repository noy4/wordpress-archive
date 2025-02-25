import { WordPressPost, WordPressCategory, WordPressTag } from '../types/wordpress';
import { promises as fs } from 'fs';

interface PageContent {
  title: string;
  content: string;
  path: string;
}

export class PageGenerator {
  private async writePage(page: PageContent): Promise<void> {
    const content = `---
layout: doc
title: ${page.title}
aside: true
---

${page.content}`;

    const dir = page.path.substring(0, page.path.lastIndexOf('/'));
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(page.path, content, 'utf-8');
  }

  private getPublishedPosts(posts: WordPressPost[]): WordPressPost[] {
    return posts
      .filter(post => post.post_type === 'post' && post.status === 'publish')
      .sort((a, b) => new Date(b.post_date).getTime() - new Date(a.post_date).getTime());
  }

  private formatPostLink(post: WordPressPost): string {
    return `- [${post.title}](/posts/${post.post_name}/) - ${new Date(post.post_date).toLocaleDateString('ja-JP')}`;
  }

  private async generateCategoryPage(categories: WordPressCategory[]): Promise<void> {
    const page: PageContent = {
      title: 'カテゴリー一覧',
      content: `# カテゴリー一覧

${categories.map(cat => `- [${cat.cat_name}](/categories/${cat.category_nicename}/)`).join('\n')}`,
      path: 'docs/categories/index.md'
    };

    await this.writePage(page);
  }

  private async generateTagPage(tags: WordPressTag[]): Promise<void> {
    const page: PageContent = {
      title: 'タグ一覧',
      content: `# タグ一覧

${tags.map(tag => `- [${tag.tag_name}](/tags/${tag.tag_slug}/)`).join('\n')}`,
      path: 'docs/tags/index.md'
    };

    await this.writePage(page);
  }

  private async updateIndexPage(posts: WordPressPost[]): Promise<void> {
    const recentPosts = this.getPublishedPosts(posts).slice(0, 5);
    const postList = recentPosts.map(this.formatPostLink).join('\n');

    const indexContent = await fs.readFile('docs/index.md', 'utf-8');
    const updatedContent = indexContent.replace(
      /<!-- 記事一覧は動的に生成されます -->/,
      postList
    );

    await fs.writeFile('docs/index.md', updatedContent, 'utf-8');
  }

  private async generatePostListPage(posts: WordPressPost[]): Promise<void> {
    const publishedPosts = this.getPublishedPosts(posts);

    const page: PageContent = {
      title: '記事一覧',
      content: `# 記事一覧

::: details 記事数: ${publishedPosts.length}件
全ての記事を時系列順に表示しています。
:::

${publishedPosts.map(this.formatPostLink).join('\n')}`,
      path: 'docs/posts/index.md'
    };

    await this.writePage(page);
  }

  async generateAll(
    posts: WordPressPost[],
    categories: WordPressCategory[],
    tags: WordPressTag[]
  ): Promise<void> {
    console.log('Generating category pages...');
    await this.generateCategoryPage(categories);

    console.log('Generating tag pages...');
    await this.generateTagPage(tags);

    console.log('Updating index page...');
    await this.updateIndexPage(posts);

    console.log('Generating post list page...');
    await this.generatePostListPage(posts);
  }
}