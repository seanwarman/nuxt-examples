export type VariantObject = {
  name: string;
  hex: string;
};

export interface Variants {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [id: string]: any;
  primary_color: VariantObject;
  secondary_color: VariantObject;
  image: VariantImage;
  instock: boolean;
  lifestyle?: boolean;
}

export interface VariantImage {
  src: string;
  alt: string;
}

export type Finance = {
  available: boolean;
  pm: number;
  apr: number;
};

export type Layout = {
  collapsed?: boolean;
  lean?: boolean;
};

export type Discount = {
  new_price?: number;
  percentage?: number;
};

export type Price = {
  rrp: number;
  discount?: Discount;
  finance?: Finance;
};

export type Reviews = {
  score?: number;
  count?: number;
};

export type Product = {
  id: number;
  sku: string;
  title: string;
  image?: VariantImage;
  price: Price;
  reviews?: Reviews;
  uri: string;
  stock: number;
  collapsed?: boolean;
  lean?: boolean;
  bike: boolean;
  label: boolean;
  favourite?: boolean;
  best_seller?: boolean;
  summer_sale?: boolean;
  sale?: boolean;
  new_in?: boolean;
  variants?: Variants[];
};
