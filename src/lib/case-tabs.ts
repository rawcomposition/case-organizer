import type { Case } from "./types";

export type CaseTab = "ob" | "gyn";

export interface TabConfig {
  id: CaseTab;
  label: string;
  /** Field keys shown in the numeric row of the form */
  numericFields: (keyof Case)[];
  /** Field keys shown as textareas in the form */
  textFields: (keyof Case)[];
  /** Whether to show the newborns repeater */
  showNewborns: boolean;
  /** Whether to show the GA (gestational age) text input */
  showGA: boolean;
  /** Column keys to display in the table */
  columns: string[];
}

export const TAB_CONFIG: TabConfig[] = [
  {
    id: "ob",
    label: "OB",
    numericFields: ["age", "gravida", "para", "nightsInHospital"],
    textFields: ["antepartum", "deliveryPostpartum", "proceduresTreatments", "notes"],
    showNewborns: true,
    showGA: true,
    columns: [
      "mrn",
      "finalized",
      "age",
      "gestationalAge",
      "gravida",
      "para",
      "nightsInHospital",
      "antepartum",
      "deliveryPostpartum",
      "proceduresTreatments",
      "notes",
    ],
  },
  {
    id: "gyn",
    label: "GYN",
    numericFields: ["age", "gravida", "para", "nightsInHospital"],
    textFields: ["preopDiagnosis", "proceduresTreatments", "surgicalPathology", "complications", "notes"],
    showNewborns: false,
    showGA: false,
    columns: [
      "mrn",
      "finalized",
      "age",
      "gravida",
      "para",
      "nightsInHospital",
      "preopDiagnosis",
      "proceduresTreatments",
      "surgicalPathology",
      "complications",
      "notes",
    ],
  },
];

export function getTabConfig(tab: CaseTab): TabConfig {
  return TAB_CONFIG.find((t) => t.id === tab)!;
}

/** Human-readable labels for form fields, keyed by Case field name */
export const COLUMN_LABELS_MAP: Partial<Record<keyof Case, string>> = {
  age: "Age",
  gravida: "Gravida",
  para: "Para",
  nightsInHospital: "Nights",
  antepartum: "Antepartum",
  deliveryPostpartum: "Delivery / Postpartum",
  proceduresTreatments: "Procedures / Treatments",
  notes: "Notes",
  preopDiagnosis: "Preop Diagnosis",
  surgicalPathology: "Surgical Pathology",
  complications: "Complications",
};
