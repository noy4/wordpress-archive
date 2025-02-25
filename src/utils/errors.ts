export class MarkdownConversionError extends Error {
  constructor(
    message: string,
    public readonly postName?: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'MarkdownConversionError';

    // Errorのプロトタイプチェーンを正しく設定
    Object.setPrototypeOf(this, MarkdownConversionError.prototype);
  }

  toString(): string {
    let errorMessage = `${this.name}: ${this.message}`;
    if (this.postName) {
      errorMessage += `\nPost: ${this.postName}`;
    }
    if (this.originalError?.stack) {
      errorMessage += `\nOriginal Error: ${this.originalError.stack}`;
    }
    return errorMessage;
  }
}