"use client";

import { forwardRef, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  dateToIso,
  formatIsoAsJalali,
  isIsoInRange,
  parseIsoDate,
} from "@/lib/jalali";
import { cn } from "@/lib/utils";
import { useAdminT } from "@/app/admin/_components/layout/admin-locale-provider";

export interface DashboardDateInputProps {
  id?: string;
  value: string;
  onChange: (iso: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  className?: string;
  min?: string;
  max?: string;
  placeholder?: string;
  "aria-label"?: string;
}

export const DashboardDateInput = forwardRef<
  HTMLInputElement,
  DashboardDateInputProps
>(function DashboardDateInput(
  {
    id,
    value,
    onChange,
    disabled = false,
    hasError = false,
    className,
    min,
    max,
    placeholder,
    "aria-label": ariaLabel,
  },
  ref,
) {
  const { locale, t } = useAdminT();
  const [open, setOpen] = useState(false);

  if (locale === "en") {
    return (
      <Input
        ref={ref}
        id={id}
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        hasError={hasError}
        min={min}
        max={max}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        className={className}
      />
    );
  }

  const emptyLabel = placeholder ?? ariaLabel ?? t("calendar.selectDate");
  const selected = value ? parseIsoDate(value) : undefined;
  const displayValue = value
    ? formatIsoAsJalali(value, { style: "long" })
    : emptyLabel;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          aria-label={ariaLabel ?? placeholder}
          aria-invalid={hasError || undefined}
          className={cn(
            "h-9 w-full justify-between gap-2 bg-surface px-3 font-normal text-ink",
            !value && "text-muted-foreground",
            hasError && "border-destructive",
            className,
          )}
        >
          <span className="truncate">{displayValue}</span>
          <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-auto border-border bg-surface p-0 text-ink ring-border"
      >
        <Calendar
          persian
          mode="single"
          captionLayout="dropdown"
          selected={selected ?? undefined}
          onSelect={(date) => {
            if (!date) return;
            onChange(dateToIso(date));
            setOpen(false);
          }}
          disabled={(date) => !isIsoInRange(dateToIso(date), min, max)}
          startMonth={min ? parseIsoDate(min) ?? undefined : undefined}
          endMonth={max ? parseIsoDate(max) ?? undefined : undefined}
        />
        <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onChange(dateToIso(new Date()));
              setOpen(false);
            }}
          >
            {t("calendar.today")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
          >
            {t("calendar.clear")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
});
