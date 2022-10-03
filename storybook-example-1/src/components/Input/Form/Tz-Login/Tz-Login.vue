<template>
  <div class="mb-5 flex flex-col">
    <form @submit.prevent>
      <div class="field__container">
        <tz-input-field
          :class="['tracking-wider', 'text-[#424040]', 'font-bold', 'uppercase']"
          label="E-mail address"
          name="email"
          v-model:value="emailAddress"
          autocomplete="on"
          placeholder="E-mail Address"
          :error="v$.form.emailAddress.$error && true"
          @input="v$.form.emailAddress.$touch()"
        />
      </div>
      <div class="field__container">
        <tz-input-field
          :class="['tracking-wider', 'text-[#424040]', 'font-bold', 'uppercase']"
          label="Password"
          name="password"
          v-model:value="password"
          autocomplete="off"
          placeholder="Password"
          :error="v$.form.password.$error && true"
          @input="v$.form.password.$touch()"
        />
      </div>
    </form>

    <a
      href="#"
      class="mt-1 self-end text-xs leading-4 text-[#6C757D] underline"
      @click="emits('LoginForgottenPassword')"
    >
      Forgotten Password?
    </a>

    <div v-if="socialAccounts">
      <ul class="social-accounts mt-4 mb-1 flex items-center justify-center gap-5 pb-2.5">
        <li v-for="(social, index) in socialAccounts" :key="index">
          <a :tabindex="index" @click="emits('SocialLogin', social.name)" class="cursor-pointer">
            <div class="h-10 w-10 p-1" :class="{ 'rounded-full bg-[#F5F6F4]': !social.solid }">
              <img :class="{ 'mix-blend-multiply': !social.solid }" :src="social.image.src" :alt="social.image.alt" />
            </div>
          </a>
        </li>
      </ul>
    </div>

    <tz-button class="mt-5 font-bold uppercase" theme="dark" size="lg" @click="submitForm">Log-in</tz-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import TzInputField from '@/components/Input/Tz-InputField/Tz-InputField.vue';
import TzButton from '@/components/Action/Tz-Button/Tz-Button.vue';
import useVuelidate from '@vuelidate/core';
import { required, email, alpha, minLength, maxLength } from '@vuelidate/validators';
import type { Image } from '@/components/Informational/types';

export type LoginForm = {
  email: string;
  password: string;
};

export type SocialAccount = {
  name: string;
  image: Image;
  solid?: boolean;
};

export interface LoginSetup {
  socialAccounts?: SocialAccount[];
}

const emits = defineEmits<{
  (e: 'SocialLogin', name: string): void;
  (e: 'LoginForgottenPassword'): void;
  (e: 'LoginFormValues', account: LoginForm): void;
}>();

const emailAddress = ref('');
const password = ref('');

const state = reactive({
  form: {
    email: emailAddress,
    password: password
  }
});

const rules = computed(() => ({
  form: {
    emailAddress: {
      required,
      email
    },
    password: {
      required,
      alpha
    }
  }
}));

const v$ = useVuelidate(rules, state);

const account: LoginForm = reactive({
  email: state.form.email,
  password: state.form.password
});

const submitForm = () => {
  v$.value.form.$touch();
  // if its still pending or an error is returned do not submit
  if (v$.value.form.$pending || v$.value.form.$error) return;
  emits('LoginFormValues', account);
};

const props = defineProps<LoginSetup>();
</script>

<style scoped>
.field__container {
  @apply my-4;
}
</style>
