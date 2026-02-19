import { useState } from "react";
import type { Case, CaseFormData } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FinalizedCell } from "./finalized-cell";
import { CaseForm } from "./case-form";
import { Pencil, Trash2 } from "lucide-react";

type SheetMode = "view" | "edit" | "create";

interface CaseSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: SheetMode;
  caseData: Case | null;
  onSave: (data: CaseFormData) => void;
  onDelete: (id: string) => void;
}

export function CaseSheet({
  open,
  onOpenChange,
  mode: initialMode,
  caseData,
  onSave,
  onDelete,
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
            initialData={
              effectiveMode === "edit" && caseData
                ? {
                    mrn: caseData.mrn,
                    finalized: caseData.finalized,
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
                  }
                : undefined
            }
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function CaseViewContent({
  caseData,
  onEdit,
  onDelete,
}: {
  caseData: Case;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete this case?")) {
      onDelete();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top row: MRN + Finalized */}
      <div className="grid grid-cols-3 gap-x-6 gap-y-5">
        <Field label="MRN">
          <p className="text-sm font-medium">{caseData.mrn}</p>
        </Field>
        <Field label="Finalized">
          <div className="mt-0.5">
            <FinalizedCell value={caseData.finalized} />
          </div>
        </Field>
      </div>

      {/* Numeric fields */}
      <div className="grid grid-cols-5 gap-x-4 gap-y-5">
        <Field label="Age">
          <p className="text-sm">{caseData.age ?? "—"}</p>
        </Field>
        <Field label="GA">
          <p className="text-sm">{caseData.gestationalAge != null ? `${caseData.gestationalAge} wks` : "—"}</p>
        </Field>
        <Field label="Gravida">
          <p className="text-sm">{caseData.gravida ?? "—"}</p>
        </Field>
        <Field label="Para">
          <p className="text-sm">{caseData.para ?? "—"}</p>
        </Field>
        <Field label="Nights">
          <p className="text-sm">{caseData.nightsInHospital ?? "—"}</p>
        </Field>
      </div>

      {/* Textarea fields */}
      {caseData.antepartum && (
        <Field label="Antepartum">
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{caseData.antepartum}</p>
        </Field>
      )}

      {caseData.deliveryPostpartum && (
        <Field label="Delivery / Postpartum">
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{caseData.deliveryPostpartum}</p>
        </Field>
      )}

      {caseData.proceduresTreatments && (
        <Field label="Procedures / Treatments">
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{caseData.proceduresTreatments}</p>
        </Field>
      )}

      {caseData.notes && (
        <Field label="Notes">
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{caseData.notes}</p>
        </Field>
      )}

      {/* Newborns */}
      {caseData.newborns.length > 0 && (
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
          <Button variant="ghost" size="icon" className="text-muted-foreground/50 hover:text-destructive" onClick={handleDeleteClick}>
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
