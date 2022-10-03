<template>
  <span v-if="errorMessage" class="flex flex-row items-center text-xs font-normal leading-4 text-red-600">
    <tz-exclaimation-icon class="w-5" />
    {{ errorMessage }}
  </span>
</template>

<script setup lang="ts">
import TzExclaimationIcon from '@/components/Informational/Icons/Tz-Exclaimation-Icon.vue';
import { computed } from 'vue';

const props = defineProps<{
  error?: boolean | string;
}>();

const errorMessage = computed(() => (typeof props.error === 'string' ? props.error : undefined));
</script>
