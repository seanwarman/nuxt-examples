<template>
  <div class="tz-col" :class="[colClass.span]">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { toRefs, computed } from 'vue';
export interface Col {
  span?: number | string;
  sm?: number | string;
  md?: number | string;
  lg?: number | string;
  start?: number;
  end?: number;
}

const colClass = computed(() => {
  const span = colSpan();
  return {
    span: span
  };
});

const colSpan = () => {
  const cols = [];
  const colSpan = props.span ? cols.push(`col-span-${props.span}`) : 'col-span-1';
  if (props.sm) {
    cols.push(`sm:col-span-${props.sm}`);
  }
  if (props.md) {
    cols.push(`md:col-span-${props.md}`);
  }
  if (props.lg) {
    cols.push(`lg:col-span-${props.lg}`);
  }
  cols.push([colSpan]);
  return cols;
};

const colClasses = computed(() => {
  return {
    'col-span-full': props.span === 'full',
    'col-span-1': props.span === 1,
    'col-span-2': props.span === 2,
    'col-span-3': props.span === 3,
    'col-span-4': props.span === 4,
    'col-span-5': props.span === 5,
    'col-span-6': props.span === 6,
    'col-span-7': props.span === 7,
    'col-span-8': props.span === 8,
    'col-span-9': props.span === 9,
    'col-span-10': props.span === 10,
    'col-span-11': props.span === 11,
    'col-span-12': props.span === 12,
    'sm:col-span-full': props.sm === 'full',
    'sm:col-span-1': props.sm === 1,
    'sm:col-span-2': props.sm === 2,
    'sm:col-span-3': props.sm === 3,
    'sm:col-span-4': props.sm === 4,
    'sm:col-span-5': props.sm === 5,
    'sm:col-span-6': props.sm === 6,
    'sm:col-span-7': props.sm === 7,
    'sm:col-span-8': props.sm === 8,
    'sm:col-span-9': props.sm === 9,
    'sm:col-span-10': props.sm === 10,
    'sm:col-span-11': props.sm === 11,
    'sm:col-span-12': props.sm === 12,
    'md:col-span-full': props.md === 'full',
    'md:col-span-1': props.md === 1,
    'md:col-span-2': props.md === 2,
    'md:col-span-3': props.md === 3,
    'md:col-span-4': props.md === 4,
    'md:col-span-5': props.md === 5,
    'md:col-span-6': props.md === 6,
    'md:col-span-7': props.md === 7,
    'md:col-span-8': props.md === 8,
    'md:col-span-9': props.md === 9,
    'md:col-span-10': props.md === 10,
    'md:col-span-11': props.md === 11,
    'md:col-span-12': props.md === 12
  };
});

const props = defineProps<Col>();
</script>
