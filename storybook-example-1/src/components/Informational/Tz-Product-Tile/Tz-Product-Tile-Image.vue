<template>
  <div
    class="overflow-hidden bg-[#FBFBFB]"
    :class="[layout?.lean && 'xl:aspect-square', layout?.collapsed && 'col-span-4']"
  >
    <div
      class="flex h-full items-stretch motion-reduce:transition-none motion-reduce:hover:transform-none"
      :class="{
        'py-12': !layout?.collapsed && !layout?.lean && !currentProductImage?.lifestyle,
        'pt-4 sm:pt-1': (layout?.collapsed && !lifestyle) || layout?.lean
      }"
    >
      <img
        v-if="currentProductImage?.lifestyle"
        :class="[!layout?.collapsed && 'transition duration-500 ease-in-out hover:scale-110 ']"
        class="lifestyle m-auto block w-full"
        :src="currentProductImage?.src"
        :alt="currentProductImage?.alt"
      />
      <img
        v-else
        class="w-full mix-blend-multiply transition duration-500 ease-in-out"
        :class="[
          layout?.collapsed && 'relative',
          !layout?.collapsed && !currentProductImage?.lifestyle && 'scale-default bottom-0',
          !layout?.collapsed && !lifestyle && bike && 'm-auto aspect-square max-w-[60%] sm:max-w-[80%] md:max-w-[70%]',
          !layout?.collapsed && !bike && 'm-auto max-w-[40%] sm:max-w-[70%] md:max-w-[60%]'
        ]"
        :src="currentProductImage?.src"
        :alt="currentProductImage?.alt"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Layout } from './Tz-Product-Tile.types';

export type CurrentProductImage = {
  src: string | undefined;
  alt: string | undefined;
  lifestyle: boolean | null | undefined;
};

export interface Props {
  id: number;
  productTitle: string | undefined;
  currentProductImage?: CurrentProductImage;
  layout?: Layout;
  lifestyle?: boolean;
  bike?: boolean;
}

const props = defineProps<Props>();
</script>

<style scoped>
.scale-default {
  @apply left-0 top-0 right-0 mx-auto my-0 inline h-full pb-2 hover:scale-110;
  object-fit: contain;
  object-position: center;
}
.lifestyle {
  @apply left-0 top-0 right-0 bottom-0 m-auto;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
  }

  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
  }

  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
}
</style>
