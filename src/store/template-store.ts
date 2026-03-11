import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Maps Case text field keys to their template strings */
type Templates = Record<string, string>;

/** Maps "{tab}.{field}" keys to boolean required status */
type RequiredFields = Record<string, boolean>;

interface TemplateState {
  templates: Templates;
  setTemplate: (field: string, value: string) => void;
  requiredFields: RequiredFields;
  setRequired: (key: string, required: boolean) => void;
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
    }),
    { name: "case-organizer-templates" }
  )
);
