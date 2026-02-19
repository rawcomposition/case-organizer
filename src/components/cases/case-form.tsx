import { useState } from "react";
import type { CaseFormData, Category } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CaseFormProps {
  initialData?: CaseFormData;
  onSave: (data: CaseFormData) => void;
  onCancel: () => void;
}

const DEFAULT_DATA: CaseFormData = {
  mrn: "",
  category: "Cardiology",
  finalized: false,
  notes: "",
};

export function CaseForm({ initialData, onSave, onCancel }: CaseFormProps) {
  const [formData, setFormData] = useState<CaseFormData>(
    initialData ?? DEFAULT_DATA
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="space-y-1.5">
        <label htmlFor="mrn" className="text-sm font-medium">
          MRN
        </label>
        <Input
          id="mrn"
          placeholder="e.g. MRN-001234"
          value={formData.mrn}
          onChange={(e) => setFormData({ ...formData, mrn: e.target.value })}
          className="h-10"
          required
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="category" className="text-sm font-medium">
          Category
        </label>
        <Select
          value={formData.category}
          onValueChange={(value: Category) =>
            setFormData({ ...formData, category: value })
          }
        >
          <SelectTrigger id="category" className="h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2.5 py-1">
        <Checkbox
          id="finalized"
          checked={formData.finalized}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, finalized: checked === true })
          }
        />
        <label htmlFor="finalized" className="text-sm font-medium">
          Finalized
        </label>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="notes" className="text-sm font-medium">
          Notes
        </label>
        <Textarea
          id="notes"
          placeholder="Add notes about this case..."
          rows={5}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
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
