const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianDigits(value: string): string {
  return value.replace(/\d/g, (digit) => FA_DIGITS[Number(digit)] ?? digit);
}

export function formatPrice(
  amount: number,
  locale: "fa" | "en" = "en",
): string {
  const formatted = new Intl.NumberFormat("en-US").format(amount);

  if (locale === "fa") {
    return `${toPersianDigits(formatted)} تومان`;
  }

  return `${formatted} Toman`;
}
