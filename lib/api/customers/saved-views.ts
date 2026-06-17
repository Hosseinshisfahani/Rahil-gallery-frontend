import type { CustomerSegment, CustomerTag } from "@/_components/surfaces/dashboard/data/mock-customers";
import type { CustomerFilters } from "@/_components/surfaces/dashboard/customers/lib/filter-customers";
import {
  defaultCustomerFilters,
  hasAdvancedCustomerFilters,
} from "@/_components/surfaces/dashboard/customers/lib/filter-customers";

/** Mirrors backend `SavedFilterPayload` (list query params). */
export interface SavedFilterPayload {
  q?: string;
  segment?: string;
  email?: string;
  status?: string;
  vip?: boolean;
  ltvMin?: number;
  ltvMax?: number;
  ordersMin?: number;
  ordersMax?: number;
  registeredFrom?: string;
  registeredTo?: string;
  lastPurchaseFrom?: string;
  lastPurchaseTo?: string;
  lastActivityFrom?: string;
  lastActivityTo?: string;
  tags?: string[];
  hasPurchased?: string;
  includeTotal?: boolean;
}

export type SavedViewType = "filter" | "segment";

export interface SavedListView {
  id: string;
  name: string;
  viewType: SavedViewType;
  filters: SavedFilterPayload;
  isShared: boolean;
  position: number;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SegmentSummary {
  segment: CustomerSegment;
  label: string;
  count: number;
}

export interface SegmentsResponse {
  builtin: SegmentSummary[];
  saved: SavedListView[];
}

export interface CreateSavedViewInput {
  name: string;
  viewType: SavedViewType;
  filters: SavedFilterPayload;
  isShared?: boolean;
  position?: number;
}

export interface UpdateSavedViewInput {
  name: string;
  viewType: SavedViewType;
  filters: SavedFilterPayload;
  isShared?: boolean;
  position?: number;
}

function optionalDate(value?: string | null): string {
  return value ?? "";
}

export function savedPayloadToCustomerFilters(
  payload: SavedFilterPayload,
): CustomerFilters {
  return {
    ...defaultCustomerFilters,
    query: payload.q?.trim() ?? "",
    email: payload.email?.trim() ?? "",
    segment: (payload.segment as CustomerSegment | undefined) ?? "all",
    status:
      payload.status === "active" || payload.status === "blocked"
        ? payload.status
        : "all",
    vipOnly: payload.vip ?? false,
    ltvMin: payload.ltvMin ?? null,
    ltvMax: payload.ltvMax ?? null,
    ordersMin: payload.ordersMin ?? null,
    ordersMax: payload.ordersMax ?? null,
    registeredFrom: optionalDate(payload.registeredFrom),
    registeredTo: optionalDate(payload.registeredTo),
    lastPurchaseFrom: optionalDate(payload.lastPurchaseFrom),
    lastPurchaseTo: optionalDate(payload.lastPurchaseTo),
    lastActivityFrom: optionalDate(payload.lastActivityFrom),
    lastActivityTo: optionalDate(payload.lastActivityTo),
    tags: (payload.tags ?? []) as CustomerTag[],
    hasPurchased:
      payload.hasPurchased === "yes" || payload.hasPurchased === "no"
        ? payload.hasPurchased
        : "all",
  };
}

export function customerFiltersToSavedPayload(
  filters: CustomerFilters,
): SavedFilterPayload {
  const payload: SavedFilterPayload = {};

  if (filters.query.trim()) payload.q = filters.query.trim();
  if (filters.email.trim()) payload.email = filters.email.trim();
  if (filters.segment !== "all") payload.segment = filters.segment;
  if (filters.status !== "all") payload.status = filters.status;
  if (filters.vipOnly) payload.vip = true;
  if (filters.ltvMin !== null) payload.ltvMin = filters.ltvMin;
  if (filters.ltvMax !== null) payload.ltvMax = filters.ltvMax;
  if (filters.ordersMin !== null) payload.ordersMin = filters.ordersMin;
  if (filters.ordersMax !== null) payload.ordersMax = filters.ordersMax;
  if (filters.registeredFrom) payload.registeredFrom = filters.registeredFrom;
  if (filters.registeredTo) payload.registeredTo = filters.registeredTo;
  if (filters.lastPurchaseFrom) payload.lastPurchaseFrom = filters.lastPurchaseFrom;
  if (filters.lastPurchaseTo) payload.lastPurchaseTo = filters.lastPurchaseTo;
  if (filters.lastActivityFrom) payload.lastActivityFrom = filters.lastActivityFrom;
  if (filters.lastActivityTo) payload.lastActivityTo = filters.lastActivityTo;
  if (filters.tags.length > 0) payload.tags = [...filters.tags];
  if (filters.hasPurchased !== "all") payload.hasPurchased = filters.hasPurchased;

  return payload;
}

/** True when the current filters can be persisted as a saved view. */
export function canSaveCustomerFilters(filters: CustomerFilters): boolean {
  if (filters.query.trim()) return true;
  return hasAdvancedCustomerFilters(filters);
}

export function isSavedPayloadEmpty(payload: SavedFilterPayload): boolean {
  return Object.keys(payload).length === 0;
}

export function segmentOnlyFilters(segment: CustomerSegment): CustomerFilters {
  return {
    ...defaultCustomerFilters,
    segment,
  };
}
