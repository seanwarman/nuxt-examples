import type { Image } from '../types';

export enum PageContext {
  Home = 'home',
  Hub = 'hub'
}

export interface Brand {
  id: number;
  name: string;
  image: Image;
  url: string;
}

export type BrandFilter = Omit<Brand, 'image' | 'url'>;

export interface Banner {
  page?: string;
  brands: Brand[];
}
