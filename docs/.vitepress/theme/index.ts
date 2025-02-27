import type { Theme } from 'vitepress'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import PostItems from './components/PostItems.vue'
import PostList from './components/PostList.vue'
import PostTitle from './components/PostTitle.vue'
import 'virtual:uno.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('PostItems', PostItems)
    app.component('PostList', PostList)
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => {
        const { page } = useData()
        if (page.value.relativePath.match(/^posts\/(?!index.md)/)) {
          return h(PostTitle)
        }
      },
    })
  },
} satisfies Theme
