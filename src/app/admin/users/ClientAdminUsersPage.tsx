"use client";

import { useState } from "react";
import { AdminLayout, AdminTopBar } from "@/components/admin/AdminSidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
      <div className="p-7">
        <div className="rounded-[20px] border border-border/60 bg-background">
          <Table>
            <TableHeader><TableRow className="hover:bg-transparent"><TableHead>Seller Name</TableHead><TableHead>Contact Info</TableHead><TableHead>Store</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No sellers found</TableCell></TableRow>
              ) : paginatedUsers.map((u) => (
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
          {users.length > 0 && (
            <div className="p-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground gap-4">
              <div className="flex items-center gap-2">
                <span>Show</span>
                <Select value={String(itemsPerPage)} onValueChange={(v) => { setItemsPerPage(Number(v)); setCurrentPage(1); }}>
                  <SelectTrigger className="h-8 w-16 text-xs rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, users.length)} of {users.length}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="rounded-xl h-8" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Prev</Button>
                <Button variant="outline" size="sm" className="rounded-xl h-8" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0}>Next</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
