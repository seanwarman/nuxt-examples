<template>
  <div class="container">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { toRefs } from 'vue';
export interface Grid {
  fluid?: boolean;
  breakpoint?: string;
}

const props = defineProps<Grid>();
</script>
