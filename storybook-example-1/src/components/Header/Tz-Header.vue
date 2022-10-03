<template>
  <header class="grid grid-cols-12 gap-2 p-[10px] sm:px-[20px] lg:px-[40px] xl:px-[80px]">
    <div class="order-1 col-span-4 md:hidden" @click="menuClicked">
      <tz-menu-icon class="w-5"></tz-menu-icon>
    </div>
    <div
      class="order-2 col-span-4 flex justify-center md:order-1 md:col-span-3 md:justify-start xl:col-span-1"
      @click="logoClicked"
    >
      <img
        src="../../assets/logos/svgs/master-logo.svg"
        alt="tredz logo, the online bike store for cycle enthusiasts"
        title="tredz.co.uk, the online bike store for cycle enthusiasts"
        class="h-7"
      />
    </div>
    <div class="tr-site-header__search order-4 col-span-12 md:order-2 md:col-span-6">
      <button
        class="flex w-full items-center justify-start gap-2 rounded-full bg-gray-100 py-1 px-3 text-gray-400"
        @click="searchClicked"
      >
        <tz-search-icon class="w-5 text-gray-500" />
        Search
      </button>
    </div>
    <div class="order-3 col-span-4 flex justify-end gap-2 md:col-span-3 xl:col-span-5">
      <div class="tr-site-header__control" @click="wishlistClicked">
        <span class="flex w-[30px] items-center justify-center rounded-full bg-gray-100 p-[4px] hover:bg-gray-200"
          ><tz-wishlist-icon
        /></span>
      </div>
      <div class="tr-site-header__control" @click="basketClicked">
        <span class="flex w-[30px] items-center justify-center rounded-full bg-gray-100 p-[4px] hover:bg-gray-200"
          ><tz-basket-icon
        /></span>
      </div>
      <div class="tr-site-header__control" @click="myAccountClicked">
        <span class="flex w-[30px] items-center justify-center rounded-full bg-gray-100 p-[4px] hover:bg-gray-200"
          ><tz-account-icon
        /></span>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, reactive } from '@vue/runtime-core';
import TzMenuIcon from '../Informational/Icons/Tz-Menu-Icon.vue';
import TzWishlistIcon from '../Informational/Icons/Tz-Wishlist-Icon.vue';
import TzBasketIcon from '../Informational/Icons/Tz-Basket-Icon.vue';
import TzAccountIcon from '../Informational/Icons/Tz-Account-Icon.vue';
import TzSearchIcon from '../Informational/Icons/Tz-Search-Icon.vue';

export default defineComponent({
  components: {
    TzMenuIcon,
    TzAccountIcon,
    TzBasketIcon,
    TzWishlistIcon,
    TzSearchIcon
  },
  props: {},
  setup(props) {
    props = reactive(props);
    return {};
  },
  methods: {
    logoClicked(event: Event) {
      this.$emit('logoClicked', event);
    },
    menuClicked(event: Event) {
      this.$emit('menuClicked', event);
    },
    searchClicked(event: Event) {
      this.$emit('searchClicked', event);
    },
    wishlistClicked(event: Event) {
      this.$emit('wishlistClicked', event);
    },
    basketClicked(event: Event) {
      this.$emit('basketClicked', event);
    },
    myAccountClicked(event: Event) {
      this.$emit('myAccountClicked', event);
    }
  }
});
</script>
