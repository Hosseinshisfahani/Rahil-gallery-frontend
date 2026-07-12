"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { readStoredAdminLocale } from "@/lib/admin-locale";
import { getAdminMessage } from "@/lib/i18n/admin";
import type { CustomerDetail } from "@/lib/api/customers/types";
import { deleteCustomer, getCustomer } from "@/lib/api/customers";
import { saveCustomerImportProfile } from "@/lib/api/customers/signature";
import type { ImportProfileSubmit } from "../add-customer-flow";

function adminT(key: string): string {
  return getAdminMessage(readStoredAdminLocale(), key);
}

export function useCustomerDetail(customerId: string) {
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mutating, setMutating] = useState(false);

  const load = useCallback(async (signal?: AbortSignal, resetPending = true) => {
    if (resetPending) {
      setLoading(true);
      setError(null);
    }
    try {
      const data = await getCustomer(customerId, signal);
      setCustomer(data);
    } catch (err) {
      if (signal?.aborted) return;
      setError(err instanceof Error ? err.message : adminT("customers.failedLoadOne"));
      setCustomer(null);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [customerId]);

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
      const message = err instanceof Error ? err.message : adminT("common.actionFailed");
      setError(message);
      throw err;
    } finally {
      setMutating(false);
    }
  }

  async function refreshCustomer(): Promise<CustomerDetail> {
    const data = await getCustomer(customerId);
    setCustomer(data);
    return data;
  }

  return {
    customer,
    loading,
    error,
    mutating,
    refetch: () => load(),
    updateImportProfile: (payload: ImportProfileSubmit) =>
      mutate(async () => {
        await saveCustomerImportProfile({
          customerId,
          profile: payload.profile,
          signatureFile: payload.signatureFile,
          removeSignature: payload.removeSignature,
        });
        return refreshCustomer();
      }),
    remove: () => mutate(() => deleteCustomer(customerId)),
  };
}
