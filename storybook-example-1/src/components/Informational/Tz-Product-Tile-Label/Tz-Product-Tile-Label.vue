<template>
  <div v-if="name.length > 0" class="tz-product-tile-label">
    <p
      :class="[
        'mb-0',
        'text-xs',
        'tracking-widest',
        'leading-none',
        'font-bold',
        'max-w-[275px]',
        'text-center',
        'py-2',
        'border',
        'border-solid',
        bgColor === '' && 'border-[#EDEDED]'
      ]"
      :style="{
        color,
        backgroundColor: bgColor ? bgColor : 'none'
      }"
    >
      {{ name }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { toRefs, withDefaults } from 'vue';

export interface Label {
  name: string;
  color?: string;
  bgColor?: string;
}

const props = withDefaults(defineProps<Label>(), {
  name: 'SUMMER SALE',
  color: '#000000',
  bgColor: '#F7D66D'
});

const { name, color, bgColor } = toRefs(props);
</script>
