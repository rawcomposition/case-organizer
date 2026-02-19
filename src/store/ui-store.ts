import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { VisibilityState } from "@tanstack/react-table";

interface UIState {
  columnVisibility: VisibilityState;
  setColumnVisibility: (
    updater: VisibilityState | ((prev: VisibilityState) => VisibilityState)
  ) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      columnVisibility: {},

      setColumnVisibility: (updater) => {
        const next =
          typeof updater === "function"
            ? updater(get().columnVisibility)
            : updater;
        set({ columnVisibility: next });
      },
    }),
    { name: "case-organizer-ui" }
  )
);
