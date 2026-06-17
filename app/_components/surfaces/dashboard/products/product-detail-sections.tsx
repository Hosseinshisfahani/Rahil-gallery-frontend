"use client";

import { useState } from "react";
import { CatalogImage } from "@/_components/shared/catalog-image";
import { Button } from "@/_components/core/primitive/button";
import { Input } from "@/_components/core/primitive/input";
import { fieldPlaceholder } from "../abstract/form-placeholders";
import { formatPrice } from "@/lib/format";
import type { ProductDetail, ProductVariant } from "@/lib/api/products/types";
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
import {
  FeaturedBadge,
  JewelryTypeBadge,
  ProductAvailabilityBadge,
  ProductStatusBadge,
} from "./product-badges";
import { ModalShell } from "../customers/modal-shell";
import { useAdminT } from "../layout/admin-locale-provider";

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
        className={`mt-0.5 text-sm text-ink ${mono ? "font-mono text-ltr" : ""}`}
        dir={mono ? "ltr" : undefined}
      >
        {value}
      </dd>
    </div>
  );
}

export function ProductSummaryStrip({ product }: { product: ProductDetail }) {
  const { t } = useAdminT();

  return (
    <div className="grid gap-4 rounded-[var(--radius-lg)] border border-border bg-surface p-5 sm:grid-cols-2 lg:grid-cols-5">
      <DetailField label={t("products.detail.summarySku")} value={product.sku} mono />
      <DetailField label={t("products.detail.summaryCategory")} value={product.category} />
      <DetailField
        label={t("products.detail.summaryPrice")}
        value={formatPrice(product.priceFrom)}
      />
      <DetailField
        label={t("products.detail.summaryStatus")}
        value={<ProductStatusBadge status={product.status} />}
      />
      <DetailField
        label={t("products.detail.summaryAvailability")}
        value={<ProductAvailabilityBadge availability={product.availability} />}
      />
    </div>
  );
}

export function ProductIdentitySection({ product }: { product: ProductDetail }) {
  const { t } = useAdminT();

  return (
    <DashboardCard>
      <DashboardCardHeader>
        <DashboardCardTitle>{t("products.detail.productDetails")}</DashboardCardTitle>
        <DashboardCardDescription>
          {t("products.detail.productDetailsSubtitle")}
        </DashboardCardDescription>
      </DashboardCardHeader>
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DetailField label={t("products.detail.name")} value={product.name} />
        <DetailField label={t("products.detail.slug")} value={product.slug} mono />
        <DetailField
          label={t("products.detail.type")}
          value={<JewelryTypeBadge type={product.jewelryType} />}
        />
        <DetailField label={t("products.detail.gemstone")} value={product.gemstoneType} />
        <DetailField
          label={t("products.detail.metal")}
          value={product.metalType ?? t("common.notSpecified")}
        />
        <DetailField
          label={t("products.detail.karat")}
          value={product.karat ?? t("common.notSpecified")}
        />
        <DetailField
          label={t("products.detail.weight")}
          value={
            product.weightGrams
              ? `${product.weightGrams} g`
              : t("common.notSpecified")
          }
        />
        <DetailField
          label={t("products.detail.flags")}
          value={
            <span className="flex flex-wrap gap-2">
              {product.isFeatured && <FeaturedBadge />}
              {product.isHandmade && (
                <span className="text-xs text-ink-muted">
                  {t("products.detail.handmade")}
                </span>
              )}
              {!product.isFeatured && !product.isHandmade && t("common.notSpecified")}
            </span>
          }
        />
        <DetailField
          label={t("products.detail.updated")}
          value={new Date(product.updatedAt).toLocaleString()}
        />
      </dl>
      {(product.shortDescription || product.description) && (
        <div className="mt-6 space-y-3 border-t border-border/60 pt-4">
          {product.shortDescription && (
            <DetailField
              label={t("products.detail.shortDescription")}
              value={product.shortDescription}
            />
          )}
          {product.description && (
            <DetailField
              label={t("products.detail.description")}
              value={product.description}
            />
          )}
        </div>
      )}
    </DashboardCard>
  );
}

export function ProductVariantsSection({
  product,
  busy,
  onAddVariant,
  onAdjustInventory,
  onDeactivateVariant,
}: {
  product: ProductDetail;
  busy?: boolean;
  onAddVariant: (input: {
    sku: string;
    name: string;
    sizeLabel?: string;
    initialQuantity: number;
    lowStockThreshold: number;
    isDefault: boolean;
  }) => Promise<void>;
  onAdjustInventory: (
    variantId: string,
    quantity: number,
    lowStockThreshold: number,
  ) => Promise<void>;
  onDeactivateVariant: (variantId: string) => Promise<void>;
}) {
  const { t } = useAdminT();
  const [showAdd, setShowAdd] = useState(false);
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [sizeLabel, setSizeLabel] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [threshold, setThreshold] = useState("5");
  const [isDefault, setIsDefault] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd() {
    if (!sku.trim() || !name.trim()) {
      setError(t("products.detail.skuNameRequired"));
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onAddVariant({
        sku: sku.trim(),
        name: name.trim(),
        sizeLabel: sizeLabel.trim() || undefined,
        initialQuantity: Number(quantity) || 0,
        lowStockThreshold: Number(threshold) || 5,
        isDefault,
      });
      setShowAdd(false);
      setSku("");
      setName("");
      setSizeLabel("");
      setQuantity("0");
      setThreshold("5");
      setIsDefault(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("products.detail.addVariantFailed"),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardCard>
      <DashboardCardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <DashboardCardTitle>{t("products.detail.variantsTitle")}</DashboardCardTitle>
          <DashboardCardDescription>
            {t("products.detail.variantCount", { count: product.variants.length })}
          </DashboardCardDescription>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowAdd(true)}
          disabled={busy}
        >
          {t("products.detail.addVariant")}
        </Button>
      </DashboardCardHeader>

      {product.variants.length === 0 ? (
        <p className="text-sm text-ink-muted">{t("products.detail.noVariants")}</p>
      ) : (
        <ResponsiveTable>
          <thead>
            <tr className={tableHeadRowClass}>
              <th className={tableThClass}>{t("products.detail.variantLabel")}</th>
              <th className={tableThClass}>{t("products.detail.variantSku")}</th>
              <th className={tableThClass}>{t("products.detail.variantPrice")}</th>
              <th className={tableThClass}>{t("products.detail.variantStock")}</th>
              <th className={tableThClass}>{t("common.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {product.variants.map((variant) => (
              <VariantRow
                key={`${variant.id}-${variant.availableQuantity}-${variant.isActive}`}
                variant={variant}
                busy={busy}
                onAdjustInventory={onAdjustInventory}
                onDeactivate={onDeactivateVariant}
              />
            ))}
          </tbody>
        </ResponsiveTable>
      )}

      {showAdd && (
        <ModalShell
          title={t("products.detail.addVariant")}
          onClose={() => setShowAdd(false)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setShowAdd(false)} disabled={submitting}>
                {t("common.cancel")}
              </Button>
              <Button variant="primary" onClick={handleAdd} disabled={submitting || busy}>
                {submitting ? t("common.adding") : t("products.detail.addVariant")}
              </Button>
            </>
          }
        >
          {error && (
            <p className="mb-4 text-sm text-error" role="alert">
              {error}
            </p>
          )}
          <div className="flex flex-col gap-4">
            <div>
              <Input
                id="variant-sku"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder={fieldPlaceholder(t("products.detail.variantSku"), true)}
                aria-label={fieldPlaceholder(t("products.detail.variantSku"), true)}
                className="font-mono"
              />
            </div>
            <div>
              <Input
                id="variant-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={fieldPlaceholder(t("products.detail.variantName"), true)}
                aria-label={fieldPlaceholder(t("products.detail.variantName"), true)}
              />
            </div>
            <div>
              <Input
                id="variant-size"
                value={sizeLabel}
                onChange={(e) => setSizeLabel(e.target.value)}
                placeholder={fieldPlaceholder(t("products.detail.sizeLabel"))}
                aria-label={fieldPlaceholder(t("products.detail.sizeLabel"))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input
                  id="variant-qty"
                  type="number"
                  min={0}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder={fieldPlaceholder(t("products.detail.initialQuantity"))}
                  aria-label={fieldPlaceholder(t("products.detail.initialQuantity"))}
                />
              </div>
              <div>
                <Input
                  id="variant-threshold"
                  type="number"
                  min={0}
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  placeholder={fieldPlaceholder(t("products.detail.lowStockThreshold"))}
                  aria-label={fieldPlaceholder(t("products.detail.lowStockThreshold"))}
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="size-4 accent-primary"
              />
              {t("products.detail.defaultVariant")}
            </label>
          </div>
        </ModalShell>
      )}
    </DashboardCard>
  );
}

function VariantRow({
  variant,
  busy,
  onAdjustInventory,
  onDeactivate,
}: {
  variant: ProductVariant;
  busy?: boolean;
  onAdjustInventory: (
    variantId: string,
    quantity: number,
    lowStockThreshold: number,
  ) => Promise<void>;
  onDeactivate: (variantId: string) => Promise<void>;
}) {
  const { t } = useAdminT();
  const [quantity, setQuantity] = useState(String(variant.availableQuantity));
  const [threshold, setThreshold] = useState("5");
  const [saving, setSaving] = useState(false);

  async function handleSaveStock() {
    setSaving(true);
    try {
      await onAdjustInventory(
        variant.id,
        Number(quantity) || 0,
        Number(threshold) || 5,
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <tr
      className={`${tableBodyRowClass} ${!variant.isActive ? "opacity-50" : ""}`}
    >
      <TableCell label={t("products.detail.variantLabel")} layout="stack">
        {variant.name}
        {variant.sizeLabel && (
          <span className="ms-1 text-xs text-ink-muted">({variant.sizeLabel})</span>
        )}
        {variant.isDefault && (
          <span className="ms-2 text-xs text-accent">{t("common.default")}</span>
        )}
        {!variant.isActive && (
          <span className="ms-2 text-xs text-ink-muted">{t("common.inactive")}</span>
        )}
      </TableCell>
      <TableCell label={t("products.detail.variantSku")} className="font-mono text-xs text-ltr">
        <span dir="ltr">{variant.sku}</span>
      </TableCell>
      <TableCell label={t("products.detail.variantPrice")} className="tabular-nums">
        {formatPrice(variant.unitPrice)}
      </TableCell>
      <TableCell label={t("products.detail.variantStock")}>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-20"
            disabled={!variant.isActive || busy || saving}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSaveStock}
            disabled={!variant.isActive || busy || saving}
          >
            {saving ? "…" : t("common.set")}
          </Button>
        </div>
      </TableCell>
      <TableCell label={t("common.actions")} layout="actions" className="py-3">
        {variant.isActive && (
          <Button
            variant="ghost"
            size="sm"
            className="text-error hover:text-error"
            disabled={busy || saving}
            onClick={() => onDeactivate(variant.id)}
          >
            {t("common.deactivate")}
          </Button>
        )}
      </TableCell>
    </tr>
  );
}

export function ProductImagesSection({
  product,
  busy,
  onAddImage,
  onRemoveImage,
}: {
  product: ProductDetail;
  busy?: boolean;
  onAddImage: (url: string, altText?: string, isPrimary?: boolean) => Promise<void>;
  onRemoveImage: (imageId: string) => Promise<void>;
}) {
  const { t } = useAdminT();
  const [url, setUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd() {
    if (!url.trim()) {
      setError(t("products.detail.imageUrlRequired"));
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onAddImage(url.trim(), altText.trim() || undefined, isPrimary);
      setUrl("");
      setAltText("");
      setIsPrimary(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("products.detail.addImageFailed"),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardCard>
      <DashboardCardHeader>
        <DashboardCardTitle>{t("products.detail.imagesTitle")}</DashboardCardTitle>
        <DashboardCardDescription>
          {t("products.detail.imagesSubtitle")}
        </DashboardCardDescription>
      </DashboardCardHeader>

      {product.images.length > 0 ? (
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {product.images.map((image) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-[var(--radius-md)] border border-border"
            >
              <div className="relative aspect-square bg-surface-elevated">
                <CatalogImage
                  src={image.url}
                  alt={image.altText ?? product.name}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
              {image.isPrimary && (
                <span className="absolute start-2 top-2 rounded bg-scrim px-1.5 py-0.5 text-xs text-white">
                  {t("common.primary")}
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="absolute end-2 top-2 bg-surface/90 text-error opacity-0 transition-opacity group-hover:opacity-100"
                disabled={busy || submitting}
                onClick={() => onRemoveImage(image.id)}
              >
                {t("common.remove")}
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="mb-4 text-sm text-ink-muted">{t("products.detail.noImages")}</p>
      )}

      <div className="rounded-[var(--radius-md)] border border-border/60 bg-surface-elevated/40 p-4">
        <p className="mb-3 text-sm font-medium text-ink">
          {t("products.detail.addImageUrl")}
        </p>
        {error && (
          <p className="mb-3 text-sm text-error" role="alert">
            {error}
          </p>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <Input
              id="image-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={fieldPlaceholder(t("common.url"))}
              aria-label={fieldPlaceholder(t("common.url"))}
            />
          </div>
          <div className="min-w-0 flex-1">
            <Input
              id="image-alt"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder={fieldPlaceholder(t("products.detail.altText"))}
              aria-label={fieldPlaceholder(t("products.detail.altText"))}
            />
          </div>
          <label className="flex items-center gap-2 pb-2 text-sm">
            <input
              type="checkbox"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              className="size-4 accent-primary"
            />
            {t("common.primary")}
          </label>
          <Button
            variant="secondary"
            onClick={handleAdd}
            disabled={busy || submitting}
          >
            {submitting ? t("common.adding") : t("common.add")}
          </Button>
        </div>
      </div>
    </DashboardCard>
  );
}
