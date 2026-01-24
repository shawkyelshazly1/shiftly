import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  serverPagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  onPaginationChange?: (page: number, pageSize: number) => void;
  selectedCount?: number;
}

export function DataTablePagination<TData>({
  table,
  serverPagination,
  onPaginationChange,
  selectedCount,
}: DataTablePaginationProps<TData>) {
  const isServerSide = !!serverPagination && !!onPaginationChange;

  const page = isServerSide
    ? serverPagination.page
    : table.getState().pagination.pageIndex + 1;
  const pageSize = isServerSide
    ? serverPagination.pageSize
    : table.getState().pagination.pageSize;
  const totalPages = isServerSide
    ? serverPagination.totalPages
    : table.getPageCount();
  const total = isServerSide
    ? serverPagination.total
    : table.getFilteredRowModel().rows.length;

  const canPreviousPage = isServerSide ? page > 1 : table.getCanPreviousPage();
  const canNextPage = isServerSide ? page < totalPages : table.getCanNextPage();

  const goToPage = (newPage: number) => {
    if (isServerSide) {
      onPaginationChange(newPage, pageSize);
    } else {
      table.setPageIndex(newPage - 1);
    }
  };

  const setPageSizeValue = (size: number) => {
    if (isServerSide) {
      onPaginationChange(1, size);
    } else {
      table.setPageSize(size);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {selectedCount !== undefined && selectedCount > 0 ? (
          <span className="font-medium text-foreground">
            {selectedCount} of {total} row{total !== 1 ? "s" : ""} selected
          </span>
        ) : (
          <span>{total} result{total !== 1 ? "s" : ""}</span>
        )}
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:space-x-6 lg:space-x-8">
        <div className="hidden sm:flex items-center space-x-2">
          <p className="text-sm font-medium whitespace-nowrap">Rows per page</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => setPageSizeValue(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 50, 100].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between sm:justify-start gap-2">
          <div className="flex items-center justify-center text-sm font-medium whitespace-nowrap">
            <span className="sm:hidden">{page}/{totalPages}</span>
            <span className="hidden sm:inline">Page {page} of {totalPages}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 sm:flex"
              onClick={() => goToPage(1)}
              disabled={!canPreviousPage}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => goToPage(page - 1)}
              disabled={!canPreviousPage}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => goToPage(page + 1)}
              disabled={!canNextPage}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 sm:flex"
              onClick={() => goToPage(totalPages)}
              disabled={!canNextPage}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
