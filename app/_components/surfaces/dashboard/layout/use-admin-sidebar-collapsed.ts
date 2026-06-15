"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "rehil-admin-sidebar-collapsed";

export function useAdminSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(STORAGE_KEY) === "true");
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, String(collapsed));
    } catch {
      // ignore
    }
  }, [collapsed, ready]);

  const toggle = useCallback(() => {
    setCollapsed((value) => !value);
  }, []);

  return { collapsed, toggle, ready };
}
