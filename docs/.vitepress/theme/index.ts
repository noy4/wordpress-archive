import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import PostItems from './components/PostItems.vue'
import PostList from './components/PostList.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('PostItems', PostItems)
    app.component('PostList', PostList)
  },
} satisfies Theme
