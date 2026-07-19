import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Web Speech Synthesis API
Object.defineProperty(window, 'speechSynthesis', {
  value: {
    speak: vi.fn(),
    cancel: vi.fn(),
    getVoices: vi.fn().mockReturnValue([]),
  },
  writable: true
});

// Mock Web Speech Recognition API
(window as any).SpeechRecognition = vi.fn().mockImplementation(() => {
  return {
    start: vi.fn(),
    stop: vi.fn(),
    onstart: vi.fn(),
    onresult: vi.fn(),
    onerror: vi.fn(),
    onend: vi.fn(),
  };
});
