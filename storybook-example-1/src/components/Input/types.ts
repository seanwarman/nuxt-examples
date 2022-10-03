export type Option = {
  name?: string;
  value?: string | number | boolean;
  prefix?: string;
};

export interface TzSelectProps {
  description?: string;
  options: Option[];
  defaultState?: Option;
  size?: string;
  prefixes?: boolean;
}
