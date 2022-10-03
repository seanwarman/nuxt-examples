import { shallowMount, VueWrapper } from '@vue/test-utils';
import Container from './Tz-Container.vue';
import { describe, beforeEach, it, expect } from 'vitest';

const message = 'Container test for vitest update';
let wrapper: VueWrapper;

describe('Tz-Container.vue setup', () => {
  beforeEach(() => {
    wrapper = shallowMount(Container, {
      props: {
        styles: {
          width: 'medium'
        }
      },
      slots: {
        default: message
      }
    });
  });

  it('is a small container', () => {
    wrapper = shallowMount(Container, {
      props: {
        styles: {
          width: 'small'
        }
      }
    });

    expect(wrapper.classes()).toContain('max-w-small');
  });

  it('is a medium container', () => {
    wrapper = shallowMount(Container, {
      props: {
        styles: {
          width: 'medium'
        }
      }
    });

    expect(wrapper.classes()).toContain('max-w-medium');
  });

  it('is a large container', () => {
    wrapper = shallowMount(Container, {
      props: {
        styles: {
          width: 'large'
        }
      }
    });

    expect(wrapper.classes()).toContain('max-w-large');
  });

  it('is a full width container', () => {
    wrapper = shallowMount(Container, {
      props: {
        styles: {
          width: 'fluid'
        }
      }
    });

    expect(wrapper.classes()).toContain('max-w-full');
  });

  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot();
  });
  it('renders container content', () => {
    expect(wrapper.text()).toMatch(message);
  });
  it('sets a base class', () => {
    expect(wrapper.classes()).toContain('tz-container');
  });
});
