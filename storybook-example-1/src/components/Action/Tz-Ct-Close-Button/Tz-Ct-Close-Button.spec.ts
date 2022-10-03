/**
 * @vitest-environment jsdom
 */

import { mount, VueWrapper } from '@vue/test-utils';
import TzCtCloseButton from './Tz-Ct-Close-Button.vue';
import { expect, describe, beforeEach, it } from 'vitest';

let wrapper: VueWrapper;

describe('CT Close Button setup', () => {
  beforeEach(() => {
    wrapper = mount(TzCtCloseButton);
  });

  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it("emits a 'click' event when it's clicked", () => {
    wrapper.find('button').trigger('click');
    expect(wrapper.emitted()).toHaveProperty('click');
  });
});
