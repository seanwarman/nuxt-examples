<template>
  <div
    v-if="!layout?.collapsed"
    class="flex w-full px-4 pt-4"
    :class="!pinMode && !compareMode ? 'justify-end' : 'justify-between'"
  >
    <fieldset v-if="compareMode || pinMode">
      <div class="flex h-full items-center">
        <template v-if="pinMode">
          <span
            v-if="pinMode"
            tabindex="0"
            class="cursor-pointer text-sm underline decoration-1"
            @click.prevent="$emit('onRemove')"
            @keyup.space="$emit('onRemove')"
            @keyup.enter="$emit('onRemove')"
            >REMOVE</span
          >
        </template>
        <template v-if="!pinMode && compareMode">
          <input
            :id="`compare-${id}`"
            class="cursor-pointer border border-solid border-gray-800"
            type="checkbox"
            @change="$emit('onCompare')"
            :checked="compare"
          />
          <label
            class="ml-2 cursor-pointer text-xs font-semibold leading-none tracking-widest text-gray-500"
            :for="`compare-${id}`"
            >COMPARE
            <span class="sr-only">Check the box to add the bike to the bike comparison list</span>
          </label>
        </template>
      </div>
    </fieldset>
    <div class="flex min-w-[63px]" :class="pinMode ? 'justify-between' : 'justify-end'">
      <div v-if="pinMode" class="relative flex">
        <div
          @click="$emit('onPin')"
          @keyup.space="$emit('onPin')"
          @keyup.enter="$emit('onPin')"
          tabindex="0"
          class="cursor-pointer mr-1"
          role="region"
          id="pinControls"
          aria-live="polite"
        >
          <span class="sr-only">Pin</span>

          <svg
            :class="pinned && 'pinned-animation'"
            width="29"
            height="29"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12.585" cy="12.7148" r="12.5" :fill="iconStyles(pinned).fill" />
            <path
              d="M8.58496 21.2148L11.1229 16.5619C11.3807 16.0893 11.9665 15.9056 12.448 16.1464L13.9137 16.8792C14.6281 17.2364 15.4523 16.6533 15.3532 15.8608L15.085 13.7148L18.0106 9.11736C18.3214 8.62906 18.1539 7.97974 17.6458 7.70259L14.0598 5.74658C13.5387 5.46234 12.8862 5.69194 12.6579 6.23986L10.585 11.2148L8.27409 11.7284C7.42937 11.9161 7.20564 13.0153 7.90979 13.5183L9.58496 14.7148"
              :stroke="iconStyles(pinned).stroke"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>

          <span class="sr-only" v-if="!pinned"> {{ productTitle }} is not pinned</span>
          <span class="sr-only" v-if="pinned"> You've pinned {{ productTitle }}</span>
        </div>
      </div>

      <div class="relative flex">
        <div
          @click="$emit('onFavourite')"
          @keyup.space="$emit('onFavourite')"
          @keyup.enter="$emit('onFavourite')"
          tabindex="0"
          class="cursor-pointer"
          role="region"
          id="wishlistControls"
          aria-live="polite"
        >
          <span class="sr-only">Add to your wishlist</span>

          <svg
            :class="favourite && 'favourite'"
            width="29"
            height="29"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12.585" cy="12.7148" r="12.5" :fill="iconStyles(favourite).fill" />
            <path
              d="M17.388 16.7251C18.9261 15.0833 20.2451 13.2942 20.2451 11.9871C20.2451 8.85171 18.1355 8.17261 16.1863 8.17261C14.2371 8.17261 12.6569 10.0679 12.6569 11.9871C12.6569 10.0679 11.0767 8.17261 9.12747 8.17261C7.17823 8.17261 5.24512 9.02545 5.24512 11.9871C5.24512 14.1776 9.29975 18.0746 11.4112 19.9554C12.126 20.5922 13.1892 20.589 13.9266 19.9785L15.2451 18.8869"
              :stroke="iconStyles(favourite).stroke"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>

          <span class="sr-only" v-if="!favourite"> {{ productTitle }} not added to wishlist yet </span>
          <span class="sr-only" v-if="favourite"> You've added {{ productTitle }} to your wishlist </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { withDefaults } from 'vue';
import type { Layout } from './Tz-Product-Tile.types';

enum IconVariant {
  Light = 'light',
  Mid = 'mid'
}

export interface ProductControlsProps {
  id: number;
  productTitle?: string;
  compareMode?: boolean;
  favourite?: boolean;
  pinned?: boolean;
  pinMode?: boolean;
  layout?: Layout;
  iconVariant?: string;
  compare?: boolean;
}

interface IconStyles {
  stroke: string;
  fill: string;
}

const props = withDefaults(defineProps<ProductControlsProps>(), {
  iconVariant: 'light',
  pinMode: false
});

const emits = defineEmits<{
  (eventName: 'onCompare'): void;
  (eventName: 'onRemove'): void;
  (eventName: 'onFavourite'): void;
  (eventName: 'onPin'): void;
}>();

function iconStyles<IconStyles>(selected: boolean) {
  return selected
    ? { stroke: 'white', fill: '#2F2F2F' }
    : {
        stroke: '#313130',
        fill:
          props.iconVariant === IconVariant.Light
            ? 'white'
            : props.iconVariant === IconVariant.Mid
            ? '#F5F6F4'
            : props.iconVariant
      };
}
</script>

<style scoped>
.favourite {
  @apply animate-[pulse_0.3s_ease-in-out] bg-dark;
  @apply rounded-full;
}

.pinned-animation {
  @apply animate-[pulse_0.3s_ease-in-out] bg-dark;
  @apply absolute z-10 rounded-full;
}

.lifestyle {
  @apply left-0 top-0 right-0 bottom-0 m-auto;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
  }

  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
  }

  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
}
</style>
