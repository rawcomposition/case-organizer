import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Maps Case text field keys to their template strings */
type Templates = Record<string, string>;

/** Maps "{tab}.{field}" keys to boolean required status */
type RequiredFields = Record<string, boolean>;

/** Maps "{tab}.{field}" keys to a max character count for that textarea */
type CharLimits = Record<string, number>;

interface TemplateState {
  templates: Templates;
  setTemplate: (field: string, value: string) => void;
  requiredFields: RequiredFields;
  setRequired: (key: string, required: boolean) => void;
  /** Per-field max characters allowed in textarea inputs; absent means no limit */
  charLimits: CharLimits;
  setCharLimit: (key: string, limit: number | null) => void;
}

export const useTemplateStore = create<TemplateState>()(
  persist(
    (set, get) => ({
      templates: {},
      setTemplate: (field, value) =>
        set({ templates: { ...get().templates, [field]: value } }),
      requiredFields: {},
      setRequired: (key, required) =>
        set({ requiredFields: { ...get().requiredFields, [key]: required } }),
      charLimits: {},
      setCharLimit: (key, limit) => {
        const next = { ...get().charLimits };
        if (limit === null) delete next[key];
        else next[key] = limit;
        set({ charLimits: next });
      },
    }),
    { name: "case-organizer-templates" }
  )
);
