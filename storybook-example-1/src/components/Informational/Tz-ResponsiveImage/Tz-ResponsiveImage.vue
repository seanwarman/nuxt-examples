<template>
  <picture v-if="media">
    <template v-for="(image, index) in media" :key="index">
      <source
        v-if="image.formats.png && image.width"
        type="image/png"
        :media="`(min-width: ${image.width}px)`"
        :srcset="image.formats.webp"
      />
      <source
        v-if="image.formats.webp && image.width"
        type="image/webp"
        :media="`(min-width: ${image.width}px)`"
        :srcset="image.formats.webp"
      />
    </template>
    <img class="h-full w-full" :src="image?.src" :alt="image?.alt" />
  </picture>
  <img v-else class="h-full w-full" :src="image?.src" :alt="image?.alt" />
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { Media } from './types';
import type { Image } from '../types';

export interface ResponsiveImage {
  media: Media[];
  image?: Image;
}

const props = defineProps<ResponsiveImage>();

const handleResponsiveImage = (keyword: string) => {
  return props.media.filter((image) => image.keywords?.includes(keyword)).shift();
};
</script>
