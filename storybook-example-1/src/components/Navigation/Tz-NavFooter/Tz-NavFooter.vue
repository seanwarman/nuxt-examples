<template>
  <div class="bg-neutral-100 py-2">
    <div class="container mx-auto">
      <div class="flex justify-center">
        <ul class="grid w-1/2 grid-cols-3 grid-rows-1 justify-center">
          <li v-for="(item, index) in menu" :key="index" class="col-span-1">
            <a :href="item.link" class="text-sm text-slate-700 no-underline hover:text-slate-900">
              {{ item.label }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NavItem } from '../types';

export interface Props {
  menu: NavItem[];
  classes?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  menu: () => [],
  classes: () => []
});
</script>
