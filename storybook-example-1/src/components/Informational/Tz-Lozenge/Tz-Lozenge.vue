<template>
  <span
    class="lozenge inline-block px-2 py-3 text-xs font-bold uppercase tracking-widest"
    :class="[lozengeRadius, theme]"
  >
    <slot></slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export interface Lozenge {
  color?: string;
  radius?: number;
}

const lozengeRadius = computed(() => {
  return {
    rounded: props.radius === 1,
    'rounded-md': props.radius === 2,
    'rounded-lg': props.radius === 3,
    'rounded-xl': props.radius === 4,
    'rounded-2xl': props.radius === 5
  };
});

const theme = computed(() => {
  switch (props.color) {
    case 'orange':
      return {
        'bg-orange': true,
        'text-white': true
      };
    default:
      return {
        'bg-primary': true,
        'text-white': true
      };
  }
});

const props = defineProps<Lozenge>();
</script>
