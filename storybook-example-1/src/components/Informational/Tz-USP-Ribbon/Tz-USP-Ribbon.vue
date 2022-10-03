<template>
  <div class="tz-offer-container">
    <div v-for="(title, k) in offerTitles" :key="k">
      <span class="tz-offer-item">{{ title.toUpperCase() }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';

export interface Props {
  offerTitles: string[];
}

const props = defineProps<Props>();

const { offerTitles } = toRefs(props);
</script>

<style>
.tz-offer-container {
  @apply flex flex-col items-center bg-[#F5F6F4] py-14 sm:flex-row sm:justify-around sm:px-16;
}

.tz-offer-item {
  @apply text-sm font-bold leading-[47px] tracking-[0.4em] text-[#2F2F2F];
}
</style>
