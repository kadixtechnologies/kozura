import { AdminLayout, AdminTopBar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <AdminTopBar title="Platform Settings" subtitle="Configure Kozura" action={<Button>Save Changes</Button>} />
      <div className="p-7 max-w-2xl space-y-8">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">General</h3>
          <div className="space-y-4">
            <div className="grid gap-2"><label className="text-sm font-medium">Platform Name</label><input type="text" defaultValue="Kozura" className="h-10 rounded-xl border border-border px-3 bg-background" /></div>
            <div className="grid gap-2"><label className="text-sm font-medium">Support Email</label><input type="email" defaultValue="support@kozura.com" className="h-10 rounded-xl border border-border px-3 bg-background" /></div>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Global Fees</h3>
          <div className="space-y-4">
            <div className="grid gap-2"><label className="text-sm font-medium">Transaction Fee (%)</label><input type="number" defaultValue="2.5" className="h-10 rounded-xl border border-border px-3 bg-background" /></div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
