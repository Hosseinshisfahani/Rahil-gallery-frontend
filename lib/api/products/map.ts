import { normalizeMediaUrl } from "@/lib/media-url";
import type { ProductDetail, ProductImage, ProductSummary } from "./types";

type ApiProductSummary = Omit<ProductSummary, "href">;
type ApiProductDetail = Omit<ProductDetail, "href">;

export function mapProductImage(image: ProductImage): ProductImage {
  return {
    ...image,
    url: normalizeMediaUrl(image.url) ?? image.url,
  };
}

export function mapProductSummary(raw: ApiProductSummary): ProductSummary {
  return {
    ...raw,
    primaryImageUrl: normalizeMediaUrl(raw.primaryImageUrl),
    href: `/admin/products/${raw.id}`,
  };
}

export function mapProductDetail(raw: ApiProductDetail): ProductDetail {
  return {
    ...raw,
    primaryImageUrl: normalizeMediaUrl(raw.primaryImageUrl),
    images: raw.images.map(mapProductImage),
    href: `/admin/products/${raw.id}`,
  };
}
