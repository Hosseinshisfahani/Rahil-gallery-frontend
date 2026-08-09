import { cn } from "@/lib/utils";

export function ResponsiveTable({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)}>
      <table
        className={cn(
          "w-full text-sm",
          "max-lg:[&_thead]:hidden",
          "max-lg:[&_tbody_tr]:mb-3 max-lg:[&_tbody_tr]:block max-lg:[&_tbody_tr]:rounded-[var(--radius-md)] max-lg:[&_tbody_tr]:border max-lg:[&_tbody_tr]:border-border max-lg:[&_tbody_tr]:bg-surface max-lg:[&_tbody_tr]:px-3 max-lg:[&_tbody_tr]:py-1",
          "max-lg:[&_tbody_tr:last-child]:mb-0",
        )}
      >
        {children}
      </table>
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
      className={cn(
        "py-3 pe-4",
        "max-lg:flex max-lg:items-center max-lg:justify-between max-lg:gap-4 max-lg:border-b max-lg:border-border/55 max-lg:py-2.5 max-lg:pe-0 max-lg:text-end",
        "max-lg:before:shrink-0 max-lg:before:text-start max-lg:before:text-xs max-lg:before:font-medium max-lg:before:text-ink-muted max-lg:before:content-[attr(data-label)]",
        "max-lg:last:border-b-0",
        layout === "stack" &&
          "max-lg:flex-col max-lg:items-stretch max-lg:text-start max-lg:before:mb-1",
        layout === "actions" &&
          "max-lg:flex-col max-lg:items-stretch max-lg:gap-2 max-lg:[&>div]:flex max-lg:[&>div]:flex-wrap max-lg:[&>div]:justify-end max-lg:[&>div]:gap-2",
        className,
      )}
    >
      {children}
    </td>
  );
}
