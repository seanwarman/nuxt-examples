/**
 * @vitest-environment jsdom
 */

import { mount } from '@vue/test-utils';
import TzJumboCard from './Tz-Jumbo-Card.vue';
import { expect, test } from 'vitest';
import { exampleJumboCardData } from './Tz-Jumbo-Card.data';
import type { JumboCards } from '@/components/Informational/Tz-Jumbo-Card/Tz-Jumbo-Card.types';

const wrapper = mount(TzJumboCard, {
  props: { cards: <JumboCards[]>exampleJumboCardData }
});

test('renders correctly', () => {
  expect(wrapper.element).toMatchSnapshot();
});

test('returns a product title', () => {
  expect(wrapper.props().cards[0].content.title).toBeTypeOf('string');
});
