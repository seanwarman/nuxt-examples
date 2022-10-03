/**
 * @vitest-environment jsdom
 */

import { mount, VueWrapper } from '@vue/test-utils';
import { expect, describe, beforeEach, it } from 'vitest';
import { TzOrderTotalsSummary } from '@/components';

import { DiscountType } from '../types';

let wrapper: VueWrapper;

describe('TzInfoBox', () => {
  beforeEach(() => {
    wrapper = mount(TzOrderTotalsSummary, {
      props: {
        noOfItems: 1,
        discounts: [
          {
            name: '',
            amount: 29,
            type: DiscountType.cycleToWork
          }
        ],
        savings: 0,
        subTotal: 100,
        shippingCost: 0,
        totel: 100
      }
    });
  });

  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot();
  });
});
