import type { LifeStyleImage, Link } from '@/components/Informational/types';

type Label = {
  enabled?: boolean;
  text?: string;
};

type Content = {
  title: string;
  link: Link;
};

export type JumboCards = {
  label: Label;
  content: Content;
  image: LifeStyleImage;
};
