import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Language, InteractionMode, KioskStep } from './types';
import { KioskHeader } from './components/kiosk/KioskHeader';
import { StepProgress } from './components/kiosk/StepProgress';
import { LanguageAndModeScreen } from './screens/kiosk/LanguageAndModeScreen';
import { voiceService } from './services/voice';
import i18n, { langToLocale } from './i18n.config';

export function App() {
  const [currentStep, setCurrentStep] = useState<KioskStep>(1);
  const [language, setLanguage] = useState<Language>('hindi');
  const [mode, setMode] = useState<InteractionMode>('voice');
  const { t } = useTranslation('common');

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    // Tell i18next to switch — every useTranslation() hook updates automatically
    i18n.changeLanguage(langToLocale[lang]);
  };

  const handleProceedFromLanguageAndMode = () => {
    voiceService.speak(t('proceedPrompt'), language);
    setCurrentStep(3);
  };

  const handleSos = () => {
    alert(t('sosButton'));
  };

  const handleStaffHelp = () => {
    alert(t('staffHelp'));
  };

  return (
    <div className="min-h-screen bg-[#FAF8FF] flex flex-col justify-between font-sans text-on-surface">
      {/* KIOSK HEADER */}
      <KioskHeader onSosClick={handleSos} onStaffHelp={handleStaffHelp} />

      {/* 5-STEP WORKFLOW NAVIGATOR */}
      <StepProgress currentStep={currentStep} onStepClick={(step) => setCurrentStep(step)} />

      {/* MAIN SCREEN AREA */}
      <main className="flex-1 flex flex-col justify-start">
        {currentStep === 1 || currentStep === 2 ? (
          <LanguageAndModeScreen
            selectedLanguage={language}
            onLanguageChange={handleLanguageChange}
            selectedMode={mode}
            onModeChange={setMode}
            onProceed={handleProceedFromLanguageAndMode}
            onStaffHelp={handleStaffHelp}
          />
        ) : (
          <div className="max-w-4xl mx-auto my-12 p-8 bg-white rounded-3xl shadow-lg border border-outline-variant/30 text-center">
            <span className="material-symbols-outlined text-[60px] text-primary mb-3">lock_clock</span>
            <h2 className="font-noto text-3xl font-extrabold text-on-surface mb-2">
              {t('proceed')} — Step {currentStep}
            </h2>
            <p className="text-on-surface-variant text-lg mb-6">
              Step {currentStep} will be built in the next review phase!
            </p>
            <button
              onClick={() => setCurrentStep(1)}
              className="h-14 px-8 rounded-2xl bg-primary text-white font-bold text-base active:scale-95 transition-all cursor-pointer shadow-md"
            >
              ← {t('selectLanguageHeading')}
            </button>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-white border-t border-surface-container-high py-3 px-4 sm:px-8 text-center text-xs text-on-surface-variant flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-primary font-semibold">
          <span className="material-symbols-outlined text-[18px]">verified_user</span>
          <span>SwasthyaLok Clinical Context Intelligence • Smart India Hackathon 2026</span>
        </div>
        <div className="text-on-surface-variant/80 font-medium">
          ABHA / ABDM Compatible • AI4Bharat Indic Voice Layer • Team Synaptix
        </div>
      </footer>
    </div>
  );
}

export default App;
