"use client";

import { useEffect, useState } from "react";
import {
  EMPTY_PROGRESS,
  PROGRESS_EVENT,
  readProgress,
  summarize,
  type ProgressState,
} from "@/lib/progress";

export function useProgress(): {
  state: ProgressState;
  summary: ReturnType<typeof summarize>;
  hydrated: boolean;
} {
  const [state, setState] = useState<ProgressState>(EMPTY_PROGRESS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(readProgress());
    setHydrated(true);
    const refresh = () => setState(readProgress());
    window.addEventListener(PROGRESS_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return { state, summary: summarize(state), hydrated };
}
