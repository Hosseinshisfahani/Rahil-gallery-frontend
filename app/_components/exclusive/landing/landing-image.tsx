import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

function isRemote(src: ImageProps["src"]) {
  return (
    typeof src === "string" &&
    (src.startsWith("http://") || src.startsWith("https://"))
  );
}

/** Chaumet CDN images load in the browser (Akamai blocks server-side fetch). */
export function LandingImage({
  src,
  alt = "",
  className,
  fill,
  sizes,
  priority,
  unoptimized,
  ...rest
}: ImageProps) {
  if (isRemote(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src as string}
        alt={alt}
        sizes={sizes}
        referrerPolicy="no-referrer"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={cn(fill && "absolute inset-0 size-full object-cover", className)}
        {...rest}
      />
    );
  }

  const isSvg = typeof src === "string" && src.endsWith(".svg");
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={className}
      unoptimized={unoptimized ?? isSvg}
      {...rest}
    />
  );
}
