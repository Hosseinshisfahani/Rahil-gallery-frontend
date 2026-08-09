import { apiRequest } from "@/lib/api/client";
import { getAccessToken } from "@/lib/api/auth/auth";

export type ObservabilityLevel = "error" | "warn" | "info";

export interface IngestObservabilityEventInput {
  source: "client";
  level: ObservabilityLevel;
  message: string;
  stackTrace?: string;
  route?: string;
  metadata?: Record<string, unknown>;
}

function ingestHeaders(): Record<string, string> {
  const key = process.env.NEXT_PUBLIC_OBSERVABILITY_INGEST_KEY;
  if (!key) return {};
  return { "X-Observability-Ingest-Key": key };
}

export async function ingestObservabilityEvent(
  input: IngestObservabilityEventInput,
): Promise<void> {
  const hasIngestKey = Boolean(process.env.NEXT_PUBLIC_OBSERVABILITY_INGEST_KEY);
  const hasToken = Boolean(getAccessToken());

  await apiRequest("/observability/events", {
    method: "POST",
    body: input,
    headers: ingestHeaders(),
    skipAuth: hasIngestKey && !hasToken,
  });
}
