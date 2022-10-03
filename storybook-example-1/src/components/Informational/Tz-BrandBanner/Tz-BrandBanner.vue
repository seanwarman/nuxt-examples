<template>
  <div class="brand-banner p-5 xl:container xl:px-5 xl:py-0">
    <tz-row cols="flow" :class="['gap-14', 'overflow-x-auto']">
      <tz-col :span="1" v-for="brand in brands" :key="brand.id">
        <div class="brand flex h-16 w-24 content-center justify-center">
          <a
            class="m-auto"
            :href="page == 'home' ? brand.url : undefined"
            @click="page == 'hub' ? filterBrandCallback($event, brand.id, brand.name) : null"
          >
            <img
              :class="['object-fit', 'hover:scale-100', 'scale-90', 'transition', 'duration-300']"
              :src="brand.image.src"
              :alt="brand.image.alt"
            />
          </a>
        </div>
      </tz-col>
    </tz-row>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';
import TzRow from '@/components/Structural/Tz-Row/Tz-Row.vue';
import TzCol from '@/components/Structural/Tz-Col/Tz-Col.vue';

import type { Brand, BrandFilter } from './Tz-BrandBanner.types';
import { PageContext } from './Tz-BrandBanner.types';

export interface Banner {
  page?: string;
  brands: Brand[];
}

const emits = defineEmits<{
  (e: 'filterSelectedBrand', brand: BrandFilter): void;
}>();

const props = withDefaults(defineProps<Banner>(), {
  page: 'home'
});

/**
 * Callback for filtering
 * @param id: number
 *   The Brand identifier
 * @param name: string
 *   The name of the brand
 *
 * emits event "filterSelectedBrand"
 */
const filterBrandCallback = (e: Event, id: number, name: string) => {
  if (props.page == PageContext.Hub.toString()) {
    e.preventDefault();
  }
  emits('filterSelectedBrand', {
    id: id,
    name: name
  });
};
</script>

<style scoped>
/* Demonstrate a "mostly customized" scrollbar
 * (won't be visible otherwise if width/height is specified) */
::-webkit-scrollbar {
  width: 5px;
  height: 8px;
  background-color: #aaa; /* or add it to the track */
}

/* Add a thumb */
::-webkit-scrollbar-thumb {
  background: #000;
}
</style>
