import {
  CUSTOMER_DETAIL_PAGE_ENABLED,
  CustomerDetailView,
} from "@/app/admin/_components/customers";
import { AdminShell } from "@/app/admin/_components/layout/admin-shell";
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
    <AdminShell titleKey="customers.profileTitle">
      <CustomerDetailView customerId={id} />
    </AdminShell>
  );
}
