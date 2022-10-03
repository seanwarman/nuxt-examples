<!-- eslint-disable vue/no-unused-vars -->
<template>
  <vue-final-modal
    v-bind="$attrs"
    v-model="show"
    :focus-retain="true"
    :focus-trap="true"
    :scroll-lock="true"
    classes="flex justify-center items-center"
    content-class="relative flex flex-col p-0 bg-white w-screen h-screen"
  >
    <div class="flex flex-col-reverse justify-between sm:flex-row sm:p-5">
      <div class="flex items-center justify-between px-3 py-5 sm:p-0">
        <span>placeholder comparison button</span>

        <div class="visible flex sm:hidden">
          <!-- placeholder buttons -->
          <div ref="next" class="left mr-1 p-4" @click="slider.slidePrev(200)">left</div>
          <div class="right p-4" @click="slider.slideNext(200)">right</div>
        </div>
      </div>

      <tz-ct-close-button @click="onCloseClick" />
    </div>

    <!-- DESKTOP -->
    <tz-row class="overflow-scroll" :cols="bikeList.length" v-if="width > layoutBreakpoint">
      <tz-col v-for="bike in bikeList" :key="bike.id" :class="{ 'order-first bg-slate-400': bike.id === pinnedId }">
        <tz-ct-content-wrapper :sticky="true">
          <!-- placholders - will be replace with data display components -->
          <h2>{{ bike.title }} {{ bike.id }}</h2>
          <p>id: {{ bike.id }}</p>

          <template #product-tile>
            <p>product tile</p>
          </template>

          <template #color-select>
            <p>color select</p>
          </template>

          <template #size-select>
            <p>size select</p>
          </template>

          <template #view-bike-cta>
            <tz-button class="w-full" type="primary" size="md" @click="$emit('onViewBike', bike)">VIEW BIKE</tz-button>
          </template>
        </tz-ct-content-wrapper>
      </tz-col>
    </tz-row>

    <!-- MOBILE -->
    <tz-row class="overflow-scroll" :cols="2" v-else>
      <tz-col class="bg-slate-400">
        <tz-ct-content-wrapper>
          <!-- placholders - will be replace with data display components -->
          <h2>{{ pinnedBike.title }} {{ pinnedBike.id }}</h2>
          <p>id: {{ pinnedBike.id }}</p>

          <template #product-tile>
            <p>product tile</p>
          </template>

          <template #color-select>
            <p>color select</p>
          </template>

          <template #size-select>
            <p>size select</p>
          </template>

          <template #view-bike-cta>
            <tz-button class="w-full" type="primary" size="md" @click="$emit('onViewBike', bike)">VIEW BIKE</tz-button>
          </template>
        </tz-ct-content-wrapper>
      </tz-col>

      <tz-col>
        <swiper
          class="w-[50vw]"
          :modules="[Navigation, Mousewheel, Scrollbar, A11y]"
          :slides-per-view="1"
          :slidesPerGroupSkip="1"
          :space-between="0"
          noSwipingClass="a"
          :a11y="false"
          :mousewheel="true"
          :scrollbar="{ draggable: true, snapOnRelease: true }"
          :allowTouchMove="true"
          :slideToClickedSlide="false"
          @swiper="onSwiper"
        >
          <swiper-slide v-for="(bike, index) in comparisonBikes" :key="index" :data-slide="index">
            <div class="w-[50vw]">
              <tz-ct-content-wrapper>
                <!-- placholders - will be replace with data display components -->
                <h2>{{ bike.title }} {{ bike.id }}</h2>
                <p>id: {{ bike.id }}</p>

                <template #product-tile>
                  <p>product tile</p>
                </template>

                <template #color-select>
                  <p>color select</p>
                </template>

                <template #size-select>
                  <p>size select</p>
                </template>

                <template #view-bike-cta>
                  <!-- ts-ignore -->
                  <tz-button class="w-full" type="primary" size="md" @click="$emit('onViewBike', bike)"
                    >VIEW BIKE</tz-button
                  >
                </template>
              </tz-ct-content-wrapper>
            </div>
          </swiper-slide>
        </swiper>
      </tz-col>
    </tz-row>
  </vue-final-modal>
</template>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { VueFinalModal } from 'vue-final-modal';
import { ref, computed } from 'vue';
import TzCtCloseButton from '@/components/Action/Tz-Ct-Close-Button/Tz-Ct-Close-Button.vue';
import TzRow from '@/components/Structural/Tz-Row/Tz-Row.vue';
import TzCol from '@/components/Structural/Tz-Col/Tz-Col.vue';
import TzCtContentWrapper from '@/components/Structural/Tz-Comparison-Tool/Tz-Ct-Content-Wrapper.vue';
import TzButton from '@/components/Action/Tz-Button/Tz-Button.vue';
import type { BikeDetails } from '@/components/Structural/types';
import windowResizer from '@/composables/windowResizer';

// Swiper
import type { Swiper as SwiperType } from 'swiper';
import { Mousewheel, Navigation, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';

export interface Props {
  show?: boolean;
  bikesData: Array<BikeDetails>;
  pinnedId: number;
  onShow?: (value: boolean) => void;
  onViewBike: (bike: BikeDetails) => void;
}

const props = withDefaults(defineProps<Props>(), {
  show: true
});

// swiper layout enabled for screens below 768px width
const { width } = windowResizer();
const layoutBreakpoint = 768;

const emits = defineEmits<{
  (eventName: 'onShow', value: boolean): void;
  (eventName: 'onViewBike', bike: BikeDetails): void;
}>();

const bikeList = computed(() => {
  return props.bikesData;
});

const pinnedBike = computed(() => {
  return props.bikesData.find((bike) => bike.id === props.pinnedId);
});

const comparisonBikes = computed(() => {
  return props.bikesData.filter((bike) => bike.id !== props.pinnedId);
});

const show = computed({
  get: () => props.show,
  set: (value) => {
    emits('onShow', value);
  }
});

const onCloseClick = function () {
  show.value = false;
};

/**
 * Swiper
 */
const slider = ref();

const onSwiper = (swiper: SwiperType) => {
  slider.value = swiper;
};
</script>
