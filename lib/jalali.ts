import jalaali from "jalaali-js";
import type { AdminLocale } from "@/lib/admin-locale";
import { toPersianDigits } from "@/lib/format";

export const JALALI_MONTH_NAMES = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
] as const;

/** Week starts Saturday (index 0) */
export const JALALI_WEEKDAY_SHORT = ["ش", "ی", "د", "س", "چ", "پ", "ج"] as const;

export const JALALI_WEEKDAY_NAMES = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
] as const;

export type JalaliParts = { jy: number; jm: number; jd: number };

export function parseIsoDate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export function dateToIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isoToJalali(iso: string): JalaliParts | null {
  const date = parseIsoDate(iso);
  if (!date) return null;

  const j = jalaali.toJalaali(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );
  return { jy: j.jy, jm: j.jm, jd: j.jd };
}

export function jalaliToIso(jy: number, jm: number, jd: number): string | null {
  if (!jalaali.isValidJalaaliDate(jy, jm, jd)) return null;

  const g = jalaali.toGregorian(jy, jm, jd);
  return dateToIso(new Date(g.gy, g.gm - 1, g.gd));
}

export function dateToJalali(date: Date): JalaliParts {
  const j = jalaali.toJalaali(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );
  return { jy: j.jy, jm: j.jm, jd: j.jd };
}

export function jalaliMonthLength(jy: number, jm: number): number {
  return jalaali.jalaaliMonthLength(jy, jm);
}

/** Saturday = 0 … Friday = 6 */
export function iranWeekdayIndex(date: Date): number {
  return (date.getDay() + 1) % 7;
}

export function compareIso(a: string, b: string): number {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

export function isIsoInRange(
  iso: string,
  min?: string,
  max?: string,
): boolean {
  if (min && compareIso(iso, min) < 0) return false;
  if (max && compareIso(iso, max) > 0) return false;
  return true;
}

export function formatIsoAsJalali(
  iso: string,
  options: { persianDigits?: boolean; style?: "short" | "long" } = {},
): string {
  const { persianDigits = true, style = "long" } = options;
  const parts = isoToJalali(iso);
  if (!parts) return "";

  let text: string;
  if (style === "short") {
    text = `${parts.jy}/${String(parts.jm).padStart(2, "0")}/${String(parts.jd).padStart(2, "0")}`;
  } else {
    text = `${parts.jd} ${JALALI_MONTH_NAMES[parts.jm - 1]} ${parts.jy}`;
  }

  return persianDigits ? toPersianDigits(text) : text;
}

export function formatDateForAdmin(
  input: string | Date,
  locale: AdminLocale,
  options: { dateStyle?: "short" | "long"; includeTime?: boolean } = {},
): string {
  const { dateStyle = "long", includeTime = false } = options;

  const date =
    typeof input === "string"
      ? input.includes("T")
        ? new Date(input)
        : parseIsoDate(input)
      : input;

  if (!date || Number.isNaN(date.getTime())) return "";

  if (locale === "fa") {
    const j = dateToJalali(date);
    const weekday = JALALI_WEEKDAY_NAMES[iranWeekdayIndex(date)];
    const month = JALALI_MONTH_NAMES[j.jm - 1];
    let text =
      dateStyle === "short"
        ? `${j.jy}/${String(j.jm).padStart(2, "0")}/${String(j.jd).padStart(2, "0")}`
        : `${weekday}، ${j.jd} ${month} ${j.jy}`;

    if (includeTime) {
      const time = date.toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      text = `${text} · ${time}`;
    }

    return toPersianDigits(text);
  }

  if (includeTime) {
    return date.toLocaleString("en-US", {
      dateStyle: dateStyle === "short" ? "short" : "medium",
      timeStyle: "short",
    });
  }

  return date.toLocaleDateString("en-US", {
    dateStyle: dateStyle === "short" ? "short" : "medium",
  });
}

export type CalendarCell = JalaliParts | null;

export function buildJalaliMonthGrid(jy: number, jm: number): CalendarCell[] {
  const monthLength = jalaliMonthLength(jy, jm);
  const firstGregorian = jalaali.toGregorian(jy, jm, 1);
  const firstDate = new Date(
    firstGregorian.gy,
    firstGregorian.gm - 1,
    firstGregorian.gd,
  );
  const startOffset = iranWeekdayIndex(firstDate);

  const cells: CalendarCell[] = [];
  for (let i = 0; i < startOffset; i += 1) {
    cells.push(null);
  }
  for (let day = 1; day <= monthLength; day += 1) {
    cells.push({ jy, jm, jd: day });
  }
  return cells;
}

export function digitsForLocale(value: number | string, locale: AdminLocale): string {
  const text = String(value);
  return locale === "fa" ? toPersianDigits(text) : text;
}

/** Inclusive Jalali year range for calendar navigation. */
export function jalaliYearRange(
  min?: string,
  max?: string,
  anchor?: JalaliParts,
): { minYear: number; maxYear: number } {
  const pivot = anchor ?? dateToJalali(new Date());
  let minYear = pivot.jy - 100;
  let maxYear = pivot.jy + 20;

  if (min) {
    const parts = isoToJalali(min);
    if (parts) minYear = Math.max(minYear, parts.jy);
  }
  if (max) {
    const parts = isoToJalali(max);
    if (parts) maxYear = Math.min(maxYear, parts.jy);
  }

  if (minYear > maxYear) {
    return { minYear: maxYear, maxYear: minYear };
  }

  return { minYear, maxYear };
}

export function jalaliMonthLabel(jm: number, locale: AdminLocale): string {
  if (locale === "en") {
    return String(jm).padStart(2, "0");
  }
  return JALALI_MONTH_NAMES[jm - 1];
}
