import { ProductCreateView } from "@/app/admin/_components/products";
import { AdminShell } from "@/app/admin/_components/layout/admin-shell";

export default function AdminProductCreatePage() {
  return (
    <AdminShell
      titleKey="products.newProduct"
      subtitleKey="products.newProductSubtitle"
    >
      <ProductCreateView />
    </AdminShell>
  );
}
