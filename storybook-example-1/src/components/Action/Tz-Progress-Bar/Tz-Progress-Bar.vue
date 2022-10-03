<template>
  <div
    class="m-auto w-full pb-2"
    :class="[computedSteps.length === 3 ? 'max-w-[395px]' : steps.length > 3 && 'max-w-[800px]']"
  >
    <ul class="flex w-full">
      <li v-for="(step, k) in computedSteps" :key="k" class="relative flex-1" :class="[step.active && 'active']">
        <router-link
          v-if="step.enabled"
          :to="step.url"
          class="inline-block h-full w-full p-2 text-center text-xs uppercase tracking-widest text-gray-500 after:absolute after:top-full after:left-0 after:right-0 after:bottom-auto after:h-2 after:bg-gray-100 after:content-[''] hover:text-[#2F2F2F] hover:underline focus:text-[#2F2F2F] focus:underline focus:outline-0"
          >{{ step.label }}</router-link
        >
        <span
          v-else
          class="inline-block h-full w-full p-2 text-center text-xs uppercase tracking-widest text-gray-500 after:absolute after:top-full after:left-0 after:right-0 after:bottom-auto after:h-2 after:bg-gray-100 after:content-['']"
          :class="{
            'font-black text-gray-900 after:bg-[#318B12]': step.active
          }"
        >
          {{ step.label }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import type { ProgressBarStep } from './Tz-Progress-Bar.types';

const computedSteps = computed(() =>
  props.steps.map((x, i) => {
    return {
      active: i == props.selectedStepIndex,
      enabled: i < props.selectedStepIndex,
      label: x.label,
      url: x.url
    };
  })
);

const props = defineProps<{
  steps: ProgressBarStep[];
  selectedStepIndex: number;
}>();
</script>
