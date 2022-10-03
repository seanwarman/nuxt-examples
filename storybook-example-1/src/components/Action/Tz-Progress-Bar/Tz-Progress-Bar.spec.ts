/**
 * @vitest-environment jsdom
 */

import { mount } from '@vue/test-utils';
import TzProgressBar from './Tz-Progress-Bar.vue';
import { expect, test } from 'vitest';
import { exampleSteps } from './Tz-Progress-Bar.data';

const wrapper = mount(TzProgressBar, {
  props: {
    steps: exampleSteps,
    selectedStepIndex: 0
  }
});

test('renders correctly', () => {
  expect(wrapper.element).toMatchSnapshot();
});
