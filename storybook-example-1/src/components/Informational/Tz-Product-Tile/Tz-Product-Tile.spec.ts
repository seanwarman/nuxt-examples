/**
 * @vitest-environment jsdom
 */

import { mount, VueWrapper, DOMWrapper } from '@vue/test-utils';
import TzProductTile from './Tz-Product-Tile.vue';
import TzProductControls from './Tz-Product-Controls.vue';
import TzProductTileVariants from './Tz-Product-Tile-Variants.vue';
import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { productTileContent } from './Tz-Product-Tile.data';
import type { Product } from './Tz-Product-Tile.types';

let wrapper: VueWrapper;

describe('Tz-Product-Tile-Variants.vue events', () => {
  test('handle-active-variant event fired when variant button clicked', async () => {
    wrapper = mount(TzProductTileVariants, {
      props: {
        variants: productTileContent.variants,
        'active-variant': 1,
        'active-variant-content': productTileContent.variants ? productTileContent.variants[1] : null
      }
    });
    const variantButton = wrapper.find('.tz-product-tile-variant:nth-child(2) button');
    variantButton.trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted()['handle-active-variant'].length).toBe(1);
  });
  afterAll(() => {
    wrapper.unmount();
  });
});

describe('Tz-Product-Controls.vue events', () => {
  beforeAll(() => {
    wrapper = mount(TzProductControls, {
      props: {
        id: 1,
        'product-title': 'title',
        wishlisted: false,
        compare: true
      }
    });
  });
  afterAll(() => {
    wrapper.unmount();
  });
  test('onFavourite event is fired when wishlist icon is clicked', async () => {
    const icon = wrapper.find(`#wishlistControls`);
    icon.trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted()['onFavourite'].length).toBe(1);
  });
});

describe('Tz-Product-Tile.vue setup', () => {
  afterAll(() => {
    wrapper.unmount();
  });
  test('renders correctly', () => {
    wrapper = mount(TzProductTile, {
      props: <Product>{ ...productTileContent }
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});

describe('Tz-Product-Tile.vue events', () => {
  afterAll(() => {
    wrapper.unmount();
  });
  test('emits onPin event when pin icon is clicked', async () => {
    wrapper = mount(TzProductTile, {
      props: <Product>{ ...productTileContent, pinMode: true }
    });
    const input = wrapper.find(`#pinControls`);
    input.trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted()['onPin'].length).toBe(1);
  });
  test('emits onCompare event when compare checkbox clicked', async () => {
    wrapper = mount(TzProductTile, {
      props: <Product>{ ...productTileContent }
    });
    const input: DOMWrapper<HTMLInputElement> = wrapper.find(`#compare-${productTileContent.id}`);
    input.trigger('click');
    input.trigger('change');
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted()['onCompare'].length).toBe(1);
  });
});

describe('Tz-Product-Tile.vue functionality', () => {
  beforeEach(() => {
    wrapper = mount(TzProductTile, {
      props: <Product>{ ...productTileContent }
    });
  });
  afterAll(() => {
    wrapper.unmount();
  });
  test.skip('item added to wishlist cookie on wishlist icon click in format wishListProducts=${productTileContent.id} and removed when clicked again', async () => {
    const input = wrapper.find(`.wishlist-icon svg`);
    // add to wishlist
    input.trigger('click');
    await wrapper.vm.$nextTick();
    expect(window.document.cookie).toContain(`wishListProducts=${productTileContent.id}`);
    //remove from wishlist
    input.trigger('click');
    await wrapper.vm.$nextTick();
    expect(window.document.cookie).not.toContain(`wishListProducts=${productTileContent.id}`);
  });
  test('product image changes when product variant clicked', async () => {
    const variantButton = wrapper.find('.tz-product-tile-variant:nth-child(2) button');
    const productImage = wrapper.find('.main-product-container img');
    variantButton.trigger('click');
    // await nextTick twice because of nextTick in component module handleActiveVariant function
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(productImage.element.getAttribute('src')).toEqual(productTileContent.variants ? productTileContent.variants[1].image.src : null);
  });
});
