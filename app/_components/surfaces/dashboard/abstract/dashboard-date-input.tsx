"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { Input } from "@/_components/core/primitive/input";
import { formatIsoAsJalali } from "@/lib/jalali";
import { useAdminT } from "../layout/admin-locale-provider";
import { JalaliCalendar } from "./jalali-calendar";

export interface DashboardDateInputProps {
  id?: string;
  value: string;
  onChange: (iso: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  className?: string;
  min?: string;
  max?: string;
  "aria-label"?: string;
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

export const DashboardDateInput = forwardRef<HTMLInputElement, DashboardDateInputProps>(
  function DashboardDateInput(
    {
      id,
      value,
      onChange,
      disabled = false,
      hasError = false,
      className,
      min,
      max,
      "aria-label": ariaLabel,
    },
    ref,
  ) {
    const { locale, t } = useAdminT();
    const calendarId = useId();
    const rootRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(false);
    const [panelStyle, setPanelStyle] = useState<CSSProperties>({});

    useLayoutEffect(() => {
      if (!open || !triggerRef.current) return;

      function updatePosition() {
        const trigger = triggerRef.current;
        if (!trigger) return;

        const rect = trigger.getBoundingClientRect();
        setPanelStyle({
          position: "fixed",
          top: rect.bottom + 4,
          left: rect.left,
          width: Math.max(rect.width, 280),
        });
      }

      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);

      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, true);
      };
    }, [open]);

    useEffect(() => {
      if (!open) return;

      function handlePointerDown(event: MouseEvent) {
        const target = event.target as Node;
        if (
          rootRef.current?.contains(target) ||
          panelRef.current?.contains(target)
        ) {
          return;
        }
        setOpen(false);
      }

      function handleKeyDown(event: globalThis.KeyboardEvent) {
        if (event.key === "Escape") {
          event.preventDefault();
          setOpen(false);
          triggerRef.current?.focus();
        }
      }

      document.addEventListener("mousedown", handlePointerDown);
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("mousedown", handlePointerDown);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [open]);

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
          aria-label={ariaLabel}
          className={className}
        />
      );
    }

    const displayValue = value
      ? formatIsoAsJalali(value, { style: "long" })
      : t("calendar.selectDate");

    const panel = open ? (
      <div
        ref={panelRef}
        id={calendarId}
        role="dialog"
        aria-label={ariaLabel ?? t("calendar.title")}
        className="dashboard-jalali-calendar-panel"
        style={panelStyle}
      >
        <JalaliCalendar
          key={`${value}-${open}`}
          value={value}
          onSelect={(iso) => {
            onChange(iso);
            setOpen(false);
            triggerRef.current?.focus();
          }}
          locale={locale}
          min={min}
          max={max}
          todayLabel={t("calendar.today")}
          clearLabel={t("calendar.clear")}
          prevMonthLabel={t("calendar.prevMonth")}
          nextMonthLabel={t("calendar.nextMonth")}
        />
      </div>
    ) : null;

    return (
      <div
        ref={rootRef}
        className={cn("dashboard-date-input", className)}
        data-error={hasError ? "" : undefined}
        data-open={open ? "" : undefined}
      >
        <button
          ref={triggerRef}
          id={id}
          type="button"
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={calendarId}
          aria-label={ariaLabel}
          className="dashboard-date-input-trigger"
          onClick={() => setOpen((current) => !current)}
        >
          <span
            className="dashboard-date-input-value"
            data-placeholder={value ? undefined : ""}
          >
            {displayValue}
          </span>
          <CalendarIcon className="dashboard-date-input-icon" />
        </button>

        {typeof document !== "undefined" && panel
          ? createPortal(
              <div data-surface="dashboard">{panel}</div>,
              document.body,
            )
          : null}
      </div>
    );
  },
);
