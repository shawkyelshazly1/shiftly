import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  RowSelectionState,
  Row,
} from "@tanstack/react-table";
import { useState, useEffect, useRef, ReactNode, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

export type FilterOption = {
  value: string;
  label: string;
};

export type FilterConfig = {
  key: string;
  label: string;
  options: FilterOption[];
  value?: string;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  onPaginationChange?: (page: number, pageSize: number) => void;
  onSearchChange?: (search: string) => void;
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
  filters?: FilterConfig[];
  onFilterChange?: (key: string, value: string | undefined) => void;
  isLoading?: boolean;
  enableRowSelection?: boolean;
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  getRowId?: (row: TData) => string;
  renderMobileCard?: (row: Row<TData>) => ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder,
  pagination,
  onPaginationChange,
  onSearchChange,
  onSortChange,
  filters,
  onFilterChange,
  isLoading,
  enableRowSelection = false,
  onRowSelectionChange,
  getRowId,
  renderMobileCard,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const prevDataRef = useRef(data);
  const isResettingRef = useRef(false);
  const isInitialSortingMount = useRef(true);

  useEffect(() => {
    // Skip the initial mount to prevent triggering sort with empty state
    if (isInitialSortingMount.current) {
      isInitialSortingMount.current = false;
      return;
    }
    if (sorting.length > 0 && onSortChange) {
      const { id, desc } = sorting[0];
      onSortChange(id, desc ? "desc" : "asc");
    }
  }, [sorting, onSortChange]);

  // Reset row selection when data changes (e.g., pagination)
  useEffect(() => {
    if (prevDataRef.current !== data) {
      prevDataRef.current = data;
      isResettingRef.current = true;
      setRowSelection({});
    }
  }, [data]);

  // Memoize selected rows to avoid recalculating on every render
  const selectedRows = useMemo(() => {
    const selectedIndices = Object.keys(rowSelection).filter(
      (key) => rowSelection[key]
    );
    return selectedIndices.map((index) => data[parseInt(index)]).filter(Boolean);
  }, [rowSelection, data]);

  // Notify parent of selection changes (but not during reset)
  useEffect(() => {
    if (isResettingRef.current) {
      isResettingRef.current = false;
      if (onRowSelectionChange) {
        onRowSelectionChange([]);
      }
      return;
    }
    if (onRowSelectionChange) {
      onRowSelectionChange(selectedRows);
    }
  }, [selectedRows, onRowSelectionChange]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: pagination ? undefined : getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: enableRowSelection ? setRowSelection : undefined,
    enableRowSelection,
    getRowId: getRowId ? (row) => getRowId(row) : undefined,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    manualPagination: !!pagination,
    pageCount: pagination?.totalPages ?? -1,
  });

  const selectedCount = Object.keys(rowSelection).filter(
    (key) => rowSelection[key]
  ).length;

  return (
    <div className="space-y-4">
      {(searchKey || onSearchChange || filters) && (
        <DataTableToolbar
          table={table}
          searchKey={searchKey}
          searchPlaceholder={searchPlaceholder}
          onSearchChange={onSearchChange}
          filters={filters}
          onFilterChange={onFilterChange}
        />
      )}

      {/* Desktop Table View */}
      <div className="rounded-md border hidden md:block">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-lg border p-4">
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        ) : table.getRowModel().rows?.length ? (
          <div className="space-y-3">
            {table.getRowModel().rows.map((row) => (
              renderMobileCard ? (
                <div key={row.id}>{renderMobileCard(row)}</div>
              ) : (
                <div
                  key={row.id}
                  className="rounded-lg border bg-card p-4"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {/* Default mobile view - shows cells vertically */}
                  <div className="space-y-2">
                    {row.getVisibleCells().map((cell) => {
                      const columnId = cell.column.id;
                      if (columnId === "select") {
                        return (
                          <div key={cell.id} className="flex items-center gap-2">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            <span className="text-sm text-muted-foreground">Select</span>
                          </div>
                        );
                      }
                      if (columnId === "actions") {
                        return (
                          <div key={cell.id} className="flex justify-end pt-2 border-t mt-2">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        );
                      }
                      return (
                        <div key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            ))}
          </div>
        ) : (
          <div className="rounded-lg border p-8 text-center text-muted-foreground">
            No results.
          </div>
        )}
      </div>

      <DataTablePagination
          table={table}
          serverPagination={pagination}
          onPaginationChange={onPaginationChange}
          selectedCount={enableRowSelection ? selectedCount : undefined}
        />
    </div>
  );
}
