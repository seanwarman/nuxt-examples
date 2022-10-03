<template>
  <tz-row :cols="4" :gap="{ sm: 0, md: 5, lg: 5, xl: 6 }" :sm="1" :md="4" :class="['relative']">
    <tz-col span="full" :class="['sm:mb-3']">
      <h6 class="text-sm font-bold uppercase tracking-wider">Get the look</h6>
    </tz-col>
    <tz-row :class="['md:col-span-2', 'sm:col-span-full', 'lg:grid-rows-5']">
      <tz-col :class="['lg:row-span-4']">
        <tz-responsive-image :media="bundle.media" :image="bundle.image"></tz-responsive-image>
      </tz-col>
      <tz-col v-if="width > desktopWidth" :class="['self-end']">
        <div class="info border-t-4 border-t-slate-900">
          <tz-row :cols="2" :md="4" :gap="{ md: 4 }">
            <tz-col span="1">
              <div class="price text-2xl uppercase">
                <span class="mt-4 block text-xs font-semibold text-dark-fade">Total Bundle</span>
                &pound;{{ bundle.price }}
              </div>
            </tz-col>
            <tz-col span="1">
              <div class="cart mt-4 text-right uppercase">
                <span class="inline-block text-sm text-dark-fade"
                  ><Tz-Basket-Icon class="mx-2 inline-block align-top" />({{ bundle.total }} items)</span
                >
              </div>
            </tz-col>
            <tz-col span="full" :md="2">
              <div class="cta">
                <button
                  class="mt-5 w-full rounded-md bg-slate-900 p-3 text-center text-sm font-bold uppercase text-white"
                >
                  {{ bundle.call_to_action.label }}
                </button>
              </div>
            </tz-col>
          </tz-row>
        </div>
      </tz-col>
    </tz-row>
    <tz-col :span="2" :md="2">
      <tz-product-tile
        v-if="productBundle.main"
        :id="productBundle.main.id"
        :sku="productBundle.main.sku"
        :title="productBundle.main.title"
        :price="productBundle.main.price"
        :image="productBundle.main.image"
        :reviews="productBundle.main.reviews"
        :class="['sm:mt-4']"
        :uri="productBundle.main.uri"
        lean
        :bike="productBundle.main.bike"
      ></tz-product-tile>
    </tz-col>
    <tz-col :span="1" sm="full" md="full">
      <div class="products mt-7 h-full lg:mt-0">
        <tz-row :cols="1" :md="2" :gap="{ md: 5, lg: 2, xl: 2 }" class="h-full">
          <tz-col v-for="(product, index) in productBundle.products" :key="index" :class="['sm:my-3']">
            <tz-product-tile
              :lean="display.lean"
              :collapsed="display.collapsed"
              :id="product.id"
              :sku="product.sku"
              :title="product.title"
              :price="product.price"
              :image="product.image"
              :reviews="product.reviews"
              :uri="product.uri"
            ></tz-product-tile>
          </tz-col>
        </tz-row>
      </div>
    </tz-col>
    <tz-col v-if="width < 1300" sm="full" md="full" :span="1" :class="['sm:mt-6', 'md:mt-12']">
      <div class="info border-t-4 border-t-slate-900">
        <tz-row :cols="2" :md="4" :gap="{ md: 4 }">
          <tz-col span="1">
            <div class="price text-2xl uppercase">
              <span class="mt-4 block text-xs font-semibold text-dark-fade">Total Bundle</span>
              {{ handlePrices(parseInt(bundle.price)) }}
            </div>
          </tz-col>
          <tz-col span="1">
            <div class="cart mt-4 text-right uppercase">
              <span class="inline-block text-sm text-dark-fade"
                ><Tz-Basket-Icon class="mx-2 inline-block align-top" />({{ bundle.total }} items)</span
              >
            </div>
          </tz-col>
          <tz-col span="full" :md="2">
            <div class="cta">
              <button
                class="mt-5 w-full rounded-md bg-slate-900 p-3 text-center text-sm font-bold uppercase text-white"
              >
                {{ bundle.call_to_action.label }}
              </button>
            </div>
          </tz-col>
        </tz-row>
      </div>
    </tz-col>
  </tz-row>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TzRow from '@/components/Structural/Tz-Row/Tz-Row.vue';
import TzCol from '@/components/Structural/Tz-Col/Tz-Col.vue';
import type { BundleInfo } from './types';
import TzProductTile from '@/components/Informational/Tz-Product-Tile/Tz-Product-Tile.vue';
import TzResponsiveImage from '../Tz-ResponsiveImage/Tz-ResponsiveImage.vue';
import TzBasketIcon from '@/components/Informational/Icons/Tz-Basket-Icon.vue';

import { handlePrices } from '@/composables/numbers';

import type { ProductTile } from '../types';

import windowResizer from '@/composables/windowResizer';

export interface Bundle {
  bundle: BundleInfo;
  products: ProductTile[];
}

/**
 * Move these to a utitlity function,
 * ideally we would grab from the tailwind.config
 * but apparently this isn't easy with typescript
 */
const desktopWidth = 1300;

const { width } = windowResizer();

const props = defineProps<Bundle>();

const display = computed(() => {
  return {
    collapsed: width.value < desktopWidth,
    lean: width.value >= desktopWidth
  };
});

/**
 * Separate out selected products to determine layout in grid
 *
 * @return Object
 */
const productBundle = computed(() => {
  const products = props.products;
  const main = products.shift();
  return {
    main,
    products
  };
});
</script>
