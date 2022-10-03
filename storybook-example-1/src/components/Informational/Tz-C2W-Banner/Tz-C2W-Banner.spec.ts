/**
 * @vitest-environment jsdom
 */

import { mount } from '@vue/test-utils';
import TzC2WBanner from './Tz-C2W-Banner.vue';
import { expect, test } from 'vitest';
import { exampleData } from './Tz-C2W-Banner.data';

const wrapper = mount(TzC2WBanner, {
  props: { ...exampleData }
});

test('renders correctly', () => {
  expect(wrapper.element).toMatchSnapshot();
});
