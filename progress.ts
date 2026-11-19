import { GAMES, TOTAL_LEVELS, TOTAL_STARS, type GameSlug } from "./games";

export type Level = 1 | 2 | 3;

export type GameResult = {
  gameSlug: GameSlug;
  level: Level;
  correct: number;
  wrong: number;
  total: number;
  helpUsed: number;
  stars: number;
  durationMs: number;
};

export type LevelRecord = {
  stars: number;
  plays: number;
  bestCorrect: number;
  updatedAt: string;
};

export type ProgressState = {
  version: 1;
  levels: Record<string, LevelRecord>;
  completions: number;
  totalCorrect: number;
  totalWrong: number;
};

export type ProgressSummary = {
  stars: number;
  maxStars: number;
  completions: number;
  completedLevels: number;
  totalLevels: number;
  percent: number;
  totalCorrect: number;
  totalWrong: number;
};

const PROGRESS_KEY = "tanym.progress.v1";
const CLIENT_KEY = "tanym.client.v1";
const SOUND_KEY = "tanym.sound.v1";
const PLAYER_KEY = "tanym.player.v1";
export const PROGRESS_EVENT = "tanym:progress";

export const EMPTY_PROGRESS: ProgressState = {
  version: 1,
  levels: {},
  completions: 0,
  totalCorrect: 0,
  totalWrong: 0,
};

export function levelKey(slug: GameSlug, level: Level): string {
  return `${slug}:${level}`;
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function readProgress(): ProgressState {
  if (!isBrowser()) return EMPTY_PROGRESS;
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) return EMPTY_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    if (!parsed || typeof parsed !== "object" || !parsed.levels) return EMPTY_PROGRESS;
    return {
      version: 1,
      levels: parsed.levels,
      completions: Number(parsed.completions) || 0,
      totalCorrect: Number(parsed.totalCorrect) || 0,
      totalWrong: Number(parsed.totalWrong) || 0,
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function summarize(state: ProgressState): ProgressSummary {
  const records = Object.values(state.levels);
  const stars = records.reduce((sum, record) => sum + Math.min(3, Math.max(0, record.stars)), 0);
  const completedLevels = records.filter((record) => record.plays > 0).length;
  return {
    stars,
    maxStars: TOTAL_STARS,
    completions: state.completions,
    completedLevels,
    totalLevels: TOTAL_LEVELS,
    percent: Math.round((stars / TOTAL_STARS) * 100),
    totalCorrect: state.totalCorrect,
    totalWrong: state.totalWrong,
  };
}

export function readStarsFor(slug: GameSlug, level: Level): number {
  const state = readProgress();
  return state.levels[levelKey(slug, level)]?.stars ?? 0;
}

export function getClientId(): string {
  if (!isBrowser()) return "server";
  try {
    const existing = window.localStorage.getItem(CLIENT_KEY);
    if (existing) return existing;
    const generated =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `tanym-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
    window.localStorage.setItem(CLIENT_KEY, generated);
    return generated;
  } catch {
    return "tanym-anonymous";
  }
}

export function readPlayerName(): string {
  if (!isBrowser()) return "";
  try {
    return window.localStorage.getItem(PLAYER_KEY) ?? "";
  } catch {
    return "";
  }
}

export function savePlayerName(name: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(PLAYER_KEY, name.slice(0, 40));
  } catch {
    /* елемеу */
  }
}

export function readSoundPreference(): boolean {
  if (!isBrowser()) return true;
  try {
    return window.localStorage.getItem(SOUND_KEY) !== "off";
  } catch {
    return true;
  }
}

export function saveSoundPreference(enabled: boolean): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(SOUND_KEY, enabled ? "on" : "off");
  } catch {
    /* елемеу */
  }
}

export function recordResult(result: GameResult): ProgressState {
  const current = readProgress();
  const key = levelKey(result.gameSlug, result.level);
  const previous = current.levels[key];
  const next: ProgressState = {
    version: 1,
    levels: {
      ...current.levels,
      [key]: {
        stars: Math.max(previous?.stars ?? 0, result.stars),
        plays: (previous?.plays ?? 0) + 1,
        bestCorrect: Math.max(previous?.bestCorrect ?? 0, result.correct),
        updatedAt: new Date().toISOString(),
      },
    },
    completions: current.completions + 1,
    totalCorrect: current.totalCorrect + result.correct,
    totalWrong: current.totalWrong + result.wrong,
  };

  if (isBrowser()) {
    try {
      window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent(PROGRESS_EVENT));
    } catch {
      /* елемеу */
    }
  }

  void fetch("/api/results", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...result,
      clientId: getClientId(),
      playerName: readPlayerName() || "Оқушы",
    }),
  }).catch(() => {
    /* сервер қолжетімсіз болса да ойын жалғасады */
  });

  return next;
}

export function computeStars(correct: number, wrong: number, total: number): number {
  if (total <= 0) return 1;
  const accuracy = correct / Math.max(1, correct + wrong);
  if (correct >= total && wrong === 0) return 3;
  if (accuracy >= 0.75) return 2;
  return 1;
}

export function gamesWithProgress(state: ProgressState) {
  return GAMES.map((game) => {
    const levels = ([1, 2, 3] as Level[]).map((level) => {
      const record = state.levels[levelKey(game.slug, level)];
      return { level, stars: record?.stars ?? 0, plays: record?.plays ?? 0 };
    });
    return {
      ...game,
      levels,
      stars: levels.reduce((sum, item) => sum + item.stars, 0),
    };
  });
}
