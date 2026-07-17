import type { Case, CaseFormData } from "./types";

export type CaseTab = "ob" | "gyn" | "office";

export interface TabConfig {
  id: CaseTab;
  label: string;
  /** Field keys shown in the numeric row of the form */
  numericFields: (keyof CaseFormData)[];
  /** Field keys shown as textareas in the form */
  textFields: (keyof CaseFormData)[];
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
      "category",
      "nightsInHospital",
      "age",
      "gestationalAge",
      "gravida",
      "para",
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
      "category",
      "nightsInHospital",
      "age",
      "gravida",
      "para",
      "preopDiagnosis",
      "proceduresTreatments",
      "surgicalPathology",
      "complications",
      "notes",
    ],
  },
  {
    id: "office",
    label: "Office",
    numericFields: ["visits", "age", "gravida", "para"],
    textFields: ["problem", "diagnosticProcedures", "treatment", "result", "notes"],
    showNewborns: false,
    showGA: false,
    columns: [
      "mrn",
      "finalized",
      "visits",
      "age",
      "gravida",
      "para",
      "problem",
      "diagnosticProcedures",
      "treatment",
      "result",
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
  visits: "Visits",
  problem: "Problem",
  diagnosticProcedures: "Diagnostic Procedures",
  treatment: "Treatment",
  result: "Result",
  category: "Category",
};

/**
 * Case categories per tab. A case stores the 1-based position of its category
 * in these lists (Case.category); the label is looked up at display time so the
 * stored data stays compact and the canonical wording lives in one place.
 * Office has no categories.
 */
export const CATEGORIES: Partial<Record<CaseTab, string[]>> = {
  gyn: [
    "Routine postoperative care",
    "Intraoperative and postoperative urologic complications",
    "Intraoperative and postoperative wound complications",
    "Intraoperative and postoperative vascular injuries and hemorrhage",
    "Intraoperative and postoperative nerve injury",
    "Intraoperative and postoperative gastrointestinal complications",
    "Postoperative pulmonary complications",
    "Adnexal emergencies, including PID/TOA, adnexal torsion, ruptured ovarian cysts",
    "Vulvar emergencies, including Bartholin gland duct abscess, vulvar abscess, fasciitis, straddle injury, sexual assault",
    "Ectopic pregnancies",
    "Pregnancies of unknown location",
    "Acute uterine complications, including hemorrhage, prolapsing fibroid, degenerating fibroid hematometra",
    "Urologic emergencies, including stones, pyelonephritis, diverticulum infection, obstruction associated with procidentia",
    "Pelvic infections",
    "Operative hysteroscopy",
    "Minimally invasive hysterectomy",
    "Operative laparoscopy",
    "Excisional procedures for preinvasive cervical disease",
    "Excisional procedures for vulvar lesions",
    "Dilation and curettage (non-obstetric)",
    "Vulvar or vaginal procedures",
    "Diagnostic cystoscopy",
    "Exploratory laparotomy",
    "Abdominal hysterectomy",
    "Abdominal myomectomy",
    "Open adnexal procedures",
    "Diagnostic and operative cystoscopy and urethroscopy",
    "Surgical repair of urinary incontinence",
    "Vesicovaginal fistula repair",
    "Surgical repair of pelvic organ prolapse, including apical prolapse and colpocleisis",
    "Obstetrical D&E and D&C (miscarriage and abortion management)",
    "Procedural management of abnormal first trimester pregnancy (non-emergent ectopic pregnancies, miscarriage)",
  ],
  ob: [
    "Co-existent medical comorbidities in the preconception, antenatal and intra and postpartum management.",
    "Abnormal carrier screening, aneuploidy screening, diagnostic testing",
    "Anomalous fetus identified during second-trimester",
    "Antepartum fetal assessment",
    "Spontaneous pre-term birth (including preterm labor/delivery, cervical insufficiency, PPROM)",
    "Multifetal gestation",
    "Fetal growth abnormalities",
    "Postterm gestation",
    "Stillbirth",
    "Hypertensive disorders of pregnancy",
    "Diabetes mellitus (pregestational and gestational)",
    "Medical disorders unique to pregnancy (hyperemesis, cholestasis of pregnancy, acute fatty liver of pregnancy, peripartum cardiomyopathy, PUPPP/PEP, pemphigoid gestationis, isoimmunization)",
    "Antepartum infections (HIV, varicella, parvovirus, syphilis, TORCH, COVID-19, pyelonephritis, etc.)",
    "Non-obstetrical emergencies during pregnancy (acute abdomen, adnexal masses, renal stone, trauma)",
    "Operative vaginal deliveries",
    "Cesarean deliveries",
    "Obstetrical lacerations",
    "Neonatal resuscitation and circumcisions",
    "Induction or augmentation of labor and labor abnormalities (e.g., dystocia, PROM, cord problems, abnormal position or presentation)",
    "Postpartum hemorrhage and uterine inversion",
    "Placental abnormalities",
    "Acute maternal decompensation",
    "Fetal heart rate abnormalities",
    "Prior cesarean delivery",
    "Infection in labor (e.g., chorioamnionitis, Group B streptococcus, HSV, HIV, HBV, HCV)",
    "Complicated vaginal deliveries (includes twin, vaginal breech, shoulder dystocia and ECV, excluding operative deliveries)",
    "Peripartum hysterectomy",
    "Immediate postpartum contraception",
    "Basic ultrasound (list number for first, second, and third trimester)",
    "Postpartum complications (including readmissions, lactation, and breastfeeding complications)",
  ],
};

/** Category labels for a tab, or undefined if the tab has no categories. */
export function getCategories(tab: CaseTab): string[] | undefined {
  return CATEGORIES[tab];
}

/** Full label for a stored category number (1-based), or undefined if unknown. */
export function getCategoryLabel(tab: CaseTab, num: number | undefined): string | undefined {
  if (num == null) return undefined;
  return CATEGORIES[tab]?.[num - 1];
}
