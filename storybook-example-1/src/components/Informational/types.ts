import type {
  VariantImage,
  Price,
  Layout,
  Reviews
} from '@/components/Informational/Tz-Product-Tile/Tz-Product-Tile.types';

export type Image = {
  width?: string | number;
  height?: string | number;
  src: string;
  alt?: string;
};

export type ImageFormats = {
  webp?: string;
  png?: string;
};

export type Media = {
  width: number | string;
  image: Image;
  src?: string;
  formats: ImageFormats;
  keywords?: string[];
};

export interface LifeStyleImage extends Image {
  lifestyle?: boolean;
}

type FrameName = string;

type Target = '_blank' | '_self' | '_parent' | '_top' | FrameName;

export type Link = {
  url: string | undefined;
  target?: Target;
  internal?: boolean;
};

export interface ProductBasic {
  id: number;
  title: string;
  image: Image;
  uri: string;
  link: never;
}
export interface ProductTile extends ProductBasic {
  price: Price;
  sku: string;
  uri: string;
  stock: number;
  layout?: Layout;
  bike?: boolean;
  lifestyle?: boolean;
  reviews: Reviews;
  brand: never;
}
export interface BrandCard extends ProductBasic {
  brand: Image;
  reviews?: never;
  price: never;
  sku: never;
}
export type Card = ProductTile | BrandCard;
export type Test = BrandCard;

export type DeliverToOption = {
  id: number;
  name: string;
};

export type Discount = {
  name: string;
  amount: number;
  type: DiscountType;
};

export enum DiscountType {
  cycleToWork,
  freeGift,
  vochure
}

export type OrderProduct = {
  line_item_id: number;
  title: string;
  image: Image;
  quantity: number;
  total: number;
};

export type OrderDetails = {
  address: AddressDetails;
  options: DeliveryDetails;
  billing: AddressDetails;
  payment: PaymentMethod;
};

export type AddressDetails = {
  name?: string;
  street_address?: string;
  street_address_2?: string;
  county?: string;
  city?: string;
  postal_code?: string;
};

export type DeliveryDetails = {
  delivery: string;
  description: string;
};

export type PaymentMethod = {
  method: string;
};
