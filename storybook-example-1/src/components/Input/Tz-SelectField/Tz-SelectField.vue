<template>
  <div class="flex flex-col gap-1.5">
    <label :for="name" class="text-xs font-black uppercase tracking-wider text-gray-800">
      {{ label }}
      <span v-if="validationHint" class="ml-1 font-semibold normal-case text-gray-500">{{ validationHint }}</span>
    </label>
    <span v-if="hint" class="block whitespace-pre-wrap text-xs font-normal leading-4 text-gray-500">
      {{ hint }}
    </span>
    <!-- NOTE: ive used a simple styled select box for now - just seems simpler -->
    <!-- <tz-select :options="options" :name="name" :disabled="disabled" :default-state="defaultState"></tz-select> -->
    <select
      :id="name"
      :name="name"
      :disabled="disabled"
      class="block w-full select-none appearance-none rounded-md border-gray-300 py-3 hover:cursor-pointer focus:border-dark focus:ring-1 focus:ring-dark disabled:cursor-auto"
      :class="{
        'text-gray-400': value === undefined,
        'border-red-600 pr-10 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:ring-opacity-50': invalid
      }"
      v-model="input"
    >
      <option v-if="placeholder" :value="undefined" disabled selected>{{ placeholder }}</option>
      <option v-for="(option, k) in options" :key="k" :value="option.value">
        {{ option.name }}
      </option>
    </select>
    <tz-field-validation-message :error="error" />
  </div>
</template>

<script setup lang="ts">
import TzFieldValidationMessage from '../Tz-FieldValidationMessage/Tz-FieldValidationMessage.vue';
import { computed } from 'vue';
import type { Option } from '../types';

export interface Props {
  name: string;
  label?: string;
  validationHint?: string;
  hint?: string;
  placeholder?: string;
  options: Option[];
  disabled?: boolean;
  value?: string | number;
  error?: boolean | string;
}
const props = defineProps<Props>();

const emits = defineEmits<{
  (eventName: 'update:value', value: string | number | undefined): void;
}>();

const input = computed({
  get: () => props.value,
  set: (value) => {
    emits('update:value', value);
  }
});

const invalid = computed(() => !!props.error);
</script>
