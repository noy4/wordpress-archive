import { parseString } from 'xml2js';
import { promises as fs } from 'fs';
import { WordPressExport, WordPressPost, WordPressCategory, WordPressTag, WordPressAuthor } from '../types/wordpress.js';

interface XMLResult {
  rss: {
    channel: Array<{
      title: string[];
      link: string[];
      description: string[];
      pubDate: string[];
      language: string[];
      'wp:wxr_version': string[];
      'wp:base_site_url': string[];
      'wp:base_blog_url': string[];
      'wp:author'?: Array<{
        'wp:author_id': string[];
        'wp:author_login': string[];
        'wp:author_email': string[];
        'wp:author_display_name': string[];
        'wp:author_first_name': string[];
        'wp:author_last_name': string[];
      }>;
      'wp:category'?: Array<{
        'wp:term_id': string[];
        'wp:category_nicename': string[];
        'wp:category_parent': string[];
        'wp:cat_name': string[];
        'wp:category_description'?: string[];
      }>;
      'wp:tag'?: Array<{
        'wp:term_id': string[];
        'wp:tag_slug': string[];
        'wp:tag_name': string[];
      }>;
      item?: Array<{
        title: string[];
        link: string[];
        pubDate: string[];
        'dc:creator': string[];
        guid: Array<{
          _: string;
          $: {
            isPermaLink: string;
          };
        }>;
        description: string[];
        'content:encoded': string[];
        'excerpt:encoded': string[];
        'wp:post_id': string[];
        'wp:post_date': string[];
        'wp:post_date_gmt': string[];
        'wp:comment_status': string[];
        'wp:ping_status': string[];
        'wp:post_name': string[];
        'wp:status': string[];
        'wp:post_parent': string[];
        'wp:menu_order': string[];
        'wp:post_type': string[];
        'wp:post_password': string[];
        'wp:is_sticky': string[];
      }>;
    }>;
  };
}

export class WordPressParser {
  private xmlPath: string;

  constructor(xmlPath: string) {
    this.xmlPath = xmlPath;
  }

  async parse(): Promise<WordPressExport> {
    try {
      const xmlContent = await fs.readFile(this.xmlPath, 'utf-8');
      return new Promise((resolve, reject) => {
        parseString(xmlContent, (err: Error | null, result: XMLResult) => {
          if (err) {
            reject(err);
            return;
          }

          const channel = result.rss.channel[0];
          const wpExport: WordPressExport = {
            title: channel.title[0],
            link: channel.link[0],
            description: channel.description[0],
            pubDate: channel.pubDate[0],
            language: channel.language[0],
            wxr_version: channel['wp:wxr_version'][0],
            base_site_url: channel['wp:base_site_url'][0],
            base_blog_url: channel['wp:base_blog_url'][0],
            authors: this.parseAuthors(channel['wp:author'] || []),
            categories: this.parseCategories(channel['wp:category'] || []),
            tags: this.parseTags(channel['wp:tag'] || []),
            posts: this.parsePosts(channel.item || [])
          };

          resolve(wpExport);
        });
      });
    } catch (error) {
      console.error('Error parsing WordPress XML:', error);
      throw error;
    }
  }

  private parseAuthors(authors: NonNullable<XMLResult['rss']['channel'][0]['wp:author']>): WordPressAuthor[] {
    return authors.map(author => ({
      author_id: author['wp:author_id'][0],
      author_login: author['wp:author_login'][0],
      author_email: author['wp:author_email'][0],
      author_display_name: author['wp:author_display_name'][0],
      author_first_name: author['wp:author_first_name'][0],
      author_last_name: author['wp:author_last_name'][0]
    }));
  }

  private parseCategories(categories: NonNullable<XMLResult['rss']['channel'][0]['wp:category']>): WordPressCategory[] {
    return categories.map(category => ({
      term_id: category['wp:term_id'][0],
      category_nicename: category['wp:category_nicename'][0],
      category_parent: category['wp:category_parent'][0],
      cat_name: category['wp:cat_name'][0],
      category_description: category['wp:category_description']?.[0]
    }));
  }

  private parseTags(tags: NonNullable<XMLResult['rss']['channel'][0]['wp:tag']>): WordPressTag[] {
    return tags.map(tag => ({
      term_id: tag['wp:term_id'][0],
      tag_slug: tag['wp:tag_slug'][0],
      tag_name: tag['wp:tag_name'][0]
    }));
  }

  private parsePosts(items: NonNullable<XMLResult['rss']['channel'][0]['item']>): WordPressPost[] {
    return items.map(item => ({
      title: item.title[0],
      link: item.link[0],
      pubDate: item.pubDate[0],
      creator: item['dc:creator'][0],
      guid: {
        _: item.guid[0]._,
        $: { isPermaLink: item.guid[0].$.isPermaLink }
      },
      description: item.description[0],
      content: item['content:encoded'][0],
      excerpt: item['excerpt:encoded'][0],
      post_id: item['wp:post_id'][0],
      post_date: item['wp:post_date'][0],
      post_date_gmt: item['wp:post_date_gmt'][0],
      comment_status: item['wp:comment_status'][0],
      ping_status: item['wp:ping_status'][0],
      post_name: item['wp:post_name'][0],
      status: item['wp:status'][0],
      post_parent: item['wp:post_parent'][0],
      menu_order: item['wp:menu_order'][0],
      post_type: item['wp:post_type'][0],
      post_password: item['wp:post_password'][0],
      is_sticky: item['wp:is_sticky'][0]
    }));
  }
}

// 使用例
async function main() {
  const parser = new WordPressParser('./content/WordPress.2020-07-24.xml');
  try {
    const wpExport = await parser.parse();
    console.log('Parsed WordPress export data:');
    console.log(`Title: ${wpExport.title}`);
    console.log(`Posts: ${wpExport.posts.length}`);
    console.log(`Categories: ${wpExport.categories.length}`);
    console.log(`Tags: ${wpExport.tags.length}`);
  } catch (error) {
    console.error('Failed to parse WordPress export:', error);
  }
}

main();