<template>
  <div class="item--product_listing">
    <a
      :href="link"
      :class="[
        'text-slate-700',
        'font-medium',
        'hover:font-bold',
        'grid',
        'grid-cols-12',
        'gap-2',
        'lg:gap-0',
        'no-underline'
      ]"
    >
      <div
        :class="[
          'rounded-full',
          'bg-neutral',
          'h-24',
          'w-24',
          'text-center',
          'grid',
          'grid-cols-1',
          'place-items-center',
          displayModeInline && 'col-span-3 lg:col-span-6 xl:col-span-4',
          displayModeBlock && 'col-span-full'
        ]"
      >
        <img
          v-if="image"
          :class="[displayModeInline && 'inline-block', 'mix-blend-multiply', 'p-2']"
          :alt="image.alt"
          :src="image.src"
        />
        <span
          v-if="icon"
          :class="['block', displayModeInline && 'inline-block', displayModeInline && 'col-span-3 lg:col-span-2']"
          >{{ icon.text }}</span
        >
      </div>
      <span
        :class="[
          'link-label',
          'm-2',
          displayModeInline && 'm-4',
          'lg:m-2',
          displayModeBlock && 'text-center',
          displayModeBlock && 'col-span-full',
          displayModeInline && 'inline-block',
          displayModeInline && 'self-center',
          displayModeInline && 'x:col-span-8 col-span-9 lg:col-span-6'
        ]"
        >{{ label }}</span
      >
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import type { NavImage } from '../types';
import type { NavIcon } from '../types';

export interface ItemProps {
  link: string;
  label: string;
  image?: NavImage;
  icon?: NavIcon;
  underline?: boolean;
  display?: string;
}

const props = withDefaults(defineProps<ItemProps>(), {
  link: '',
  label: 'Mountain bikes',
  underline: false,
  display: 'inline'
});

const displayModeInline = computed(() => {
  return props.display === 'inline';
});

const displayModeBlock = computed(() => {
  return props.display === 'block';
});
</script>
