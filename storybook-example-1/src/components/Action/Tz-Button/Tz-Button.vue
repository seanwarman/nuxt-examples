<template>
  <keep-alive>
    <component
      :is="!link ? 'button' : 'a'"
      class="flex items-center justify-center gap-2 text-sm font-extrabold uppercase tracking-wider focus:ring"
      :class="[buttonTypes, size, order]"
      v-bind="attributes"
      @click="emits('click')"
    >
      <slot name="icon"></slot>
      <slot></slot>
    </component>
  </keep-alive>
</template>

<script setup lang="ts">
import type { Link } from '@/components/Informational/types';
import { computed } from 'vue';

export type ButtonType = 'primary' | 'secondary' | 'finance';
export type ButtonSize = 'lg' | 'md' | 'sm';

export interface Props {
  type?: ButtonType;
  link?: Link;
  size?: ButtonSize;
  iconPosition?: 'before' | 'after';
}

const attributes = computed(() => {
  if (props.link) {
    return {
      href: props.link?.url,
      target: props.link?.target
    };
  }
  return {};
});

const props = defineProps<Props>();

const buttonTypes = computed(() => {
  return {
    'bg-dark hover:bg-black text-white ring-dark': !props.type || props.type === 'primary',
    'bg-white hover:bg-gray-100 border border-dark': props.type === 'secondary',
    'bg-finance hover:bg-finance-dark text-white': props.type === 'finance'
  };
});

const order = computed(() => {
  return {
    'flex-row-reverse': props.iconPosition === 'after'
  };
});

const size = computed(() => {
  return {
    'text-xs px-5 py-1.5 rounded-sm': props.size === 'sm',
    'px-8 py-3 rounded-[3px]': !props.size || props.size === 'md',
    'px-16 py-5 rounded': props.size === 'lg'
  };
});

const emits = defineEmits<{
  (eventName: 'click'): void;
}>();
</script>
