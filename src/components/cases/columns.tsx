import type { ColumnDef } from "@tanstack/react-table";
import type { Case } from "@/lib/types";
import { type CaseTab, getTabConfig } from "@/lib/case-tabs";
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
  preopDiagnosis: "Preop Diagnosis",
  surgicalPathology: "Surgical Pathology",
  complications: "Complications",
  visits: "Visits",
  problem: "Problem",
  diagnosticProcedures: "Diagnostic Procedures",
  treatment: "Treatment",
  result: "Result",
};

function truncatedTextCell(key: string) {
  return ({ row }: { row: { getValue: (k: string) => unknown } }) => {
    const val = row.getValue(key) as string;
    return (
      <span className="max-w-[200px] truncate block text-muted-foreground">
        {val || "—"}
      </span>
    );
  };
}

const ALL_COLUMNS: Record<string, ColumnDef<Case>> = {
  mrn: {
    accessorKey: "mrn",
    header: "MRN",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("mrn")}</span>
    ),
  },
  finalized: {
    accessorKey: "finalized",
    header: "Finalized",
    cell: ({ row }) => <FinalizedCell value={row.getValue("finalized")} />,
  },
  age: {
    accessorKey: "age",
    header: "Age",
    cell: ({ row }) => row.getValue("age") ?? "—",
  },
  gestationalAge: {
    accessorKey: "gestationalAge",
    header: "GA",
    cell: ({ row }) => row.getValue("gestationalAge") || "—",
  },
  gravida: {
    accessorKey: "gravida",
    header: "Gravida",
    cell: ({ row }) => row.getValue("gravida") ?? "—",
  },
  para: {
    accessorKey: "para",
    header: "Para",
    cell: ({ row }) => row.getValue("para") ?? "—",
  },
  nightsInHospital: {
    accessorKey: "nightsInHospital",
    header: "Nights",
    cell: ({ row }) => row.getValue("nightsInHospital") ?? "—",
  },
  antepartum: {
    accessorKey: "antepartum",
    header: "Antepartum",
    cell: truncatedTextCell("antepartum"),
  },
  deliveryPostpartum: {
    accessorKey: "deliveryPostpartum",
    header: "Delivery",
    cell: truncatedTextCell("deliveryPostpartum"),
  },
  proceduresTreatments: {
    accessorKey: "proceduresTreatments",
    header: "Procedures",
    cell: truncatedTextCell("proceduresTreatments"),
  },
  notes: {
    accessorKey: "notes",
    header: "Notes",
    cell: truncatedTextCell("notes"),
  },
  preopDiagnosis: {
    accessorKey: "preopDiagnosis",
    header: "Preop Dx",
    cell: truncatedTextCell("preopDiagnosis"),
  },
  surgicalPathology: {
    accessorKey: "surgicalPathology",
    header: "Surg Path",
    cell: truncatedTextCell("surgicalPathology"),
  },
  complications: {
    accessorKey: "complications",
    header: "Complications",
    cell: truncatedTextCell("complications"),
  },
  visits: {
    accessorKey: "visits",
    header: "Visits",
    cell: ({ row }) => row.getValue("visits") ?? "—",
  },
  problem: {
    accessorKey: "problem",
    header: "Problem",
    cell: truncatedTextCell("problem"),
  },
  diagnosticProcedures: {
    accessorKey: "diagnosticProcedures",
    header: "Diagnostic Procedures",
    cell: truncatedTextCell("diagnosticProcedures"),
  },
  treatment: {
    accessorKey: "treatment",
    header: "Treatment",
    cell: truncatedTextCell("treatment"),
  },
  result: {
    accessorKey: "result",
    header: "Result",
    cell: truncatedTextCell("result"),
  },
};

export function getColumnsForTab(tab: CaseTab): ColumnDef<Case>[] {
  const config = getTabConfig(tab);
  return config.columns.map((key) => ALL_COLUMNS[key]).filter(Boolean);
}

// Keep default export for backwards compat during migration
export const columns = getColumnsForTab("ob");
