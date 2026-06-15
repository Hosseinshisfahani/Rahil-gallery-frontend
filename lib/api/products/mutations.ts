import { apiRequest } from "../client";
import { mapProductDetail } from "./map";
import type {
  AdjustInventoryInput,
  CreateProductImageInput,
  CreateProductInput,
  CreateVariantInput,
  ProductDetail,
  ProductImage,
  ProductVariant,
  UpdateProductInput,
  UpdateVariantInput,
} from "./types";

const ADMIN_PRODUCTS_PATH = "/admin/products";

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
