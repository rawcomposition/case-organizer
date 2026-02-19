import type { ColumnDef } from "@tanstack/react-table";
import type { Case } from "@/lib/types";
import { FinalizedCell } from "./finalized-cell";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Case>[] = [
  {
    accessorKey: "mrn",
    header: "MRN",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("mrn")}</span>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.getValue("category")}</Badge>
    ),
  },
  {
    accessorKey: "finalized",
    header: "Finalized",
    cell: ({ row }) => <FinalizedCell value={row.getValue("finalized")} />,
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => {
      const notes: string = row.getValue("notes");
      return (
        <span className="max-w-[400px] truncate block text-muted-foreground">
          {notes || "—"}
        </span>
      );
    },
  },
];
