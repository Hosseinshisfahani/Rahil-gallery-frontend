import type {
  CustomerAgeRange,
  CustomerDetail,
  CustomerGender,
  CustomerImportProfile,
  CustomerSummary,
  CustomerType,
  CreateCustomerInput,
  PurchasedCategory,
  UpdateCustomerInput,
} from "./types";
import { buildApiUrl } from "../config";
import { apiRequest } from "../client";
import type { PaginatedResponse, ApiErrorBody } from "../types";
import { ApiError } from "../types";
import {
  ensureValidAccessToken,
  refreshAccessToken,
  handleAuthIssue,
  isAuthError,
} from "../auth/auth";

const CUSTOMERS_PATH = "/admin/customers";
const MAX_SIGNATURE_BYTES = 2 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

// --- filters ---

export interface CustomerFilters {
  /** Quick search — name or phone only (ignored when advanced filters are active) */
  query: string;
  /** Advanced: exact customer UUID */
  customerId: string;
  /** Advanced: partial email match */
  email: string;
  customerAgeRange: CustomerAgeRange | "";
  gender: CustomerGender | "all";
  purchaseTypes: PurchasedCategory[];
  customerTypes: CustomerType[];
  firstVisitFrom: string;
  firstVisitTo: string;
  birthdayFrom: string;
  birthdayTo: string;
  marriageFrom: string;
  marriageTo: string;
}

export const defaultCustomerFilters: CustomerFilters = {
  query: "",
  customerId: "",
  email: "",
  customerAgeRange: "",
  gender: "all",
  purchaseTypes: [],
  customerTypes: [],
  firstVisitFrom: "",
  firstVisitTo: "",
  birthdayFrom: "",
  birthdayTo: "",
  marriageFrom: "",
  marriageTo: "",
};

/**
 * Mirrors backend `ListFilter.HasAdvancedFilters()`.
 * @see rahil-gallery-server/internal/domain/customer/entity.go
 */
export function hasAdvancedCustomerFilters(filters: CustomerFilters): boolean {
  return (
    filters.customerId.trim() !== "" ||
    filters.email.trim() !== "" ||
    filters.customerAgeRange !== "" ||
    filters.gender !== "all" ||
    filters.purchaseTypes.length > 0 ||
    filters.customerTypes.length > 0 ||
    filters.firstVisitFrom !== "" ||
    filters.firstVisitTo !== "" ||
    filters.birthdayFrom !== "" ||
    filters.birthdayTo !== "" ||
    filters.marriageFrom !== "" ||
    filters.marriageTo !== ""
  );
}

export function countActiveFilters(filters: CustomerFilters): number {
  let count = 0;
  if (filters.customerId.trim()) count++;
  if (filters.email.trim()) count++;
  if (filters.customerAgeRange) count++;
  if (filters.gender !== "all") count++;
  if (filters.purchaseTypes.length > 0) count++;
  if (filters.customerTypes.length > 0) count++;
  if (filters.firstVisitFrom) count++;
  if (filters.firstVisitTo) count++;
  if (filters.birthdayFrom) count++;
  if (filters.birthdayTo) count++;
  if (filters.marriageFrom) count++;
  if (filters.marriageTo) count++;
  return count;
}

export function countAdvancedPanelFilters(filters: CustomerFilters): number {
  return countActiveFilters(filters);
}

export interface CustomerListQuery extends CustomerFilters {
  page: number;
  perPage: number;
}

export interface CustomerListParamsOptions {
  includeTotal?: boolean;
}

/** Skip COUNT(*) during quick search — backend returns `meta.hasMore` instead. */
export function shouldIncludeTotal(filters: CustomerFilters): boolean {
  if (hasAdvancedCustomerFilters(filters)) {
    return true;
  }
  return !filters.query.trim();
}

export function customerFiltersToParams(
  filters: CustomerFilters,
  pagination?: { page: number; perPage: number },
  options?: CustomerListParamsOptions,
): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {};
  const advanced = hasAdvancedCustomerFilters(filters);
  const includeTotal = options?.includeTotal ?? shouldIncludeTotal(filters);

  if (advanced) {
    const id = filters.customerId.trim();
    if (id) params.id = id;

    const email = filters.email.trim();
    if (email) params.email = email;

    if (filters.customerAgeRange) params.ageRange = filters.customerAgeRange;
    if (filters.gender !== "all") params.gender = filters.gender;
    if (filters.customerTypes.length > 0) {
      params.customerTypes = filters.customerTypes.join(",");
    }
    if (filters.purchaseTypes.length > 0) {
      params.purchaseTypes = filters.purchaseTypes.join(",");
    }
    if (filters.firstVisitFrom) params.firstVisitFrom = filters.firstVisitFrom;
    if (filters.firstVisitTo) params.firstVisitTo = filters.firstVisitTo;
    if (filters.birthdayFrom) params.birthdayFrom = filters.birthdayFrom;
    if (filters.birthdayTo) params.birthdayTo = filters.birthdayTo;
    if (filters.marriageFrom) params.marriageFrom = filters.marriageFrom;
    if (filters.marriageTo) params.marriageTo = filters.marriageTo;
  } else if (filters.query.trim()) {
    params.q = filters.query.trim();
  }

  if (!includeTotal) {
    params.includeTotal = false;
  }

  if (pagination) {
    params.page = pagination.page;
    params.perPage = pagination.perPage;
  }

  return params;
}

export function paramsToCustomerFilters(
  searchParams: URLSearchParams,
): CustomerFilters & { page: number; perPage: number } {
  const customerTypesParam = searchParams.get("customerTypes");
  const customerTypes = customerTypesParam
    ? (customerTypesParam.split(",").filter(Boolean) as CustomerType[])
    : [];
  const purchaseTypesParam = searchParams.get("purchaseTypes");
  const purchaseTypes = purchaseTypesParam
    ? (purchaseTypesParam.split(",").filter(Boolean) as PurchasedCategory[])
    : [];

  return {
    query: searchParams.get("q") ?? "",
    customerId: searchParams.get("id") ?? "",
    email: searchParams.get("email") ?? "",
    customerAgeRange:
      (searchParams.get("ageRange") as CustomerAgeRange | null) ?? "",
    gender: (searchParams.get("gender") as CustomerGender | "all" | null) ?? "all",
    purchaseTypes,
    customerTypes,
    firstVisitFrom: searchParams.get("firstVisitFrom") ?? "",
    firstVisitTo: searchParams.get("firstVisitTo") ?? "",
    birthdayFrom: searchParams.get("birthdayFrom") ?? "",
    birthdayTo: searchParams.get("birthdayTo") ?? "",
    marriageFrom: searchParams.get("marriageFrom") ?? "",
    marriageTo: searchParams.get("marriageTo") ?? "",
    page: Math.max(1, Number(searchParams.get("page") ?? "1") || 1),
    perPage: Math.min(
      100,
      Math.max(1, Number(searchParams.get("perPage") ?? "10") || 10),
    ),
  };
}

// --- queries ---

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

// --- mutations ---

export async function createCustomer(
  input: CreateCustomerInput,
): Promise<CustomerDetail> {
  return apiRequest<CustomerDetail>(CUSTOMERS_PATH, {
    method: "POST",
    body: input,
  });
}

export async function updateCustomer(
  id: string,
  input: UpdateCustomerInput,
): Promise<CustomerDetail> {
  return apiRequest<CustomerDetail>(`${CUSTOMERS_PATH}/${id}`, {
    method: "PATCH",
    body: input,
  });
}

export async function deleteCustomer(id: string): Promise<void> {
  await apiRequest<{ success: true }>(`${CUSTOMERS_PATH}/${id}`, {
    method: "DELETE",
  });
}

export interface BulkSMSResult {
  jobId: string;
  accepted: boolean;
  matched: number;
  skippedInvalidPhone: number;
  batches: number;
}

/** Maps UI filters → JSON body expected by POST /admin/customers/sms/bulk */
export function customerFiltersToBulkBody(filters: CustomerFilters) {
  return {
    query: filters.query,
    customerId: filters.customerId,
    email: filters.email,
    customerAgeRange: filters.customerAgeRange,
    gender: filters.gender,
    customerTypes: filters.customerTypes,
    purchaseTypes: filters.purchaseTypes,
    firstVisitFrom: filters.firstVisitFrom,
    firstVisitTo: filters.firstVisitTo,
    birthdayFrom: filters.birthdayFrom,
    birthdayTo: filters.birthdayTo,
    marriageFrom: filters.marriageFrom,
    marriageTo: filters.marriageTo,
  };
}

export async function sendBulkCustomerSMS(input: {
  message: string;
  filters: CustomerFilters;
}): Promise<BulkSMSResult> {
  const res = await apiRequest<{ success: boolean; data: BulkSMSResult }>(
    `${CUSTOMERS_PATH}/sms/bulk`,
    {
      method: "POST",
      body: {
        message: input.message,
        filters: customerFiltersToBulkBody(input.filters),
      },
    },
  );
  if (!res?.data) {
    throw new ApiError("REQUEST_FAILED", "Empty bulk SMS response", 500);
  }
  return res.data;
}

// --- signature ---

export function validateSignatureFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "INVALID_TYPE";
  }
  if (file.size > MAX_SIGNATURE_BYTES) {
    return "TOO_LARGE";
  }
  return null;
}

async function parseErrorResponse(response: Response): Promise<ApiError> {
  let errorBody: ApiErrorBody | undefined;
  try {
    errorBody = (await response.json()) as ApiErrorBody;
  } catch {
    // non-JSON body
  }

  return new ApiError(
    errorBody?.error?.code ?? "REQUEST_FAILED",
    errorBody?.error?.message ?? `Request failed (${response.status})`,
    response.status,
  );
}

async function uploadSignatureRequest(
  customerId: string,
  file: File,
  retried = false,
): Promise<CustomerDetail> {
  const formData = new FormData();
  formData.append("file", file);

  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const path = buildApiUrl(`${CUSTOMERS_PATH}/${customerId}/signature`);
  const url = path.startsWith("http") ? path : `${origin}${path}`;

  const token = await ensureValidAccessToken();
  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
  });

  if (response.status === 401 && !retried) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return uploadSignatureRequest(customerId, file, true);
    }
    handleAuthIssue();
    throw new ApiError("UNAUTHORIZED", "Session expired — please sign in again", 401);
  }

  if (!response.ok) {
    const error = await parseErrorResponse(response);
    if (isAuthError(error.status, error.code)) {
      handleAuthIssue();
    }
    throw error;
  }

  return (await response.json()) as CustomerDetail;
}

export async function uploadCustomerSignature(
  customerId: string,
  file: File,
): Promise<CustomerDetail> {
  return uploadSignatureRequest(customerId, file);
}

export async function deleteCustomerSignature(
  customerId: string,
): Promise<CustomerDetail> {
  return apiRequest<CustomerDetail>(`${CUSTOMERS_PATH}/${customerId}/signature`, {
    method: "DELETE",
  });
}

export interface ImportProfileSaveOptions {
  customerId: string;
  profile: CustomerImportProfile;
  signatureFile?: File | null;
  removeSignature?: boolean;
}

/** Saves CRM profile and applies signature upload/removal when needed. */
export async function saveCustomerImportProfile({
  customerId,
  profile,
  signatureFile,
  removeSignature,
}: ImportProfileSaveOptions): Promise<CustomerDetail> {
  const { signature: _ignored, ...profileWithoutSignature } = profile;
  const profilePayload: CustomerImportProfile = { ...profileWithoutSignature };

  if (!signatureFile && !removeSignature && profile.signature) {
    profilePayload.signature = profile.signature;
  }

  let detail = await updateCustomer(customerId, { importProfile: profilePayload });

  if (removeSignature) {
    detail = await deleteCustomerSignature(customerId);
  } else if (signatureFile) {
    detail = await uploadCustomerSignature(customerId, signatureFile);
  }

  return detail;
}

export async function createCustomerWithImportProfile(
  create: (profile: CustomerImportProfile) => Promise<CustomerDetail>,
  profile: CustomerImportProfile,
  signatureFile?: File | null,
): Promise<CustomerDetail> {
  const { signature: _ignored, ...rest } = profile;
  const createProfile: CustomerImportProfile = signatureFile
    ? rest
    : profile;

  const created = await create(createProfile);

  if (signatureFile) {
    return uploadCustomerSignature(created.id, signatureFile);
  }

  return created;
}
