"use client";

import { Volume2, VolumeX, Mic } from "lucide-react";
import { primeAudio, speak, stopSpeaking } from "@/lib/audio";
import { cx } from "@/components/ui";

export function SoundToggle({
  enabled,
  onChange,
  className,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        primeAudio();
        if (enabled) stopSpeaking();
        onChange(!enabled);
      }}
      aria-pressed={enabled}
      aria-label={enabled ? "Дыбысты өшіру" : "Дыбысты қосу"}
      title={enabled ? "Дыбысты өшіру" : "Дыбысты қосу"}
      className={cx(
        "btn btn-ghost size-11 min-h-11 rounded-2xl px-0 text-ink sm:size-12 sm:min-h-12",
        className,
      )}
    >
      {enabled ? <Volume2 size={20} aria-hidden="true" /> : <VolumeX size={20} aria-hidden="true" />}
    </button>
  );
}

export function SpeakButton({
  text,
  enabled,
  label = "Нұсқаулықты тыңдау",
  className,
  compact = false,
}: {
  text: string;
  enabled: boolean;
  label?: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => speak(text, enabled)}
      className={cx(
        compact
          ? "inline-grid size-9 place-items-center rounded-xl bg-white/85 text-ink-soft transition hover:bg-white hover:text-teal-deep"
          : "btn btn-ghost px-4 py-2 text-sm",
        className,
      )}
      aria-label={label}
      title={label}
    >
      <Mic size={compact ? 16 : 18} aria-hidden="true" />
      {compact ? <span className="sr-only">{label}</span> : <span>{label}</span>}
    </button>
  );
}
