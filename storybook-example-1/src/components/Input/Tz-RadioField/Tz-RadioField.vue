<template>
  <div class="flex flex-col gap-1.5">
    <div v-if="label" class="text-xs font-black uppercase tracking-wider text-gray-800">
      {{ label }}
      <span v-if="validationHint" class="ml-1 font-semibold normal-case text-gray-500">{{ validationHint }}</span>
    </div>
    <div class="flex" :class="[radioLayouts, radioBorders]">
      <div v-for="(option, i) in options" :key="i" class="flex cursor-pointer flex-row">
        <input
          type="radio"
          :id="`${name}_${i}`"
          :name="name"
          :value="option.value"
          v-model="input"
          class="peer inline-block cursor-pointer"
          :class="{
            'mr-1 h-[14px] w-[14px]': inlineLayout,
            'mr-3 mb-0.5 h-[18px] w-[18px]': !inlineLayout
          }"
        />
        <label
          :for="`${name}_${i}`"
          class="cursor-pointer align-middle peer-checked:text-gray-800"
          :class="{
            'text-xs font-bold uppercase text-gray-500 peer-checked:text-black': inlineLayout,
            'text-black peer-checked:font-extrabold': !inlineLayout
          }"
        >
          {{ option.label }}
          <span
            v-if="option.description"
            class="block whitespace-pre-wrap text-xs font-normal leading-4 text-gray-500"
            >{{ option.description }}</span
          >
        </label>
      </div>
    </div>
    <tz-field-validation-message :error="error" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TzFieldValidationMessage from '../Tz-FieldValidationMessage/Tz-FieldValidationMessage.vue';

const props = withDefaults(
  defineProps<{
    name: string;
    label?: string;
    validationHint?: string;
    value?: string | number | boolean;
    layout?: 'default' | 'inline' | 'inline-desktop';
    showBorder?: boolean;
    options: Array<{
      value: string | number | boolean;
      label: string;
      description?: string;
    }>;
    error?: boolean | string;
  }>(),
  {
    size: 'base',
    layout: 'default',
    showBorder: true
  }
);

const inlineLayout = computed(() => props.layout === 'inline' || props.layout === 'inline-desktop');

const emits = defineEmits<{
  (eventName: 'update:value', value: string | number | boolean | undefined): void;
  (eventName: 'focus', e: FocusEvent): void;
  (eventName: 'blur', e: FocusEvent): void;
}>();

const input = computed({
  get: () => props.value,
  set: (value) => {
    emits('update:value', value);
  }
});

const radioLayouts = computed(() => {
  return {
    'flex-col gap-5': props.layout === 'default',
    'flex-row gap-4': props.layout === 'inline',
    'flex-col gap-3 sm:flex-row': props.layout === 'inline-desktop'
  };
});
const radioBorders = computed(() => {
  return {
    'border p-5': props.layout === 'default' && props.showBorder,
    'border-red-600': !!props.error
  };
});
</script>

<style scoped>
[type='radio']:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='%232F2F2F' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='4'/%3e%3c/svg%3e");
  color: white;
  border-color: #2f2f2f;
}
</style>
