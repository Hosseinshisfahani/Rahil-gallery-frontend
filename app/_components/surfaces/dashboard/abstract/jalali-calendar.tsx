"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  buildJalaliMonthGrid,
  dateToIso,
  dateToJalali,
  digitsForLocale,
  isoToJalali,
  isIsoInRange,
  jalaliMonthLabel,
  jalaliToIso,
  jalaliYearRange,
  JALALI_MONTH_NAMES,
  JALALI_WEEKDAY_SHORT,
  type JalaliParts,
} from "@/lib/jalali";
import type { AdminLocale } from "@/lib/admin-locale";

export interface JalaliCalendarProps {
  value: string;
  onSelect: (iso: string) => void;
  locale?: AdminLocale;
  min?: string;
  max?: string;
  className?: string;
  todayLabel: string;
  clearLabel: string;
  prevMonthLabel: string;
  nextMonthLabel: string;
  monthLabel: string;
  yearLabel: string;
}

function sameJalaliDay(a: JalaliParts, b: JalaliParts): boolean {
  return a.jy === b.jy && a.jm === b.jm && a.jd === b.jd;
}

export function JalaliCalendar({
  value,
  onSelect,
  locale = "fa",
  min,
  max,
  className,
  todayLabel,
  clearLabel,
  prevMonthLabel,
  nextMonthLabel,
  monthLabel,
  yearLabel,
}: JalaliCalendarProps) {
  const selected = value ? isoToJalali(value) : null;
  const today = dateToJalali(new Date());

  const initialView = selected ?? today;
  const [viewYear, setViewYear] = useState(initialView.jy);
  const [viewMonth, setViewMonth] = useState(initialView.jm);

  const yearRange = useMemo(
    () => jalaliYearRange(min, max, today),
    [max, min, today.jy],
  );

  const yearOptions = useMemo(() => {
    const years: number[] = [];
    for (let year = yearRange.minYear; year <= yearRange.maxYear; year += 1) {
      years.push(year);
    }
    return years;
  }, [yearRange.maxYear, yearRange.minYear]);

  const cells = useMemo(
    () => buildJalaliMonthGrid(viewYear, viewMonth),
    [viewMonth, viewYear],
  );

  function clampYear(year: number): number {
    return Math.min(yearRange.maxYear, Math.max(yearRange.minYear, year));
  }

  function shiftMonth(delta: number) {
    let nextMonth = viewMonth + delta;
    let nextYear = viewYear;

    while (nextMonth > 12) {
      nextMonth -= 12;
      nextYear += 1;
    }
    while (nextMonth < 1) {
      nextMonth += 12;
      nextYear -= 1;
    }

    setViewYear(clampYear(nextYear));
    setViewMonth(nextMonth);
  }

  function handleMonthChange(nextMonth: number) {
    setViewMonth(nextMonth);
  }

  function handleYearChange(nextYear: number) {
    setViewYear(clampYear(nextYear));
  }

  function handleSelect(parts: JalaliParts) {
    const iso = jalaliToIso(parts.jy, parts.jm, parts.jd);
    if (!iso || !isIsoInRange(iso, min, max)) return;
    onSelect(iso);
  }

  function handleToday() {
    const iso = dateToIso(new Date());
    if (!isIsoInRange(iso, min, max)) return;
    setViewYear(today.jy);
    setViewMonth(today.jm);
    onSelect(iso);
  }

  return (
    <div className={cn("dashboard-jalali-calendar", className)}>
      <div className="dashboard-jalali-calendar-header">
        <button
          type="button"
          className="dashboard-jalali-calendar-nav"
          onClick={() => shiftMonth(-1)}
          aria-label={prevMonthLabel}
        >
          ‹
        </button>

        <div className="dashboard-jalali-calendar-selects">
          <select
            className="dashboard-jalali-calendar-select"
            value={viewMonth}
            aria-label={monthLabel}
            onChange={(event) => handleMonthChange(Number(event.target.value))}
          >
            {JALALI_MONTH_NAMES.map((name, index) => {
              const month = index + 1;
              return (
                <option key={month} value={month}>
                  {locale === "fa" ? name : jalaliMonthLabel(month, locale)}
                </option>
              );
            })}
          </select>

          <select
            className="dashboard-jalali-calendar-select"
            value={viewYear}
            aria-label={yearLabel}
            onChange={(event) => handleYearChange(Number(event.target.value))}
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {digitsForLocale(year, locale)}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="dashboard-jalali-calendar-nav"
          onClick={() => shiftMonth(1)}
          aria-label={nextMonthLabel}
        >
          ›
        </button>
      </div>

      <div className="dashboard-jalali-calendar-weekdays" aria-hidden="true">
        {JALALI_WEEKDAY_SHORT.map((label) => (
          <span key={label} className="dashboard-jalali-calendar-weekday">
            {label}
          </span>
        ))}
      </div>

      <div className="dashboard-jalali-calendar-grid" role="grid">
        {cells.map((cell, index) => {
          if (!cell) {
            return (
              <span
                key={`empty-${index}`}
                className="dashboard-jalali-calendar-day dashboard-jalali-calendar-day--empty"
                aria-hidden="true"
              />
            );
          }

          const iso = jalaliToIso(cell.jy, cell.jm, cell.jd);
          const disabled = !iso || !isIsoInRange(iso, min, max);
          const isSelected = selected ? sameJalaliDay(cell, selected) : false;
          const isToday = sameJalaliDay(cell, today);

          return (
            <button
              key={`${cell.jy}-${cell.jm}-${cell.jd}`}
              type="button"
              role="gridcell"
              disabled={disabled}
              data-selected={isSelected ? "" : undefined}
              data-today={isToday ? "" : undefined}
              className="dashboard-jalali-calendar-day"
              onClick={() => handleSelect(cell)}
            >
              {digitsForLocale(cell.jd, locale)}
            </button>
          );
        })}
      </div>

      <div className="dashboard-jalali-calendar-footer">
        <button
          type="button"
          className="dashboard-jalali-calendar-action"
          onClick={handleToday}
        >
          {todayLabel}
        </button>
        <button
          type="button"
          className="dashboard-jalali-calendar-action"
          onClick={() => onSelect("")}
        >
          {clearLabel}
        </button>
      </div>
    </div>
  );
}
