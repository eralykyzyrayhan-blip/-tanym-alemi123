type SoundKind = "correct" | "wrong" | "click" | "win" | "hint" | "star";

let audioContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!audioContext) {
      const Ctor =
        window.AudioContext ??
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      audioContext = new Ctor();
    }
    if (audioContext.state === "suspended") void audioContext.resume();
    return audioContext;
  } catch {
    return null;
  }
}

function tone(
  ctx: AudioContext,
  frequency: number,
  start: number,
  duration: number,
  gainValue: number,
  type: OscillatorType = "sine",
) {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + start);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(gainValue, ctx.currentTime + start + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(ctx.currentTime + start);
  oscillator.stop(ctx.currentTime + start + duration + 0.05);
}

const PATTERNS: Record<SoundKind, Array<[number, number, number, OscillatorType]>> = {
  correct: [
    [523.25, 0, 0.22, "sine"],
    [659.25, 0.09, 0.26, "sine"],
    [783.99, 0.18, 0.32, "sine"],
  ],
  wrong: [
    [392, 0, 0.18, "sine"],
    [329.63, 0.12, 0.24, "sine"],
  ],
  click: [[740, 0, 0.09, "triangle"]],
  hint: [
    [587.33, 0, 0.14, "triangle"],
    [880, 0.1, 0.2, "triangle"],
  ],
  star: [
    [880, 0, 0.12, "sine"],
    [1174.66, 0.08, 0.2, "sine"],
  ],
  win: [
    [523.25, 0, 0.2, "sine"],
    [659.25, 0.12, 0.2, "sine"],
    [783.99, 0.24, 0.24, "sine"],
    [1046.5, 0.36, 0.42, "sine"],
  ],
};

export function playSound(kind: SoundKind, enabled: boolean): void {
  if (!enabled) return;
  const ctx = getContext();
  if (!ctx) return;
  const pattern = PATTERNS[kind];
  pattern.forEach(([frequency, start, duration, type]) => {
    tone(ctx, frequency, start, duration, kind === "wrong" ? 0.07 : 0.11, type);
  });
}

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speak(text: string, enabled: boolean): void {
  if (!enabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const kazakh = voices.find((voice) => /kk|kaz/i.test(voice.lang));
    const russian = voices.find((voice) => /ru/i.test(voice.lang));
    if (kazakh) {
      utterance.voice = kazakh;
      utterance.lang = kazakh.lang;
    } else {
      utterance.lang = russian ? "ru-RU" : "ru-RU";
    }
    utterance.rate = 0.92;
    utterance.pitch = 1.08;
    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  } catch {
    /* дыбыстау мүмкін болмаса, ойын жалғасады */
  }
}

export function stopSpeaking(): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  } catch {
    /* елемеу */
  }
}

export function hasSpeech(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function primeAudio(): void {
  getContext();
}
