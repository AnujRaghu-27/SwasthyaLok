import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Language, InteractionMode, PatientIdentity, TriageData, OpdDepartment } from '../../types';
import { OPD_DEPARTMENTS } from './ServiceTriageScreen';
import { voiceService } from '../../services/voice';

interface PatientHomeScreenProps {
  selectedLanguage: Language;
  selectedMode: InteractionMode;
  onModeChange: (mode: InteractionMode) => void;
  patientIdentity: PatientIdentity;
  onProceedToSlip: (triageData: TriageData) => void;
  onBack: () => void;
  onStaffHelp?: () => void;
  onOpenDoctorPortal?: () => void;
}

export const PatientHomeScreen: React.FC<PatientHomeScreenProps> = ({
  selectedLanguage,
  selectedMode,
  patientIdentity,
  onProceedToSlip,
  onBack,
  onStaffHelp,
  onOpenDoctorPortal,
}) => {
  const { t } = useTranslation('common');
  const [activePath, setActivePath] = useState<'upload' | 'consult' | 'extract'>('consult');
  
  // Path 1 (Upload) states for demo
  const [docStatus, setDocStatus] = useState<'idle' | 'scanning' | 'correct' | 'incorrect'>('idle');
  
  // Path 2 (Consult AI) states for demo
  const [redFlagStatus, setRedFlagStatus] = useState<'green' | 'amber' | 'red'>('amber');
  const [followup1, setFollowup1] = useState<string | null>('no');
  const [followup2, setFollowup2] = useState<string | null>('yes');
  
  // Doctor Portal Preview Modal state
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);

  // Selected OPD Department for the final token
  const [selectedDept] = useState<OpdDepartment>(OPD_DEPARTMENTS[0]);

  const handleTriggerCorrectDoc = () => {
    setDocStatus('scanning');
    setTimeout(() => {
      setDocStatus('correct');
      voiceService.speak('Document check passed. Valid prescription extracted.', selectedLanguage);
    }, 700);
  };

  const handleTriggerIncorrectDoc = () => {
    setDocStatus('scanning');
    setTimeout(() => {
      setDocStatus('incorrect');
      voiceService.speak('Document check failed. Image is blurry. Please re-upload.', selectedLanguage);
    }, 700);
  };

  const handleProceed = () => {
    const triageData: TriageData = {
      department: selectedDept,
      chiefComplaint: 'Fever (3 Days) & Body Pain with Mild Dyspnea',
      symptoms: ['fever', 'cough', 'fatigue'],
      duration: '3 days',
      severity: redFlagStatus === 'red' ? 'emergency' : redFlagStatus === 'amber' ? 'moderate' : 'normal',
      extractedVia: selectedMode,
      structuredHistory: {
        chiefComplaint: 'Acute Febrile Illness & Headache',
        duration: '3 days',
        severity: 'moderate',
        associatedSymptoms: ['Mild Cough', 'Chills', 'Weakness'],
        aiFollowupResponses: [
          { question: 'Shortness of breath / Breathing difficulty?', answer: 'No' },
          { question: 'History of Diabetes or Hypertension?', answer: 'Yes (On medication)' },
        ],
        clinicalSummary: 'Patient presents with 3-day history of acute fever and headache. No red-flag chest pain. Existing hypertension noted from ABDM.',
        triageCategory: 'Yellow - Priority Consultation',
      },
      abdmRecords: [
        {
          id: 'rec-1',
          recordType: 'Prescription',
          facilityName: 'District Hospital OPD',
          doctorName: 'Dr. S.K. Sharma',
          date: '14 Jan 2026',
          summary: 'Hypertension follow-up: Tab Telmisartan 40mg OD prescribed.',
        },
      ],
    };
    onProceedToSlip(triageData);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col justify-start">
      
      {/* ── TOP HEADER / PATIENT CONTEXT ── */}
      <div className="bg-white border border-outline-variant/30 rounded-3xl p-5 sm:p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-primary/20">
            <span className="material-symbols-outlined text-[32px]">clinical_notes</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary bg-emerald-50 border border-primary/20 px-3 py-0.5 rounded-full">
                Step 4 of 5 • Patient Home
              </span>
              <span className="text-xs font-bold text-on-surface-variant">
                Mode: {selectedMode === 'voice' ? t('modeVoice') : t('modeTouch')}
              </span>
            </div>
            <h2 className="font-noto text-2xl sm:text-3xl font-extrabold text-on-surface mt-0.5">
              {patientIdentity.name || 'Ramesh Kumar'} (ABHA: {patientIdentity.idNumber || '91-8721-3940-1029'})
            </h2>
          </div>
        </div>

        {/* Doctor Portal View Trigger */}
        <button
          type="button"
          onClick={() => {
            if (onOpenDoctorPortal) {
              onOpenDoctorPortal();
            } else {
              setIsDoctorModalOpen(true);
            }
          }}
          className="px-4 py-2.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary font-bold text-xs sm:text-sm rounded-2xl flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[20px]">stethoscope</span>
          <span>View Doctor Portal</span>
        </button>
      </div>

      {/* ── 3 PARALLEL PATHS SELECTOR (TABS) ── */}
      <div className="mb-6">
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-2">
          Select Clinical Intake Method (3 Parallel Paths):
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          
          {/* Path 1 Tab */}
          <button
            type="button"
            onClick={() => setActivePath('upload')}
            className={`p-4 sm:p-5 rounded-2xl text-left border-2 transition-all cursor-pointer ${
              activePath === 'upload'
                ? 'border-primary bg-emerald-50/80 shadow-md ring-2 ring-primary/20'
                : 'border-outline-variant/30 bg-white hover:bg-surface-container'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">document_scanner</span>
              </span>
              <span className="text-[11px] font-bold bg-white text-primary px-2.5 py-0.5 rounded-full border border-primary/20">
                Path 1
              </span>
            </div>
            <h4 className="font-noto font-extrabold text-base sm:text-lg text-on-surface">
              Upload & Scan
            </h4>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Camera / file scan with alignment guide & document check
            </p>
          </button>

          {/* Path 2 Tab */}
          <button
            type="button"
            onClick={() => setActivePath('consult')}
            className={`p-4 sm:p-5 rounded-2xl text-left border-2 transition-all cursor-pointer ${
              activePath === 'consult'
                ? 'border-primary bg-emerald-50/80 shadow-md ring-2 ring-primary/20'
                : 'border-outline-variant/30 bg-white hover:bg-surface-container'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">smart_toy</span>
              </span>
              <span className="text-[11px] font-bold bg-white text-primary px-2.5 py-0.5 rounded-full border border-primary/20">
                Path 2 (AI Consult)
              </span>
            </div>
            <h4 className="font-noto font-extrabold text-base sm:text-lg text-on-surface">
              Consult with AI
            </h4>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Present problem ➔ Follow-up questions ➔ Structured history
            </p>
          </button>

          {/* Path 3 Tab */}
          <button
            type="button"
            onClick={() => setActivePath('extract')}
            className={`p-4 sm:p-5 rounded-2xl text-left border-2 transition-all cursor-pointer ${
              activePath === 'extract'
                ? 'border-primary bg-emerald-50/80 shadow-md ring-2 ring-primary/20'
                : 'border-outline-variant/30 bg-white hover:bg-surface-container'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">folder_shared</span>
              </span>
              <span className="text-[11px] font-bold bg-white text-primary px-2.5 py-0.5 rounded-full border border-primary/20">
                Path 3
              </span>
            </div>
            <h4 className="font-noto font-extrabold text-base sm:text-lg text-on-surface">
              ABDM Extract
            </h4>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Immediate retrieval of past hospital records & summary
            </p>
          </button>
        </div>
      </div>

      {/* ── ACTIVE PATH VISUAL SHOWCASE ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-md mb-8">
        
        {/* ════════════════ PATH 1: UPLOAD (CAMERA / FILE) ════════════════ */}
        {activePath === 'upload' && (
          <div>
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-outline-variant/30">
              <div>
                <h3 className="font-noto text-xl font-extrabold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[24px]">photo_camera</span>
                  Camera Scan & Document Verification
                </h3>
                <span className="text-xs text-on-surface-variant">
                  Live preview / alignment guide ➔ OCR extraction ➔ Document check
                </span>
              </div>

              {/* Demo quick trigger buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTriggerCorrectDoc}
                  className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Demo: Correct Document
                </button>
                <button
                  type="button"
                  onClick={handleTriggerIncorrectDoc}
                  className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  Demo: Incorrect Document
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Camera Live Preview with Alignment Guide */}
              <div className="lg:col-span-6 bg-surface-container-low rounded-2xl p-4 border border-outline-variant/30 flex flex-col items-center justify-center relative min-h-[300px]">
                {/* Alignment Box Overlay */}
                <div className="relative w-full max-w-sm h-60 border-2 border-dashed border-primary rounded-xl flex items-center justify-center p-4 bg-white/60 backdrop-blur-xs">
                  {/* Corner Crosshairs */}
                  <span className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary"></span>
                  <span className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary"></span>
                  <span className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary"></span>
                  <span className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary"></span>

                  <div className="text-center">
                    <span className="material-symbols-outlined text-primary text-[48px]">document_scanner</span>
                    <span className="text-xs font-bold text-primary block mt-1">
                      Alignment Guide: Place prescription inside frame
                    </span>
                    <span className="text-[11px] text-on-surface-variant block mt-0.5">
                      Ensures high readability for AI OCR extraction
                    </span>
                  </div>

                  {/* Scanning Bar Animation */}
                  {docStatus === 'scanning' && (
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-pulse"></div>
                  )}
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={handleTriggerCorrectDoc}
                    className="px-5 py-2.5 bg-primary text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                    Capture Document
                  </button>
                </div>
              </div>

              {/* OCR & Document Check Evaluation */}
              <div className="lg:col-span-6 bg-surface-container-low rounded-2xl p-5 border border-outline-variant/30">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-3">
                  Document Check & OCR Extraction Status:
                </span>

                {docStatus === 'scanning' ? (
                  <div className="text-center py-8">
                    <span className="material-symbols-outlined text-[40px] text-primary animate-spin">sync</span>
                    <h5 className="font-bold text-base text-on-surface mt-2">Running OCR & Clinical Entity Check...</h5>
                    <p className="text-xs text-on-surface-variant">Extracting medications, dates, doctor signature...</p>
                  </div>
                ) : docStatus === 'incorrect' ? (
                  /* ── INCORRECT / RE-UPLOAD LOOP ── */
                  <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5">
                    <div className="flex items-center gap-2 text-error font-extrabold text-base">
                      <span className="material-symbols-outlined text-[24px]">cancel</span>
                      Document Check: INCORRECT / UNREADABLE
                    </div>
                    <p className="text-xs text-on-surface-variant mt-2">
                      <strong>Reason:</strong> Image is blurry or text is illegible. The AI cannot reliably verify the prescription details.
                    </p>

                    {/* Re-upload Loop Button */}
                    <div className="mt-4 pt-3 border-t border-red-200">
                      <button
                        type="button"
                        onClick={() => setDocStatus('idle')}
                        className="px-4 py-2 bg-error text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm cursor-pointer active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[18px]">refresh</span>
                        Re-upload / Retake Photo
                      </button>
                    </div>
                  </div>
                ) : docStatus === 'correct' ? (
                  /* ── CORRECT / CONFIRMED DOCUMENT ── */
                  <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-5">
                    <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-base">
                      <span className="material-symbols-outlined text-[24px]">check_circle</span>
                      Document Check: CORRECT / CONFIRMED
                    </div>
                    <span className="text-xs text-emerald-700 font-semibold block mt-1">
                      Verified OPD Prescription • Dr. R.K. Gupta (Reg #49102)
                    </span>

                    <div className="mt-3 bg-white p-3 rounded-xl border border-emerald-200 text-xs space-y-1">
                      <div className="flex justify-between font-bold text-on-surface">
                        <span>Extracted Diagnosis:</span>
                        <span className="text-primary">Type 2 Diabetes / HTN</span>
                      </div>
                      <div className="flex justify-between text-on-surface-variant">
                        <span>Extracted Medications:</span>
                        <span>Tab Metformin 500mg, Tab Telmisartan 40mg</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-on-surface-variant text-xs">
                    <span className="material-symbols-outlined text-[36px] text-outline-variant block mb-1">preview</span>
                    Click "Demo: Correct Document" or "Demo: Incorrect Document" above to view the OCR & Document Check verification loop.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════ PATH 2: CONSULT WITH AI ════════════════ */}
        {activePath === 'consult' && (
          <div>
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-outline-variant/30">
              <div>
                <h3 className="font-noto text-xl font-extrabold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[24px]">record_voice_over</span>
                  AI Clinical Consultation & Dynamic Follow-up
                </h3>
                <span className="text-xs text-on-surface-variant">
                  Present problem ➔ AI follow-up questions ➔ Real-time red-flag check ➔ Structured history
                </span>
              </div>

              {/* Red-Flag Toggle Demo */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-on-surface-variant">Red-Flag:</span>
                <button
                  type="button"
                  onClick={() => setRedFlagStatus('green')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${redFlagStatus === 'green' ? 'bg-emerald-600 text-white' : 'bg-surface-container text-on-surface'}`}
                >
                  Normal
                </button>
                <button
                  type="button"
                  onClick={() => setRedFlagStatus('amber')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${redFlagStatus === 'amber' ? 'bg-amber-500 text-white' : 'bg-surface-container text-on-surface'}`}
                >
                  Moderate
                </button>
                <button
                  type="button"
                  onClick={() => setRedFlagStatus('red')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${redFlagStatus === 'red' ? 'bg-error text-white animate-pulse' : 'bg-surface-container text-on-surface'}`}
                >
                  Emergency
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Present Problem & AI Follow-Up Questions */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* 1. Present Problem Box */}
                <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-primary uppercase">1. Patient Presented Problem:</span>
                    <span className="text-[11px] font-bold bg-white text-on-surface-variant px-2 py-0.5 rounded-full">
                      Voice Transcribed (Hindi/English)
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-on-surface">
                    "मुझे 3 दिन से तेज़ बुखार, गले में खराश और सिरदर्द है। शरीर में बहुत कमजोरी लग रही है।"
                  </p>
                </div>

                {/* 2. Dynamic AI Follow-up Questions */}
                <div className="bg-emerald-50/70 p-5 rounded-2xl border border-primary/20">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-primary uppercase mb-3">
                    <span className="material-symbols-outlined text-[18px]">quiz</span>
                    2. AI Clinical Follow-Up Questions (Interactive):
                  </div>

                  {/* Question 1 */}
                  <div className="bg-white p-3.5 rounded-xl border border-primary/20 mb-3 text-xs">
                    <p className="font-bold text-on-surface mb-2">
                      Q1: सांस लेने में कोई तकलीफ या छाती में भारीपन है? (Any shortness of breath or chest heaviness?)
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFollowup1('no')}
                        className={`px-4 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                          followup1 === 'no' ? 'bg-primary text-white' : 'bg-surface-container text-on-surface'
                        }`}
                      >
                        {t('followupNo')}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setFollowup1('yes'); setRedFlagStatus('red'); }}
                        className={`px-4 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                          followup1 === 'yes' ? 'bg-error text-white' : 'bg-surface-container text-on-surface'
                        }`}
                      >
                        {t('followupYesRedFlag')}
                      </button>
                    </div>
                  </div>

                  {/* Question 2 */}
                  <div className="bg-white p-3.5 rounded-xl border border-primary/20 text-xs">
                    <p className="font-bold text-on-surface mb-2">
                      Q2: क्या आपको पहले से शुगर या बीपी की बीमारी है? (Any history of Diabetes or High BP?)
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFollowup2('yes')}
                        className={`px-4 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                          followup2 === 'yes' ? 'bg-primary text-white' : 'bg-surface-container text-on-surface'
                        }`}
                      >
                        {t('followupYesHighBP')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setFollowup2('no')}
                        className={`px-4 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                          followup2 === 'no' ? 'bg-primary text-white' : 'bg-surface-container text-on-surface'
                        }`}
                      >
                        {t('followupNo')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Structured Clinical History & Red-Flag Triage */}
              <div className="lg:col-span-5 bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30">
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30 mb-3">
                  <span className="text-xs font-bold text-on-surface-variant uppercase">
                    3. Structured Intake History:
                  </span>
                  <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                    redFlagStatus === 'red'
                      ? 'bg-error text-white animate-bounce'
                      : redFlagStatus === 'amber'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-900'
                  }`}>
                    {redFlagStatus === 'red' ? '🚨 Red-Flag Emergency' : redFlagStatus === 'amber' ? '⚠️ Moderate Triage' : '✅ Normal Triage'}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <span className="font-bold text-on-surface-variant block">Chief Complaint:</span>
                    <span className="font-bold text-on-surface text-sm">Fever (3 Days), Sore Throat & Headache</span>
                  </div>
                  <div>
                    <span className="font-bold text-on-surface-variant block">Follow-Up Intake:</span>
                    <span className="text-on-surface">No dyspnea; Pre-existing Hypertension on treatment</span>
                  </div>
                  <div>
                    <span className="font-bold text-on-surface-variant block">Recommended OPD Specialty:</span>
                    <span className="font-extrabold text-primary text-sm">General Medicine (Room 102)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════ PATH 3: ABDM EXTRACT ════════════════ */}
        {activePath === 'extract' && (
          <div>
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-outline-variant/30">
              <div>
                <h3 className="font-noto text-xl font-extrabold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[24px]">folder_shared</span>
                  ABDM Health Records Extraction
                </h3>
                <span className="text-xs text-on-surface-variant">
                  Immediate retrieval of existing records & AI summary without new inputs
                </span>
              </div>
              <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
                ABDM Vault Linked
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30">
                <span className="text-xs font-bold text-primary block">Past Visit: 14 Jan 2026</span>
                <h5 className="font-bold text-sm text-on-surface mt-0.5">District Hospital OPD • Dr. S.K. Sharma</h5>
                <p className="text-xs text-on-surface-variant mt-1">
                  Hypertension review: BP 138/88 mmHg. Rx: Tab Telmisartan 40mg OD.
                </p>
              </div>

              <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30">
                <span className="text-xs font-bold text-primary block">Lab Test: 02 Nov 2025</span>
                <h5 className="font-bold text-sm text-on-surface mt-0.5">Civil Hospital Pathology Lab</h5>
                <p className="text-xs text-on-surface-variant mt-1">
                  Complete Blood Count (CBC): Hb 13.8 g/dL, Platelets 2.4 Lakh. Normal.
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-primary/20 text-xs">
              <span className="font-bold text-primary block mb-1">Automated AI Synthesis:</span>
              <p className="text-on-surface leading-relaxed">
                Patient has a documented history of well-managed essential hypertension. No major drug allergies. Recent complete hemogram within normal physiological parameters.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── CONVERGENCE: PATIENT INFO + MEDICAL RECORDS + AI SUMMARY ── */}
      <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 rounded-3xl p-6 sm:p-8 border-2 border-primary/30 shadow-lg mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-primary/20">
          <div>
            <span className="text-xs font-extrabold uppercase bg-primary text-white px-3 py-1 rounded-full">
              Consolidated Convergence Package
            </span>
            <h3 className="font-noto text-xl sm:text-2xl font-black text-on-surface mt-1.5">
              Patient Information + Medical Records + AI Clinical Summary
            </h3>
          </div>
          <span className="text-xs font-bold text-primary bg-white px-3 py-1.5 rounded-xl border border-primary/20 shadow-sm self-start sm:self-auto">
            Ready for Print & Doctor Portal
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5 text-xs">
          <div className="bg-white p-4 rounded-2xl border border-primary/20 shadow-xs">
            <span className="font-bold text-on-surface-variant uppercase block">Patient Demographics</span>
            <p className="font-extrabold text-sm text-on-surface mt-1">{patientIdentity.name || 'Ramesh Kumar'} (48/M)</p>
            <p className="font-mono text-primary font-bold">{patientIdentity.idNumber || '91-8721-3940-1029'}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-primary/20 shadow-xs">
            <span className="font-bold text-on-surface-variant uppercase block">Extracted Medical Records</span>
            <p className="font-bold text-on-surface text-sm mt-1">1 Past Prescription • 1 Lab Report</p>
            <p className="text-emerald-700 font-semibold">ABDM Vault Connected</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-primary/20 shadow-xs">
            <span className="font-bold text-on-surface-variant uppercase block">AI Triage Summary</span>
            <p className="font-bold text-on-surface text-sm mt-1">General Medicine (Room 102)</p>
            <p className="text-on-surface-variant">Chief Complaint: Fever (3d) & Headache</p>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ACTIONS (DUAL OUTPUTS) ── */}
      <div className="w-full pt-2 pb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="h-16 sm:h-20 px-6 sm:px-8 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-base flex items-center justify-center gap-2 border border-outline-variant/30 active:scale-[0.99] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[26px]">arrow_back</span>
          <span>{t('backButton')}</span>
        </button>

        <button
          type="button"
          onClick={onStaffHelp}
          className="h-16 sm:h-20 px-6 sm:px-8 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-base flex items-center justify-center gap-2 border border-outline-variant/30 active:scale-[0.99] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[28px]">support_agent</span>
          <span>{t('staffHelp')}</span>
        </button>

        {/* Action 1: Extract / Print OPD Token Slip */}
        <button
          type="button"
          id="generate-token-slip-btn"
          onClick={handleProceed}
          className="flex-1 h-16 sm:h-20 px-8 rounded-2xl bg-primary hover:bg-primary-dark text-white font-noto text-xl sm:text-2xl font-extrabold flex items-center justify-center gap-3 shadow-xl shadow-primary/30 active:scale-[0.99] transition-all cursor-pointer"
        >
          <span>Extract / Print OPD Token Slip</span>
          <span className="material-symbols-outlined text-[32px]">print</span>
        </button>
      </div>

      {/* ── DOCTOR PORTAL PREVIEW MODAL ── */}
      {isDoctorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl border border-outline-variant/30 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30 mb-5">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[28px]">stethoscope</span>
                </span>
                <div>
                  <h3 className="font-noto text-2xl font-extrabold text-on-surface">
                    Doctor Portal • Room 102 (General Medicine)
                  </h3>
                  <span className="text-xs text-on-surface-variant font-medium">
                    Dr. Priya Sharma (MBBS, MD) • Live OPD Queue
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDoctorModalOpen(false)}
                className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            {/* Doctor Review: AI Pre-Consultation Summary */}
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="bg-emerald-50 border border-primary/30 p-4 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-primary text-sm">
                    Patient: Ramesh Kumar (48/M) • Token MED-105
                  </span>
                  <span className="bg-primary text-white px-2.5 py-0.5 rounded-full font-bold text-xs">
                    Yellow - Moderate Priority
                  </span>
                </div>
                <p className="text-on-surface leading-relaxed">
                  <strong>AI Structured Summary:</strong> 3-day history of high fever, headache and throat soreness. Follow-up confirms no chest discomfort or acute shortness of breath. ABDM records confirm pre-existing hypertension (on Telmisartan 40mg).
                </p>
              </div>

              {/* Consultation / Clinical Decision Action */}
              <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30">
                <span className="font-bold text-on-surface uppercase block mb-2">
                  Doctor Clinical Decision & Prescription:
                </span>
                <textarea
                  readOnly
                  rows={3}
                  value="1. Tab Paracetamol 650mg TDS x 3 days&#10;2. Tab Cetirizine 10mg OD HS x 3 days&#10;3. Complete Hemogram (CBC) & Dengue NS1 Antigen test"
                  className="w-full p-3 rounded-xl bg-white border border-outline-variant/40 font-mono text-xs text-on-surface focus:outline-none"
                />
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      alert('Prescription submitted and synced to ABDM Health Locker!');
                      setIsDoctorModalOpen(false);
                    }}
                    className="px-5 py-2.5 bg-primary text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
                  >
                    Confirm Clinical Decision & Sign Rx
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
