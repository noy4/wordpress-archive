import { parseString } from 'xml2js';
import { promises as fs } from 'fs';
import { promisify } from 'util';
import { WordPressExport, WordPressPost, WordPressCategory, WordPressTag, WordPressAuthor } from '../types/wordpress';
import { XMLAuthor, XMLCategory, XMLChannel, XMLItem, XMLResult, XMLTag } from '../types/wordpress-xml';

const parseXMLString = promisify<string, XMLResult>(parseString);

export class WordPressParser {
  private xmlPath: string;

  constructor(xmlPath: string) {
    this.xmlPath = xmlPath;
  }

  async parse(): Promise<WordPressExport> {
    try {
      const xmlContent = await this.readXMLFile();
      const result = await this.parseXMLContent(xmlContent);
      return this.convertToWordPressExport(result);
    } catch (error) {
      this.handleError('Error parsing WordPress XML', error);
      throw error;
    }
  }

  private async readXMLFile(): Promise<string> {
    try {
      return await fs.readFile(this.xmlPath, 'utf-8');
    } catch (error) {
      this.handleError('Error reading XML file', error);
      throw error;
    }
  }

  private async parseXMLContent(xmlContent: string): Promise<XMLResult> {
    try {
      return await parseXMLString(xmlContent);
    } catch (error) {
      this.handleError('Error parsing XML content', error);
      throw error;
    }
  }

  private convertToWordPressExport(result: XMLResult): WordPressExport {
    const channel = result.rss.channel[0];
    return {
      title: this.getFirstValue(channel.title),
      link: this.getFirstValue(channel.link),
      description: this.getFirstValue(channel.description),
      pubDate: this.getFirstValue(channel.pubDate),
      language: this.getFirstValue(channel.language),
      wxr_version: this.getFirstValue(channel['wp:wxr_version']),
      base_site_url: this.getFirstValue(channel['wp:base_site_url']),
      base_blog_url: this.getFirstValue(channel['wp:base_blog_url']),
      authors: this.parseAuthors(channel['wp:author'] || []),
      categories: this.parseCategories(channel['wp:category'] || []),
      tags: this.parseTags(channel['wp:tag'] || []),
      posts: this.parsePosts(channel.item || [])
    };
  }

  private getFirstValue(array: string[] | undefined): string {
    return array?.[0] ?? '';
  }

  private parseAuthors(authors: XMLAuthor[]): WordPressAuthor[] {
    return authors.map(author => ({
      author_id: this.getFirstValue(author['wp:author_id']),
      author_login: this.getFirstValue(author['wp:author_login']),
      author_email: this.getFirstValue(author['wp:author_email']),
      author_display_name: this.getFirstValue(author['wp:author_display_name']),
      author_first_name: this.getFirstValue(author['wp:author_first_name']),
      author_last_name: this.getFirstValue(author['wp:author_last_name'])
    }));
  }

  private parseCategories(categories: XMLCategory[]): WordPressCategory[] {
    return categories.map(category => ({
      term_id: this.getFirstValue(category['wp:term_id']),
      category_nicename: this.getFirstValue(category['wp:category_nicename']),
      category_parent: this.getFirstValue(category['wp:category_parent']),
      cat_name: this.getFirstValue(category['wp:cat_name']),
      category_description: this.getFirstValue(category['wp:category_description'])
    }));
  }

  private parseTags(tags: XMLTag[]): WordPressTag[] {
    return tags.map(tag => ({
      term_id: this.getFirstValue(tag['wp:term_id']),
      tag_slug: this.getFirstValue(tag['wp:tag_slug']),
      tag_name: this.getFirstValue(tag['wp:tag_name'])
    }));
  }

  private parsePosts(items: XMLItem[]): WordPressPost[] {
    return items.map(item => ({
      title: this.getFirstValue(item.title),
      link: this.getFirstValue(item.link),
      pubDate: this.getFirstValue(item.pubDate),
      creator: this.getFirstValue(item['dc:creator']),
      guid: {
        _: item.guid[0]._,
        $: { isPermaLink: item.guid[0].$.isPermaLink }
      },
      description: this.getFirstValue(item.description),
      content: this.getFirstValue(item['content:encoded']),
      excerpt: this.getFirstValue(item['excerpt:encoded']),
      post_id: this.getFirstValue(item['wp:post_id']),
      post_date: this.getFirstValue(item['wp:post_date']),
      post_date_gmt: this.getFirstValue(item['wp:post_date_gmt']),
      comment_status: this.getFirstValue(item['wp:comment_status']),
      ping_status: this.getFirstValue(item['wp:ping_status']),
      post_name: this.getFirstValue(item['wp:post_name']),
      status: this.getFirstValue(item['wp:status']),
      post_parent: this.getFirstValue(item['wp:post_parent']),
      menu_order: this.getFirstValue(item['wp:menu_order']),
      post_type: this.getFirstValue(item['wp:post_type']),
      post_password: this.getFirstValue(item['wp:post_password']),
      is_sticky: this.getFirstValue(item['wp:is_sticky'])
    }));
  }

  private handleError(message: string, error: unknown): void {
    console.error(`${message}:`, error);
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack);
    }
  }
}