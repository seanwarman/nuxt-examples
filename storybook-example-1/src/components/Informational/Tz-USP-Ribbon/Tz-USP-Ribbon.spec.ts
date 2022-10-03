/**
 * @vitest-environment jsdom
 */

import { mount, VueWrapper, shallowMount } from '@vue/test-utils';
import TzUSPRibbon from './Tz-USP-Ribbon.vue';
import { expect, test, describe, beforeEach, it } from 'vitest';

let wrapper: VueWrapper;

type USPRibbon = {
  offerTitles: string[];
};

const titles = ['Free Delivery', '0% APR Finance', 'Price Match'];

describe('USP Ribbon setup', () => {
  beforeEach(() => {
    wrapper = mount(TzUSPRibbon, {
      props: {
        offerTitles: titles
      }
    });
  });
  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot();
  });
  it('renders offer text content', () => {
    wrapper.findAll('div').every((item, index) => {
      expect(item.text()).toContain(titles[index].toUpperCase());
    });
  });
  it('sets a base class', () => {
    expect(wrapper.classes()).toContain('tz-offer-container');
  });
});
