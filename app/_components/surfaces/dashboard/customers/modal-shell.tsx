"use client";

import { Button } from "@/_components/core/primitive/button";
import { useAdminT } from "../layout/admin-locale-provider";

export interface ModalShellProps {
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer: React.ReactNode;
  size?: "md" | "lg" | "xl";
}

const sizeClasses = {
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function ModalShell({
  title,
  description,
  onClose,
  children,
  footer,
  size = "md",
}: ModalShellProps) {
  const { t } = useAdminT();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        className={`relative flex max-h-[90vh] w-full flex-col rounded-[var(--radius-lg)] border border-border bg-surface shadow-xl ${sizeClasses[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute end-4 top-4 z-10 text-ink-muted hover:text-ink"
          aria-label={t("common.closeDialog")}
        >
          ✕
        </button>
        <div className="shrink-0 border-b border-border/60 px-6 pb-4 pt-6 pe-12">
          <h2 id="modal-title" className="text-lg font-semibold text-ink">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm text-ink-muted">{description}</p>
          )}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">{children}</div>
        <div className="shrink-0 border-t border-border/60 px-6 py-4">
          <div className="flex justify-end gap-3">{footer}</div>
        </div>
      </div>
    </div>
  );
}

export interface ModalConfirmFooterProps {
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel: string;
  confirmDisabled?: boolean;
  confirmClassName?: string;
  loading?: boolean;
}

export function ModalConfirmFooter({
  onClose,
  onConfirm,
  confirmLabel,
  confirmDisabled,
  confirmClassName,
  loading,
}: ModalConfirmFooterProps) {
  const { t } = useAdminT();

  return (
    <>
      <Button variant="ghost" onClick={onClose} disabled={loading}>
        {t("common.cancel")}
      </Button>
      <Button
        variant="primary"
        className={confirmClassName}
        disabled={confirmDisabled || loading}
        onClick={onConfirm}
      >
        {loading ? t("common.pleaseWait") : confirmLabel}
      </Button>
    </>
  );
}
