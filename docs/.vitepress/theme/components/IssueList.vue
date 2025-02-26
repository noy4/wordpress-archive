<script setup lang="ts">
import { data as issues } from '../issues.data'

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ja-JP')
}
</script>

<template>
  <div class="issue-list">
    <div v-for="issue in issues" :key="issue.number" class="issue-item">
      <h3>
        <a :href="issue.html_url" target="_blank" rel="noopener">
          {{ issue.title }}
        </a>
      </h3>
      <div class="issue-meta">
        <span class="issue-number">#{{ issue.number }}</span>
        <span class="issue-date">作成日: {{ formatDate(issue.created_at) }}</span>
        <span class="issue-state" :class="issue.state">{{ issue.state }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.issue-list {
  margin: 2rem 0;
}

.issue-item {
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
}

.issue-item:hover {
  background-color: var(--vp-c-bg-soft);
}

.issue-meta {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  display: flex;
  gap: 1rem;
  align-items: center;
}

.issue-state {
  padding: 0.2rem 0.5rem;
  border-radius: 2rem;
  font-size: 0.8rem;
}

.issue-state.open {
  background-color: #2ea44f;
  color: white;
}

.issue-state.closed {
  background-color: #8957e5;
  color: white;
}

a {
  color: var(--vp-c-brand);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>