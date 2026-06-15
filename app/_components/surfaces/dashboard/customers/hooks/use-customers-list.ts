"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { readStoredAdminLocale } from "@/lib/admin-locale";
import { getAdminMessage } from "@/lib/i18n/admin";
import type { CustomerSummary } from "../../data/mock-customers";
import {
  defaultCustomerFilters,
  type CustomerFilters,
} from "../lib/filter-customers";
import { getCustomerSegments, listCustomers } from "@/lib/api/customers";
import type { PaginationMeta } from "@/lib/api/types";
import { paginationHasExactTotal } from "@/lib/api/types";
import { PAGE_SIZE_OPTIONS } from "../customers-pagination";
import type { SegmentsResponse } from "@/lib/api/customers/saved-views";

const SEARCH_DEBOUNCE_MS = 400;

function adminT(key: string): string {
  return getAdminMessage(readStoredAdminLocale(), key);
}

export interface UseCustomersListResult {
  customers: CustomerSummary[];
  meta: PaginationMeta | null;
  filters: CustomerFilters;
  setFilters: (filters: CustomerFilters) => void;
  page: number;
  setPage: (page: number) => void;
  perPage: number;
  setPerPage: (perPage: number) => void;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  segments: SegmentsResponse | null;
  segmentsLoading: boolean;
}

export function useCustomersList(): UseCustomersListResult {
  const [filters, setFiltersState] = useState(defaultCustomerFilters);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPageState] = useState<number>(PAGE_SIZE_OPTIONS[1]);
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchKey, setFetchKey] = useState(0);
  const [segments, setSegments] = useState<SegmentsResponse | null>(null);
  const [segmentsLoading, setSegmentsLoading] = useState(true);

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

  const setFilters = useCallback((next: CustomerFilters) => {
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

    async function loadSegments() {
      setSegmentsLoading(true);
      try {
        const data = await getCustomerSegments(controller.signal);
        setSegments(data);
      } catch {
        if (!controller.signal.aborted) {
          setSegments(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setSegmentsLoading(false);
        }
      }
    }

    loadSegments();
    return () => controller.abort();
  }, [fetchKey]);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const result = await listCustomers({
          filters: requestFilters,
          page,
          perPage,
          signal: controller.signal,
        });

        setCustomers(result.data);
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
          err instanceof Error ? err.message : adminT("customers.failedLoad"),
        );
        setCustomers([]);
        setMeta(null);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    load();
    return () => controller.abort();
  }, [requestFilters, page, perPage, fetchKey]);

  const refetch = useCallback(() => {
    setFetchKey((key) => key + 1);
  }, []);

  return {
    customers,
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
    segments,
    segmentsLoading,
  };
}
