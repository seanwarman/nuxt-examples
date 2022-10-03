<template>
  <div class="tz-search-dropdown">
    <div :class="userDefinedStyles" class="grid sm:grid-cols-12 lg:container">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';

export interface Props {
  classes?: string[];
}

const userDefinedStyles = computed(() => {
  return props.classes || 'my-4 md:my-10 px-0 gap-x-10';
});

const props = defineProps<Props>();
</script>

<style scoped>
.tz-search-dropdown {
  @apply px-[1em] transition-opacity ease-in-out lg:px-0;
}
.tz-search-suggestion {
  @apply mt-2;
}
</style>
