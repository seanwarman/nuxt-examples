/**
 * @vitest-environment jsdom
 */

import { mount, VueWrapper } from '@vue/test-utils';
import TzSelectField from './Tz-SelectField.vue';
import { expect, describe, it } from 'vitest';
import type { Option } from '../types';

const text = "I'm a button";
let wrapper: VueWrapper;
const name = 'testName';
const options: Option[] = [
  {
    name: 'option 1 ',
    value: 1
  },
  {
    name: 'Another option',
    value: 2
  },
  {
    name: 'The third option is a long one',
    value: 3
  },
  {
    name: 'Last choice',
    value: 4
  }
];

describe('TzSelectField', () => {
  it('renders correctly', () => {
    wrapper = mount(TzSelectField, {
      props: {
        name,
        options,
        slots: {
          default: text
        }
      }
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('sets options', () => {
    wrapper = mount(TzSelectField, {
      props: {
        name,
        options
      },
      slots: {
        default: text
      }
    });
    const selectElement: HTMLSelectElement = wrapper.find('select').element;
    expect(selectElement.options.length).toBe(options.length);
    expect(parseInt(selectElement.options[2].value, 10)).toBe(options[2].value);
    expect(selectElement.options[2].text).toBe(options[2].name);
  });

  it('sets the name attribute', () => {
    wrapper = mount(TzSelectField, {
      props: {
        name,
        options
      },
      slots: {
        default: text
      }
    });
    const selectElement: HTMLSelectElement = wrapper.find('select').element;
    expect(selectElement.name).toBe(name);
  });

  it('sets the disabled attribute', () => {
    wrapper = mount(TzSelectField, {
      props: {
        name,
        options,
        disabled: true
      },
      slots: {
        default: text
      }
    });
    const selectElement: HTMLSelectElement = wrapper.find('select').element;
    expect(selectElement.disabled).toBeTruthy();
  });

  it('sets an initial selected option', () => {
    wrapper = mount(TzSelectField, {
      props: {
        name,
        options,
        value: 1
      },
      slots: {
        default: text
      }
    });
    const select = wrapper.find('select');
    expect(parseInt(select.element.value, 10)).toBe(1);
  });
});
