/**
 * @vitest-environment jsdom
 */

import { VueWrapper, mount } from '@vue/test-utils';
import { expect, describe, beforeEach, it } from 'vitest';
import { TzInfoBox } from '@/components';

let wrapper: VueWrapper;

describe('TzInfoBox', () => {
  beforeEach(() => {
    wrapper = mount(TzInfoBox, {
      props: {
        actionLabel: 'Edit'
      }
    });
  });

  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  describe('when the action is clicked', () => {
    it("will emit an 'actionClick' event", () => {
      wrapper.find('button').trigger('click');
      expect(wrapper.emitted()).toHaveProperty('actionClick');
    });
  });
});
