import { cn } from "@/lib/utils";

export function ResponsiveTable({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("dashboard-table-wrap", className)}>
      <table className="dashboard-table w-full text-sm">{children}</table>
    </div>
  );
}

export const tableHeadRowClass =
  "border-b border-border text-start text-ink-muted";

export const tableBodyRowClass =
  "border-b border-border/60 transition-colors last:border-0 hover:bg-surface-elevated/80";

export const tableThClass = "pb-3 pe-4 font-medium";

export type TableCellLayout = "inline" | "stack" | "actions";

export function TableCell({
  label,
  children,
  className,
  layout = "inline",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  layout?: TableCellLayout;
}) {
  return (
    <td
      data-label={label}
      data-layout={layout}
      className={cn("py-3 pe-4", className)}
    >
      {children}
    </td>
  );
}
