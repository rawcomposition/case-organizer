import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import type { Case, CaseFormData } from "@/lib/types";

interface CaseState {
  cases: Case[];
  addCase: (data: CaseFormData) => Case;
  updateCase: (id: string, data: Partial<CaseFormData>) => void;
  deleteCase: (id: string) => void;
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
    }),
    { name: "case-organizer-cases" }
  )
);
