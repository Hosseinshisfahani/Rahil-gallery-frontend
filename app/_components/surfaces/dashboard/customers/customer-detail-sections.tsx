"use client";

import { cn } from "@/lib/utils";
import { isSignatureImage, signatureImageSrc } from "@/lib/signature-url";
import { useCustomerEnumLabels } from "@/lib/i18n/admin/use-customer-labels";
import {
  DashboardCard,
  DashboardCardDescription,
  DashboardCardHeader,
  DashboardCardTitle,
} from "../abstract/dashboard-card";
import type { CustomerDetail } from "@/lib/api/customers/types";
import { formatDateForAdmin } from "@/lib/jalali";
import type { AdminLocale } from "@/lib/admin-locale";
import { useAdminT } from "../layout/admin-locale-provider";

const EMPTY = "—";

function formatDate(iso: string, locale: AdminLocale): string {
  return formatDateForAdmin(iso, locale, { dateStyle: "long" });
}

function isEmptyValue(value: React.ReactNode): boolean {
  return (
    value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  );
}

function ProfileTableRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <tr className="profile-details-row">
      <th scope="row">{label}</th>
      <td>
        {isEmptyValue(value) ? (
          <span className="text-ink-muted">{EMPTY}</span>
        ) : (
          <span className={cn(mono && "font-mono text-ltr")} dir={mono ? "ltr" : undefined}>
            {value}
          </span>
        )}
      </td>
    </tr>
  );
}

function ProfileSectionRow({ title }: { title: string }) {
  return (
    <tr className="profile-details-section">
      <td colSpan={2}>{title}</td>
    </tr>
  );
}

function ProfileTable({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { t } = useAdminT();
  const showHeader = Boolean(title);

  return (
    <DashboardCard
      padding={showHeader ? "md" : "none"}
      className={cn("overflow-hidden hover:shadow-sm", className)}
    >
      {showHeader ? (
        <DashboardCardHeader className="mb-0 border-b border-border/60 pb-4">
          <div>
            <DashboardCardTitle>{title}</DashboardCardTitle>
            {description ? (
              <DashboardCardDescription className="mt-1">{description}</DashboardCardDescription>
            ) : null}
          </div>
        </DashboardCardHeader>
      ) : null}
      <div className={cn("profile-details-table", showHeader && "border-t border-border/60")}>
        <table>
          <thead className="sr-only">
            <tr>
              <th scope="col">{t("customers.profile.fieldColumn")}</th>
              <th scope="col">{t("customers.profile.valueColumn")}</th>
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </DashboardCard>
  );
}

export function CustomerProfileHero({
  customer,
  className,
}: {
  customer: CustomerDetail;
  className?: string;
}) {
  const { customerType } = useCustomerEnumLabels();
  const { t } = useAdminT();

  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-border/70 bg-gradient-to-b from-surface-elevated/50 to-surface px-5 py-5 sm:px-6",
        className,
      )}
    >
      <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
        {customer.fullName}
      </h2>
      <div className="mt-3 flex flex-col gap-1.5 text-sm text-ink-muted sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">
        <span className="font-mono text-ltr text-ink" dir="ltr">
          {customer.phone}
        </span>
        {customer.email ? (
          <span className="text-ltr" dir="ltr">
            {customer.email}
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-xs font-medium uppercase tracking-wide text-ink-subtle">
        {customerType(customer.customerType)}
      </p>
    </div>
  );
}

export function CustomerProfileTable({
  customer,
  className,
}: {
  customer: CustomerDetail;
  className?: string;
}) {
  const { t, locale } = useAdminT();
  const { customerType, purchasedCategory, ageRange, gender } = useCustomerEnumLabels();

  const purchasedCategoryText =
    customer.purchasedCategories.length > 0
      ? customer.purchasedCategories.map((category) => purchasedCategory(category)).join(" · ")
      : null;

  return (
    <ProfileTable className={className}>
      <ProfileSectionRow title={t("customers.profile.sections.account")} />
      <ProfileTableRow
        label={t("customers.fields.registrationDate")}
        value={formatDate(customer.createdAt, locale)}
      />
      <ProfileTableRow label={t("customers.fields.job")} value={customer.job} />
      <ProfileTableRow label={t("customers.fields.address")} value={customer.address} />
      <ProfileTableRow label={t("customers.fields.melliCode")} value={customer.melliCode} mono />
      <ProfileTableRow label={t("customers.fields.postalCode")} value={customer.postalCode} mono />

      <ProfileSectionRow title={t("customers.profile.sections.crm")} />
      <ProfileTableRow
        label={t("customers.table.ageGroup")}
        value={customer.customerAgeRange ? ageRange(customer.customerAgeRange) : null}
      />
      <ProfileTableRow
        label={t("customers.table.gender")}
        value={customer.gender ? gender(customer.gender) : null}
      />
      <ProfileTableRow
        label={t("customers.table.customerType")}
        value={customer.customerType ? customerType(customer.customerType) : null}
      />
      <ProfileTableRow
        label={t("customers.table.productCategory")}
        value={purchasedCategoryText}
      />
      <ProfileTableRow
        label={t("customers.fields.birthday")}
        value={customer.birthday ? formatDate(customer.birthday, locale) : null}
      />
      <ProfileTableRow
        label={t("customers.fields.marriageDate")}
        value={customer.marriageDate ? formatDate(customer.marriageDate, locale) : null}
      />
      <ProfileTableRow
        label={t("customers.fields.importantDate")}
        value={customer.importantDate ? formatDate(customer.importantDate, locale) : null}
      />
      <ProfileTableRow
        label={t("customers.fields.firstVisit")}
        value={customer.firstVisitDate ? formatDate(customer.firstVisitDate, locale) : null}
      />
      <ProfileTableRow label={t("customers.fields.description")} value={customer.description} />
      <ProfileTableRow label={t("customers.fields.marketerNote")} value={customer.marketerNote} />
    </ProfileTable>
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
  const { customerType, purchasedCategory, ageRange, gender } = useCustomerEnumLabels();
  const profile = customer.importProfile;
  if (!profile) {
    return null;
  }

  const signatureValue = customer.signatureUrl ?? profile.signature;
  const purchasedCategoryText =
    profile.purchasedCategories.length > 0
      ? profile.purchasedCategories.map((category) => purchasedCategory(category)).join(" · ")
      : null;

  return (
    <ProfileTable
      title={t("customers.profile.importedTitle")}
      description={t("customers.profile.importedDescription")}
      className={className}
    >
      <ProfileSectionRow title={t("customers.profile.sections.personal")} />
      <ProfileTableRow label={t("customers.fields.firstName")} value={profile.firstName} />
      <ProfileTableRow label={t("customers.fields.lastName")} value={profile.lastName} />
      <ProfileTableRow label={t("customers.fields.job")} value={profile.job} />
      <ProfileTableRow label={t("customers.fields.phone")} value={profile.phone} mono />
      <ProfileTableRow label={t("customers.fields.email")} value={profile.email} />
      <ProfileTableRow label={t("customers.fields.address")} value={profile.address} />
      <ProfileTableRow label={t("customers.fields.melliCode")} value={profile.melliCode} mono />
      <ProfileTableRow label={t("customers.fields.postalCode")} value={profile.postalCode} mono />
      <ProfileTableRow
        label={t("customers.fields.gender")}
        value={profile.gender ? gender(profile.gender) : null}
      />

      <ProfileSectionRow title={t("customers.profile.sections.dates")} />
      <ProfileTableRow
        label={t("customers.fields.birthday")}
        value={profile.birthday ? formatDate(profile.birthday, locale) : null}
      />
      <ProfileTableRow
        label={t("customers.fields.marriageDate")}
        value={profile.marriageDate ? formatDate(profile.marriageDate, locale) : null}
      />
      <ProfileTableRow
        label={t("customers.fields.importantDate")}
        value={profile.importantDate ? formatDate(profile.importantDate, locale) : null}
      />
      <ProfileTableRow
        label={t("customers.fields.firstVisit")}
        value={profile.firstVisitDate ? formatDate(profile.firstVisitDate, locale) : null}
      />

      <ProfileSectionRow title={t("customers.profile.sections.crm")} />
      <ProfileTableRow
        label={t("customers.fields.customerType")}
        value={customerType(profile.customerType)}
      />
      <ProfileTableRow
        label={t("customers.fields.ageRange")}
        value={profile.customerAgeRange ? ageRange(profile.customerAgeRange) : null}
      />
      <ProfileTableRow
        label={t("customers.fields.purchasedCategories")}
        value={purchasedCategoryText}
      />

      <ProfileSectionRow title={t("customers.profile.sections.notes")} />
      <ProfileTableRow label={t("customers.fields.description")} value={profile.description} />
      <ProfileTableRow label={t("customers.fields.marketerNote")} value={profile.marketerNote} />
      <ProfileTableRow
        label={t("customers.fields.signature")}
        value={
          signatureValue ? (
            isSignatureImage(signatureValue) ? (
              // eslint-disable-next-line @next/next/no-img-element -- same-origin uploaded signatures
              <img
                src={signatureImageSrc(signatureValue)}
                alt={t("customers.fields.signature")}
                className="max-h-28 rounded-[var(--radius-sm)] border border-border/60 bg-surface object-contain p-2"
              />
            ) : (
              <span className="font-serif italic">{signatureValue}</span>
            )
          ) : null
        }
      />
    </ProfileTable>
  );
}
