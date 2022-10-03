<template>
  <div :class="classes">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  width,
  xPadding,
  yPadding,
  topPadding,
  bottomPadding,
  xMargin,
  yMargin,
  topMargin,
  bottomMargin
} from './Tz-Container.options';

export type Width = 'fluid' | 'small' | 'medium' | 'large';
export type SizeCore = 'none' | 'small' | 'medium' | 'large' | 'xlarge';
export type Border = boolean;

// style controls
// padding
export type XPadding = SizeCore;
export type YPadding = SizeCore;
export type TopPadding = SizeCore;
export type BottomPadding = SizeCore;

// margin
export type XMargin = SizeCore;
export type YMargin = SizeCore;
export type TopMargin = SizeCore;
export type BottomMargin = SizeCore;

export type MarginControl = {
  x_margin?: XMargin;
  y_margin?: YMargin;
  top_margin?: TopMargin;
  bottom_margin?: BottomMargin;
};

export type PaddingControl = {
  x_padding?: XPadding;
  y_padding?: YPadding;
  top_padding?: TopPadding;
  bottom_padding?: BottomPadding;
};

export type Styles = {
  width?: Width;
  padding?: PaddingControl;
  margin?: MarginControl;
};

export interface Props {
  border?: Border;
  styles?: Styles;
}

const props = defineProps<Props>();

const classes = computed(() => {
  return {
    'tz-container': true,
    // eslint-disable-next-line
    container: true,
    'mx-auto': true,
    'min-h-default': true,
    // border ----
    'border-dotted border-2 border-sky-500': props.border,
    // xPadding ----
    'px-0': props.styles?.padding?.x_padding === xPadding.none,
    'px-2.5': props.styles?.padding?.x_padding === xPadding.small,
    'px-2.5 lg:px-4': props.styles?.padding?.x_padding === xPadding.medium,
    'px-2.5 lg:px-6': props.styles?.padding?.x_padding === xPadding.large,
    'px-2.5 lg:px-8': props.styles?.padding?.x_padding === xPadding.xlarge,
    // yPadding ----
    'py-0': props.styles?.padding?.y_padding === yPadding.none,
    'py-2.5': props.styles?.padding?.y_padding === yPadding.small,
    'py-4': props.styles?.padding?.y_padding === yPadding.medium,
    'py-6': props.styles?.padding?.y_padding === yPadding.large,
    'py-8': props.styles?.padding?.y_padding === yPadding.xlarge,
    // topPadding ----
    'pt-0': !props.styles?.padding?.y_padding && props.styles?.padding?.top_padding === topPadding.none,
    'pt-2.5': !props.styles?.padding?.y_padding && props.styles?.padding?.top_padding === topPadding.small,
    'pt-4': !props.styles?.padding?.y_padding && props.styles?.padding?.top_padding === topPadding.medium,
    'pt-6': !props.styles?.padding?.y_padding && props.styles?.padding?.top_padding === topPadding.large,
    'pt-8': !props.styles?.padding?.y_padding && props.styles?.padding?.top_padding === topPadding.xlarge,
    // bottomPadding ----
    'pb-0': !props.styles?.padding?.y_padding && props.styles?.padding?.bottom_padding === bottomPadding.none,
    'pb-2.5': !props.styles?.padding?.y_padding && props.styles?.padding?.bottom_padding === bottomPadding.small,
    'pb-4': !props.styles?.padding?.y_padding && props.styles?.padding?.bottom_padding === bottomPadding.medium,
    'pb-6': !props.styles?.padding?.y_padding && props.styles?.padding?.bottom_padding === bottomPadding.large,
    'pb-8': !props.styles?.padding?.y_padding && props.styles?.padding?.bottom_padding === bottomPadding.xlarge,
    // xMargin ----
    'mx-0': props.styles?.margin?.x_margin === xMargin.none,
    'mx-2.5': props.styles?.margin?.x_margin === xMargin.small,
    'mx-2.5 lg:mx-4': props.styles?.margin?.x_margin === xMargin.medium,
    'mx-2.5 lg:mx-6': props.styles?.margin?.x_margin === xMargin.large,
    'mx-2.5 lg:mx-8': props.styles?.margin?.x_margin === xMargin.xlarge,
    // yMargin ----
    'my-0': props.styles?.margin?.y_margin === yMargin.none,
    'my-2.5': props.styles?.margin?.y_margin === yMargin.small,
    'my-4': props.styles?.margin?.y_margin === yMargin.medium,
    'my-6': props.styles?.margin?.y_margin === yMargin.large,
    'my-8': props.styles?.margin?.y_margin === yMargin.xlarge,
    // topMargin ----
    'mt-0': !props.styles?.margin?.y_margin && props.styles?.margin?.top_margin === topMargin.none,
    'mt-2.5': !props.styles?.margin?.y_margin && props.styles?.margin?.top_margin === topMargin.small,
    'mt-4': !props.styles?.margin?.y_margin && props.styles?.margin?.top_margin === topMargin.medium,
    'mt-6': !props.styles?.margin?.y_margin && props.styles?.margin?.top_margin === topMargin.large,
    'mt-8': !props.styles?.margin?.y_margin && props.styles?.margin?.top_margin === topMargin.xlarge,
    // bottomMargin ----
    'mb-0': !props.styles?.margin?.y_margin && props.styles?.margin?.bottom_margin === bottomMargin.none,
    'mb-2.5': !props.styles?.margin?.y_margin && props.styles?.margin?.bottom_margin === bottomMargin.small,
    'mb-4': !props.styles?.margin?.y_margin && props.styles?.margin?.bottom_margin === bottomMargin.medium,
    'mb-6': !props.styles?.margin?.y_margin && props.styles?.margin?.bottom_margin === bottomMargin.large,
    'mb-8': !props.styles?.margin?.y_margin && props.styles?.margin?.bottom_margin === bottomMargin.xlarge,
    // width ----
    'max-w-small': props.styles?.width === width.small,
    'max-w-medium': props.styles?.width === width.medium,
    'max-w-large': props.styles?.width === width.large,
    'max-w-full': props.styles?.width === width.fluid
  };
});
</script>
