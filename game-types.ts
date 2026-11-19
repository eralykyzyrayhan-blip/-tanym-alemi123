import type { Level } from "@/lib/progress";

export type GameFinishPayload = {
  correct: number;
  wrong: number;
  total: number;
};

export type GameCanvasProps = {
  level: Level;
  soundOn: boolean;
  helpRequest: number;
  onFinish: (payload: GameFinishPayload) => void;
};

export type HelpText = {
  title: string;
  body: string;
};
