"use client";

import Link from "next/link";
import { buttonVariants } from "@/_components/core/config/variants";
import type { CustomerSummary } from "../data/mock-customers";
import {
  ResponsiveTable,
  TableCell,
  tableBodyRowClass,
  tableHeadRowClass,
  tableThClass,
} from "../abstract/responsive-table";
import { CustomerSegmentBadge, CustomerStatusBadge, VipBadge } from "./customer-badges";
import { useAdminT } from "../layout/admin-locale-provider";

export interface CustomersTableProps {
  customers: CustomerSummary[];
  onDelete?: (customer: CustomerSummary) => void;
  className?: string;
}

export function CustomersTable({
  customers,
  onDelete,
  className,
}: CustomersTableProps) {
  const { t } = useAdminT();

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
          <th className={tableThClass}>{t("customers.table.phone")}</th>
          <th className={tableThClass}>{t("customers.table.segment")}</th>
          <th className={tableThClass}>{t("common.status")}</th>
          {onDelete && <th className={tableThClass}>{t("common.actions")}</th>}
        </tr>
      </thead>
      <tbody>
        {customers.map((customer) => (
          <tr key={customer.id} className={tableBodyRowClass}>
            <TableCell label={t("customers.table.name")} layout="stack">
              <Link
                href={customer.href}
                className="font-medium text-ink hover:text-primary"
              >
                {customer.fullName}
              </Link>
              {customer.isVip && (
                <span className="ms-2 inline-block align-middle">
                  <VipBadge />
                </span>
              )}
            </TableCell>
            <TableCell
              label={t("customers.table.phone")}
              className="font-mono text-xs text-ltr"
            >
              <span dir="ltr">{customer.phone}</span>
            </TableCell>
            <TableCell label={t("customers.table.segment")}>
              <CustomerSegmentBadge segment={customer.segment} />
            </TableCell>
            <TableCell label={t("common.status")}>
              <CustomerStatusBadge status={customer.status} />
            </TableCell>
            {onDelete && (
              <TableCell label={t("common.actions")} layout="actions" className="py-3">
                <div className="flex items-center gap-2">
                  <Link
                    href={customer.href}
                    className={buttonVariants({ variant: "ghost", size: "sm" })}
                  >
                    {t("common.view")}
                  </Link>
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
                </div>
              </TableCell>
            )}
          </tr>
        ))}
      </tbody>
    </ResponsiveTable>
  );
}
