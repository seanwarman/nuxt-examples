type Image = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

type Icon = {
  text: string;
};

type Button = {
  label: string;
  link: string;
};

type Tab = {
  index: number;
  name: string;
};

type NavItemContent = {
  image: Image;
  button: Button;
};

type ItemHeader = {
  image: Image;
};

type Active = {
  index: number;
  link: string;
};

type NavigationMenu = {
  name: string;
  links: NavItem[];
  header?: NavItemHeader;
};

type Underline = {
  width: number | string;
  height: number | string;
  left: string;
  top: number | string;
};

enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left'
}

export interface Item {
  image?: Image;
  icon?: Icon;
  label: string;
  link: string;
  menu: NavItem[];
  list?: NavItem[];
  content?: NavItemContent;
  active?: boolean;
  header?: ItemHeader;
}

export type NavImage = Image;
export type NavIcon = Icon;
export type NavTab = Tab;
export type NavItem = Item;
export type NavContent = NavItemContent;
export type NavItemHeader = ItemHeader;
export type NavMenu = NavigationMenu;
export type NavUnderline = Underline;
