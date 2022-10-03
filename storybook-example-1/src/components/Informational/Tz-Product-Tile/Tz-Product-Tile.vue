<template>
  <div
    :id="`product-${id}`"
    class="tz-product-tile relative grid h-full grid-cols-12 gap-3 overflow-hidden"
    :class="{ 'bg-[#FBFBFB]': !collapsed }"
  >
    <tz-product-tile-label
      v-if="label && !collapsed"
      :name="state.label.name"
      :color="state.label.color"
      :bg-color="state.label.bg_color"
    />
    <div
      class="main-product-container"
      :class="{
        'col-span-5': collapsed,
        'col-span-full': !collapsed,
        'bg-[#FBFBFB]': lean || collapsed,
        relative: lifestyle
      }"
    >
      <div class="col-span-full">
        <tz-product-controls
          :id="id"
          :product-title="title"
          :compareMode="!collapsed && !lean && !pinMode"
          :compare="props.compare"
          :icon-variant="iconVariant"
          :favourite="props.favourite"
          :pinned="props.pinned"
          :pin-mode="props.pinMode"
          @onCompare="$emit('onCompare', props.id, props.compare)"
          @onFavourite="$emit('onFavourite', props.id, props.favourite)"
          @onPin="$emit('onPin', props.id, props.pinned)"
          @onRemove="$emit('onRemove', props.id)"
          :class="{ absolute: lifestyle }"
        />
      </div>
      <div class="col-span-full">
        <tz-product-tile-image
          :id="id"
          :product-title="title"
          :current-product-image="state.currentProductImage"
          :layout="layout"
          :lifestyle="lifestyle"
          :bike="bike"
        >
        </tz-product-tile-image>
      </div>
      <div class="col-span-full">
        <tz-product-tile-variants
          v-if="variants && variants?.length > 0"
          v-bind="$attrs"
          :active-variant="state.activeVariant"
          :active-variant-content="state.activeVariantContent"
          :variants="variants"
          @handle-active-variant="handleActiveVariant"
          :class="{
            'lifestyle-variants': lifestyle,
            'product-variants': !lifestyle
          }"
        />
      </div>
    </div>
    <div
      :class="{
        'col-span-7': collapsed,
        'col-span-full': !collapsed,
        'bg-white': !lean
      }"
    >
      <tz-product-tile-content
        :title="title"
        :uri="uri"
        :reviews="reviews"
        :price="price"
        :layout="layout"
        :lifestyle="state.currentProductImage.lifestyle"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import TzProductTileLabel from '@/components/Informational/Tz-Product-Tile-Label/Tz-Product-Tile-Label.vue';
import TzProductTileContent from '@/components/Informational/Tz-Product-Tile/Tz-Product-Tile-Content.vue';
import TzProductTileImage from './Tz-Product-Tile-Image.vue';
import { getCookie } from '@/scripts/getCookies';

import { computed, onMounted, reactive, defineProps, toRefs, defineEmits, nextTick } from 'vue';

import type { Image } from '../types';
import type { Price, Reviews, Variants } from './Tz-Product-Tile.types';
import TzProductTileVariants from './Tz-Product-Tile-Variants.vue';
import TzProductControls from './Tz-Product-Controls.vue';

export interface Product {
  id: number;
  sku: string;
  title: string;
  price: Price;
  uri: string;
  image?: Image;
  reviews?: Reviews;
  stock?: number;
  collapsed?: boolean;
  lean?: boolean;
  bike?: boolean;
  lifestyle?: boolean;
  label?: boolean;
  favourite?: boolean;
  best_seller?: boolean;
  summer_sale?: boolean;
  sale?: boolean;
  new_in?: boolean;
  variants?: Variants[];
  iconVariant?: string;
  compare?: boolean;
  pinned?: boolean;
  pinMode?: boolean;
}

const state = reactive({
  currentProductImage: {
    src: '' as string | undefined,
    alt: '' as string | undefined,
    lifestyle: false as boolean | null | undefined
  },
  activeVariant: undefined as number | undefined,
  activeVariantContent: {} as Variants | undefined,
  loading: false,
  label: {
    name: '' as string,
    color: '' as string,
    bg_color: '' as string
  }
});

/**
 *
 * Set prop default data
 *
 */
const props = defineProps<Product>();

const layout = computed(() => {
  return {
    collapsed: props.collapsed,
    lean: props.lean
  };
});

/**
 *
 * Set Typed common emits
 *
 */
const emits = defineEmits<{
  (eventName: 'onCompare', id: number, compare: boolean): void;
  (eventName: 'onRemove', id: number): void;
  (eventName: 'onFavourite', id: number, favourite: boolean): void;
  (eventName: 'onPin', id: number, selected: boolean): void;
}>();

/**
 *
 * Label data
 *
 */
const labels = {
  favourite() {
    state.label.name = 'TREDZ FAVOURITE';
    state.label.color = '#D31716';
  },
  bestSeller() {
    state.label.name = 'BEST SELLER';
    state.label.color = '#318B12';
  },
  newIn() {
    state.label.name = 'NEW IN';
    state.label.color = '#FFFFFF';
    state.label.bg_color = '#D31716';
  },
  lowStock() {
    state.label.name = 'LOW STOCK';
    state.label.color = '#2F2F2F';
  },
  percentageOff() {
    state.label.name = `${props.price.discount?.percentage}% OFF`;
    state.label.color = '#FFFFFF';
    state.label.bg_color = '#2F2F2F';
  },
  summer() {
    state.label.name = 'SUMMER SALE';
    state.label.color = '#000000';
    state.label.bg_color = '#F7D66D';
  },
  sale() {
    state.label.name = 'SALE';
    state.label.color = '#FFFFFF';
    state.label.bg_color = '#D31716';
  }
};

/**
 *
 * Label ternary condition
 *
 * @func Runs obj functions from above based on simple conditions
 *       Values can easily be changed
 *
 */
const labelChecker = () => {
  const d = price.value.discount ? price.value.discount?.percentage : false;

  if (!props.label || props.collapsed) return;

  return props.favourite
    ? labels.favourite()
    : props.best_seller
    ? labels.bestSeller()
    : props.new_in
    ? labels.newIn()
    : props.stock && props.stock < 150
    ? labels.lowStock()
    : d && d > 10 && props.sale
    ? labels.percentageOff()
    : props.summer_sale
    ? labels.summer()
    : props.sale
    ? labels.sale()
    : null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleActiveVariant(v: any) {
  const { image, lifestyle } = v.variant;

  await nextTick(() => {
    state.currentProductImage = image;
    state.currentProductImage.lifestyle = lifestyle;
    state.activeVariant = v.index;
    state.activeVariantContent = v.variant;
  });
}

/**
 *
 * Populates the product image on load based on variants available
 * @func Assumes variants are in the correct order on data inception
 *
 * It can accept one image on the image prop if provided else will use the variant image data
 * - image can be provided or one variant passed
 * - the difference being a variant option won't appear with the former
 *
 */
const handleInitialImage = () => {
  if (
    (variants && typeof variants.value === 'undefined') ||
    (variants && typeof variants.value !== 'undefined' && variants.value.length === 0)
  ) {
    state.currentProductImage.src = props.image?.src;
    state.currentProductImage.alt = props.image?.alt;
    return;
  }

  if (variants && variants.value) {
    const imageStockCheck = (array: Array<Variants>) => {
      return array.find((item) => item.instock === true && item);
    };

    state.activeVariantContent = imageStockCheck(variants.value);
    state.activeVariant = imageStockCheck(variants.value)?.id;
    state.currentProductImage.src = imageStockCheck(variants.value)?.image.src;
    state.currentProductImage.alt = imageStockCheck(variants.value)?.image.alt;
    state.currentProductImage.lifestyle = imageStockCheck(variants.value)?.lifestyle;
  }
};

/**
 * Get values from specified cookie.
 *
 * @param cookie: string
 *   Name of cookie
 */
const getWishListCookieValues = (cookie: string) => {
  const cookieValues: number[] = [];
  let cookies = getCookie(cookie);
  if (!cookies.length) {
    return [];
  }
  let cookiesSorted = cookies
    .split('|')
    .filter((val) => {
      return val !== '';
    })
    .map((v) => parseInt(v));
  cookieValues.push(...cookiesSorted);
  return cookieValues;
};

onMounted(() => {
  handleInitialImage();
  labelChecker();
});

const { id, title, price, variants } = toRefs(props);
</script>
