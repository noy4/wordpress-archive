# `@antfu/eslint-config` のセットアップ

## 作業内容
1. パッケージのインストール
```bash
npm install -D eslint @antfu/eslint-config
```

2. ESLint設定ファイルの作成
```js
// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['**/*.md'],
})
```

3. package.jsonにlintスクリプトを追加
```json
"lint": "eslint .",
"lint:fix": "eslint . --fix"
```
