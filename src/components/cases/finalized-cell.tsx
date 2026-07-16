import { CheckCircle, XCircle } from "lucide-react";

import { useCaseStore } from "@/store/case-store";

export function FinalizedCell({ caseId, value }: { caseId: string; value: boolean }) {
  const updateCase = useCaseStore((s) => s.updateCase);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={value ? "Finalized — click to unfinalize" : "Not finalized — click to finalize"}
      onClick={(e) => {
        e.stopPropagation();
        updateCase(caseId, { finalized: !value });
      }}
      className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring print:pointer-events-none"
    >
      {value ? (
        <CheckCircle className="h-5 w-5 text-emerald-500 hover:text-emerald-600" />
      ) : (
        <XCircle className="h-5 w-5 text-gray-400 hover:text-gray-500" />
      )}
    </button>
  );
}
