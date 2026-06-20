"use client";

import { useEffect } from "react";
import { setupClientErrorReporting } from "@/lib/observability/report-error";

export function ObservabilityReporter() {
  useEffect(() => setupClientErrorReporting(), []);
  return null;
}
