/**
 * @vitest-environment jsdom
 */

import { mount, VueWrapper } from '@vue/test-utils';
import TzInputField from './Tz-InputField.vue';
import { expect, describe, beforeEach, it } from 'vitest';

let wrapper: VueWrapper;

describe('TzInputField', () => {
  beforeEach(() => {
    wrapper = mount(TzInputField, {
      props: {
        name: 'x',
        type: 'text'
      }
    });
  });

  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it("links the label 'for' and input 'id' attributes", () => {
    wrapper = mount(TzInputField, {
      props: {
        name: 'x',
        label: 'y'
      }
    });
    expect(wrapper.find('label').attributes().for).toEqual('x');
    expect(wrapper.find('input').attributes().id).toEqual('x');
    expect(wrapper.find('input').attributes().name).toEqual('x');
  });

  it('does not render the label element if there is no label text', () => {
    wrapper = mount(TzInputField, {
      props: {
        name: 'x'
      }
    });
    expect(wrapper.find('label').exists()).toBeFalsy();
  });

  describe('props.type', () => {
    it("defaults 'text'", () => {
      expect(wrapper.find('input').attributes('type')).toEqual('text');
    });

    it("can be set to 'number'", () => {
      wrapper = mount(TzInputField, {
        props: {
          name: 'x',
          type: 'number'
        }
      });
      expect(wrapper.find('input').attributes('type')).toEqual('number');
    });
  });

  describe('props.autocomplete', () => {
    it("defaults to 'off'", () => {
      expect(wrapper.find('input').attributes('autocomplete')).toEqual('off');
    });

    it("can be set to 'on'", () => {
      wrapper = mount(TzInputField, {
        props: {
          name: 'x',
          type: 'text',
          autocomplete: 'on'
        }
      });
      expect(wrapper.find('input').attributes('autocomplete')).toEqual('on');
    });

    it("can be set to 'new-password'", () => {
      wrapper = mount(TzInputField, {
        props: {
          name: 'x',
          type: 'text',
          autocomplete: 'new-password'
        }
      });
      expect(wrapper.find('input').attributes('autocomplete')).toEqual('new-password');
    });
  });

  describe('props.value', () => {
    it('sets value to the input field', () => {
      wrapper = mount(TzInputField, {
        props: {
          name: 'x',
          value: 'x'
        }
      });
      expect(wrapper.find('input').element.value).toEqual('x');
    });
  });

  describe('on keypress', () => {
    it("emits a 'keypress' event", () => {
      wrapper.find('input').trigger('keypress');
      expect(wrapper.emitted()).toHaveProperty('keypress');
    });
  });

  describe('on focus', () => {
    it("emits a 'focus' event", () => {
      wrapper.find('input').trigger('focus');
      expect(wrapper.emitted()).toHaveProperty('focus');
    });
  });

  describe('on blur', () => {
    it("emits a 'blur' event", () => {
      wrapper.find('input').trigger('blur');
      expect(wrapper.emitted()).toHaveProperty('blur');
    });
  });
});
