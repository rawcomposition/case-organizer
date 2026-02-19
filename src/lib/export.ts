import { useCaseStore } from "@/store/case-store";
import type { Case } from "@/lib/types";

export function exportCases() {
  const cases = useCaseStore.getState().cases;
  const blob = new Blob([JSON.stringify(cases, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `case-organizer-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseImport(text: string): Case[] {
  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed)) {
    throw new Error("Invalid format: expected an array of cases");
  }
  return parsed as Case[];
}
