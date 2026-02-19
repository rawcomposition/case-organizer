import type { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, SlidersHorizontal, Search } from "lucide-react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  onAddCase: () => void;
}

export function DataTableToolbar<TData>({
  table,
  globalFilter,
  onGlobalFilterChange,
  onAddCase,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between gap-4 pb-4">
      <div className="relative max-w-sm flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search cases..."
          value={globalFilter}
          onChange={(e) => onGlobalFilterChange(e.target.value)}
          className="pl-9 h-10"
        />
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={onAddCase}>
          <Plus className="mr-2 h-4 w-4" />
          Add Case
        </Button>
      </div>
    </div>
  );
}
