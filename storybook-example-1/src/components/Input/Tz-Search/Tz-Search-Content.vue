<template>
  <div class="tz-search-content">
    <h2 class="text-xs font-extrabold text-[#A8A3A3]" :class="classes">
      {{ title.toUpperCase() }}
    </h2>
    <slot />
  </div>
</template>

<script setup lang="ts">
export interface Props {
  title: string;
  classes: string;
}

defineProps<Props>();
</script>
