<template>
  <tz-link :link="link">
    <div :class="classes">
      <span class="col-span-1">{{ term }}</span>
      <img
        v-if="logo"
        class="col-span-1 col-start-2 h-6 justify-self-end object-scale-down"
        :src="logo.src"
        :alt="logo.alt"
      />
      <span class="col-span-1 col-start-2 justify-self-end text-gray-400" v-else-if="category">
        {{ category }}
      </span>
    </div>
  </tz-link>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TzLink from '@/components/Action/Tz-Link/Tz-Link.vue';

export type Image = {
  src: string;
  alt: string;
};

export type Link = {
  url: string;
  target?: string;
};

export interface TzSearchSuggestionsProps {
  term: string;
  category?: string;
  logo?: Image;
  link: Link;
}
const props = defineProps<TzSearchSuggestionsProps>();

const classes = computed(() => {
  return {
    grid: true,
    'px-2 py-1': true,
    'grid-cols-1': !props.logo && !props.category,
    'grid-cols-2': props.logo || props.category
  };
});
</script>
