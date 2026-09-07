import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { voiceService } from '../../services/voice';

interface KioskHeaderProps {
  onSosClick?: () => void;
  onStaffHelp?: () => void;
}

export const KioskHeader: React.FC<KioskHeaderProps> = ({ onSosClick, onStaffHelp }) => {
  const [isMuted, setIsMuted] = useState(false);
  const { t } = useTranslation('common');

  const handleToggleVolume = () => {
    const muted = voiceService.toggleMute();
    setIsMuted(muted);
  };

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
            className="hidden md:flex items-center gap-2 bg-surface-container hover:bg-surface-container-high px-3.5 py-1.5 rounded-xl border border-outline-variant/30 text-left transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">support_agent</span>
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-on-surface-variant font-medium leading-none">{t('opdHelp')}</span>
              <span className="text-xs font-bold text-on-surface leading-tight">1800-108-OPD</span>
            </div>
          </button>

          {/* Voice Volume Control & Equalizer */}
          <div className="flex items-center gap-1.5 bg-surface-container px-2.5 py-1.5 rounded-xl border border-outline-variant/30">
            <button
              aria-label={isMuted ? 'Unmute Voice Guidance' : 'Mute Voice Guidance'}
              onClick={handleToggleVolume}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                isMuted ? 'bg-error-container text-error' : 'bg-white text-on-surface hover:bg-surface-dim shadow-sm'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isMuted ? 'volume_off' : 'volume_up'}
              </span>
            </button>
            <div className="flex items-center gap-1 px-1">
              <span className={`w-1 rounded-full bg-primary ${isMuted ? 'h-2 opacity-30' : 'h-3 animate-sound-wave-1'}`}></span>
              <span className={`w-1 rounded-full bg-primary ${isMuted ? 'h-2 opacity-30' : 'h-5 animate-sound-wave-2'}`}></span>
              <span className={`w-1 rounded-full bg-primary ${isMuted ? 'h-2 opacity-30' : 'h-4 animate-sound-wave-3'}`}></span>
              <span className={`w-1 rounded-full bg-primary ${isMuted ? 'h-2 opacity-30' : 'h-6 animate-sound-wave-4'}`}></span>
            </div>
          </div>

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
