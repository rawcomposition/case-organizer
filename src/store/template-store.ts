import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Maps Case text field keys to their template strings */
type Templates = Record<string, string>;

interface TemplateState {
  templates: Templates;
  setTemplate: (field: string, value: string) => void;
}

export const useTemplateStore = create<TemplateState>()(
  persist(
    (set, get) => ({
      templates: {},
      setTemplate: (field, value) =>
        set({ templates: { ...get().templates, [field]: value } }),
    }),
    { name: "case-organizer-templates" }
  )
);
