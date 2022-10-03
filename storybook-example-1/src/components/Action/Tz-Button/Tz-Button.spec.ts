/**
 * @vitest-environment jsdom
 */

import { mount, VueWrapper } from '@vue/test-utils';
import TzButton from './Tz-Button.vue';
import { expect, describe, beforeEach, it } from 'vitest';

const text = "I'm a button";
let wrapper: VueWrapper;

describe('Button setup', () => {
  beforeEach(() => {
    wrapper = mount(TzButton, {
      props: {
        iconPosition: 'before'
      },
      slots: {
        default: text
      }
    });
  });
  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot();
  });
  it('renders as button element', () => {
    expect(wrapper.html()).toContain('button');
  });
  it('contains the provided text', () => {
    expect(wrapper.text()).toContain(text);
  });
  it("emits a 'click' event when it is clicked", () => {
    wrapper.find('button').trigger('click');
    expect(wrapper.emitted()).toHaveProperty('click');
  });
});
