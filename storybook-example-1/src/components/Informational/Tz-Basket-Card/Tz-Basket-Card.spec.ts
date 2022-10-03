/**
 * @vitest-environment jsdom
 */

import { VueWrapper, mount } from '@vue/test-utils';
import TzBasketCard from './Tz-Basket-Card.vue';
import { expect, test, describe, beforeEach, it } from 'vitest';

import { exampleData } from './Tz-Basket-Card.data';

let wrapper: VueWrapper;

describe('Button setup', () => {
  beforeEach(() => {
    wrapper = mount(TzBasketCard, {
      props: exampleData
    });
  });
  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot();
  });
  it('create correct amount of quantity options', () => {
    const select: HTMLSelectElement = wrapper.find('select').element;
    expect(select.options.length).toBe(exampleData.stockQuantity);
  });
  it('sets a maximum of 20 quantity options', async () => {
    wrapper = mount(TzBasketCard, {
      props: { ...exampleData, ...{ stockQuantity: 30 } }
    });
    await wrapper.vm.$nextTick();
    const select: HTMLSelectElement = wrapper.find('select').element;
    expect(select.options.length).toBe(20);
  });
  it('calculates total amount when quantity changed', async () => {
    const button = wrapper.find('button');
    button.trigger('click'); //click quantity select box
    await wrapper.vm.$nextTick();
    const item = wrapper.findAll('ul')[1].find('li:nth-child(2) a');
    item.trigger('click'); //click quantity option
    await wrapper.vm.$nextTick();
    const spans = wrapper.findAll('span');
    //check text
    expect(spans[spans.length - 2].element.textContent).contains((exampleData.price.list * 2).toLocaleString());
  });
});
