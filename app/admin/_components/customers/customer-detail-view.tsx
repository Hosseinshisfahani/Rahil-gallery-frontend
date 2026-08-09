"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import {
  CustomerImportProfileSection,
  CustomerProfileHero,
  CustomerProfileTable,
} from "./customer-detail-sections";
import { useCustomerDetail } from "./use-customers";
import { useAdminT } from "../layout/admin-locale-provider";

export interface CustomerDetailViewProps {
  customerId: string;
}

function BackIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 rtl:rotate-180"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export function CustomerDetailView({ customerId }: CustomerDetailViewProps) {
  const { t } = useAdminT();
  const { customer, loading, error, refetch } = useCustomerDetail(customerId);

  if (loading && !customer) {
    return (
      <div className="flex flex-col gap-5">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-28 w-full rounded-[var(--radius-lg)]" />
        <Skeleton className="h-80 w-full rounded-[var(--radius-lg)]" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="rounded-[var(--radius-md)] border border-error/30 bg-error/5 p-6">
        <p className="text-sm font-medium text-error">{error ?? t("customers.notFound")}</p>
        <div className="mt-4 flex gap-3">
          <Link href="/admin/customers" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            {t("common.backToList")}
          </Link>
          <Button variant="outline" size="sm" onClick={refetch}>
            {t("common.retry")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/admin/customers"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-primary"
      >
        <BackIcon />
        {t("customers.backToCustomers")}
      </Link>

      {error && (
        <p
          className="rounded-[var(--radius-md)] border border-error/30 bg-error/5 px-4 py-3 text-sm text-error"
          role="alert"
        >
          {error}
        </p>
      )}

      <CustomerProfileHero customer={customer} />
      {/* <CustomerProfileTable customer={customer} /> */}
      <CustomerImportProfileSection customer={customer} />
    </div>
  );
}
