import type { Language } from '../types';

class VoiceService {
  private synth: SpeechSynthesis | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.synth) {
      this.synth.cancel();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public speak(text: string, language: Language = 'hindi', onEnd?: () => void): void {
    if (this.isMuted || !this.synth) return;

    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Language mapping
    const langMap: Record<Language, string> = {
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

    utterance.lang = langMap[language] || 'hi-IN';
    utterance.rate = 0.95; // Slightly slower for clear hospital announcements
    utterance.pitch = 1.0;

    if (onEnd) {
      utterance.onend = onEnd;
    }

    this.synth.speak(utterance);
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const voiceService = new VoiceService();
