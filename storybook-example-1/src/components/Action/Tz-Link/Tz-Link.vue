<template>
  <a :href="link?.url" :target="link?.target" class="hover:underline focus:underline focus:outline-none">
    <slot></slot>
  </a>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import type { Link } from '@/components/Informational/types';

export interface Props {
  link?: Link;
}

const props = defineProps<Props>();

const { link } = toRefs(props);
</script>
