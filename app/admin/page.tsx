import { redirect } from "next/navigation";
import { ADMIN_DEFAULT_ROUTE } from "@/lib/admin-routes";

export default function AdminDashboardPage() {
  redirect(ADMIN_DEFAULT_ROUTE);
}
