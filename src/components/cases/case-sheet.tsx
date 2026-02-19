import { useState } from "react";
import type { Case, CaseFormData } from "@/lib/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FinalizedCell } from "./finalized-cell";
import { CaseForm } from "./case-form";
import { Pencil } from "lucide-react";

type SheetMode = "view" | "edit" | "create";

interface CaseSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: SheetMode;
  caseData: Case | null;
  onSave: (data: CaseFormData) => void;
}

export function CaseSheet({
  open,
  onOpenChange,
  mode: initialMode,
  caseData,
  onSave,
}: CaseSheetProps) {
  const [mode, setMode] = useState<SheetMode>(initialMode);

  const effectiveMode =
    initialMode === "create"
      ? "create"
      : initialMode === "edit"
        ? "edit"
        : mode;

  const handleSave = (data: CaseFormData) => {
    onSave(data);
    onOpenChange(false);
    setMode("view");
  };

  const handleCancel = () => {
    if (initialMode === "create") {
      onOpenChange(false);
    } else {
      setMode("view");
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setMode("view");
    }
    onOpenChange(open);
  };

  const title =
    effectiveMode === "create"
      ? "New Case"
      : effectiveMode === "edit"
        ? "Edit Case"
        : "Case Details";

  const description =
    effectiveMode === "create"
      ? "Fill in the details below to add a new case."
      : effectiveMode === "edit"
        ? "Update the case information below."
        : undefined;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-lg">{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>

        <div className="px-6 pb-6">
          {effectiveMode === "view" && caseData ? (
            <CaseViewContent
              caseData={caseData}
              onEdit={() => setMode("edit")}
            />
          ) : (
            <CaseForm
              key={caseData?.id ?? "new"}
              initialData={
                effectiveMode === "edit" && caseData
                  ? {
                      mrn: caseData.mrn,
                      category: caseData.category,
                      finalized: caseData.finalized,
                      notes: caseData.notes,
                    }
                  : undefined
              }
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function CaseViewContent({
  caseData,
  onEdit,
}: {
  caseData: Case;
  onEdit: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-x-6 gap-y-5">
        <Field label="MRN">
          <p className="text-sm font-medium">{caseData.mrn}</p>
        </Field>
        <Field label="Category">
          <Badge variant="secondary" className="mt-0.5">
            {caseData.category}
          </Badge>
        </Field>
        <Field label="Finalized">
          <div className="mt-0.5">
            <FinalizedCell value={caseData.finalized} />
          </div>
        </Field>
      </div>

      <Field label="Notes">
        <p className="text-sm whitespace-pre-wrap leading-relaxed">
          {caseData.notes || "No notes added."}
        </p>
      </Field>

      <div className="flex items-center justify-between border-t pt-4">
        <div className="text-xs text-muted-foreground space-y-0.5">
          <p>Created {new Date(caseData.createdAt).toLocaleDateString()}</p>
          <p>Updated {new Date(caseData.updatedAt).toLocaleDateString()}</p>
        </div>
        <Button variant="outline" onClick={onEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
      {children}
    </div>
  );
}
