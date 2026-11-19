"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Eye, Hand, HelpCircle, Lightbulb, Link2, MousePointerClick } from "lucide-react";
import { Feedback, Pill, ProgressBar, cx } from "@/components/ui";
import { playSound, speak } from "@/lib/audio";
import type { GameCanvasProps } from "@/lib/game-types";
import { ITEMS, ItemGlyph, ItemTile, type ItemKey } from "@/components/games/item-icon";

const LEVEL_PAIRS: Record<1 | 2 | 3, ItemKey[]> = {
  1: ["cat", "umbrella", "bike"],
  2: ["bag", "key", "fish", "flower", "clock"],
  3: ["cat", "dog", "rabbit", "bird", "squirrel", "turtle"],
};

function shuffle<T>(input: T[]): T[] {
  const array = [...input];
  for (let index = array.length - 1; index > 0; index -= 1) {
    const random = Math.floor(Math.random() * (index + 1));
    const temporary = array[index];
    array[index] = array[random];
    array[random] = temporary;
  }
  return array;
}

type Message = { tone: "success" | "try" | "info" | "celebrate"; title: string; body?: string };
type ConnectionLine = { key: ItemKey; x1: number; y1: number; x2: number; y2: number; color: string };

export function ShadowsGame({ level, soundOn, helpRequest, onFinish }: GameCanvasProps) {
  const pairs = LEVEL_PAIRS[level];
  const [shadowOrder] = useState(() => shuffle(pairs));
  const [selected, setSelected] = useState<ItemKey | null>(null);
  const [matched, setMatched] = useState<ItemKey[]>([]);
  const [wrong, setWrong] = useState(0);
  const [hintKey, setHintKey] = useState<ItemKey | null>(null);
  const [shakeKey, setShakeKey] = useState<ItemKey | null>(null);
  const [lines, setLines] = useState<ConnectionLine[]>([]);
  const [message, setMessage] = useState<Message>({
    tone: "info",
    title: "Затты таңдап, оның көлеңкесін тап",
    body: "Затты бас (немесе сүйреп апар), сосын оң жақтағы көлеңкеге бас. Дұрыс жұп сызықпен жалғанады.",
  });

  const matchedRef = useRef<ItemKey[]>([]);
  const wrongRef = useRef(0);
  const finishedRef = useRef(false);
  const handledHelpRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const shadowRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    matchedRef.current = matched;
  }, [matched]);

  const updateLines = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const base = container.getBoundingClientRect();
    const next: ConnectionLine[] = [];
    for (const key of matched) {
      const item = itemRefs.current[key];
      const shadow = shadowRefs.current[key];
      if (!item || !shadow) continue;
      const itemRect = item.getBoundingClientRect();
      const shadowRect = shadow.getBoundingClientRect();
      next.push({
        key,
        x1: itemRect.right - base.left,
        y1: itemRect.top + itemRect.height / 2 - base.top,
        x2: shadowRect.left - base.left,
        y2: shadowRect.top + shadowRect.height / 2 - base.top,
        color: ITEMS[key].color,
      });
    }
    setLines(next);
  }, [matched]);

  useEffect(() => {
    updateLines();
    const handleResize = () => updateLines();
    window.addEventListener("resize", handleResize);
    const timer = window.setTimeout(updateLines, 350);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.clearTimeout(timer);
    };
  }, [updateLines]);

  const finishIfDone = (nextMatched: ItemKey[]) => {
    if (nextMatched.length === pairs.length && !finishedRef.current) {
      finishedRef.current = true;
      speak("Жарайсың! Барлық көлеңкені таптың!", soundOn);
      window.setTimeout(() => {
        onFinish({ correct: pairs.length, wrong: wrongRef.current, total: pairs.length });
      }, 950);
    }
  };

  const handleShadow = (key: ItemKey) => {
    if (finishedRef.current) return;
    if (matchedRef.current.includes(key)) {
      setMessage({
        tone: "info",
        title: "Бұл көлеңке табылды",
        body: "Басқа көлеңкені таңдап көр.",
      });
      return;
    }
    if (!selected) {
      setMessage({
        tone: "try",
        title: "Алдымен сол жақтағы затты таңда",
        body: "Затты бас, сосын оның көлеңкесін тап.",
      });
      return;
    }
    if (selected === key) {
      const next = [...matchedRef.current, key];
      matchedRef.current = next;
      setMatched(next);
      setSelected(null);
      setHintKey(null);
      playSound("correct", soundOn);
      setMessage({
        tone: next.length === pairs.length ? "celebrate" : "success",
        title:
          next.length === pairs.length
            ? "Барлық жұп табылды! Жарайсың!"
            : `Дұрыс! «${ITEMS[key].label}» өз көлеңкесін тапты.`,
        body:
          next.length === pairs.length
            ? "Сен пішіндерді жақсы ажыратасың!"
            : `Тағы ${pairs.length - next.length} жұп қалды.`,
      });
      finishIfDone(next);
      return;
    }

    wrongRef.current += 1;
    setWrong(wrongRef.current);
    setShakeKey(key);
    playSound("wrong", soundOn);
    setMessage({
      tone: "try",
      title: "Бұл көлеңке басқа затқа тиесілі",
      body: "Зат бастапқы орнында қалды. Пішінін мұқият салыстырып, қайта көр.",
    });
    window.setTimeout(() => setShakeKey(null), 600);
  };

  useEffect(() => {
    if (helpRequest === 0 || handledHelpRef.current === helpRequest) return;
    handledHelpRef.current = helpRequest;
    const remaining = pairs.filter((key) => !matchedRef.current.includes(key));
    if (remaining.length === 0) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    setHintKey(pick);
    setSelected(pick);
    setMessage({
      tone: "info",
      title: "Көмек: жарқыраған жұп",
      body: `«${ITEMS[pick].label}» затты таңдадым. Енді сары шеңбермен белгіленген көлеңкені бас.`,
    });
    playSound("hint", soundOn);
    const timer = window.setTimeout(() => setHintKey(null), 6000);
    return () => window.clearTimeout(timer);
  }, [helpRequest, pairs, soundOn]);

  const progress = matched.length;

  return (
    <div className="surface p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Pill tone="grape">
            <Eye size={14} aria-hidden="true" />
            Өз көлеңкеңді тап
          </Pill>
          <h2 className="mt-2 text-xl font-black tracking-tight text-ink sm:text-2xl">
            Затты көлеңкесімен сәйкестендір
          </h2>
          <p className="text-xs font-semibold text-ink-soft">
            Сол жақта — заттар, оң жақта — олардың көлеңкелері.
          </p>
        </div>
        <div className="min-w-[180px] flex-1 sm:max-w-xs">
          <div className="flex items-center justify-between text-xs font-extrabold text-ink-soft">
            <span>Табылған жұп</span>
            <span className="text-ink">
              {progress} / {pairs.length}
            </span>
          </div>
          <ProgressBar className="mt-1.5" value={progress} max={pairs.length} from="#9271E8" to="#26B6B2" label="" />
          <p className="mt-1 text-right text-[11px] font-bold text-ink-soft/80">Қате әрекет: {wrong}</p>
        </div>
      </div>

      <div ref={containerRef} className="relative mt-4 grid gap-4 rounded-4xl bg-canvas p-3 sm:grid-cols-2 sm:p-5">
        <svg className="pointer-events-none absolute inset-0 z-10 h-full w-full" aria-hidden="true">
          {lines.map((line) => (
            <g key={line.key}>
              <line
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="#FFFFFF"
                strokeWidth={7}
                strokeLinecap="round"
                opacity={0.9}
              />
              <line
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={line.color}
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeDasharray="9 6"
              />
            </g>
          ))}
        </svg>

        <div>
          <p className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-ink-soft/80">
            <Hand size={14} aria-hidden="true" /> Заттар
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
            {pairs.map((key) => {
              const isMatched = matched.includes(key);
              return (
                <div
                  key={key}
                  ref={(node) => {
                    itemRefs.current[key] = node;
                  }}
                >
                  <ItemTile
                    itemKey={key}
                    size={62}
                    selected={selected === key}
                    state={isMatched ? "correct" : "idle"}
                    onClick={() => {
                      if (isMatched) return;
                      setSelected(selected === key ? null : key);
                      playSound("click", soundOn);
                      setMessage({
                        tone: "info",
                        title: `«${ITEMS[key].label}» таңдалды`,
                        body: "Енді оң жақтан дәл осы заттың көлеңкесін тап.",
                      });
                    }}
                    disabled={isMatched}
                    draggable={!isMatched}
                    onDragStart={(event) => {
                      setSelected(key);
                      event.dataTransfer.setData("text/plain", key);
                      event.dataTransfer.effectAllowed = "move";
                    }}
                    className={cx(
                      hintKey === key && !isMatched ? "animate-pulse ring-2 ring-honey ring-offset-2" : "",
                    )}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-ink-soft/80">
            <Link2 size={14} aria-hidden="true" /> Көлеңкелер
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
            {shadowOrder.map((key, index) => {
              const isMatched = matched.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  ref={(node) => {
                    shadowRefs.current[key] = node;
                  }}
                  onClick={() => handleShadow(key)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    const dragged = event.dataTransfer.getData("text/plain") as ItemKey;
                    if (dragged && pairs.includes(dragged)) {
                      setSelected(dragged);
                      handleShadowAfterDrop(dragged, key);
                    } else {
                      handleShadow(key);
                    }
                  }}
                  aria-label={`Көлеңке нұсқасы ${index + 1}${isMatched ? " — табылды" : ""}`}
                  className={cx(
                    "relative flex aspect-square w-full flex-col items-center justify-center rounded-3xl border-2 transition",
                    isMatched
                      ? "border-mint bg-[#E9FBF3]"
                      : "border-transparent bg-[#E8ECF6] hover:-translate-y-0.5 hover:border-grape/40",
                    hintKey === key && !isMatched ? "animate-pulse ring-2 ring-honey ring-offset-2" : "",
                    shakeKey === key ? "animate-shake" : "",
                  )}
                >
                  <ItemGlyph
                    itemKey={key}
                    size={54}
                    color={isMatched ? "#176B4E" : "#26324F"}
                    className={isMatched ? "opacity-80" : "opacity-90"}
                  />
                  {isMatched ? (
                    <span className="absolute -right-1.5 -top-1.5 grid size-6 place-items-center rounded-full bg-mint text-[12px] font-black text-white shadow-soft">
                      ✓
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 min-h-[74px]">
        <Feedback tone={message.tone} title={message.title}>
          {message.body}
        </Feedback>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-3xl bg-skylight p-4">
          <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-ink">
            <MousePointerClick size={14} aria-hidden="true" /> Қалай ойнау керек
          </p>
          <p className="mt-1.5 text-xs font-semibold leading-relaxed text-ink-soft">
            Затты бас, сосын көлеңкесін бас. Немесе затты көлеңкеге сүйреп апар. Сәйкес келмесе, зат
            бастапқы орнында қалады — қайта көресің.
          </p>
        </div>
        <div className="rounded-3xl bg-[#E9FBF3] p-4">
          <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-ink">
            <Lightbulb size={14} aria-hidden="true" /> Кеңес
          </p>
          <p className="mt-1.5 text-xs font-semibold leading-relaxed text-ink-soft">
            Әр заттың пішінін атап шық: «дөңгелек», «ұзын», «құлақты». Сонда көлеңкені тез табасың.
            Көмек қажет болса, жоғарыдағы «Көмек» батырмасын бас.
          </p>
        </div>
      </div>

      {matched.length === pairs.length ? (
        <div className="mt-4 flex items-center gap-2 rounded-3xl bg-grapelight px-4 py-3 text-sm font-extrabold text-grape-deep">
          <CheckCircle2 size={18} aria-hidden="true" />
          Барлық жұп табылды. Нәтиже дайындалып жатыр…
        </div>
      ) : (
        <p className="mt-4 flex items-center gap-2 text-[11px] font-extrabold text-ink-soft">
          <HelpCircle size={13} aria-hidden="true" />
          Пернетақта да, сенсорлық экран да жарайды: таңдау және басу жеткілікті.
        </p>
      )}
    </div>
  );

  function handleShadowAfterDrop(dragged: ItemKey, target: ItemKey) {
    if (dragged === target) {
      if (!matchedRef.current.includes(target)) {
        const next = [...matchedRef.current, target];
        matchedRef.current = next;
        setMatched(next);
        setSelected(null);
        setHintKey(null);
        playSound("correct", soundOn);
        setMessage({
          tone: next.length === pairs.length ? "celebrate" : "success",
          title:
            next.length === pairs.length
              ? "Барлық жұп табылды! Жарайсың!"
              : `Дұрыс! «${ITEMS[target].label}» өз көлеңкесін тапты.`,
          body: `Тағы ${pairs.length - next.length} жұп қалды.`,
        });
        finishIfDone(next);
      }
    } else {
      wrongRef.current += 1;
      setWrong(wrongRef.current);
      setShakeKey(target);
      playSound("wrong", soundOn);
      setMessage({
        tone: "try",
        title: "Бұл көлеңке басқа заттың пішіні",
        body: "Зат бастапқы орнына қайтты. Тағы бір рет мұқият қарап көр.",
      });
      window.setTimeout(() => setShakeKey(null), 600);
    }
  }
}
