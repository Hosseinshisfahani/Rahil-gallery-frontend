import type { CustomerDetail, CustomerSummary } from "./types";
import type { CustomerFilters } from "@/_components/surfaces/dashboard/customers/lib/filter-customers";
import { apiRequest } from "../client";
import type { PaginatedResponse } from "../types";
import { customerFiltersToParams } from "./params";

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
