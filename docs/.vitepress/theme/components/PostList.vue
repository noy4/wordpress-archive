<script setup lang="ts">
import type { Post } from '../posts.data'
import { withBase } from 'vitepress'
import { computed } from 'vue'
import { data as posts } from '../posts.data'

function getPostsByYear(posts: Post[]) {
  const postsByYear = new Map<string, Post[]>()

  posts.forEach((post) => {
    const year = new Date(post.date).getFullYear().toString()
    const postsInYear = postsByYear.get(year) || []
    postsByYear.set(year, [...postsInYear, post])
  })

  return postsByYear
}

const postsByYear = computed(() => getPostsByYear(posts))
</script>

<template>
  <div class="post-list">
    <div class="post-count">
      記事数: {{ posts.length }}件
    </div>

    <div v-for="[year, postsInYear] in postsByYear" :key="year" class="year-group">
      <h2 class="year-heading">
        {{ year }}年
      </h2>
      <ul>
        <li v-for="post in postsInYear" :key="post.url" class="post-item">
          <div class="post-title">
            <a :href="withBase(post.url)">{{ post.title }}</a>

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
              {{ new Date(post.date).toLocaleDateString('ja-JP') }}
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.post-title {
  display: flex;
  align-items: baseline;
  gap: .5rem;
}

.post-date {
  color: var(--vp-c-text-2);
  font-size: 0.9em;
  margin-left: auto;
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
