<template>
  <aside class="container w-fit">
    <div class="flex justify-items-end text-right">
      <img v-if="image" class="text-right" :src="image.src" :alt="image.alt" />
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { NavImage } from '../types';

export interface ContentProps {
  image: NavImage;
}

defineProps<ContentProps>();
</script>
