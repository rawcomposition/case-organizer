import { useState } from "react";
import { nanoid } from "nanoid";
import type { CaseFormData, Newborn } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

interface CaseFormProps {
  initialData?: CaseFormData;
  onSave: (data: CaseFormData) => void;
  onCancel: () => void;
}

const DEFAULT_DATA: CaseFormData = {
  mrn: "",
  finalized: false,
  age: undefined,
  gestationalAge: undefined,
  gravida: undefined,
  para: undefined,
  nightsInHospital: undefined,
  antepartum: "",
  deliveryPostpartum: "",
  proceduresTreatments: "",
  newborns: [],
  notes: "",
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

export function CaseForm({ initialData, onSave, onCancel }: CaseFormProps) {
  const [formData, setFormData] = useState<CaseFormData>(
    initialData ?? DEFAULT_DATA
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const setField = <K extends keyof CaseFormData>(
    key: K,
    value: CaseFormData[K]
  ) => {
    setFormData({ ...formData, [key]: value });
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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

      {/* Numeric row */}
      <div className="grid grid-cols-5 gap-3">
        <NumberField label="Age" value={formData.age} onChange={numericChange("age")} />
        <NumberField label="GA" value={formData.gestationalAge} onChange={numericChange("gestationalAge")} />
        <NumberField label="Gravida" value={formData.gravida} onChange={numericChange("gravida")} />
        <NumberField label="Para" value={formData.para} onChange={numericChange("para")} />
        <NumberField label="Nights" value={formData.nightsInHospital} onChange={numericChange("nightsInHospital")} />
      </div>

      {/* Textareas */}
      <div className="space-y-1.5">
        <label htmlFor="antepartum" className="text-sm font-medium">Antepartum</label>
        <Textarea
          id="antepartum"
          value={formData.antepartum}
          onChange={(e) => setField("antepartum", e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="deliveryPostpartum" className="text-sm font-medium">Delivery / Postpartum</label>
        <Textarea
          id="deliveryPostpartum"
          value={formData.deliveryPostpartum}
          onChange={(e) => setField("deliveryPostpartum", e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="proceduresTreatments" className="text-sm font-medium">Procedures / Treatments</label>
        <Textarea
          id="proceduresTreatments"
          value={formData.proceduresTreatments}
          onChange={(e) => setField("proceduresTreatments", e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="notes" className="text-sm font-medium">Notes</label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setField("notes", e.target.value)}
        />
      </div>

      {/* Newborns repeater */}
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

      <div className="flex gap-3 pt-4 border-t">
        <Button type="submit" className="flex-1">Save</Button>
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
