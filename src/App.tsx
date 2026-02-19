import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useCaseStore } from "@/store/case-store";
import type { Case, CaseFormData } from "@/lib/types";
import { getRandomEncouragingMessage } from "@/lib/messages";
import { Header } from "@/components/layout/header";
import { DataTable } from "@/components/cases/data-table";
import { CaseSheet } from "@/components/cases/case-sheet";
import { columns } from "@/components/cases/columns";

type SheetMode = "view" | "edit" | "create";

function App() {
  const cases = useCaseStore((s) => s.cases);
  const addCase = useCaseStore((s) => s.addCase);
  const updateCase = useCaseStore((s) => s.updateCase);
  const deleteCase = useCaseStore((s) => s.deleteCase);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<SheetMode>("view");
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

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
      toast.success("Case updated successfully.");
    }
  };

  const handleDelete = (id: string) => {
    deleteCase(id);
    toast.success("Case deleted.");
  };

  return (
    <div className="px-8">
      <Header />
      <DataTable
        columns={columns}
        data={cases}
        onRowClick={handleRowClick}
        onAddCase={handleAddCase}
      />
      <CaseSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        mode={sheetMode}
        caseData={selectedCase}
        onSave={handleSave}
        onDelete={handleDelete}
      />
      <Toaster position="bottom-right" richColors />
    </div>
  );
}

export default App;
