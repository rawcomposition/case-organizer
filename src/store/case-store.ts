import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import type { Case, CaseFormData } from "@/lib/types";

/** Cases saved before tabs existed have no caseType; they belong to OB. */
const normalizeCase = (c: Case): Case => ({ ...c, caseType: c.caseType ?? "ob" });

interface CaseState {
  cases: Case[];
  addCase: (data: CaseFormData) => Case;
  updateCase: (id: string, data: Partial<CaseFormData>) => void;
  deleteCase: (id: string) => void;
  importCases: (cases: Case[]) => void;
}

export const useCaseStore = create<CaseState>()(
  persist(
    (set, get) => ({
      cases: [],

      addCase: (data: CaseFormData) => {
        const now = new Date().toISOString();
        const newCase: Case = {
          ...data,
          id: nanoid(),
          createdAt: now,
          updatedAt: now,
        };
        set({ cases: [...get().cases, newCase] });
        return newCase;
      },

      updateCase: (id, data) => {
        set({
          cases: get().cases.map((c) =>
            c.id === id
              ? { ...c, ...data, updatedAt: new Date().toISOString() }
              : c
          ),
        });
      },

      deleteCase: (id) => {
        set({ cases: get().cases.filter((c) => c.id !== id) });
      },

      importCases: (cases) => {
        set({ cases: cases.map(normalizeCase) });
      },
    }),
    {
      name: "case-organizer-cases",
      version: 1,
      migrate: (persisted) => {
        const state = persisted as Pick<CaseState, "cases">;
        return { ...state, cases: (state.cases ?? []).map(normalizeCase) };
      },
    }
  )
);
