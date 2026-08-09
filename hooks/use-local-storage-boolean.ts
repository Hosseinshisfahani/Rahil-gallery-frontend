"use client";

import { useCallback, useSyncExternalStore } from "react";

type LocalStorageBooleanOptions = {
  storageKey: string;
  defaultValue?: boolean;
};

const stores = new Map<string, Set<() => void>>();

function getStore(storageKey: string): Set<() => void> {
  let store = stores.get(storageKey);
  if (!store) {
    store = new Set();
    stores.set(storageKey, store);
  }
  return store;
}

function readBoolean(storageKey: string, defaultValue: boolean): boolean {
  if (typeof window === "undefined") return defaultValue;

  try {
    const stored = localStorage.getItem(storageKey);
    if (stored === "true") return true;
    if (stored === "false") return false;
  } catch {
    // ignore
  }

  return defaultValue;
}

function writeBoolean(storageKey: string, value: boolean): void {
  try {
    localStorage.setItem(storageKey, String(value));
  } catch {
    // ignore
  }

  getStore(storageKey).forEach((listener) => listener());
}

function subscribe(storageKey: string, listener: () => void): () => void {
  const store = getStore(storageKey);
  store.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey) listener();
  };

  window.addEventListener("storage", onStorage);

  return () => {
    store.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useLocalStorageBoolean({
  storageKey,
  defaultValue = false,
}: LocalStorageBooleanOptions) {
  const value = useSyncExternalStore(
    (listener) => subscribe(storageKey, listener),
    () => readBoolean(storageKey, defaultValue),
    () => defaultValue,
  );

  const setValue = useCallback(
    (next: boolean) => {
      writeBoolean(storageKey, next);
    },
    [storageKey],
  );

  const toggle = useCallback(() => {
    setValue(!readBoolean(storageKey, defaultValue));
  }, [defaultValue, setValue, storageKey]);

  return { value, setValue, toggle };
}
