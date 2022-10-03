/**
 * @vitest-environment jsdom
 */

import { mount, VueWrapper } from '@vue/test-utils';
import { expect, describe, it } from 'vitest';
import TzCtMobileChevronButton from './Tz-Ct-Mobile-Chevron-Button.vue';

let wrapper: VueWrapper;

function makeGetClasses(wrapper: VueWrapper) {
  return (selector: string) => {
    return wrapper.get(selector).classes();
  };
}

const iconSelector = '[data-test="tz-ct-chevron-button"]';

describe('Chevron button setup', () => {
  it('renders correctly', () => {
    wrapper = mount(TzCtMobileChevronButton, {
      props: {
        direction: 'left'
      }
    });

    expect(wrapper.element).toMatchSnapshot();
  });

  it('renders a chevron pointing right', () => {
    wrapper = mount(TzCtMobileChevronButton, {
      props: {
        direction: 'right'
      }
    });

    const getClasses = makeGetClasses(wrapper);

    expect(getClasses(iconSelector)).not.toContain('rotate-180');
  });

  it('renders a chevron pointing left', () => {
    wrapper = mount(TzCtMobileChevronButton, {
      props: {
        direction: 'left'
      }
    });

    const getClasses = makeGetClasses(wrapper);

    expect(getClasses(iconSelector)).toContain('rotate-180');
  });

  it("emits a 'click' event when it is clicked", () => {
    wrapper.find('button').trigger('click');
    expect(wrapper.emitted()).toHaveProperty('click');
  });
});
