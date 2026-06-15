"use client";

import {
  Children,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ChangeEventHandler,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

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
  /** Visual size — not a native multi-line select. */
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

function createChangeEvent(value: string): ChangeEvent<HTMLSelectElement> {
  return {
    target: { value } as HTMLSelectElement,
    currentTarget: { value } as HTMLSelectElement,
  } as ChangeEvent<HTMLSelectElement>;
}

function ChevronIcon({ className }: { className?: string }) {
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
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export type DashboardSelectHandle = {
  focus: () => void;
  blur: () => void;
};

/**
 * Dashboard-exclusive custom select — listbox dropdown styled in dashboard.css
 * (light/dark tokens, RTL, focus ring aligned with dashboard inputs).
 */
export const DashboardSelect = forwardRef(function DashboardSelect(
  {
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
  }: DashboardSelectProps,
  ref: Ref<DashboardSelectHandle>,
) {
  const options = useMemo(() => parseOptions(children), [children]);
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
  const [uncontrolledValue, setUncontrolledValue] = useState(
    () => String(defaultValue ?? options[0]?.value ?? ""),
  );
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? String(value) : uncontrolledValue;

  const selectedIndex = options.findIndex((opt) => opt.value === currentValue);
  const selectedOption =
    selectedIndex >= 0 ? options[selectedIndex] : undefined;

  useImperativeHandle(ref, () => ({
    focus: () => triggerRef.current?.focus(),
    blur: () => triggerRef.current?.blur(),
  }));

  const setValue = useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }
      onChange?.(createChangeEvent(nextValue));
    },
    [isControlled, onChange],
  );

  const close = useCallback(() => {
    setOpen(false);
    setHighlightIndex(-1);
  }, []);

  const openMenu = useCallback(
    (focusIndex?: number) => {
      if (disabled) return;
      setOpen(true);
      const startIndex =
        focusIndex ??
        (selectedIndex >= 0
          ? selectedIndex
          : options.findIndex((opt) => !opt.disabled));
      setHighlightIndex(startIndex >= 0 ? startIndex : 0);
    },
    [disabled, options, selectedIndex],
  );

  const selectIndex = useCallback(
    (index: number) => {
      const option = options[index];
      if (!option || option.disabled) return;
      setValue(option.value);
      close();
      triggerRef.current?.focus();
    },
    [close, options, setValue],
  );

  const moveHighlight = useCallback(
    (direction: 1 | -1) => {
      if (options.length === 0) return;

      let index = highlightIndex;
      if (index < 0) {
        index = selectedIndex >= 0 ? selectedIndex : 0;
      }

      for (let step = 0; step < options.length; step += 1) {
        index = (index + direction + options.length) % options.length;
        if (!options[index]?.disabled) {
          setHighlightIndex(index);
          return;
        }
      }
    },
    [highlightIndex, options, selectedIndex],
  );

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;

    function updatePosition() {
      const trigger = triggerRef.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      setMenuStyle({
        position: "fixed",
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
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
        menuRef.current?.contains(target)
      ) {
        return;
      }
      close();
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [close, open]);

  useEffect(() => {
    if (!open || highlightIndex < 0) return;
    optionRefs.current[highlightIndex]?.scrollIntoView({ block: "nearest" });
  }, [highlightIndex, open]);

  function handleTriggerKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (open) {
          moveHighlight(1);
        } else {
          openMenu(selectedIndex >= 0 ? selectedIndex : 0);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (open) {
          moveHighlight(-1);
        } else {
          openMenu(selectedIndex >= 0 ? selectedIndex : options.length - 1);
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (open && highlightIndex >= 0) {
          selectIndex(highlightIndex);
        } else {
          openMenu();
        }
        break;
      case "Escape":
        if (open) {
          event.preventDefault();
          close();
        }
        break;
      case "Tab":
        close();
        break;
      default:
        break;
    }
  }

  function handleMenuKeyDown(event: ReactKeyboardEvent<HTMLUListElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveHighlight(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveHighlight(-1);
        break;
      case "Home":
        event.preventDefault();
        setHighlightIndex(options.findIndex((opt) => !opt.disabled));
        break;
      case "End":
        event.preventDefault();
        for (let index = options.length - 1; index >= 0; index -= 1) {
          if (!options[index]?.disabled) {
            setHighlightIndex(index);
            break;
          }
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (highlightIndex >= 0) {
          selectIndex(highlightIndex);
        }
        break;
      case "Escape":
        event.preventDefault();
        close();
        triggerRef.current?.focus();
        break;
      default:
        break;
    }
  }

  const displayLabel = selectedOption?.label ?? options[0]?.label ?? "";
  const displayPlaceholder =
    !selectedOption ||
    selectedOption.placeholder ||
    (required && currentValue === "");

  const menu = open ? (
    <ul
      ref={menuRef}
      id={listboxId}
      role="listbox"
      aria-labelledby={ariaLabelledBy}
      aria-label={ariaLabelledBy ? undefined : ariaLabel}
      tabIndex={-1}
      className="dashboard-select-menu"
      style={menuStyle}
      onKeyDown={handleMenuKeyDown}
    >
      {options.map((option, index) => {
        const selected = option.value === currentValue;
        const highlighted = index === highlightIndex;

        return (
          <li
            key={`${option.value}-${index}`}
            ref={(node) => {
              optionRefs.current[index] = node;
            }}
            role="option"
            aria-selected={selected}
            aria-disabled={option.disabled || undefined}
            data-selected={selected ? "" : undefined}
            data-highlighted={highlighted ? "" : undefined}
            data-placeholder={option.placeholder ? "" : undefined}
            className="dashboard-select-option"
            onMouseEnter={() => {
              if (!option.disabled) {
                setHighlightIndex(index);
              }
            }}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => selectIndex(index)}
          >
            {option.label}
          </li>
        );
      })}
    </ul>
  ) : null;

  return (
    <div
      ref={rootRef}
      className={cn("dashboard-select", className)}
      data-size={fieldSize}
      data-error={hasError ? "" : undefined}
      data-open={open ? "" : undefined}
    >
      {name ? (
        <input type="hidden" name={name} value={currentValue} readOnly />
      ) : null}

      <button
        ref={triggerRef}
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-required={required || undefined}
        className="dashboard-select-trigger"
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={handleTriggerKeyDown}
      >
        <span
          className="dashboard-select-value"
          data-placeholder={displayPlaceholder ? "" : undefined}
        >
          {displayLabel}
        </span>
        <ChevronIcon className="dashboard-select-chevron" />
      </button>

      {typeof document !== "undefined" && menu
        ? createPortal(
            <div data-surface="dashboard" data-size={fieldSize}>
              {menu}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
});

/**
 * Declarative option — parsed by `DashboardSelect` (not rendered as a native option).
 */
export function DashboardSelectOption(_props: DashboardSelectOptionProps) {
  return null;
}

export function dashboardSelectClassName(className?: string) {
  return cn("dashboard-select", className);
}
