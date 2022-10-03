/**
 * @vitest-environment jsdom
 */

import { mount } from '@vue/test-utils';
import TzBrandBanner from './Tz-BrandBanner.vue';
import { expect, test } from 'vitest';
import { brands as brandsData } from './Tz-BrandBanner.data';
import type { Banner } from './Tz-BrandBanner.types';

const wrapper = mount(TzBrandBanner, {
  props: <Banner>{ page: 'home', brands: brandsData }
});

test('renders correctly', () => {
  expect(wrapper.element).toMatchSnapshot();
});

test('returns a brand id for the first brand value', () => {
  expect(wrapper.props().brands[0].id).toBeTypeOf('number');
});

test('behaves correctly on homepage', () => {
  if (wrapper.props().page == 'home') {
    expect(wrapper.find('a').attributes('href'));
  }
});
