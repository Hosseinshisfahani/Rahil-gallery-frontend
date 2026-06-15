"use client";

import { Badge } from "@/_components/core/primitive/badge";
import type {
  CustomerSegment,
  CustomerStatus,
} from "../data/mock-customers";
import { useAdminT } from "../layout/admin-locale-provider";

const segmentVariants: Record<
  CustomerSegment,
  "default" | "success" | "accent" | "info" | "warning"
> = {
  new: "info",
  active: "success",
  returning: "accent",
  vip: "accent",
  inactive: "default",
};

export function CustomerSegmentBadge({
  segment,
  className,
}: {
  segment: CustomerSegment;
  className?: string;
}) {
  const { t } = useAdminT();
  return (
    <Badge variant={segmentVariants[segment]} className={className}>
      {t(`customers.segment.${segment}`)}
    </Badge>
  );
}

export function CustomerStatusBadge({
  status,
  className,
}: {
  status: CustomerStatus;
  className?: string;
}) {
  const { t } = useAdminT();
  return (
    <Badge
      variant={status === "active" ? "success" : "error"}
      className={className}
    >
      {t(`customers.accountStatus.${status}`)}
    </Badge>
  );
}

export function VipBadge({ className }: { className?: string }) {
  const { t } = useAdminT();
  return (
    <Badge variant="accent" className={className}>
      {t("customers.segment.vip")}
    </Badge>
  );
}
