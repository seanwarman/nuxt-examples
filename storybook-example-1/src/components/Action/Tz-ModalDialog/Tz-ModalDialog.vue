<!-- eslint-disable vue/no-unused-vars -->
<template>
  <vue-final-modal
    v-slot="{ params, close }"
    v-bind="$attrs"
    v-model="show"
    :click-to-close="props.showClose"
    :esc-to-close="props.showClose"
    :focus-retain="true"
    :focus-trap="true"
    :scroll-lock="true"
    classes="flex justify-center items-center"
    content-class="relative flex flex-col max-h-full mx-4 p-8 border bg-white"
  >
    <slot></slot>
    <button v-if="props.showClose" class="absolute top-6 right-7" @click="onCloseClick">
      <span class="sr-only">Close</span><tz-close-icon class="w-4" />
    </button>
  </vue-final-modal>
</template>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { VueFinalModal } from 'vue-final-modal';
import TzCloseIcon from '@/components/Informational/Icons/Tz-Close-Icon.vue';
import { computed, ref } from 'vue';

const onCloseClick = function () {
  show.value = false;
};

const props = withDefaults(
  defineProps<{
    showClose?: boolean;
    show: boolean;
  }>(),
  {
    showClose: true
  }
);

const emits = defineEmits<{
  (eventName: 'update:show', value: boolean): void;
}>();

const show = computed({
  get: () => props.show,
  set: (value) => {
    emits('update:show', value);
  }
});
</script>

<style>
.vfm__overlay.vfm--overlay {
  @apply bg-black/30;
}
</style>
