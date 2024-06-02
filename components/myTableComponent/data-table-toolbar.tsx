"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { appointmentStatus, visitStatus, waitingStatus } from "./data";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters?.length > 0;
  const query = useSearchParams().get("query");
  const pathname = usePathname();

  useEffect(() => {
    if (query) {
      table.setGlobalFilter(query);
    }
  }, []);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={query ? query : "Search ..."}
          onChange={(event) => {
            table.setGlobalFilter(event.target.value || undefined);
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={
              pathname.includes("visits")
                ? visitStatus
                : pathname.includes("waiting")
                ? waitingStatus
                : appointmentStatus
            }
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3">
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
