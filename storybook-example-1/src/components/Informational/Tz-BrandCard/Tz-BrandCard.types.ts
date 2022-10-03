import type { Image, Link } from '../types';

export interface BrandCard {
  id: number;
  title: string;
  brand: Image;
  image: Image;
  link: Link;
}
