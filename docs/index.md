---
layout: home
title: ホーム

hero:
  name: 桑日記
  text: 桑の日常をあなたにお届け
  tagline: WordPressブログのアーカイブ
  image:
    src: /shacho.png
    alt: 社長の画像
  actions:
    - theme: brand
      text: 記事一覧を見る
      link: /posts/
    - theme: alt
      text: カテゴリーを見る
      link: /categories/
---

::: tip 最近の記事
<script setup>
import { data as allPosts } from './.vitepress/theme/posts.data'
</script>

<PostItems :posts="allPosts" :limit="5" />
:::