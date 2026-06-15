import Image, { type ImageProps } from "next/image";

export interface CatalogImageProps extends ImageProps {}

/** Catalog product image — expects URLs already mapped by the API client. */
export function CatalogImage({ alt = "", ...props }: CatalogImageProps) {
  return <Image alt={alt} {...props} />;
}
