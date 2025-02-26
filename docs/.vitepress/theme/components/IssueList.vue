<script setup lang="ts">
import { data as issues } from '../issues.data'

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ja-JP')
}
</script>

<template>
  <div class="issue-list">
      <div v-for="issue in issues" :key="issue.number" class="issue-item">
        <div class="issue-header">
          <h2 class="issue-title">
            <a :href="issue.html_url">
              {{ issue.title }}
            </a>
          </h2>
          <span class="issue-state" :class="issue.state">
            {{ issue.state === 'open' ? '進行中' : '完了' }}
          </span>
        </div>
        <div class="issue-meta">
          <span class="issue-number">#{{ issue.number }}</span>
          <span class="issue-date">作成: {{ formatDate(issue.created_at) }}</span>
        </div>
      </div>
    </div>
</template>

<style scoped>
.issue-list {
  margin: 2rem 0;
}

.issue-item {
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.issue-item:hover {
  background-color: var(--vp-c-bg-soft);
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.issue-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.issue-title {
  margin: 0;
  font-size: 1.25rem;
  line-height: 1.4;
  flex: 1;
  padding-right: 1rem;
}

.issue-meta {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  display: flex;
  gap: 1rem;
  align-items: center;
}

.issue-state {
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.issue-state.open {
  background-color: var(--vp-c-brand);
  color: white;
}

.issue-state.closed {
  background-color: var(--vp-c-gray);
  color: white;
}

.issue-number {
  font-family: var(--vp-font-family-mono);
}

a {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

a:hover {
  color: var(--vp-c-brand);
}
</style>