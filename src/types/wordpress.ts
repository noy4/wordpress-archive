export interface WordPressPost {
  title: string
  link: string
  pubDate: string
  creator: string
  guid: {
    _: string
    $: {
      isPermaLink: string
    }
  }
  description: string
  content: string
  excerpt: string
  post_id: string
  post_date: string
  post_date_gmt: string
  comment_status: string
  ping_status: string
  post_name: string
  status: string
  post_parent: string
  menu_order: string
  post_type: string
  post_password: string
  is_sticky: string
  categories: string[]
  tags: string[]
}

export interface WordPressCategory {
  term_id: string
  category_nicename: string
  category_parent: string
  cat_name: string
  category_description?: string
}

export interface WordPressTag {
  term_id: string
  tag_slug: string
  tag_name: string
}

export interface WordPressAuthor {
  author_id: string
  author_login: string
  author_email: string
  author_display_name: string
  author_first_name: string
  author_last_name: string
}

export interface WordPressExport {
  title: string
  link: string
  description: string
  pubDate: string
  language: string
  wxr_version: string
  base_site_url: string
  base_blog_url: string
  authors: WordPressAuthor[]
  categories: WordPressCategory[]
  tags: WordPressTag[]
  posts: WordPressPost[]
}
