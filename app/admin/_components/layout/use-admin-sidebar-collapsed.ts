"use client";

import { useLocalStorageBoolean } from "@/hooks/use-local-storage-boolean";

const STORAGE_KEY = "rahil-admin-sidebar-collapsed";

export function useAdminSidebarCollapsed() {
  const { value: collapsed, toggle } = useLocalStorageBoolean({
    storageKey: STORAGE_KEY,
    defaultValue: false,
  });

  return { collapsed, toggle, ready: true };
}
