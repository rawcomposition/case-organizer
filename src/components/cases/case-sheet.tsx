import { useState } from "react";
import type { Case, CaseFormData } from "@/lib/types";
import type { CaseTab } from "@/lib/case-tabs";
import { getTabConfig, getCategoryLabel, COLUMN_LABELS_MAP } from "@/lib/case-tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CaseForm } from "./case-form";
import { Pencil, Trash2 } from "lucide-react";

type SheetMode = "view" | "edit" | "create";

interface CaseSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: SheetMode;
  caseData: Case | null;
  activeTab: CaseTab;
  onSave: (data: CaseFormData) => void;
  onDelete: (id: string) => void;
  templateDefaults?: Partial<Record<string, string>>;
  requiredFields?: Record<string, boolean>;
}

export function CaseSheet({ open, onOpenChange, mode: initialMode, caseData, activeTab, onSave, onDelete, templateDefaults, requiredFields }: CaseSheetProps) {
  const [mode, setMode] = useState<SheetMode>(initialMode);
  const [isDirty, setIsDirty] = useState(false);

  const effectiveMode = initialMode === "create" ? "create" : initialMode === "edit" ? "edit" : mode;

  // When editing/viewing an existing case, use its own type; for new cases, use the active tab
  const caseTab = caseData?.caseType ?? activeTab;

  const handleSave = (data: CaseFormData) => {
    onSave(data);
    setIsDirty(false);
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
      // Closing via the X button or Escape — warn if the form has unsaved edits.
      if (isDirty && !window.confirm("You have unsaved changes. Discard them?")) {
        return;
      }
      setIsDirty(false);
      setMode("view");
    }
    onOpenChange(open);
  };

  const title = effectiveMode === "create" ? "New Case" : effectiveMode === "edit" ? "Edit Case" : "Case Details";

  const description =
    effectiveMode === "create"
      ? "Fill in the details below to add a new case."
      : effectiveMode === "edit"
      ? "Update the case information below."
      : undefined;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {effectiveMode === "view" && caseData ? (
          <CaseViewContent
            caseData={caseData}
            onEdit={() => setMode("edit")}
            onDelete={() => {
              onDelete(caseData.id);
              onOpenChange(false);
            }}
          />
        ) : (
          <CaseForm
            key={caseData?.id ?? "new"}
            caseTab={caseTab}
            initialData={
              effectiveMode === "edit" && caseData
                ? {
                    caseType: caseData.caseType,
                    mrn: caseData.mrn,
                    finalized: caseData.finalized,
                    category: caseData.category,
                    age: caseData.age,
                    gestationalAge: caseData.gestationalAge,
                    gravida: caseData.gravida,
                    para: caseData.para,
                    nightsInHospital: caseData.nightsInHospital,
                    antepartum: caseData.antepartum,
                    deliveryPostpartum: caseData.deliveryPostpartum,
                    proceduresTreatments: caseData.proceduresTreatments,
                    newborns: caseData.newborns,
                    notes: caseData.notes,
                    preopDiagnosis: caseData.preopDiagnosis,
                    surgicalPathology: caseData.surgicalPathology,
                    complications: caseData.complications,
                    visits: caseData.visits,
                    problem: caseData.problem,
                    diagnosticProcedures: caseData.diagnosticProcedures,
                    treatment: caseData.treatment,
                    result: caseData.result,
                  }
                : undefined
            }
            templateDefaults={effectiveMode === "create" ? templateDefaults : undefined}
            requiredFields={requiredFields}
            onSave={handleSave}
            onCancel={handleCancel}
            onDirtyChange={setIsDirty}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function CaseViewContent({ caseData, onEdit, onDelete }: { caseData: Case; onEdit: () => void; onDelete: () => void }) {
  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete this case?")) {
      onDelete();
    }
  };

  const tabConfig = getTabConfig(caseData.caseType ?? "ob");
  const numericFieldCount = tabConfig.numericFields.length + (tabConfig.showGA ? 1 : 0);
  const categoryLabel = getCategoryLabel(caseData.caseType ?? "ob", caseData.category);

  return (
    <div className="space-y-6">
      {/* Top row: MRN + Finalized */}
      <div className="grid grid-cols-3 gap-x-6 gap-y-5">
        <Field label="MRN">
          <p className="text-sm font-medium">{caseData.mrn}</p>
        </Field>
        <Field label="Finalized">
          <div className="mt-0.5 text-sm">{caseData.finalized ? "Yes" : "No"}</div>
        </Field>
      </div>

      {/* Category (OB / GYN only) */}
      {tabConfig.id !== "office" && (
        <Field label="Category">
          <p className="text-sm">
            {categoryLabel ? `${caseData.category}. ${categoryLabel}` : "—"}
          </p>
        </Field>
      )}

      {/* Numeric fields */}
      <div className={`grid gap-x-4 gap-y-5`} style={{ gridTemplateColumns: `repeat(${numericFieldCount}, minmax(0, 1fr))` }}>
        {tabConfig.numericFields.map((field) => (
          <Field key={field} label={COLUMN_LABELS_MAP[field] ?? field}>
            <p className="text-sm">{(caseData[field] as number | undefined) ?? "—"}</p>
          </Field>
        ))}
        {tabConfig.showGA && (
          <Field label="GA">
            <p className="text-sm">{caseData.gestationalAge || "—"}</p>
          </Field>
        )}
      </div>

      {/* Textarea fields */}
      {tabConfig.textFields.map((field) => {
        const value = caseData[field] as string;
        if (!value) return null;
        return (
          <Field key={field} label={COLUMN_LABELS_MAP[field] ?? field}>
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{value}</p>
          </Field>
        );
      })}

      {/* Newborns (OB only) */}
      {tabConfig.showNewborns && caseData.newborns.length > 0 && (
        <Field label={`Newborns (${caseData.newborns.length})`}>
          <div className="border rounded-2xl overflow-hidden mt-1">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/50 text-muted-foreground">
                  <th className="text-left font-medium px-2.5 py-2">Death</th>
                  <th className="text-left font-medium px-2.5 py-2">Wt (g)</th>
                  <th className="text-left font-medium px-2.5 py-2">A1</th>
                  <th className="text-left font-medium px-2.5 py-2">A5</th>
                  <th className="text-left font-medium px-2.5 py-2">Nights</th>
                </tr>
              </thead>
              <tbody>
                {caseData.newborns.map((nb) => (
                  <tr key={nb.id} className="border-t border-border/50">
                    <td className="px-2.5 py-2">{nb.perinatalDeath ? "Yes" : "No"}</td>
                    <td className="px-2.5 py-2">{nb.weightGrams ?? "—"}</td>
                    <td className="px-2.5 py-2">{nb.apgar1 ?? "—"}</td>
                    <td className="px-2.5 py-2">{nb.apgar5 ?? "—"}</td>
                    <td className="px-2.5 py-2">{nb.nightsInHospital ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Field>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground space-y-0.5">
            <p>Created {new Date(caseData.createdAt).toLocaleDateString()}</p>
            <p>Updated {new Date(caseData.updatedAt).toLocaleDateString()}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            tabIndex={-1}
            className="text-muted-foreground/50 hover:text-destructive"
            onClick={handleDeleteClick}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
        <Button variant="outline" onClick={onEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
      {children}
    </div>
  );
}
