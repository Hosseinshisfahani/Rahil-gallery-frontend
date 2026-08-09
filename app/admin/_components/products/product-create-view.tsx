"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { DashboardSectionTitle } from "@/components/admin/ui/dashboard-card";
import {
  ProductFormFields,
  emptyProductForm,
  productFormValuesToInput,
  validateProductForm,
  type ProductFormValues,
} from "./product-forms";
import { listCategories, createProduct } from "@/lib/api/products";
import type { Category } from "@/lib/api/products/types";
import { useAdminT } from "../layout/admin-locale-provider";

export function ProductCreateView() {
  const router = useRouter();
  const { t } = useAdminT();
  const [values, setValues] = useState(emptyProductForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    listCategories(controller.signal)
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setLoadingCategories(false));
    return () => controller.abort();
  }, []);

  async function handleSubmit() {
    const validationError = validateProductForm(values, t);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const created = await createProduct(productFormValuesToInput(values));
      router.push(created.href);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("products.createFailed"));
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingCategories) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          href="/admin/products"
          className="mb-2 inline-block text-xs text-ink-muted hover:text-primary"
        >
          {t("products.backToProducts")}
        </Link>
        <DashboardSectionTitle
          title={t("products.newProduct")}
          subtitle={t("products.newProductSubtitle")}
        />
      </div>

      {error && (
        <p
          className="rounded-[var(--radius-md)] border border-error/30 bg-error/5 px-4 py-3 text-sm text-error"
          role="alert"
        >
          {error}
        </p>
      )}

      <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-6">
        <ProductFormFields
          values={values}
          onChange={setValues}
          categories={categories}
          idPrefix="create-product"
        />

        <div className="mt-6 flex justify-end gap-3 border-t border-border/60 pt-6">
          <Link
            href="/admin/products"
            className={buttonVariants({ variant: "ghost" })}
          >
            {t("common.cancel")}
          </Link>
          <Button variant="default" onClick={handleSubmit} disabled={submitting}>
            {submitting ? t("products.creating") : t("products.createProduct")}
          </Button>
        </div>
      </div>
    </div>
  );
}
