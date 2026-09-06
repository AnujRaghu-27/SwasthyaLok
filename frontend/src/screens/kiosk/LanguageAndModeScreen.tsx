import React, { useState } from 'react';
import type { Language, InteractionMode } from '../../types';
import { voiceService } from '../../services/voice';
import { LanguageModal } from '../../components/kiosk/LanguageModal';

interface LanguageAndModeScreenProps {
  selectedLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  selectedMode: InteractionMode;
  onModeChange: (mode: InteractionMode) => void;
  onProceed: () => void;
  onStaffHelp?: () => void;
}

export const LanguageAndModeScreen: React.FC<LanguageAndModeScreenProps> = ({
  selectedLanguage,
  onLanguageChange,
  selectedMode,
  onModeChange,
  onProceed,
  onStaffHelp,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [audioToast, setAudioToast] = useState<string | null>(null);

  const showAudioToast = (msg: string) => {
    setAudioToast(msg);
    setTimeout(() => setAudioToast(null), 3000);
  };

  const handleLanguageSelect = (lang: Language, voicePrompt: string) => {
    onLanguageChange(lang);
    showAudioToast(`भाषा चुनी गई: ${lang.toUpperCase()}`);
    voiceService.speak(voicePrompt, lang);
  };

  const handleVoiceDemo = (e: React.MouseEvent) => {
    e.stopPropagation();
    showAudioToast('आवाज़ डेमो: कृपया अपनी समस्या बोलकर बताएं');
    voiceService.speak('नमस्ते, आप अपनी बीमारी या समस्या बोलकर बता सकते हैं', selectedLanguage);
  };

  const handleTouchDemo = (e: React.MouseEvent) => {
    e.stopPropagation();
    showAudioToast('टच डेमो: बड़े बटनों को दबाकर आगे बढ़ें');
    voiceService.speak('आप स्क्रीन पर दिए गए बड़े बटनों को छूकर आगे बढ़ सकते हैं', selectedLanguage);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6 flex flex-col justify-start">
      {/* SECTION 1: LANGUAGE SELECTION */}
      <section aria-labelledby="langHeading" className="w-full mb-8">
        <div className="flex items-center gap-3.5 mb-5">
          <span className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center font-noto text-xl font-bold shadow-md shadow-primary/20">
            1
          </span>
          <div>
            <h2 id="langHeading" className="font-noto text-2xl sm:text-3xl font-extrabold text-on-surface leading-tight">
              भाषा चुनें / <span className="text-on-surface-variant font-bold text-xl sm:text-2xl">Select Language</span>
            </h2>
          </div>
        </div>

        {/* 4 Language Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Hindi */}
          <div
            id="tile-hindi"
            onClick={() => handleLanguageSelect('hindi', 'नमस्ते, आपने हिंदी भाषा चुनी है')}
            className={`relative rounded-3xl p-6 flex flex-col justify-between cursor-pointer min-h-[160px] transition-all duration-200 active:scale-[0.98] ${
              selectedLanguage === 'hindi'
                ? 'bg-primary text-white shadow-xl shadow-primary/20 ring-4 ring-primary-fixed'
                : 'bg-white text-on-surface shadow-md hover:shadow-lg hover:border-primary/30 border border-outline-variant/30'
            }`}
          >
            <div className="flex items-center justify-between">
              {selectedLanguage === 'hindi' ? (
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 text-white px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span> चयनित
                </span>
              ) : (
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Option 1
                </span>
              )}
              <button
                type="button"
                aria-label="Listen Hindi"
                onClick={(e) => {
                  e.stopPropagation();
                  voiceService.speak('नमस्ते, हिंदी भाषा', 'hindi');
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform ${
                  selectedLanguage === 'hindi' ? 'bg-white text-primary' : 'bg-surface-container text-secondary'
                }`}
              >
                <span className="material-symbols-outlined text-[26px]">volume_up</span>
              </button>
            </div>
            <div className="mt-4">
              <span className="font-noto text-3xl sm:text-4xl font-extrabold block leading-none">हिंदी</span>
              <span className={`text-sm sm:text-base font-medium block mt-1 ${selectedLanguage === 'hindi' ? 'text-white/80' : 'text-on-surface-variant'}`}>
                Hindi
              </span>
            </div>
          </div>

          {/* English */}
          <div
            id="tile-english"
            onClick={() => handleLanguageSelect('english', 'Hello, you have selected English')}
            className={`relative rounded-3xl p-6 flex flex-col justify-between cursor-pointer min-h-[160px] transition-all duration-200 active:scale-[0.98] ${
              selectedLanguage === 'english'
                ? 'bg-primary text-white shadow-xl shadow-primary/20 ring-4 ring-primary-fixed'
                : 'bg-white text-on-surface shadow-md hover:shadow-lg hover:border-primary/30 border border-outline-variant/30'
            }`}
          >
            <div className="flex items-center justify-between">
              {selectedLanguage === 'english' ? (
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 text-white px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span> Selected
                </span>
              ) : (
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Option 2
                </span>
              )}
              <button
                type="button"
                aria-label="Listen English"
                onClick={(e) => {
                  e.stopPropagation();
                  voiceService.speak('Hello, English language', 'english');
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform ${
                  selectedLanguage === 'english' ? 'bg-white text-primary' : 'bg-surface-container text-secondary'
                }`}
              >
                <span className="material-symbols-outlined text-[26px]">volume_up</span>
              </button>
            </div>
            <div className="mt-4">
              <span className="font-noto text-3xl sm:text-4xl font-extrabold block leading-none">English</span>
              <span className={`text-sm sm:text-base font-medium block mt-1 ${selectedLanguage === 'english' ? 'text-white/80' : 'text-on-surface-variant'}`}>
                अंग्रेजी
              </span>
            </div>
          </div>

          {/* Marathi */}
          <div
            id="tile-marathi"
            onClick={() => handleLanguageSelect('marathi', 'नमस्कार, आपण मराठी भाषा निवडली आहे')}
            className={`relative rounded-3xl p-6 flex flex-col justify-between cursor-pointer min-h-[160px] transition-all duration-200 active:scale-[0.98] ${
              selectedLanguage === 'marathi'
                ? 'bg-primary text-white shadow-xl shadow-primary/20 ring-4 ring-primary-fixed'
                : 'bg-white text-on-surface shadow-md hover:shadow-lg hover:border-primary/30 border border-outline-variant/30'
            }`}
          >
            <div className="flex items-center justify-between">
              {selectedLanguage === 'marathi' ? (
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 text-white px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span> निवडलेले
                </span>
              ) : (
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Option 3
                </span>
              )}
              <button
                type="button"
                aria-label="Listen Marathi"
                onClick={(e) => {
                  e.stopPropagation();
                  voiceService.speak('नमस्कार, मराठी भाषा', 'marathi');
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform ${
                  selectedLanguage === 'marathi' ? 'bg-white text-primary' : 'bg-surface-container text-secondary'
                }`}
              >
                <span className="material-symbols-outlined text-[26px]">volume_up</span>
              </button>
            </div>
            <div className="mt-4">
              <span className="font-noto text-3xl sm:text-4xl font-extrabold block leading-none">मराठी</span>
              <span className={`text-sm sm:text-base font-medium block mt-1 ${selectedLanguage === 'marathi' ? 'text-white/80' : 'text-on-surface-variant'}`}>
                Marathi
              </span>
            </div>
          </div>

          {/* More Languages */}
          <div
            id="tile-more"
            onClick={() => setIsModalOpen(true)}
            className="relative rounded-3xl bg-white text-on-surface shadow-md hover:shadow-lg border-2 border-dashed border-secondary/50 p-6 flex flex-col justify-between cursor-pointer transition-all duration-200 active:scale-[0.98] min-h-[160px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                6 More Languages
              </span>
              <div className="w-12 h-12 rounded-full bg-secondary-light text-secondary flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[28px]">add</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="font-noto text-2xl sm:text-3xl font-extrabold text-primary block leading-tight">
                अन्य भाषाएं
              </span>
              <span className="text-sm sm:text-base font-medium block mt-1 text-on-surface-variant">
                More Languages (Tamil, Telugu, Bengali...)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: INTERACTION MODE */}
      <section aria-labelledby="modeHeading" className="w-full mb-8">
        <div className="flex items-center gap-3.5 mb-5">
          <span className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center font-noto text-xl font-bold shadow-md shadow-primary/20">
            2
          </span>
          <div>
            <h2 id="modeHeading" className="font-noto text-2xl sm:text-3xl font-extrabold text-on-surface leading-tight">
              तरीका चुनें / <span className="text-on-surface-variant font-bold text-xl sm:text-2xl">Choose Mode</span>
            </h2>
          </div>
        </div>

        {/* 2 Mode Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Voice Mode */}
          <div
            id="card-voice"
            onClick={() => onModeChange('voice')}
            className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between cursor-pointer min-h-[240px] transition-all duration-200 active:scale-[0.99] ${
              selectedMode === 'voice'
                ? 'bg-emerald-50 text-on-surface border-3 border-primary shadow-xl shadow-primary/10 ring-4 ring-primary-fixed'
                : 'bg-white text-on-surface shadow-md hover:shadow-lg border border-outline-variant/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-20 h-20 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30">
                <span className="material-symbols-outlined text-[46px]">mic</span>
              </div>
              <span className="text-xs sm:text-sm font-bold bg-primary text-white px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                <span className="material-symbols-outlined text-[18px]">recommend</span> सुझाया गया / Easy
              </span>
            </div>
            
            <div className="mt-5">
              <h3 className="font-noto text-3xl sm:text-4xl font-extrabold text-on-surface leading-tight">
                बोलकर बताएं
              </h3>
              <span className="text-lg sm:text-xl font-bold text-primary block mt-1">
                Voice / Speak Naturally
              </span>
            </div>

            <div className="mt-5 pt-4 flex items-center justify-between border-t border-outline-variant/30">
              <span className="text-sm sm:text-base font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-[22px] animate-pulse text-emerald-600">mic</span> 
                माइक तैयार है / Microphone Ready
              </span>
              <button
                type="button"
                onClick={handleVoiceDemo}
                className="h-11 px-5 rounded-xl bg-white hover:bg-emerald-50 text-primary border border-primary/30 font-bold text-sm shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                डेमो सुनें / Demo
              </button>
            </div>
          </div>

          {/* Touch Mode */}
          <div
            id="card-touch"
            onClick={() => onModeChange('touch')}
            className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between cursor-pointer min-h-[240px] transition-all duration-200 active:scale-[0.99] ${
              selectedMode === 'touch'
                ? 'bg-emerald-50 text-on-surface border-3 border-primary shadow-xl shadow-primary/10 ring-4 ring-primary-fixed'
                : 'bg-white text-on-surface shadow-md hover:shadow-lg border border-outline-variant/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-20 h-20 rounded-2xl bg-surface-container-highest text-on-surface-variant flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-[46px]">touch_app</span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-on-surface-variant bg-surface-container px-4 py-1.5 rounded-full">
                वैकल्पिक / Optional
              </span>
            </div>

            <div className="mt-5">
              <h3 className="font-noto text-3xl sm:text-4xl font-extrabold text-on-surface leading-tight">
                टच स्क्रीन
              </h3>
              <span className="text-lg sm:text-xl font-bold text-on-surface-variant block mt-1">
                Touch & Tap Screen
              </span>
            </div>

            <div className="mt-5 pt-4 flex items-center justify-between border-t border-outline-variant/30">
              <span className="text-sm sm:text-base font-bold text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-[22px]">ads_click</span> 
                बड़े बटन / Large Accessible Buttons
              </span>
              <button
                type="button"
                onClick={handleTouchDemo}
                className="h-11 px-5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-sm shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                डेमो सुनें / Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM ACTIONS */}
      <div className="w-full pt-4 pb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={onStaffHelp}
          aria-label="Call Staff Help"
          className="h-16 px-6 sm:px-8 rounded-2xl bg-error-container hover:bg-red-100 text-error font-extrabold text-lg flex items-center justify-center gap-3 shadow-md active:scale-95 transition-all cursor-pointer border border-error/20"
        >
          <span className="material-symbols-outlined text-[32px]">support_agent</span>
          <div className="flex flex-col text-left leading-tight">
            <span>सहायक बुलाएं</span>
            <span className="text-xs font-bold uppercase opacity-80">Staff Help</span>
          </div>
        </button>

        <button
          id="btnProceed"
          type="button"
          onClick={onProceed}
          aria-label="Proceed to Next Step"
          className="flex-1 h-16 sm:h-20 px-8 rounded-2xl bg-primary hover:bg-primary-dark text-white font-noto text-2xl sm:text-3xl font-extrabold flex items-center justify-center gap-4 shadow-xl shadow-primary/30 active:scale-[0.99] transition-all cursor-pointer"
        >
          <span>आगे बढ़ें / Next</span>
          <span className="material-symbols-outlined text-[36px] sm:text-[40px]">arrow_forward</span>
        </button>
      </div>

      {/* REGIONAL LANGUAGES MODAL */}
      <LanguageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={(lang) => {
          onLanguageChange(lang);
          showAudioToast(`क्षेत्रीय भाषा चुनी गई: ${lang.toUpperCase()}`);
        }}
      />

      {/* FLOATING AUDIO TOAST */}
      {audioToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#131B2E] text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 animate-bounce border border-emerald-500/40">
          <span className="material-symbols-outlined text-emerald-400 text-[26px]">record_voice_over</span>
          <span className="text-sm sm:text-base font-bold">{audioToast}</span>
        </div>
      )}
    </div>
  );
};
