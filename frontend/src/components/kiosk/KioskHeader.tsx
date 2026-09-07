import React from 'react';
import { useTranslation } from 'react-i18next';

interface KioskHeaderProps {
  onSosClick?: () => void;
  onStaffHelp?: () => void;
}

export const KioskHeader: React.FC<KioskHeaderProps> = ({ onSosClick, onStaffHelp }) => {
  const { t } = useTranslation('common');

  return (
    <header className="sticky top-0 left-0 right-0 w-full z-40 bg-white/95 backdrop-blur-xl border-b border-surface-container-high shadow-[0_4px_20px_rgba(13,122,95,0.06)] px-4 sm:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white shadow-md shadow-primary/20">
            <span className="material-symbols-outlined text-[30px]">local_hospital</span>
          </div>
          <div className="flex flex-col">
            <span className="font-noto text-2xl sm:text-3xl font-extrabold text-primary tracking-tight leading-none">
              SwasthyaLok
            </span>
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mt-0.5">
              {t('headerSubtitle')}
            </span>
          </div>

          {/* AI4Bharat Status Pill */}
          <div className="hidden lg:flex items-center gap-2 bg-surface-container-low border border-primary/20 px-3.5 py-1.5 rounded-full">
            <span className="material-symbols-outlined text-primary text-[18px]">graphic_eq</span>
            <span className="text-xs text-primary font-bold">{t('aiLayerActive')}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
        </div>

        {/* Action Controls & Emergency SOS */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Helpline / Staff Button */}
          <button
            onClick={onStaffHelp}
            className="hidden sm:flex items-center gap-2 bg-surface-container hover:bg-surface-container-high px-4 py-2 rounded-xl border border-outline-variant/30 text-left transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">support_agent</span>
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-on-surface-variant font-medium leading-none">{t('opdHelp')}</span>
              <span className="text-xs font-bold text-on-surface leading-tight">1800-108-OPD</span>
            </div>
          </button>

          {/* SOS Emergency Button */}
          <button
            onClick={onSosClick}
            className="h-11 px-4 sm:px-5 rounded-xl bg-error text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-[0_4px_16px_rgba(220,38,38,0.3)] active:scale-95 transition-all hover:bg-error-dark cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">e911_emergency</span>
            <span className="whitespace-nowrap">{t('sosButton')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
