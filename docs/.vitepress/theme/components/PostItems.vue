<script setup lang="ts">
import type { Post } from '../posts.data'
import { withBase } from 'vitepress'
import { computed } from 'vue'

interface Props {
  posts: Post[]
  limit?: number
}

const props = withDefaults(defineProps<Props>(), {
  limit: Infinity,
})

const limitedPosts = computed(() => props.posts.slice(0, props.limit))
</script>

<template>
  <ul>
    <li v-for="post in limitedPosts" :key="post.url" class="post-item">
      <div class="post-title">
        <a :href="withBase(post.url)" class="decoration-none!">{{ post.title }}</a>

        <div v-if="post.categories?.length || post.tags?.length" class="post-meta">
          <div v-if="post.categories?.length" class="categories">
            <span v-for="category in post.categories" :key="category" class="category">
              {{ category }}
            </span>
          </div>
          <div v-if="post.tags?.length" class="tags">
            <span v-for="tag in post.tags" :key="tag" class="tag">
              #{{ tag }}
            </span>
          </div>
        </div>

        <span class="post-date">
          - {{ new Date(post.date).toLocaleDateString('ja-JP') }}
        </span>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.post-title {
  display: flex;
  gap: .5rem;
}

.post-date {
  color: var(--vp-c-text-2);
  font-size: 0.9em;
}

.post-meta {
  display: flex;
  gap: 0.5rem;
  font-size: 0.75em;
}

.categories, .tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.category {
  padding: 0 0.5rem;
  background-color: var(--vp-c-brand-soft);
  border-radius: 99px;
  color: var(--vp-c-brand-dark);
}

.tag {
  color: var(--vp-c-text-2);
}
</style>
