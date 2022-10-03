<template>
  <div class="block sm:inline-block">
    <!-- finance-button section -->
    <div
      class="flex flex-col items-center justify-center gap-3 rounded-md bg-[#E5EBF8] px-6 py-2 sm:flex-row sm:items-center"
    >
      <span class="flex-1 text-center text-sm font-bold uppercase tracking-widest text-finance">
        <slot name="financeTermTemplate">
          <!-- Default from designs -->
          or FROM £13.64 pm 0%apr
        </slot>
      </span>
      <tz-button type="finance" size="sm" @click="emits('ApplyForFinance')">
        <slot name="financeButtonLabel"> Apply for Finance/Credit </slot>
      </tz-button>
    </div>
    <div class="py-3 sm:px-4">
      <!-- payment-methods section -->
      <tz-button type="primary" size="lg" class="w-full" @click="emits('ProceedWithCheckout')">
        <slot name="checkoutButtonLabel">Checkout</slot>
      </tz-button>

      <!-- checkout-button section -->
      <ul class="my-3 mx-auto flex w-full items-center justify-around sm:max-w-[80%]">
        <li v-for="(provider, k) in paymentProviders" :key="k">
          <img class="h-full px-0.5" :src="provider.logo.src" :alt="provider.logo.alt" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import TzButton from '@/components/Action/Tz-Button/Tz-Button.vue';
import { defineProps, defineEmits } from 'vue';
import type { PaymentProvider } from './Tz-Checkout-Cta.types';

export interface FinanceCTA {
  paymentProviders?: PaymentProvider[];
}

const props = defineProps<FinanceCTA>();

const ApplyForFinance = 'ApplyForFinance';
const ProceedWithCheckout = 'ProceedWithCheckout';
const emits = defineEmits<{
  (eventName: typeof ApplyForFinance): void;
  (eventName: typeof ProceedWithCheckout): void;
}>();
</script>
