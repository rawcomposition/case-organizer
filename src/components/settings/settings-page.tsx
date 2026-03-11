import { TAB_CONFIG, COLUMN_LABELS_MAP } from "@/lib/case-tabs";
import { useTemplateStore } from "@/store/template-store";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface SettingsPageProps {
  onBack: () => void;
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  const templates = useTemplateStore((s) => s.templates);
  const setTemplate = useTemplateStore((s) => s.setTemplate);

  // Collect all unique text fields across tabs, grouped by tab
  return (
    <div className="px-8 py-6 max-w-2xl mx-auto">
      <Button variant="ghost" size="sm" className="mb-4" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-1.5" />
        Back
      </Button>
      <h1 className="text-xl font-semibold mb-8">Settings</h1>

      <p className="text-sm text-muted-foreground mb-6">Define default templates for content areas.</p>

      {TAB_CONFIG.map((tab) => (
        <div key={tab.id} className="mb-8">
          <h2 className="text-lg font-medium mb-4">{tab.label} Templates</h2>
          <div className="flex flex-col gap-4">
            {tab.textFields.map((field) => (
              <div key={`${tab.id}-${field}`} className="space-y-1.5">
                <label htmlFor={`template-${tab.id}-${field}`} className="text-sm font-medium">
                  {COLUMN_LABELS_MAP[field] ?? field}
                </label>
                <Textarea
                  id={`template-${tab.id}-${field}`}
                  value={templates[`${tab.id}.${field}`] ?? ""}
                  onChange={(e) => setTemplate(`${tab.id}.${field}`, e.target.value)}
                  rows={3}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
