import { CustomerDetailView } from "@/_components/surfaces/dashboard/customers";
import { CUSTOMER_DETAIL_PAGE_ENABLED } from "@/_components/surfaces/dashboard/customers/lib/customer-detail-enabled";
import { TranslatedAdminShell } from "@/_components/surfaces/dashboard/layout/translated-admin-shell";
import { redirect } from "next/navigation";

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!CUSTOMER_DETAIL_PAGE_ENABLED) {
    redirect("/admin/customers");
  }

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
