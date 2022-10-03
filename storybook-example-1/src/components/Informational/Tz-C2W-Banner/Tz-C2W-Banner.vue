<template>
  <article
    class="relative flex h-[520px] flex-col justify-between px-3 py-5 lg:h-[710px]"
    :class="{
      'sm:static sm:grid sm:grid-cols-3 sm:grid-rows-6 sm:justify-start sm:gap-5 sm:bg-transparent md:grid-cols-4 ':
        isResponsive
    }"
  >
    <div class="relative z-10 pt-1" :class="{ 'sm:col-span-1 sm:col-start-1 ': isResponsive }">
      <h2
        class="text-center text-xs font-bold uppercase text-white"
        :class="{
          'sm:text-left sm:text-sm sm:tracking-wider sm:text-dark-fade': isResponsive
        }"
      >
        <slot name="title"> cycle to work </slot>
      </h2>
    </div>
    <div class="relative z-10 hidden" :class="{ 'sm:row-span-2 sm:block': isResponsive }">
      <h1 class="max-w-[140px] text-xl font-bold">
        <slot name="heading">Get your bike on the C2W scheme!</slot>
      </h1>
    </div>
    <div
      class="flex flex-col items-center gap-2"
      :class="{
        'sm:relative sm:col-span-2 sm:col-start-2 sm:row-span-full sm:row-start-1 sm:items-start sm:justify-end sm:p-5 md:col-span-3 md:col-start-2 md:p-12 lg:p-16':
          isResponsive
      }"
    >
      <p
        class="relative z-10 m-0 max-w-xs text-center text-3xl font-black leading-9 text-white"
        :class="{ 'sm:text-left sm:text-2xl ': isResponsive }"
      >
        <slot name="quote">I didn't know I could claim a mountain bike with a cycle to work scheme!"</slot>
      </p>
      <p
        class="relative z-10 m-0 hidden text-sm font-semibold text-white"
        :class="{ 'sm:inline md:text-lg': isResponsive }"
      >
        <slot name="slogan">Ride roads on the weekdays and shred trails on the weekend.</slot>
      </p>
      <img class="absolute top-0 left-0 z-0 h-full w-full object-cover brightness-75" :src="bannerImage.src" />
    </div>
    <div class="relative z-10">
      <tz-button :link="link" class="w-full" :class="{ 'sm:w-auto': isResponsive }"
        ><slot name="label">apply now</slot>
      </tz-button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import TzButton from '@/components/Action/Tz-Button/Tz-Button.vue';
import type { Image, Link } from '@/components/Informational/types';

export interface Props {
  bannerImage: Image;
  isResponsive?: boolean;
  link: Link;
}

const props = withDefaults(defineProps<Props>(), {
  isResponsive: true
});

const { bannerImage, isResponsive } = toRefs(props);
</script>
