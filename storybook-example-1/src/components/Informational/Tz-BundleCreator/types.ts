import type { Media } from '../Tz-ResponsiveImage/types';
type Image = {
  src: string;
  srcSet?: string;
  alt: string;
  width?: number;
  height?: number;
};

type Info = {
  image: Image;
  media: Media[];
  price: string;
  total: number;
  call_to_action: Cta;
};

type Cta = {
  label: string;
};

export type BundleInfo = Info;
