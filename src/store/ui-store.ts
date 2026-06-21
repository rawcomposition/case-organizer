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
  abbrReview: boolean;
  toggleAbbrReview: () => void;
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

      // reviewMode (inline editing) and abbrReview (abbreviation highlighting)
      // are mutually exclusive — turning one on turns the other off.
      reviewMode: false,
      toggleReviewMode: () =>
        set((s) => ({ reviewMode: !s.reviewMode, abbrReview: false })),

      abbrReview: false,
      toggleAbbrReview: () =>
        set((s) => ({ abbrReview: !s.abbrReview, reviewMode: false })),
    }),
    { name: "case-organizer-ui" }
  )
);
