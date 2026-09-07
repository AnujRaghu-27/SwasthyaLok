export type Language = 'hindi' | 'english' | 'marathi' | 'bengali' | 'tamil' | 'telugu' | 'gujarati' | 'kannada' | 'punjabi';

export type InteractionMode = 'voice' | 'touch';

export type KioskStep = 1 | 2 | 3 | 4 | 5;

export interface PatientIdentity {
  type: 'abha' | 'aadhaar' | 'qr';
  idNumber: string;
  mobile?: string;
  name?: string;
  age?: number;
  gender?: string;
  isVerified: boolean;
  consentGiven: boolean;
}

export interface OpdDepartment {
  id: string;
  nameKey: string;
  nameFallback: string;
  subKey: string;
  subFallback: string;
  icon: string;
  room: string;
  doctorName: string;
  queueCount: number;
  estWaitMin: number;
}

export interface DocumentCheckResult {
  id: string;
  name: string;
  status: 'scanning' | 'correct' | 'incorrect';
  errorReason?: string;
  extractedDetails?: {
    diagnosis?: string;
    doctor?: string;
    medications?: string[];
    date?: string;
  };
}

export interface AbdmHealthRecord {
  id: string;
  recordType: 'Prescription' | 'Diagnostic Report' | 'Discharge Summary';
  facilityName: string;
  doctorName: string;
  date: string;
  summary: string;
}

export interface AiFollowupQuestion {
  id: string;
  question: string;
  questionHi: string;
  options: { label: string; labelHi: string; value: string }[];
  selectedAnswer?: string;
}

export interface StructuredClinicalHistory {
  chiefComplaint: string;
  duration: string;
  severity: 'normal' | 'moderate' | 'urgent' | 'emergency';
  associatedSymptoms: string[];
  aiFollowupResponses: { question: string; answer: string }[];
  clinicalSummary: string;
  triageCategory: string;
}

export interface TriageData {
  department: OpdDepartment;
  chiefComplaint: string;
  symptoms: string[];
  duration: string;
  severity: 'normal' | 'moderate' | 'urgent' | 'emergency';
  extractedVia: 'voice' | 'touch';
  structuredHistory?: StructuredClinicalHistory;
  uploadedDocs?: DocumentCheckResult[];
  abdmRecords?: AbdmHealthRecord[];
}

export interface KioskSessionState {
  currentStep: KioskStep;
  language: Language;
  mode: InteractionMode;
  identity: PatientIdentity;
  triage?: TriageData;
  voiceActive: boolean;
}
