export const HTML_PATTERNS = {
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
  YAML_SPECIAL_CHARS: /[:#[\]|>{}]/g,
} as const

export const HTML_ENTITIES = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#039;': '\'',
} as const

export const HEADING_LEVELS = [1, 2, 3, 4, 5, 6] as const
