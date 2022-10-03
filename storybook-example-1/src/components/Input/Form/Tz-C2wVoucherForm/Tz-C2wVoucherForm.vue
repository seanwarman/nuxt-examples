<template>
  <section class="voucher-form">
    <form class="form" @submit.prevent>
      <div class="field__container">
        <tz-input-field
          :class="['tracking-wider', 'text-[#424040]', 'font-bold', 'uppercase']"
          v-model:value="certNumber"
          label="LOC or certificate number"
          name="certNumber"
          autocomplete="off"
          :error="v$.form.certNumber.$error && true"
          @input="v$.form.certNumber.$touch()"
        />
        <p class="error-list text-sm text-primary" v-for="error of v$.form.certNumber.$errors" :key="error.$uid">
          {{ error.$message }}
        </p>
      </div>
      <div class="field__container">
        <tz-input-field
          :class="['tracking-wider', 'text-[#424040]', 'font-bold', 'uppercase']"
          label="Surname"
          name="surname"
          v-model:value="surname"
          autocomplete="off"
          :error="v$.form.surname.$error && true"
          @input="v$.form.surname.$touch()"
        />
        <p class="error-list text-sm text-primary" v-for="error of v$.form.surname.$errors" :key="error.$uid">
          {{ error.$message }}
        </p>
      </div>
      <tz-button class="btn-apply-voucher" @click="submitVoucherForm">Apply</tz-button>
    </form>
    <ul class="error-list list-disc px-6 py-2">
      <li class="error text-sm text-primary" v-for="error of v$.$errors" :key="error.$uid">
        {{ error.$message }}
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { reactive, defineEmits, ref, computed } from 'vue';
import TzInputField from '@/components/Input/Tz-InputField/Tz-InputField.vue';
import TzButton from '@/components/Action/Tz-Button/Tz-Button.vue';

import useVuelidate from '@vuelidate/core';
import { required, email, alpha, alphaNum, numeric, minLength, maxLength } from '@vuelidate/validators';

type C2WVoucherForm = {
  certNumber: number;
  surname: string;
};

const emits = defineEmits<{
  (e: 'C2WVoucherFormValues', voucher: C2WVoucherForm): void;
}>();

const certNumber = ref('');
const surname = ref('');

const state = reactive({
  form: {
    certNumber: certNumber,
    surname: surname
  }
});

const rules = computed(() => ({
  form: {
    certNumber: {
      required,
      numeric
    },
    surname: {
      required,
      alpha
    }
  }
}));

const v$ = useVuelidate(rules, state);

const voucher: C2WVoucherForm = reactive({
  certNumber: parseInt(state.form.certNumber),
  surname: state.form.surname
});

const submitVoucherForm = () => {
  v$.value.form.$touch();
  // if its still pending or an error is returned do not submit
  if (v$.value.form.$pending || v$.value.form.$error) return;
  emits('C2WVoucherFormValues', voucher);
};
</script>

<style scoped>
form > * {
  @apply my-2;
}

.btn-apply-voucher {
  @apply bg-[#2F2F2F] px-10 py-4 font-bold uppercase tracking-widest text-white;
}
</style>
