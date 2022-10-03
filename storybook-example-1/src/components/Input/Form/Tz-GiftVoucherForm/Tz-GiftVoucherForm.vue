<template>
  <section class="voucher-form">
    <form class="form" @submit.prevent>
      <tz-input-field
        :class="['text-[#424040]', 'inline-block', 'w-4/5', 'mr-3']"
        v-model:value="voucher"
        name="cert_number"
        autocomplete="off"
      />
      <tz-button class="btn-apply-voucher w-1/6" @click="submitVoucherForm">Apply</tz-button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { reactive, defineEmits, ref } from 'vue';
import TzInputField from '@/components/Input/Tz-InputField/Tz-InputField.vue';
import TzButton from '@/components/Action/Tz-Button/Tz-Button.vue';

const emits = defineEmits<{
  (e: 'GiftVoucherFormValues', voucher: string): void;
}>();

const voucher = ref('');

const submitVoucherForm = () => {
  emits('GiftVoucherFormValues', voucher.value);
};
</script>

<style scoped>
form > * {
  @apply my-2;
}

.btn-apply-voucher {
  @apply bg-[#2F2F2F] px-10 py-3 text-sm font-bold uppercase tracking-widest text-white;
}
</style>
