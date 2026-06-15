import type { CustomerFilters } from "./filter-customers";
import {
  getActiveFilterChips,
  type CustomerFilterTranslate,
} from "./filter-customers";
import type { CustomerTag } from "../../data/mock-customers";

/** Human-readable lines for the save-filters modal preview. */
export function filtersToSaveSummary(
  filters: CustomerFilters,
  t: CustomerFilterTranslate,
  tagLabel: (tag: CustomerTag) => string = (tag) => tag,
): string[] {
  const lines: string[] = [];

  if (filters.query.trim()) {
    lines.push(t("common.searchPrefix", { query: filters.query.trim() }));
  }

  const chips = getActiveFilterChips(filters, () => {}, t, tagLabel);
  for (const chip of chips) {
    lines.push(chip.label);
  }

  return lines;
}
