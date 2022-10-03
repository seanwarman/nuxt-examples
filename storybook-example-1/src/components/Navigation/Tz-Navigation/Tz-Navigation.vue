<template>
  <div class="mx-0">
    <tz-nav-primary v-if="width >= display.breakpoint" title="Shop" :menu="main" :footer="footer"></tz-nav-primary>
    <tz-mobile-nav v-else :menu="main"></tz-mobile-nav>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import TzNavPrimary from '../Tz-NavPrimary/Tz-NavPrimary.vue';
import TzMobileNav from '../Tz-MobileNav/Tz-MobileNav.vue';

import type { NavMenu } from '../types';
import type { NavItem } from '../types';

import windowResizer from '@/composables/windowResizer';

export interface Nav {
  main: NavMenu[];
  footer: NavItem[];
}

const { width } = windowResizer();
const display = reactive({
  breakpoint: 1300
});

const props = withDefaults(defineProps<Nav>(), {
  main: () => [],
  footer: () => []
});

const classes = computed(() => {
  return {
    'tz-primary-nav': true,
    flex: true
  };
});
</script>
