<template>
  <div class="nav--menu_item grid cursor-pointer grid-cols-12 gap-2 lg:gap-0">
    <img v-if="image" class="col-span-2 inline-block lg:col-span-3" :alt="image.alt" :src="image.src" />
    <a
      :href="link"
      :data-text="title"
      :class="[classes, ...navItemClasses, active && activeItemClasses]"
      @mouseenter="hoverMenu($event, index)"
      @click="!props.link ? clickMenu($event, index) : null"
    >
      <slot></slot>
      <tz-chevron-icon v-if="chevron" :class="['float-right', 'w-5']"></tz-chevron-icon>
    </a>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { NavImage } from '../types';
import type { NavUnderline } from '../types';
import TzChevronIcon from '../../Informational/Icons/Tz-Chevron-Icon.vue';

export type Active = {
  index: number;
  link: string;
};

export interface ItemProps {
  index: number;
  link?: string | undefined;
  image?: NavImage | null;
  title: string;
  active: boolean;
  chevron: boolean;
  classes?: string[];
}

const emits = defineEmits<{
  (eventName: 'handleHoverActiveMenu', underline: NavUnderline): void;
  (eventName: 'handleClickActiveMenu'): void;
}>();

const props = withDefaults(defineProps<ItemProps>(), {
  link: '',
  title: 'Mountain bikes',
  image: null,
  active: false,
  chevron: false
});

const navItemClasses = computed(() => {
  return [
    'text-slate-700',
    'hover:text-gray-900',
    props.image ? 'col-span-9' : 'col-span-full',
    'lg:block',
    'border-b-2',
    'border-gray-100',
    'lg:border-0',
    'pb-3',
    'no-underline'
  ];
});

const activeItemClasses = computed(() => {
  return {
    'font-bold': true,
    active: true,
    'text-slate-900': true,
    'decoration-4': true
  };
});

const hoverMenu = (e: any, mainIndex: number | null) => {
  const position = {
    width: `${e.view.innerWidth}px`,
    height: `${e.view.innerHeight}px`,
    left: `${e.target.offsetLeft}px`,
    top: `${e.target.offsetTop}px`
  };
  emits('handleHoverActiveMenu', position);
};

const clickMenu = (e: any, index: number) => {
  if (!props.link) {
    e.preventDefault();
  }
  emits('handleClickActiveMenu');
};
</script>

<style scoped>
.menu-item {
  display: inline-flex;
  flex-direction: column;
  justify-content: space-between;
}

.menu-item::after {
  content: attr(data-text);
  content: attr(data-text) / '';
  height: 0;
  visibility: hidden;
  overflow: hidden;
  user-select: none;
  pointer-events: none;
  font-weight: 700;
}
</style>
