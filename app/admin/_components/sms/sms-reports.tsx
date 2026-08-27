"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DashboardCard,
  DashboardCardHeader,
  DashboardCardTitle,
} from "@/components/admin/ui/dashboard-card";
import {
  DashboardPagination,
  PRODUCT_PAGE_SIZE_OPTIONS,
} from "@/components/admin/ui/dashboard-pagination";
import {
  ResponsiveTable,
  TableCell,
  tableBodyRowClass,
  tableHeadRowClass,
  tableThClass,
} from "@/components/admin/ui/responsive-table";
import { updateSMSJobNote, type SMSJob } from "@/lib/api/sms";
import { useAdminT } from "../layout/admin-locale-provider";
import { SellerNoteModal } from "./sms-modals";
import { useSMSJobs } from "./use-sms-jobs";

const MESSAGE_PREVIEW_LENGTH = 60;
const NOTE_PREVIEW_LENGTH = 40;
const KAVENEGAR_PANEL_URL = "https://console.kavenegar.com/home";

function truncate(value: string, max: number): string {
  const chars = [...value];
  if (chars.length <= max) return value;
  return `${chars.slice(0, max).join("")}…`;
}

function statusLabel(
  status: string,
  t: (key: string, vars?: Record<string, string | number>) => string,
): string {
  const key = `sms.status.${status}`;
  const label = t(key);
  return label === key ? status : label;
}

export function SmsReportsView() {
  const { t, locale } = useAdminT();
  const {
    jobs,
    meta,
    setPage,
    setPerPage,
    loading,
    error,
    refetch,
  } = useSMSJobs();
  const [noteJob, setNoteJob] = useState<SMSJob | null>(null);
  const intlLocale = locale === "fa" ? "fa-IR" : "en-US";

  async function handleSaveNote(note: string) {
    if (!noteJob) return;
    await updateSMSJobNote(noteJob.id, note);
    refetch();
  }

  return (
    <div className="flex flex-col gap-8">
      {error && (
        <div
          className="rounded-[var(--radius-md)] border border-error/30 bg-error/5 p-4"
          role="alert"
        >
          <p className="text-sm font-medium text-error">{error}</p>
          <Button variant="ghost" size="sm" className="mt-2" onClick={refetch}>
            {t("common.retry")}
          </Button>
        </div>
      )}

      <DashboardCard>
        <DashboardCardHeader>
          <DashboardCardTitle>{t("sms.title")}</DashboardCardTitle>
          <Button asChild variant="outline" size="sm">
            <a
              href={KAVENEGAR_PANEL_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("sms.openKavenegar")}
            </a>
          </Button>
        </DashboardCardHeader>

        <div className="relative mt-2">
          {loading && jobs.length === 0 ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="py-12 text-center text-sm text-ink-muted">
              {t("sms.empty")}
            </div>
          ) : (
            <ResponsiveTable>
              <thead>
                <tr className={tableHeadRowClass}>
                  <th className={tableThClass}>{t("sms.table.created")}</th>
                  <th className={tableThClass}>{t("sms.table.status")}</th>
                  <th className={tableThClass}>{t("sms.table.message")}</th>
                  <th className={tableThClass}>{t("sms.table.matched")}</th>
                  <th className={tableThClass}>{t("sms.table.sent")}</th>
                  <th className={tableThClass}>{t("sms.table.failed")}</th>
                  <th className={tableThClass}>{t("sms.table.skipped")}</th>
                  <th className={tableThClass}>{t("sms.table.note")}</th>
                  <th className={tableThClass}>{t("sms.table.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className={tableBodyRowClass}>
                    <TableCell label={t("sms.table.created")}>
                      {new Date(job.createdAt).toLocaleString(intlLocale)}
                    </TableCell>
                    <TableCell label={t("sms.table.status")}>
                      {statusLabel(job.status, t)}
                    </TableCell>
                    <TableCell label={t("sms.table.message")}>
                      <span title={job.message}>
                        {truncate(job.message, MESSAGE_PREVIEW_LENGTH)}
                      </span>
                    </TableCell>
                    <TableCell label={t("sms.table.matched")}>
                      {job.matched.toLocaleString(intlLocale)}
                    </TableCell>
                    <TableCell label={t("sms.table.sent")}>
                      {job.sent.toLocaleString(intlLocale)}
                    </TableCell>
                    <TableCell label={t("sms.table.failed")}>
                      {job.failed.toLocaleString(intlLocale)}
                    </TableCell>
                    <TableCell label={t("sms.table.skipped")}>
                      {job.skippedInvalidPhone.toLocaleString(intlLocale)}
                    </TableCell>
                    <TableCell label={t("sms.table.note")}>
                      {job.sellerNote
                        ? truncate(job.sellerNote, NOTE_PREVIEW_LENGTH)
                        : "—"}
                    </TableCell>
                    <TableCell label={t("sms.table.actions")} layout="actions">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setNoteJob(job)}
                      >
                        {job.sellerNote
                          ? t("sms.actions.editNote")
                          : t("sms.actions.addNote")}
                      </Button>
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </ResponsiveTable>
          )}

          {loading && jobs.length > 0 && (
            <div className="absolute inset-0 z-10 bg-surface/80 backdrop-blur-[1px]" />
          )}
        </div>

        {meta && jobs.length > 0 && (
          <DashboardPagination
            className="mt-6"
            meta={meta}
            resultCount={jobs.length}
            onPageChange={setPage}
            onPerPageChange={setPerPage}
            disabled={loading}
            entityLabel={t("pagination.smsJobsEntity")}
            pageSizeOptions={PRODUCT_PAGE_SIZE_OPTIONS}
          />
        )}
      </DashboardCard>

      {noteJob && (
        <SellerNoteModal
          initialNote={noteJob.sellerNote}
          onClose={() => setNoteJob(null)}
          onSubmit={handleSaveNote}
        />
      )}
    </div>
  );
}
