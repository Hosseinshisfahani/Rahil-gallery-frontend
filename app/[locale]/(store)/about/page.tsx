import { notFound, redirect } from "next/navigation";
import { isStoreLocale } from "@/lib/locale";

export default async function AboutIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isStoreLocale(locale)) notFound();
  redirect(`/${locale}/about/history`);
}
