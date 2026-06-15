import { Badge } from "@/_components/core/primitive/badge";
import { AvailabilityBadge } from "@/_components/shared/inclusive/availability-badge";
import { StatusBadge } from "@/_components/shared/inclusive/status-badge";
import { FilterChipDemos } from "./forms-section";
import { SwatchSection } from "./swatch-section";

export function BadgesSection() {
  return (
    <SwatchSection id="badges" title="Badges & status">
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap gap-3">
          <Badge>Default</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
        </div>
        <div className="flex flex-wrap gap-3">
          <AvailabilityBadge status="in_stock" />
          <AvailabilityBadge status="made_to_order" />
          <AvailabilityBadge status="out_of_stock" />
        </div>
        <div className="flex flex-wrap gap-3">
          <StatusBadge status="pending_payment" />
          <StatusBadge status="in_production" />
          <StatusBadge status="shipped" />
          <StatusBadge status="delivered" />
        </div>
        <FilterChipDemos />
      </div>
    </SwatchSection>
  );
}
