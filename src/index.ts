import { WordPressParser } from './parsers/wordpressParser';
import { MarkdownConverter } from './utils/markdownConverter';
import { PageGenerator } from './generators/pageGenerator';
import { WordPressPost, WordPressCategory, WordPressTag } from './types/wordpress';
import { promises as fs } from 'fs';

class WordPressToMarkdownConverter {
  private parser: WordPressParser;
  private markdownConverter: MarkdownConverter;
  private pageGenerator: PageGenerator;

  constructor(xmlPath: string, outputDir: string) {
    this.parser = new WordPressParser(xmlPath);
    this.markdownConverter = new MarkdownConverter(outputDir);
    this.pageGenerator = new PageGenerator();
  }

  async convertPosts(posts: WordPressPost[]): Promise<void> {
    console.log('Converting posts...');
    const publishedPosts = posts.filter(post =>
      post.post_type === 'post' && post.status === 'publish'
    );

    for (const post of publishedPosts) {
      await this.markdownConverter.convertPost(post);
    }
  }

  async generatePages(
    posts: WordPressPost[],
    categories: WordPressCategory[],
    tags: WordPressTag[]
  ): Promise<void> {
    console.log('Generating pages...');
    await this.pageGenerator.generateAll(posts, categories, tags);
  }

  async convert(): Promise<void> {
    try {
      const wpExport = await this.parser.parse();
      await this.convertPosts(wpExport.posts);
      await this.generatePages(wpExport.posts, wpExport.categories, wpExport.tags);
      console.log('Conversion completed successfully!');
    } catch (error) {
      console.error('Error during conversion:', error);
      process.exit(1);
    }
  }
}

async function main() {
  const converter = new WordPressToMarkdownConverter(
    './content/WordPress.2020-07-24.xml',
    './docs/posts'
  );
  await converter.convert();
}

main();