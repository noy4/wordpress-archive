export interface XMLAuthor {
  'wp:author_id': string[];
  'wp:author_login': string[];
  'wp:author_email': string[];
  'wp:author_display_name': string[];
  'wp:author_first_name': string[];
  'wp:author_last_name': string[];
}

export interface XMLCategory {
  'wp:term_id': string[];
  'wp:category_nicename': string[];
  'wp:category_parent': string[];
  'wp:cat_name': string[];
  'wp:category_description'?: string[];
}

export interface XMLTag {
  'wp:term_id': string[];
  'wp:tag_slug': string[];
  'wp:tag_name': string[];
}

export interface XMLGuid {
  _: string;
  $: {
    isPermaLink: string;
  };
}

export interface XMLItem {
  title: string[];
  link: string[];
  pubDate: string[];
  'dc:creator': string[];
  guid: XMLGuid[];
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
}

export interface XMLChannel {
  title: string[];
  link: string[];
  description: string[];
  pubDate: string[];
  language: string[];
  'wp:wxr_version': string[];
  'wp:base_site_url': string[];
  'wp:base_blog_url': string[];
  'wp:author'?: XMLAuthor[];
  'wp:category'?: XMLCategory[];
  'wp:tag'?: XMLTag[];
  item?: XMLItem[];
}

export interface XMLResult {
  rss: {
    channel: XMLChannel[];
  };
}