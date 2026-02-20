import { useRef, useMemo, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useCaseStore } from "@/store/case-store";
import { useUIStore } from "@/store/ui-store";
import type { Case, CaseFormData } from "@/lib/types";
import { getRandomEncouragingMessage } from "@/lib/messages";
import { parseImport } from "@/lib/export";
import { getColumnsForTab } from "@/components/cases/columns";
import { Header } from "@/components/layout/header";
import { TabBar } from "@/components/layout/tab-bar";
import { DataTable } from "@/components/cases/data-table";
import { CaseSheet } from "@/components/cases/case-sheet";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

type SheetMode = "view" | "edit" | "create";

function App() {
  const cases = useCaseStore((s) => s.cases);
  const addCase = useCaseStore((s) => s.addCase);
  const updateCase = useCaseStore((s) => s.updateCase);
  const deleteCase = useCaseStore((s) => s.deleteCase);
  const importCases = useCaseStore((s) => s.importCases);
  const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSave = (data: CaseFormData) => {
    if (sheetMode === "create" || (sheetMode === "create" && !selectedCase)) {
      addCase(data);
      toast.success(getRandomEncouragingMessage());
    } else if (selectedCase) {
      updateCase(selectedCase.id, data);
    }
  };

  const handleDelete = (id: string) => {
    deleteCase(id);
    toast.success("Case deleted.");
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
      />
      <div className="fixed bottom-6 left-8">
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
      </div>
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
