import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import type { Language } from './types';

// --- Static locale imports (Vite bundles these at build time) ---
import hi from './locales/hi/common.json';
import en from './locales/en/common.json';
import mr from './locales/mr/common.json';
import bn from './locales/bn/common.json';
import ta from './locales/ta/common.json';
import te from './locales/te/common.json';
import gu from './locales/gu/common.json';
import kn from './locales/kn/common.json';
import pa from './locales/pa/common.json';

/** Maps our app Language type → BCP-47 locale code used by i18next */
export const langToLocale: Record<Language, string> = {
  hindi:    'hi',
  english:  'en',
  marathi:  'mr',
  bengali:  'bn',
  tamil:    'ta',
  telugu:   'te',
  gujarati: 'gu',
  kannada:  'kn',
  punjabi:  'pa',
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      hi: { common: hi },
      en: { common: en },
      mr: { common: mr },
      bn: { common: bn },
      ta: { common: ta },
      te: { common: te },
      gu: { common: gu },
      kn: { common: kn },
      pa: { common: pa },
    },
    lng: 'hi',           // default language
    fallbackLng: 'hi',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // React already escapes
    },
  });

/**
 * Returns a translated string for a SPECIFIC language without changing
 * the active UI language. Used to get voice prompts in the target language.
 */
export function getVoicePrompt(lang: Language, key: string): string {
  const locale = langToLocale[lang];
  const fixedT = i18n.getFixedT(locale, 'common');
  return fixedT(key) as string;
}

export default i18n;
