import {
  TzAccountIcon,
  TzArrowIcon,
  TzBasketAccordion,
  TzBasketCard,
  TzBasketIcon,
  TzBasketTotalsSummary,
  TzBundleCreator,
  TzButton,
  TzC2wBanner,
  TzCaretIcon,
  TzCheckmarkIcon,
  TzCheckoutCta,
  TzChevronIcon,
  TzCloseIcon,
  TzContainer,
  TzExclaimationIcon,
  TzExpandIcon,
  TzExpressCheckout,
  TzFilterIcon,
  TzInfoBox,
  TzInputField,
  TzJumboCard,
  TzLogin,
  TzModalDialog,
  TzNavigation,
  TzOrderItemsSummary,
  TzOrderTotalsSummary,
  TzPayPalButton,
  TzPaymentMethods,
  TzProductTile,
  TzProgressBar,
  TzRadioField,
  TzSearchIcon,
  TzSelectField,
  TzUspRibbon,
  TzWishlistIcon
} from './components';

import './assets/main.css';

import type {
  BrandCard,
  Card,
  DeliverToOption,
  Discount,
  DiscountType,
  Image,
  ImageFormats,
  LifeStyleImage,
  Link,
  Media,
  ProductBasic,
  ProductTile,
  AddressDetails,
  DeliveryDetails,
  OrderDetails,
  OrderProduct,
  PaymentMethod
} from './components/Informational/types';

import type { App } from 'vue';

export default {
  install: (app: App) => {
    app.component('TzAccountIcon', TzAccountIcon);
    app.component('TzArrowIcon', TzArrowIcon);
    app.component('TzBasketAccordion', TzBasketAccordion);
    app.component('TzBasketCard', TzBasketCard);
    app.component('TzBasketIcon', TzBasketIcon);
    app.component('TzBundleCreator', TzBundleCreator);
    app.component('TzButton', TzButton);
    app.component('TzC2wBanner', TzC2wBanner);
    app.component('TzCaretIcon', TzCaretIcon);
    app.component('TzCheckmarkIcon', TzCheckmarkIcon);
    app.component('TzCheckoutCta', TzCheckoutCta);
    app.component('TzChevronIcon', TzChevronIcon);
    app.component('TzCloseIcon', TzCloseIcon);
    app.component('TzContainer', TzContainer);
    app.component('TzExclaimationIcon', TzExclaimationIcon);
    app.component('TzExpandIcon', TzExpandIcon);
    app.component('TzExpressCheckout', TzExpressCheckout);
    app.component('TzFilterIcon', TzFilterIcon);
    app.component('TzInfoBox', TzInfoBox);
    app.component('TzInputField', TzInputField);
    app.component('TzJumboCard', TzJumboCard);
    app.component('TzLogin', TzLogin);
    app.component('TzModalDialog', TzModalDialog);
    app.component('TzNavigation', TzNavigation);
    app.component('TzOrderItemsSummary', TzOrderItemsSummary);
    app.component('TzBasketTotalsSummary', TzBasketTotalsSummary);
    app.component('TzOrderTotalsSummary', TzOrderTotalsSummary);
    app.component('TzPayPalButton', TzPayPalButton);
    app.component('TzPaymentMethods', TzPaymentMethods);
    app.component('TzProductTile', TzProductTile);
    app.component('TzProgressBar', TzProgressBar);
    app.component('TzRadioField', TzRadioField);
    app.component('TzSearchIcon', TzSearchIcon);
    app.component('TzSelectField', TzSelectField);
    app.component('TzUspRibbon', TzUspRibbon);
    app.component('TzWishlistIcon', TzWishlistIcon);
  }
};

export {
  AddressDetails,
  BrandCard,
  Card,
  DeliverToOption,
  DeliveryDetails,
  Discount,
  DiscountType,
  Image,
  ImageFormats,
  LifeStyleImage,
  Link,
  Media,
  OrderDetails,
  OrderProduct,
  PaymentMethod,
  ProductBasic,
  ProductTile,
  TzAccountIcon,
  TzArrowIcon,
  TzBasketAccordion,
  TzBasketCard,
  TzBasketIcon,
  TzBasketTotalsSummary,
  TzBundleCreator,
  TzButton,
  TzC2wBanner,
  TzCaretIcon,
  TzCheckmarkIcon,
  TzCheckoutCta,
  TzChevronIcon,
  TzCloseIcon,
  TzContainer,
  TzExclaimationIcon,
  TzExpandIcon,
  TzExpressCheckout,
  TzFilterIcon,
  TzInfoBox,
  TzInputField,
  TzJumboCard,
  TzLogin,
  TzModalDialog,
  TzNavigation,
  TzOrderItemsSummary,
  TzOrderTotalsSummary,
  TzPayPalButton,
  TzPaymentMethods,
  TzProductTile,
  TzProgressBar,
  TzRadioField,
  TzSearchIcon,
  TzSelectField,
  TzUspRibbon,
  TzWishlistIcon
};
