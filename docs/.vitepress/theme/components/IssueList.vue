<script setup lang="ts">
import { withBase } from 'vitepress'
import { computed } from 'vue'
import { data as issues } from '../issues.data'

const openIssues = computed(() => issues.filter(issue => issue.state === 'open'))
const closedIssues = computed(() => issues.filter(issue => issue.state === 'closed'))

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('ja-JP')
}
</script>

<template>
  <div class="issue-sections">
    <section class="issue-section">
      <h3 class="section-title">
        進行中のタスク
      </h3>
      <ul class="issue-list">
        <li v-for="issue in openIssues" :key="issue.number" class="issue-item">
          <div class="issue-content">
            <a :href="withBase(issue.html_url)" class="issue-link">
              {{ issue.title }}
              <span class="issue-state" :class="issue.state">
                {{ issue.state === 'open' ? '進行中' : '完了' }}
              </span>
            </a>
            <span class="issue-date">{{ formatDate(issue.created_at) }}</span>
          </div>
        </li>
      </ul>
    </section>

    <section class="issue-section">
      <h3 class="section-title">
        完了済みのタスク
      </h3>
      <ul class="issue-list">
        <li v-for="issue in closedIssues" :key="issue.number" class="issue-item">
          <div class="issue-content">
            <a :href="withBase(issue.html_url)" class="issue-link">
              {{ issue.title }}
              <span class="issue-state" :class="issue.state">
                {{ issue.state === 'open' ? '進行中' : '完了' }}
              </span>
            </a>
            <span class="issue-date">{{ formatDate(issue.created_at) }}</span>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.issue-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-title {
  margin: 0 0 1rem;
  font-size: 1.2rem;
  color: var(--vp-c-text-1);
}

.issue-list {
  list-style: none;
  padding: 0;
  margin: 2rem 0;
}

.issue-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.issue-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.issue-link {
  color: var(--vp-c-text-1);
  text-decoration: none;
  flex: 1;
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
  white-space: nowrap;
}
</style>
