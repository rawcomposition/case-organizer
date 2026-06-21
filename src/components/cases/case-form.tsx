import { useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import type { CaseFormData, Newborn } from "@/lib/types";
import { type CaseTab, getTabConfig, getCategories, COLUMN_LABELS_MAP } from "@/lib/case-tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { CategorySelect } from "./category-select";
import { CharCounter } from "@/components/ui/char-counter";
import { useTemplateStore } from "@/store/template-store";
import { useUIStore } from "@/store/ui-store";
import { getAbbreviationIssues, applyAbbreviation } from "@/lib/abbreviations";
import { cn } from "@/lib/utils";
import { Plus, Trash2, TriangleAlert, Lightbulb } from "lucide-react";

const VARIABLE_REGEX = /\{[^}]+\}/g;

function hasVariables(text: string): boolean {
  return VARIABLE_REGEX.test(text);
}

function formHasVariables(data: CaseFormData, textFields: (keyof CaseFormData)[]): boolean {
  return textFields.some((field) => {
    const val = data[field];
    return typeof val === "string" && hasVariables(val);
  });
}

function findVariableAfter(text: string, cursor: number): { start: number; end: number } | null {
  const regex = /\{[^}]+\}/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (match.index >= cursor) return { start: match.index, end: match.index + match[0].length };
  }
  return null;
}

function findFirstVariable(text: string): { start: number; end: number } | null {
  const match = /\{[^}]+\}/.exec(text);
  return match ? { start: match.index, end: match.index + match[0].length } : null;
}

interface CaseFormProps {
  initialData?: CaseFormData;
  caseTab: CaseTab;
  templateDefaults?: Partial<Record<string, string>>;
  requiredFields?: Record<string, boolean>;
  onSave: (data: CaseFormData) => void;
  onCancel: () => void;
  onDirtyChange?: (dirty: boolean) => void;
}

const DEFAULT_DATA: CaseFormData = {
  caseType: "ob",
  mrn: "",
  finalized: false,
  category: undefined,
  age: undefined,
  gestationalAge: "",
  gravida: undefined,
  para: undefined,
  nightsInHospital: undefined,
  antepartum: "",
  deliveryPostpartum: "",
  proceduresTreatments: "",
  newborns: [],
  notes: "",
  preopDiagnosis: "",
  surgicalPathology: "",
  complications: "",
  visits: undefined,
  problem: "",
  diagnosticProcedures: "",
  treatment: "",
  result: "",
};

function createNewborn(): Newborn {
  return {
    id: nanoid(),
    perinatalDeath: false,
    weightGrams: undefined,
    apgar1: undefined,
    apgar5: undefined,
    nightsInHospital: undefined,
  };
}

export function CaseForm({ initialData, caseTab, templateDefaults, requiredFields = {}, onSave, onCancel, onDirtyChange }: CaseFormProps) {
  const tabConfig = getTabConfig(caseTab);
  const categories = getCategories(caseTab);
  const charLimits = useTemplateStore((s) => s.charLimits);
  const abbrReview = useUIStore((s) => s.abbrReview);
  const textareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [formData, setFormData] = useState<CaseFormData>(() => {
    if (initialData) return initialData;
    return { ...DEFAULT_DATA, caseType: caseTab, ...templateDefaults };
  });

  // Snapshot of the initial values, used to detect unsaved changes.
  const initialSnapshotRef = useRef<string | null>(null);
  if (initialSnapshotRef.current === null) {
    initialSnapshotRef.current = JSON.stringify(formData);
  }

  useEffect(() => {
    onDirtyChange?.(JSON.stringify(formData) !== initialSnapshotRef.current);
  }, [formData, onDirtyChange]);

  // Clear the dirty flag when the form unmounts (closed or switched to view).
  useEffect(() => {
    return () => onDirtyChange?.(false);
  }, [onDirtyChange]);

  const isRequired = (field: string) => requiredFields[`${caseTab}.${field}`] ?? false;

  const isFieldEmpty = (field: keyof CaseFormData) => {
    const val = formData[field];
    if (val === undefined || val === null) return true;
    if (typeof val === "string") return val.trim() === "";
    if (typeof val === "number") return false;
    return false;
  };

  const hasMissingRequired = [...tabConfig.numericFields, ...tabConfig.textFields, ...(tabConfig.showGA ? ["gestationalAge" as keyof CaseFormData] : [])].some(
    (field) => isRequired(field as string) && isFieldEmpty(field)
  );

  const needsNewborn = tabConfig.showNewborns && formData.newborns.length === 0;
  const hasUnfilledVars = formHasVariables(formData, tabConfig.textFields);
  const cannotSave = hasUnfilledVars || hasMissingRequired || needsNewborn;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cannotSave) return;
    onSave(formData);
  };

  const handleFormKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "F2") return;
    e.preventDefault();

    const fields = tabConfig.textFields as string[];
    const activeEl = document.activeElement as HTMLTextAreaElement | null;
    const activeField = fields.find((f) => textareaRefs.current[f] === activeEl);

    if (activeField) {
      const cursor = activeEl!.selectionEnd;
      const currentText = (formData[activeField as keyof CaseFormData] as string) ?? "";
      const inCurrent = findVariableAfter(currentText, cursor);
      if (inCurrent) {
        activeEl!.setSelectionRange(inCurrent.start, inCurrent.end);
        return;
      }

      const startIdx = fields.indexOf(activeField);
      for (let i = 1; i <= fields.length; i++) {
        const nextField = fields[(startIdx + i) % fields.length];
        const text = (formData[nextField as keyof CaseFormData] as string) ?? "";
        const found = findFirstVariable(text);
        if (found) {
          const nextEl = textareaRefs.current[nextField];
          nextEl?.focus();
          nextEl?.setSelectionRange(found.start, found.end);
          return;
        }
      }
    } else {
      for (const field of fields) {
        const text = (formData[field as keyof CaseFormData] as string) ?? "";
        const found = findFirstVariable(text);
        if (found) {
          const el = textareaRefs.current[field];
          el?.focus();
          el?.setSelectionRange(found.start, found.end);
          return;
        }
      }
    }
  };

  const setField = <K extends keyof CaseFormData>(
    key: K,
    value: CaseFormData[K]
  ) => {
    setFormData({ ...formData, [key]: value });
  };

  const fixAbbreviation = (field: keyof CaseFormData, expansion: string, abbr: string) => {
    const current = (formData[field] as string) ?? "";
    setField(field, applyAbbreviation(current, expansion, abbr) as CaseFormData[typeof field]);
  };

  const numericChange = (key: keyof CaseFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === "" ? undefined : Number(e.target.value);
    setField(key, val as CaseFormData[typeof key]);
  };

  const addNewborn = () => {
    setField("newborns", [...formData.newborns, createNewborn()]);
  };

  const removeNewborn = (id: string) => {
    setField("newborns", formData.newborns.filter((n) => n.id !== id));
  };

  const updateNewborn = (id: string, updates: Partial<Newborn>) => {
    setField(
      "newborns",
      formData.newborns.map((n) => (n.id === id ? { ...n, ...updates } : n))
    );
  };

  const numericFieldCount = tabConfig.numericFields.length + (tabConfig.showGA ? 1 : 0);

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} className="flex flex-col gap-5">
      {/* MRN + Finalized */}
      <div className="flex items-end gap-4">
        <div className="flex-1 space-y-1.5">
          <label htmlFor="mrn" className="text-sm font-medium">
            MRN
          </label>
          <Input
            id="mrn"
            value={formData.mrn}
            onChange={(e) => setField("mrn", e.target.value)}
            required
            autoFocus={!initialData}
          />
        </div>
        <div className="flex items-center gap-2.5 h-10 px-2">
          <Checkbox
            id="finalized"
            checked={formData.finalized}
            onCheckedChange={(checked) =>
              setField("finalized", checked === true)
            }
          />
          <label htmlFor="finalized" className="text-sm font-medium">
            Finalized
          </label>
        </div>
      </div>

      {/* Category (OB / GYN only) */}
      {categories && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Category</label>
          <CategorySelect
            categories={categories}
            value={formData.category}
            onChange={(num) => setField("category", num)}
          />
        </div>
      )}

      {/* Numeric row */}
      <div className={`grid gap-3`} style={{ gridTemplateColumns: `repeat(${numericFieldCount}, minmax(0, 1fr))` }}>
        {tabConfig.numericFields.map((field) => (
          <NumberField
            key={field}
            label={COLUMN_LABELS_MAP[field] ?? field}
            value={formData[field] as number | undefined}
            onChange={numericChange(field)}
          />
        ))}
        {tabConfig.showGA && (
          <div className="space-y-1.5">
            <label className="text-sm font-medium">GA</label>
            <Input
              value={formData.gestationalAge}
              onChange={(e) => setField("gestationalAge", e.target.value)}
              className="px-2.5"
            />
          </div>
        )}
      </div>

      {/* Textareas */}
      {tabConfig.textFields.map((field) => {
        const value = (formData[field] as string) ?? "";
        const charLimit = charLimits[`${caseTab}.${field}`] ?? null;
        const abbrIssues = abbrReview ? getAbbreviationIssues(value) : [];
        return (
          <div key={field} className="space-y-1.5">
            <label htmlFor={field} className="text-sm font-medium">
              {COLUMN_LABELS_MAP[field] ?? field}
            </label>
            {abbrIssues.length > 0 && (
              <ul className="space-y-1.5">
                {abbrIssues.map((issue, i) => (
                  <li
                    key={i}
                    className={cn(
                      "flex items-center gap-2 rounded-md border px-3 py-2 text-sm",
                      issue.type === "opportunity"
                        ? "border-amber-200 bg-amber-50 text-amber-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    )}
                  >
                    {issue.type === "opportunity" ? (
                      <Lightbulb className="h-4 w-4 shrink-0" />
                    ) : (
                      <TriangleAlert className="h-4 w-4 shrink-0" />
                    )}
                    <span className="flex-1">
                      {issue.type === "unapproved" && (
                        <>
                          &ldquo;<span className="font-semibold">{issue.term}</span>&rdquo; is not an
                          approved abbreviation
                        </>
                      )}
                      {issue.type === "opportunity" && (
                        <>
                          Use &ldquo;<span className="font-semibold">{issue.term}</span>&rdquo; for
                          &ldquo;{issue.expansion}&rdquo;
                        </>
                      )}
                      {issue.type === "correction" && (
                        <>
                          &ldquo;<span className="font-semibold">{issue.term}</span>&rdquo; is not
                          approved — use &ldquo;
                          <span className="font-semibold">{issue.replacement}</span>&rdquo;
                        </>
                      )}
                      {issue.type === "misspelling" && (
                        <>
                          &ldquo;<span className="font-semibold">{issue.term}</span>&rdquo; is
                          misspelled — use &ldquo;
                          <span className="font-semibold">{issue.replacement}</span>&rdquo;
                        </>
                      )}
                    </span>
                    {issue.type === "opportunity" && issue.expansion && (
                      <Button
                        type="button"
                        size="xs"
                        variant="outline"
                        className="border-amber-300 bg-white text-amber-800 hover:bg-amber-100"
                        onClick={() => fixAbbreviation(field, issue.expansion!, issue.term)}
                      >
                        Fix
                      </Button>
                    )}
                    {(issue.type === "correction" || issue.type === "misspelling") &&
                      issue.replacement && (
                        <Button
                          type="button"
                          size="xs"
                          variant="outline"
                          className="border-red-300 bg-white text-red-800 hover:bg-red-100"
                          onClick={() => fixAbbreviation(field, issue.term, issue.replacement!)}
                        >
                          Fix
                        </Button>
                      )}
                  </li>
                ))}
              </ul>
            )}
            <div className="relative">
              <Textarea
                ref={(el) => { textareaRefs.current[field] = el; }}
                id={field}
                value={value}
                maxLength={charLimit ?? undefined}
                onChange={(e) => setField(field, e.target.value as CaseFormData[typeof field])}
                onFocus={() => setFocusedField(field)}
                onBlur={() => setFocusedField((f) => (f === field ? null : f))}
              />
              {focusedField === field && (
                <CharCounter count={value.length} limit={charLimit} className="absolute -top-2.5 right-3" />
              )}
            </div>
          </div>
        );
      })}

      {/* Newborns repeater (OB only) */}
      {tabConfig.showNewborns && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Newborns</label>
            <Button type="button" variant="ghost" size="xs" onClick={addNewborn}>
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add
            </Button>
          </div>

          {formData.newborns.length > 0 && (
            <div className="border rounded-2xl overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted/50 text-muted-foreground">
                    <th className="text-left font-medium px-2.5 py-2">Death</th>
                    <th className="text-left font-medium px-2.5 py-2">Wt (g)</th>
                    <th className="text-left font-medium px-2.5 py-2">A1</th>
                    <th className="text-left font-medium px-2.5 py-2">A5</th>
                    <th className="text-left font-medium px-2.5 py-2">Nights</th>
                    <th className="w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.newborns.map((nb) => (
                    <NewbornRow
                      key={nb.id}
                      newborn={nb}
                      onChange={(updates) => updateNewborn(nb.id, updates)}
                      onRemove={() => removeNewborn(nb.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t">
        <Button type="submit" className="flex-1" disabled={cannotSave}>Save</Button>
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      <Input
        type="number"
        value={value ?? ""}
        onChange={onChange}
        className="px-2.5"
      />
    </div>
  );
}

function NewbornRow({
  newborn,
  onChange,
  onRemove,
}: {
  newborn: Newborn;
  onChange: (updates: Partial<Newborn>) => void;
  onRemove: () => void;
}) {
  return (
    <tr className="border-t border-border/50">
      <td className="px-2.5 py-1.5">
        <div className="flex items-center justify-center">
          <Checkbox
            checked={newborn.perinatalDeath}
            onCheckedChange={(checked) =>
              onChange({ perinatalDeath: checked === true })
            }
          />
        </div>
      </td>
      <td className="px-2.5 py-1.5">
        <Input
          type="number"
          className="h-7 text-xs px-2"
          value={newborn.weightGrams ?? ""}
          onChange={(e) =>
            onChange({ weightGrams: e.target.value === "" ? undefined : Number(e.target.value) })
          }
        />
      </td>
      <td className="px-2.5 py-1.5">
        <Input
          type="number"
          className="h-7 text-xs px-2"
          value={newborn.apgar1 ?? ""}
          onChange={(e) =>
            onChange({ apgar1: e.target.value === "" ? undefined : Number(e.target.value) })
          }
        />
      </td>
      <td className="px-2.5 py-1.5">
        <Input
          type="number"
          className="h-7 text-xs px-2"
          value={newborn.apgar5 ?? ""}
          onChange={(e) =>
            onChange({ apgar5: e.target.value === "" ? undefined : Number(e.target.value) })
          }
        />
      </td>
      <td className="px-2.5 py-1.5">
        <Input
          type="number"
          className="h-7 text-xs px-2"
          value={newborn.nightsInHospital ?? ""}
          onChange={(e) =>
            onChange({
              nightsInHospital: e.target.value === "" ? undefined : Number(e.target.value),
            })
          }
        />
      </td>
      <td className="px-1.5 py-1.5">
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground/50 hover:text-destructive"
          onClick={onRemove}
        >
          <Trash2 />
        </Button>
      </td>
    </tr>
  );
}
