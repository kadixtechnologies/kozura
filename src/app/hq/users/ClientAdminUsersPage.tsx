"use client";

import { useState } from "react";
import { AdminLayout, AdminTopBar } from "@/components/admin/AdminSidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TablePagination } from "@/components/shared/TablePagination";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { updateUserStatus } from "@/actions/admin";

export function ClientAdminUsersPage({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
      <div className="p-4 sm:p-7">
        <div className="rounded-[20px] border border-border/60 bg-background">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent"><TableHead>Seller Name</TableHead><TableHead className="hidden sm:table-cell">Contact Info</TableHead><TableHead className="hidden sm:table-cell">Store</TableHead><TableHead className="hidden sm:table-cell">Status</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No sellers found</TableCell></TableRow>
              ) : paginatedUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="font-medium">{u.name}</div>
                    <div className="sm:hidden text-[11px] text-muted-foreground mt-0.5">{u.email} • {u.store}</div>
                    <div className="sm:hidden mt-1"><span className={`inline-flex items-center rounded-full px-2 py-0 text-[10px] font-semibold ${u.active ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>{u.active ? "Active" : "Suspended"}</span></div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell"><div className="flex flex-col"><span>{u.email}</span><span className="text-xs text-muted-foreground">{u.phone}</span></div></TableCell>
                  <TableCell className="hidden sm:table-cell">{u.store}</TableCell>
                  <TableCell className="hidden sm:table-cell"><span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${u.active ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>{u.active ? "Active" : "Suspended"}</span></TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="rounded-xl h-8 text-[11px] sm:text-xs" onClick={() => toggleUser(u.id)} disabled={loadingId === u.id}>
                      {loadingId === u.id ? <Loader2 className="h-4 w-4 animate-spin" /> : u.active ? "Suspend" : "Restore"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {users.length > 0 && (
            <TablePagination
              currentPage={currentPage}
              totalCount={users.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(v) => { setItemsPerPage(v); setCurrentPage(1); }}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
