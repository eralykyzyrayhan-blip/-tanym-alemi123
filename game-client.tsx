"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Gamepad2,
  Home,
  Layers3,
  Lightbulb,
  Play,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Star,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";
import { GameCover } from "@/components/game-cover";
import { SiteFooter, Logo } from "@/components/site-chrome";
import { SoundToggle, SpeakButton } from "@/components/sound-controls";
import { Feedback, Pill, ProgressBar, Stars, cx } from "@/components/ui";
import { playSound } from "@/lib/audio";
import { LEVEL_LABELS, type GameMeta } from "@/lib/games";
import type { GameFinishPayload } from "@/lib/game-types";
import {
  computeStars,
  readSoundPreference,
  recordResult,
  saveSoundPreference,
  type GameResult,
  type Level,
} from "@/lib/progress";
import { useProgress } from "@/lib/use-progress";
import { SpotDifferenceGame } from "@/components/games/spot-difference";
import { MemoryGame } from "@/components/games/memory";
import { LogicGame } from "@/components/games/logic";
import { ShadowsGame } from "@/components/games/shadows";
import { ShapesGame } from "@/components/games/shapes";

const LEVELS: Level[] = [1, 2, 3];

const CONFETTI = Array.from({ length: 26 }, (_, index) => ({
  left: `${(index * 3.7 + 4) % 96}%`,
  delay: `${(index % 9) * 0.12}s`,
  drift: `${((index % 5) - 2) * 32}px`,
  color: ["#26B6B2", "#9271E8", "#F7B23B", "#F272A8", "#35C08F"][index % 5],
  duration: `${1.9 + (index % 4) * 0.3}s`,
}));

function ResultScreen({
  meta,
  level,
  result,
  bestStars,
  onReplay,
  onChangeLevel,
}: {
  meta: GameMeta;
  level: Level;
  result: GameResult;
  bestStars: number;
  onReplay: () => void;
  onChangeLevel: () => void;
}) {
  const message =
    result.stars === 3
      ? "Керемет! Сен тапсырманы мінсіз орындадың!"
      : result.stars === 2
        ? "Тамаша! Тағы бір рет ойнасаң, барлық жұлдызды жинайсың!"
        : "Жарайсың! Сен тапсырманы орындадың! Әр әрекет — үлкен жетістік.";

  return (
    <div className="relative overflow-hidden rounded-4xl border border-ink/6 bg-white p-5 shadow-card sm:p-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {CONFETTI.map((piece, index) => (
          <span
            key={index}
            className="confetti-piece"
            style={{
              left: piece.left,
              backgroundColor: piece.color,
              animationDelay: piece.delay,
              animationDuration: piece.duration,
              ["--drift" as string]: piece.drift,
            }}
          />
        ))}
      </div>

      <div className="relative text-center">
        <span className="pill mx-auto bg-mint/12 text-[#176B4E]">
          <Trophy size={15} aria-hidden="true" />
          Нәтиже экраны
        </span>
        <h2 className="mt-3 text-2xl font-black tracking-tight text-ink sm:text-3xl">
          Жарайсың! Сен тапсырманы орындадың!
        </h2>
        <p className="mt-2 text-sm font-semibold text-ink-soft">
          {meta.title} · {LEVEL_LABELS[level]} деңгей
        </p>

        <div className="mt-5 flex items-end justify-center gap-2">
          {[1, 2, 3].map((star) => (
            <span
              key={star}
              className={cx(
                "animate-pop",
                star === 2 ? "-translate-y-3" : "",
              )}
              style={{ animationDelay: `${star * 130}ms` }}
            >
              <Star
                size={star === 2 ? 74 : 56}
                strokeWidth={1.6}
                className={star <= result.stars ? "fill-honey text-honey drop-shadow-[0_10px_18px_rgba(247,178,59,0.45)]" : "text-ink/15"}
                aria-hidden="true"
              />
            </span>
          ))}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          {[
            { label: "Тапсырма", value: result.total, icon: Target, tone: "#172C53", soft: "#E8EDF8" },
            { label: "Дұрыс жауап", value: result.correct, icon: CheckCircle2, tone: "#176B4E", soft: "#E9FBF3" },
            { label: "Қате", value: result.wrong, icon: XCircle, tone: "#8A5A08", soft: "#FFF6E6" },
            { label: "Жұлдыз", value: result.stars, icon: Star, tone: "#C98A11", soft: "#FFF6E6" },
          ].map((tile) => {
            const Icon = tile.icon;
            return (
              <div key={tile.label} className="rounded-3xl border border-ink/6 bg-canvas p-4">
                <span
                  className="mx-auto grid size-10 place-items-center rounded-2xl"
                  style={{ backgroundColor: tile.soft, color: tile.tone }}
                >
                  <Icon size={20} aria-hidden="true" />
                </span>
                <p className="mt-2 text-2xl font-black leading-tight text-ink">{tile.value}</p>
                <p className="text-[11px] font-extrabold uppercase tracking-wide text-ink-soft/80">
                  {tile.label}
                </p>
              </div>
            );
          })}
        </div>

        <p className="mx-auto mt-5 max-w-xl rounded-3xl bg-skylight px-5 py-4 text-sm font-extrabold leading-relaxed text-ink">
          {message}
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-ink-soft">
          <span className="inline-flex items-center gap-1.5">
            <Star size={14} className="fill-honey text-honey" aria-hidden="true" />
            Осы деңгейдегі үздік нәтиже: {bestStars}/3
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 size={14} aria-hidden="true" />
            Уақыты: {Math.max(1, Math.round(result.durationMs / 1000))} сек
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Lightbulb size={14} aria-hidden="true" />
            Көмек: {result.helpUsed} рет
          </span>
        </div>

        <div className="mt-6 flex flex-col justify-center gap-2.5 sm:flex-row">
          <button type="button" onClick={onReplay} className="btn btn-primary px-6 py-3.5 text-base">
            <RotateCcw size={18} aria-hidden="true" />
            Қайта ойнау
          </button>
          <button type="button" onClick={onChangeLevel} className="btn btn-grape px-6 py-3.5 text-base">
            <Layers3 size={18} aria-hidden="true" />
            Басқа деңгей
          </button>
          <Link href="/" className="btn btn-ghost px-6 py-3.5 text-base">
            <Home size={18} aria-hidden="true" />
            Басты бетке оралу
          </Link>
        </div>
      </div>
    </div>
  );
}

export function GameClient({ meta }: { meta: GameMeta }) {
  const { state } = useProgress();
  const [soundOn, setSoundOn] = useState(true);
  const [phase, setPhase] = useState<"intro" | "playing" | "result">("intro");
  const [level, setLevel] = useState<Level>(1);
  const [attempt, setAttempt] = useState(0);
  const [helpRequest, setHelpRequest] = useState(0);
  const [helpUsed, setHelpUsed] = useState(0);
  const [result, setResult] = useState<GameResult | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const finishedAttemptRef = useRef<number | null>(null);

  useEffect(() => {
    setSoundOn(readSoundPreference());
  }, []);

  const levelStars = useMemo(
    () =>
      LEVELS.map((item) => ({
        level: item,
        stars: state.levels[`${meta.slug}:${item}`]?.stars ?? 0,
        plays: state.levels[`${meta.slug}:${item}`]?.plays ?? 0,
      })),
    [state.levels, meta.slug],
  );

  const totalStars = levelStars.reduce((sum, item) => sum + item.stars, 0);

  const toggleSound = (value: boolean) => {
    setSoundOn(value);
    saveSoundPreference(value);
    if (value) playSound("click", true);
  };

  const startLevel = (nextLevel: Level) => {
    setLevel(nextLevel);
    setAttempt((current) => current + 1);
    setHelpUsed(0);
    setHelpRequest(0);
    setResult(null);
    finishedAttemptRef.current = null;
    setStartedAt(Date.now());
    setPhase("playing");
    playSound("click", soundOn);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinish = useCallback(
    (payload: GameFinishPayload) => {
      if (finishedAttemptRef.current === attempt) return;
      finishedAttemptRef.current = attempt;
      const stars = computeStars(payload.correct, payload.wrong, payload.total);
      const finished: GameResult = {
        gameSlug: meta.slug,
        level,
        correct: payload.correct,
        wrong: payload.wrong,
        total: payload.total,
        helpUsed,
        stars,
        durationMs: startedAt ? Date.now() - startedAt : 0,
      };
      recordResult(finished);
      setResult(finished);
      setPhase("result");
      playSound(stars === 3 ? "win" : "correct", soundOn);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [attempt, helpUsed, level, meta.slug, soundOn, startedAt],
  );

  const handleHelp = () => {
    setHelpRequest((value) => value + 1);
    setHelpUsed((value) => value + 1);
    playSound("hint", soundOn);
  };

  const gameContent = () => {
    const common = {
      level,
      soundOn,
      helpRequest,
      onFinish: handleFinish,
    };
    switch (meta.slug) {
      case "zein":
        return <SpotDifferenceGame {...common} />;
      case "zhad":
        return <MemoryGame {...common} />;
      case "logika":
        return <LogicGame {...common} />;
      case "kolenke":
        return <ShadowsGame {...common} />;
      case "pishin":
        return <ShapesGame {...common} />;
      default:
        return null;
    }
  };

  const bestStars = levelStars.find((item) => item.level === level)?.stars ?? 0;

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="sticky top-0 z-50 border-b border-ink/8 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 w-full max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="btn btn-ghost size-11 min-h-11 shrink-0 rounded-2xl px-0"
            aria-label="Басты бетке оралу"
            title="Басты бетке оралу"
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </Link>
          <div className="hidden sm:block">
            <Logo compact />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink-soft/75">
              {meta.direction}
            </p>
            <p className="truncate text-base font-black leading-tight text-ink">{meta.title}</p>
          </div>
          <div className="flex items-center gap-2">
            {phase === "playing" ? (
              <>
                <span className="hidden rounded-full bg-skylight px-3 py-2 text-xs font-black text-ink sm:inline-flex">
                  {LEVEL_LABELS[level]} деңгей
                </span>
                <button
                  type="button"
                  onClick={handleHelp}
                  className="btn btn-grape px-3 py-2.5 text-sm sm:px-4"
                >
                  <Lightbulb size={17} aria-hidden="true" />
                  <span className="hidden sm:inline">Көмек</span>
                </button>
              </>
            ) : null}
            <SoundToggle enabled={soundOn} onChange={toggleSound} />
          </div>
        </div>
        {phase === "playing" ? (
          <div className="mx-auto w-full max-w-6xl px-4 pb-2 sm:px-6">
            <div className="flex items-center justify-between gap-3 text-[11px] font-extrabold text-ink-soft">
              <span>Оқушыға арналған қысқа нұсқаулық</span>
              <span>Көмек: {helpUsed} рет</span>
            </div>
            <p className="mt-0.5 line-clamp-2 text-xs font-semibold text-ink-soft">{meta.instruction}</p>
          </div>
        ) : null}
      </header>

      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {phase === "intro" ? (
          <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
            <div className="surface p-5 sm:p-7">
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone="teal">
                  <Gamepad2 size={14} aria-hidden="true" />
                  {meta.direction}
                </Pill>
                <Pill tone="neutral">
                  <Clock3 size={14} aria-hidden="true" />
                  {meta.duration}
                </Pill>
                <Pill tone="honey">
                  <Star size={14} aria-hidden="true" />
                  Үздік: {totalStars}/9
                </Pill>
              </div>

              <h1 className="mt-4 text-3xl font-black leading-[1.08] tracking-tight text-ink sm:text-4xl">
                {meta.title}
              </h1>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-ink-soft sm:text-base">
                {meta.description}
              </p>

              <div className="mt-5 rounded-3xl bg-canvas p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-wide text-ink-soft/80">
                      Тапсырма қысқаша
                    </p>
                    <p className="mt-1 text-sm font-bold leading-relaxed text-ink">{meta.instruction}</p>
                  </div>
                  <SpeakButton text={meta.speech} enabled={soundOn} compact />
                </div>
                <p className="mt-3 flex items-start gap-2 text-xs font-semibold leading-relaxed text-ink-soft">
                  <Lightbulb size={15} className="mt-0.5 shrink-0 text-grape" aria-hidden="true" />
                  Қиналсаң, жоғарыдағы «Көмек» батырмасын бас. Уақыт шектеуі жоқ.
                </p>
              </div>

              <p className="mt-4 flex items-start gap-2 text-xs font-semibold leading-relaxed text-ink-soft">
                <Target size={16} className="mt-0.5 shrink-0 text-teal" aria-hidden="true" />
                <span>
                  <span className="font-black text-ink">Мақсаты: </span>
                  {meta.goal}
                </span>
              </p>

              <div className="mt-5">
                <p className="text-[11px] font-black uppercase tracking-wide text-ink-soft/80">
                  Деңгейді таңда (жеңіл, орташа, күрделі)
                </p>
                <div className="mt-2 space-y-2.5">
                  {LEVELS.map((item) => {
                    const info = levelStars.find((entry) => entry.level === item);
                    return (
                      <div
                        key={item}
                        className="flex flex-wrap items-center gap-3 rounded-2xl border border-ink/8 bg-white p-3 transition hover:border-teal/45 sm:flex-nowrap"
                      >
                        <span
                          className="grid size-10 shrink-0 place-items-center rounded-xl text-sm font-black"
                          style={{ backgroundColor: meta.soft, color: meta.deep }}
                        >
                          {item}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-black text-ink">{LEVEL_LABELS[item]} деңгей</p>
                          <p className="truncate text-xs font-semibold text-ink-soft">{meta.levels[item - 1]}</p>
                        </div>
                        <Stars value={info?.stars ?? 0} size={15} />
                        <button
                          type="button"
                          onClick={() => startLevel(item)}
                          className="btn btn-primary min-h-10 w-full px-4 py-2 text-sm sm:w-auto"
                        >
                          <Play size={15} aria-hidden="true" />
                          Бастау
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {meta.skills.map((skill) => (
                  <Pill key={skill} tone="grape">
                    <Sparkles size={12} aria-hidden="true" />
                    {skill}
                  </Pill>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="aspect-4/3 w-full">
                <GameCover slug={meta.slug} />
              </div>
              <div className="surface p-5">
                <h2 className="flex items-center gap-2 text-sm font-black text-ink">
                  <CheckCircle2 size={17} className="text-mint" aria-hidden="true" />
                  Ойын ережесі
                </h2>
                <ul className="mt-3 space-y-2 text-xs font-semibold leading-relaxed text-ink-soft">
                  <li>✓ Қате жауап үшін жаза жоқ — қайта көруге болады.</li>
                  <li>✓ Тыңдап түсіну үшін динамик белгісін бас.</li>
                  <li>✓ Нәтиже мен жұлдыздар автоматты сақталады.</li>
                  <li>✓ Әр деңгейде жаңа тапсырмалар беріледі.</li>
                </ul>
                <div className="mt-4 rounded-2xl bg-grapelight px-4 py-3">
                  <p className="text-[11px] font-extrabold text-grape-deep">
                    Деңгейлер арасындағы прогресің
                  </p>
                  <ProgressBar
                    className="mt-2"
                    value={totalStars}
                    max={9}
                    from="#9271E8"
                    to="#26B6B2"
                    label="Осы ойындағы жұлдыздар"
                  />
                </div>
              </div>
              <Link href="/#games" className="btn btn-ghost w-full px-5 py-3 text-sm">
                Басқа ойынды таңдау
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        ) : null}

        {phase === "playing" ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setPhase("intro")}
                className="btn btn-ghost px-4 py-2.5 text-sm"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                Деңгей таңдау
              </button>
              <span className="pill bg-white text-ink shadow-soft">
                <RefreshCw size={13} aria-hidden="true" />
                Деңгей {level} · {meta.levels[level - 1]}
              </span>
            </div>
            <div key={`${level}-${attempt}`}>{gameContent()}</div>
          </div>
        ) : null}

        {phase === "result" && result ? (
          <ResultScreen
            meta={meta}
            level={level}
            result={result}
            bestStars={Math.max(bestStars, result.stars)}
            onReplay={() => startLevel(level)}
            onChangeLevel={() => {
              setPhase("intro");
              playSound("click", soundOn);
            }}
          />
        ) : null}

        {phase !== "result" ? (
          <div className="mt-8">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-extrabold text-ink-soft hover:text-teal-deep">
              <Home size={16} aria-hidden="true" />
              Басты бетке оралу
            </Link>
          </div>
        ) : null}

        {phase === "intro" ? (
          <div className="mt-5">
            <Feedback tone="info" title="Бұл тапсырма инклюзивті оқытуға бейімделген">
              Барлық нұсқаулық дыбысталады, батырмалар үлкен, таймер жоқ. Керек болса, көмектен сұра.
            </Feedback>
          </div>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}
