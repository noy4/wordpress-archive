<script setup>
import { useData } from 'vitepress'
import Tag from './Tag.vue'

const { frontmatter } = useData()
const date = new Date(frontmatter.value.date).toLocaleDateString('ja-JP')
</script>

<template>
  <div class="vp-doc">
    <h1>{{ frontmatter.title }}</h1>
    <div class="flex items-center gap-1.5 mt-4 mb-8">
      <Badge
        v-for="category in frontmatter.categories"
        :key="category"
        :text="category"
        class="transform-none"
      />
      <Tag
        v-for="tag in frontmatter.tags"
        :key="tag"
        :tag="tag"
      />
      <span class="ml-auto">{{ date }}</span>
    </div>
  </div>
</template>
