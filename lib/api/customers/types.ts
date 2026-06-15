import type {
  CustomerImportProfile,
  CustomerTag,
} from "@/_components/surfaces/dashboard/data/mock-customers";
import type { BlockReasonCode } from "@/_components/surfaces/dashboard/data/mock-customers";
import type { CustomerImportMode } from "@/_components/surfaces/dashboard/data/mock-customers";

export interface CreateCustomerInput {
  importMode?: CustomerImportMode;
  fullName?: string;
  phone?: string;
  email?: string;
  locale?: "fa" | "en";
  defaultRingSize?: string;
  isVip?: boolean;
  tags?: CustomerTag[];
  importProfile?: CustomerImportProfile;
}

export interface UpdateCustomerInput {
  fullName?: string;
  phone?: string;
  email?: string;
  locale?: "fa" | "en";
  defaultRingSize?: string;
  isVip?: boolean;
  tags?: CustomerTag[];
  importProfile?: CustomerImportProfile;
}

export interface BlockCustomerInput {
  reason: BlockReasonCode;
  note?: string;
}

export interface UnblockCustomerInput {
  justification: string;
}

export interface AddCustomerNoteInput {
  body: string;
}

export interface ToggleCustomerTagInput {
  tag: CustomerTag;
}
