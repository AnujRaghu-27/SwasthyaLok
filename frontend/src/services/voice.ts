import type { Language } from '../types';

const LANG_BCP47_MAP: Record<Language, string> = {
  hindi: 'hi-IN',
  english: 'en-IN',
  marathi: 'mr-IN',
  bengali: 'bn-IN',
  tamil: 'ta-IN',
  telugu: 'te-IN',
  gujarati: 'gu-IN',
  kannada: 'kn-IN',
  punjabi: 'pa-IN',
};

class VoiceService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices(): void {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  private getBestVoice(targetLang: string): SpeechSynthesisVoice | null {
    if (this.voices.length === 0 && this.synth) {
      this.voices = this.synth.getVoices();
    }
    if (this.voices.length === 0) return null;

    const langCode = targetLang.split('-')[0].toLowerCase();

    // 1. Exact BCP-47 match (e.g. hi-IN)
    let matched = this.voices.find(v => v.lang.replace('_', '-').toLowerCase() === targetLang.toLowerCase());
    if (matched) return matched;

    // 2. Language prefix match (e.g. hi)
    matched = this.voices.find(v => v.lang.replace('_', '-').toLowerCase().startsWith(langCode));
    if (matched) return matched;

    // 3. Indian English fallback for natural Indian accent pronunciation
    matched = this.voices.find(v => v.lang.replace('_', '-').toLowerCase() === 'en-in');
    if (matched) return matched;

    // 4. Default voice
    return this.voices.find(v => v.default) || this.voices[0] || null;
  }

  public speak(text: string, language: Language = 'hindi', onEnd?: () => void): void {
    if (!this.synth || !text) return;

    try {
      // Unstick any paused state in Chromium
      if (this.synth.paused) {
        this.synth.resume();
      }

      // Cancel any ongoing speech
      this.synth.cancel();

      const targetLang = LANG_BCP47_MAP[language] || 'hi-IN';
      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance; // Prevent garbage collection in Chrome

      const bestVoice = this.getBestVoice(targetLang);
      if (bestVoice) {
        utterance.voice = bestVoice;
        utterance.lang = bestVoice.lang;
      } else {
        utterance.lang = targetLang;
      }

      utterance.rate = 0.92;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = (event) => {
        console.warn('SpeechSynthesis error:', event.error);
        this.currentUtterance = null;
      };

      // Slight timeout to avoid Chromium cancel/speak race condition
      setTimeout(() => {
        if (!this.synth) return;
        this.synth.resume();
        this.synth.speak(utterance);
      }, 35);
    } catch (err) {
      console.warn('VoiceService speak failed:', err);
    }
  }

  public isSpeaking(): boolean {
    return this.currentUtterance !== null;
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }
}

export const voiceService = new VoiceService();
