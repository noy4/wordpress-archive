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
      <ul class="issue-list">
        <li v-for="issue in openIssues" :key="issue.number" class="issue-item">
          <div class="issue-content">
            <a :href="withBase(issue.html_url)" class="issue-link">
              {{ issue.title }}
            </a>
            <span class="issue-date">{{ formatDate(issue.created_at) }}</span>
          </div>
        </li>
      </ul>
    </section>

    <section class="issue-section">
      <h3 class="section-title">
        Closed
      </h3>
      <ul class="issue-list">
        <li v-for="issue in closedIssues" :key="issue.number" class="issue-item">
          <div class="issue-content">
            <a :href="withBase(issue.html_url)" class="issue-link">
              {{ issue.title }}
            </a>
            <span class="issue-date">{{ formatDate(issue.created_at) }}</span>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.issue-list {
  list-style: none;
  padding: 0;
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
  text-decoration: none;
  flex: 1;
}

.issue-link:hover {
  color: var(--vp-c-brand);
}

.issue-date {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}
</style>
