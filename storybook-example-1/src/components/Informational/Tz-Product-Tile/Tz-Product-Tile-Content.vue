<template>
  <div
    class="content-container flex h-full flex-col justify-between"
    :class="{ 'pt-3': layout?.collapsed, 'p-5': layout?.lean, 'py-3': !layout?.collapsed && !layout?.lean }"
  >
    <div
      class="w-full min-w-full place-content-between content-center"
      :class="layout?.collapsed ? 'mb-2.5 block' : 'flex'"
    >
      <a class="tracking-normal underline-offset-2 hover:underline focus:underline focus:outline-0" :href="uri"
        ><h3
          class="inline text-base font-semibold leading-5 text-gray-800 line-clamp-2"
          :class="[
            lifestyle && 'bg-white shadow-[0.25em_0_0_#ffffff,-0.25em_0_0_#ffffff]',
            layout?.collapsed ? 'font-medium leading-tight' : ''
          ]"
        >
          {{ title }}
        </h3>
      </a>
      <div
        v-if="price.discount?.new_price"
        class="min-w-[50%]"
        :class="[layout?.collapsed ? 'text-left' : 'text-right', layout?.collapsed && 'my-3']"
      >
        <span
          class="mb-0"
          :class="[lifestyle && 'bg-white px-1', layout?.collapsed && 'text-sm font-bold leading-tight']"
        >
          Now:&nbsp;{{ handlePrices(price.discount.new_price) }}
        </span>
        <div :class="layout?.collapsed && 'leading-3'">
          <span
            class="mb-0 text-sm text-slate-500 line-through"
            :class="[lifestyle && 'px-1', layout?.collapsed && 'text-xs font-light leading-tight']"
          >
            RRP:&nbsp;{{ handlePrices(price.rrp) }}
          </span>
        </div>
      </div>
      <div v-else class="min-w-[50%] text-right">
        <p class="mb-0">{{ handlePrices(price.rrp) }}</p>
      </div>
    </div>
    <div>
      <div :class="!layout?.collapsed && 'mt-4'">
        <div class="flex w-full min-w-full place-content-between content-center">
          <tz-rating
            v-if="reviews?.count && reviews.count > 0"
            :rating="reviews.score"
            :total-reviews="reviews.count"
            :is-indicator-active="layout?.collapsed ? false : true"
          />
          <div v-if="price.finance?.available && !layout?.collapsed && !layout?.lean" class="min-w-[50%] text-right">
            <div class="flex justify-end">
              <span
                class="mb-0 bg-[#e5ebf8] py-2 px-4 text-xs font-bold tracking-widest text-[#1D69FD] sm:ml-2 sm:py-1 sm:px-2 sm:pr-4 sm:text-xs"
              >
                {{ handlePrices(price.finance?.pm) }} PM {{ price.finance.apr }}% APR
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TzRating from '@/components/Informational/Tz-Rating/Tz-Rating.vue';
import type { Price, Reviews, Layout } from './Tz-Product-Tile.types';
import { handlePrices } from '@/composables/numbers';

export interface Props {
  title: string;
  uri: string;
  reviews?: Reviews;
  price: Price;
  layout?: Layout;
  lifestyle?: boolean | null | undefined;
}

defineProps<Props>();
</script>

<style scoped>
/* .tz-product-tile__link:focus {
  @apply outline-0;
} */

/* .tz-product-tile__link:hover {
  @apply tracking-normal underline underline-offset-2;
} */
</style>
