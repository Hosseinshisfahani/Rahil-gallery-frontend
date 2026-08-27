"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { listSMSJobs, type SMSJob } from "@/lib/api/sms";
import type { PaginationMeta } from "@/lib/api/types";
import { PRODUCT_PAGE_SIZE_OPTIONS } from "@/components/admin/ui/dashboard-pagination";
import { readStoredAdminLocale } from "@/lib/admin-locale";
import { getAdminMessage } from "@/lib/i18n/admin";

function adminT(key: string): string {
  return getAdminMessage(readStoredAdminLocale(), key);
}

export function useSMSJobs() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPageState] = useState<number>(PRODUCT_PAGE_SIZE_OPTIONS[1]);
  const [jobs, setJobs] = useState<SMSJob[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchKey, setFetchKey] = useState(0);
  const skipInitial = useRef(true);

  const setPerPage = useCallback((next: number) => {
    setPerPageState(next);
    setPage(1);
  }, []);

  const refetch = useCallback(() => setFetchKey((k) => k + 1), []);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      if (!skipInitial.current) {
        setLoading(true);
        setError(null);
      }
      skipInitial.current = false;

      try {
        const result = await listSMSJobs({ page, perPage, signal: controller.signal });
        setJobs(result.items);
        setMeta({
          page: result.page,
          perPage: result.perPage,
          total: result.total,
          totalPages: result.totalPages,
        });
        if (result.totalPages > 0 && page > result.totalPages) {
          setPage(result.totalPages);
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : adminT("sms.failedLoad"));
        setJobs([]);
        setMeta(null);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void load();
    return () => controller.abort();
  }, [page, perPage, fetchKey]);

  return { jobs, meta, page, setPage, perPage, setPerPage, loading, error, refetch };
}
