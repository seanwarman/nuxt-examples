<template>
  <div class="tz-row grid" :class="[colClasses, gapClasses, align(), rowClasses]">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { toRefs, computed, onMounted } from 'vue';

export type Breakpoint = {
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
};

export interface Row {
  cols?: number | string;
  rows?: number | string;
  sm?: number;
  md?: number;
  gap?: Breakpoint | number;
  align?: string;
}

const props = defineProps<Row>();

const breakpointGap = props.gap as Breakpoint;
const gap = props.gap as number;
const gapClasses = computed(() => {
  if (!props.gap) return;
  return props.gap
    ? {
        'gap-0': props.gap === 0 || breakpointGap.lg === 0,
        'gap-1': props.gap === 1 || breakpointGap.lg === 1,
        'gap-2': props.gap === 2 || breakpointGap.lg === 2,
        'gap-3': props.gap === 3 || breakpointGap.lg === 3,
        'gap-4': props.gap === 4 || breakpointGap.lg === 4,
        'gap-5': props.gap === 5 || breakpointGap.lg === 5,
        'gap-6': props.gap === 6 || breakpointGap.lg === 6,
        'gap-7': props.gap === 7 || breakpointGap.lg === 7,
        'gap-8': props.gap === 8 || breakpointGap.lg === 8,
        'gap-9': props.gap === 9 || breakpointGap.lg === 9,
        'sm:gap-0': breakpointGap.sm === 0,
        'sm:gap-1': breakpointGap.sm === 1,
        'sm:gap-2': breakpointGap.sm === 2,
        'sm:gap-3': breakpointGap.sm === 3,
        'sm:gap-4': breakpointGap.sm === 4,
        'sm:gap-5': breakpointGap.sm === 5,
        'sm:gap-6': breakpointGap.sm === 6,
        'md:gap-0': breakpointGap.md === 0,
        'md:gap-1': breakpointGap.md === 1,
        'md:gap-2': breakpointGap.md === 2,
        'md:gap-3': breakpointGap.md === 3,
        'md:gap-4': breakpointGap.md === 4,
        'md:gap-5': breakpointGap.md === 5,
        'md:gap-6': breakpointGap.md === 6,
        'xl:gap-1': breakpointGap.xl === 1,
        'xl:gap-2': breakpointGap.xl === 2,
        'xl:gap-3': breakpointGap.xl === 3,
        'xl:gap-4': breakpointGap.xl === 4,
        'xl:gap-5': breakpointGap.xl === 5,
        'xl:gap-6': breakpointGap.xl === 6
      }
    : null;
});

const rowClasses = computed(() => {
  return {
    'grid-rows-none': props.rows === 0,
    'grid-rows-auto': props.rows == 'auto',
    'grid-rows-1': props.rows === 1,
    'grid-rows-2': props.rows === 2,
    'grid-rows-3': props.rows === 3,
    'grid-rows-4': props.rows === 4,
    'grid-rows-5': props.rows === 5,
    'grid-rows-6': props.rows === 6
  };
});

const colClasses = computed(() => {
  return {
    'auto-cols-max': props.cols === 'flow',
    'grid-flow-col': props.cols === 'flow',
    'grid-cols-1': props.cols === 1,
    'grid-cols-2': props.cols === 2,
    'grid-cols-3': props.cols === 3,
    'grid-cols-4': props.cols === 4,
    'grid-cols-5': props.cols === 5,
    'grid-cols-6': props.cols === 6,
    'grid-cols-7': props.cols === 7,
    'grid-cols-8': props.cols === 8,
    'grid-cols-9': props.cols === 9,
    'grid-cols-10': props.cols === 10,
    'grid-cols-11': props.cols === 11,
    'grid-cols-12': props.cols === 12,
    'sm:grid-cols-1': props.sm === 1,
    'sm:grid-cols-2': props.sm === 2,
    'sm:grid-cols-3': props.sm === 3,
    'sm:grid-cols-4': props.sm === 4,
    'sm:grid-cols-5': props.sm === 5,
    'sm:grid-cols-6': props.sm === 6,
    'sm:grid-cols-7': props.sm === 7,
    'sm:grid-cols-8': props.sm === 8,
    'sm:grid-cols-9': props.sm === 9,
    'sm:grid-cols-10': props.sm === 10,
    'sm:grid-cols-11': props.sm === 11,
    'sm:grid-cols-12': props.sm === 12,
    'md:grid-cols-1': props.md === 1,
    'md:grid-cols-2': props.md === 2,
    'md:grid-cols-3': props.md === 3,
    'md:grid-cols-4': props.md === 4,
    'md:grid-cols-5': props.md === 5,
    'md:grid-cols-6': props.md === 6,
    'md:grid-cols-7': props.md === 7,
    'md:grid-cols-8': props.md === 8,
    'md:grid-cols-9': props.md === 9,
    'md:grid-cols-10': props.md === 10,
    'md:grid-cols-11': props.md === 11,
    'md:grid-cols-12': props.md === 12
  };
});

const align = () => {
  return props.align === 'center'
    ? 'justify-center'
    : props.align === 'left'
    ? 'justify-start'
    : props.align === 'right'
    ? 'justify-end'
    : null;
};
</script>
