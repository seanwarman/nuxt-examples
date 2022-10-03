/**
 * @vitest-environment jsdom
 */

import { mount, VueWrapper } from '@vue/test-utils';
import TzPaymentMethods from './Tz-PaymentMethods.vue';
import { expect, describe, beforeEach, it } from 'vitest';

let wrapper: VueWrapper;

describe('TzPaymentMethods', () => {
  beforeEach(() => {
    wrapper = mount(TzPaymentMethods, {
      props: {
        name: 'x',
        label: 'y',
        options: [
          {
            value: 'a',
            label: 'A'
          },
          {
            value: 'b',
            label: 'B'
          }
        ]
      }
    });
  });

  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('gives a unique id to each radio input', () => {
    expect(wrapper.find('input#x_0').exists()).toBe(true);
    expect(wrapper.find('input#x_1').exists()).toBe(true);
  });

  it("links the label 'for' to each radio input 'id'", () => {
    expect(wrapper.find('label[for="x_0"]').exists()).toBe(true);
    expect(wrapper.find('label[for="x_1"]').exists()).toBe(true);
  });

  it('sets the values to each radio input', () => {
    expect(wrapper.find('input#x_0').attributes().value).toEqual('a');
    expect(wrapper.find('input#x_1').attributes().value).toEqual('b');
  });

  it('sets the name on each radio input', () => {
    expect(wrapper.find('input#x_0').attributes().name).toEqual('x');
    expect(wrapper.find('input#x_1').attributes().name).toEqual('x');
  });
});
