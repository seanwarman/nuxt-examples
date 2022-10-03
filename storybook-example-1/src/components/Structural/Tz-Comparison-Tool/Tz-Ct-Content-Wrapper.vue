<template>
  <!-- todo - remove borders -->
  <div>
    <div data-test="tz-comparison-tool-sticky-wrapper" :class="sticky && 'sticky top-0'">
      <slot></slot>
      <slot name="product-tile"></slot>
      <slot name="color-select"></slot>
      <slot name="size-select"></slot>
    </div>

    <slot name="description"></slot>
    <slot name="info-tiles"></slot>
    <slot name="reviews"></slot>
    <slot name="accordions"></slot>
    <slot name="view-bike-cta"></slot>
  </div>
</template>

<script lang="ts" setup>
export interface Props {
  sticky?: boolean;
  pinned?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  pinned: false,
  sticky: false
});
</script>
