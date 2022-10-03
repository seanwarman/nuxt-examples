<template>
  <div class="flex flex-col items-stretch gap-6 text-dark">
    <dl class="flex flex-col items-stretch">
      <div class="flex items-center justify-between">
        <dt class="text-sm font-extrabold uppercase">
          Sub total ({{ noOfItems }} {{ noOfItems === 1 ? 'item' : 'items' }})
        </dt>
        <dd class="text-right font-extrabold">{{ handlePrices(subTotal) }}</dd>
      </div>
    </dl>
    <dl class="flex flex-col items-stretch" v-if="discounts">
      <div
        class="flex items-center justify-between"
        v-for="(discount, key) in discounts"
        :key="key"
        :class="{
          'text-primary': discount.type === DiscountType.cycleToWork,
          'text-green-600': discount.type !== DiscountType.cycleToWork
        }"
      >
        <dt class="bg text-sm uppercase">{{ discount.name }}</dt>
        <dd class="text-right">- {{ handlePrices(discount.amount) }}</dd>
      </div>
    </dl>
    <dl class="flex flex-col items-stretch" v-if="savings">
      <div class="flex items-center justify-between">
        <dt class="text-sm font-extrabold uppercase">You save</dt>
        <dd class="text-right font-extrabold">{{ handlePrices(savings) }}</dd>
      </div>
    </dl>
    <section>
      <dl class="flex flex-col items-stretch">
        <div class="flex items-center justify-between">
          <dt class="text-sm font-extrabold uppercase">Delivery</dt>
          <dd class="text-right font-extrabold uppercase">
            {{ shippingCost === 0 ? 'Free' : handlePrices(shippingCost) }}
          </dd>
        </div>
      </dl>
      <div>
        <span class="text-sm text-gray-400">
          <label for="shipping-country">Delivery to </label>
          <select
            id="shipping-country"
            name="shipping-country"
            class="cursor-pointer border-0 p-0 pr-7 text-sm underline"
            v-model="input"
          >
            <option v-for="country in shippingCountries" :key="country.id" :value="country.id">
              {{ country.name }}
            </option>
          </select>
        </span>
        <br />
        <span v-if="shippingMessage" class="text-sm text-gray-400">{{ shippingMessage }}</span>
      </div>
    </section>
    <dl class="flex flex-col items-stretch">
      <div class="flex items-center justify-between">
        <dt class="text-lg font-extrabold uppercase">Total</dt>
        <dd class="text-lg font-extrabold uppercase">{{ handlePrices(total) }}</dd>
      </div>
    </dl>
  </div>
</template>

<script setup lang="ts">
import { handlePrices } from '@/composables/numbers';
import type { DeliverToOption, Discount } from '@/components/Informational/types';
import { DiscountType  } from '@/components/Informational/types';
import { computed } from 'vue';

export type Props = {
  noOfItems: number;
  subTotal: number;
  discounts?: Discount[];
  savings?: number;
  shippingCountries: DeliverToOption[];
  selectedShippingCountry: number;
  shippingCost: number;
  shippingMessage?: string;
  total: number;
};

const props = defineProps<Props>();

const emits = defineEmits<{
  (e: 'deliveryOptionChanged', value: DeliverToOption | undefined): void;
  (e: 'update:selectedShippingCountry', value: number): void;
}>();

const input = computed({
  get: () => props.selectedShippingCountry,
  set: (value) => {
    emits('update:selectedShippingCountry', value);

    const selectedOption = props.shippingCountries.find((x) => x.id === value);
    emits('deliveryOptionChanged', selectedOption);
  }
});
</script>
