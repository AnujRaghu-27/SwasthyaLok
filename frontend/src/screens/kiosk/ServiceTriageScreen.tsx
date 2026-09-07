import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Language, InteractionMode, PatientIdentity, OpdDepartment, TriageData } from '../../types';
import { voiceService } from '../../services/voice';

interface ServiceTriageScreenProps {
  selectedLanguage: Language;
  selectedMode: InteractionMode;
  onModeChange: (mode: InteractionMode) => void;
  patientIdentity: PatientIdentity;
  onProceed: (triageData: TriageData) => void;
  onBack: () => void;
  onStaffHelp?: () => void;
}

export const OPD_DEPARTMENTS: OpdDepartment[] = [
  {
    id: 'general_medicine',
    nameKey: 'deptGeneral',
    nameFallback: 'General Medicine',
    subKey: 'deptGeneralSub',
    subFallback: 'Fever, cold, weakness, infection',
    icon: 'stethoscope',
    room: 'Room 102',
    doctorName: 'Dr. Priya Sharma (MBBS, MD)',
    queueCount: 4,
    estWaitMin: 12,
  },
  {
    id: 'orthopedics',
    nameKey: 'deptOrtho',
    nameFallback: 'Orthopedics',
    subKey: 'deptOrthoSub',
    subFallback: 'Bone fracture, joint & back pain',
    icon: 'orthopedics',
    room: 'Room 205',
    doctorName: 'Dr. Rajesh Verma (MS Ortho)',
    queueCount: 7,
    estWaitMin: 20,
  },
  {
    id: 'pediatrics',
    nameKey: 'deptPediatrics',
    nameFallback: 'Pediatrics',
    subKey: 'deptPediatricsSub',
    subFallback: 'Child health, immunization, fever',
    icon: 'child_care',
    room: 'Room 108',
    doctorName: 'Dr. Sunita Rao (MD Pedia)',
    queueCount: 3,
    estWaitMin: 8,
  },
  {
    id: 'ent',
    nameKey: 'deptEnt',
    nameFallback: 'ENT (Ear, Nose, Throat)',
    subKey: 'deptEntSub',
    subFallback: 'Throat pain, ear discharge, sinusitis',
    icon: 'hearing',
    room: 'Room 214',
    doctorName: 'Dr. Amit Mehta (MS ENT)',
    queueCount: 5,
    estWaitMin: 15,
  },
  {
    id: 'ophthalmology',
    nameKey: 'deptEye',
    nameFallback: 'Ophthalmology',
    subKey: 'deptEyeSub',
    subFallback: 'Eye redness, blurred vision, irritation',
    icon: 'visibility',
    room: 'Room 119',
    doctorName: 'Dr. Neha Patel (MS Opthal)',
    queueCount: 2,
    estWaitMin: 6,
  },
  {
    id: 'cardiology',
    nameKey: 'deptCardio',
    nameFallback: 'Cardiology',
    subKey: 'deptCardioSub',
    subFallback: 'Chest discomfort, breathlessness, BP',
    icon: 'cardiology',
    room: 'Room 301',
    doctorName: 'Dr. Vikram Sen (DM Cardio)',
    queueCount: 6,
    estWaitMin: 18,
  },
  {
    id: 'gynecology',
    nameKey: 'deptGynae',
    nameFallback: 'Gynecology & Obstetrics',
    subKey: 'deptGynaeSub',
    subFallback: 'Maternal care, women health',
    icon: 'pregnant_woman',
    room: 'Room 208',
    doctorName: 'Dr. Ananya Roy (MD OB-GYN)',
    queueCount: 5,
    estWaitMin: 14,
  },
  {
    id: 'dermatology',
    nameKey: 'deptDerma',
    nameFallback: 'Dermatology',
    subKey: 'deptDermaSub',
    subFallback: 'Skin allergy, rash, itching',
    icon: 'dermatology',
    room: 'Room 122',
    doctorName: 'Dr. Farhan Ali (MD Derma)',
    queueCount: 4,
    estWaitMin: 10,
  },
];

const COMMON_SYMPTOMS = [
  { id: 'fever', label: 'बुखार / Fever', deptId: 'general_medicine' },
  { id: 'cough', label: 'खांसी / Cold & Cough', deptId: 'general_medicine' },
  { id: 'joint_pain', label: 'जोड़ों में दर्द / Joint Pain', deptId: 'orthopedics' },
  { id: 'headache', label: 'सिरदर्द / Severe Headache', deptId: 'general_medicine' },
  { id: 'eye_redness', label: 'आंख में जलन / Eye Redness', deptId: 'ophthalmology' },
  { id: 'chest_tightness', label: 'छाती में भारीपन / Chest Pain', deptId: 'cardiology' },
  { id: 'skin_rash', label: 'त्वचा पर दाने / Skin Rash', deptId: 'dermatology' },
  { id: 'ear_pain', label: 'कान में दर्द / Ear Pain', deptId: 'ent' },
];

const VOICE_PRESETS = [
  {
    title: 'बुखार और सिरदर्द (3 दिन)',
    transcript: 'मुझे 3 दिन से तेज़ बुखार, गले में खराश और सिरदर्द है। कमजोरी भी लग रही है।',
    chiefComplaint: 'Fever, Sore Throat & Headache',
    duration: '3 days',
    severity: 'moderate' as const,
    deptId: 'general_medicine',
  },
  {
    title: 'घुटने में दर्द व सूजन',
    transcript: 'चलने में दाएं घुटने में बहुत दर्द होता है और सूजन आ गई है।',
    chiefComplaint: 'Right Knee Pain & Joint Swelling',
    duration: '1 week',
    severity: 'normal' as const,
    deptId: 'orthopedics',
  },
  {
    title: 'छाती में बेचैनी व सांस फूलना',
    transcript: 'छाती के बाईं ओर भारीपन महसूस हो रहा है और सांस लेने में कठिनाई है।',
    chiefComplaint: 'Chest Heaviness & Dyspnea',
    duration: '2 hours (Urgent)',
    severity: 'emergency' as const,
    deptId: 'cardiology',
  },
];

export const ServiceTriageScreen: React.FC<ServiceTriageScreenProps> = ({
  selectedLanguage,
  selectedMode,
  onModeChange,
  patientIdentity,
  onProceed,
  onBack,
  onStaffHelp,
}) => {
  const { t } = useTranslation('common');
  const [selectedDept, setSelectedDept] = useState<OpdDepartment>(OPD_DEPARTMENTS[0]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['fever']);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>(
    'मुझे 3 दिन से तेज़ बुखार, गले में खराश और सिरदर्द है। कमजोरी भी लग रही है।'
  );
  const [chiefComplaint, setChiefComplaint] = useState<string>('Fever, Sore Throat & Headache');
  const [duration, setDuration] = useState<string>('3 days');
  const [severity, setSeverity] = useState<'normal' | 'moderate' | 'urgent' | 'emergency'>('moderate');
  const [audioToast, setAudioToast] = useState<string | null>(null);

  const showAudioToast = (msg: string) => {
    setAudioToast(msg);
    setTimeout(() => setAudioToast(null), 3000);
  };

  const handleSymptomToggle = (symptomId: string, targetDeptId: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId) ? prev.filter(s => s !== symptomId) : [...prev, symptomId]
    );
    const targetDept = OPD_DEPARTMENTS.find(d => d.id === targetDeptId);
    if (targetDept) {
      setSelectedDept(targetDept);
      setChiefComplaint(symptomId.replace('_', ' ').toUpperCase());
    }
  };

  const handleApplyVoicePreset = (preset: typeof VOICE_PRESETS[0]) => {
    setVoiceTranscript(preset.transcript);
    setChiefComplaint(preset.chiefComplaint);
    setDuration(preset.duration);
    setSeverity(preset.severity);
    const matchedDept = OPD_DEPARTMENTS.find(d => d.id === preset.deptId) || OPD_DEPARTMENTS[0];
    setSelectedDept(matchedDept);
    showAudioToast(`AI Triage: Assigned to ${matchedDept.nameFallback}`);
    voiceService.speak(`Assigned to ${matchedDept.nameFallback}, ${matchedDept.room}`, selectedLanguage);
  };

  const handleMicToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      showAudioToast('AI4Bharat Indic ASR: Listening...');
      setTimeout(() => {
        setIsRecording(false);
        showAudioToast('Voice input processed successfully');
      }, 3500);
    } else {
      setIsRecording(false);
    }
  };

  const handleConfirm = () => {
    const triageData: TriageData = {
      department: selectedDept,
      chiefComplaint,
      symptoms: selectedSymptoms,
      duration,
      severity,
      extractedVia: selectedMode,
    };
    onProceed(triageData);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col justify-start">
      
      {/* ── TOP PATIENT & MODE SWITCHER BANNER ── */}
      <div className="bg-white border border-outline-variant/30 rounded-3xl p-5 sm:p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-xl shadow-md shadow-primary/20">
            <span className="material-symbols-outlined text-[30px]">local_hospital</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-primary bg-emerald-50 border border-primary/20 px-3 py-0.5 rounded-full">
                Step 4 of 5 • OPD Triage
              </span>
              <span className="text-xs font-bold text-on-surface-variant">
                {patientIdentity.name || 'Patient'} • ABHA: {patientIdentity.idNumber || 'Verified'}
              </span>
            </div>
            <h2 className="font-noto text-2xl sm:text-3xl font-extrabold text-on-surface mt-0.5">
              {t('triageHeading')}
            </h2>
          </div>
        </div>

        {/* Mode Switcher Pill */}
        <button
          type="button"
          onClick={() => onModeChange(selectedMode === 'voice' ? 'touch' : 'voice')}
          className="px-4 py-2.5 rounded-2xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-primary font-bold text-sm flex items-center gap-2.5 shadow-sm active:scale-95 transition-all cursor-pointer self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[20px]">
            {selectedMode === 'voice' ? 'touch_app' : 'mic'}
          </span>
          <span>
            {selectedMode === 'voice' ? t('switchModeTouch') : t('switchModeVoice')}
          </span>
        </button>
      </div>

      {/* ── CONDITIONAL VIEW: VOICE MODE VS TOUCH SCREEN ── */}
      {selectedMode === 'voice' ? (
        /* ═════════ VOICE CONSULTATION VIEW ═════════ */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mb-8 items-start">
          
          {/* Left: Interactive Voice Intake Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>AI4Bharat Indic Voice ASR/TTS Engine</span>
              </div>
              <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
                {selectedLanguage.toUpperCase()}
              </span>
            </div>

            {/* Mic Centerpiece */}
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <button
                type="button"
                onClick={handleMicToggle}
                className={`w-28 h-28 rounded-full flex items-center justify-center text-white shadow-2xl transition-all cursor-pointer active:scale-95 ${
                  isRecording
                    ? 'bg-error animate-pulse ring-8 ring-error/20'
                    : 'bg-primary hover:bg-primary-dark shadow-primary/30 ring-8 ring-primary/10'
                }`}
              >
                <span className="material-symbols-outlined text-[56px]">
                  {isRecording ? 'graphic_eq' : 'mic'}
                </span>
              </button>

              <span className="font-noto text-lg font-bold text-on-surface mt-4 block">
                {isRecording ? t('listeningState') : t('tapToSpeak')}
              </span>
              <span className="text-xs text-on-surface-variant mt-1">
                {isRecording ? t('tapToStop') : 'Speak naturally in your mother tongue'}
              </span>
            </div>

            {/* Live Transcript Box */}
            <div className="mt-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
                Live Speech Transcription
              </span>
              <p className="text-base sm:text-lg font-medium text-on-surface italic">
                "{voiceTranscript}"
              </p>
            </div>

            {/* 1-Click Sample Complaints */}
            <div className="mt-6 pt-5 border-t border-outline-variant/30">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-3">
                {t('sampleComplaintsLabel')}
              </span>
              <div className="flex flex-wrap gap-2">
                {VOICE_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyVoicePreset(p)}
                    className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-emerald-50 hover:text-primary hover:border-primary/30 border border-outline-variant/30 text-xs sm:text-sm font-semibold text-on-surface transition-all active:scale-95 cursor-pointer"
                  >
                    💬 {p.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: AI Clinical Triage & Department Result */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 rounded-3xl p-6 sm:p-8 border-2 border-primary/30 shadow-xl shadow-primary/10">
            <div className="flex items-center justify-between pb-4 border-b border-primary/20">
              <span className="text-xs font-extrabold uppercase tracking-wider bg-primary text-white px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                {t('aiAnalysisTitle')}
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                severity === 'emergency' ? 'bg-error text-white animate-bounce' : 'bg-primary-light text-primary'
              }`}>
                {severity} Priority
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <span className="text-xs font-bold text-on-surface-variant uppercase block">Chief Complaint</span>
                <p className="text-xl font-extrabold text-on-surface mt-0.5">{chiefComplaint}</p>
              </div>

              <div>
                <span className="text-xs font-bold text-on-surface-variant uppercase block">Duration</span>
                <p className="text-base font-bold text-primary mt-0.5">{duration}</p>
              </div>

              {/* Assigned OPD Room & Doctor */}
              <div className="p-4 rounded-2xl bg-white border border-primary/30 shadow-sm mt-4">
                <span className="text-xs font-bold text-on-surface-variant uppercase block">
                  {t('assignedDeptLabel')}
                </span>
                <h4 className="font-noto text-xl font-black text-primary mt-0.5">
                  {t(selectedDept.nameKey, { defaultValue: selectedDept.nameFallback })}
                </h4>
                <p className="text-sm font-semibold text-on-surface-variant mt-1">
                  {selectedDept.doctorName}
                </p>

                <div className="mt-3 pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs font-bold">
                  <span className="bg-surface-container px-3 py-1 rounded-lg text-on-surface">
                    {selectedDept.room}
                  </span>
                  <span className="text-primary">
                    {selectedDept.queueCount} {t('patientsLabel')} • ~{selectedDept.estWaitMin} {t('minLabel')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ═════════ TOUCH SCREEN VIEW ═════════ */
        <div className="space-y-6 mb-8">
          {/* Quick Symptoms Chips */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-outline-variant/30 shadow-sm">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-3">
              {t('symptomsQuickTitle')}
            </span>
            <div className="flex flex-wrap gap-2.5">
              {COMMON_SYMPTOMS.map((sym) => {
                const isChecked = selectedSymptoms.includes(sym.id);
                return (
                  <button
                    key={sym.id}
                    type="button"
                    onClick={() => handleSymptomToggle(sym.id, sym.deptId)}
                    className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center gap-2 active:scale-95 ${
                      isChecked
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    {isChecked && <span className="material-symbols-outlined text-[16px]">check</span>}
                    <span>{sym.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Department Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {OPD_DEPARTMENTS.map((dept) => {
              const isSelected = selectedDept.id === dept.id;
              return (
                <div
                  key={dept.id}
                  id={`dept-${dept.id}`}
                  onClick={() => {
                    setSelectedDept(dept);
                    setChiefComplaint(t(dept.nameKey, { defaultValue: dept.nameFallback }));
                  }}
                  className={`p-6 rounded-3xl flex flex-col justify-between min-h-[200px] cursor-pointer transition-all duration-200 active:scale-[0.98] ${
                    isSelected
                      ? 'bg-emerald-50 border-3 border-primary shadow-xl shadow-primary/10 ring-4 ring-primary-fixed'
                      : 'bg-white shadow-md hover:shadow-lg border border-outline-variant/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-13 h-13 rounded-2xl flex items-center justify-center ${
                      isSelected ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-surface-container text-primary'
                    }`}>
                      <span className="material-symbols-outlined text-[30px]">local_hospital</span>
                    </div>
                    {isSelected && (
                      <span className="text-xs font-bold uppercase bg-primary text-white px-3 py-1 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        चयनित
                      </span>
                    )}
                  </div>

                  <div className="mt-4">
                    <h3 className="font-noto text-xl font-extrabold text-on-surface leading-tight">
                      {t(dept.nameKey, { defaultValue: dept.nameFallback })}
                    </h3>
                    <p className="text-xs text-on-surface-variant font-medium mt-1">
                      {t(dept.subKey, { defaultValue: dept.subFallback })}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs font-bold">
                    <span className="text-primary">{dept.room}</span>
                    <span className="text-on-surface-variant">{dept.queueCount} in queue</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── BOTTOM ACTIONS ── */}
      <div className="w-full pt-4 pb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="h-16 sm:h-20 px-6 sm:px-8 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-base sm:text-lg flex items-center justify-center gap-3 border border-outline-variant/30 active:scale-[0.99] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[28px]">arrow_back</span>
          <span>{t('backButton')}</span>
        </button>

        <button
          type="button"
          onClick={onStaffHelp}
          className="h-16 sm:h-20 px-6 sm:px-8 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-base sm:text-lg flex items-center justify-center gap-3 border border-outline-variant/30 active:scale-[0.99] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[30px]">support_agent</span>
          <div className="flex flex-col text-left leading-tight">
            <span>{t('staffHelp')}</span>
            <span className="text-xs font-bold uppercase opacity-80">{t('staffHelpSub')}</span>
          </div>
        </button>

        <button
          type="button"
          id="confirm-triage-btn"
          onClick={handleConfirm}
          aria-label="Confirm and Issue Token"
          className="flex-1 h-16 sm:h-20 px-8 rounded-2xl bg-primary hover:bg-primary-dark text-white font-noto text-2xl sm:text-3xl font-extrabold flex items-center justify-center gap-4 shadow-xl shadow-primary/30 active:scale-[0.99] transition-all cursor-pointer"
        >
          <span>{t('confirmAndIssueToken')}</span>
          <span className="material-symbols-outlined text-[36px] sm:text-[40px]">confirmation_number</span>
        </button>
      </div>

      {/* ── FLOATING AUDIO TOAST ── */}
      {audioToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#131B2E] text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 animate-bounce border border-emerald-500/40">
          <span className="material-symbols-outlined text-emerald-400 text-[26px]">record_voice_over</span>
          <span className="font-semibold text-sm sm:text-base">{audioToast}</span>
        </div>
      )}
    </div>
  );
};
