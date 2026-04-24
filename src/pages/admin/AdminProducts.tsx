import { Link } from "react-router-dom";
import { Plus, Search, Image as ImageIcon, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { AdminLayout, AdminTopBar } from "@/components/admin/AdminSidebar";
import { StatusBadge } from "@/components/shop/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { products, formatNGN, categories } from "@/lib/mock-data";

export default function AdminProducts() {
  return (
    <AdminLayout>
      <AdminTopBar
        count={String(products.length)}
        title="Products"
        subtitle="Manage your catalog"
        action={
          <Button asChild className="gap-1.5">
            <Link to="/admin/products/new"><Plus className="h-4 w-4" /> Add product</Link>
          </Button>
        }
      />

      <div className="p-7 space-y-5">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-10 rounded-full bg-muted border-transparent" />
          </div>
          <Select>
            <SelectTrigger className="w-[200px] rounded-full"><SelectValue placeholder="Filter by category" /></SelectTrigger>
            <SelectContent>
              {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-[20px] border border-border/60 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-10"><Checkbox /></TableHead>
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p, i) => (
                <TableRow key={p.id}>
                  <TableCell><Checkbox /></TableCell>
                  <TableCell>
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${["bg-tile-mint","bg-tile-butter","bg-tile-peach","bg-tile-sky","bg-tile-mist"][i % 5]}`}>
                      <ImageIcon className="h-4 w-4 text-foreground/30" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="capitalize text-muted-foreground">{p.category}</TableCell>
                  <TableCell>{formatNGN(p.price)}</TableCell>
                  <TableCell><StatusBadge status={p.isActive ? "Active" : "Inactive"} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8"><Link to={`/admin/products/${p.id}/edit`}><Pencil className="h-3.5 w-3.5" /></Link></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between p-4 border-t border-border/60 text-sm text-muted-foreground">
            <span>Showing 1-8 of 23</span>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
