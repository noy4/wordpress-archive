<script setup lang='ts'>
import { defineProps } from 'vue'

defineProps<{
  tag: string
}>()
</script>

<template>
  <a class="text-sm decoration-none!">
    #{{ tag }}
  </a>
</template>
