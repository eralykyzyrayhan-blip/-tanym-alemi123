"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Brain, Check, Eye, Lightbulb, ListOrdered, Sparkles } from "lucide-react";
import { Feedback, Pill, ProgressBar, cx } from "@/components/ui";
import { playSound, speak } from "@/lib/audio";
import type { GameCanvasProps } from "@/lib/game-types";
import { ITEMS, ItemTile, type ItemKey } from "@/components/games/item-icon";

const CONFIG: Record<1 | 2 | 3, { count: number; pool: ItemKey[] }> = {
  1: {
    count: 4,
    pool: ["apple", "ball", "book", "cat", "umbrella", "flower", "bag", "scissors"],
  },
  2: {
    count: 6,
    pool: ["cherry", "banana", "bus", "dog", "rabbit", "pencil", "spoon", "glasses", "clock", "sun"],
  },
  3: {
    count: 8,
    pool: [
      "apple",
      "pear",
      "ball",
      "book",
      "cat",
      "umbrella",
      "flower",
      "bag",
      "scissors",
      "cherry",
      "banana",
      "grape",
      "bus",
      "plane",
      "fish",
      "clock",
      "key",
      "leaf",
    ],
  },
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

type Phase = "memorize" | "select" | "order";
type Message = { tone: "success" | "try" | "info" | "celebrate"; title: string; body?: string };

export function MemoryGame({ level, soundOn, helpRequest, onFinish }: GameCanvasProps) {
  const { count, pool } = CONFIG[level];

  const setup = useMemo(() => {
    const shuffledPool = shuffle(pool);
    const memorized = shuffledPool.slice(0, count);
    const distractors = shuffledPool.slice(count, count * 2);
    if (distractors.length < count) {
      const extra = shuffle((Object.keys(ITEMS) as ItemKey[]).filter((key) => !memorized.includes(key)));
      while (distractors.length < count && extra.length > 0) {
        const candidate = extra.pop();
        if (candidate) distractors.push(candidate);
      }
    }
    return {
      memorized,
      options: shuffle([...memorized, ...distractors.slice(0, count)]),
      orderOptions: shuffle(memorized),
    };
  }, [level, count, pool]);

  const [phase, setPhase] = useState<Phase>("memorize");
  const [selected, setSelected] = useState<ItemKey[]>([]);
  const [checked, setChecked] = useState(false);
  const [sequence, setSequence] = useState<ItemKey[]>([]);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [message, setMessage] = useState<Message>({
    tone: "info",
    title: "Суреттерді ретімен есте сақта",
    body: "Уақыт шектеуі жоқ. Дайын болғанда «Дайынмын!» батырмасын бас.",
  });
  const [hintKey, setHintKey] = useState<ItemKey | null>(null);

  const correctRef = useRef(0);
  const wrongRef = useRef(0);
  const finishedRef = useRef(false);
  const selectionScoreRef = useRef({ hits: 0, misses: 0 });
  const handledHelpRef = useRef(0);

  const addCorrect = (amount = 1) => {
    correctRef.current = Math.min(count * 2, correctRef.current + amount);
    setCorrect(correctRef.current);
  };
  const addWrong = (amount = 1) => {
    wrongRef.current += amount;
    setWrong(wrongRef.current);
  };

  const totalTasks = count * 2;
  const progress =
    phase === "memorize" ? 0 : phase === "select" ? (checked ? count : selected.length) : sequence.length;

  const handleReady = () => {
    setPhase("select");
    setMessage({
      tone: "info",
      title: "Енді көрген суреттеріңді тап",
      body: `Аралас суреттердің ішінен дәл сол ${count} суретті таңда. Қателессең — қайта көрсетеміз.`,
    });
    playSound("click", soundOn);
    speak(`Көрген ${count} суретті тап.`, soundOn);
  };

  const toggleSelect = (key: ItemKey) => {
    if (checked) return;
    setSelected((current) => {
      if (current.includes(key)) return current.filter((item) => item !== key);
      if (current.length >= count) {
        setMessage({
          tone: "try",
          title: `Тек ${count} сурет таңдау керек`,
          body: "Бір суретті алып тастап, басқасын таңдап көр.",
        });
        return current;
      }
      return [...current, key];
    });
    playSound("click", soundOn);
  };

  const checkSelection = () => {
    if (selected.length === 0) {
      setMessage({ tone: "try", title: "Кемінде бір сурет таңда", body: "Көрген суреттеріңнің біреуін бас." });
      return;
    }
    const hits = selected.filter((key) => setup.memorized.includes(key)).length;
    const misses = selected.filter((key) => !setup.memorized.includes(key)).length;
    const forgotten = count - hits;
    const gainedWrong = misses + forgotten;
    selectionScoreRef.current = { hits, misses };
    addCorrect(hits);
    addWrong(gainedWrong);
    setChecked(true);
    playSound(hits >= Math.ceil(count / 2) ? "correct" : "hint", soundOn);
    setMessage({
      tone: hits === count ? "celebrate" : "success",
      title:
        hits === count
          ? "Тамаша! Барлық суретті дұрыс таптың!"
          : `Дұрыс табылды: ${hits} / ${count}. Енді ретін қалпына келтіреміз.`,
      body:
        gainedWrong > 0
          ? "Жасыл белгі — дұрыс тапқан суреттер. Қате үшін жаза жоқ, жай ғана қайта көреміз."
          : "Керемет есте сақтау!",
    });
  };

  const startOrder = () => {
    setPhase("order");
    setHintKey(null);
    setMessage({
      tone: "info",
      title: "Қосымша тапсырма: ретін қалпына келтір",
      body: "Суреттерді бастапқыда көрсетілген ретімен бас: 1, 2, 3 …",
    });
    playSound("click", soundOn);
  };

  const handleOrderClick = useCallback(
    (key: ItemKey) => {
      if (sequence.includes(key) || finishedRef.current) return;
      const expected = setup.memorized[sequence.length];
      if (key === expected) {
        const next = [...sequence, key];
        setSequence(next);
        addCorrect(1);
        playSound("correct", soundOn);
        setMessage({
          tone: "success",
          title: `${next.length}-сурет дұрыс!`,
          body: next.length === count ? "Рет толық қалпына келді!" : "Келесі суретті таңда.",
        });
        if (next.length === count) {
          finishedRef.current = true;
          const finalCorrect = Math.min(totalTasks, selectionScoreRef.current.hits + count);
          speak("Жарайсың! Барлық тапсырманы орындадың!", soundOn);
          window.setTimeout(() => {
            onFinish({ correct: finalCorrect, wrong: wrongRef.current, total: totalTasks });
          }, 950);
        }
      } else {
        addWrong(1);
        playSound("wrong", soundOn);
        setMessage({
          tone: "try",
          title: "Бұл рет емес",
          body: `${sequence.length + 1}-суретті тағы қарап көр. Төмендегі рет кеңесі көмектеседі.`,
        });
      }
    },
    // addCorrect/addWrong тек ref пен state-ті жаңартады
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [count, onFinish, sequence, setup.memorized, soundOn, totalTasks],
  );

  useEffect(() => {
    if (helpRequest === 0 || handledHelpRef.current === helpRequest) return;
    handledHelpRef.current = helpRequest;
    let timer: number | undefined;
    if (phase === "memorize") {
      setMessage({
        tone: "info",
        title: "Көмек: реттілікпен есте сақта",
        body: "Суреттерді солдан оңға қарай 1, 2, 3 деп атап шық. Бұл рет келесі тапсырмада керек.",
      });
    } else if (phase === "select") {
      const candidate = setup.memorized.find((key) => !selected.includes(key));
      if (candidate) {
        setHintKey(candidate);
        setMessage({
          tone: "info",
          title: "Көмек: сары шеңберге қара",
          body: `«${ITEMS[candidate].label}» суреті бірінші кезеңде көрсетілген.`,
        });
        timer = window.setTimeout(() => setHintKey(null), 5000);
      }
    } else {
      const expected = setup.memorized[sequence.length];
      if (expected) {
        setHintKey(expected);
        setMessage({
          tone: "info",
          title: `Көмек: келесі сурет — «${ITEMS[expected].label}»`,
          body: "Сол суретті бас. Бұл қосымша тапсырма.",
        });
        timer = window.setTimeout(() => setHintKey(null), 5000);
      }
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [helpRequest, phase, selected, sequence.length, setup.memorized]);

  const phaseLabel =
    phase === "memorize" ? "Есте сақтау" : phase === "select" ? "Суреттерді таңдау" : "Ретін қалпына келтіру";

  return (
    <div className="surface p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Pill tone="grape">
            <Brain size={14} aria-hidden="true" />
            {phaseLabel}
          </Pill>
          <h2 className="mt-2 text-xl font-black tracking-tight text-ink sm:text-2xl">
            {count} суретті есте сақта
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] font-extrabold">
            {[
              { id: "memorize", label: "1. Есте сақтау" },
              { id: "select", label: "2. Таңдау" },
              { id: "order", label: "3. Реті" },
            ].map((step) => (
              <span
                key={step.id}
                className={cx(
                  "rounded-full px-2.5 py-1",
                  phase === step.id ? "bg-grape text-white" : "bg-ink/6 text-ink-soft",
                )}
              >
                {step.label}
              </span>
            ))}
          </div>
        </div>
        <div className="min-w-[180px] flex-1 sm:max-w-xs">
          <div className="flex items-center justify-between text-xs font-extrabold text-ink-soft">
            <span>Прогресс</span>
            <span className="text-ink">
              {progress} / {count}
            </span>
          </div>
          <ProgressBar className="mt-1.5" value={progress} max={count} from="#9271E8" to="#26B6B2" label="" />
          <p className="mt-1 text-right text-[11px] font-bold text-ink-soft/80">
            Дұрыс: {correct} · Қате: {wrong}
          </p>
        </div>
      </div>

      {phase === "memorize" ? (
        <div className="mt-4 rounded-4xl bg-skylight p-4 sm:p-5">
          <p className="flex items-center gap-2 text-sm font-black text-ink">
            <Eye size={17} aria-hidden="true" /> Мына суреттерді ретімен есте сақта
          </p>
          <p className="mt-1 text-xs font-semibold text-ink-soft">
            Уақыт шектеуі жоқ. Дайын болғанда төмендегі батырманы бас.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {setup.memorized.map((key, index) => (
              <div key={key} className="animate-pop" style={{ animationDelay: `${index * 60}ms` }}>
                <ItemTile itemKey={key} badge={String(index + 1)} size={72} />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleReady}
            className="btn btn-primary mt-4 w-full px-6 py-4 text-base sm:w-auto"
          >
            <Check size={19} aria-hidden="true" />
            Дайынмын!
          </button>
        </div>
      ) : null}

      {phase === "select" ? (
        <div className="mt-4 rounded-4xl bg-grapelight p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-sm font-black text-ink">
              <Sparkles size={17} aria-hidden="true" /> Көрген суреттеріңді тап
            </p>
            <span className="pill bg-white text-grape-deep">
              Таңдалды: {selected.length} / {count}
            </span>
          </div>
          <p className="mt-1 text-xs font-semibold text-ink-soft">
            Аралас суреттерден бірінші кезеңде көрген суреттерді таңда. Қате жауап үшін жаза жоқ.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {setup.options.map((key) => {
              const isSelected = selected.includes(key);
              const isMemorized = setup.memorized.includes(key);
              let tileState: "idle" | "correct" | "wrong" | "reveal" = "idle";
              if (checked) {
                if (isSelected && isMemorized) tileState = "correct";
                else if (isSelected && !isMemorized) tileState = "wrong";
                else if (!isSelected && isMemorized) tileState = "reveal";
              }
              return (
                <ItemTile
                  key={key}
                  itemKey={key}
                  selected={isSelected && !checked}
                  state={tileState}
                  size={66}
                  onClick={() => toggleSelect(key)}
                  className={hintKey === key ? "animate-pulse ring-2 ring-honey ring-offset-2" : undefined}
                  disabled={checked}
                />
              );
            })}
          </div>
          {!checked ? (
            <button
              type="button"
              onClick={checkSelection}
              className="btn btn-grape mt-4 w-full px-6 py-4 text-base sm:w-auto"
            >
              <Check size={19} aria-hidden="true" />
              Жауапты тексеру
            </button>
          ) : (
            <div className="mt-4 space-y-3">
              <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-bold text-ink-soft">
                <span className="inline-flex items-center gap-1.5">
                  <span className="grid size-4 place-items-center rounded-full bg-mint text-[9px] text-white">✓</span>
                  дұрыс таңдалды
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="grid size-4 place-items-center rounded-full border-2 border-mint text-[8px] text-[#176B4E]">★</span>
                  көрсетілген сурет
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="grid size-4 place-items-center rounded-full bg-honey text-[9px] text-white">!</span>
                  артық таңдау
                </span>
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
              <button type="button" onClick={startOrder} className="btn btn-primary px-6 py-3.5 text-base">
                <ListOrdered size={18} aria-hidden="true" />
                Қосымша тапсырмаға өту
              </button>
              <button
                type="button"
                onClick={() =>
                  setMessage({
                    tone: "info",
                    title: "Кеңес",
                    body: "Жасыл жиекпен көрсетілген суреттер — бірінші кезеңде ұсынылған суреттер.",
                  })
                }
                className="btn btn-ghost px-5 py-3.5 text-sm"
              >
                  <Lightbulb size={17} aria-hidden="true" />
                  Түсіндірме
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {phase === "order" ? (
        <div className="mt-4 rounded-4xl bg-[#E9FBF3] p-4 sm:p-5">
          <p className="flex items-center gap-2 text-sm font-black text-ink">
            <ListOrdered size={17} aria-hidden="true" /> Ретін қалпына келтір
          </p>
          <p className="mt-1 text-xs font-semibold text-ink-soft">
            Суреттерді алғаш көрсетілген ретімен бас. Келесі кезек: {sequence.length + 1}-сурет.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {setup.orderOptions.map((key) => {
              const placed = sequence.includes(key);
              return (
                <ItemTile
                  key={key}
                  itemKey={key}
                  state={placed ? "correct" : "idle"}
                  badge={placed ? String(sequence.indexOf(key) + 1) : undefined}
                  size={66}
                  onClick={() => handleOrderClick(key)}
                  disabled={placed}
                  className={hintKey === key && !placed ? "animate-pulse ring-2 ring-honey ring-offset-2" : undefined}
                />
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {sequence.length === 0 ? (
              <span className="text-xs font-semibold text-ink-soft">Бірінші суретті таңда.</span>
            ) : (
              sequence.map((key, index) => (
                <span
                  key={key}
                  className="inline-flex animate-pop items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[11px] font-extrabold text-[#176B4E] shadow-soft"
                >
                  {index + 1}. {ITEMS[key].label}
                </span>
              ))
            )}
          </div>
        </div>
      ) : null}

      <div className="mt-4 min-h-[74px]">
        <Feedback tone={message.tone} title={message.title}>
          {message.body}
        </Feedback>
      </div>

      <div className="mt-4 rounded-3xl bg-canvas p-4">
        <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-ink-soft/80">
          <Lightbulb size={14} aria-hidden="true" /> Кеңес
        </p>
        <p className="mt-1.5 text-xs font-semibold leading-relaxed text-ink-soft">
          Суреттерді топтап есте сақта: мысалы, «жемістер» мен «заттар». «Көмек» батырмасы келесі суретті
          көрсетеді — бұл да үйренудің бір жолы.
        </p>
      </div>
    </div>
  );
}
