import type { CustomerSummary } from "../../data/mock-customers";

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportCustomersToCsv(customers: CustomerSummary[]): string {
  const headers = [
    "User ID",
    "Full Name",
    "Phone",
    "Registration Date",
    "Last Activity",
    "Total Orders",
    "Total LTV",
    "Segment",
    "Status",
    "VIP",
    "Tags",
    "Last Purchase",
  ];

  const rows = customers.map((c) =>
    [
      c.id,
      c.fullName,
      c.phone,
      c.registeredAt,
      c.lastActivityAt,
      String(c.totalOrders),
      String(c.totalLtv),
      c.segment,
      c.status,
      c.isVip ? "yes" : "no",
      c.tags.join("; "),
      c.lastPurchaseDate ?? "",
    ]
      .map(escapeCsvField)
      .join(","),
  );

  return [headers.join(","), ...rows].join("\n");
}

export function downloadCsv(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
