import { VueWrapper, mount } from '@vue/test-utils';
import TzNavPrimary from '@/components/Navigation/Tz-NavPrimary/Tz-NavPrimary.vue';
import { navigation, footerNav } from './Tz-NavPrimary.options';
import { describe, beforeEach, it, expect } from 'vitest';

import type { NavItem } from '../types';
import type { NavMenu } from '../types';

let wrapper: VueWrapper;

describe('Tz-NavPrimary.vue setup', () => {
  beforeEach(() => {
    wrapper = mount(TzNavPrimary, {
      props: {
        menu: <NavMenu[]>navigation,
        footer: <NavItem[]>footerNav,
        classes: <string[]>['test']
      }
    });
  });
  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot();
  });
  it('opens a list inside of another list', async () => {
    // console.log('nav hover =', wrapper.find('nav').find('li'));
    await wrapper.find('nav').find('li').find('a').trigger('mouseover');
    // console.log('nav hover = ', wrapper.find('nav').find('li').find('a').classes());

    const event = await wrapper
      .find('nav')
      .find('li')
      .trigger('mouseover')
      .then((el) => {
        // console.log('navigation test 123 = ', el);
      });
    expect(wrapper.element.hasChildNodes);
  });
});
