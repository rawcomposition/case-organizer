export interface Newborn {
  id: string;
  perinatalDeath: boolean;
  weightGrams?: number;
  apgar1?: number;
  apgar5?: number;
  nightsInHospital?: number;
}

export interface Case {
  id: string;
  caseType: "ob" | "gyn" | "office";
  mrn: string;
  finalized: boolean;
  /** 1-based index into the tab's category list (see CATEGORIES in case-tabs). Not used for office. */
  category?: number;
  age?: number;
  gestationalAge: string;
  gravida?: number;
  para?: number;
  nightsInHospital?: number;
  antepartum: string;
  deliveryPostpartum: string;
  proceduresTreatments: string;
  newborns: Newborn[];
  notes: string;
  // GYN-specific fields
  preopDiagnosis: string;
  surgicalPathology: string;
  complications: string;
  // Office-specific fields
  visits?: number;
  problem: string;
  diagnosticProcedures: string;
  treatment: string;
  result: string;
  createdAt: string;
  updatedAt: string;
}

export type CaseFormData = Omit<Case, "id" | "createdAt" | "updatedAt">;
