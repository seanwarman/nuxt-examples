<template>
  <div class="relative">
    <ul class="flex justify-center">
      <li
        class="tz-product-tile-variant relative flex items-center justify-center px-[0.5em]"
        :class="[variants && variants?.length > 5 && 'first:pl-0']"
        v-for="(variant, index) in variants?.slice(0, 6)"
        :key="index"
      >
        <span v-if="!variant.instock" class="variant-stock-check">
          This product option is not currently in stock, sorry for any inconvenience.
        </span>
        <button
          :class="[
            'relative',
            'overflow-hidden',
            'w-[18px]',
            'h-[18px]',
            'rounded-full',
            'outline-0',
            variant.instock
              ? 'focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2'
              : 'focus:ring-2 focus:ring-black focus:ring-offset-2',
            {
              'active-variant': index === activeVariant
            }
          ]"
          :style="{
            backgroundColor: variant.primary_color.hex
          }"
          @click="$emit('handle-active-variant', { index, variant })"
        >
          <span
            class="absolute top-2.5 left-2.5 z-10 h-full w-full rotate-[132.27deg]"
            :style="{
              backgroundColor: variant.secondary_color.hex
            }"
          ></span>
          <span class="sr-only">
            The {{ variant.primary_color.name }} and {{ variant.secondary_color.name }} variant
          </span>
        </button>
      </li>
      <li v-if="variants && variants?.length > 6">
        <span class="relative z-20 font-extrabold leading-none"> +{{ variants.length - 6 }} </span>
      </li>
    </ul>
    <transition>
      <div
        v-if="!activeVariantContent?.instock"
        class="absolute top-8 left-0 right-0 bottom-auto text-center"
        role="region"
        aria-live="polite"
      >
        <p class="mb-0 text-[10px] font-semibold tracking-widest text-gray-500">COLOUR CURRENTLY OUT OF STOCK</p>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import type { Variants } from './Tz-Product-Tile.types';

export interface Props {
  activeVariant?: number;
  activeVariantContent?: Variants;
  variants?: Variants[];
}

const props = defineProps<Props>();
</script>

<style scoped>
.product-variants > ul {
  @apply pb-12;
}
.lifestyle-variants > ul {
  @apply -mt-11 pb-3;
}
.v-enter-active {
  transition: all 0.3s ease-in-out;
}

.v-enter-from {
  opacity: 0;
}
.v-leave-to {
  opacity: 0;
}

.active-variant {
  @apply outline-0 ring-2 ring-[#2F2F2F] ring-offset-2;
}
.variant-stock-check {
  @apply absolute top-0 bottom-0 right-0 left-0 m-auto h-[26px] w-[26px] rounded-full border border-2 border-[#C4C4C4] text-[0px] before:pointer-events-none before:absolute before:left-0 before:right-0 before:bottom-0 before:top-0 before:z-20 before:m-auto before:block before:h-full before:w-full before:max-w-[2px] before:rotate-[132.27deg] before:bg-[#C4C4C4];
}

.variant-stock-check:focus {
  @apply absolute top-0 bottom-0 right-0 left-0 m-auto h-[28px] w-[28px] rounded-full border border-2 border-[#C4C4C4] text-[0px] before:pointer-events-none before:absolute before:left-0 before:right-0 before:bottom-0 before:top-0 before:z-20 before:m-auto before:block before:h-full before:w-full before:max-w-[2px] before:rotate-[132.27deg] before:rounded-full before:bg-[#C4C4C4];
}
</style>
