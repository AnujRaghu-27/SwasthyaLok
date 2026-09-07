import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Language } from '../../types';
import { voiceService } from '../../services/voice';
import { getVoicePrompt } from '../../i18n.config';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLanguage: (lang: Language) => void;
  selectedLanguage: Language;
}

const REGIONAL_LANGUAGES: { id: Language; nameNative: string; nameEn: string }[] = [
  { id: 'bengali',  nameNative: 'বাংলা',      nameEn: 'Bengali'  },
  { id: 'tamil',    nameNative: 'தமிழ்',       nameEn: 'Tamil'    },
  { id: 'telugu',   nameNative: 'తెలుగు',      nameEn: 'Telugu'   },
  { id: 'gujarati', nameNative: 'ગુજરાતી',     nameEn: 'Gujarati' },
  { id: 'kannada',  nameNative: 'ಕನ್ನಡ',       nameEn: 'Kannada'  },
  { id: 'punjabi',  nameNative: 'ਪੰਜਾਬੀ',      nameEn: 'Punjabi'  },
];

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onClose,
  onSelectLanguage,
  selectedLanguage,
}) => {
  const { t } = useTranslation('common');

  if (!isOpen) return null;

  const handleSelect = (lang: Language) => {
    // Speak the greeting in the target language using getVoicePrompt
    voiceService.speak(getVoicePrompt(lang, 'voiceSelectPrompt'), lang);
    onSelectLanguage(lang);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-on-surface/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-outline-variant/30 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-surface-container-high">
          <div>
            <h3 className="font-noto text-2xl sm:text-3xl font-bold text-on-surface">
              {t('modalTitle')}
            </h3>
            <p className="text-sm sm:text-base text-on-surface-variant mt-1">
              {t('modalSubtitle')}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close language modal"
            className="w-12 h-12 rounded-2xl bg-surface-container text-on-surface hover:bg-surface-container-high flex items-center justify-center active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[28px]">close</span>
          </button>
        </div>

        {/* Languages Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {REGIONAL_LANGUAGES.map((lang) => {
            const isSelected = selectedLanguage === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => handleSelect(lang.id)}
                className={`h-28 p-4 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-white shadow-lg shadow-primary/20 ring-4 ring-primary-fixed scale-[1.02]'
                    : 'bg-surface-container-low text-on-surface hover:bg-emerald-50 hover:border-primary/40 border border-outline-variant/30 active:scale-95 shadow-sm'
                }`}
              >
                <span className="font-noto text-2xl sm:text-3xl font-bold">{lang.nameNative}</span>
                <span className={`text-xs sm:text-sm font-medium mt-1 ${isSelected ? 'text-white/80' : 'text-on-surface-variant'}`}>
                  {lang.nameEn}
                </span>
                {isSelected && (
                  <span className="material-symbols-outlined text-[18px] mt-1 text-white/90">check_circle</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="mt-8 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="h-14 px-8 rounded-2xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-base active:scale-95 transition-all cursor-pointer"
          >
            {t('modalCancel')}
          </button>
        </div>
      </div>
    </div>
  );
};
