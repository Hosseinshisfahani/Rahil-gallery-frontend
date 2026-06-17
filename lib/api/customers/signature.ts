import type { CustomerDetail } from "@/_components/surfaces/dashboard/data/mock-customers";
import type { CustomerImportProfile } from "@/_components/surfaces/dashboard/data/mock-customers";
import { buildApiUrl } from "../config";
import { getAccessToken, handleAuthIssue, isAuthError } from "../auth/session";
import { refreshAccessToken } from "../auth/queries";
import { ApiError, type ApiErrorBody } from "../types";
import { updateCustomer } from "./mutations";

const CUSTOMERS_PATH = "/admin/customers";
const MAX_SIGNATURE_BYTES = 2 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

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

  const token = getAccessToken();
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
  const { apiRequest } = await import("../client");
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
