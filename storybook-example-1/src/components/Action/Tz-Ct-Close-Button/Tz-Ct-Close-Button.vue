<template>
  <button
    @click="emits('click')"
    class="w-full items-center border-b-[1px] border-[#E3E5E3] bg-[#FBFBFB] p-4 text-xs font-extrabold text-dark sm:w-auto sm:border-b-0 sm:border-transparent sm:bg-transparent"
  >
    <span class="underline">CLOSE</span>
    COMPARISON TOOL
  </button>
</template>

<script setup lang="ts">
const emits = defineEmits<{
  (eventName: 'click'): void;
}>();
</script>
