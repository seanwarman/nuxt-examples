/**
 * @vitest-environment jsdom
 */

import { mount } from '@vue/test-utils';
import { expect, test } from 'vitest';

import { exampleData } from '@/components/Action/Tz-Checkout-CTA/Tz-Checkout-Cta.data';
import type { PaymentProvider } from '@/components/Action/Tz-Checkout-CTA/Tz-Checkout-Cta.types';
import TzCheckoutCta from '@/components/Action/Tz-Checkout-CTA/Tz-Checkout-Cta.vue';

const wrapper = mount(TzCheckoutCta, {
  props: { cards: <PaymentProvider[]>exampleData }
});

test('renders correctly', () => {
  expect(wrapper.element).toMatchSnapshot();
});
