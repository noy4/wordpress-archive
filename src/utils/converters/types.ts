export interface HTMLConverter {
  pattern: RegExp
  convert: (match: string, ...args: string[]) => string
}
