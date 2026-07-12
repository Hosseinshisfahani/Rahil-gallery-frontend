import type { CustomerDetail } from "./types";
import { apiRequest } from "../client";
import type { CreateCustomerInput, UpdateCustomerInput } from "./types";

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
