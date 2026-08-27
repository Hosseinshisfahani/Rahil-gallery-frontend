export type SMSJobStatus = "pending" | "running" | "completed" | "failed" | string;

export interface SMSJob {
  id: string;
  status: SMSJobStatus;
  message: string;
  matched: number;
  skippedInvalidPhone: number;
  sent: number;
  failed: number;
  batches: number;
  sellerNote: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface SMSJobListResult {
  items: SMSJob[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}
