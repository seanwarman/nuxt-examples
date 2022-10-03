<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="name" class="text-xs font-black uppercase tracking-wider text-gray-800">
      {{ label }}
      <span v-if="validationHint" class="ml-1 font-semibold normal-case text-gray-500">{{ validationHint }}</span>
    </label>
    <span v-if="hint" class="block whitespace-pre-wrap text-xs font-normal leading-4 text-gray-500">
      {{ hint }}
    </span>
    <input
      :type="type"
      :id="name"
      :name="name || ''"
      class="block w-full rounded-md border-gray-300 py-3 text-base text-gray-800 placeholder-gray-400 shadow-sm focus:border-dark focus:ring-1 focus:ring-dark focus:ring-opacity-50"
      :class="{
        'border-red-600 pr-10 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:ring-opacity-50': invalid
      }"
      :placeholder="placeholder"
      v-model="input"
      :autocomplete="autocomplete"
      @focus="(e) => emits('focus', e)"
      @blur="(e) => emits('blur', e)"
      @keyup="(e) => emits('keyup', e)"
    />
    <tz-field-validation-message :error="error" />
  </div>
</template>

<script setup lang="ts">
import TzFieldValidationMessage from '../Tz-FieldValidationMessage/Tz-FieldValidationMessage.vue';
import { defineProps, computed, defineEmits } from 'vue';

export interface FormInput {
  name: string;
  type?: 'text' | 'number';
  autocomplete?: 'off' | 'on' | 'new-password';
  label?: string;
  validationHint?: string;
  hint?: string;
  placeholder?: string;
  value?: string | number;
  disabled?: boolean;
  error?: boolean | string;
}

const emits = defineEmits<{
  (eventName: 'update:value', value: string | number | undefined): void;
  (eventName: 'focus', e: FocusEvent): void;
  (eventName: 'blur', e: FocusEvent): void;
  (eventName: 'keyup', e: KeyboardEvent): void;
}>();

const props = withDefaults(defineProps<FormInput>(), {
  type: 'text',
  autocomplete: 'off'
});

const input = computed({
  get: () => props.value,
  set: (value) => {
    emits('update:value', value);
  }
});

const invalid = computed(() => !!props.error);
</script>
