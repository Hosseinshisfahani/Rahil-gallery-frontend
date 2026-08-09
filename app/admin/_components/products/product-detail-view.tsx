"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { DashboardSectionTitle } from "@/components/admin/ui/dashboard-card";
import {
  FeaturedBadge,
  ProductStatusBadge,
} from "./product-badges";
import {
  ProductFormFields,
  productFormValuesToInput,
  validateProductForm,
  type ProductFormValues,
} from "./product-forms";
import {
  ProductIdentitySection,
  ProductImagesSection,
  ProductSummaryStrip,
  ProductVariantsSection,
} from "./product-detail-sections";
import { ArchiveProductModal } from "./product-modals";
import { useProductDetail } from "./use-products";
import { useAdminT } from "../layout/admin-locale-provider";
import type { ProductDetail } from "@/lib/api/products/types";

type DetailTab = "overview" | "variants" | "images";

function productToFormValues(product: ProductDetail): ProductFormValues {
  return {
    categoryId: product.categoryId,
    sku: product.sku,
    name: product.name,
    slug: product.slug,
    jewelryType: product.jewelryType,
    status: product.status,
    basePrice: String(product.basePrice),
    compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "",
    gemstoneType: product.gemstoneType,
    metalType: product.metalType ?? "",
    karat: product.karat ? String(product.karat) : "",
    weightGrams: product.weightGrams ? String(product.weightGrams) : "",
    description: product.description ?? "",
    shortDescription: product.shortDescription ?? "",
    isHandmade: product.isHandmade,
    isFeatured: product.isFeatured,
  };
}

export interface ProductDetailViewProps {
  productId: string;
}

export function ProductDetailView({ productId }: ProductDetailViewProps) {
  const router = useRouter();
  const { t } = useAdminT();

  const tabs: { id: DetailTab; label: string }[] = [
    { id: "overview", label: t("products.tabs.overview") },
    { id: "variants", label: t("products.tabs.variants") },
    { id: "images", label: t("products.tabs.images") },
  ];
  const {
    product,
    categories,
    loading,
    error,
    mutating,
    refetch,
    update,
    archive,
    addVariant,
    adjustInventory,
    deactivateVariant,
    addImage,
    removeImage,
  } = useProductDetail(productId);

  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [editing, setEditing] = useState(false);
  const [formValues, setFormValues] = useState<ProductFormValues | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [showArchive, setShowArchive] = useState(false);

  if (loading && !product) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="rounded-[var(--radius-md)] border border-error/30 bg-error/5 p-6">
        <p className="font-medium text-error">{error ?? t("products.notFound")}</p>
        <div className="mt-4 flex gap-3">
          <Link href="/admin/products" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            {t("common.backToList")}
          </Link>
          <Button variant="outline" size="sm" onClick={refetch}>
            {t("common.retry")}
          </Button>
        </div>
      </div>
    );
  }

  async function handleSave() {
    if (!formValues) return;
    const validationError = validateProductForm(formValues, t);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError(null);
    try {
      await update(productFormValuesToInput(formValues));
      setEditing(false);
      setFormValues(null);
      router.refresh();
    } catch {
      // error surfaced by hook
    }
  }

  async function handleArchive() {
    await archive();
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/admin/products"
            className="mb-2 inline-block text-xs text-ink-muted hover:text-primary"
          >
            {t("products.backToProducts")}
          </Link>
          <DashboardSectionTitle title={product.name} subtitle={product.sku} />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <ProductStatusBadge status={product.status} />
            {product.isFeatured && <FeaturedBadge />}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {!editing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFormValues(productToFormValues(product));
                  setEditing(true);
                  setActiveTab("overview");
                }}
              >
                {t("products.editProduct")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-error hover:text-error"
                onClick={() => setShowArchive(true)}
              >
                {t("common.archive")}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditing(false);
                  setFormValues(null);
                  setFormError(null);
                }}
                disabled={mutating}
              >
                {t("common.cancel")}
              </Button>
              <Button variant="default" size="sm" onClick={handleSave} disabled={mutating}>
                {mutating ? t("common.saving") : t("common.saveChanges")}
              </Button>
            </>
          )}
        </div>
      </div>

      {error && (
        <p
          className="rounded-[var(--radius-md)] border border-error/30 bg-error/5 px-4 py-3 text-sm text-error"
          role="alert"
        >
          {error}
        </p>
      )}

      <ProductSummaryStrip product={product} />

      <nav
        className="flex gap-1 overflow-x-auto border-b border-border"
        aria-label={t("products.detail.sectionsAria")}
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
            {tab.id === "variants" && product.variants.length > 0 && (
              <span className="ms-1.5 rounded-full bg-surface-elevated px-1.5 text-xs">
                {product.variants.length}
              </span>
            )}
            {tab.id === "images" && product.images.length > 0 && (
              <span className="ms-1.5 rounded-full bg-surface-elevated px-1.5 text-xs">
                {product.images.length}
              </span>
            )}
          </button>
        ))}
      </nav>

      {activeTab === "overview" && (
        <>
          {editing && formValues ? (
            <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-6">
              {formError && (
                <p className="mb-4 text-sm text-error" role="alert">
                  {formError}
                </p>
              )}
              <ProductFormFields
                values={formValues}
                onChange={setFormValues}
                categories={categories}
                idPrefix="edit-product"
                slugEditable
              />
            </div>
          ) : (
            <ProductIdentitySection product={product} />
          )}
        </>
      )}

      {activeTab === "variants" && (
        <ProductVariantsSection
          product={product}
          busy={mutating}
          onAddVariant={async (input) => {
            await addVariant(input);
            router.refresh();
          }}
          onAdjustInventory={async (variantId, quantity, lowStockThreshold) => {
            await adjustInventory(variantId, { quantity, lowStockThreshold });
            router.refresh();
          }}
          onDeactivateVariant={async (variantId) => {
            await deactivateVariant(variantId);
            router.refresh();
          }}
        />
      )}

      {activeTab === "images" && (
        <ProductImagesSection
          product={product}
          busy={mutating}
          onAddImage={async (url, altText, isPrimary) => {
            await addImage({ url, altText, isPrimary });
            router.refresh();
          }}
          onRemoveImage={async (imageId) => {
            await removeImage(imageId);
            router.refresh();
          }}
        />
      )}

      {showArchive && (
        <ArchiveProductModal
          productName={product.name}
          onClose={() => setShowArchive(false)}
          onConfirm={handleArchive}
        />
      )}
    </div>
  );
}
