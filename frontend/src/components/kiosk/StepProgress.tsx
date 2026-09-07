import React from 'react';
import { useTranslation } from 'react-i18next';
import type { KioskStep } from '../../types';

interface StepProgressProps {
  currentStep: KioskStep;
  onStepClick?: (step: KioskStep) => void;
}

interface StepItem {
  step: KioskStep;
  key: 'step1' | 'step2' | 'step3' | 'step4' | 'step5';
}

const STEPS: StepItem[] = [
  { step: 1, key: 'step1' },
  { step: 2, key: 'step2' },
  { step: 3, key: 'step3' },
  { step: 4, key: 'step4' },
  { step: 5, key: 'step5' },
];

export const StepProgress: React.FC<StepProgressProps> = ({ currentStep, onStepClick }) => {
  const { t } = useTranslation('common');

  return (
    <nav className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-3 overflow-x-auto">
      <div className="flex items-center justify-between gap-2 sm:gap-3 min-w-[620px]">
        {STEPS.map((item) => {
          const isActive = currentStep === item.step;
          const isCompleted = currentStep > item.step;

          return (
            <button
              key={item.step}
              onClick={() => onStepClick && isCompleted && onStepClick(item.step)}
              disabled={!isCompleted && !isActive}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl transition-all text-center ${
                isActive
                  ? 'bg-primary text-white font-bold shadow-md shadow-primary/20 scale-[1.02]'
                  : isCompleted
                  ? 'bg-primary-light text-primary font-semibold hover:bg-emerald-100 cursor-pointer'
                  : 'bg-surface-container text-on-surface-variant/70 cursor-not-allowed'
              }`}
            >
              {isCompleted && (
                <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
              )}
              <span className="text-xs sm:text-sm whitespace-nowrap font-medium">
                {t(item.key)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
