<template>
  <tz-row :cols="1" :md="2" :gap="5" class="lg:grid-cols-2">
    <tz-col class="tz-jumbo-card" v-for="(card, k) in cards" :key="k">
      <tz-link :link="card.content.link">
        <div
          class="tz-jumbo-card__image-parent mb-[18px] bg-[#F3F3F3]"
          :class="[card.image.lifestyle && 'overflow-hidden']"
        >
          <span
            v-if="card.label.enabled"
            class="tz-jumbo-card__label absolute inset-9 z-20 text-[14px] font-extrabold uppercase tracking-widest"
            >{{ card.label.text }}</span
          >
          <img
            :src="card.image.src"
            :alt="card.image.alt"
            class="absolute top-0 bottom-0 right-0 left-0 m-auto block"
            :class="[card.image.lifestyle ? 'h-full w-full' : 'h-[225px] max-w-full mix-blend-multiply lg:h-[430px]']"
          />
        </div>
        <p class="mb-0 text-[16px] text-[#2F2F2F]">
          {{ card.content.title }}
        </p>
        <!-- supporting product title -->
      </tz-link>
    </tz-col>
  </tz-row>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { JumboCards } from '@/components/Informational/Tz-Jumbo-Card/Tz-Jumbo-Card.types';

import TzLink from '@/components/Action/Tz-Link/Tz-Link.vue';
import TzCol from '@/components/Structural/Tz-Col/Tz-Col.vue';
import TzRow from '@/components/Structural/Tz-Row/Tz-Row.vue';

export interface Props {
  cards: JumboCards[];
}

defineProps<Props>();
</script>

<style scoped>
.tz-jumbo-card__image-parent {
  @apply relative rounded-[10px];
  padding-top: 134.46%;
}

.tz-jumbo-card:deep(.tz-link img) {
  @apply transition-transform duration-500;
}
.tz-jumbo-card:deep(.tz-link:focus img),
.tz-jumbo-card:deep(.tz-link:hover img) {
  @apply scale-110;
}

.tz-jumbo-card:deep(.tz-link:hover .tz-jumbo-card__image-parent > span) {
  text-shadow: none;
}

.tz-jumbo-card:deep(.tz-link:focus .tz-jumbo-card__image-parent) {
  @apply ring-2 ring-[#2F2F2F] ring-offset-2;
}

.tz-jumbo-card:deep(.tz-link:focus .tz-jumbo-card__label) {
  text-shadow: none;
}
</style>
