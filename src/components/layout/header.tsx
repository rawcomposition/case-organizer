import { ClipboardList } from "lucide-react";
import { useCaseStore } from "@/store/case-store";
import { useUIStore } from "@/store/ui-store";

export function Header() {
  const cases = useCaseStore((s) => s.cases);
  const activeTab = useUIStore((s) => s.activeTab);
  const caseCount = cases.filter((c) => (c.caseType ?? "ob") === activeTab).length;

  return (
    <header className="flex flex-col items-center text-center pt-10 pb-2 print:hidden">
      <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 mb-3">
        <ClipboardList className="h-7 w-7 text-primary" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">
        Case Organizer
      </h1>
      <p className="text-sm text-muted-foreground mt-1 mb-4">
        You have {caseCount} {caseCount === 1 ? "case" : "cases"}
      </p>
    </header>
  );
}
