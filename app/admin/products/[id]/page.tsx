import { ProductDetailView } from "@/_components/surfaces/dashboard/products";
import { TranslatedAdminShell } from "@/_components/surfaces/dashboard/layout/translated-admin-shell";

export default async function AdminProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <TranslatedAdminShell titleKey="products.productTitle" subtitleSuffix={id}>
      <ProductDetailView productId={id} />
    </TranslatedAdminShell>
  );
}
