/**
 * @vitest-environment jsdom
 */

import { VueWrapper, mount } from '@vue/test-utils';
import { expect, describe, beforeEach, it } from 'vitest';
import TzExpressCheckout from './Tz-ExpressCheckout.vue';

let wrapper: VueWrapper;

describe('TzExpressCheckout', () => {
  beforeEach(() => {
    wrapper = mount(TzExpressCheckout, {
      props: {
        options: [
          {
            heading: 'x',
            subHeading: 'y',
            value: 'z'
          },
          {
            heading: 'a',
            subHeading: 'b',
            value: 'c'
          }
        ]
      }
    });
  });

  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  describe('when an option is clicked', () => {
    it("will emit a 'option:click' event with the appropriate value", () => {
      wrapper.find('button:last-of-type').trigger('click');
      expect(wrapper.emitted('option:click')).toBeTruthy();
      expect(wrapper.emitted('option:click')![0]).toEqual(['c']);
    });
  });
});
