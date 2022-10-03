import type { Image } from '../types';

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
