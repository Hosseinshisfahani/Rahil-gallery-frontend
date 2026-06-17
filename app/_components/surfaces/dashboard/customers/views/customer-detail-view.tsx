"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/_components/core/primitive/button";
import { Skeleton } from "@/_components/core/primitive/skeleton";
import { buttonVariants } from "@/_components/core/config/variants";
import { DashboardSectionTitle } from "../../abstract/dashboard-card";
import { CustomerActionsPanel } from "../customer-action-modals";
import { EditCustomerModal } from "../customer-crud-modals";
import { EditHistoryImportModal } from "../add-customer-flow";
import {
  CustomerAuditLog,
  CustomerBehaviorSection,
  CustomerIdentitySection,
  CustomerImportProfileSection,
  CustomerLifecycleSection,
  CustomerNotesSection,
  CustomerOrdersSection,
  CustomerProfileSummary,
  CustomerWishlistSection,
} from "../customer-detail-sections";
import { DeleteCustomerModal } from "../customer-crud-modals";
import { useCustomerDetail } from "../hooks/use-customer-detail";
import { useAdminT } from "../../layout/admin-locale-provider";

type DetailTab = "overview" | "orders" | "wishlist" | "notes" | "audit";

export interface CustomerDetailViewProps {
  customerId: string;
}

export function CustomerDetailView({ customerId }: CustomerDetailViewProps) {
  const router = useRouter();
  const { t } = useAdminT();

  const tabs: { id: DetailTab; label: string }[] = [
    { id: "overview", label: t("customers.tabs.overview") },
    { id: "orders", label: t("customers.tabs.orders") },
    { id: "wishlist", label: t("customers.tabs.wishlist") },
    { id: "notes", label: t("customers.tabs.notes") },
    { id: "audit", label: t("customers.tabs.audit") },
  ];
  const {
    customer,
    loading,
    error,
    mutating,
    refetch,
    updateProfile,
    updateImportProfile,
    block,
    unblock,
    toggleVip,
    toggleTag,
    addNote,
    remove,
  } = useCustomerDetail(customerId);

  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [modal, setModal] = useState<"edit" | "edit-history" | "delete" | null>(null);

  if (loading && !customer) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="rounded-[var(--radius-md)] border border-error/30 bg-error/5 p-6">
        <p className="font-medium text-error">{error ?? t("customers.notFound")}</p>
        <div className="mt-4 flex gap-3">
          <Link href="/admin/customers" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            {t("common.backToList")}
          </Link>
          <Button variant="secondary" size="sm" onClick={refetch}>
            {t("common.retry")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/admin/customers"
            className="mb-2 inline-block text-xs text-ink-muted hover:text-primary"
          >
            {t("customers.backToCustomers")}
          </Link>
          <DashboardSectionTitle
            title={customer.fullName}
            subtitle={customer.phone}
          />
        </div>
        <Link
          href="/admin/analytics/customer"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          {t("customers.viewInAnalytics")}
        </Link>
      </div>

      {error && (
        <p className="rounded-[var(--radius-md)] border border-error/30 bg-error/5 px-4 py-3 text-sm text-error" role="alert">
          {error}
        </p>
      )}

      <CustomerProfileSummary customer={customer} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <nav
            className="mb-6 flex gap-1 overflow-x-auto border-b border-border"
            aria-label={t("customers.profileSectionsAria")}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-ink-muted hover:text-ink",
                )}
              >
                {tab.label}
                {tab.id === "notes" && customer.notes.length > 0 && (
                  <span className="ms-1.5 rounded-full bg-surface-elevated px-1.5 text-xs">
                    {customer.notes.length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {activeTab === "overview" && (
            <div className="flex flex-col gap-6">
              <CustomerIdentitySection customer={customer} />
              <CustomerImportProfileSection customer={customer} />
              <CustomerLifecycleSection customer={customer} />
              <CustomerBehaviorSection customer={customer} />
            </div>
          )}
          {activeTab === "orders" && <CustomerOrdersSection customer={customer} />}
          {activeTab === "wishlist" && (
            <CustomerWishlistSection customer={customer} />
          )}
          {activeTab === "notes" && <CustomerNotesSection notes={customer.notes} />}
          {activeTab === "audit" && <CustomerAuditLog entries={customer.auditLog} />}
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-5">
            <CustomerActionsPanel
              customer={customer}
              busy={mutating}
              onEdit={() =>
                setModal(
                  customer.importMode === "history_included"
                    ? "edit-history"
                    : "edit",
                )
              }
              onDelete={() => setModal("delete")}
              onBlock={async (reason, note) => {
                await block(reason, note);
              }}
              onUnblock={async (justification) => {
                await unblock(justification);
              }}
              onToggleVip={async () => {
                await toggleVip();
              }}
              onToggleTag={async (tag) => {
                await toggleTag(tag);
              }}
              onAddNote={async (body) => {
                await addNote(body);
                setActiveTab("notes");
              }}
            />
          </div>
        </aside>
      </div>

      {modal === "edit" && (
        <EditCustomerModal
          customer={customer}
          onClose={() => setModal(null)}
          onConfirm={async (values) => {
            await updateProfile(values);
            setModal(null);
            router.refresh();
          }}
        />
      )}
      {modal === "edit-history" && (
        <EditHistoryImportModal
          customer={customer}
          onClose={() => setModal(null)}
          onConfirm={async (payload) => {
            await updateImportProfile(payload);
            setModal(null);
            router.refresh();
          }}
        />
      )}
      {modal === "delete" && (
        <DeleteCustomerModal
          customerName={customer.fullName}
          customerId={customer.id}
          onClose={() => setModal(null)}
          onConfirm={async () => {
            await remove();
            router.push("/admin/customers");
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
