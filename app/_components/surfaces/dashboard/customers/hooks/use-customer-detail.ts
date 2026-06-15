"use client";

import { useCallback, useEffect, useState } from "react";
import { readStoredAdminLocale } from "@/lib/admin-locale";
import { getAdminMessage } from "@/lib/i18n/admin";
import type {
  BlockReasonCode,
  CustomerDetail,
  CustomerTag,
} from "../../data/mock-customers";
import {
  addCustomerNote,
  blockCustomer,
  deleteCustomer,
  getCustomer,
  toggleCustomerTag,
  toggleCustomerVip,
  unblockCustomer,
  updateCustomer,
} from "@/lib/api/customers";
import type { CustomerImportProfile } from "../../data/mock-customers";
import type { CustomerFormValues } from "../customer-crud-modals";

function adminT(key: string): string {
  return getAdminMessage(readStoredAdminLocale(), key);
}

export function useCustomerDetail(customerId: string) {
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mutating, setMutating] = useState(false);

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
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
    updateProfile: (values: CustomerFormValues) =>
      mutate(async () => {
        await updateCustomer(customerId, {
          fullName: values.fullName,
          phone: values.phone,
          email: values.email || undefined,
          locale: values.locale,
          defaultRingSize: values.defaultRingSize || undefined,
          isVip: values.isVip,
        });
        return refreshCustomer();
      }),
    updateImportProfile: (profile: CustomerImportProfile) =>
      mutate(async () => {
        await updateCustomer(customerId, { importProfile: profile });
        return refreshCustomer();
      }),
    block: (reason: BlockReasonCode, note: string) =>
      mutate(async () => {
        await blockCustomer(customerId, { reason, note });
        return refreshCustomer();
      }),
    unblock: (justification: string) =>
      mutate(async () => {
        await unblockCustomer(customerId, { justification });
        return refreshCustomer();
      }),
    toggleVip: () =>
      mutate(async () => {
        await toggleCustomerVip(customerId);
        return refreshCustomer();
      }),
    toggleTag: (tag: CustomerTag) =>
      mutate(async () => {
        await toggleCustomerTag(customerId, { tag });
        return refreshCustomer();
      }),
    addNote: (body: string) =>
      mutate(async () => {
        await addCustomerNote(customerId, { body });
        return refreshCustomer();
      }),
    remove: () => mutate(() => deleteCustomer(customerId)),
  };
}
