interface SearchStrings {
  label: string;
  category?: string;
  logo?: Image;
}

type Link = {
  url: string;
  internal?: boolean;
  target?: string;
};

type BrandSearch = {
  label: string;
  logo: Image;
  link: Link;
};

type TopBrands = {
  image: Image;
  link?: Link;
};

type Content = {
  title: string;
  content: string;
  link: Link;
};

type SupportSearch = {
  content: Content;
  image: Image;
  size: string;
};

type ProductSearch = {
  title: string;
  price: number;
  image: Image;
  rating: number;
};

type Image = {
  src: string;
  alt: string;
};

interface SearchSuggestion {
  term: string;
  logo?: Image;
  category?: string;
  link: Link;
}

export type ImageType = Image;
export type StandardLink = Link;
export type TBrands = TopBrands;
export type Search = SearchStrings;
export type Brand = BrandSearch;
export type Support = SupportSearch;
export type Product = ProductSearch;
export type Suggestion = SearchSuggestion;
