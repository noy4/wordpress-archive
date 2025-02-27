<script setup lang="ts">
import { withBase } from 'vitepress'
import { data as issues } from '../issues.data'

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('ja-JP')
}
</script>

<template>
  <ul class="issue-list">
    <li v-for="issue in issues" :key="issue.number" class="issue-item">
      <a :href="withBase(issue.html_url)" class="issue-link">
        {{ issue.title }}
        <span class="issue-state" :class="issue.state">
          {{ issue.state === 'open' ? '進行中' : '完了' }}
        </span>
      </a>
      <span class="issue-date">{{ formatDate(issue.created_at) }}</span>
    </li>
  </ul>
</template>

<style scoped>
.issue-list {
  list-style: none;
  padding: 0;
  margin: 2rem 0;
}

.issue-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.issue-link {
  color: var(--vp-c-text-1);
  text-decoration: none;
  display: block;
}

.issue-link:hover {
  color: var(--vp-c-brand);
}

.issue-state {
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 2rem;
  margin-left: 0.5rem;
}

.issue-state.open {
  background-color: var(--vp-c-brand);
  color: white;
}

.issue-state.closed {
  background-color: var(--vp-c-gray);
  color: white;
}

.issue-date {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  display: block;
  margin-top: 0.25rem;
}
</style>
