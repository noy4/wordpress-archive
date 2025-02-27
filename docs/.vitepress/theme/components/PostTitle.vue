<script setup>
import { useData } from 'vitepress'

const { frontmatter } = useData()
const date = new Date(frontmatter.value.date).toLocaleDateString('ja-JP')
</script>

<template>
  <div class="vp-doc">
    <h1>{{ frontmatter.title }}</h1>
    <p>
      <a
        v-for="category in frontmatter.categories"
        :key="category"
      >
        {{ category }}
      </a>
      <a
        v-for="tag in frontmatter.tags"
        :key="tag"
      >
        #{{ tag }}
      </a>
    </p>

    <p>
      <span>{{ date }}</span>
    </p>
  </div>
</template>
