export const CATEGORIES = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Oncology",
  "Pediatrics",
  "Radiology",
  "Dermatology",
  "Gastroenterology",
  "Pulmonology",
  "Endocrinology",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Case {
  id: string;
  mrn: string;
  category: Category;
  finalized: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type CaseFormData = Omit<Case, "id" | "createdAt" | "updatedAt">;
