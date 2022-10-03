<template>
  <div v-for="(product, k) in products" :key="k">
    <tz-link v-if="product.content.link" :link="product.content.link">
      <div class="mb-5 flex flex-row items-center">
        <TzDisc :data="product.content" />
        <span class="ml-[22px]">{{ product.content.name }}</span>
      </div>
    </tz-link>
    <!-- no link -->
    <div v-else class="mb-5 flex flex-row items-center">
      <TzDisc :data="product.content" />
      <span class="ml-[22px]">{{ product.content.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import TzDisc from '@/components/Informational/Tz-Disc/Tz-Disc.vue';
import TzLink from '@/components/Action/Tz-Link/Tz-Link.vue';
import type { ImageType, StandardLink } from '@/components/Input/Tz-Search/Tz-Search.types';

export type Products = {
  content: DiscContent;
};

export type DiscContent = {
  id: number;
  name: string;
  link?: StandardLink;
  image: ImageType;
};

export interface Props {
  products?: Products[];
}

defineProps<Props>();
</script>
