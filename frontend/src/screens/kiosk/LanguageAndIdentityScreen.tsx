import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Language, PatientIdentity } from '../../types';
import { voiceService } from '../../services/voice';
import { LanguageModal } from '../../components/kiosk/LanguageModal';
import { getVoicePrompt } from '../../i18n.config';

interface LanguageAndIdentityScreenProps {
  selectedLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  patientIdentity: PatientIdentity;
  onIdentityChange: (identity: PatientIdentity) => void;
  onProceed: () => void;
  onStaffHelp?: () => void;
}

const LANG_TILES: { id: Language; native: string; nameEn: string; optionNum: number }[] = [
  { id: 'hindi',   native: 'हिंदी',   nameEn: 'Hindi',   optionNum: 1 },
  { id: 'english', native: 'English', nameEn: 'English', optionNum: 2 },
  { id: 'marathi', native: 'मराठी',   nameEn: 'Marathi', optionNum: 3 },
];

export const LanguageAndIdentityScreen: React.FC<LanguageAndIdentityScreenProps> = ({
  selectedLanguage,
  onLanguageChange,
  patientIdentity,
  onIdentityChange,
  onProceed,
  onStaffHelp,
}) => {
  const { t } = useTranslation('common');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [audioToast, setAudioToast] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'abha' | 'aadhaar' | 'qr'>('abha');
  const [inputVal, setInputVal] = useState<string>(patientIdentity.idNumber || '');
  const [mobileVal, setMobileVal] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);

  const showAudioToast = (msg: string) => {
    setAudioToast(msg);
    setTimeout(() => setAudioToast(null), 3000);
  };

  // Language tile selected
  const handleLanguageSelect = (lang: Language) => {
    onLanguageChange(lang);
    const prompt = getVoicePrompt(lang, 'voiceSelectPrompt');
    const toastLabel = getVoicePrompt(lang, 'langSelected');
    showAudioToast(`${toastLabel}: ${lang.toUpperCase()}`);
    voiceService.speak(prompt, lang);
  };

  const handlePreviewLanguage = (e: React.MouseEvent, lang: Language) => {
    e.stopPropagation();
    voiceService.speak(getVoicePrompt(lang, 'voiceSelectPrompt'), lang);
  };

  // Virtual Keypad handling
  const handleKeypadPress = (digit: string) => {
    if (patientIdentity.isVerified) return;
    if (activeTab === 'abha') {
      if (inputVal.replace(/\D/g, '').length < 14) {
        const raw = (inputVal + digit).replace(/\D/g, '');
        // format as 91-XXXX-XXXX-XXXX
        let formatted = raw;
        if (raw.length > 2) formatted = `${raw.slice(0, 2)}-${raw.slice(2)}`;
        if (raw.length > 6) formatted = `${raw.slice(0, 2)}-${raw.slice(2, 6)}-${raw.slice(6)}`;
        if (raw.length > 10) formatted = `${raw.slice(0, 2)}-${raw.slice(2, 6)}-${raw.slice(6, 10)}-${raw.slice(10, 14)}`;
        setInputVal(formatted);
      }
    } else {
      if (inputVal.length < 12) {
        setInputVal(prev => prev + digit);
      }
    }
  };

  const handleBackspace = () => {
    if (patientIdentity.isVerified) return;
    setInputVal(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (patientIdentity.isVerified) return;
    setInputVal('');
  };

  // Verify Action
  const handleVerify = () => {
    if (!inputVal) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const verifiedPatient: PatientIdentity = {
        type: activeTab,
        idNumber: inputVal || '91-8721-3940-1029',
        name: 'Ramesh Kumar',
        age: 48,
        gender: 'Male',
        isVerified: true,
        consentGiven: true,
      };
      onIdentityChange(verifiedPatient);
      showAudioToast(t('patientVerifiedTitle'));
      voiceService.speak(t('welcomePatientVoice'), selectedLanguage);
    }, 600);
  };

  // 1-Click Demo Patient
  const handleAutofillDemo = () => {
    const demoPatient: PatientIdentity = {
      type: 'abha',
      idNumber: '91-8721-3940-1029',
      mobile: '9876543210',
      name: 'Ramesh Kumar',
      age: 48,
      gender: 'Male',
      isVerified: true,
      consentGiven: true,
    };
    setInputVal('91-8721-3940-1029');
    onIdentityChange(demoPatient);
    showAudioToast(t('patientVerifiedTitle'));
    voiceService.speak(t('welcomePatientVoice'), selectedLanguage);
  };

  // Reset identity to re-enter
  const handleResetIdentity = () => {
    onIdentityChange({
      type: 'abha',
      idNumber: '',
      isVerified: false,
      consentGiven: true,
    });
    setInputVal('');
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
          {LANG_TILES.map((tile) => {
            const isSelected = selectedLanguage === tile.id;
            return (
              <div
                key={tile.id}
                id={`tile-${tile.id}`}
                onClick={() => handleLanguageSelect(tile.id)}
                className={`relative rounded-3xl p-6 flex flex-col justify-between cursor-pointer min-h-[150px] transition-all duration-200 active:scale-[0.98] ${
                  isSelected
                    ? 'bg-primary text-white shadow-xl shadow-primary/20 ring-4 ring-primary-fixed'
                    : 'bg-white text-on-surface shadow-md hover:shadow-lg hover:border-primary/30 border border-outline-variant/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  {isSelected ? (
                    <span className="text-xs font-bold uppercase tracking-wider bg-white/20 text-white px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      {t('langSelected')}
                    </span>
                  ) : (
                    <span className="text-xs font-bold uppercase tracking-wider bg-surface-container text-on-surface-variant px-3 py-1 rounded-full">
                      {t('langOptionLabel', { n: tile.optionNum })}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => handlePreviewLanguage(e, tile.id)}
                    aria-label={`Listen greeting in ${tile.nameEn}`}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-white/20 text-white hover:bg-white/30'
                        : 'bg-surface-container hover:bg-primary hover:text-white text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">volume_up</span>
                  </button>
                </div>

                <div className="mt-3">
                  <span className="font-noto text-3xl font-extrabold block leading-tight">
                    {tile.native}
                  </span>
                  <span className={`text-base font-semibold block mt-0.5 ${isSelected ? 'text-white/80' : 'text-on-surface-variant'}`}>
                    {tile.nameEn}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Regional languages modal trigger */}
          <div
            id="more-languages-btn"
            onClick={() => setIsModalOpen(true)}
            className="rounded-3xl p-6 flex flex-col justify-between cursor-pointer bg-white text-on-surface shadow-md hover:shadow-lg border border-dashed border-primary/40 hover:border-primary transition-all active:scale-[0.98] min-h-[150px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider bg-surface-container text-primary px-3 py-1 rounded-full">
                {t('moreLangsLabel')}
              </span>
              <span className="w-10 h-10 rounded-full bg-surface-container text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">translate</span>
              </span>
            </div>

            <div className="mt-3">
              <span className="font-noto text-2xl font-bold block text-primary leading-tight">
                {t('moreLangsTitle')}
              </span>
              <span className="text-sm font-semibold text-on-surface-variant block mt-0.5">
                {t('moreLangsDesc')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: PATIENT IDENTIFICATION & VERIFICATION (Replaces Choose Mode) ── */}
      <section aria-labelledby="identityHeading" className="w-full mb-8">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3.5">
            <span className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center font-noto text-xl font-bold shadow-md shadow-primary/20">
              2
            </span>
            <h2 id="identityHeading" className="font-noto text-2xl sm:text-3xl font-extrabold text-on-surface leading-tight">
              {t('patientIdHeading')}
            </h2>
          </div>

          {/* 1-Tap Quick Demo Patient Button */}
          <button
            type="button"
            onClick={handleAutofillDemo}
            className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 border border-primary/30 text-primary font-bold text-xs sm:text-sm rounded-xl shadow-sm flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            <span>{t('quickDemoButton')}</span>
          </button>
        </div>

        {patientIdentity.isVerified ? (
          /* ── VERIFIED PATIENT DISPLAY CARD ── */
          <div className="bg-emerald-50 border-2 border-primary rounded-3xl p-6 sm:p-8 shadow-xl shadow-primary/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-primary/20">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-primary/20">
                  <span className="material-symbols-outlined text-[36px]">account_circle</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold bg-primary text-white px-3 py-1 rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      {t('patientVerifiedTitle')}
                    </span>
                  </div>
                  <h3 className="font-noto text-2xl sm:text-3xl font-extrabold text-on-surface mt-1">
                    {patientIdentity.name}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetIdentity}
                className="px-4 py-2 rounded-xl bg-white hover:bg-red-50 text-error border border-error/30 text-xs sm:text-sm font-bold shadow-sm cursor-pointer transition-all self-start sm:self-auto"
              >
                बदलें / Change Patient
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="bg-white p-4 rounded-2xl border border-primary/20">
                <span className="text-xs font-bold text-on-surface-variant uppercase">{t('patientAbha')}</span>
                <p className="font-mono text-lg font-bold text-primary mt-0.5">{patientIdentity.idNumber}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-primary/20">
                <span className="text-xs font-bold text-on-surface-variant uppercase">{t('patientAge')} & {t('patientGender')}</span>
                <p className="text-lg font-bold text-on-surface mt-0.5">{patientIdentity.age} वर्ष / {patientIdentity.gender}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-primary/20 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[28px]">lock</span>
                <div>
                  <span className="text-xs font-bold text-on-surface-variant block">ABDM Consent</span>
                  <span className="text-xs font-semibold text-emerald-700">सहमति स्वीकृत / Active</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ── MULTI-TAB IDENTIFICATION INPUT ── */
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-outline-variant/30">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 border-b border-outline-variant/30 pb-4">
              <button
                type="button"
                onClick={() => { setActiveTab('abha'); setInputVal(''); }}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'abha'
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">badge</span>
                <span>{t('tabAbha')}</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('aadhaar'); setInputVal(''); }}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'aadhaar'
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">fingerprint</span>
                <span>{t('tabAadhaar')}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('qr')}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'qr'
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
                <span>{t('tabQr')}</span>
              </button>
            </div>

            {/* Tab 1 & Tab 2: ABHA or Aadhaar Input + Touch Keypad */}
            {activeTab !== 'qr' ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 flex flex-col justify-between h-full">
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-2">
                      {activeTab === 'abha' ? t('tabAbha') : t('tabAadhaar')}
                    </label>

                    <div className="relative mb-4">
                      <input
                        type="text"
                        readOnly
                        value={inputVal}
                        placeholder={activeTab === 'abha' ? t('enterAbhaPlaceholder') : t('enterAadhaarPlaceholder')}
                        className="w-full h-16 px-5 rounded-2xl bg-surface-container text-on-surface font-mono text-xl sm:text-2xl font-bold tracking-wider border-2 border-primary/30 focus:border-primary focus:outline-none shadow-inner"
                      />
                      {inputVal && (
                        <button
                          type="button"
                          onClick={handleClear}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-error"
                        >
                          <span className="material-symbols-outlined text-[24px]">cancel</span>
                        </button>
                      )}
                    </div>

                    {activeTab === 'aadhaar' && (
                      <div className="mb-4">
                        <label className="block text-sm font-bold text-on-surface mb-2">
                          {t('enterMobilePlaceholder')}
                        </label>
                        <input
                          type="text"
                          value={mobileVal}
                          onChange={(e) => setMobileVal(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          placeholder="98XXXXXXXX"
                          className="w-full h-14 px-5 rounded-2xl bg-surface-container text-on-surface font-mono text-lg font-bold tracking-wider border border-outline-variant/40"
                        />
                      </div>
                    )}

                    <p className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-2">
                      <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
                      {t('consentLabel')}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-4">
                    <button
                      type="button"
                      disabled={!inputVal || isVerifying}
                      onClick={handleVerify}
                      className="flex-1 h-14 px-8 rounded-2xl bg-primary hover:bg-primary-dark disabled:bg-surface-container disabled:text-on-surface-variant text-white font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all cursor-pointer disabled:cursor-not-allowed active:scale-[0.98]"
                    >
                      {isVerifying ? (
                        <span className="material-symbols-outlined animate-spin text-[24px]">progress_activity</span>
                      ) : (
                        <span className="material-symbols-outlined text-[24px]">check</span>
                      )}
                      <span>{t('verifyButton')}</span>
                    </button>
                  </div>
                </div>

                {/* Accessible On-Screen Touch Keypad */}
                <div className="lg:col-span-5 bg-surface-container-low p-4 sm:p-5 rounded-3xl border border-outline-variant/30">
                  <div className="grid grid-cols-3 gap-3">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                      <button
                        key={digit}
                        type="button"
                        onClick={() => handleKeypadPress(digit)}
                        className="h-14 sm:h-16 rounded-2xl bg-white hover:bg-emerald-50 text-on-surface font-mono text-2xl font-bold shadow-sm active:scale-95 transition-all border border-outline-variant/20 flex items-center justify-center cursor-pointer"
                      >
                        {digit}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={handleClear}
                      className="h-14 sm:h-16 rounded-2xl bg-surface-container hover:bg-red-50 text-error font-bold text-sm shadow-sm active:scale-95 transition-all border border-outline-variant/20 flex items-center justify-center cursor-pointer"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => handleKeypadPress('0')}
                      className="h-14 sm:h-16 rounded-2xl bg-white hover:bg-emerald-50 text-on-surface font-mono text-2xl font-bold shadow-sm active:scale-95 transition-all border border-outline-variant/20 flex items-center justify-center cursor-pointer"
                    >
                      0
                    </button>
                    <button
                      type="button"
                      onClick={handleBackspace}
                      className="h-14 sm:h-16 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold shadow-sm active:scale-95 transition-all border border-outline-variant/20 flex items-center justify-center cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[24px]">backspace</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Tab 3: Scan & Share QR */
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="relative p-5 bg-white rounded-3xl shadow-xl border-2 border-primary/30 mb-5">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 bg-surface-container-low rounded-2xl flex items-center justify-center border border-dashed border-primary/40 relative overflow-hidden">
                    <span className="material-symbols-outlined text-[100px] text-primary/80">qr_code_2</span>
                    {/* Scanner laser bar animation */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-pulse"></div>
                  </div>
                </div>

                <h4 className="font-noto text-xl font-bold text-on-surface max-w-md mb-2">
                  {t('scanQrInstruction')}
                </h4>
                <p className="text-xs text-on-surface-variant mb-6">
                  ABDM Scan & Share • Instant OPD Registration
                </p>

                <button
                  type="button"
                  onClick={handleAutofillDemo}
                  className="px-6 py-3.5 bg-primary text-white font-bold text-base rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary-dark active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[22px]">center_focus_strong</span>
                  <span>{t('scanQrSimulate')}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── BOTTOM ACTIONS ── */}
      <div className="w-full pt-4 pb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={onStaffHelp}
          className="h-16 sm:h-20 px-6 sm:px-8 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-base sm:text-lg flex items-center justify-center gap-3 border border-outline-variant/30 active:scale-[0.99] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[32px]">support_agent</span>
          <div className="flex flex-col text-left leading-tight">
            <span>{t('staffHelp')}</span>
            <span className="text-xs font-bold uppercase opacity-80">{t('staffHelpSub')}</span>
          </div>
        </button>

        <button
          type="button"
          id="proceed-to-step-3"
          onClick={onProceed}
          aria-label="Proceed to Choose Mode"
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
          onLanguageChange(lang);
          showAudioToast(getVoicePrompt(lang, 'toastRegionalSelected'));
        }}
      />

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
