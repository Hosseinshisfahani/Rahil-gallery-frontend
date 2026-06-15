import type { CustomerDetail } from "@/_components/surfaces/dashboard/data/mock-customers";
import { apiRequest } from "../client";
import type {
  AddCustomerNoteInput,
  BlockCustomerInput,
  CreateCustomerInput,
  ToggleCustomerTagInput,
  UnblockCustomerInput,
  UpdateCustomerInput,
} from "./types";

const CUSTOMERS_PATH = "/admin/customers";

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

export async function blockCustomer(
  id: string,
  input: BlockCustomerInput,
): Promise<CustomerDetail> {
  return apiRequest<CustomerDetail>(`${CUSTOMERS_PATH}/${id}/block`, {
    method: "POST",
    body: input,
  });
}

export async function unblockCustomer(
  id: string,
  input: UnblockCustomerInput,
): Promise<CustomerDetail> {
  return apiRequest<CustomerDetail>(`${CUSTOMERS_PATH}/${id}/unblock`, {
    method: "POST",
    body: input,
  });
}

export async function addCustomerNote(
  id: string,
  input: AddCustomerNoteInput,
): Promise<CustomerDetail> {
  return apiRequest<CustomerDetail>(`${CUSTOMERS_PATH}/${id}/notes`, {
    method: "POST",
    body: input,
  });
}

export async function toggleCustomerVip(id: string): Promise<CustomerDetail> {
  return apiRequest<CustomerDetail>(`${CUSTOMERS_PATH}/${id}/vip`, {
    method: "POST",
    body: {},
  });
}

export async function toggleCustomerTag(
  id: string,
  input: ToggleCustomerTagInput,
): Promise<CustomerDetail> {
  return apiRequest<CustomerDetail>(`${CUSTOMERS_PATH}/${id}/tags`, {
    method: "POST",
    body: input,
  });
}
