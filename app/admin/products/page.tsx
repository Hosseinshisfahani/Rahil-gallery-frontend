import { ProductsListView } from "@/app/admin/_components/products";
import { AdminShell } from "@/app/admin/_components/layout/admin-shell";

export default function AdminProductsPage() {
  return (
    <AdminShell
      titleKey="products.title"
      subtitleKey="products.subtitle"
      includeDate
    >
      <ProductsListView />
    </AdminShell>
  );
}
