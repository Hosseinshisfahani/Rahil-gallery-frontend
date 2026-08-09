import { CustomersListView } from "@/app/admin/_components/customers";
import { AdminShell } from "@/app/admin/_components/layout/admin-shell";

export default function AdminCustomersPage() {
  return (
    <AdminShell
      titleKey="customers.title"
      subtitleKey="customers.subtitle"
      includeDate
    >
      <CustomersListView />
    </AdminShell>
  );
}
