"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DashboardCard,
  DashboardCardHeader,
  DashboardCardTitle,
  DashboardSectionTitle,
} from "@/components/admin/ui/dashboard-card";
import { CustomersFilters } from "./customers-filters";
import { CustomersTable } from "./customers-table";
import {
  CUSTOMER_PAGE_SIZE_OPTIONS,
  DashboardPagination,
} from "@/components/admin/ui/dashboard-pagination";
import {
  AddCustomerFlowModal,
  BulkSMSModal,
  DeleteCustomerModal,
  EditHistoryImportModal,
  ExportConfirmModal,
} from "./customer-modals";
import { useCustomersList } from "./use-customers";
import { useAdminT } from "../layout/admin-locale-provider";
import { createCustomer, deleteCustomer, getCustomer } from "@/lib/api/customers";
import { createCustomerWithImportProfile, saveCustomerImportProfile } from "@/lib/api/customers";
import type { ImportProfileSubmit } from "./customer-forms";
import type { CustomerDetail } from "@/lib/api/customers/types";
import {
  CUSTOMER_DETAIL_PAGE_ENABLED,
  downloadCsv,
  exportCustomersToCsv,
} from "./customers";

export function CustomersListView() {
  const router = useRouter();
  const { t } = useAdminT();
  const {
    customers,
    meta,
    filters,
    requestFilters,
    setFilters,
    setPage,
    setPerPage,
    loading,
    error,
    refetch,
  } = useCustomersList();

  const [showExportModal, setShowExportModal] = useState(false);
  const [showBulkSmsModal, setShowBulkSmsModal] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [editCustomer, setEditCustomer] = useState<CustomerDetail | null>(null);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  async function handleHistoryCreate({ profile, signatureFile }: ImportProfileSubmit) {
    const created = await createCustomerWithImportProfile(
      (importProfile) =>
        createCustomer({
          importMode: "history_included",
          importProfile,
        }),
      profile,
      signatureFile,
    );
    refetch();
    setShowCreateModal(false);
    if (CUSTOMER_DETAIL_PAGE_ENABLED) {
      router.push(created.href);
    }
  }

  async function handleDeleteFromList() {
    if (!deleteTarget) return;
    await deleteCustomer(deleteTarget.id);
    setDeleteTarget(null);
    refetch();
  }

  async function openEdit(customerId: string) {
    if (editingCustomerId) return;
    setEditingCustomerId(customerId);
    setEditError(null);
    try {
      const customer = await getCustomer(customerId);
      setEditCustomer(customer);
    } catch (err) {
      setEditError(
        err instanceof Error ? err.message : t("customers.modals.edit.failed"),
      );
    } finally {
      setEditingCustomerId(null);
    }
  }

  function closeEdit() {
    setEditCustomer(null);
    setEditError(null);
  }

  async function handleEditSave(payload: ImportProfileSubmit) {
    if (!editCustomer) return;
    await saveCustomerImportProfile({
      customerId: editCustomer.id,
      profile: payload.profile,
      signatureFile: payload.signatureFile,
      removeSignature: payload.removeSignature,
    });
    closeEdit();
    refetch();
  }

  async function handleExport() {
    setExporting(true);
    try {
      const { fetchAllCustomers } = await import("@/lib/api/customers");
      const all = await fetchAllCustomers(filters);
      const csv = exportCustomersToCsv(all);
      downloadCsv(
        csv,
        `rahil-customers-${new Date().toISOString().slice(0, 10)}.csv`,
      );
      setShowExportModal(false);
    } finally {
      setExporting(false);
    }
  }

  async function handleBulkSms(message: string) {
    const { sendBulkCustomerSMS } = await import("@/lib/api/customers");
    const result = await sendBulkCustomerSMS({ message, filters: requestFilters });
    window.alert(
      t("customers.modals.bulkSms.success", {
        matched: result.matched,
        skipped: result.skippedInvalidPhone,
        batches: result.batches,
      }),
    );
  }

  const resultCount = customers.length;
  const totalCount = meta?.total;
  const exportDisabled =
    loading || (totalCount !== undefined ? totalCount === 0 : resultCount === 0);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <DashboardSectionTitle title={t("customers.managementTitle")} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCreateModal(true)}
          >
            {t("customers.addCustomer")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBulkSmsModal(true)}
            disabled={loading}
          >
            {t("customers.sendBulkSms")}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => setShowExportModal(true)}
            disabled={exportDisabled}
          >
            {t("customers.exportCsv")}
          </Button>
        </div>
      </div>

      <section aria-label={t("customers.allCustomers")}>
        <DashboardCard>
          <DashboardCardHeader>
            <div>
              <DashboardCardTitle>{t("customers.allCustomers")}</DashboardCardTitle>
            </div>
          </DashboardCardHeader>

          <CustomersFilters
            filters={filters}
            onChange={setFilters}
            resultCount={resultCount}
            totalCount={totalCount}
            hasMore={meta?.hasMore}
          />

          {error && (
            <div
              className="mt-4 rounded-[var(--radius-md)] border border-error/30 bg-error/5 p-4"
              role="alert"
            >
              <p className="text-sm font-medium text-error">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={refetch}
              >
                {t("common.retry")}
              </Button>
            </div>
          )}

          {editError && (
            <div
              className="mt-4 rounded-[var(--radius-md)] border border-error/30 bg-error/5 p-4"
              role="alert"
            >
              <p className="text-sm font-medium text-error">{editError}</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => setEditError(null)}
              >
                {t("common.closeDialog")}
              </Button>
            </div>
          )}

          <div className="relative mt-6">
            {loading && (
              <div className="absolute inset-0 z-10 flex flex-col gap-2 bg-surface/80 p-4 backdrop-blur-[1px]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            )}
            <CustomersTable
              customers={customers}
              editingCustomerId={editingCustomerId}
              onEdit={(customer) => void openEdit(customer.id)}
              onDelete={(customer) =>
                setDeleteTarget({ id: customer.id, name: customer.fullName })
              }
            />
          </div>

          {meta && (
            <DashboardPagination
              meta={meta}
              resultCount={resultCount}
              onPageChange={setPage}
              onPerPageChange={setPerPage}
              disabled={loading}
              className="mt-6"
              entityLabel={t("pagination.customersEntity")}
              pageSizeOptions={CUSTOMER_PAGE_SIZE_OPTIONS}
              includeMoreHint
            />
          )}
        </DashboardCard>
      </section>

      {showCreateModal && (
        <AddCustomerFlowModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleHistoryCreate}
        />
      )}

      {deleteTarget && (
        <DeleteCustomerModal
          customerName={deleteTarget.name}
          customerId={deleteTarget.id}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteFromList}
        />
      )}

      {editCustomer && (
        <EditHistoryImportModal
          customer={editCustomer}
          onClose={closeEdit}
          onConfirm={handleEditSave}
        />
      )}

      {showBulkSmsModal && (
        <BulkSMSModal
          onClose={() => setShowBulkSmsModal(false)}
          onSubmit={handleBulkSms}
        />
      )}

      {showExportModal && (
        <ExportConfirmModal
          count={totalCount ?? resultCount}
          onClose={() => !exporting && setShowExportModal(false)}
          onConfirm={handleExport}
        />
      )}
    </div>
  );
}
