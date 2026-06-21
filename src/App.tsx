import { useRef, useMemo, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useCaseStore } from "@/store/case-store";
import { useUIStore } from "@/store/ui-store";
import type { Case, CaseFormData } from "@/lib/types";
import { getRandomEncouragingMessage } from "@/lib/messages";
import { parseImport, toCSV, downloadCSV } from "@/lib/export";
import { playTadaSound } from "@/lib/sounds";
import { getColumnsForTab, COLUMN_LABELS } from "@/components/cases/columns";
import { Header } from "@/components/layout/header";
import { TabBar } from "@/components/layout/tab-bar";
import { DataTable } from "@/components/cases/data-table";
import { CaseSheet } from "@/components/cases/case-sheet";
import { Button } from "@/components/ui/button";
import { SettingsPage } from "@/components/settings/settings-page";
import { useTemplateStore } from "@/store/template-store";
import { getTabConfig, getCategoryLabel } from "@/lib/case-tabs";
import { Upload, Download, Settings } from "lucide-react";

type SheetMode = "view" | "edit" | "create";
type Page = "main" | "settings";

function App() {
  const cases = useCaseStore((s) => s.cases);
  const addCase = useCaseStore((s) => s.addCase);
  const updateCase = useCaseStore((s) => s.updateCase);
  const deleteCase = useCaseStore((s) => s.deleteCase);
  const importCases = useCaseStore((s) => s.importCases);
  const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const columnVisibility = useUIStore((s) => s.columnVisibility);
  const templates = useTemplateStore((s) => s.templates);
  const requiredFields = useTemplateStore((s) => s.requiredFields);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [page, setPage] = useState<Page>("main");

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<SheetMode>("view");
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  // Filter cases by active tab; default to "ob" for legacy cases without caseType
  const filteredCases = useMemo(
    () => cases.filter((c) => (c.caseType ?? "ob") === activeTab),
    [cases, activeTab]
  );

  const columns = useMemo(() => getColumnsForTab(activeTab), [activeTab]);

  const handleRowClick = (caseItem: Case) => {
    setSelectedCase(caseItem);
    setSheetMode("view");
    setSheetOpen(true);
  };

  const handleAddCase = () => {
    setSelectedCase(null);
    setSheetMode("create");
    setSheetOpen(true);
  };

  const getTemplateDefaults = (): Partial<Record<string, string>> => {
    const tabConfig = getTabConfig(activeTab);
    const defaults: Record<string, string> = {};
    for (const field of tabConfig.textFields) {
      const tmpl = templates[`${activeTab}.${field}`];
      if (tmpl) defaults[field] = tmpl;
    }
    return defaults;
  };

  const handleSave = (data: CaseFormData) => {
    if (sheetMode === "create") {
      addCase(data);
      toast.success(getRandomEncouragingMessage());
      playTadaSound();
    } else if (selectedCase) {
      updateCase(selectedCase.id, data);
    }
  };

  const handleDelete = (id: string) => {
    deleteCase(id);
    toast.success("Case deleted.");
  };

  const handleExportCSV = () => {
    // Respect the column-visibility filter: a column is hidden only when
    // explicitly set to false (undefined means visible).
    const columnKeys = getTabConfig(activeTab).columns.filter(
      (key) => columnVisibility[key] !== false
    );
    const headers = columnKeys.map((key) => COLUMN_LABELS[key] ?? key);
    const rows = filteredCases.map((c) =>
      columnKeys.map((key) => {
        // Export the full category label rather than the stored number.
        if (key === "category") return getCategoryLabel(c.caseType, c.category) ?? "";
        const value = c[key as keyof Case];
        if (typeof value === "boolean") return value ? "Yes" : "No";
        return value ?? "";
      })
    );
    const date = new Date().toISOString().slice(0, 10);
    downloadCSV(`cases-${activeTab}-${date}.csv`, toCSV(headers, rows));
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseImport(text);
        importCases(parsed);
        toast.success(`Imported ${parsed.length} case${parsed.length === 1 ? "" : "s"}.`);
      } catch (err) {
        toast.error(
          `Import failed: ${err instanceof Error ? err.message : "Invalid file"}`
        );
      }
      // Reset so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsText(file);
  };

  if (page === "settings") {
    return (
      <div className="px-8">
        <SettingsPage onBack={() => setPage("main")} />
        <Toaster position="top-center" />
      </div>
    );
  }

  return (
    <div className="px-8">
      <Header />
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      <DataTable
        columns={columns}
        data={filteredCases}
        onRowClick={handleRowClick}
        onAddCase={handleAddCase}
      />
      <CaseSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        mode={sheetMode}
        caseData={selectedCase}
        activeTab={activeTab}
        onSave={handleSave}
        onDelete={handleDelete}
        templateDefaults={getTemplateDefaults()}
        requiredFields={requiredFields}
      />
      <div className="flex gap-1 mt-4 pb-6 print:hidden">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleImport}
        />
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground text-xs"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mr-1.5 h-3 w-3" />
          Import
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground text-xs"
          disabled={!filteredCases.length}
          onClick={handleExportCSV}
        >
          <Download className="mr-1.5 h-3 w-3" />
          Download CSV
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground text-xs"
          onClick={() => setPage("settings")}
        >
          <Settings className="mr-1.5 h-3 w-3" />
          Settings
        </Button>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
