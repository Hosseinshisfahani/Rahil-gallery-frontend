"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { isSignatureImage, signatureImageSrc } from "@/lib/signature-url";
import { useCustomerEnumLabels } from "@/lib/i18n/admin/use-customer-labels";
import { Badge } from "@/_components/core/primitive/badge";
import { StatusBadge, type OrderStatus } from "@/_components/shared/inclusive/status-badge";
import {
  DashboardCard,
  DashboardCardDescription,
  DashboardCardHeader,
  DashboardCardTitle,
} from "../abstract/dashboard-card";
import {
  ResponsiveTable,
  TableCell,
  tableBodyRowClass,
  tableHeadRowClass,
  tableThClass,
} from "../abstract/responsive-table";
import type {
  SavedListView,
  SegmentSummary,
} from "@/lib/api/customers/saved-views";
import type {
  AuditLogEntry,
  BlockReasonCode,
  CustomerDetail,
  CustomerNote,
} from "../data/mock-customers";
import {
  CustomerSegmentBadge,
  CustomerStatusBadge,
  VipBadge,
} from "./customer-badges";
import { formatDateForAdmin } from "@/lib/jalali";
import type { AdminLocale } from "@/lib/admin-locale";
import { useAdminT } from "../layout/admin-locale-provider";

const EMPTY = "—";

function formatDate(iso: string, locale: AdminLocale): string {
  return formatDateForAdmin(iso, locale, { dateStyle: "long" });
}

function formatDateTime(iso: string, locale: AdminLocale): string {
  return formatDateForAdmin(iso, locale, { dateStyle: "long", includeTime: true });
}

function DetailField({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs font-medium text-ink-muted">{label}</dt>
      <dd
        className={mono ? "mt-0.5 font-mono text-sm text-ltr" : "mt-0.5 text-sm text-ink"}
        dir={mono ? "ltr" : undefined}
      >
        {value}
      </dd>
    </div>
  );
}

/** Key list-table fields shown at the top of the customer profile page. */
export function CustomerProfileSummary({
  customer,
  className,
}: {
  customer: CustomerDetail;
  className?: string;
}) {
  const { t, locale } = useAdminT();
  const { tag: tagLabel } = useCustomerEnumLabels();

  return (
    <dl
      className={`grid gap-4 rounded-[var(--radius-lg)] border border-border bg-surface-elevated/40 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 ${className ?? ""}`}
    >
      <DetailField label={t("customers.fields.userId")} value={customer.id} mono />
      <DetailField
        label={t("customers.fields.registered")}
        value={formatDate(customer.registeredAt, locale)}
      />
      <DetailField
        label={t("customers.fields.lastActivity")}
        value={formatDate(customer.lastActivityAt, locale)}
      />
      <DetailField label={t("customers.fields.totalOrders")} value={customer.totalOrders} />
      <DetailField
        label={t("customers.fields.ltv")}
        value={customer.totalLtv > 0 ? formatPrice(customer.totalLtv) : EMPTY}
      />
      <DetailField
        label={t("customers.fields.tags")}
        value={
          customer.tags.length > 0 ? (
            <div className="mt-0.5 flex flex-wrap gap-1.5">
              {customer.tags.map((tag) => (
                <Badge key={tag} variant="default" className="text-[10px]">
                  {tagLabel(tag)}
                </Badge>
              ))}
            </div>
          ) : (
            EMPTY
          )
        }
      />
    </dl>
  );
}

function OrderStatusDisplay({ status }: { status: string }) {
  const knownStatuses: OrderStatus[] = [
    "pending_payment",
    "cancelled",
    "paid",
    "confirmed",
    "in_production",
    "quality_check",
    "ready_to_ship",
    "shipped",
    "delivered",
    "return_requested",
    "return_approved",
    "return_rejected",
    "refunded",
  ];

  if (knownStatuses.includes(status as OrderStatus)) {
    return <StatusBadge status={status as OrderStatus} />;
  }

  return (
    <Badge variant="default" className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function CustomerIdentitySection({
  customer,
  className,
}: {
  customer: CustomerDetail;
  className?: string;
}) {
  const { t, locale } = useAdminT();
  const { blockReason } = useCustomerEnumLabels();

  return (
    <DashboardCard className={className}>
      <DashboardCardHeader>
        <div>
          <DashboardCardTitle>{t("customers.fields.identity")}</DashboardCardTitle>
          <DashboardCardDescription>
            {t("customers.fields.identitySubtitle")}
          </DashboardCardDescription>
        </div>
        <div className="flex flex-wrap gap-2">
          <CustomerStatusBadge status={customer.status} />
          {customer.isVip && <VipBadge />}
          <CustomerSegmentBadge segment={customer.segment} />
        </div>
      </DashboardCardHeader>
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DetailField label={t("customers.fields.fullName")} value={customer.fullName} />
        <DetailField label={t("customers.fields.phone")} value={customer.phone} mono />
        <DetailField label={t("customers.fields.email")} value={customer.email ?? EMPTY} />
        <DetailField label={t("customers.fields.userId")} value={customer.id} mono />
        <DetailField
          label={t("customers.fields.registrationDate")}
          value={formatDate(customer.registeredAt, locale)}
        />
        <DetailField
          label={t("customers.fields.lastActivity")}
          value={formatDate(customer.lastActivityAt, locale)}
        />
        <DetailField
          label={t("customers.fields.preferredLanguage")}
          value={
            customer.locale === "fa"
              ? t("customers.fields.localeFa")
              : t("customers.fields.localeEn")
          }
        />
        <DetailField
          label={t("customers.fields.defaultRingSize")}
          value={customer.defaultRingSize ?? EMPTY}
        />
        <DetailField label={t("customers.fields.country")} value={t("customers.fields.countryIran")} />
      </dl>
      {customer.status === "blocked" && customer.blockReason && (
        <div className="mt-4 rounded-[var(--radius-md)] border border-error/30 bg-error/5 p-4">
          <p className="text-sm font-medium text-error">
            {t("customers.fields.accountBlocked")}
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            {t("customers.fields.reasonLabel")} {blockReason(customer.blockReason)}
          </p>
          {customer.blockNote && (
            <p className="mt-1 text-sm text-ink">{customer.blockNote}</p>
          )}
        </div>
      )}
    </DashboardCard>
  );
}

export function CustomerImportProfileSection({
  customer,
  className,
}: {
  customer: CustomerDetail;
  className?: string;
}) {
  const { t, locale } = useAdminT();
  const { customerType, purchasedCategory, ageRange } = useCustomerEnumLabels();
  const profile = customer.importProfile;
  if (!profile || customer.importMode !== "history_included") {
    return null;
  }

  return (
    <DashboardCard className={className}>
      <DashboardCardHeader>
        <div>
          <DashboardCardTitle>{t("customers.fields.importedProfile")}</DashboardCardTitle>
        </div>
        <Badge variant="accent">{t("customers.fields.historyIncluded")}</Badge>
      </DashboardCardHeader>

      <div className="flex flex-col gap-6">
        <div>
          <h4 className="mb-3 text-sm font-medium text-ink">
            {t("customers.fields.identityData")}
          </h4>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DetailField label={t("customers.fields.firstName")} value={profile.firstName} />
            <DetailField label={t("customers.fields.lastName")} value={profile.lastName} />
            <DetailField label={t("customers.fields.job")} value={profile.job ?? EMPTY} />
            <DetailField label={t("customers.fields.phone")} value={profile.phone} mono />
            <DetailField label={t("customers.fields.email")} value={profile.email ?? EMPTY} />
            <DetailField label={t("customers.fields.address")} value={profile.address ?? EMPTY} />
          </dl>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-medium text-ink">
            {t("customers.fields.importantDates")}
          </h4>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DetailField
              label={t("customers.fields.birthday")}
              value={profile.birthday ? formatDate(profile.birthday, locale) : EMPTY}
            />
            <DetailField
              label={t("customers.fields.marriageDate")}
              value={profile.marriageDate ? formatDate(profile.marriageDate, locale) : EMPTY}
            />
            <DetailField
              label={t("customers.fields.importantDate")}
              value={profile.importantDate ? formatDate(profile.importantDate, locale) : EMPTY}
            />
            <DetailField
              label={t("customers.fields.firstVisit")}
              value={profile.firstVisitDate ? formatDate(profile.firstVisitDate, locale) : EMPTY}
            />
          </dl>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-medium text-ink">
            {t("customers.fields.classification")}
          </h4>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DetailField
              label={t("customers.fields.customerType")}
              value={customerType(profile.customerType)}
            />
            <DetailField
              label={t("customers.fields.ageRange")}
              value={
                profile.customerAgeRange
                  ? ageRange(profile.customerAgeRange)
                  : EMPTY
              }
            />
            <DetailField
              label={t("customers.fields.purchasedCategories")}
              value={
                profile.purchasedCategories.length > 0 ? (
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {profile.purchasedCategories.map((cat) => (
                      <Badge key={cat} variant="default">
                        {purchasedCategory(cat)}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  EMPTY
                )
              }
            />
          </dl>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-medium text-ink">
            {t("customers.fields.experienceSignature")}
          </h4>
          <dl className="grid gap-4">
            <DetailField
              label={t("customers.fields.description")}
              value={profile.description ?? EMPTY}
            />
            <DetailField
              label={t("customers.fields.signature")}
              value={
                profile.signature ? (
                  isSignatureImage(profile.signature) ? (
                    // eslint-disable-next-line @next/next/no-img-element -- same-origin uploaded signatures
                    <img
                      src={signatureImageSrc(profile.signature)}
                      alt={t("customers.fields.signature")}
                      className="max-h-24 max-w-full object-contain"
                    />
                  ) : (
                    <span className="font-serif italic">{profile.signature}</span>
                  )
                ) : (
                  EMPTY
                )
              }
            />
          </dl>
        </div>
      </div>
    </DashboardCard>
  );
}

export function CustomerLifecycleSection({
  customer,
  className,
}: {
  customer: CustomerDetail;
  className?: string;
}) {
  const { t, locale } = useAdminT();

  return (
    <DashboardCard className={className}>
      <DashboardCardHeader>
        <div>
          <DashboardCardTitle>{t("customers.fields.lifecycle")}</DashboardCardTitle>
        </div>
      </DashboardCardHeader>
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DetailField
          label={t("customers.fields.totalSpend")}
          value={
            customer.totalLtv > 0 ? formatPrice(customer.totalLtv) : EMPTY
          }
        />
        <DetailField label={t("customers.fields.totalOrders")} value={customer.totalOrders} />
        <DetailField
          label={t("customers.fields.avgOrderValue")}
          value={
            customer.averageOrderValue > 0
              ? formatPrice(customer.averageOrderValue)
              : EMPTY
          }
        />
        <DetailField
          label={t("customers.fields.firstPurchase")}
          value={
            customer.firstPurchaseDate
              ? formatDate(customer.firstPurchaseDate, locale)
              : EMPTY
          }
        />
        <DetailField
          label={t("customers.fields.lastPurchase")}
          value={
            customer.lastPurchaseDate
              ? formatDate(customer.lastPurchaseDate, locale)
              : EMPTY
          }
        />
        <DetailField
          label={t("customers.fields.vipStatus")}
          value={
            customer.isVip
              ? t("customers.fields.vipYesManual")
              : t("common.no")
          }
        />
        <DetailField
          label={t("customers.table.segment")}
          value={<CustomerSegmentBadge segment={customer.segment} />}
        />
        <DetailField
          label={t("customers.fields.repeatRate")}
          value={`${customer.repeatPurchaseRate}%`}
        />
        <DetailField
          label={t("customers.fields.purchaseFrequency")}
          value={`${customer.purchaseFrequency}${t("common.perYear")}`}
        />
      </dl>
    </DashboardCard>
  );
}

export function CustomerBehaviorSection({
  customer,
  className,
}: {
  customer: CustomerDetail;
  className?: string;
}) {
  const { t } = useAdminT();
  const { funnelPosition } = useCustomerEnumLabels();

  return (
    <DashboardCard className={className}>
      <DashboardCardHeader>
        <div>
          <DashboardCardTitle>{t("customers.fields.behavior")}</DashboardCardTitle>
        </div>
        <div className="text-end">
          <p className="text-xs text-ink-muted">{t("customers.fields.engagementScore")}</p>
          <p className="text-2xl font-semibold text-ink">
            {customer.engagementScore}
            <span className="text-sm font-normal text-ink-muted">/100</span>
          </p>
        </div>
      </DashboardCardHeader>
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h4 className="mb-3 text-sm font-medium text-ink">
            {t("customers.fields.mostPurchased")}
          </h4>
          {customer.topCategories.length > 0 ? (
            <ul className="space-y-2">
              {customer.topCategories.map((cat) => (
                <li key={cat.category} className="flex items-center gap-3">
                  <span className="w-24 text-sm text-ink">{cat.category}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-elevated">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                  <span className="w-10 text-end text-xs tabular-nums text-ink-muted">
                    {cat.percentage}%
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-muted">{t("customers.fields.noPurchaseData")}</p>
          )}
        </div>
        <dl className="grid gap-3 sm:grid-cols-2">
          <DetailField label={t("customers.fields.wishlistItems")} value={customer.wishlistCount} />
          <DetailField
            label={t("customers.fields.wishlistAdditions")}
            value={customer.wishlistAdditions}
          />
          <DetailField
            label={t("customers.fields.wishlistRemovals")}
            value={customer.wishlistRemovals}
          />
          <DetailField
            label={t("customers.fields.wishlistToPurchase")}
            value={`${customer.wishlistConversionRate}%`}
          />
          <DetailField
            label={t("customers.fields.cartAbandonments")}
            value={customer.cartAbandonmentCount}
          />
          <DetailField
            label={t("customers.fields.configuratorSessions")}
            value={customer.configuratorUsageCount}
          />
          <DetailField
            label={t("customers.fields.funnelPosition")}
            value={funnelPosition(customer.funnelPosition)}
          />
        </dl>
      </div>
    </DashboardCard>
  );
}

export function CustomerOrdersSection({
  customer,
  className,
}: {
  customer: CustomerDetail;
  className?: string;
}) {
  const { t, locale } = useAdminT();

  return (
    <DashboardCard className={className}>
      <DashboardCardHeader>
        <div>
          <DashboardCardTitle>{t("abstract.orderHistory")}</DashboardCardTitle>
        </div>
      </DashboardCardHeader>
      {customer.orders.length === 0 ? (
        <p className="text-sm text-ink-muted">{t("abstract.noOrders")}</p>
      ) : (
        <ResponsiveTable>
          <thead>
            <tr className={tableHeadRowClass}>
              <th className={tableThClass}>{t("common.order")}</th>
              <th className={tableThClass}>{t("common.date")}</th>
              <th className={tableThClass}>{t("common.items")}</th>
              <th className={tableThClass}>{t("common.total")}</th>
              <th className={tableThClass}>{t("common.returns")}</th>
              <th className={tableThClass}>{t("common.status")}</th>
            </tr>
          </thead>
          <tbody>
            {customer.orders.map((order) => (
              <tr key={order.id} className={tableBodyRowClass}>
                <TableCell label={t("common.order")}>
                  <Link
                    href={order.href}
                    className="font-mono text-xs text-ink hover:text-primary"
                  >
                    {order.id}
                  </Link>
                </TableCell>
                <TableCell label={t("common.date")} className="text-ink-muted">
                  {formatDate(order.date, locale)}
                </TableCell>
                <TableCell label={t("common.items")} className="tabular-nums">
                  {order.itemCount}
                </TableCell>
                <TableCell label={t("common.total")} className="text-ltr tabular-nums">
                  <span dir="ltr">{formatPrice(order.total)}</span>
                </TableCell>
                <TableCell label={t("common.returns")}>
                  {order.hasReturn ? (
                    <Badge variant="warning">{t("abstract.returnBadge")}</Badge>
                  ) : (
                    <span className="text-ink-muted">{EMPTY}</span>
                  )}
                </TableCell>
                <TableCell label={t("common.status")} className="py-3">
                  <OrderStatusDisplay status={order.status} />
                </TableCell>
              </tr>
            ))}
          </tbody>
        </ResponsiveTable>
      )}
    </DashboardCard>
  );
}

export function CustomerWishlistSection({
  customer,
  className,
}: {
  customer: CustomerDetail;
  className?: string;
}) {
  const { t, locale } = useAdminT();

  return (
    <DashboardCard className={className}>
      <DashboardCardHeader>
        <div>
          <DashboardCardTitle>{t("abstract.wishlist")}</DashboardCardTitle>
        </div>
      </DashboardCardHeader>
      {customer.wishlist.length === 0 ? (
        <p className="text-sm text-ink-muted">{t("abstract.noWishlist")}</p>
      ) : (
        <ul className="divide-y divide-border/60">
          {customer.wishlist.map((item) => (
            <li key={item.id} className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-ink">{item.productName}</p>
                <p className="text-xs text-ink-muted">
                  {item.category}
                  {item.isConfiguration && (
                    <Badge variant="accent" className="ms-2">
                      {t("abstract.customConfig")}
                    </Badge>
                  )}
                </p>
                {item.configurationSummary && (
                  <p className="mt-1 text-xs text-ink-muted">
                    {item.configurationSummary}
                  </p>
                )}
              </div>
              <div className="text-end">
                <p className="text-sm font-medium text-ltr" dir="ltr">
                  {formatPrice(item.price)}
                </p>
                <p className="text-xs text-ink-muted">
                  {t("common.savedDate", { date: formatDate(item.savedAt, locale) })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}

export function CustomerNotesSection({
  notes,
  className,
}: {
  notes: CustomerNote[];
  className?: string;
}) {
  const { t, locale } = useAdminT();

  return (
    <DashboardCard className={className}>
      <DashboardCardHeader>
        <div>
          <DashboardCardTitle>{t("abstract.internalNotes")}</DashboardCardTitle>
        </div>
      </DashboardCardHeader>
      {notes.length === 0 ? (
        <p className="text-sm text-ink-muted">{t("abstract.noNotes")}</p>
      ) : (
        <ul className="space-y-4">
          {notes.map((note) => (
            <li
              key={note.id}
              className="rounded-[var(--radius-md)] border border-border/60 bg-surface-elevated/50 p-4"
            >
              <p className="text-sm text-ink">{note.body}</p>
              <p className="mt-2 text-xs text-ink-muted">
                {note.author} · {formatDateTime(note.createdAt, locale)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}

export function CustomerAuditLog({
  entries,
  className,
}: {
  entries: AuditLogEntry[];
  className?: string;
}) {
  const { t, locale } = useAdminT();
  const { auditAction, blockReason } = useCustomerEnumLabels();

  return (
    <DashboardCard className={className}>
      <DashboardCardHeader>
        <div>
          <DashboardCardTitle>{t("customers.audit.title")}</DashboardCardTitle>
        </div>
      </DashboardCardHeader>
      {entries.length === 0 ? (
        <p className="text-sm text-ink-muted">{t("customers.audit.noEntries")}</p>
      ) : (
        <ul className="space-y-3">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex flex-col gap-1 border-s-2 border-accent/40 ps-4"
            >
              <p className="text-sm font-medium text-ink">
                {auditAction(entry.action)}
              </p>
              {entry.details && (
                <p className="text-sm text-ink-muted">{entry.details}</p>
              )}
              {entry.reason && (
                <p className="text-xs text-ink-muted">
                  {t("customers.fields.reasonLabel")}{" "}
                  {blockReason(entry.reason as BlockReasonCode)}
                </p>
              )}
              <p className="text-xs text-ink-subtle">
                {entry.adminName} · {formatDateTime(entry.timestamp, locale)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}

export function SavedSegmentsPanel({
  segments,
  savedViews,
  loading = false,
  onApplyBuiltin,
  onApplySaved,
  className,
}: {
  segments: SegmentSummary[];
  savedViews: SavedListView[];
  loading?: boolean;
  onApplyBuiltin?: (segment: string) => void;
  onApplySaved?: (viewId: string) => void;
  className?: string;
}) {
  const { t, locale } = useAdminT();
  const dateLocale = locale === "fa" ? "fa-IR" : "en-US";

  return (
    <DashboardCard className={className}>
      <DashboardCardHeader>
        <div>
          <DashboardCardTitle>{t("customers.segments.title")}</DashboardCardTitle>
        </div>
      </DashboardCardHeader>

      {loading ? (
        <p className="text-sm text-ink-muted">{t("customers.segments.loading")}</p>
      ) : (
        <div className="flex flex-col gap-6">
          <div>
            <h4 className="mb-3 text-sm font-medium text-ink">
              {t("customers.segments.builtin")}
            </h4>
            <ul className="divide-y divide-border/60 rounded-[var(--radius-md)] border border-border/60">
              {segments.map((seg) => (
                <li key={seg.segment}>
                  <button
                    type="button"
                    onClick={() => onApplyBuiltin?.(seg.segment)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-start transition-colors hover:bg-surface-elevated/80"
                  >
                    <span className="font-medium text-ink">{seg.label}</span>
                    <span className="text-sm tabular-nums text-ink-muted">
                      {seg.count.toLocaleString(dateLocale)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {savedViews.length > 0 && (
            <div>
              <h4 className="mb-3 text-sm font-medium text-ink">
                {t("customers.segments.saved")}
              </h4>
              <ul className="divide-y divide-border/60 rounded-[var(--radius-md)] border border-border/60">
                {savedViews.map((view) => (
                  <li key={view.id}>
                    <button
                      type="button"
                      onClick={() => onApplySaved?.(view.id)}
                      className="flex w-full flex-col gap-1 px-4 py-3 text-start transition-colors hover:bg-surface-elevated/80 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-medium text-ink">{view.name}</p>
                        <p className="text-xs text-ink-muted capitalize">
                          {t("common.filterPreset", { type: view.viewType })}
                        </p>
                      </div>
                      <p className="text-xs text-ink-muted">
                        {t("common.updatedDate", {
                          date: formatDateForAdmin(view.updatedAt, locale, {
                            dateStyle: "short",
                          }),
                        })}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </DashboardCard>
  );
}
