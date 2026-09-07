import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Language, InteractionMode, KioskStep, PatientIdentity, TriageData } from './types';
import { KioskHeader } from './components/kiosk/KioskHeader';
import { StepProgress } from './components/kiosk/StepProgress';
import { LanguageAndIdentityScreen } from './screens/kiosk/LanguageAndIdentityScreen';
import { ModeSelectionScreen } from './screens/kiosk/ModeSelectionScreen';
import { PatientHomeScreen } from './screens/kiosk/PatientHomeScreen';
import { OPD_DEPARTMENTS } from './screens/kiosk/ServiceTriageScreen';
import { TokenSlipScreen } from './screens/kiosk/TokenSlipScreen';
import { voiceService } from './services/voice';
import i18n, { langToLocale } from './i18n.config';

export function App() {
  const [currentStep, setCurrentStep] = useState<KioskStep>(1);
  const [language, setLanguage] = useState<Language>('hindi');
  const [mode, setMode] = useState<InteractionMode>('voice');
  const [patientIdentity, setPatientIdentity] = useState<PatientIdentity>({
    type: 'abha',
    idNumber: '',
    isVerified: false,
    consentGiven: true,
  });
  const [triageData, setTriageData] = useState<TriageData>({
    department: OPD_DEPARTMENTS[0],
    chiefComplaint: 'Fever, Sore Throat & Headache',
    symptoms: ['fever'],
    duration: '3 days',
    severity: 'moderate',
    extractedVia: 'voice',
  });
  const { t } = useTranslation('common');

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    i18n.changeLanguage(langToLocale[lang]);
  };

  const handleProceedFromLanguageAndIdentity = () => {
    voiceService.speak(t('proceedPrompt'), language);
    setCurrentStep(3);
  };

  const handleProceedFromMode = () => {
    setCurrentStep(4);
  };

  const handleProceedFromTriage = (data: TriageData) => {
    setTriageData(data);
    setCurrentStep(5);
    voiceService.speak(t('tokenHeading'), language);
  };

  const handleResetSession = () => {
    setCurrentStep(1);
    setPatientIdentity({
      type: 'abha',
      idNumber: '',
      isVerified: false,
      consentGiven: true,
    });
    setMode('voice');
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
          <LanguageAndIdentityScreen
            selectedLanguage={language}
            onLanguageChange={handleLanguageChange}
            patientIdentity={patientIdentity}
            onIdentityChange={setPatientIdentity}
            onProceed={handleProceedFromLanguageAndIdentity}
            onStaffHelp={handleStaffHelp}
          />
        ) : currentStep === 3 ? (
          <ModeSelectionScreen
            selectedLanguage={language}
            selectedMode={mode}
            onModeChange={setMode}
            patientIdentity={patientIdentity}
            onProceed={handleProceedFromMode}
            onBack={() => setCurrentStep(1)}
            onStaffHelp={handleStaffHelp}
          />
        ) : currentStep === 4 ? (
          <PatientHomeScreen
            selectedLanguage={language}
            selectedMode={mode}
            onModeChange={setMode}
            patientIdentity={patientIdentity}
            onProceedToSlip={handleProceedFromTriage}
            onBack={() => setCurrentStep(3)}
            onStaffHelp={handleStaffHelp}
          />
        ) : (
          <TokenSlipScreen
            selectedLanguage={language}
            patientIdentity={patientIdentity}
            triageData={triageData}
            onResetSession={handleResetSession}
            onStaffHelp={handleStaffHelp}
          />
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
