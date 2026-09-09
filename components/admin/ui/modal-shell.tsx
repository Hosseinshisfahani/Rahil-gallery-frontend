"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useAdminT } from "@/app/admin/_components/layout/admin-locale-provider";

export interface ModalShellProps {
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer: React.ReactNode;
  size?: "md" | "lg" | "xl";
}

const sizeClasses = {
  md: "sm:max-w-md",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-4xl",
} as const;

/**
 * Admin dialog shell — thin wrapper over shadcn/Radix Dialog
 * (portal, focus trap, Escape, scroll lock).
 */
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
    <Dialog
      open
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent
        closeLabel={t("common.closeDialog")}
        className={cn(
          "flex max-h-[90dvh] w-full min-w-0 flex-col gap-0 overflow-hidden bg-surface p-0 text-ink ring-border",
          sizeClasses[size],
        )}
      >
        <DialogHeader className="shrink-0 gap-1 border-b border-border/60 px-4 pb-4 pt-5 pe-12 text-start sm:px-6 sm:pt-6">
          <DialogTitle className="text-lg font-semibold text-ink">
            {title}
          </DialogTitle>
          {description ? (
            <DialogDescription className="text-sm text-ink-muted">
              {description}
            </DialogDescription>
          ) : null}
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">{children}</div>
        <DialogFooter className="mx-0 mb-0 shrink-0 flex-row flex-wrap justify-end gap-3 rounded-none border-border/60 bg-transparent p-4 pt-4 sm:p-6">
          {footer}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
