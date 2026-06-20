"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/_components/core/primitive/button";
import { Skeleton } from "@/_components/core/primitive/skeleton";
import {
  DashboardCard,
  DashboardCardHeader,
  DashboardCardTitle,
  DashboardSectionTitle,
  StatCard,
} from "../../abstract/dashboard-card";
import { CustomersFilters } from "../customers-filters";
import { CustomersTable } from "../customers-table";
import { CustomersPagination } from "../customers-pagination";
import { ExportConfirmModal, SaveFiltersModal } from "../customer-action-modals";
import { AddCustomerFlowModal } from "../add-customer-flow";
import {
  DeleteCustomerModal,
  type CustomerFormValues,
} from "../customer-crud-modals";
import { useCustomersList } from "../hooks/use-customers-list";
import { useAdminT } from "../../layout/admin-locale-provider";
import { useCustomerEnumLabels } from "@/lib/i18n/admin/use-customer-labels";
import {
  createCustomer,
  createSavedView,
  deleteCustomer,
} from "@/lib/api/customers";
import { createCustomerWithImportProfile } from "@/lib/api/customers/signature";
import type { ImportProfileSubmit } from "../add-customer-flow";
import {
  canSaveCustomerFilters,
  customerFiltersToSavedPayload,
  isSavedPayloadEmpty,
} from "@/lib/api/customers/saved-views";
import { filtersToSaveSummary } from "../lib/filters-to-save-summary";
import { buildCustomerListKpis } from "../lib/customer-list-kpis";
import {
  downloadCsv,
  exportCustomersToCsv,
} from "../lib/export-customers";

export function CustomersListView() {
  const router = useRouter();
  const { t, locale } = useAdminT();
  const { tag: tagLabel } = useCustomerEnumLabels();
  const {
    customers,
    meta,
    filters,
    setFilters,
    page,
    setPage,
    perPage,
    setPerPage,
    loading,
    error,
    refetch,
    segments,
    segmentsLoading,
  } = useCustomersList();

  const [showExportModal, setShowExportModal] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [showSaveFiltersModal, setShowSaveFiltersModal] = useState(false);
  const [savingFilters, setSavingFilters] = useState(false);
  const [saveFiltersError, setSaveFiltersError] = useState<string | null>(null);

  async function handleQuickCreate(values: CustomerFormValues) {
    const created = await createCustomer({
      importMode: "quick",
      fullName: values.fullName,
      phone: values.phone,
      email: values.email || undefined,
      locale: values.locale,
      defaultRingSize: values.defaultRingSize || undefined,
      isVip: values.isVip,
    });
    refetch();
    router.push(created.href);
  }

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
    router.push(created.href);
  }

  async function handleDeleteFromList() {
    if (!deleteTarget) return;
    await deleteCustomer(deleteTarget.id);
    setDeleteTarget(null);
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
        `rehil-customers-${new Date().toISOString().slice(0, 10)}.csv`,
      );
      setShowExportModal(false);
    } finally {
      setExporting(false);
    }
  }

  async function handleSaveFilters(name: string, isShared: boolean) {
    const payload = customerFiltersToSavedPayload(filters);
    if (isSavedPayloadEmpty(payload)) {
      setSaveFiltersError(t("customers.saveFiltersNeedFilter"));
      return;
    }

    setSavingFilters(true);
    setSaveFiltersError(null);

    try {
      await createSavedView({
        name,
        viewType: "filter",
        filters: payload,
        isShared,
        position: segments?.saved.length ?? 0,
      });
      setShowSaveFiltersModal(false);
      refetch();
    } catch (err) {
      setSaveFiltersError(
        err instanceof Error ? err.message : t("customers.saveFiltersFailed"),
      );
    } finally {
      setSavingFilters(false);
    }
  }

  const resultCount = customers.length;
  const totalCount = meta?.total;
  const canSaveFilters = canSaveCustomerFilters(filters);
  const exportDisabled =
    loading || (totalCount !== undefined ? totalCount === 0 : resultCount === 0);

  const localizedKpis = useMemo(
    () => buildCustomerListKpis(segments, t, locale, segmentsLoading),
    [segments, t, locale, segmentsLoading],
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <DashboardSectionTitle title={t("customers.managementTitle")} />
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowCreateModal(true)}
          >
            {t("customers.addCustomer")}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowExportModal(true)}
            disabled={exportDisabled}
          >
            {t("customers.exportCsv")}
          </Button>
        </div>
      </div>

      <section aria-label={t("customers.title")}>
        <div className="grid gap-4 sm:grid-cols-2">
          {localizedKpis.map((kpi) => (
            <StatCard
              key={kpi.id}
              label={kpi.label}
              value={kpi.value}
              trend="neutral"
            />
          ))}
        </div>
      </section>

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
            canSaveFilters={canSaveFilters}
            onSaveFilters={() => {
              setSaveFiltersError(null);
              setShowSaveFiltersModal(true);
            }}
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
              onDelete={(customer) =>
                setDeleteTarget({ id: customer.id, name: customer.fullName })
              }
            />
          </div>

          {meta && (
            <CustomersPagination
              meta={meta}
              resultCount={resultCount}
              onPageChange={setPage}
              onPerPageChange={setPerPage}
              disabled={loading}
              className="mt-6"
            />
          )}
        </DashboardCard>
      </section>

      {showCreateModal && (
        <AddCustomerFlowModal
          onClose={() => setShowCreateModal(false)}
          onQuickAdd={handleQuickCreate}
          onHistoryAdd={handleHistoryCreate}
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

      {showExportModal && (
        <ExportConfirmModal
          count={totalCount ?? resultCount}
          onClose={() => !exporting && setShowExportModal(false)}
          onConfirm={handleExport}
        />
      )}

      {showSaveFiltersModal && (
        <SaveFiltersModal
          filterSummary={filtersToSaveSummary(filters, t, tagLabel)}
          loading={savingFilters}
          error={saveFiltersError}
          onClose={() => !savingFilters && setShowSaveFiltersModal(false)}
          onConfirm={handleSaveFilters}
        />
      )}
    </div>
  );
}
