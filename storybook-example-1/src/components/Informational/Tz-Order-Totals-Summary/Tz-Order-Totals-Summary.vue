<template>
  <section class="flex flex-col gap-0.5 text-sm font-normal uppercase text-gray-500">
    <dl class="flex flex-col items-stretch">
      <div class="flex items-center justify-between">
        <dt>Sub total ({{ noOfItems }} {{ noOfItems === 1 ? 'item' : 'items' }})</dt>
        <dd class="text-right">{{ handlePrices(subTotal) }}</dd>
      </div>
    </dl>
    <dl class="flex flex-col items-stretch gap-0.5" v-if="discounts?.length">
      <div
        class="flex items-center justify-between"
        v-for="(discount, key) in discounts"
        :key="key"
        :class="{
          'text-primary': discount.type === DiscountType.cycleToWork,
          'text-green-600': discount.type !== DiscountType.cycleToWork
        }"
      >
        <dt>{{ discount.name }}</dt>
        <dd class="text-right">- {{ handlePrices(discount.amount) }}</dd>
      </div>
    </dl>
    <section>
      <dl class="mt-2 flex flex-col items-stretch">
        <div class="flex items-center justify-between">
          <dt>Delivery</dt>
          <dd class="text-right">
            {{ handlePrices(shippingCost) }}
          </dd>
        </div>
      </dl>
    </section>
    <dl class="mt-4 flex flex-col items-stretch">
      <div class="flex items-center justify-between text-gray-800">
        <dt class="text-lg font-extrabold">Total</dt>
        <dd class="text-lg font-extrabold">{{ handlePrices(total) }}</dd>
      </div>
    </dl>
  </section>
</template>

<script setup lang="ts">
import { handlePrices } from '@/composables/numbers';
import { DiscountType } from '@/components/Informational/types';
import type { Discount } from '@/components/Informational/types';

export type Props = {
  noOfItems: number;
  subTotal: number;
  discounts?: Discount[];
  savings?: number;
  shippingCost: number;
  total: number;
};

const props = defineProps<Props>();
</script>
