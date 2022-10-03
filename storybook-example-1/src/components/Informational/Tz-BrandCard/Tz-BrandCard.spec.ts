/**
 * @vitest-environment jsdom
 */

import { mount } from '@vue/test-utils';
import TzBrandCard from './Tz-BrandCard.vue';
import { expect, test } from 'vitest';
import { brandCard } from './Tz-BrandCard.data';
import type { BrandCard } from './Tz-BrandCard.types';

const wrapper = mount(TzBrandCard, {
  props: <BrandCard>{ ...brandCard }
});

test('renders correctly', () => {
  expect(wrapper.element).toMatchSnapshot();
});

test('returns a product id', () => {
  expect(wrapper.props().id).toBeTypeOf('number');
});
