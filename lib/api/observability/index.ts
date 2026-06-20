import { apiRequest } from "../client";
import { getAccessToken } from "../auth/session";
import type { IngestObservabilityEventInput } from "./types";

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
