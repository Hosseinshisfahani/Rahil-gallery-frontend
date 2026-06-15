import type {
  GemstoneType,
  JewelryType,
  MetalType,
  ProductStatus,
} from "./types";

export interface ProductFilters {
  query: string;
  status: ProductStatus | "all";
  jewelryType: JewelryType | "all";
  categoryId: string;
  featuredOnly: boolean;
  metal: MetalType | "all";
  gemstone: GemstoneType | "all";
  priceMin: number | null;
  priceMax: number | null;
}

export const defaultProductFilters: ProductFilters = {
  query: "",
  status: "all",
  jewelryType: "all",
  categoryId: "",
  featuredOnly: false,
  metal: "all",
  gemstone: "all",
  priceMin: null,
  priceMax: null,
};

export function countActiveProductFilters(filters: ProductFilters): number {
  let count = 0;
  if (filters.status !== "all") count += 1;
  if (filters.jewelryType !== "all") count += 1;
  if (filters.categoryId) count += 1;
  if (filters.featuredOnly) count += 1;
  if (filters.metal !== "all") count += 1;
  if (filters.gemstone !== "all") count += 1;
  if (filters.priceMin !== null) count += 1;
  if (filters.priceMax !== null) count += 1;
  return count;
}
