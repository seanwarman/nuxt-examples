<template>
  <div>
    <tz-row :cols="12" :md="2" :gap="5" class="tz-product-tile-grid">
      <tz-col
        v-for="(product, index) in products"
        :key="index"
        span="3"
        :class="[
          index === 0 && 'large-column',
          (index + 1) % (4 * 3) === 0
            ? 'med-column'
            : (index + 1) % (4 * 3 + 1) === 0
            ? 'med-column'
            : index + 1 === 4
            ? 'med-column'
            : index + 1 === 5
            ? 'med-column'
            : null,
          (index + 1) % 6 === 0 && 'large-column xl:-mt-72',
          (index + 1) % 6 === 1 && 'large-column'
        ]"
      >
        <tz-product-tile
          :id="product.id"
          :sku="product.sku"
          :title="product.title"
          :image="product.image"
          :price="product.price"
          :reviews="product.reviews"
          :uri="product.uri"
          :stock="product.stock"
          :collapsed="product.collapsed"
          :lean="product.lean"
          :bike="product.bike"
          :label="product.label"
          :favourite="product.favourite"
          :best_seller="product.best_seller"
          :summer_sale="product.summer_sale"
          :sale="product.sale"
          :new_in="product.new_in"
          :variants="product.variants"
        />
      </tz-col>
    </tz-row>
  </div>
</template>

<script setup lang="ts">
import TzProductTile from './Tz-Product-Tile.vue';
import { defineProps, computed } from 'vue';
import type { Product } from './Tz-Product-Tile.types';
import TzRow from '../../Structural/Tz-Row/Tz-Row.vue';
import TzCol from '../../Structural/Tz-Col/Tz-Col.vue';

export interface Products {
  products: Product[];
}

const formattedProducts = computed(() => {
  return chunk(6, props.products);
});

const chunk = (size: number, array: any[]) => {
  const chunkSize = size;
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
  }
  return chunk;
};

const props = defineProps<Products>();
</script>

<style scoped>
@media screen(lg) {
  .tz-col {
    @apply col-span-4;
  }
  .med-column {
    @apply col-span-6;
  }
}

@media screen(xl) {
  .tz-col {
    @apply col-span-3;
  }
  .large-column {
    @apply col-span-6;
  }
}
</style>
