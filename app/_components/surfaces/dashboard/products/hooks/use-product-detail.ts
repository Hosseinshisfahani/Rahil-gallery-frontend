"use client";

import { useCallback, useEffect, useState } from "react";
import type { Category, ProductDetail } from "@/lib/api/products/types";
import {
  addProductImage,
  adjustVariantInventory,
  archiveProduct,
  createProductVariant,
  deactivateProductVariant,
  getProduct,
  listCategories,
  removeProductImage,
  updateProduct,
  updateProductVariant,
} from "@/lib/api/products";
import type {
  AdjustInventoryInput,
  CreateProductImageInput,
  CreateVariantInput,
  UpdateProductInput,
  UpdateVariantInput,
} from "@/lib/api/products/types";
import { useAdminT } from "../../layout/admin-locale-provider";

export function useProductDetail(productId: string) {
  const { t } = useAdminT();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mutating, setMutating] = useState(false);

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const [data, categoryList] = await Promise.all([
        getProduct(productId, signal),
        listCategories(signal),
      ]);
      setProduct(data);
      setCategories(categoryList);
    } catch (err) {
      if (signal?.aborted) return;
      setError(err instanceof Error ? err.message : t("products.failedLoadOne"));
      setProduct(null);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [productId, t]);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  async function mutate<T>(action: () => Promise<T>): Promise<T> {
    setMutating(true);
    setError(null);
    try {
      return await action();
    } catch (err) {
      const message = err instanceof Error ? err.message : t("common.actionFailed");
      setError(message);
      throw err;
    } finally {
      setMutating(false);
    }
  }

  async function refreshProduct(): Promise<ProductDetail> {
    const data = await getProduct(productId);
    setProduct(data);
    return data;
  }

  return {
    product,
    categories,
    loading,
    error,
    mutating,
    refetch: () => load(),
    update: (input: UpdateProductInput) =>
      mutate(async () => {
        await updateProduct(productId, input);
        return refreshProduct();
      }),
    archive: () => mutate(() => archiveProduct(productId)),
    addVariant: (input: CreateVariantInput) =>
      mutate(async () => {
        await createProductVariant(productId, input);
        return refreshProduct();
      }),
    updateVariant: (variantId: string, input: UpdateVariantInput) =>
      mutate(async () => {
        await updateProductVariant(productId, variantId, input);
        return refreshProduct();
      }),
    deactivateVariant: (variantId: string) =>
      mutate(async () => {
        await deactivateProductVariant(productId, variantId);
        return refreshProduct();
      }),
    addImage: (input: CreateProductImageInput) =>
      mutate(async () => {
        await addProductImage(productId, input);
        return refreshProduct();
      }),
    removeImage: (imageId: string) =>
      mutate(async () => {
        await removeProductImage(productId, imageId);
        return refreshProduct();
      }),
    adjustInventory: (variantId: string, input: AdjustInventoryInput) =>
      mutate(async () => {
        await adjustVariantInventory(variantId, input);
        return refreshProduct();
      }),
  };
}
