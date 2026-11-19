"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, Eye, Lightbulb, ListChecks, Move, Sparkles } from "lucide-react";
import { SceneArt } from "@/components/games/scene-art";
import { Feedback, Pill, ProgressBar, cx } from "@/components/ui";
import { playSound, speak } from "@/lib/audio";
import { SPOT_SCENES } from "@/lib/spot-scenes";
import type { GameCanvasProps } from "@/lib/game-types";

type Message = { tone: "success" | "try" | "info"; title: string; body?: string } | null;

export function SpotDifferenceGame({ level, soundOn, helpRequest, onFinish }: GameCanvasProps) {
  const scene = SPOT_SCENES[level - 1] ?? SPOT_SCENES[0];
  const [found, setFound] = useState<string[]>([]);
  const [wrong, setWrong] = useState(0);
  const [message, setMessage] = useState<Message>(null);
  const [hintId, setHintId] = useState<string | null>(null);
  const foundRef = useRef<string[]>([]);
  const finishedRef = useRef(false);
  const handledHelpRef = useRef(0);
  const wrongRef = useRef(0);
  const [flash, setFlash] = useState(0);

  useEffect(() => {
    foundRef.current = found;
  }, [found]);

  const handleSpot = useCallback(
    (x: number, y: number) => {
      if (finishedRef.current) return;
      const hit = scene.differences.find(
        (difference) => Math.hypot(difference.x - x, difference.y - y) <= difference.r,
      );

      if (!hit) {
        wrongRef.current += 1;
        setWrong(wrongRef.current);
        setFlash((value) => value + 1);
        playSound("wrong", soundOn);
        setMessage({
          tone: "try",
          title: "Тағы бір рет мұқият қарап көр!",
          body: "Айырмашылық басқа жерде. Суретті бөлік-бөлігімен салыстырып көр.",
        });
        return;
      }

      if (foundRef.current.includes(hit.id)) {
        setMessage({
          tone: "info",
          title: "Бұл айырмашылық табылды!",
          body: `${hit.label}. Енді басқа жерлерді ізде.`,
        });
        return;
      }

      const next = [...foundRef.current, hit.id];
      foundRef.current = next;
      setFound(next);
      setHintId(null);
      playSound("correct", soundOn);
      setMessage({
        tone: "success",
        title: `Дұрыс! ${hit.label}.`,
        body: next.length === scene.differences.length ? "Барлық айырмашылық табылды!" : `Тағы ${scene.differences.length - next.length} айырмашылық қалды.`,
      });

      if (next.length === scene.differences.length && !finishedRef.current) {
        finishedRef.current = true;
        speak("Жарайсың! Барлық айырмашылықты таптың!", soundOn);
        window.setTimeout(() => {
          onFinish({ correct: scene.differences.length, wrong: wrongRef.current, total: scene.differences.length });
        }, 900);
      }
    },
    [onFinish, scene.differences, soundOn],
  );

  useEffect(() => {
    if (helpRequest === 0 || handledHelpRef.current === helpRequest) return;
    handledHelpRef.current = helpRequest;
    const remaining = scene.differences.filter((difference) => !foundRef.current.includes(difference.id));
    if (remaining.length === 0) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    setHintId(pick.id);
    setMessage({
      tone: "info",
      title: "Көмек: жарқыраған шеңберге қара",
      body: "Айырмашылық сары шеңбердің ішінде. Оны басып белгіле.",
    });
    playSound("hint", soundOn);
    const timer = window.setTimeout(() => setHintId(null), 6000);
    return () => window.clearTimeout(timer);
  }, [helpRequest, scene.differences, soundOn]);

  const total = scene.differences.length;

  return (
    <div className="surface p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Pill tone="teal">
            <Eye size={14} aria-hidden="true" />
            Айырмашылықты тап
          </Pill>
          <h2 className="mt-2 text-xl font-black tracking-tight text-ink sm:text-2xl">{scene.title}</h2>
          <p className="text-xs font-semibold text-ink-soft">{scene.subtitle}</p>
        </div>
        <div className="min-w-[190px] flex-1 sm:max-w-xs">
          <div className="flex items-center justify-between text-xs font-extrabold text-ink-soft">
            <span>Табылды</span>
            <span className="text-ink">
              {found.length} / {total}
            </span>
          </div>
          <ProgressBar className="mt-1.5" value={found.length} max={total} label="Прогресс" />
          <p className="mt-1 text-right text-[11px] font-bold text-ink-soft/80">
            Әрекет: {found.length + wrong} · Қате: {wrong}
          </p>
        </div>
      </div>

      <div className={cx("mt-4 grid gap-3 sm:grid-cols-2", flash > 0 && "animate-shake")} key={flash}>
        <SceneArt scene={scene} variant="left" found={found} hintId={hintId} onSpot={handleSpot} />
        <SceneArt scene={scene} variant="right" found={found} hintId={hintId} onSpot={handleSpot} />
      </div>

      <div className="mt-4 min-h-[74px]">
        {message ? (
          <Feedback tone={message.tone} title={message.title}>
            {message.body}
          </Feedback>
        ) : (
          <Feedback tone="info" title="Айырмашылығы бар жерді бас">
            Екі суретті бір-бірлеп салыстыр. Тапқан жерің жасыл белгімен ерекшеленеді. Қателессең — ештеңе
            болмайды, қайта көр.
          </Feedback>
        )}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl bg-canvas p-4">
          <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-ink-soft/80">
            <ListChecks size={14} aria-hidden="true" />
            Табылған айырмашылықтар
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {found.length === 0 ? (
              <span className="text-xs font-semibold text-ink-soft">Әзірге бос. Бірінші айырмашылықты тап!</span>
            ) : (
              found.map((id) => {
                const item = scene.differences.find((difference) => difference.id === id);
                if (!item) return null;
                return (
                  <span
                    key={id}
                    className="inline-flex animate-pop items-center gap-1.5 rounded-full bg-[#E9FBF3] px-3 py-1.5 text-[11px] font-extrabold text-[#176B4E]"
                  >
                    <CheckCircle2 size={13} aria-hidden="true" />
                    {item.label}
                  </span>
                );
              })
            )}
          </div>
        </div>
        <div className="rounded-3xl bg-skylight p-4">
          <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-ink">
            <Lightbulb size={14} aria-hidden="true" />
            Көмек және басқару
          </p>
          <p className="mt-1.5 text-xs font-semibold leading-relaxed text-ink-soft">
            «Көмек» батырмасы айырмашылықтың бірін сары шеңбермен көрсетеді. Пернетақтамен: суретке Tab
            арқылы кіріп, бағыттауыш пернелермен жүріп, Enter бас.
          </p>
          <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-extrabold text-ink-soft">
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1">
              <Move size={12} aria-hidden="true" /> сүйреу жоқ
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1">
              <Sparkles size={12} aria-hidden="true" /> 3 жұлдызға ұмтыл
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
