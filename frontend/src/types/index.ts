export type Language = 'hindi' | 'english' | 'marathi' | 'bengali' | 'tamil' | 'telugu' | 'gujarati' | 'kannada' | 'punjabi';

export type InteractionMode = 'voice' | 'touch';

export type KioskStep = 1 | 2 | 3 | 4 | 5;

export interface PatientIdentity {
  type: 'abha' | 'aadhaar' | 'qr';
  idNumber: string;
  name?: string;
  age?: number;
  gender?: string;
  isVerified: boolean;
  consentGiven: boolean;
}

export interface KioskSessionState {
  currentStep: KioskStep;
  language: Language;
  mode: InteractionMode;
  identity: PatientIdentity;
  selectedService?: 'scan' | 'voice' | 'records';
  voiceActive: boolean;
}
