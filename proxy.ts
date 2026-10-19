import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  DEFAULT_STORE_LOCALE,
  isStoreLocale,
  LOCALE_HEADER,
} from "@/lib/locale";

const PASSTHROUGH_PREFIXES = new Set(["admin", "api", "_next", "static"]);

/** Two-letter segments that are not fa/en are unsupported locales and must 404. */
const LOCALE_LIKE = /^[a-z]{2}$/i;

function nextWithLocale(request: NextRequest, locale: string | null) {
  const requestHeaders = new Headers(request.headers);
  if (locale) requestHeaders.set(LOCALE_HEADER, locale);
  else requestHeaders.delete(LOCALE_HEADER);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/").filter(Boolean)[0];

  if (first && PASSTHROUGH_PREFIXES.has(first)) {
    return nextWithLocale(request, null);
  }

  if (first && isStoreLocale(first)) {
    return nextWithLocale(request, first);
  }

  if (first && LOCALE_LIKE.test(first)) {
    return nextWithLocale(request, null);
  }

  const url = request.nextUrl.clone();
  const suffix = pathname === "/" ? "" : pathname;
  url.pathname = `/${DEFAULT_STORE_LOCALE}${suffix}`;
  return NextResponse.redirect(url, 307);
}

export const config = {
  matcher: ["/((?!api|_next|static|.*\\..*).*)"],
};
