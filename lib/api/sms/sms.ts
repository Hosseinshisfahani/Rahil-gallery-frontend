import { apiRequest } from "../client";
import type { SMSJob, SMSJobListResult } from "./types";

const SMS_JOBS_PATH = "/admin/sms/jobs";

export async function listSMSJobs(
  options: {
    page?: number;
    perPage?: number;
    signal?: AbortSignal;
  } = {},
): Promise<SMSJobListResult> {
  const { page = 1, perPage = 20, signal } = options;
  const res = await apiRequest<{ success: boolean; data: SMSJobListResult }>(
    SMS_JOBS_PATH,
    { params: { page, perPage }, signal },
  );
  return res.data;
}

export async function updateSMSJobNote(
  id: string,
  sellerNote: string,
): Promise<SMSJob> {
  const res = await apiRequest<{ success: boolean; data: SMSJob }>(
    `${SMS_JOBS_PATH}/${id}`,
    { method: "PATCH", body: { sellerNote } },
  );
  return res.data;
}
