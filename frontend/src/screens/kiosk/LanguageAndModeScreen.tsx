import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Language, InteractionMode } from '../../types';
import { voiceService } from '../../services/voice';
import { LanguageModal } from '../../components/kiosk/LanguageModal';
import { getVoicePrompt } from '../../i18n.config';

interface LanguageAndModeScreenProps {
  selectedLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  selectedMode: InteractionMode;
  onModeChange: (mode: InteractionMode) => void;
  onProceed: () => void;
  onStaffHelp?: () => void;
}

// Tile definitions — native script names are fixed (always their own script)
const LANG_TILES: { id: Language; native: string; nameEn: string; optionNum: number }[] = [
  { id: 'hindi',   native: 'हिंदी',   nameEn: 'Hindi',   optionNum: 1 },
  { id: 'english', native: 'English', nameEn: 'English', optionNum: 2 },
  { id: 'marathi', native: 'मराठी',   nameEn: 'Marathi', optionNum: 3 },
];

export const LanguageAndModeScreen: React.FC<LanguageAndModeScreenProps> = ({
  selectedLanguage,
  onLanguageChange,
  selectedMode,
  onModeChange,
  onProceed,
  onStaffHelp,
}) => {
  const { t } = useTranslation('common');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [audioToast, setAudioToast] = useState<string | null>(null);

  const showAudioToast = (msg: string) => {
    setAudioToast(msg);
    setTimeout(() => setAudioToast(null), 3000);
  };

  // Language tile selected — speak greeting in target language, switch UI
  const handleLanguageSelect = (lang: Language) => {
    onLanguageChange(lang); // triggers i18n.changeLanguage() in App
    const prompt = getVoicePrompt(lang, 'voiceSelectPrompt');
    const toastLabel = getVoicePrompt(lang, 'langSelected');
    showAudioToast(`${toastLabel}: ${lang.toUpperCase()}`);
    voiceService.speak(prompt, lang);
  };

  // Volume preview button — speaks that language's greeting without switching UI
  const handlePreviewLanguage = (e: React.MouseEvent, lang: Language) => {
    e.stopPropagation();
    voiceService.speak(getVoicePrompt(lang, 'voiceSelectPrompt'), lang);
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6 flex flex-col justify-start">

      {/* ── SECTION 1: LANGUAGE SELECTION ── */}
      <section aria-labelledby="langHeading" className="w-full mb-8">
        <div className="flex items-center gap-3.5 mb-5">
          <span className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center font-noto text-xl font-bold shadow-md shadow-primary/20">
            1
          </span>
          <h2 id="langHeading" className="font-noto text-2xl sm:text-3xl font-extrabold text-on-surface leading-tight">
            {t('selectLanguageHeading')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Primary language tiles */}
          {LANG_TILES.map((tile) => {
            const isSelected = selectedLanguage === tile.id;
            return (
              <div
                key={tile.id}
                id={`tile-${tile.id}`}
                onClick={() => handleLanguageSelect(tile.id)}
                className={`relative rounded-3xl p-6 flex flex-col justify-between cursor-pointer min-h-[160px] transition-all duration-200 active:scale-[0.98] ${
                  isSelected
                    ? 'bg-primary text-white shadow-xl shadow-primary/20 ring-4 ring-primary-fixed'
                    : 'bg-white text-on-surface shadow-md hover:shadow-lg hover:border-primary/30 border border-outline-variant/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  {isSelected ? (
                    <span className="text-xs font-bold uppercase tracking-wider bg-white/20 text-white px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      {/* Show "Selected" in the selected language */}
                      {getVoicePrompt(tile.id, 'langSelected')}
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                      {t('langOptionLabel', { n: tile.optionNum })}
                    </span>
                  )}
                  <button
                    type="button"
                    aria-label={`Preview ${tile.nameEn}`}
                    onClick={(e) => handlePreviewLanguage(e, tile.id)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform ${
                      isSelected ? 'bg-white text-primary' : 'bg-surface-container text-secondary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[26px]">volume_up</span>
                  </button>
                </div>
                <div className="mt-4">
                  <span className="font-noto text-3xl sm:text-4xl font-extrabold block leading-none">
                    {tile.native}
                  </span>
                  <span className={`text-sm sm:text-base font-medium block mt-1 ${isSelected ? 'text-white/80' : 'text-on-surface-variant'}`}>
                    {tile.nameEn}
                  </span>
                </div>
              </div>
            );
          })}

          {/* More Languages tile */}
          <div
            id="tile-more"
            onClick={() => setIsModalOpen(true)}
            className="relative rounded-3xl bg-white text-on-surface shadow-md hover:shadow-lg border-2 border-dashed border-secondary/50 p-6 flex flex-col justify-between cursor-pointer transition-all duration-200 active:scale-[0.98] min-h-[160px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                {t('moreLangsLabel')}
              </span>
              <div className="w-12 h-12 rounded-full bg-secondary-light text-secondary flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[28px]">add</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="font-noto text-2xl sm:text-3xl font-extrabold text-primary block leading-tight">
                {t('moreLangsTitle')}
              </span>
              <span className="text-sm sm:text-base font-medium block mt-1 text-on-surface-variant">
                {t('moreLangsDesc')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: INTERACTION MODE ── */}
      <section aria-labelledby="modeHeading" className="w-full mb-8">
        <div className="flex items-center gap-3.5 mb-5">
          <span className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center font-noto text-xl font-bold shadow-md shadow-primary/20">
            2
          </span>
          <h2 id="modeHeading" className="font-noto text-2xl sm:text-3xl font-extrabold text-on-surface leading-tight">
            {t('chooseModeHeading')}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Voice Mode */}
          <div
            id="card-voice"
            onClick={() => onModeChange('voice')}
            className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between cursor-pointer min-h-[240px] transition-all duration-200 active:scale-[0.99] ${
              selectedMode === 'voice'
                ? 'bg-emerald-50 border-3 border-primary shadow-xl shadow-primary/10 ring-4 ring-primary-fixed'
                : 'bg-white shadow-md hover:shadow-lg border border-outline-variant/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-20 h-20 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30">
                <span className="material-symbols-outlined text-[46px]">mic</span>
              </div>
              <span className="text-xs sm:text-sm font-bold bg-primary text-white px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                <span className="material-symbols-outlined text-[18px]">recommend</span>
                {t('voiceCardBadge')}
              </span>
            </div>
            <div className="mt-5">
              <h3 className="font-noto text-3xl sm:text-4xl font-extrabold text-on-surface leading-tight">
                {t('voiceCardTitle')}
              </h3>
              <span className="text-lg sm:text-xl font-bold text-primary block mt-1">
                {t('voiceCardSubtitle')}
              </span>
            </div>
            <div className="mt-5 pt-4 flex items-center justify-between border-t border-outline-variant/30">
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

          {/* Touch Mode */}
          <div
            id="card-touch"
            onClick={() => onModeChange('touch')}
            className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between cursor-pointer min-h-[240px] transition-all duration-200 active:scale-[0.99] ${
              selectedMode === 'touch'
                ? 'bg-emerald-50 border-3 border-primary shadow-xl shadow-primary/10 ring-4 ring-primary-fixed'
                : 'bg-white shadow-md hover:shadow-lg border border-outline-variant/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-20 h-20 rounded-2xl bg-surface-container-highest text-on-surface-variant flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-[46px]">touch_app</span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-on-surface-variant bg-surface-container px-4 py-1.5 rounded-full">
                {t('touchCardBadge')}
              </span>
            </div>
            <div className="mt-5">
              <h3 className="font-noto text-3xl sm:text-4xl font-extrabold text-on-surface leading-tight">
                {t('touchCardTitle')}
              </h3>
              <span className="text-lg sm:text-xl font-bold text-on-surface-variant block mt-1">
                {t('touchCardSubtitle')}
              </span>
            </div>
            <div className="mt-5 pt-4 flex items-center justify-between border-t border-outline-variant/30">
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
      </section>

      {/* ── BOTTOM ACTIONS ── */}
      <div className="w-full pt-4 pb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={onStaffHelp}
          aria-label="Call Staff Help"
          className="h-16 px-6 sm:px-8 rounded-2xl bg-error-container hover:bg-red-100 text-error font-extrabold text-lg flex items-center justify-center gap-3 shadow-md active:scale-95 transition-all cursor-pointer border border-error/20"
        >
          <span className="material-symbols-outlined text-[32px]">support_agent</span>
          <div className="flex flex-col text-left leading-tight">
            <span>{t('staffHelp')}</span>
            <span className="text-xs font-bold uppercase opacity-80">{t('staffHelpSub')}</span>
          </div>
        </button>

        <button
          id="btnProceed"
          type="button"
          onClick={onProceed}
          aria-label="Proceed to Next Step"
          className="flex-1 h-16 sm:h-20 px-8 rounded-2xl bg-primary hover:bg-primary-dark text-white font-noto text-2xl sm:text-3xl font-extrabold flex items-center justify-center gap-4 shadow-xl shadow-primary/30 active:scale-[0.99] transition-all cursor-pointer"
        >
          <span>{t('proceed')}</span>
          <span className="material-symbols-outlined text-[36px] sm:text-[40px]">arrow_forward</span>
        </button>
      </div>

      {/* ── REGIONAL LANGUAGES MODAL ── */}
      <LanguageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={(lang) => {
          onLanguageChange(lang); // triggers i18n.changeLanguage() in App
          showAudioToast(getVoicePrompt(lang, 'toastRegionalSelected'));
        }}
      />

      {/* ── FLOATING AUDIO TOAST ── */}
      {audioToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#131B2E] text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 animate-bounce border border-emerald-500/40">
          <span className="material-symbols-outlined text-emerald-400 text-[26px]">record_voice_over</span>
          <span className="text-sm sm:text-base font-bold">{audioToast}</span>
        </div>
      )}
    </div>
  );
};
