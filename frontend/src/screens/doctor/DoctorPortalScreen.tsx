import React, { useState } from 'react';
import type { Language } from '../../types';

interface DoctorPortalScreenProps {
  onBackToKiosk: () => void;
  selectedLanguage: Language;
}

interface QueuedPatient {
  id: string;
  token: string;
  name: string;
  age: number;
  gender: string;
  abhaId: string;
  complaint: string;
  priority: 'red' | 'amber' | 'green';
  priorityLabel: string;
  status: 'waiting' | 'in_consultation' | 'completed';
  timeWaiting: string;
  vitals: { bp: string; pulse: string; spo2: string; temp: string };
  whatChanged: string;
  whatConflicts: string;
  whatsMissing: string;
  whereFrom: string;
  hpi: string;
  labResults: { test: string; value: string; ref: string; isAbnormal: boolean }[];
  activeMeds: { name: string; dose: string; freq: string; duration: string }[];
  hasAyush?: boolean;
}

const SAMPLE_QUEUE: QueuedPatient[] = [
  {
    id: 'pat-1',
    token: 'MED-105',
    name: 'Ramesh Kumar',
    age: 48,
    gender: 'Male',
    abhaId: '91-8721-3940-1029',
    complaint: 'High Fever (3 Days), Severe Headache & Body Malaise',
    priority: 'amber',
    priorityLabel: 'Priority Triage',
    status: 'waiting',
    timeWaiting: '8 mins',
    vitals: { bp: '142/90 mmHg', pulse: '88 bpm', spo2: '98%', temp: '101.4°F' },
    whatChanged: 'Fever onset 3 days ago with chills. Systolic BP elevated to 142 mmHg (baseline 128 mmHg).',
    whatConflicts: 'Patient stated taking Metformin 1000mg BID; last ABDM prescription shows 500mg OD.',
    whatsMissing: 'No recent Liver Function Test (LFT) on record; patient reports occasional nausea.',
    whereFrom: 'ABDM Health Locker • District Hospital OPD visit (14 Jan 2026)',
    hpi: '48-year-old male presents with acute febrile illness for 3 days accompanied by retro-orbital headache and throat pain. Kiosk AI intake confirms no chest pain or shortness of breath. History of essential hypertension.',
    labResults: [
      { test: 'HbA1c (Glycated Hemoglobin)', value: '8.4 %', ref: '4.0 - 5.6 %', isAbnormal: true },
      { test: 'Fasting Blood Glucose', value: '168 mg/dL', ref: '70 - 100 mg/dL', isAbnormal: true },
      { test: 'Serum Creatinine', value: '0.9 mg/dL', ref: '0.6 - 1.2 mg/dL', isAbnormal: false },
      { test: 'Total Hemoglobin', value: '13.8 g/dL', ref: '13.0 - 17.0 g/dL', isAbnormal: false },
    ],
    activeMeds: [
      { name: 'Tab Telmisartan', dose: '40mg', freq: 'OD (Morning)', duration: 'Active' },
      { name: 'Tab Metformin', dose: '500mg', freq: 'OD (Post-Dinner)', duration: 'Active' },
    ],
  },
  {
    id: 'pat-2',
    token: 'CARD-089',
    name: 'Sunita Devi',
    age: 56,
    gender: 'Female',
    abhaId: '91-5510-9281-4401',
    complaint: 'Substernal Chest Heaviness radiating to Left Arm',
    priority: 'red',
    priorityLabel: '🚨 RED-FLAG EMERGENCY',
    status: 'in_consultation',
    timeWaiting: 'Just Arrived',
    vitals: { bp: '168/102 mmHg', pulse: '104 bpm', spo2: '94%', temp: '98.6°F' },
    whatChanged: 'Sudden onset chest pain 90 minutes ago during light walking. Diaphoresis noted.',
    whatConflicts: 'Discontinued prescribed Beta-Blocker 2 weeks ago due to dizziness without doctor advice.',
    whatsMissing: 'Immediate 12-lead ECG & Serum Troponin-I urgently required.',
    whereFrom: 'AI Kiosk Red-Flag Detector • Prior Visit at City Cardiac Center (Oct 2025)',
    hpi: '56-year-old female triaged via Kiosk with acute chest tightness radiating to the left shoulder and jaw. AI Red-Flag system flagged emergency escalation directly to doctor workstation.',
    labResults: [
      { test: 'Total Cholesterol', value: '242 mg/dL', ref: '< 200 mg/dL', isAbnormal: true },
      { test: 'LDL Cholesterol', value: '158 mg/dL', ref: '< 100 mg/dL', isAbnormal: true },
      { test: 'Serum Potassium', value: '4.2 mEq/L', ref: '3.5 - 5.0 mEq/L', isAbnormal: false },
    ],
    activeMeds: [
      { name: 'Tab Atorvastatin', dose: '20mg', freq: 'OD HS', duration: 'Discontinued' },
      { name: 'Tab Amlodipine', dose: '5mg', freq: 'OD Morning', duration: 'Irregular' },
    ],
  },
  {
    id: 'pat-3',
    token: 'ORTHO-042',
    name: 'Baldev Singh',
    age: 62,
    gender: 'Male',
    abhaId: '91-3329-8472-9182',
    complaint: 'Bilateral Knee Joint Stiffness & Crepitus (AYUSH History)',
    priority: 'green',
    priorityLabel: 'Routine Consultation',
    status: 'waiting',
    timeWaiting: '14 mins',
    vitals: { bp: '130/82 mmHg', pulse: '76 bpm', spo2: '99%', temp: '98.4°F' },
    whatChanged: 'Morning stiffness duration increased from 15 mins to 45 mins over last 2 months.',
    whatConflicts: 'Taking indigenous Ayurvedic herbal decoctions (Shallaki/Guggulu) concurrently with Allopathic NSAIDs.',
    whatsMissing: 'Weight-bearing Bilateral Knee X-ray AP & Lateral views pending.',
    whereFrom: 'AYUSH Integrated OPD Module • Patiala Civil Hospital',
    hpi: '62-year-old retired farmer with 4-year history of Osteoarthritis. Prefers AYUSH integrated protocol. Currently taking Shallaki Rasayana along with SOS Paracetamol.',
    labResults: [
      { test: 'Serum Uric Acid', value: '5.8 mg/dL', ref: '3.5 - 7.2 mg/dL', isAbnormal: false },
      { test: 'ESR (Erythrocyte Sedimentation Rate)', value: '28 mm/hr', ref: '< 20 mm/hr', isAbnormal: true },
    ],
    activeMeds: [
      { name: 'Tab Shallaki', dose: '400mg', freq: 'BD', duration: 'Ayush' },
      { name: 'Tab Calcium + Vit D3', dose: '500mg', freq: 'OD', duration: 'Active' },
    ],
    hasAyush: true,
  },
];

export const DoctorPortalScreen: React.FC<DoctorPortalScreenProps> = ({
  onBackToKiosk,
}) => {
  const [queue, setQueue] = useState<QueuedPatient[]>(SAMPLE_QUEUE);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(SAMPLE_QUEUE[0].id);
  const [activeTab, setActiveTab] = useState<'summary' | 'records' | 'ask_records'>('summary');
  const [askQuery, setAskQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  const [prescriptionNotes, setPrescriptionNotes] = useState(
    '1. Tab Paracetamol 650mg TDS x 3 days\n2. Tab Cetirizine 10mg OD HS x 3 days\n3. Continue Tab Telmisartan 40mg OD\n4. Advised CBC & Dengue NS1'
  );
  const [finalDiagnosis, setFinalDiagnosis] = useState('Acute Viral Upper Respiratory Infection + Stage 1 Essential HTN');
  const [isSaved, setIsSaved] = useState(false);

  const selectedPatient = queue.find((p) => p.id === selectedPatientId) || queue[0];

  const handleAskMyRecords = (questionText: string) => {
    setAskQuery(questionText);
    setIsAsking(true);
    setTimeout(() => {
      setIsAsking(false);
      if (questionText.toLowerCase().includes('hba1c') || questionText.toLowerCase().includes('sugar')) {
        setAiAnswer(
          `**Source: Civil Hospital Pathology Lab (14 Jan 2026)**\n- HbA1c was **8.4%** (Reference: 4.0 - 5.6%), indicating suboptimal glycemic control.\n- Fasting Blood Sugar was **168 mg/dL**.\n- *Recommendation:* Consider endocrinology consult or adjusting Metformin titration.`
        );
      } else if (questionText.toLowerCase().includes('interaction') || questionText.toLowerCase().includes('conflict')) {
        setAiAnswer(
          `**Dosage & Safety Conflict Detected:**\n- Patient reported taking Metformin 1000mg twice daily, but ABDM record (14 Jan 2026) specifies **500mg OD**.\n- No severe pharmacokinetic contraindication found with Telmisartan 40mg.`
        );
      } else {
        setAiAnswer(
          `**ABDM Health Summary for ${selectedPatient.name}:**\n- Most recent visit: 14 Jan 2026 (District Hospital).\n- Active Diagnoses: Essential Hypertension, Type 2 Diabetes.\n- No known penicillin or sulfa drug allergies.`
        );
      }
    }, 600);
  };

  const handleSignPrescription = () => {
    setIsSaved(true);
    setQueue((prev) =>
      prev.map((p) => (p.id === selectedPatient.id ? { ...p, status: 'completed' } : p))
    );
    setTimeout(() => {
      alert(`Prescription digitally signed & synced to ABDM Health Locker for ${selectedPatient.name}!`);
      setIsSaved(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-[#131B2E] flex flex-col justify-between font-sans">
      
      {/* ── DOCTOR WORKSPACE TOP BAR ── */}
      <header className="sticky top-0 z-40 bg-[#0A2540] text-white px-4 sm:px-8 py-3.5 shadow-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
            <span className="material-symbols-outlined text-[26px]">stethoscope</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                SwasthyaLok Doctor Workspace
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">
              Dr. Priya Sharma, MD • Room 102 (General Medicine OPD)
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Queue Statistics Pill */}
          <div className="hidden md:flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl text-xs font-semibold">
            <span>Queue: <strong className="text-emerald-400">3 Patients</strong></span>
            <span className="opacity-50">|</span>
            <span className="text-red-300 font-bold">1 Red-Flag Alert</span>
          </div>

          {/* Switch Back to Kiosk Button */}
          <button
            type="button"
            onClick={onBackToKiosk}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">kiosk</span>
            <span>Switch to Patient Kiosk</span>
          </button>
        </div>
      </header>

      {/* ── MAIN WORKSPACE CONTENT ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ════════ LEFT COLUMN: LIVE OPD QUEUE (4 Cols) ════════ */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30 mb-4">
            <h3 className="font-noto font-extrabold text-base sm:text-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">format_list_bulleted</span>
              Live OPD Patient Queue
            </h3>
            <span className="text-xs font-bold bg-surface-container px-2.5 py-0.5 rounded-full text-on-surface-variant">
              {queue.length} Active
            </span>
          </div>

          <div className="space-y-3">
            {queue.map((pat) => {
              const isSelected = pat.id === selectedPatient.id;
              return (
                <div
                  key={pat.id}
                  onClick={() => setSelectedPatientId(pat.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-emerald-50/80 shadow-md ring-2 ring-primary/20'
                      : pat.priority === 'red'
                      ? 'border-red-300 bg-red-50/50 hover:bg-red-50'
                      : 'border-outline-variant/20 bg-white hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded-md bg-white border border-outline-variant/30 text-primary">
                      {pat.token}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        pat.priority === 'red'
                          ? 'bg-error text-white animate-pulse'
                          : pat.priority === 'amber'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-900'
                      }`}
                    >
                      {pat.priorityLabel}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-on-surface">
                    {pat.name} <span className="text-xs font-normal text-on-surface-variant">({pat.age}y / {pat.gender})</span>
                  </h4>
                  <p className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">
                    {pat.complaint}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[11px] font-semibold text-on-surface-variant">
                    <span>Wait: {pat.timeWaiting}</span>
                    <span className={`capitalize font-bold ${pat.status === 'completed' ? 'text-emerald-600' : 'text-primary'}`}>
                      {pat.status === 'completed' ? '✓ Completed' : pat.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ════════ RIGHT COLUMN: CLINICAL CASE INTELLIGENCE (8 Cols) ════════ */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* ── PATIENT DEMOGRAPHIC & VITALS BANNER ── */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-outline-variant/30 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-outline-variant/30">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black bg-primary text-white px-2.5 py-0.5 rounded-md">
                    {selectedPatient.token}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ABDM Verified
                  </span>
                  {selectedPatient.hasAyush && (
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      AYUSH Integrated
                    </span>
                  )}
                </div>
                <h2 className="font-noto text-2xl font-black text-on-surface mt-1">
                  {selectedPatient.name}
                  <span className="text-sm font-normal text-on-surface-variant ml-2">
                    {selectedPatient.age} Years • {selectedPatient.gender} • ABHA: {selectedPatient.abhaId}
                  </span>
                </h2>
              </div>

              {/* Status Indicator */}
              <span className={`px-3 py-1 rounded-xl text-xs font-extrabold uppercase self-start sm:self-auto ${
                selectedPatient.priority === 'red' ? 'bg-error text-white animate-bounce' : 'bg-primary-light text-primary'
              }`}>
                {selectedPatient.priorityLabel}
              </span>
            </div>

            {/* Vitals Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
              <div className="bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/20">
                <span className="text-on-surface-variant block">Blood Pressure</span>
                <span className="font-bold text-on-surface text-sm">{selectedPatient.vitals.bp}</span>
              </div>
              <div className="bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/20">
                <span className="text-on-surface-variant block">Pulse Rate</span>
                <span className="font-bold text-on-surface text-sm">{selectedPatient.vitals.pulse}</span>
              </div>
              <div className="bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/20">
                <span className="text-on-surface-variant block">SpO2 Oxygen</span>
                <span className="font-bold text-on-surface text-sm">{selectedPatient.vitals.spo2}</span>
              </div>
              <div className="bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/20">
                <span className="text-on-surface-variant block">Temperature</span>
                <span className="font-bold text-primary text-sm">{selectedPatient.vitals.temp}</span>
              </div>
            </div>
          </div>

          {/* ── 4 PILLARS OF CLINICAL CONTEXT INTELLIGENCE (USP) ── */}
          <div className="bg-gradient-to-r from-emerald-50 via-white to-emerald-50/40 rounded-3xl p-5 border-2 border-primary/30 shadow-md">
            <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-wider mb-3">
              <span className="material-symbols-outlined text-[20px]">psychology</span>
              <span>4 Pillars of Clinical Context Intelligence (AI Engine USP)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-primary/20 shadow-xs">
                <strong className="text-emerald-800 flex items-center gap-1.5 mb-1">
                  <span className="material-symbols-outlined text-[16px]">change_circle</span>
                  1. What Changed? (Delta):
                </strong>
                <p className="text-on-surface">{selectedPatient.whatChanged}</p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-xs">
                <strong className="text-amber-800 flex items-center gap-1.5 mb-1">
                  <span className="material-symbols-outlined text-[16px]">warning</span>
                  2. What Conflicts? (Discrepancies):
                </strong>
                <p className="text-on-surface">{selectedPatient.whatConflicts}</p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-blue-200 shadow-xs">
                <strong className="text-blue-800 flex items-center gap-1.5 mb-1">
                  <span className="material-symbols-outlined text-[16px]">help_center</span>
                  3. What's Missing? (Critical Gaps):
                </strong>
                <p className="text-on-surface">{selectedPatient.whatsMissing}</p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-purple-200 shadow-xs">
                <strong className="text-purple-800 flex items-center gap-1.5 mb-1">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  4. Where Did It Come From? (Citations):
                </strong>
                <p className="text-on-surface">{selectedPatient.whereFrom}</p>
              </div>
            </div>
          </div>

          {/* ── WORKSPACE TABS: SUMMARY / RECORDS / ASK MY RECORDS ── */}
          <div className="bg-white rounded-3xl p-6 border border-outline-variant/30 shadow-sm">
            <div className="flex gap-2 border-b border-outline-variant/30 pb-3 mb-5">
              <button
                type="button"
                onClick={() => setActiveTab('summary')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'summary' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                Clinical Pre-Consultation Summary
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('records')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'records' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                Lab Trends & Active Meds
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ask_records')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'ask_records' ? 'bg-primary text-white shadow-sm' : 'text-primary bg-emerald-50 hover:bg-emerald-100'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                Ask My Records (AI RAG)
              </button>
            </div>

            {/* TAB 1: SUMMARY */}
            {activeTab === 'summary' && (
              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <span className="text-xs font-bold text-on-surface-variant uppercase block mb-1">
                    Chief Complaint & History of Present Illness (HPI):
                  </span>
                  <p className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/20 leading-relaxed font-medium text-on-surface">
                    {selectedPatient.hpi}
                  </p>
                </div>

                <div>
                  <span className="text-xs font-bold text-on-surface-variant uppercase block mb-1">
                    Active Medications & Regimen:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedPatient.activeMeds.map((med, idx) => (
                      <div key={idx} className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-on-surface block">{med.name} {med.dose}</span>
                          <span className="text-xs text-on-surface-variant">{med.freq}</span>
                        </div>
                        <span className="text-[11px] font-bold bg-white text-primary px-2 py-0.5 rounded-md border border-outline-variant/20">
                          {med.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: RECORDS & LAB TRENDS */}
            {activeTab === 'records' && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-on-surface-variant uppercase block">
                  Automated Lab Investigations & Trend Analysis:
                </span>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-surface-container text-on-surface-variant font-bold uppercase">
                      <tr>
                        <th className="p-2.5 rounded-l-lg">Test Name</th>
                        <th className="p-2.5">Result</th>
                        <th className="p-2.5">Reference Range</th>
                        <th className="p-2.5 rounded-r-lg">Flag</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      {selectedPatient.labResults.map((lab, idx) => (
                        <tr key={idx} className={lab.isAbnormal ? 'bg-red-50/40' : ''}>
                          <td className="p-2.5 font-bold text-on-surface">{lab.test}</td>
                          <td className={`p-2.5 font-mono font-bold ${lab.isAbnormal ? 'text-error' : 'text-emerald-700'}`}>
                            {lab.value}
                          </td>
                          <td className="p-2.5 text-on-surface-variant">{lab.ref}</td>
                          <td className="p-2.5">
                            {lab.isAbnormal ? (
                              <span className="bg-error text-white px-2 py-0.5 rounded-full font-bold text-[10px]">
                                ABNORMAL
                              </span>
                            ) : (
                              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                                NORMAL
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: ASK MY RECORDS (RAG ASSISTANT) */}
            {activeTab === 'ask_records' && (
              <div className="space-y-4">
                <div className="bg-emerald-50 p-3.5 rounded-2xl border border-primary/20 text-xs">
                  <span className="font-bold text-primary block mb-1">
                    Ask My Records AI Semantic Assistant:
                  </span>
                  <p className="text-on-surface">
                    Query the patient's entire historical health record (past prescriptions, lab reports, discharge summaries) with instant source citations.
                  </p>
                </div>

                {/* Sample Prompt Chips */}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleAskMyRecords("What was the patient's HbA1c and glucose trend?")}
                    className="px-3 py-1.5 bg-surface-container hover:bg-emerald-100 text-on-surface font-semibold text-xs rounded-xl border border-outline-variant/30 cursor-pointer"
                  >
                    💬 HbA1c & Glucose trend
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAskMyRecords("Check for dosage discrepancies in Metformin")}
                    className="px-3 py-1.5 bg-surface-container hover:bg-emerald-100 text-on-surface font-semibold text-xs rounded-xl border border-outline-variant/30 cursor-pointer"
                  >
                    💬 Check dosage discrepancies
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAskMyRecords("Summarize past hospital visits")}
                    className="px-3 py-1.5 bg-surface-container hover:bg-emerald-100 text-on-surface font-semibold text-xs rounded-xl border border-outline-variant/30 cursor-pointer"
                  >
                    💬 Summarize past visits
                  </button>
                </div>

                {/* Search Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={askQuery}
                    onChange={(e) => setAskQuery(e.target.value)}
                    placeholder="Ask anything about patient's past medical history..."
                    className="flex-1 h-12 px-4 rounded-xl bg-surface-container text-xs font-medium focus:outline-none border border-outline-variant/40"
                  />
                  <button
                    type="button"
                    onClick={() => handleAskMyRecords(askQuery || "What are the active diagnoses?")}
                    className="px-5 h-12 bg-primary text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">search</span>
                    Query
                  </button>
                </div>

                {/* AI Answer Box */}
                {isAsking ? (
                  <div className="p-4 bg-surface-container-low rounded-2xl text-center text-xs text-primary font-bold animate-pulse">
                    Synthesizing ABDM Health Locker Records & OCR Prescriptions...
                  </div>
                ) : aiAnswer ? (
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-primary/30 text-xs whitespace-pre-line leading-relaxed text-on-surface">
                    {aiAnswer}
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* ── DOCTOR DECISION & DIGITAL PRESCRIPTION PAD ── */}
          <div className="bg-white rounded-3xl p-6 border border-outline-variant/30 shadow-sm">
            <h3 className="font-noto font-extrabold text-base sm:text-lg text-on-surface flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary text-[22px]">edit_document</span>
              Doctor Clinical Decision & Digital Prescription
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-on-surface-variant uppercase block mb-1">
                  Final Clinical Diagnosis:
                </label>
                <input
                  type="text"
                  value={finalDiagnosis}
                  onChange={(e) => setFinalDiagnosis(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-surface-container text-on-surface font-bold text-xs border border-outline-variant/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface-variant uppercase block mb-1">
                  Prescription & Orders (Rx):
                </label>
                <textarea
                  rows={4}
                  value={prescriptionNotes}
                  onChange={(e) => setPrescriptionNotes(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-surface-container text-on-surface font-mono text-xs border border-outline-variant/40 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[11px] text-on-surface-variant">
                  Digitally signed by Dr. Priya Sharma • Integrated with ABDM National Health Locker
                </span>

                <button
                  type="button"
                  onClick={handleSignPrescription}
                  className="w-full sm:w-auto px-6 h-12 bg-primary hover:bg-primary-dark text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isSaved ? 'check_circle' : 'verified'}
                  </span>
                  <span>{isSaved ? 'Synced to ABDM' : 'Sign & Complete Consultation'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
