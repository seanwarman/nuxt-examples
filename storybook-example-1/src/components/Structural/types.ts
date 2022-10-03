import type { ProductBasic } from "../Informational/types";

export interface BikeDetails extends ProductBasic {
  frame?: string,
  color?: string,
  // ... etc
};