import { ProductDetailView } from "@/app/admin/_components/products";
import { AdminShell } from "@/app/admin/_components/layout/admin-shell";

export default async function AdminProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AdminShell titleKey="products.productTitle" subtitleSuffix={id}>
      <ProductDetailView productId={id} />
    </AdminShell>
  );
}
