"use client";

import {
  Children,
  isValidElement,
  useMemo,
  type ChangeEvent,
  type ChangeEventHandler,
  type ReactNode,
} from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/** Radix SelectItem forbids empty string values — map "" ↔ sentinel. */
const EMPTY_VALUE = "__dashboard_select_empty__";

export interface DashboardSelectOptionProps {
  value: string | number;
  disabled?: boolean;
  /** Muted placeholder styling for empty-value prompts (e.g. value=""). */
  placeholder?: boolean;
  children: ReactNode;
}

type ParsedOption = {
  value: string;
  label: ReactNode;
  disabled: boolean;
  placeholder: boolean;
};

export interface DashboardSelectProps {
  id?: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  className?: string;
  hasError?: boolean;
  fieldSize?: "sm" | "md";
  "aria-label"?: string;
  "aria-labelledby"?: string;
  children: ReactNode;
}

function parseOptions(children: ReactNode): ParsedOption[] {
  const options: ParsedOption[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement<DashboardSelectOptionProps>(child)) return;
    if (child.type !== DashboardSelectOption) return;

    const { value, disabled, placeholder, children: label } = child.props;
    options.push({
      value: String(value ?? ""),
      label,
      disabled: Boolean(disabled),
      placeholder: Boolean(placeholder),
    });
  });

  return options;
}

function toRadixValue(value: string): string {
  return value === "" ? EMPTY_VALUE : value;
}

function fromRadixValue(value: string): string {
  return value === EMPTY_VALUE ? "" : value;
}

function createChangeEvent(value: string): ChangeEvent<HTMLSelectElement> {
  return {
    target: { value } as HTMLSelectElement,
    currentTarget: { value } as HTMLSelectElement,
  } as ChangeEvent<HTMLSelectElement>;
}

/**
 * Declarative option — parsed by `DashboardSelect` (not rendered as a native option).
 */
export function DashboardSelectOption(_props: DashboardSelectOptionProps) {
  return null;
}

/**
 * Dashboard select — thin wrapper over shadcn/Radix Select.
 * Preserves the prior ChangeEvent onChange + DashboardSelectOption API.
 */
export function DashboardSelect({
  id,
  value,
  defaultValue,
  onChange,
  disabled = false,
  required = false,
  name,
  className,
  hasError = false,
  fieldSize = "md",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  children,
}: DashboardSelectProps) {
  const options = useMemo(() => parseOptions(children), [children]);

  const placeholderLabel = useMemo(() => {
    const placeholder = options.find((o) => o.placeholder || o.value === "");
    return placeholder?.label;
  }, [options]);

  const controlled = value !== undefined;
  const radixValue = controlled ? toRadixValue(String(value)) : undefined;
  const radixDefault =
    defaultValue !== undefined ? toRadixValue(String(defaultValue)) : undefined;

  return (
    <Select
      value={radixValue}
      defaultValue={controlled ? undefined : radixDefault}
      disabled={disabled}
      required={required}
      name={name}
      onValueChange={(next) => {
        onChange?.(createChangeEvent(fromRadixValue(next)));
      }}
    >
      <SelectTrigger
        id={id}
        size={fieldSize === "sm" ? "sm" : "default"}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-invalid={hasError || undefined}
        className={cn(
          "w-full min-w-0 bg-surface text-ink",
          fieldSize === "md" && "h-9",
          className,
        )}
      >
        <SelectValue placeholder={placeholderLabel} />
      </SelectTrigger>
      <SelectContent position="popper" align="start" className="w-(--radix-select-trigger-width)">
        {options.map((option) => (
          <SelectItem
            key={option.value === "" ? EMPTY_VALUE : option.value}
            value={toRadixValue(option.value)}
            disabled={option.disabled}
            className={cn(
              option.placeholder && "text-muted-foreground",
              "focus:bg-surface-elevated focus:text-ink",
            )}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
