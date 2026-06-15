import { ProductsListView } from "@/_components/surfaces/dashboard/products";
import { TranslatedAdminShell } from "@/_components/surfaces/dashboard/layout/translated-admin-shell";

export default function AdminProductsPage() {
  return (
    <TranslatedAdminShell
      titleKey="products.title"
      subtitleKey="products.subtitle"
      includeDate
    >
      <ProductsListView />
    </TranslatedAdminShell>
  );
}
