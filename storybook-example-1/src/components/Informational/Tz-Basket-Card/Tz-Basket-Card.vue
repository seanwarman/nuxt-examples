<template>
  <div>
    <div class="flex gap-9 bg-gray-50 p-[18px] sm:p-8 sm:pl-11 lg:gap-24">
      <div>
        <img
          class="pt-4.5 aspect-[3/2] w-[89px] object-contain mix-blend-multiply sm:w-[153px] sm:pt-0"
          :src="image.src"
          :alt="image.alt"
        />
      </div>
      <div class="flex-1">
        <div class="flex flex-col gap-2 lg:gap-7">
          <span class="text-base font-semibold leading-5 line-clamp-2">
            <tz-link :link="link">
              {{ title }}
            </tz-link>
          </span>
          <div class="flex flex-col gap-3">
            <ul v-if="options?.length" class="text-sm font-semibold leading-5 text-[#878787]">
              <li v-for="(option, k) in options" :key="k" class="line-clamp-2">
                {{ option.name }}: {{ option.value }}
              </li>
            </ul>
            <div class="flex flex-col gap-0">
              <span v-if="price" class="font-bold">
                {{ handlePrices(price.list) }}
              </span>
            </div>
            <tz-select
              :options="quantityOptions"
              :default-state="quatitySelection"
              @selected-option="onQuantityChange"
            />
            <div class="flex items-end justify-between">
              <button
                type="button"
                role="button"
                class="bg pb-[3px] text-xs font-bold uppercase tracking-widest text-gray-500 hover:underline focus:text-black focus:underline focus:outline-0"
                @click="onRemoveClick"
              >
                Remove
              </button>
              <div class="flex flex-col text-right">
                <span class="mb-0 text-base font-bold">
                  <span class="sr-only">Line price:</span> {{ handlePrices(linePrice) }}
                </span>
                <span
                  v-if="price.list < price.rrp"
                  class="m-0 pb-0.5 text-xs font-normal leading-normal tracking-normal text-gray-500"
                >
                  RRP: <span class="line-through">{{ handlePrices(lineRrp) }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Image, Link } from '@/components/Informational/types';
import { handlePrices } from '@/composables/numbers';
import TzLink from '@/components/Action/Tz-Link/Tz-Link.vue';
import TzSelect from '@/components/Action/Tz-Select/Tz-Select.vue';
import { defineProps, ref, computed, onMounted } from 'vue';
import type { Option } from '../../Input/types';

export interface Props {
  id: number;
  link: Link;
  image: Image;
  title: string;
  options?: Option[];
  price: {
    list: number;
    rrp: number;
  };
  stockQuantity: number;
  quantity: number;
}

const props = defineProps<Props>();
const quantity = ref(props.quantity);

const linePrice = computed(() => props.price.list * quantity.value);
const lineRrp = computed(() => props.price.rrp * quantity.value);
const quantityOptions = computed(() =>
  Array.from({ length: Math.min(20, props.stockQuantity) }, (_, index) => index + 1).reduce(
    (arr: Option[], value: number) => [
      ...arr,
      {
        name: value.toString(),
        value
      }
    ],
    []
  )
);
const quatitySelection = computed(() => {
  return { name: props.quantity.toString(), value: props.quantity };
});

const emit = defineEmits<{
  (eventName: 'remove', basketItemId: number): void;
  (eventName: 'changeQuantity', basketItemId: number, quantity: number): void;
}>();

const onRemoveClick = () => {
  emit('remove', props.id);
};
const onQuantityChange = (option: Option) => {
  quantity.value = Number(option.value);
  emit('changeQuantity', props.id, parseInt(option.value as string));
};
</script>
