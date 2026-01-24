import { useState, useCallback } from "react";
import { PaginationParams } from "@/types/pagination.types";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

export function useTableState(initialParams?: Partial<PaginationParams>) {
  const [params, setParams] = useState<PaginationParams>({
    page: initialParams?.page ?? DEFAULT_PAGE,
    pageSize: initialParams?.pageSize ?? DEFAULT_PAGE_SIZE,
    search: initialParams?.search,
    sortBy: initialParams?.sortBy,
    sortOrder: initialParams?.sortOrder,
    roleId: initialParams?.roleId,
    teamId: initialParams?.teamId,
  });

  const handlePaginationChange = useCallback((page: number, pageSize: number) => {
    setParams((prev) => ({ ...prev, page, pageSize }));
  }, []);

  const handleSearchChange = useCallback((search: string) => {
    setParams((prev) => ({ ...prev, search: search || undefined, page: 1 }));
  }, []);

  const handleSortChange = useCallback(
    (sortBy: string, sortOrder: "asc" | "desc") => {
      setParams((prev) => ({ ...prev, sortBy, sortOrder }));
    },
    []
  );

  const handleFilterChange = useCallback(
    (key: keyof PaginationParams, value: string | undefined) => {
      setParams((prev) => ({ ...prev, [key]: value || undefined, page: 1 }));
    },
    []
  );

  const resetParams = useCallback(() => {
    setParams({
      page: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
    });
  }, []);

  return {
    params,
    setParams,
    handlePaginationChange,
    handleSearchChange,
    handleSortChange,
    handleFilterChange,
    resetParams,
  };
}
