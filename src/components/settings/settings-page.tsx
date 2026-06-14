import { TAB_CONFIG, COLUMN_LABELS_MAP } from "@/lib/case-tabs";
import type { Case } from "@/lib/types";
import { useTemplateStore } from "@/store/template-store";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";

interface SettingsPageProps {
  onBack: () => void;
}

function getAllFields(tab: (typeof TAB_CONFIG)[number]): (keyof Case)[] {
  const fields: (keyof Case)[] = [...tab.numericFields];
  if (tab.showGA) fields.push("gestationalAge");
  fields.push(...tab.textFields);
  return fields;
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  const templates = useTemplateStore((s) => s.templates);
  const setTemplate = useTemplateStore((s) => s.setTemplate);
  const requiredFields = useTemplateStore((s) => s.requiredFields);
  const setRequired = useTemplateStore((s) => s.setRequired);
  const charLimits = useTemplateStore((s) => s.charLimits);
  const setCharLimit = useTemplateStore((s) => s.setCharLimit);

  return (
    <div className="px-8 py-6 max-w-2xl mx-auto">
      <Button variant="ghost" size="sm" className="mb-4" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-1.5" />
        Back
      </Button>
      <h1 className="text-xl font-semibold mb-8">Settings</h1>

      {TAB_CONFIG.map((tab) => (
        <div key={tab.id} className="mb-10">
          <h2 className="text-lg font-medium mb-4">{tab.label}</h2>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Required Fields</h3>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {getAllFields(tab).map((field) => {
                const key = `${tab.id}.${field}`;
                return (
                  <div key={key} className="flex items-center gap-2">
                    <Checkbox
                      id={`req-${key}`}
                      checked={requiredFields[key] ?? false}
                      onCheckedChange={(checked) => setRequired(key, checked === true)}
                    />
                    <label htmlFor={`req-${key}`} className="text-sm">
                      {COLUMN_LABELS_MAP[field] ?? (field === "gestationalAge" ? "GA" : field)}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-medium text-muted-foreground">Templates</h3>
            {tab.textFields.map((field) => {
              const key = `${tab.id}.${field}`;
              return (
                <div key={`${tab.id}-${field}`} className="space-y-1.5">
                  <div className="flex items-end justify-between gap-3">
                    <label htmlFor={`template-${tab.id}-${field}`} className="text-sm font-medium">
                      {COLUMN_LABELS_MAP[field] ?? field}
                    </label>
                    <div className="flex items-center gap-1.5">
                      <label htmlFor={`limit-${tab.id}-${field}`} className="text-xs text-muted-foreground">
                        Char limit
                      </label>
                      <Input
                        id={`limit-${tab.id}-${field}`}
                        type="number"
                        min={0}
                        placeholder="None"
                        className="h-7 w-24 text-xs"
                        value={charLimits[key] ?? ""}
                        onChange={(e) =>
                          setCharLimit(key, e.target.value === "" ? null : Math.max(0, Number(e.target.value)))
                        }
                      />
                    </div>
                  </div>
                  <Textarea
                    id={`template-${tab.id}-${field}`}
                    value={templates[key] ?? ""}
                    onChange={(e) => setTemplate(key, e.target.value)}
                    rows={3}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
