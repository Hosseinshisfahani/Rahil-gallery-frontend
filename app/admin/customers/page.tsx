import { CustomersListView } from "@/_components/surfaces/dashboard/customers";
import { TranslatedAdminShell } from "@/_components/surfaces/dashboard/layout/translated-admin-shell";

export default function AdminCustomersPage() {
  return (
    <TranslatedAdminShell
      titleKey="customers.title"
      subtitleKey="customers.subtitle"
      includeDate
    >
      <CustomersListView />
    </TranslatedAdminShell>
  );
}
