<template>
  <div class="slider relative" @mouseover="state.sliderActive = true" @mouseleave="state.sliderActive = false">
    <Transition name="fade">
      <div v-if="state.sliderActive" ref="controls" class="controls absolute right-0 flex text-white">
        <tz-button ref="next" class="left mr-1 p-4" theme="dark" size="sm" @click="slider.slidePrev(200)">
          <tz-chevron-icon class="w-5 rotate-180"></tz-chevron-icon>
        </tz-button>
        <tz-button class="right p-4" theme="dark" size="sm" @click="slider.slideNext(200)">
          <tz-chevron-icon class="w-5"></tz-chevron-icon>
        </tz-button>
      </div>
    </Transition>
    <div class="title-heading pb-2 pt-16">
      <h5 class="text-sm font-bold uppercase">{{ heading }}</h5>
    </div>
    <swiper
      :modules="[Navigation, Mousewheel, Scrollbar, A11y]"
      :slides-per-view="1.1"
      :slidesPerGroupSkip="1"
      :space-between="30"
      :navigation="{
        nextEl: '.button-swiper-next',
        prevEl: '.button-swiper-prev'
      }"
      :breakpoints="{
        '768': {
          slidesPerView: 3.2
        },
        '1300': {
          slidesPerView: 4.1
        }
      }"
      noSwipingClass="a"
      :a11y="false"
      :mousewheel="true"
      :scrollbar="{ draggable: true, snapOnRelease: true }"
      :allowTouchMove="false"
      :slideToClickedSlide="false"
      @swiper="onSwiper"
    >
      <swiper-slide v-for="(card, index) in cards" :key="card.id" :data-slide="index">
        <template v-if="state.cardType == 'products'">
          <tz-product-tile
            lean
            :id="card.id"
            :sku="card.sku"
            :title="card.title"
            :price="card.price"
            :image="card.image"
            :reviews="card.reviews"
            :uri="card.uri"
          >
          </tz-product-tile>
        </template>
        <template v-else-if="state.cardType == 'brands'">
          <tz-brand-card :id="card.id" :title="card.title" :image="card.image" :brand="card.brand" :link="card.link">
          </tz-brand-card>
        </template>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue';
// import Swiper core and required modules
import type { Swiper as SwiperType } from 'swiper';
import { Mousewheel, Navigation, Scrollbar, A11y } from 'swiper';

import type { ProductTile, BrandCard } from '../types';

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue';

import TzChevronIcon from '@/components/Informational/Icons/Tz-Chevron-Icon.vue';
import TzProductTile from '@/components/Informational/Tz-Product-Tile/Tz-Product-Tile.vue';
import TzBrandCard from '@/components/Informational/Tz-BrandCard/Tz-BrandCard.vue';
import TzButton from '@/components/Action/Tz-Button/Tz-Button.vue';

// Import Swiper styles
import 'swiper/css';

export interface SliderProps {
  heading: string;
  products?: ProductTile[];
  brands?: BrandCard[];
}
onMounted(() => {
  cardType();
});

enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left'
}

// Swiper reference
const slider = ref();

// Import Swiper styles
const state = reactive({
  hasNext: true,
  hasPrev: false,
  step: 0,
  sliderActive: false,
  cardType: ''
});

const props = withDefaults(defineProps<SliderProps>(), {
  heading: 'Recommended'
});

// On initialization of Swiper assign custom ref 'slider' as Swiper component
const onSwiper = (swiper: SwiperType) => {
  slider.value = swiper;
};

const cards = computed(() => {
  return props.products ? props.products : props.brands;
});

/**
 * Set the type of content being injected so we can determine the Slider component
 */
const cardType = () => {
  state.cardType = props.products ? 'products' : 'brands';
};
</script>

<style scoped>
.slider :deep(.swiper-scrollbar) {
  height: 11px;
  background: #f5f6f4;
  @apply relative left-0 mt-5;
}

.slider :deep(.swiper-scrollbar-drag) {
  height: 100%;
  width: 100%;
  position: relative;
  background: #2f2f2f;
  left: 0;
  top: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  @apply delay-300;
}
</style>
