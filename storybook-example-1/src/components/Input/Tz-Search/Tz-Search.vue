<template>
  <button @click="openSearch">Show search</button>
  <div
    :open-search="openSearch"
    class="tz-search"
    ref="productSearchParent"
    :class="state.searchActive ? 'tz-search-visible' : 'tz-search-hidden'"
    @mousedown.prevent
    @focusout="onSearchFocusOut"
  >
    <div class="tz-search__content">
      <div class="tz-search__input-wrapper px-[1em] lg:container lg:px-0">
        <div class="tz-search__input-parent relative">
          <Transition>
            <div v-if="state.searchActive">
              <input
                class="tz-search__input"
                id="product-search"
                ref="productsearch"
                v-model="search"
                type="search"
                placeholder="Search"
                @click="resetInputFocusOnClick"
                @input="onInput"
                @focus="onFocusBlur(true)"
                @blur="onFocusBlur(false)"
                @keyup.enter="onEnter"
              />
              <img class="tz-search__input-icon" alt="Search Icon" title="Search Icon" src="/src/assets/search.svg" />
            </div>
          </Transition>
        </div>
        <div class="tz-search__close-button-parent">
          <button @click="closeSearch">
            <img src="@/assets/close.svg" />
            <span class="sr-only"> Close the search menu to return to the page you were on </span>
          </button>
        </div>
      </div>
      <tz-search-dropdown :classes="['mt-4 mb-6', 'md:mt-10 sm:mb-0', 'px-0']">
        <div class="col-span-12 sm:col-span-5">
          <tz-search-content
            v-if="!state.value"
            classes="mb-6"
            :title="state.searchedBefore ? 'LAST SEARCH' : 'TOP SEARCHES'"
          >
          </tz-search-content>
          <Transition>
            <tz-search-suggestions classes="mb-6" v-if="state.searchActive" :suggestions="results" :value="state.value">
              <template #fetched-suggestions>
                <tz-search-suggestion
                  v-for="(fs, k) in fetchedSuggestions"
                  :key="k"
                  :term="fs.term"
                  :logo="fs.logo"
                  :category="fs.category"
                  :link="fs.link"
                ></tz-search-suggestion>
              </template>
            </tz-search-suggestions>
          </Transition>
          <tz-search-content classes="mb-6" title="TOP BRANDS">
            <Transition>
              <div
                v-if="state.searchActive"
                class="mb-6 grid grid-cols-2 justify-items-center gap-4 px-1 md:grid-cols-3 lg:grid-cols-5"
              >
                <tz-disc v-for="(brand, k) in topBrands" :key="k" :data="brand"></tz-disc>
              </div>
            </Transition>
          </tz-search-content>
        </div>
        <div class="col-span-12 sm:col-span-7">
          <tz-search-content v-if="state.searchedBefore && !state.value.length" classes="mb-6" title="RECENTLY VIEWED">
            <transition>
              <div v-if="state.value.length" class="grid-col-1 grid gap-4 px-1 sm:grid-cols-2">
                <p>SHOW RECENTLY VIEWED PRODUCTS HERE</p>
              </div>
            </transition>
          </tz-search-content>
          <tz-search-content v-else-if="state.value.length" classes="mb-6" title="PRODUCTS">
            <transition>
              <div v-if="state.value.length" class="grid-col-1 grid gap-4 px-1 sm:grid-cols-2">
                <p>SHOW QUERIED PRODUCTS HERE</p>
              </div>
            </transition>
          </tz-search-content>
          <tz-search-content v-else classes="mb-6" title="TOP TRENDING">
            <transition>
              <div v-if="state.searchActive" class="grid-col-1 grid gap-4 px-1 md:grid-cols-2 lg:grid-cols-2">
                <tz-product-tile
                  v-for="(product, k) in maxShownProducts"
                  :key="k"
                  :id="product.id"
                  :sku="product.sku"
                  :title="product.title"
                  :image="product.image"
                  :price="product.price"
                  :reviews="product.reviews"
                  :uri="product.uri"
                  :stock="product.stock"
                  collapsed
                  :bike="product.bike"
                  :label="product.label"
                  :favourite="product.favourite"
                />
              </div>
            </transition>
            <div v-if="displayMore" class="search-button mt-12 mb-8 flex">
              <tz-button @click="viewAllProducts()" class="m-auto" theme="dark"
                >View all products {{ products.length }}</tz-button
              >
            </div>
          </tz-search-content>
        </div>
      </tz-search-dropdown>
      <tz-search-dropdown :classes="['mt-0']">
        <div class="col-span-7">
          <tz-search-content classes="mb-6" title="SUPPORT">
            <Transition>
              <div v-if="state.searchActive" class="grid-col-1 grid gap-4 px-1 sm:grid-cols-2">
                <tz-support v-for="(s, i) in support" :key="i" :image="s.image" :content="s.content" />
              </div>
            </Transition>
          </tz-search-content>
        </div>
      </tz-search-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref, nextTick, computed, defineEmits } from 'vue';
import TzSearchDropdown from '@/components/Input/Tz-Search/Tz-Search-Dropdown.vue';
import TzSearchSuggestions from '@/components/Input/Tz-Search/Tz-Search-Suggestions.vue';
import TzSearchSuggestion from '@/components/Input/Tz-Search/Tz-Search-Suggestion/Tz-Search-Suggestion.vue';
import TzSearchContent from '@/components/Input/Tz-Search/Tz-Search-Content.vue';
import TzSupport from '@/components/Informational/Tz-Support/Tz-Support.vue';
import TzDisc from '@/components/Informational/Tz-Disc/Tz-Disc.vue';
import TzProductTile from '@/components/Informational/Tz-Product-Tile/Tz-Product-Tile.vue';
import TzButton from '@/components/Action/Tz-Button/Tz-Button.vue';

import type { Suggestion, Search, Brand, Support, TBrands } from './Tz-Search.types';

import type { Product } from '@/components/Informational/Tz-Product-Tile/Tz-Product-Tile.types';

import { useVueFuse } from 'vue-fuse';

export type OnFocusBlur = (focused: boolean) => void;

export interface TzSearchProps {
  suggestions?: Suggestion[];
  fetchedSuggestions?: Suggestion[];
  searches?: Search[];
  brands?: Brand[];
  topBrands?: TBrands[];
  support: Support[];
  products: Product[];
}

const props = defineProps<TzSearchProps>();

const productSearchParent = ref<HTMLDivElement>();
const productsearch = ref<HTMLInputElement>();

const state = reactive({
  focused: false,
  value: '',
  searchActive: false,
  searchedBefore: false
});

const emits = defineEmits<{
  (eventName: 'onInput', value?: string): void;
  (eventName: 'onEnter', event: Event): void;
  (eventName: 'closeSearch', event: Event): void;
  (e: 'ViewAllProducts', products: Product[]): void;
}>();

onMounted(() => {
  // Here will decide the process of the different scenarios and the conditions
  // required to achieve them
  // - LocalStorage to store any previous searches
  // - Scenario 1: Load default data curated by Tredz
  // - Scenario 2: Load previous searched from LocalStorage
  // eslint-disable-next-line no-empty
  // if (localStorage && localStorage.getItem('SearchHistory')) {}
});

const { search, results, noResults } = useVueFuse(props.suggestions !== undefined ? props.suggestions : [], {
  keys: ['term'],
  includeMatches: true
});

const onInput = ({ target }: Event) => {
  state.value = (target as HTMLInputElement).value;
  return emits('onInput', (target as HTMLInputElement).value);
};

const onEnter = (event: Event) => emits('onEnter', event);

const onSearchFocusOut = () => {
  let el = productSearchParent.value;

  setTimeout(() => {
    const children = el?.querySelectorAll(
      'a[href], button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])'
    );

    let found = false;

    if (children) {
      for (let child of children) {
        if (child === document.activeElement) found = true;
      }
    }

    if (!found) {
      state.searchActive = false;
      document.body.style.overflow = 'auto';
    }
  }, 100);
};

const resetInputFocusOnClick = async () => {
  await nextTick(() => {
    productsearch.value && productsearch.value.focus();
  });
};

const openSearch = async () => {
  state.searchActive = true;
  search.value = '';
  state.value = '';

  window.scroll(0, 0);
  document.body.style.overflow = 'hidden';

  await nextTick(() => {
    productsearch.value && productsearch.value.focus();
  });
};

const closeSearch = () => {
  const ae = document.activeElement as HTMLElement;

  document.body.style.overflow = 'auto';

  ae && ae.blur();
};

const onFocusBlur: OnFocusBlur = (focused) => (state.focused = focused);

const displayMore = computed(() => {
  return props.products.length && props.products.length > 6 ? true : false;
});

const maxShownProducts = computed(() => {
  return props.products.length && props.products.length > 6 ? props.products.slice(0, 6) : props.products;
});

const viewAllProducts = () => {
  emits('ViewAllProducts', props.products);
};
</script>

<style scoped>
.tz-search-visible:focus-within {
  @apply visible;
}

.tz-search-hidden:not(:focus-within) {
  @apply invisible;
}

.tz-search {
  @apply absolute top-0 right-0 bottom-0 left-0 z-20 h-full w-full;
}
.tz-search:after {
  content: '';
  @apply pointer-events-none absolute top-0 right-0 bottom-0 left-0 h-full w-full bg-black/[.25];
}
.tz-search__content {
  @apply absolute left-0 right-0 z-20 max-h-[95vh] w-full overflow-auto overscroll-none bg-white py-5;
}

.tz-search__input-wrapper {
  @apply grid grid-cols-5 items-center lg:grid-cols-3;
}

.tz-search__close-button-parent {
  @apply justify-self-end;
}

.tz-search__input-parent {
  @apply col-span-4 lg:col-span-2;
}

.tz-search__input {
  @apply w-full py-[15px] px-[22px];
  @apply bg-neutral;
  @apply rounded-full;
  @apply text-sm font-light;
  @apply caret-superinfo;
  @apply text-gray-500;
  @apply appearance-none;
}
.tz-search__input-icon {
  @apply pointer-events-none absolute;
  @apply top-0 bottom-0 right-6 m-auto;
  @apply h-[1.25rem];
}

/* clears the 'X' from Internet Explorer */
input[type='search']::-ms-clear {
  display: none;
  width: 0;
  height: 0;
}

input[type='search']::-ms-reveal {
  display: none;
  width: 0;
  height: 0;
}

/* clears the 'X' from Chrome */
input[type='search']::-webkit-search-decoration,
input[type='search']::-webkit-search-cancel-button,
input[type='search']::-webkit-search-results-button,
input[type='search']::-webkit-search-results-decoration {
  display: none;
}

.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease-in-out;
}

.v-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.v-leave-to {
  opacity: 1;
  transform: translateY(0px);
}
</style>
