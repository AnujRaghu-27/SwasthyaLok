import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Language, InteractionMode, PatientIdentity } from '../../types';
import { voiceService } from '../../services/voice';

interface ModeSelectionScreenProps {
  selectedLanguage: Language;
  selectedMode: InteractionMode;
  onModeChange: (mode: InteractionMode) => void;
  patientIdentity: PatientIdentity;
  onProceed: () => void;
  onBack: () => void;
  onStaffHelp?: () => void;
}

export const ModeSelectionScreen: React.FC<ModeSelectionScreenProps> = ({
  selectedLanguage,
  selectedMode,
  onModeChange,
  patientIdentity,
  onProceed,
  onBack,
  onStaffHelp,
}) => {
  const { t } = useTranslation('common');
  const [audioToast, setAudioToast] = useState<string | null>(null);

  const showAudioToast = (msg: string) => {
    setAudioToast(msg);
    setTimeout(() => setAudioToast(null), 3000);
  };

  const handleVoiceDemo = (e: React.MouseEvent) => {
    e.stopPropagation();
    showAudioToast(t('toastVoiceDemo'));
    voiceService.speak(t('voiceDemoPrompt'), selectedLanguage);
  };

  const handleTouchDemo = (e: React.MouseEvent) => {
    e.stopPropagation();
    showAudioToast(t('toastTouchDemo'));
    voiceService.speak(t('touchDemoPrompt'), selectedLanguage);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col justify-start">
      
      {/* ── PATIENT WELCOME BANNER ── */}
      <div className="bg-emerald-50 border border-primary/20 rounded-3xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-primary/20">
            <span className="material-symbols-outlined text-[32px]">person</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary bg-white px-3 py-0.5 rounded-full border border-primary/20">
                ABDM Verified
              </span>
              <span className="text-xs text-on-surface-variant font-medium">
                {patientIdentity.idNumber || 'Walk-in Patient'}
              </span>
            </div>
            <h2 className="font-noto text-2xl sm:text-3xl font-extrabold text-on-surface mt-0.5">
              {patientIdentity.name ? `${patientIdentity.name}` : 'Welcome Patient'}
            </h2>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">OPD Token Step</span>
          <span className="text-sm font-bold text-primary">3 of 5 • Interaction Mode</span>
        </div>
      </div>

      {/* ── SECTION HEADING ── */}
      <div className="mb-6">
        <div className="flex items-center gap-3.5 mb-2">
          <span className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center font-noto text-xl font-bold shadow-md shadow-primary/20">
            3
          </span>
          <h2 className="font-noto text-2xl sm:text-3xl font-extrabold text-on-surface leading-tight">
            {t('modeSelectionHeading')}
          </h2>
        </div>
        <p className="text-base sm:text-lg text-on-surface-variant pl-14">
          Choose whether to speak your symptoms directly to the AI doctor assistant, or select departments via touch screen.
        </p>
      </div>

      {/* ── MODE SELECTION CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
        {/* VOICE MODE CARD */}
        <div
          id="mode-voice"
          onClick={() => onModeChange('voice')}
          className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between cursor-pointer min-h-[260px] transition-all duration-200 active:scale-[0.99] ${
            selectedMode === 'voice'
              ? 'bg-emerald-50 border-3 border-primary shadow-xl shadow-primary/10 ring-4 ring-primary-fixed'
              : 'bg-white shadow-md hover:shadow-lg border border-outline-variant/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={`w-18 h-18 rounded-2xl flex items-center justify-center transition-colors ${
              selectedMode === 'voice' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-surface-container text-primary'
            }`}>
              <span className="material-symbols-outlined text-[48px]">mic</span>
            </div>
            <span className="text-xs sm:text-sm font-bold bg-primary text-white px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">recommend</span>
              {t('voiceCardBadge')}
            </span>
          </div>

          <div className="mt-6">
            <h3 className="font-noto text-3xl sm:text-4xl font-extrabold text-on-surface leading-tight">
              {t('voiceCardTitle')}
            </h3>
            <span className="text-lg sm:text-xl font-bold text-primary block mt-1">
              {t('voiceCardSubtitle')}
            </span>
          </div>

          <div className="mt-6 pt-4 flex items-center justify-between border-t border-outline-variant/30">
            <span className="text-sm sm:text-base font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px] animate-pulse text-emerald-600">mic</span>
              {t('voiceCardMicReady')}
            </span>
            <button
              type="button"
              onClick={handleVoiceDemo}
              className="h-11 px-5 rounded-xl bg-white hover:bg-emerald-50 text-primary border border-primary/30 font-bold text-sm shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              {t('voiceCardDemo')}
            </button>
          </div>
        </div>

        {/* TOUCH SCREEN CARD */}
        <div
          id="mode-touch"
          onClick={() => onModeChange('touch')}
          className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between cursor-pointer min-h-[260px] transition-all duration-200 active:scale-[0.99] ${
            selectedMode === 'touch'
              ? 'bg-emerald-50 border-3 border-primary shadow-xl shadow-primary/10 ring-4 ring-primary-fixed'
              : 'bg-white shadow-md hover:shadow-lg border border-outline-variant/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={`w-18 h-18 rounded-2xl flex items-center justify-center transition-colors ${
              selectedMode === 'touch' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-surface-container text-on-surface'
            }`}>
              <span className="material-symbols-outlined text-[48px]">touch_app</span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-on-surface-variant bg-surface-container px-4 py-1.5 rounded-full">
              {t('touchCardBadge')}
            </span>
          </div>

          <div className="mt-6">
            <h3 className="font-noto text-3xl sm:text-4xl font-extrabold text-on-surface leading-tight">
              {t('touchCardTitle')}
            </h3>
            <span className="text-lg sm:text-xl font-bold text-on-surface-variant block mt-1">
              {t('touchCardSubtitle')}
            </span>
          </div>

          <div className="mt-6 pt-4 flex items-center justify-between border-t border-outline-variant/30">
            <span className="text-sm sm:text-base font-bold text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px]">ads_click</span>
              {t('touchCardLargeButtons')}
            </span>
            <button
              type="button"
              onClick={handleTouchDemo}
              className="h-11 px-5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-sm shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              {t('touchCardDemo')}
            </button>
          </div>
        </div>
      </div>

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
          id="proceed-to-step-4"
          onClick={onProceed}
          aria-label="Proceed to Service"
          className="flex-1 h-16 sm:h-20 px-8 rounded-2xl bg-primary hover:bg-primary-dark text-white font-noto text-2xl sm:text-3xl font-extrabold flex items-center justify-center gap-4 shadow-xl shadow-primary/30 active:scale-[0.99] transition-all cursor-pointer"
        >
          <span>{t('proceed')}</span>
          <span className="material-symbols-outlined text-[36px] sm:text-[40px]">arrow_forward</span>
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
