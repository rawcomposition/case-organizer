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
  mrn: string;
  finalized: boolean;
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
  createdAt: string;
  updatedAt: string;
}

export type CaseFormData = Omit<Case, "id" | "createdAt" | "updatedAt">;
