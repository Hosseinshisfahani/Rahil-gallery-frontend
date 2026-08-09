import { normalizeMediaUrl } from "@/lib/media";
import type { PaginatedResponse } from "../types";
import { apiRequest } from "../client";
import type {
  AdjustInventoryInput,
  Category,
  CreateProductImageInput,
  CreateProductInput,
  CreateVariantInput,
  GemstoneType,
  JewelryType,
  MetalType,
  ProductDetail,
  ProductImage,
  ProductStatus,
  ProductSummary,
  ProductVariant,
  UpdateProductInput,
  UpdateVariantInput,
} from "./types";

// --- filters ---

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

// --- params ---

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

// --- map ---

type ApiProductSummary = Omit<ProductSummary, "href">;
type ApiProductDetail = Omit<ProductDetail, "href">;

export function mapProductImage(image: ProductImage): ProductImage {
  return {
    ...image,
    url: normalizeMediaUrl(image.url) ?? image.url,
  };
}

export function mapProductSummary(raw: ApiProductSummary): ProductSummary {
  return {
    ...raw,
    primaryImageUrl: normalizeMediaUrl(raw.primaryImageUrl),
    href: `/admin/products/${raw.id}`,
  };
}

export function mapProductDetail(raw: ApiProductDetail): ProductDetail {
  return {
    ...raw,
    primaryImageUrl: normalizeMediaUrl(raw.primaryImageUrl),
    images: raw.images.map(mapProductImage),
    href: `/admin/products/${raw.id}`,
  };
}

// --- queries ---

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

// --- mutations ---

export async function createProduct(
  input: CreateProductInput,
): Promise<ProductDetail> {
  const detail = await apiRequest<Omit<ProductDetail, "href">>(ADMIN_PRODUCTS_PATH, {
    method: "POST",
    body: input,
  });
  return mapProductDetail(detail);
}

export async function updateProduct(
  id: string,
  input: UpdateProductInput,
): Promise<ProductDetail> {
  const detail = await apiRequest<Omit<ProductDetail, "href">>(
    `${ADMIN_PRODUCTS_PATH}/${id}`,
    { method: "PATCH", body: input },
  );
  return mapProductDetail(detail);
}

export async function archiveProduct(id: string): Promise<void> {
  await apiRequest<{ success: true }>(`${ADMIN_PRODUCTS_PATH}/${id}`, {
    method: "DELETE",
  });
}

export async function createProductVariant(
  productId: string,
  input: CreateVariantInput,
): Promise<ProductVariant> {
  return apiRequest<ProductVariant>(`${ADMIN_PRODUCTS_PATH}/${productId}/variants`, {
    method: "POST",
    body: input,
  });
}

export async function updateProductVariant(
  productId: string,
  variantId: string,
  input: UpdateVariantInput,
): Promise<ProductVariant> {
  return apiRequest<ProductVariant>(
    `${ADMIN_PRODUCTS_PATH}/${productId}/variants/${variantId}`,
    { method: "PATCH", body: input },
  );
}

export async function deactivateProductVariant(
  productId: string,
  variantId: string,
): Promise<void> {
  await apiRequest<{ success: true }>(
    `${ADMIN_PRODUCTS_PATH}/${productId}/variants/${variantId}`,
    { method: "DELETE" },
  );
}

export async function addProductImage(
  productId: string,
  input: CreateProductImageInput,
): Promise<ProductImage> {
  return apiRequest<ProductImage>(`${ADMIN_PRODUCTS_PATH}/${productId}/images`, {
    method: "POST",
    body: input,
  });
}

export async function removeProductImage(
  productId: string,
  imageId: string,
): Promise<void> {
  await apiRequest<{ success: true }>(
    `${ADMIN_PRODUCTS_PATH}/${productId}/images/${imageId}`,
    { method: "DELETE" },
  );
}

export async function adjustVariantInventory(
  variantId: string,
  input: AdjustInventoryInput,
): Promise<ProductVariant> {
  return apiRequest<ProductVariant>(`/admin/inventory/${variantId}`, {
    method: "PATCH",
    body: input,
  });
}
