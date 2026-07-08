import Image, { type ImageProps } from "next/image";

export type CatalogImageProps = ImageProps;

/** Catalog product image — expects URLs already mapped by the API client. */
export function CatalogImage({ alt = "", ...props }: CatalogImageProps) {
  return <Image alt={alt} {...props} />;
}
