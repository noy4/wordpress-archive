import { HTMLConverter } from './types';
import { HTML_PATTERNS } from '../constants';

export class ShortcodeConverter implements HTMLConverter {
  pattern = HTML_PATTERNS.SHORTCODE;
  convert() { return ''; }
}

export class CommentConverter implements HTMLConverter {
  pattern = HTML_PATTERNS.COMMENT;
  convert() { return ''; }
}

export class WpBlockConverter implements HTMLConverter {
  pattern = HTML_PATTERNS.WP_BLOCK;
  convert() { return ''; }
}

export class DivConverter implements HTMLConverter {
  pattern = HTML_PATTERNS.DIV;
  convert() { return ''; }
}

export class IframeConverter implements HTMLConverter {
  pattern = HTML_PATTERNS.IFRAME;
  convert(_: string, src: string) {
    return `[外部コンテンツを表示](${src})`;
  }
}

export class FigureWithCaptionConverter implements HTMLConverter {
  pattern = HTML_PATTERNS.FIGURE_WITH_CAPTION;
  convert(_: string, src: string, caption: string) {
    return `![${caption}](${src})\n*${caption}*`;
  }
}

export class FigureConverter implements HTMLConverter {
  pattern = HTML_PATTERNS.FIGURE;
  convert(_: string, src: string) {
    return `![](${src})`;
  }
}

export class ParagraphConverter implements HTMLConverter {
  pattern = HTML_PATTERNS.PARAGRAPH;
  convert(_: string, content: string) {
    return `${content}\n\n`;
  }
}

export const createDefaultConverters = (): HTMLConverter[] => [
  new ShortcodeConverter(),
  new CommentConverter(),
  new WpBlockConverter(),
  new DivConverter(),
  new IframeConverter(),
  new FigureWithCaptionConverter(),
  new FigureConverter(),
  new ParagraphConverter()
];