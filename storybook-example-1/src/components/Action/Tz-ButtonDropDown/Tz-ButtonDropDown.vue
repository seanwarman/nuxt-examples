<template>
  <div class="rounded-sm border" :class="[state.open ? 'border-light-grey' : 'border-dark-fade']" ref="dropDown">
    <div>
      <button
        class="heading-button flex w-full px-3.5 py-3"
        :class="[`items-${buttonAlign ?? 'center'}`]"
        @click="display"
      >
        <span class="w-full text-left">
          <slot name="heading"></slot>
        </span>
        <span
          class="ml-auto inline-block h-6 transition duration-500"
          :class="[state.open ? (iconRotateDegrees ? iconRotateDegrees : 'rotate-45') : 'rotate-0']"
        >
          <slot name="icon">
            <svg class="h-6" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15.07 9.52227H9.31V15.2823H6.19V9.52227H0.43V6.43226H6.19V0.642265H9.31V6.43226H15.07V9.52227Z"
                fill="#2F2F2F"
              />
            </svg>
          </slot>
        </span>
      </button>
    </div>
    <div
      ref="dropDownBody"
      class="body p-3.5"
      :class="{
        block: state.open,
        hidden: !state.open
      }"
    >
      <slot name="body"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue';

export interface DropDownButton {
  open?: boolean;
  buttonAlign?: 'start' | 'center' | 'end';
  iconRotateDegrees?: string;
}

const state = reactive({
  open: false
});

const dropDown = ref<HTMLElement>();
const dropDownBody = ref<HTMLElement>();

onMounted(() => {
  props.open ? (state.open = props.open) : null;
});

const props = defineProps<DropDownButton>();

const display = () => {
  return (state.open = !state.open);
};
</script>
