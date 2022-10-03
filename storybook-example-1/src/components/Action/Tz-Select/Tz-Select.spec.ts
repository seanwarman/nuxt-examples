/**
 * @vitest-environment jsdom
 */

import { VueWrapper, mount } from '@vue/test-utils';
import { expect, describe, beforeEach, it } from 'vitest';
import TzSelect from './Tz-Select.vue';
import { options } from './Tz-Select.data';
import { getSizeVariation } from './Tz-Select.methods.ts';

let wrapper: VueWrapper;
const buttonSelector = '[data-test="tz-select-button"]';
const iconSelector = '[data-test="tz-select-icon"]';
const chevronWrapperSelector = '[data-test="tz-select-chevron-wrapper"]';
const optionSelector = '[data-test="tz-select-option"]';

function makeGetClasses(wrapper: VueWrapper) {
  return (selector: string) => {
    return wrapper.get(selector).classes();
  };
}

describe('Tz-Select', () => {
  it('displays the correct class names to match the default variation', () => {
    wrapper = mount(TzSelect, {
      props: { options }
    });

    const getClasses = makeGetClasses(wrapper);
    const { border, padding, divider, chevronPosition } = getSizeVariation();

    expect(getClasses(buttonSelector)).toEqual(expect.arrayContaining([border]));
    expect(getClasses(iconSelector)).toEqual(expect.arrayContaining([padding]));
    expect(getClasses(chevronWrapperSelector)).toEqual(
      expect.arrayContaining([...divider.split(' '), ...chevronPosition.split(' ')])
    );
  });
  it('displays the correct class names to match the "small" variation', () => {
    wrapper = mount(TzSelect, {
      props: { size: 'small', options }
    });

    const getClasses = makeGetClasses(wrapper);
    const { border, padding, chevronPosition } = getSizeVariation('small');

    expect(getClasses(buttonSelector)).toEqual(expect.arrayContaining([border]));
    expect(getClasses(iconSelector)).toEqual(expect.arrayContaining([padding]));
    expect(getClasses(chevronWrapperSelector)).toEqual(expect.arrayContaining(chevronPosition.split(' ')));
  });
  it('allows the user to click the select to show the options', async () => {
    wrapper = mount(TzSelect, {
      props: { options }
    });

    await wrapper.get(buttonSelector).trigger('click');
    expect(wrapper.get(optionSelector)).toBeDefined();
  });
  it('uses the colorIcons prop to control whether the tz-select-icon contents are rendered', () => {
    function getIconSpan(props) {
      return mount(TzSelect, { props }).get(iconSelector).find('span');
    }

    expect(getIconSpan({ options, colorIcons: true }).exists()).toBe(true);
    expect(getIconSpan({ options }).exists()).toBe(false);
  });
  it('emits the matching selectedOption when an option is chosen', async () => {
    wrapper = mount(TzSelect, {
      props: { options }
    });

    await wrapper.get(buttonSelector).trigger('click');
    const link = wrapper.findAll(optionSelector);

    await link[0].trigger('click');
    expect(wrapper.emitted().selectedOption[0][0]).toMatchObject(options[0]);

    await link[1].trigger('click');
    expect(wrapper.emitted().selectedOption[1][0]).toMatchObject(options[1]);

    await link[2].trigger('click');
    expect(wrapper.emitted().selectedOption[2][0]).toMatchObject(options[2]);
  });
});
