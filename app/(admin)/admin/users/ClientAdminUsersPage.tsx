"use client";

import { useState } from "react";
import { AdminLayout, AdminTopBar } from "@/components/admin/AdminSidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { updateUserStatus } from "@/app/actions/admin";

export function ClientAdminUsersPage({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const toggleUser = async (id: string) => { 
    setLoadingId(id);
    const user = users.find(u => u.id === id)!;
    const isSuspended = user.active; // If active, we suspend
    
    const res = await updateUserStatus(id, isSuspended);
    if (res.success) {
      setUsers(users.map(u => u.id === id ? { ...u, active: !u.active } : u));
      toast.success(`${user.name} has been ${isSuspended ? "suspended" : "restored"}`);
    } else {
      toast.error(res.error || "Failed to update user status");
    }
    setLoadingId(null);
  };

  return (
    <AdminLayout>
      <AdminTopBar title="Sellers" count={String(users.length)} subtitle="All registered sellers on platform" />
      <div className="p-7">
        <div className="rounded-[20px] border border-border/60 bg-background">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent"><TableHead>Seller Name</TableHead><TableHead>Contact Info</TableHead><TableHead>Store</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell><div className="flex flex-col"><span>{u.email}</span><span className="text-xs text-muted-foreground">{u.phone}</span></div></TableCell>
                  <TableCell>{u.store}</TableCell>
                  <TableCell><span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${u.active ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>{u.active ? "Active" : "Suspended"}</span></TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => toggleUser(u.id)} disabled={loadingId === u.id}>
                      {loadingId === u.id ? <Loader2 className="h-4 w-4 animate-spin" /> : u.active ? "Suspend" : "Restore"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
