<template>
  <div>
    <div v-if="label" class="text-xs font-black uppercase leading-10 tracking-wider text-dark-fade">
      {{ label }}
    </div>
    <div class="flex flex-col gap-5 border p-5 xs:gap-0 xs:border-none xs:p-0">
      <div
        v-for="(option, i) in options"
        :key="i"
        class="flex cursor-pointer flex-row items-center xs:h-[74px] xs:border-b"
      >
        <input
          type="radio"
          :id="`${name}_${i}`"
          :name="name"
          :value="option.value"
          v-model="input"
          class="peer mr-4 inline-block h-[18px] w-[18px] cursor-pointer"
        />
        <label
          :for="`${name}_${i}`"
          class="flex flex-1 cursor-pointer flex-row items-center align-middle text-black peer-checked:font-extrabold peer-checked:text-gray-800"
        >
          <span class="flex-1">{{ option.label }}</span>
          <span class="hidden flex-row gap-2 xs:flex">
            <img v-for="(icon, key) in option.icons" :key="key" v-bind="icon" class="block max-h-8 w-auto" />
          </span>
        </label>
      </div>
    </div>
    <tz-field-validation-message :error="error" class="mt-2" />
  </div>
</template>

<script setup lang="ts">
import TzFieldValidationMessage from '../Tz-FieldValidationMessage/Tz-FieldValidationMessage.vue';
import type { Image } from '@/components/Informational/types';
import { computed } from 'vue';

const props = defineProps<{
  name: string;
  label?: string;
  value?: string;
  options: Array<{
    value: string;
    label: string;
    icons: Array<Image>;
  }>;
  error?: boolean | string;
}>();

const emits = defineEmits<{
  (eventName: 'update:value', value: string | undefined): void;
  (eventName: 'focus', e: FocusEvent): void;
  (eventName: 'blur', e: FocusEvent): void;
}>();

const input = computed({
  get: () => props.value,
  set: (value) => {
    emits('update:value', value);
  }
});
</script>

<style scoped>
[type='radio']:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='%232F2F2F' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='4'/%3e%3c/svg%3e");
  color: white;
  border-color: #2f2f2f;
}
</style>
