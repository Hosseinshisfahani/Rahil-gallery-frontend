"use client";

import { useMemo } from "react";
import type {
  CustomerAgeRange,
  CustomerGender,
  CustomerType,
  PurchasedCategory,
} from "@/lib/api/customers/types";
import { useAdminT } from "@/app/admin/_components/layout/admin-locale-provider";

export function useCustomerEnumLabels() {
  const { t } = useAdminT();

  return useMemo(
    () => ({
      customerType: (type: CustomerType) => t(`customers.types.${type}`),
      purchasedCategory: (cat: PurchasedCategory) => t(`customers.categories.${cat}`),
      gender: (g: CustomerGender) => t(`customers.genders.${g}`),
      ageRange: (range: CustomerAgeRange) =>
        range === "40+" ? t("common.yearsPlus") : t("common.years", { range }),
    }),
    [t],
  );
}

export type CustomerEnumLabels = ReturnType<typeof useCustomerEnumLabels>;
