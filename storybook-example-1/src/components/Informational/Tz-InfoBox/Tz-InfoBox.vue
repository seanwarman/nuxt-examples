<template>
  <div class="flex flex-col gap-1.5">
    <h6 v-if="$slots.heading" class="text-xs font-black uppercase tracking-wider text-gray-800">
      <slot name="heading"></slot>
    </h6>
    <div class="relative flex flex-grow flex-col gap-0 border p-4">
      <div class="flex-grow">
        <slot></slot>
      </div>
      <div v-if="actionLabel" class="mt-3 text-right">
        <button
          class="whitespace-nowrap rounded-sm bg-gray-100 py-2 px-3.5 text-xs font-bold uppercase leading-4 tracking-widest hover:underline focus:underline sm:px-7"
          @click="emits('actionClick')"
        >
          {{ actionLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface InfoBox {
  actionLabel?: string;
}

const props = defineProps<InfoBox>();

const emits = defineEmits<{
  (eventName: 'actionClick'): void;
}>();
</script>
