import { WordPressParser } from './parsers/wordpressParser.js';
import { MarkdownConverter } from './utils/markdownConverter.js';
import { promises as fs } from 'fs';
import path from 'path';

async function generateCategoryPage(categories: any[]) {
  const content = `---
layout: doc
title: カテゴリー一覧
aside: true
---

# カテゴリー一覧

${categories.map(cat => `- [${cat.cat_name}](/categories/${cat.category_nicename}/)`).join('\n')}
`;

  await fs.mkdir('docs/categories', { recursive: true });
  await fs.writeFile('docs/categories/index.md', content, 'utf-8');
}

async function generateTagPage(tags: any[]) {
  const content = `---
layout: doc
title: タグ一覧
aside: true
---

# タグ一覧

${tags.map(tag => `- [${tag.tag_name}](/tags/${tag.tag_slug}/)`).join('\n')}
`;

  await fs.mkdir('docs/tags', { recursive: true });
  await fs.writeFile('docs/tags/index.md', content, 'utf-8');
}

async function updateIndexPage(posts: any[]) {
  const recentPosts = posts
    .filter(post => post.post_type === 'post' && post.status === 'publish')
    .sort((a, b) => new Date(b.post_date).getTime() - new Date(a.post_date).getTime())
    .slice(0, 5);

  const postList = recentPosts
    .map(post => `- [${post.title}](/posts/${post.post_name}/) - ${new Date(post.post_date).toLocaleDateString('ja-JP')}`)
    .join('\n');

  const indexContent = await fs.readFile('docs/index.md', 'utf-8');
  const updatedContent = indexContent.replace(
    /<!-- 記事一覧は動的に生成されます -->/,
    postList
  );

  await fs.writeFile('docs/index.md', updatedContent, 'utf-8');
}

async function generatePostListPage(posts: any[]) {
  const publishedPosts = posts
    .filter(post => post.post_type === 'post' && post.status === 'publish')
    .sort((a, b) => new Date(b.post_date).getTime() - new Date(a.post_date).getTime());

  const content = `---
layout: doc
title: 記事一覧
aside: true
---

# 記事一覧

::: details 記事数: ${publishedPosts.length}件
全ての記事を時系列順に表示しています。
:::

${publishedPosts
      .map(post => `- [${post.title}](/posts/${post.post_name}/) - ${new Date(post.post_date).toLocaleDateString('ja-JP')}`)
      .join('\n')}
`;

  await fs.writeFile('docs/posts/index.md', content, 'utf-8');
}

async function main() {
  try {
    // WordPressデータの解析
    const parser = new WordPressParser('./content/WordPress.2020-07-24.xml');
    const wpExport = await parser.parse();

    // Markdownコンバーターの初期化
    const converter = new MarkdownConverter('./docs/posts');

    // 投稿の変換
    console.log('Converting posts...');
    for (const post of wpExport.posts) {
      if (post.post_type === 'post' && post.status === 'publish') {
        await converter.convertPost(post);
      }
    }

    // カテゴリーページの生成
    console.log('Generating category pages...');
    await generateCategoryPage(wpExport.categories);

    // タグページの生成
    console.log('Generating tag pages...');
    await generateTagPage(wpExport.tags);

    // インデックスページの更新
    console.log('Updating index page...');
    await updateIndexPage(wpExport.posts);

    // 記事一覧ページの生成
    console.log('Generating post list page...');
    await generatePostListPage(wpExport.posts);

    console.log('Conversion completed successfully!');
  } catch (error) {
    console.error('Error during conversion:', error);
    process.exit(1);
  }
}

main();