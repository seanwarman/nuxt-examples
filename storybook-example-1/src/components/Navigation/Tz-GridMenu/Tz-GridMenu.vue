<template>
  <div class="container mx-auto">
    <ul :class="['py-4', 'mx-auto', 'lg:mt-6', 'grid', 'grid-cols-2', calculatedGridClass, 'gap-6']">
      <li v-for="(item, index) in menu" :key="index">
        <tz-menu-product-listing
          :display="gridItems"
          :link="item.link"
          :image="item.image"
          :icon="item.icon"
          :label="item.label"
        ></tz-menu-product-listing>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits, onBeforeMount, onMounted, onUnmounted, onUpdated } from 'vue';
import TzMenuProductListing from '../Tz-MenuProductListing/Tz-MenuProductListing.vue';
import type { NavItem } from '../types';

export interface GridMenuProps {
  fluid?: boolean;
  gridItems: string;
  menu: NavItem[];
  classes?: string[];
}

const emits = defineEmits<{
  (eventName: 'toggleSubMenu', isShown: boolean): void;
}>();

const props = withDefaults(defineProps<GridMenuProps>(), {
  menu: () => [],
  classes: () => []
});

let calculatedGridClass = ref<string[]>([]);

onUnmounted(() => {
  calculatedGridClass.value = [];
});

onMounted(() => {
  const value = gridClasses(props.menu);
  calculatedGridClass.value = value;
});

/**
 * Calculate grid layout based on amount of items
 * present in the 3rd level menu
 *
 * @param menuItems
 *
 * @returns string[]
 *   List of tailwind grid classes
 */
const gridClasses = (menuItems: NavItem[]) => {
  const classes = [];
  classes.push('p-4');
  const maxCols = menuItems.length < 6 ? 2 : 3;
  const rows = Math.ceil(menuItems.length / maxCols);

  classes.push('lg:grid-cols-3');

  if (menuItems.length < 6) {
    classes.shift();
    classes.push('lg:grid-cols-2', 'w-2/3');
  }
  return classes;
};
</script>
