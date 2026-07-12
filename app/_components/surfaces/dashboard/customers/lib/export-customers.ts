import type { CustomerSummary } from "@/lib/api/customers/types";

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportCustomersToCsv(customers: CustomerSummary[]): string {
  const headers = [
    "Customer ID",
    "Full Name",
    "Phone",
    "Email",
    "Customer Type",
    "Age Range",
    "Gender",
    "Product Categories",
    "Created At",
  ];

  const rows = customers.map((c) =>
    [
      c.id,
      c.fullName,
      c.phone,
      "",
      c.customerType ?? "",
      c.customerAgeRange ?? "",
      c.gender ?? "",
      (c.purchasedCategories ?? []).join("; "),
      c.createdAt,
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
