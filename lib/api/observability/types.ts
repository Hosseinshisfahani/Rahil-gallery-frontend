export type ObservabilityLevel = "error" | "warn" | "info";

export interface IngestObservabilityEventInput {
  source: "client";
  level: ObservabilityLevel;
  message: string;
  stackTrace?: string;
  route?: string;
  metadata?: Record<string, unknown>;
}
