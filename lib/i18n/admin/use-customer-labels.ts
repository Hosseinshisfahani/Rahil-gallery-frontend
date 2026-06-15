"use client";

import { useMemo } from "react";
import type { BlockReasonCode, CustomerAgeRange, CustomerGender, CustomerTag, CustomerType, PurchasedCategory } from "@/_components/surfaces/dashboard/data/mock-customers";
import { useAdminT } from "@/_components/surfaces/dashboard/layout/admin-locale-provider";

export function useCustomerEnumLabels() {
  const { t } = useAdminT();

  return useMemo(
    () => ({
      blockReason: (code: BlockReasonCode) => t(`customers.blockReasons.${code}`),
      customerType: (type: CustomerType) => t(`customers.types.${type}`),
      purchasedCategory: (cat: PurchasedCategory) => t(`customers.categories.${cat}`),
      tag: (tag: CustomerTag) => {
        const map: Record<CustomerTag, string> = {
          VIP: t("customers.tags.vip"),
          "Bridal customer": t("customers.tags.bridal"),
          "High spender": t("customers.tags.highSpender"),
          "At-risk": t("customers.tags.atRisk"),
          "Influencer lead": t("customers.tags.influencerLead"),
        };
        return map[tag] ?? tag;
      },
      gender: (g: CustomerGender) => t(`customers.genders.${g}`),
      ageRange: (range: CustomerAgeRange) =>
        range === "40+" ? t("common.yearsPlus") : t("common.years", { range }),
      auditAction: (action: string) => {
        const key = `customers.audit.${action}`;
        const translated = t(key);
        return translated === key ? action : translated;
      },
      funnelPosition: (pos: string) => {
        const key = `customers.funnel.${pos}`;
        const translated = t(key);
        return translated === key ? pos : translated;
      },
    }),
    [t],
  );
}

export type CustomerEnumLabels = ReturnType<typeof useCustomerEnumLabels>;
