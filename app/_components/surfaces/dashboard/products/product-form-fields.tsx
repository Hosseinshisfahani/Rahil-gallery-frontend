"use client";

import { Input } from "@/_components/core/primitive/input";
import { DashboardSelect, DashboardSelectOption } from "../abstract/dashboard-select";
import { fieldPlaceholder } from "../abstract/form-placeholders";
import { Textarea } from "@/_components/core/primitive/textarea";
import type { Category } from "@/lib/api/products/types";
import type {
  GemstoneType,
  JewelryType,
  MetalType,
  ProductStatus,
} from "@/lib/api/products/types";
import { useAdminT } from "../layout/admin-locale-provider";

const jewelryTypes: JewelryType[] = [
  "ring",
  "necklace",
  "bracelet",
  "earring",
  "pendant",
  "anklet",
  "brooch",
  "set",
  "other",
];

const metalOptions: { value: MetalType | ""; labelKey: string }[] = [
  { value: "", labelKey: "products.form.notSpecified" },
  { value: "gold_yellow", labelKey: "products.form.metals.yellow_gold" },
  { value: "gold_white", labelKey: "products.form.metals.white_gold" },
  { value: "gold_rose", labelKey: "products.form.metals.rose_gold" },
  { value: "silver", labelKey: "products.form.metals.silver" },
  { value: "platinum", labelKey: "products.form.metals.platinum" },
  { value: "titanium", labelKey: "products.form.metals.titanium" },
  { value: "mixed", labelKey: "products.form.metals.mixed" },
  { value: "other", labelKey: "products.form.gemstones.other" },
];

const gemstoneOptions: { value: GemstoneType; labelKey: string }[] = [
  { value: "none", labelKey: "products.form.gemstones.none" },
  { value: "diamond", labelKey: "products.form.gemstones.diamond" },
  { value: "ruby", labelKey: "products.form.gemstones.ruby" },
  { value: "sapphire", labelKey: "products.form.gemstones.sapphire" },
  { value: "emerald", labelKey: "products.form.gemstones.emerald" },
  { value: "pearl", labelKey: "products.form.gemstones.pearl" },
  { value: "turquoise", labelKey: "products.form.gemstones.turquoise" },
  { value: "amethyst", labelKey: "products.form.gemstones.amethyst" },
  { value: "mixed", labelKey: "products.form.gemstones.mixed" },
  { value: "other", labelKey: "products.form.gemstones.other" },
];

export interface ProductFormValues {
  categoryId: string;
  sku: string;
  name: string;
  slug: string;
  jewelryType: JewelryType;
  status: ProductStatus;
  basePrice: string;
  compareAtPrice: string;
  gemstoneType: GemstoneType;
  metalType: MetalType | "";
  karat: string;
  weightGrams: string;
  description: string;
  shortDescription: string;
  isHandmade: boolean;
  isFeatured: boolean;
}

export function emptyProductForm(): ProductFormValues {
  return {
    categoryId: "",
    sku: "",
    name: "",
    slug: "",
    jewelryType: "ring",
    status: "draft",
    basePrice: "",
    compareAtPrice: "",
    gemstoneType: "none",
    metalType: "",
    karat: "",
    weightGrams: "",
    description: "",
    shortDescription: "",
    isHandmade: false,
    isFeatured: false,
  };
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export function ProductFormFields({
  values,
  onChange,
  categories,
  idPrefix = "product",
  slugEditable = true,
}: {
  values: ProductFormValues;
  onChange: (values: ProductFormValues) => void;
  categories: Category[];
  idPrefix?: string;
  slugEditable?: boolean;
}) {
  const { t } = useAdminT();

  function update(partial: Partial<ProductFormValues>) {
    onChange({ ...values, ...partial });
  }

  function handleNameChange(name: string) {
    const next = { ...values, name };
    if (!slugEditable || !values.slug || values.slug === slugify(values.name)) {
      next.slug = slugify(name);
    }
    onChange(next);
  }

  const nameLabel = fieldPlaceholder(t("products.form.name"), true);
  const skuLabel = fieldPlaceholder(t("products.form.sku"), true);
  const slugLabel = fieldPlaceholder(t("products.form.slug"), true);
  const categoryLabel = fieldPlaceholder(t("products.form.category"), true);
  const typeLabel = fieldPlaceholder(t("products.filters.jewelryType"), true);
  const statusLabel = fieldPlaceholder(t("common.status"));
  const priceLabel = fieldPlaceholder(t("products.form.basePrice"), true);
  const compareLabel = fieldPlaceholder(t("products.form.compareAtPrice"));
  const metalLabel = fieldPlaceholder(t("products.form.metal"));
  const gemstoneLabel = fieldPlaceholder(t("products.form.gemstone"));
  const karatLabel = fieldPlaceholder(t("products.form.karat"));
  const weightLabel = fieldPlaceholder(t("products.form.weight"));
  const shortLabel = fieldPlaceholder(t("products.form.shortDescription"));
  const descLabel = fieldPlaceholder(t("products.form.description"));

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input
            id={`${idPrefix}-name`}
            value={values.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder={nameLabel}
            aria-label={nameLabel}
          />
        </div>

        <div>
          <Input
            id={`${idPrefix}-sku`}
            value={values.sku}
            onChange={(e) => update({ sku: e.target.value })}
            placeholder={skuLabel}
            aria-label={skuLabel}
            className="font-mono text-ltr"
            dir="ltr"
          />
        </div>

        <div>
          <Input
            id={`${idPrefix}-slug`}
            value={values.slug}
            onChange={(e) => update({ slug: slugify(e.target.value) })}
            placeholder={slugLabel}
            aria-label={slugLabel}
            className="font-mono text-ltr"
            dir="ltr"
            disabled={!slugEditable}
          />
        </div>

        <div>
          <DashboardSelect
            id={`${idPrefix}-category`}
            value={values.categoryId}
            onChange={(e) => update({ categoryId: e.target.value })}
            aria-label={categoryLabel}
          >
            <DashboardSelectOption value="" placeholder>
              {categoryLabel}
            </DashboardSelectOption>
            {categories.map((cat) => (
              <DashboardSelectOption key={cat.id} value={cat.id}>
                {cat.name}
              </DashboardSelectOption>
            ))}
          </DashboardSelect>
        </div>

        <div>
          <DashboardSelect
            id={`${idPrefix}-type`}
            value={values.jewelryType}
            onChange={(e) =>
              update({ jewelryType: e.target.value as JewelryType })
            }
            aria-label={typeLabel}
          >
            {jewelryTypes.map((value) => (
              <DashboardSelectOption key={value} value={value}>
                {t(`products.jewelryType.${value}`)}
              </DashboardSelectOption>
            ))}
          </DashboardSelect>
        </div>

        <div>
          <DashboardSelect
            id={`${idPrefix}-status`}
            value={values.status}
            onChange={(e) =>
              update({ status: e.target.value as ProductStatus })
            }
            aria-label={statusLabel}
          >
            <DashboardSelectOption value="draft">
              {t("products.status.draft")}
            </DashboardSelectOption>
            <DashboardSelectOption value="published">
              {t("products.status.published")}
            </DashboardSelectOption>
            <DashboardSelectOption value="archived">
              {t("products.status.archived")}
            </DashboardSelectOption>
          </DashboardSelect>
        </div>

        <div>
          <Input
            id={`${idPrefix}-price`}
            type="number"
            min={0}
            value={values.basePrice}
            onChange={(e) => update({ basePrice: e.target.value })}
            placeholder={priceLabel}
            aria-label={priceLabel}
            className="tabular-nums"
          />
        </div>

        <div>
          <Input
            id={`${idPrefix}-compare`}
            type="number"
            min={0}
            value={values.compareAtPrice}
            onChange={(e) => update({ compareAtPrice: e.target.value })}
            placeholder={compareLabel}
            aria-label={compareLabel}
            className="tabular-nums"
          />
        </div>

        <div>
          <DashboardSelect
            id={`${idPrefix}-metal`}
            value={values.metalType}
            onChange={(e) =>
              update({ metalType: e.target.value as MetalType | "" })
            }
            aria-label={metalLabel}
          >
            {metalOptions.map((option) => (
              <DashboardSelectOption
                key={option.value || "none"}
                value={option.value}
                placeholder={option.value === ""}
              >
                {option.value === "" ? metalLabel : t(option.labelKey)}
              </DashboardSelectOption>
            ))}
          </DashboardSelect>
        </div>

        <div>
          <DashboardSelect
            id={`${idPrefix}-gemstone`}
            value={values.gemstoneType}
            onChange={(e) =>
              update({ gemstoneType: e.target.value as GemstoneType })
            }
            aria-label={gemstoneLabel}
          >
            {gemstoneOptions.map((option) => (
              <DashboardSelectOption key={option.value} value={option.value}>
                {t(option.labelKey)}
              </DashboardSelectOption>
            ))}
          </DashboardSelect>
        </div>

        <div>
          <Input
            id={`${idPrefix}-karat`}
            type="number"
            min={0}
            value={values.karat}
            onChange={(e) => update({ karat: e.target.value })}
            placeholder={karatLabel}
            aria-label={karatLabel}
          />
        </div>

        <div>
          <Input
            id={`${idPrefix}-weight`}
            type="number"
            min={0}
            step="0.01"
            value={values.weightGrams}
            onChange={(e) => update({ weightGrams: e.target.value })}
            placeholder={weightLabel}
            aria-label={weightLabel}
          />
        </div>
      </div>

      <div>
        <Input
          id={`${idPrefix}-short`}
          value={values.shortDescription}
          onChange={(e) => update({ shortDescription: e.target.value })}
          placeholder={shortLabel}
          aria-label={shortLabel}
        />
      </div>

      <div>
        <Textarea
          id={`${idPrefix}-desc`}
          value={values.description}
          onChange={(e) => update({ description: e.target.value })}
          placeholder={descLabel}
          aria-label={descLabel}
          rows={4}
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={values.isHandmade}
            onChange={(e) => update({ isHandmade: e.target.checked })}
            className="size-4 rounded border-border accent-primary"
          />
          {t("common.handmade")}
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={values.isFeatured}
            onChange={(e) => update({ isFeatured: e.target.checked })}
            className="size-4 rounded border-border accent-primary"
          />
          {t("products.featured")}
        </label>
      </div>
    </div>
  );
}

export function productFormValuesToInput(values: ProductFormValues) {
  const basePrice = Number(values.basePrice);
  const compareAt = values.compareAtPrice.trim()
    ? Number(values.compareAtPrice)
    : undefined;
  const karat = values.karat.trim() ? Number(values.karat) : undefined;
  const weightGrams = values.weightGrams.trim()
    ? Number(values.weightGrams)
    : undefined;

  return {
    categoryId: values.categoryId,
    sku: values.sku.trim(),
    name: values.name.trim(),
    slug: values.slug.trim(),
    jewelryType: values.jewelryType,
    status: values.status,
    basePrice,
    compareAtPrice: compareAt,
    gemstoneType: values.gemstoneType,
    metalType: values.metalType || undefined,
    karat,
    weightGrams,
    description: values.description.trim() || undefined,
    shortDescription: values.shortDescription.trim() || undefined,
    isHandmade: values.isHandmade,
    isFeatured: values.isFeatured,
  };
}

export function validateProductForm(
  values: ProductFormValues,
  t: (key: string) => string,
): string | null {
  if (!values.name.trim()) return t("products.form.validation.nameRequired");
  if (!values.sku.trim()) return t("products.form.validation.skuRequired");
  if (!values.slug.trim()) return t("products.form.validation.slugRequired");
  if (!values.categoryId) return t("products.form.validation.categoryRequired");
  const price = Number(values.basePrice);
  if (!Number.isFinite(price) || price < 0) {
    return t("products.form.validation.priceRequired");
  }
  return null;
}
