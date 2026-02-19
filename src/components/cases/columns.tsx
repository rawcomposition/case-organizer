import type { ColumnDef } from "@tanstack/react-table";
import type { Case } from "@/lib/types";
import { FinalizedCell } from "./finalized-cell";

export const COLUMN_LABELS: Record<string, string> = {
  mrn: "MRN",
  finalized: "Finalized",
  age: "Age",
  gestationalAge: "Gestational Age",
  gravida: "Gravida",
  para: "Para",
  nightsInHospital: "Nights in Hospital",
  antepartum: "Antepartum",
  deliveryPostpartum: "Delivery / Postpartum",
  proceduresTreatments: "Procedures / Treatments",
  notes: "Notes",
};

export const columns: ColumnDef<Case>[] = [
  {
    accessorKey: "mrn",
    header: "MRN",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("mrn")}</span>
    ),
  },
  {
    accessorKey: "finalized",
    header: "Finalized",
    cell: ({ row }) => <FinalizedCell value={row.getValue("finalized")} />,
  },
  {
    accessorKey: "age",
    header: "Age",
    cell: ({ row }) => row.getValue("age") ?? "—",
  },
  {
    accessorKey: "gestationalAge",
    header: "GA",
    cell: ({ row }) => row.getValue("gestationalAge") || "—",
  },
  {
    accessorKey: "gravida",
    header: "Gravida",
    cell: ({ row }) => row.getValue("gravida") ?? "—",
  },
  {
    accessorKey: "para",
    header: "Para",
    cell: ({ row }) => row.getValue("para") ?? "—",
  },
  {
    accessorKey: "nightsInHospital",
    header: "Nights",
    cell: ({ row }) => row.getValue("nightsInHospital") ?? "—",
  },
  {
    accessorKey: "antepartum",
    header: "Antepartum",
    cell: ({ row }) => {
      const val: string = row.getValue("antepartum");
      return (
        <span className="max-w-[200px] truncate block text-muted-foreground">
          {val || "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "deliveryPostpartum",
    header: "Delivery",
    cell: ({ row }) => {
      const val: string = row.getValue("deliveryPostpartum");
      return (
        <span className="max-w-[200px] truncate block text-muted-foreground">
          {val || "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "proceduresTreatments",
    header: "Procedures",
    cell: ({ row }) => {
      const val: string = row.getValue("proceduresTreatments");
      return (
        <span className="max-w-[200px] truncate block text-muted-foreground">
          {val || "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => {
      const notes: string = row.getValue("notes");
      return (
        <span className="max-w-[200px] truncate block text-muted-foreground">
          {notes || "—"}
        </span>
      );
    },
  },
];
