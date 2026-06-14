import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { VisibilityState } from "@tanstack/react-table";
import type { CaseTab } from "@/lib/case-tabs";

interface UIState {
  activeTab: CaseTab;
  setActiveTab: (tab: CaseTab) => void;
  columnVisibility: VisibilityState;
  setColumnVisibility: (
    updater: VisibilityState | ((prev: VisibilityState) => VisibilityState)
  ) => void;
  reviewMode: boolean;
  toggleReviewMode: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      activeTab: "ob",
      setActiveTab: (tab) => set({ activeTab: tab }),

      columnVisibility: {},

      setColumnVisibility: (updater) => {
        const next =
          typeof updater === "function"
            ? updater(get().columnVisibility)
            : updater;
        set({ columnVisibility: next });
      },

      reviewMode: false,
      toggleReviewMode: () => set((s) => ({ reviewMode: !s.reviewMode })),
    }),
    { name: "case-organizer-ui" }
  )
);
