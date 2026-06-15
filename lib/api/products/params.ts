import type { ProductFilters } from "./filters";

export interface ProductListQuery extends ProductFilters {
  page: number;
  perPage: number;
}

export function productFiltersToParams(
  filters: ProductFilters,
  pagination?: { page: number; perPage: number },
): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {};

  const q = filters.query.trim();
  if (q) params.q = q;

  if (filters.status !== "all") params.status = filters.status;
  if (filters.jewelryType !== "all") params.jewelryType = filters.jewelryType;
  if (filters.categoryId) params.categoryId = filters.categoryId;
  if (filters.featuredOnly) params.featured = true;
  if (filters.metal !== "all") params.metal = filters.metal;
  if (filters.gemstone !== "all") params.gemstone = filters.gemstone;
  if (filters.priceMin !== null) params.priceMin = filters.priceMin;
  if (filters.priceMax !== null) params.priceMax = filters.priceMax;

  if (pagination) {
    params.page = pagination.page;
    params.perPage = pagination.perPage;
  }

  return params;
}
