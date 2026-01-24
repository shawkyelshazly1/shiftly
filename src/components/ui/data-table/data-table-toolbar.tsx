import { Table } from "@tanstack/react-table";
import { Search, X, Filter } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useDebounce } from "@/hooks/useDebounce";
import type { FilterConfig } from "./data-table";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchKey?: string;
  searchPlaceholder?: string;
  onSearchChange?: (search: string) => void;
  filters?: FilterConfig[];
  onFilterChange?: (key: string, value: string | undefined) => void;
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  searchPlaceholder = "Search...",
  onSearchChange,
  filters,
  onFilterChange,
}: DataTableToolbarProps<TData>) {
  const isServerSide = !!onSearchChange;
  const [searchValue, setSearchValue] = useState("");
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const debouncedSearch = useDebounce(searchValue, 300);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip the initial mount to prevent triggering search with empty string
    // which causes an infinite re-render loop
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (isServerSide) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch, isServerSide, onSearchChange]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (!isServerSide && searchKey) {
      table.getColumn(searchKey)?.setFilterValue(value);
    }
  };

  const handleClear = () => {
    setSearchValue("");
    if (!isServerSide && searchKey) {
      table.getColumn(searchKey)?.setFilterValue("");
    }
  };

  const currentValue = isServerSide
    ? searchValue
    : (table.getColumn(searchKey ?? "")?.getFilterValue() as string) ?? "";

  const activeFilterCount = filters?.filter((f) => f.value).length ?? 0;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        {/* Search Input */}
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={isServerSide ? searchValue : currentValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 pr-9"
          />
          {(isServerSide ? searchValue : currentValue) && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Mobile Filter Button */}
        {filters && filters.length > 0 && (
          <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="sm:hidden shrink-0 relative">
                <Filter className="h-4 w-4" />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto max-h-[80vh]">
              <SheetHeader className="pb-4">
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 pb-4">
                {filters.map((filter) => (
                  <div key={filter.key} className="space-y-2">
                    <label className="text-sm font-medium">{filter.label}</label>
                    <Select
                      value={filter.value || "all"}
                      onValueChange={(val) => {
                        onFilterChange?.(filter.key, val === "all" ? undefined : val);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={filter.label} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All {filter.label}s</SelectItem>
                        {filter.options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
                {activeFilterCount > 0 && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      filters.forEach((filter) => {
                        onFilterChange?.(filter.key, undefined);
                      });
                    }}
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Desktop Filters */}
        <div className="hidden sm:flex flex-wrap gap-2">
          {filters?.map((filter) => (
            <Select
              key={filter.key}
              value={filter.value || "all"}
              onValueChange={(val) => onFilterChange?.(filter.key, val === "all" ? undefined : val)}
            >
              <SelectTrigger className="min-w-[140px] w-[150px]">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {filter.label}s</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      </div>
    </div>
  );
}
