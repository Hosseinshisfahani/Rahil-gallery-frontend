"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCustomerEnumLabels } from "@/hooks/admin/use-customer-enum-labels";
import type {
  CustomerSummary,
  CustomerType,
  CustomerAgeRange,
  CustomerGender,
  PurchasedCategory,
} from "@/lib/api/customers/types";
import {
  CUSTOMER_TYPES,
  CUSTOMER_AGE_RANGES,
  CUSTOMER_GENDERS,
  PURCHASED_CATEGORY_DISPLAY_ORDER,
  PURCHASED_CATEGORY_OPTIONS,
} from "@/lib/api/customers/types";
import {
  ResponsiveTable,
  TableCell,
  tableBodyRowClass,
  tableHeadRowClass,
  tableThClass,
} from "@/components/admin/ui/responsive-table";
import { useAdminT } from "../layout/admin-locale-provider";
import { CUSTOMER_DETAIL_PAGE_ENABLED } from "./customers";

export interface CustomersTableProps {
  customers: CustomerSummary[];
  onEdit?: (customer: CustomerSummary) => void;
  onDelete?: (customer: CustomerSummary) => void;
  editingCustomerId?: string | null;
  className?: string;
}

function isCustomerType(value: string): value is CustomerType {
  return (CUSTOMER_TYPES as readonly string[]).includes(value);
}

function isPurchasedCategory(value: string): value is PurchasedCategory {
  return (PURCHASED_CATEGORY_OPTIONS as readonly string[]).includes(value);
}

function isCustomerAgeRange(value: string): value is CustomerAgeRange {
  return (CUSTOMER_AGE_RANGES as readonly string[]).includes(value);
}

function isCustomerGender(value: string): value is CustomerGender {
  return (CUSTOMER_GENDERS as readonly string[]).includes(value);
}

function sortPurchasedCategories(categories: PurchasedCategory[]): PurchasedCategory[] {
  const order = new Map(
    PURCHASED_CATEGORY_DISPLAY_ORDER.map((category, index) => [category, index]),
  );
  return [...categories].sort(
    (a, b) => (order.get(a) ?? 99) - (order.get(b) ?? 99),
  );
}

export function CustomersTable({
  customers,
  onEdit,
  onDelete,
  editingCustomerId,
  className,
}: CustomersTableProps) {
  const { t } = useAdminT();
  const {
    customerType: customerTypeLabel,
    purchasedCategory,
    ageRange: ageRangeLabel,
    gender: genderLabel,
  } = useCustomerEnumLabels();

  if (customers.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-ink-muted">
        {t("customers.emptyTable")}
      </div>
    );
  }

  return (
    <ResponsiveTable className={className}>
      <thead>
        <tr className={tableHeadRowClass}>
          <th className={tableThClass}>{t("customers.table.name")}</th>
          <th className={tableThClass}>{t("customers.table.ageGroup")}</th>
          <th className={tableThClass}>{t("customers.table.gender")}</th>
          <th className={tableThClass}>{t("customers.table.customerType")}</th>
          <th className={tableThClass}>
            {t("customers.table.productCategory")}
          </th>
          {(onEdit || onDelete) && (
            <th className={tableThClass}>{t("common.actions")}</th>
          )}
        </tr>
      </thead>
      <tbody>
        {customers.map((customer) => {
          const type =
            customer.customerType && isCustomerType(customer.customerType)
              ? customer.customerType
              : null;
          const categories = sortPurchasedCategories(
            (customer.purchasedCategories ?? []).filter(isPurchasedCategory),
          );
          const ageRange =
            customer.customerAgeRange &&
            isCustomerAgeRange(customer.customerAgeRange)
              ? customer.customerAgeRange
              : null;
          const gender =
            customer.gender && isCustomerGender(customer.gender)
              ? customer.gender
              : null;

          return (
            <tr key={customer.id} className={tableBodyRowClass}>
              <TableCell label={t("customers.table.name")} layout="stack">
                {CUSTOMER_DETAIL_PAGE_ENABLED ? (
                  <Link
                    href={customer.href}
                    className="font-medium text-ink hover:text-primary"
                  >
                    {customer.fullName}
                  </Link>
                ) : (
                  <span className="font-medium text-ink">{customer.fullName}</span>
                )}
              </TableCell>
              <TableCell label={t("customers.table.ageGroup")}>
                {ageRange ? (
                  <span className="text-sm text-ink">{ageRangeLabel(ageRange)}</span>
                ) : (
                  <span className="text-sm text-ink-muted">—</span>
                )}
              </TableCell>
              <TableCell label={t("customers.table.gender")}>
                {gender ? (
                  <span className="text-sm text-ink">{genderLabel(gender)}</span>
                ) : (
                  <span className="text-sm text-ink-muted">—</span>
                )}
              </TableCell>
              <TableCell label={t("customers.table.customerType")}>
                {type ? (
                  <span className="text-sm text-ink">
                    {customerTypeLabel(type)}
                  </span>
                ) : (
                  <span className="text-sm text-ink-muted">—</span>
                )}
              </TableCell>
              <TableCell label={t("customers.table.productCategory")}>
                {categories.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((category) => (
                      <span
                        key={category}
                        className={cn(
                          "inline-flex rounded-sm border border-border bg-surface-elevated/60",
                          "px-2 py-0.5 text-xs text-ink-muted",
                        )}
                      >
                        {purchasedCategory(category)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-ink-muted">—</span>
                )}
              </TableCell>
              {(onEdit || onDelete) && (
                <TableCell label={t("common.actions")} layout="actions" className="py-3">
                  <div className="flex items-center gap-2">
                    {CUSTOMER_DETAIL_PAGE_ENABLED && (
                      <Link
                        href={customer.href}
                        className={buttonVariants({ variant: "ghost", size: "sm" })}
                      >
                        {t("common.view")}
                      </Link>
                    )}
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(customer)}
                        disabled={editingCustomerId === customer.id}
                        className={buttonVariants({ variant: "ghost", size: "sm" })}
                      >
                        {editingCustomerId === customer.id
                          ? t("common.loading")
                          : t("common.edit")}
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(customer)}
                        className={buttonVariants({
                          variant: "ghost",
                          size: "sm",
                          className: "text-error hover:text-error",
                        })}
                      >
                        {t("common.delete")}
                      </button>
                    )}
                  </div>
                </TableCell>
              )}
            </tr>
          );
        })}
      </tbody>
    </ResponsiveTable>
  );
}
