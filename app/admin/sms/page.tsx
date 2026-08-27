import { SmsReportsView } from "@/app/admin/_components/sms";
import { AdminShell } from "@/app/admin/_components/layout/admin-shell";

export default function AdminSmsPage() {
  return (
    <AdminShell titleKey="sms.title" subtitleKey="sms.subtitle" includeDate>
      <SmsReportsView />
    </AdminShell>
  );
}
