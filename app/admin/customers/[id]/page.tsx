import { CustomerDetailView } from "@/_components/surfaces/dashboard/customers";
import { TranslatedAdminShell } from "@/_components/surfaces/dashboard/layout/translated-admin-shell";

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <TranslatedAdminShell
      titleKey="customers.profileTitle"
      subtitleSuffix={id}
    >
      <CustomerDetailView customerId={id} />
    </TranslatedAdminShell>
  );
}
