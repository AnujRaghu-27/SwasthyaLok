import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Language, PatientIdentity, TriageData } from '../../types';
import { voiceService } from '../../services/voice';

interface TokenSlipScreenProps {
  selectedLanguage: Language;
  patientIdentity: PatientIdentity;
  triageData: TriageData;
  onResetSession: () => void;
  onStaffHelp?: () => void;
}

export const TokenSlipScreen: React.FC<TokenSlipScreenProps> = ({
  selectedLanguage,
  patientIdentity,
  triageData,
  onResetSession,
  onStaffHelp,
}) => {
  const { t } = useTranslation('common');
  const [isPrinted, setIsPrinted] = useState(false);
  const [isSmsSent, setIsSmsSent] = useState(false);
  const [audioToast, setAudioToast] = useState<string | null>(null);

  // Generate a realistic token number, e.g. MED-042
  const deptPrefix = triageData.department.id.slice(0, 3).toUpperCase();
  const tokenNumber = `${deptPrefix}-${100 + triageData.department.queueCount + 1}`;
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const currentTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const showAudioToast = (msg: string) => {
    setAudioToast(msg);
    setTimeout(() => setAudioToast(null), 3000);
  };

  const handlePrint = () => {
    setIsPrinted(true);
    showAudioToast('Printing OPD Token Slip...');
    voiceService.speak(`Token ${tokenNumber} printed. Please proceed to ${triageData.department.room}.`, selectedLanguage);
  };

  const handleSendSms = () => {
    setIsSmsSent(true);
    showAudioToast(`SMS Sent to ${patientIdentity.mobile || 'Registered Mobile'}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col justify-start">
      
      {/* ── TOP HEADER ── */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-primary px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold mb-3">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>Step 5 of 5 • OPD Registration Complete</span>
        </div>
        <h2 className="font-noto text-3xl sm:text-4xl font-extrabold text-on-surface">
          {t('tokenHeading')}
        </h2>
        <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto mt-1">
          {t('tokenSub')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
        
        {/* ── LEFT: DIGITAL THERMAL OPD SLIP CARD ── */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border-2 border-dashed border-primary/40 shadow-2xl relative overflow-hidden">
          {/* Top Notch styling like a paper slip */}
          <div className="flex items-center justify-between border-b-2 border-dashed border-outline-variant/50 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xl shadow-md">
                <span className="material-symbols-outlined text-[28px]">local_hospital</span>
              </div>
              <div>
                <h3 className="font-extrabold text-xl sm:text-2xl text-primary font-noto">
                  SwasthyaLok Hospital OPD
                </h3>
                <span className="text-xs font-semibold text-on-surface-variant">
                  National Health Mission • ABDM Connected
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-on-surface-variant block">{currentDate}</span>
              <span className="text-xs font-mono font-bold text-primary">{currentTime}</span>
            </div>
          </div>

          {/* TOKEN HERO HIGHLIGHT */}
          <div className="my-6 p-6 rounded-2xl bg-emerald-50 border border-primary/30 text-center">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-primary block">
              Your OPD Queue Token
            </span>
            <div className="font-mono text-5xl sm:text-6xl font-black text-primary tracking-tight my-2">
              {tokenNumber}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-bold mt-2">
              <span className="bg-white px-3 py-1 rounded-full text-on-surface border border-primary/20">
                {triageData.department.room}
              </span>
              <span className="bg-white px-3 py-1 rounded-full text-primary border border-primary/20">
                Est. Wait: ~{triageData.department.estWaitMin} mins
              </span>
              <span className="bg-white px-3 py-1 rounded-full text-on-surface-variant border border-primary/20">
                {triageData.department.queueCount} Ahead
              </span>
            </div>
          </div>

          {/* DETAILS GRID */}
          <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-dashed border-outline-variant/40 text-sm">
            <div>
              <span className="text-xs font-bold text-on-surface-variant uppercase block">Patient Name</span>
              <span className="font-bold text-on-surface text-base">{patientIdentity.name || 'Walk-in Patient'}</span>
            </div>
            <div>
              <span className="text-xs font-bold text-on-surface-variant uppercase block">Age / Gender</span>
              <span className="font-bold text-on-surface text-base">{patientIdentity.age || 48} Yrs / {patientIdentity.gender || 'Male'}</span>
            </div>
            <div>
              <span className="text-xs font-bold text-on-surface-variant uppercase block">ABHA Number</span>
              <span className="font-mono font-bold text-primary">{patientIdentity.idNumber || '91-8721-3940-1029'}</span>
            </div>
            <div>
              <span className="text-xs font-bold text-on-surface-variant uppercase block">Department</span>
              <span className="font-bold text-on-surface text-base">
                {t(triageData.department.nameKey, { defaultValue: triageData.department.nameFallback })}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-xs font-bold text-on-surface-variant uppercase block">Doctor Assigned</span>
              <span className="font-bold text-primary text-base">{triageData.department.doctorName}</span>
            </div>
            <div className="col-span-2">
              <span className="text-xs font-bold text-on-surface-variant uppercase block">Chief Complaint (Triage)</span>
              <span className="font-medium text-on-surface text-sm italic">"{triageData.chiefComplaint}"</span>
            </div>
          </div>

          {/* Barcode & Footer */}
          <div className="mt-5 pt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-surface-container rounded-xl flex items-center justify-center p-1 border">
                <span className="material-symbols-outlined text-[48px] text-on-surface">qr_code_2</span>
              </div>
              <span className="text-xs text-on-surface-variant max-w-[200px] leading-tight">
                {t('liveTracking')}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-primary font-bold">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>Valid for OPD Consultation Today</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: KIOSK ACTION CONTROLS ── */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Print Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="w-full h-20 rounded-3xl bg-primary hover:bg-primary-dark text-white font-bold text-xl flex items-center justify-center gap-3 shadow-xl shadow-primary/30 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[32px]">
              {isPrinted ? 'check_circle' : 'print'}
            </span>
            <span>{isPrinted ? 'Printed / पर्ची निकल गई' : t('printSlip')}</span>
          </button>

          {/* SMS Send Button */}
          <button
            type="button"
            onClick={handleSendSms}
            className="w-full h-16 rounded-3xl bg-white hover:bg-emerald-50 text-primary border-2 border-primary/30 font-bold text-lg flex items-center justify-center gap-3 shadow-md active:scale-[0.98] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[26px]">
              {isSmsSent ? 'done_all' : 'sms'}
            </span>
            <span>{isSmsSent ? 'SMS Sent to Phone' : t('sendSms')}</span>
          </button>

          {/* Staff Help */}
          <button
            type="button"
            onClick={onStaffHelp}
            className="w-full h-14 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-base flex items-center justify-center gap-2.5 border border-outline-variant/30 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">support_agent</span>
            <span>{t('staffHelp')}</span>
          </button>

          {/* New Patient Finish Button */}
          <div className="pt-6 border-t border-outline-variant/30">
            <button
              type="button"
              onClick={onResetSession}
              className="w-full h-18 rounded-3xl bg-[#131B2E] hover:bg-black text-white font-bold text-lg flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[28px]">restart_alt</span>
              <span>{t('finishSession')}</span>
            </button>
          </div>
        </div>
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
