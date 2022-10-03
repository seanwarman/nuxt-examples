/**
 * @vitest-environment jsdom
 */
import { mount, VueWrapper } from '@vue/test-utils';
import TzButtonDropDown from './Tz-ButtonDropDown.vue';
import { expect, describe, beforeEach, it } from 'vitest';

let wrapper: VueWrapper;

describe('Button Drop-down functionality', () => {
  beforeEach(() => {
    wrapper = mount(TzButtonDropDown, {});
  });
  it('displays the content when clicked and hide when clicked again', async () => {
    const button = wrapper.find('.heading-button');
    const body = wrapper.find('.body');
    expect(body.classes()).to.contain('hidden');
    button.trigger('click'); //first click to display
    await wrapper.vm.$nextTick();
    expect(body.classes()).to.contain('block');
    button.trigger('click'); //second click to hide
    await wrapper.vm.$nextTick();
    expect(body.classes()).to.contain('hidden');
  });
});
