<template>
  <article class="flex flex-col gap-11 text-dark">
    <h1 class="text-center text-2xl font-extrabold">Order Summary</h1>
    <section class="flex h-28 gap-7" v-for="product in products" :key="product.line_item_id">
      <div class="flex h-full w-2/5 justify-center bg-gray-50 p-4">
        <img class="aspect-[3/2] h-full object-contain mix-blend-multiply" :src="product.image.src" alt="gravel bike" />
      </div>
      <div class="flex flex-1 flex-col gap-1">
        <h2 class="flex-1 text-sm leading-6 text-gray-700">
          {{ product.title }}
        </h2>
        <div class="flex justify-between">
          <span class="text-sm font-normal leading-5 text-gray-500">Qty: {{ product.quantity }}</span>
          <span class="text-sm font-bold leading-5 text-gray-700">{{ handlePrices(product.total) }}</span>
        </div>
        <hr />
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
import { handlePrices } from '@/composables/numbers';
import type { OrderProduct, Discount, DeliverToOption } from '@/components/Informational/types';

export type Props = {
  products: OrderProduct[];
};

const props = defineProps<Props>();
</script>
