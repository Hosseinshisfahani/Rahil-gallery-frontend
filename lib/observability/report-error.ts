import { getAccessToken } from "@/lib/api/auth";
import {
  ingestObservabilityEvent,
  type IngestObservabilityEventInput,
} from "./ingest";

const DEDUPE_MS = 15_000;
const recent = new Map<string, number>();

function shouldReport(key: string): boolean {
  const now = Date.now();
  const last = recent.get(key);
  if (last != null && now-last < DEDUPE_MS) {
    return false;
  }
  recent.set(key, now);
  return true;
}

function canReport(): boolean {
  return Boolean(
    getAccessToken() || process.env.NEXT_PUBLIC_OBSERVABILITY_INGEST_KEY,
  );
}

export function reportClientError(
  input: Omit<IngestObservabilityEventInput, "source"> & { source?: "client" },
): void {
  if (typeof window === "undefined" || !canReport()) return;

  const message = input.message.trim();
  if (!message) return;

  const key = `${input.level}:${message.slice(0, 120)}:${input.route ?? ""}`;
  if (!shouldReport(key)) return;

  void ingestObservabilityEvent({
    source: "client",
    level: input.level,
    message: message.slice(0, 4000),
    stackTrace: input.stackTrace?.slice(0, 8000),
    route: input.route ?? window.location.pathname,
    metadata: input.metadata,
  }).catch(() => {
    // best-effort reporting
  });
}

export function setupClientErrorReporting(): () => void {
  if (typeof window === "undefined") return () => {};

  const onError = (event: ErrorEvent) => {
    reportClientError({
      level: "error",
      message: event.message || "Unhandled error",
      stackTrace: event.error instanceof Error ? event.error.stack : undefined,
      route: window.location.pathname,
      metadata: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    });
  };

  const onRejection = (event: PromiseRejectionEvent) => {
    const reason = event.reason;
    const message =
      reason instanceof Error
        ? reason.message
        : typeof reason === "string"
          ? reason
          : "Unhandled promise rejection";

    reportClientError({
      level: "error",
      message,
      stackTrace: reason instanceof Error ? reason.stack : undefined,
      route: window.location.pathname,
    });
  };

  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onRejection);

  return () => {
    window.removeEventListener("error", onError);
    window.removeEventListener("unhandledrejection", onRejection);
  };
}
