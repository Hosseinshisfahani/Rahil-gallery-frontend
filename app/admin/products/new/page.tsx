import { ProductCreateView } from "@/_components/surfaces/dashboard/products";
import { TranslatedAdminShell } from "@/_components/surfaces/dashboard/layout/translated-admin-shell";

export default function AdminProductCreatePage() {
  return (
    <TranslatedAdminShell
      titleKey="products.newProduct"
      subtitleKey="products.newProductSubtitle"
    >
      <ProductCreateView />
    </TranslatedAdminShell>
  );
}
