"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ProductSummary } from "@/lib/api/products/types";
import { listProducts } from "@/lib/api/products";
import type { PaginationMeta } from "@/lib/api/types";
import { paginationHasExactTotal } from "@/lib/api/types";
import {
  defaultProductFilters,
  type ProductFilters,
} from "@/lib/api/products";
import { PAGE_SIZE_OPTIONS } from "../products-pagination";
import { useAdminT } from "../../layout/admin-locale-provider";

const SEARCH_DEBOUNCE_MS = 400;

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
  const [perPage, setPerPageState] = useState<number>(PAGE_SIZE_OPTIONS[1]);
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchKey, setFetchKey] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setDebouncedQuery(filters.query),
      SEARCH_DEBOUNCE_MS,
    );
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
    setPage(1);
  }, [debouncedQuery]);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);

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

    load();
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
