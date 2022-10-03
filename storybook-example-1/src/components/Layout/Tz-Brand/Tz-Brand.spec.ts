import { shallowMount, VueWrapper } from '@vue/test-utils';
import Brand from './Tz-Brand.vue';
import { describe, beforeEach, it, expect } from 'vitest';

let wrapper: VueWrapper;

describe('Brand.vue setup', () => {
  beforeEach(() => {
    wrapper = shallowMount(Brand);
  });
  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot();
  });
  it('sets a base class', () => {
    expect(wrapper.classes()).toContain('tz-brand');
  });
  it('img element has all the proper attributes', () => {
    const { alt, title, src } = wrapper.attributes();

    expect(src).equals('/src/assets/tredz-brand.svg');
    expect(title).equals('brand');
    expect(alt).equals('brand');
  });
});
