<template>
  <div class="brand-card relative border p-9" @mousedown="noticeLink($event)" @mouseup="triggerLink($event)">
    <div class="flex flex-col items-center">
      <img class="mb-8 px-12" :src="brand.src" :alt="brand.alt" />

      <img class="mb-7 mix-blend-multiply" :src="image.src" :alt="image.alt" />
      <a class="brand-link" :href="link.url" :target="link.target">
        <span class="brand-product-title font-semibold">
          {{ title }}
        </span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';

import type { Image, Link } from '../types';

export interface BrandCard {
  id: number;
  title: string;
  brand: Image;
  image: Image;
  link: Link;
}

const props = defineProps<BrandCard>();

const reaction = ref<number>(0);

/**
 * Set timestamp to calculate length of click
 * @param event: Event
 *   Mouse event
 */
const noticeLink = (event: Event) => {
  reaction.value = +new Date();
};

/**
 * Determine length of mouse click to see if the
 * user intends to select text or visit the card destination
 *
 * @param event: Event
 *   Mouse event
 */
const triggerLink = (event: Event) => {
  const reactionTime = +new Date();
  if (reactionTime - reaction.value < 200) {
    if (props.link.url) {
      location.href = props.link.url;
    }
  }
};
</script>

<style scoped>
.brand-card {
  @apply border-[#E7E7E7] duration-500 ease-in-out;
}
.brand-card:hover {
  cursor: pointer;
  @apply border-[#2F2F2F];
}
</style>
