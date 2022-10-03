<template>
  <section class="flex flex-col items-center gap-5 text-gray-800 sm:gap-16">
    <div class="flex flex-col gap-5 sm:flex-row">
      <button
        v-for="option in options"
        v-bind:key="option.value"
        class="group block min-h-[114px] w-[250px] rounded-sm border p-4 px-5 text-center sm:py-7"
        @click="emits('option:click', option.value)"
      >
        <span
          class="block pb-3 text-base font-black uppercase leading-5 tracking-wider group-hover:underline group-focus:underline"
          >{{ option.heading }}</span
        >
        <span class="mb-4 block min-h-[32px] text-sm leading-4">{{ option.subHeading }}</span>
      </button>
    </div>
    <div
      v-if="showExpressOptions"
      class="w-[250px] rounded-sm border p-4 text-center sm:w-full sm:rounded-none sm:border-none sm:bg-gray-100 sm:p-8"
    >
      <h3 class="pb-4 text-base font-black uppercase leading-5 tracking-wider sm:hidden">{{ expressHeading }}</h3>
      <p class="hidden text-sm leading-4 sm:block sm:pb-7">{{ expressSubHeading }}</p>
      <div class="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-12">
        <slot></slot>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, useSlots } from 'vue';

export interface Option {
  heading: string;
  subHeading: string;
  value: string;
}

const slots = useSlots();
const childSteps = slots.default ? slots.default() : [];
const showExpressOptions = ref(!!childSteps.length);

const props = defineProps<{
  options: Array<Option>;
  expressHeading?: string;
  expressSubHeading?: string;
}>();

const emits = defineEmits<{
  (eventName: 'option:click', value: string): void;
}>();
</script>
