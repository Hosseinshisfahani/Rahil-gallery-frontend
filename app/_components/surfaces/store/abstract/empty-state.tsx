import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/_components/core/config/variants";
import { Button } from "@/_components/core/primitive/button";

export interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className,
  icon,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-16 text-center",
        className,
      )}
    >
      <div
        className="flex size-16 items-center justify-center rounded-full border border-border bg-surface"
        aria-hidden={!icon}
      >
        {icon ?? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-ink-subtle"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M8 12h8" />
          </svg>
        )}
      </div>
      <div className="flex max-w-sm flex-col gap-2">
        <h3 className="font-display text-xl font-bold">{title}</h3>
        {description && (
          <p className="text-sm text-ink-muted">{description}</p>
        )}
      </div>
      {actionLabel &&
        (actionHref ? (
          <Link
            href={actionHref}
            className={buttonVariants({ variant: "secondary" })}
          >
            {actionLabel}
          </Link>
        ) : (
          <Button variant="secondary" onClick={onAction}>
            {actionLabel}
          </Button>
        ))}
    </div>
  );
}
