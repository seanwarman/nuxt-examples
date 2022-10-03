<template>
  <a
    :href="data.link?.url"
    :target="data.link?.target"
    class="tz-disc relative block h-[80px] w-[80px] overflow-hidden rounded-full bg-[#F5F6F4]"
  >
    <img
      class="absolute top-0 bottom-0 left-0 right-0 m-auto block w-full px-1"
      :src="data.image.src"
      :alt="data.image.alt"
    />
  </a>
</template>

<script setup lang="ts">
import type { TBrands } from '@/components/Input/Tz-Search/Tz-Search.types';

export interface Props {
  data: TBrands;
}

defineProps<Props>();
</script>

<style scoped>
.tz-disc {
  @apply ring-[#8D8A8A] ring-offset-[#D31716] transition-shadow duration-300 hover:ring focus:outline-0 focus:ring focus:ring-offset-2;
}
</style>
