<script setup lang="ts">
import { data as posts } from '../posts.data'
import { withBase } from 'vitepress'
</script>

<template>
  <div class="post-list">
    <div class="post-count">
      記事数: {{ posts.length }}件
    </div>

    <ul>
      <li v-for="post in posts" :key="post.url">
        <a :href="withBase(post.url)">{{ post.title }}</a>
        <span class="post-date" v-if="post.date">
          - {{ new Date(post.date).toLocaleDateString('ja-JP') }}
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.post-count {
  margin-top: 1rem;
}

.post-date {
  color: var(--vp-c-text-2);
}
</style>