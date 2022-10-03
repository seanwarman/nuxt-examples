import { mount, VueWrapper } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TzCtContentWrapper from './Tz-Ct-Content-Wrapper.vue';

let wrapper: VueWrapper;
const stickyWrapperSelector = '[data-test="tz-comparison-tool-sticky-wrapper"]';

describe('Tz-Comparison-Tool.vue setup', () => {
  it('tests to see if the sticky prop adds classes to the sticky wrapper element', () => {
    wrapper = mount(TzCtContentWrapper, {
      props: {
        sticky: true
      }
    });

    expect(wrapper.get(stickyWrapperSelector).classes()).toEqual(expect.arrayContaining(['sticky', 'top-0']));
  });
  it('tests to see if adding no sticky prop removes the sticky wrapper classes', () => {
    wrapper = mount(TzCtContentWrapper);

    expect(wrapper.get(stickyWrapperSelector).classes()).not.toEqual(expect.arrayContaining(['sticky', 'top-0']))
  });
});

