<template>
  <tz-button-drop-down :button-align="buttonAlign" :icon-rotate-degrees="'rotate-180'">
    <!-- heading content -->
    <template #heading>
      <span v-if="title" class="block text-[16px] font-semibold">
        {{ title }}
      </span>
      <span v-if="description" class="text-[16px] font-light">
        {{ description }}
      </span>
    </template>
    <!-- icon -->
    <template #icon>
      <tz-chevron-icon class="rotate-90 text-[#D31716]" />
    </template>
    <!-- accordion content -->
    <template #body>
      <div v-html="content" class="text-[16px] font-light"></div>
    </template>
  </tz-button-drop-down>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import TzButtonDropDown from '@/components/Action/Tz-ButtonDropDown/Tz-ButtonDropDown.vue';
import TzChevronIcon from '@/components/Informational/Icons/Tz-Chevron-Icon.vue';

export interface Props {
  title: string;
  description: string;
  content: string;
  buttonAlign?: 'start' | 'center' | 'end';
}

defineProps<Props>();
</script>
