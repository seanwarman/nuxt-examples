<template>
  <button
    @click="emits('click')"
    class="grid h-16 w-16 place-items-center bg-dark text-white ring-dark hover:bg-black focus:ring"
  >
    <tz-chevron-icon data-test="tz-ct-chevron-button" class="w-5" :class="{ 'rotate-180': direction === 'left' }" />
  </button>
</template>

<script setup lang="ts">
import TzChevronIcon from '@/components/Informational/Icons/Tz-Chevron-Icon.vue';

export type Direction = 'left' | 'right';

const props = withDefaults(
  defineProps<{
    direction: Direction;
  }>(),
  {
    direction: 'right'
  }
);

const emits = defineEmits<{
  (eventName: 'click'): void;
}>();
</script>
