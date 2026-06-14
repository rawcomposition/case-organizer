import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CellContext, ColumnDef } from "@tanstack/react-table";
import type { Case, CaseFormData } from "@/lib/types";
import { type CaseTab, getTabConfig } from "@/lib/case-tabs";
import { FinalizedCell } from "./finalized-cell";
import { useUIStore } from "@/store/ui-store";
import { useCaseStore } from "@/store/case-store";
import { useTemplateStore } from "@/store/template-store";
import { CharCounter } from "@/components/ui/char-counter";
import { cn } from "@/lib/utils";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData> {
    onRowClick?: (row: Case) => void;
  }
}

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

function TextCell({
  caseId,
  caseTab,
  field,
  value,
}: {
  caseId: string;
  caseTab: CaseTab;
  field: string;
  value: string;
}) {
  const reviewMode = useUIStore((s) => s.reviewMode);
  const updateCase = useCaseStore((s) => s.updateCase);
  const charLimit = useTemplateStore((s) => s.charLimits[`${caseTab}.${field}`] ?? null);
  const [draft, setDraft] = useState(value);
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  // Resync the draft if the underlying value changes (e.g. edited via the dialog)
  useEffect(() => setDraft(value), [value]);

  // Grow the textarea to fit its content so nothing is hidden behind a scrollbar
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [draft, reviewMode]);

  if (!reviewMode) {
    return (
      <span className="max-w-[200px] truncate block text-muted-foreground">
        {value || "—"}
      </span>
    );
  }

  return (
    <div className="relative -mx-4 -my-3">
      <textarea
        ref={ref}
        value={draft}
        rows={3}
        maxLength={charLimit ?? undefined}
        onChange={(e) => setDraft(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          if (draft !== value) {
            updateCase(caseId, { [field]: draft } as Partial<CaseFormData>);
          }
        }}
        className="block min-w-[220px] w-full resize-none overflow-hidden rounded-none border-0 bg-white px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-inset focus:ring-ring"
      />
      {focused && <CharCounter count={draft.length} limit={charLimit} className="absolute -top-2.5 right-3 z-10" />}
    </div>
  );
}

function MrnCell({ row, onClick }: { row: Case; onClick?: (row: Case) => void }) {
  const reviewMode = useUIStore((s) => s.reviewMode);
  return (
    <button
      type="button"
      className={cn(
        "font-medium text-left cursor-pointer",
        reviewMode ? "underline" : "hover:underline"
      )}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(row);
      }}
    >
      {row.mrn}
    </button>
  );
}

function truncatedTextCell(key: string) {
  return ({ row }: CellContext<Case, unknown>) => (
    <TextCell
      caseId={row.original.id}
      caseTab={row.original.caseType}
      field={key}
      value={(row.getValue(key) as string) ?? ""}
    />
  );
}

const ALL_COLUMNS: Record<string, ColumnDef<Case>> = {
  mrn: {
    accessorKey: "mrn",
    header: "MRN",
    cell: ({ row, table }) => (
      <MrnCell row={row.original} onClick={table.options.meta?.onRowClick} />
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
