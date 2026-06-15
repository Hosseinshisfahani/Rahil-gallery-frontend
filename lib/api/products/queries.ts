import type { PaginatedResponse } from "../types";
import { apiRequest } from "../client";
import type { ProductFilters } from "./filters";
import { mapProductDetail, mapProductSummary } from "./map";
import { productFiltersToParams } from "./params";
import type { Category, ProductDetail, ProductSummary } from "./types";

const ADMIN_PRODUCTS_PATH = "/admin/products";

export interface ListProductsOptions {
  filters: ProductFilters;
  page: number;
  perPage: number;
  signal?: AbortSignal;
}

export async function listProducts({
  filters,
  page,
  perPage,
  signal,
}: ListProductsOptions): Promise<PaginatedResponse<ProductSummary>> {
  const result = await apiRequest<PaginatedResponse<Omit<ProductSummary, "href">>>(
    ADMIN_PRODUCTS_PATH,
    {
      params: productFiltersToParams(filters, { page, perPage }),
      signal,
    },
  );

  return {
    data: result.data.map(mapProductSummary),
    meta: result.meta,
  };
}

export async function getProduct(
  id: string,
  signal?: AbortSignal,
): Promise<ProductDetail> {
  const detail = await apiRequest<Omit<ProductDetail, "href">>(
    `${ADMIN_PRODUCTS_PATH}/${id}`,
    { signal },
  );
  return mapProductDetail(detail);
}

export async function listCategories(signal?: AbortSignal): Promise<Category[]> {
  const response = await apiRequest<{ data: Category[] }>("/categories", {
    signal,
  });
  return response.data;
}
