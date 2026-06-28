"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TablePaginationProps {
  currentPage: number;
  totalCount: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (perPage: number) => void;
}

/**
 * Reusable pagination bar for data tables (orders, products, etc.).
 * Shows a per-page selector, a "X–Y of N" counter, and Prev/Next buttons.
 */
export function TablePagination({
  currentPage,
  totalCount,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: TablePaginationProps) {
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const from = (currentPage - 1) * itemsPerPage + 1;
  const to = Math.min(currentPage * itemsPerPage, totalCount);

  return (
    <div className="p-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground gap-2 sm:gap-4">
      <div className="flex items-center justify-between w-full sm:w-auto">
        <div className="flex items-center gap-2">
          <span className="text-[13px] sm:text-sm">Show</span>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(v) => {
              onItemsPerPageChange(Number(v));
              onPageChange(1);
            }}
          >
            <SelectTrigger className="h-8 w-16 text-[11px] sm:text-xs rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="sm:hidden text-[11px]">
          Showing {from} to {to} of {totalCount}
        </div>
      </div>

      <div className="hidden sm:block">
        Showing {from} to {to} of {totalCount}
      </div>

      <div className="flex items-center justify-end w-full sm:w-auto gap-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl h-8 text-[11px] sm:text-xs"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          Prev
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl h-8 text-[11px] sm:text-xs"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
