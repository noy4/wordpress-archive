<script setup lang="ts">
import type { Post } from '../posts.data'
import { computed } from 'vue'
import { data as allPosts } from '../posts.data'
import PostItems from './PostItems.vue'

function getPostsByYear(posts: Post[]) {
  const postsByYear = new Map<string, Post[]>()

  posts.forEach((post) => {
    const year = new Date(post.date).getFullYear().toString()
    const postsInYear = postsByYear.get(year) || []
    postsByYear.set(year, [...postsInYear, post])
  })

  return postsByYear
}

const postsByYear = computed(() => getPostsByYear(allPosts))
</script>

<template>
  <div class="post-list">
    <div class="post-count">
      記事数: {{ allPosts.length }}件
    </div>

    <div
      v-for="[year, postsInYear] in postsByYear"
      :key="year"
      class="year-group"
    >
      <h2 class="year-heading">
        {{ year }}年
      </h2>
      <PostItems :posts="postsInYear" />
    </div>
  </div>
</template>

<style scoped>
.post-count {
  margin-top: 1rem;
}
</style>
