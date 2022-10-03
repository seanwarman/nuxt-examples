<template>
  <div class="tz-feature-card grid">
    <span class="text-base tracking-widest">{{ tag.toUpperCase() }}</span>
    <img class="row-span-2 mix-blend-multiply" :src="image.src" />
    <h3
      class="mr-[-9px] flex items-end text-3xl font-extrabold"
      :class="{
        large: fontSize === 'large'
      }"
    >
      {{ productName }}
    </h3>
  </div>
</template>

<script setup lang="ts">
import { toRefs, withDefaults } from 'vue';

export type FontSize = 'small' | 'large';

export type Image = {
  src: string;
  alt?: string;
};

export interface Props {
  tag: string;
  productName: string;
  fontSize: FontSize;
  image: Image;
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'Very special thing',
  productName: 'The best ever thing',
  fontSize: 'small',
  image: () => {
    return {
      src: '',
      alt: ''
    };
  }
});

const { tag, productName, fontSize, image } = toRefs(props);
</script>

<style>
.tz-feature-card {
  @apply max-h-[372px] 
    w-full
    max-w-[599px]
    grid-cols-[1fr_2fr]
    grid-rows-2
    rounded-[10px]
    bg-[#F5F6F4]
    p-9
    pr-4;
}

.small {
  @apply text-3xl leading-[37px];
}

.large {
  @apply text-[35px] leading-[37px];
}
</style>
