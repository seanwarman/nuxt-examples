/**
 * @vitest-environment jsdom
 */

import { VueWrapper, mount } from '@vue/test-utils';
import { expect, describe, beforeEach, it } from 'vitest';
import { TzBasketTotalsSummary } from '@/components';

import { data as props } from './Tz-Basket-Totals-Summary.data';

let wrapper: VueWrapper;

describe('TzInfoBox', () => {
  beforeEach(() => {
    wrapper = mount(TzBasketTotalsSummary, {
      props
    });
  });

  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it("emits 'deliveryOptionChanged' event when shipping country is changed", async () => {
    wrapper.find('#shipping-country').setValue(3);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('deliveryOptionChanged')).toBeTruthy();
    expect(wrapper.emitted('deliveryOptionChanged')![0]).toEqual([props.shippingCountries[2]]);
  });
});
