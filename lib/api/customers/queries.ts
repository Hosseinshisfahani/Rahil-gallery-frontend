import type { CustomerDetail, CustomerSummary } from "@/_components/surfaces/dashboard/data/mock-customers";
import type { CustomerFilters } from "@/_components/surfaces/dashboard/customers/lib/filter-customers";
import { apiRequest } from "../client";
import type { PaginatedResponse } from "../types";
import { customerFiltersToParams } from "./params";
import type {
  CreateSavedViewInput,
  SavedListView,
  SavedViewType,
  SegmentsResponse,
  UpdateSavedViewInput,
} from "./saved-views";

const CUSTOMERS_PATH = "/admin/customers";

export interface ListCustomersOptions {
  filters: CustomerFilters;
  page: number;
  perPage: number;
  /** Default: skip count during quick search (`includeTotal=false`) */
  includeTotal?: boolean;
  signal?: AbortSignal;
}

export async function listCustomers({
  filters,
  page,
  perPage,
  includeTotal,
  signal,
}: ListCustomersOptions): Promise<PaginatedResponse<CustomerSummary>> {
  return apiRequest<PaginatedResponse<CustomerSummary>>(CUSTOMERS_PATH, {
    params: customerFiltersToParams(filters, { page, perPage }, { includeTotal }),
    signal,
  });
}

export async function fetchAllCustomers(
  filters: CustomerFilters,
  signal?: AbortSignal,
): Promise<CustomerSummary[]> {
  const all: CustomerSummary[] = [];
  let page = 1;

  while (true) {
    const result = await listCustomers({
      filters,
      page,
      perPage: 100,
      includeTotal: true,
      signal,
    });

    all.push(...result.data);

    if (result.meta.totalPages !== undefined && page >= result.meta.totalPages) {
      break;
    }
    if (result.meta.hasMore === false || result.data.length === 0) {
      break;
    }
    if (result.meta.totalPages === undefined && result.data.length < 100) {
      break;
    }

    page += 1;
  }

  return all;
}

export async function getCustomer(
  id: string,
  signal?: AbortSignal,
): Promise<CustomerDetail> {
  return apiRequest<CustomerDetail>(`${CUSTOMERS_PATH}/${id}`, { signal });
}

export async function getCustomerSegments(
  signal?: AbortSignal,
): Promise<SegmentsResponse> {
  return apiRequest<SegmentsResponse>(`${CUSTOMERS_PATH}/segments`, { signal });
}

export async function listSavedViews(
  viewType?: SavedViewType,
  signal?: AbortSignal,
): Promise<SavedListView[]> {
  const response = await apiRequest<{ data: SavedListView[] }>(
    `${CUSTOMERS_PATH}/saved-views`,
    {
      params: viewType ? { type: viewType } : undefined,
      signal,
    },
  );
  return response.data;
}

export async function getSavedView(
  viewId: string,
  signal?: AbortSignal,
): Promise<SavedListView> {
  return apiRequest<SavedListView>(`${CUSTOMERS_PATH}/saved-views/${viewId}`, {
    signal,
  });
}

export async function createSavedView(
  input: CreateSavedViewInput,
): Promise<SavedListView> {
  return apiRequest<SavedListView>(`${CUSTOMERS_PATH}/saved-views`, {
    method: "POST",
    body: input,
  });
}

export async function updateSavedView(
  viewId: string,
  input: UpdateSavedViewInput,
): Promise<SavedListView> {
  return apiRequest<SavedListView>(`${CUSTOMERS_PATH}/saved-views/${viewId}`, {
    method: "PATCH",
    body: input,
  });
}

export async function deleteSavedView(viewId: string): Promise<void> {
  await apiRequest<{ success: true }>(`${CUSTOMERS_PATH}/saved-views/${viewId}`, {
    method: "DELETE",
  });
}
