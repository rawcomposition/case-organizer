import type { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, SlidersHorizontal, Search, Download, WrapText } from "lucide-react";
import { exportCases } from "@/lib/export";
import { COLUMN_LABELS } from "./columns";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

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
  const reviewMode = useUIStore((s) => s.reviewMode);
  const toggleReviewMode = useUIStore((s) => s.toggleReviewMode);
  return (
    <div className="flex items-center justify-center pb-6 print:hidden">
      <div className="flex items-center gap-2 bg-secondary/60 p-2 rounded-full">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cases..."
            value={globalFilter}
            onChange={(e) => onGlobalFilterChange(e.target.value)}
            className="pl-10 w-72 h-10 bg-white border-0 shadow-none"
          />
        </div>
        <Button onClick={onAddCase}>
          <Plus className="mr-1.5 h-4 w-4" />
          Add Case
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  onSelect={(e) => e.preventDefault()}
                >
                  {COLUMN_LABELS[column.id] ?? column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant={reviewMode ? "default" : "ghost"}
          size="icon"
          onClick={toggleReviewMode}
          title={reviewMode ? "Review mode on" : "Review mode off"}
          aria-pressed={reviewMode}
          className={cn(reviewMode && "shadow-none")}
        >
          <WrapText className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={exportCases}>
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
