export type ProductStatus = "draft" | "published" | "archived";

export type JewelryType =
  | "ring"
  | "necklace"
  | "bracelet"
  | "earring"
  | "pendant"
  | "anklet"
  | "brooch"
  | "set"
  | "other";

export type MetalType =
  | "gold_yellow"
  | "gold_white"
  | "gold_rose"
  | "silver"
  | "platinum"
  | "titanium"
  | "mixed"
  | "other";

export type GemstoneType =
  | "none"
  | "diamond"
  | "ruby"
  | "sapphire"
  | "emerald"
  | "pearl"
  | "turquoise"
  | "amethyst"
  | "mixed"
  | "other";

export type ProductAvailability = "in_stock" | "out_of_stock";

export interface BilingualText {
  en: string;
  fa: string;
}

export interface ProductSummary {
  id: string;
  slug: string;
  name: string;
  title: BilingualText;
  category: string;
  categorySlug: string;
  jewelryType: JewelryType;
  basePrice: number;
  priceFrom: number;
  priceTo: number;
  currency: string;
  compareAtPrice?: number;
  metalType?: MetalType;
  gemstoneType: GemstoneType;
  isFeatured: boolean;
  isHandmade: boolean;
  primaryImageUrl?: string;
  availability: ProductAvailability;
  variantCount: number;
  /** Client-side navigation helper */
  href: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  sizeLabel?: string;
  colorLabel?: string;
  priceAdjustment: number;
  unitPrice: number;
  weightGrams?: number;
  barcode?: string;
  isDefault: boolean;
  sortOrder: number;
  isActive: boolean;
  availableQuantity: number;
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  variantId?: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface ProductDetail extends ProductSummary {
  status: ProductStatus;
  sku: string;
  description?: string;
  shortDescription?: string;
  karat?: number;
  weightGrams?: number;
  purityPercent?: number;
  certificateNumber?: string;
  metaTitle?: string;
  metaDescription?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  variants: ProductVariant[];
  images: ProductImage[];
}

export interface Category {
  id: string;
  parentId?: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
}

export interface CreateProductInput {
  categoryId: string;
  sku: string;
  name: string;
  slug: string;
  jewelryType: JewelryType;
  basePrice: number;
  status?: ProductStatus;
  currency?: string;
  gemstoneType?: GemstoneType;
  description?: string;
  shortDescription?: string;
  compareAtPrice?: number;
  metalType?: MetalType;
  karat?: number;
  weightGrams?: number;
  purityPercent?: number;
  certificateNumber?: string;
  isHandmade?: boolean;
  isFeatured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export interface UpdateProductInput {
  categoryId?: string;
  sku?: string;
  name?: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  jewelryType?: JewelryType;
  status?: ProductStatus;
  basePrice?: number;
  compareAtPrice?: number;
  metalType?: MetalType;
  karat?: number;
  gemstoneType?: GemstoneType;
  weightGrams?: number;
  purityPercent?: number;
  certificateNumber?: string;
  isHandmade?: boolean;
  isFeatured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export interface CreateVariantInput {
  sku: string;
  name: string;
  sizeLabel?: string;
  colorLabel?: string;
  priceAdjustment?: number;
  weightGrams?: number;
  barcode?: string;
  isDefault?: boolean;
  sortOrder?: number;
  initialQuantity: number;
  lowStockThreshold?: number;
}

export interface UpdateVariantInput {
  sku?: string;
  name?: string;
  sizeLabel?: string;
  colorLabel?: string;
  priceAdjustment?: number;
  weightGrams?: number;
  barcode?: string;
  isDefault?: boolean;
  sortOrder?: number;
  isActive?: boolean;
}

export interface CreateProductImageInput {
  url: string;
  altText?: string;
  variantId?: string;
  sortOrder?: number;
  isPrimary?: boolean;
}

export interface AdjustInventoryInput {
  quantity: number;
  lowStockThreshold?: number;
}
