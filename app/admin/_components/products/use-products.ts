"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Category, ProductDetail, ProductSummary } from "@/lib/api/products/types";
import {
  addProductImage,
  adjustVariantInventory,
  archiveProduct,
  createProductVariant,
  deactivateProductVariant,
  defaultProductFilters,
  getProduct,
  listCategories,
  listProducts,
  removeProductImage,
  updateProduct,
  updateProductVariant,
  type ProductFilters,
} from "@/lib/api/products";
import type {
  AdjustInventoryInput,
  CreateProductImageInput,
  CreateVariantInput,
  UpdateProductInput,
  UpdateVariantInput,
} from "@/lib/api/products/types";
import type { PaginationMeta } from "@/lib/api/types";
import { paginationHasExactTotal } from "@/lib/api/types";
import { PRODUCT_PAGE_SIZE_OPTIONS } from "@/components/admin/ui/dashboard-pagination";
import { useAdminT } from "../layout/admin-locale-provider";

const SEARCH_DEBOUNCE_MS = 400;

// --- useProductsList ---

export interface UseProductsListResult {
  products: ProductSummary[];
  meta: PaginationMeta | null;
  filters: ProductFilters;
  setFilters: (filters: ProductFilters) => void;
  page: number;
  setPage: (page: number) => void;
  perPage: number;
  setPerPage: (perPage: number) => void;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProductsList(): UseProductsListResult {
  const { t } = useAdminT();
  const [filters, setFiltersState] = useState(defaultProductFilters);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPageState] = useState<number>(PRODUCT_PAGE_SIZE_OPTIONS[1]);
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchKey, setFetchKey] = useState(0);

  const skipInitialListReset = useRef(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery((previous) => {
        if (previous !== filters.query) {
          setPage(1);
        }
        return filters.query;
      });
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [filters.query]);

  const requestFilters = useMemo(
    () => ({ ...filters, query: debouncedQuery }),
    [filters, debouncedQuery],
  );

  const setFilters = useCallback((next: ProductFilters) => {
    setFiltersState(next);
    setPage(1);
  }, []);

  const setPerPage = useCallback((next: number) => {
    setPerPageState(next);
    setPage(1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      if (!skipInitialListReset.current) {
        setLoading(true);
        setError(null);
      }
      skipInitialListReset.current = false;

      try {
        const result = await listProducts({
          filters: requestFilters,
          page,
          perPage,
          signal: controller.signal,
        });

        setProducts(result.data);
        setMeta(result.meta);

        if (
          paginationHasExactTotal(result.meta) &&
          result.meta.page !== undefined &&
          result.meta.page !== page
        ) {
          setPage(result.meta.page);
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(
          err instanceof Error ? err.message : t("products.failedLoad"),
        );
        setProducts([]);
        setMeta(null);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => controller.abort();
  }, [requestFilters, page, perPage, fetchKey, t]);

  const refetch = useCallback(() => {
    setFetchKey((key) => key + 1);
  }, []);

  return {
    products,
    meta,
    filters,
    setFilters,
    page,
    setPage,
    perPage,
    setPerPage,
    loading,
    error,
    refetch,
  };
}

// --- useProductDetail ---

export function useProductDetail(productId: string) {
  const { t } = useAdminT();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mutating, setMutating] = useState(false);

  const load = useCallback(async (signal?: AbortSignal, resetPending = true) => {
    if (resetPending) {
      setLoading(true);
      setError(null);
    }
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

  const skipInitialLoadReset = useRef(true);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal, !skipInitialLoadReset.current);
    skipInitialLoadReset.current = false;
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
