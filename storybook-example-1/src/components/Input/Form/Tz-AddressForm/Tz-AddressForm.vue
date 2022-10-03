<template>
  <section>
    <form class="form" @submit.prevent>
      <div class="flex flex-col gap-2 py-1.5">
        <tz-input-field
          :class="['tracking-wider', 'text-[#424040]', 'text-sm']"
          v-model:value="streetAddress"
          label="Delivery Address"
          name="streetAddress"
          autocomplete="off"
          :error="v$.form.streetAddress.$error && true"
          @input="v$.form.streetAddress.$touch()"
        />
        <tz-input-field
          :class="['tracking-wider', 'text-[#424040]', 'text-sm']"
          label=""
          name="streetAddress2"
          v-model:value="streetAddress2"
          autocomplete="off"
          :error="v$.form.streetAddress.$error && true"
          @input="v$.form.streetAddress.$touch()"
        />
        <p class="error-list text-sm text-primary" v-for="error of v$.form.streetAddress.$errors" :key="error.$uid">
          {{ error.$message }}
        </p>
      </div>
      <div>
        <tz-input-field
          :class="['tracking-wider', 'text-[#424040]', 'uppercase', 'w-[80%]', 'text-sm']"
          label="City"
          name="city"
          v-model:value="city"
          autocomplete="off"
          :error="v$.form.city.$error && true"
          @input="v$.form.city.$touch()"
        />
        <p class="error-list text-sm text-primary" v-for="error of v$.form.city.$errors" :key="error.$uid">
          {{ error.$message }}
        </p>
      </div>
      <div>
        <tz-input-field
          :class="['tracking-wider', 'text-[#424040]', 'uppercase', 'w-[80%]', 'text-sm']"
          label="County"
          name="county"
          v-model:value="county"
          autocomplete="off"
          :error="v$.form.county.$error && true"
          @input="v$.form.county.$touch()"
        />
        <p class="error-list text-sm text-primary" v-for="error of v$.form.county.$errors" :key="error.$uid">
          {{ error.$message }}
        </p>
      </div>
      <div>
        <tz-input-field
          :class="['tracking-wider', 'text-[#424040]', 'uppercase', 'w-[20%]', 'text-sm']"
          label="Postcode"
          name="postcode"
          v-model:value="postcode"
          autocomplete="off"
          :error="v$.form.postcode.$error && true"
          @input="v$.form.postcode.$touch()"
        />
        <p class="error-list text-sm text-primary" v-for="error of v$.form.postcode.$errors" :key="error.$uid">
          {{ error.$message }}
        </p>
      </div>
      <div>
        <tz-select ref="region" :options="regions" @selected-option="(option) => handleRegion(option)"></tz-select>
      </div>
      <tz-button @click="submitVoucherForm">Apply</tz-button>
    </form>
    <ul class="error-list list-disc px-6 py-2">
      <li class="error text-sm text-primary" v-for="error of v$.$errors" :key="error.$uid">
        {{ error.$message }}
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { reactive, defineEmits, ref, computed, defineProps } from 'vue';
import TzInputField from '@/components/Input/Tz-InputField/Tz-InputField.vue';
import TzButton from '@/components/Action/Tz-Button/Tz-Button.vue';
import TzSelect from '@/components/Action/Tz-Select/Tz-Select.vue';

import useVuelidate from '@vuelidate/core';
import { required, email, alpha, alphaNum, numeric, minLength, maxLength } from '@vuelidate/validators';

import type { Option } from '../../types';

type AddressFormValues = {
  streetAddress: string;
  streetAdress2: string;
  city: string;
  county: string;
  postcode: string;
  region: Option;
};

type AddressOptions = {
  regions: Option[];
};

const emits = defineEmits<{
  (e: 'AddressFormValues', address: AddressFormValues): void;
}>();

const streetAddress = ref('');
const streetAddress2 = ref('');
const city = ref('');
const county = ref('');
const postcode = ref('');
const region = ref<Option>({});

const state = reactive({
  form: {
    streetAddress: streetAddress,
    streetAddress2: streetAddress2,
    city: city,
    county: county,
    postcode: postcode,
    region: region
  }
});

const rules = computed(() => ({
  form: {
    streetAddress: {
      required
    },
    city: {
      required
    },
    county: {
      required
    },
    postcode: {
      required,
      alphaNum
    }
  }
}));

const v$ = useVuelidate(rules, state);

const addressForm: AddressFormValues = reactive({
  streetAddress: state.form.streetAddress,
  streetAdress2: state.form.streetAddress2,
  city: state.form.city,
  county: state.form.city,
  postcode: state.form.postcode,
  region: state.form.region
});

const submitVoucherForm = () => {
  v$.value.form.$touch();
  // if its still pending or an error is returned do not submit
  if (v$.value.form.$pending || v$.value.form.$error) return;
  emits('AddressFormValues', addressForm);
};

const handleRegion = (option: Option) => {
  state.form.region = option;
};

const props = defineProps<AddressOptions>();
</script>
