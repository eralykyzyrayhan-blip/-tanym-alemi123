"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Brain, CheckCircle2, HelpCircle, Lightbulb, Sparkles } from "lucide-react";
import { Feedback, Pill, ProgressBar, cx } from "@/components/ui";
import { playSound, speak } from "@/lib/audio";
import type { GameCanvasProps } from "@/lib/game-types";
import { LOGIC_LEVELS } from "@/lib/logic-data";
import { ITEMS, ItemTile, type ItemKey } from "@/components/games/item-icon";

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

export function LogicGame({ level, soundOn, helpRequest, onFinish }: GameCanvasProps) {
  const questions = LOGIC_LEVELS[level];
  const [index, setIndex] = useState(0);
  const question = questions[index];
  const [oddPicked, setOddPicked] = useState<number | null>(null);
  const [reasonDone, setReasonDone] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [message, setMessage] = useState<Message>({
    tone: "info",
    title: "Төрт суретті салыстыр",
    body: "Үшеуі бір топқа жатады, біреуі артық. Артық затты таңда.",
  });
  const [hintItem, setHintItem] = useState<ItemKey | null>(null);
  const [eliminatedReason, setEliminatedReason] = useState<string | null>(null);

  const correctRef = useRef(0);
  const wrongRef = useRef(0);
  const finishedRef = useRef(false);
  const handledHelpRef = useRef(0);

  const reasonOptions = useMemo(
    () => shuffle([question.correctReason, ...question.wrongReasons]),
    [question],
  );

  const totalTasks = questions.length * 2;

  const addCorrect = (amount = 1) => {
    correctRef.current += amount;
    setCorrect(correctRef.current);
  };
  const addWrong = (amount = 1) => {
    wrongRef.current += amount;
    setWrong(wrongRef.current);
  };

  const resetQuestion = () => {
    setOddPicked(null);
    setReasonDone(false);
    setHintItem(null);
    setEliminatedReason(null);
  };

  const handleItemPick = (itemIndex: number) => {
    if (reasonDone) return;
    if (oddPicked !== null) {
      if (oddPicked !== itemIndex) {
        setMessage({
          tone: "info",
          title: "Алдымен «Неліктен?» сұрағына жауап бер",
          body: "Себебін таңдаған соң келесі тапсырмаға өтеміз.",
        });
      }
      return;
    }
    if (itemIndex === question.oddIndex) {
      setOddPicked(itemIndex);
      addCorrect(1);
      playSound("correct", soundOn);
      setMessage({
        tone: "success",
        title: "Дұрыс! Енді таңдауыңды түсіндір",
        body: "Неліктен бұл зат артық? Ең дұрыс себепті таңда.",
      });
      speak("Дұрыс! Енді неліктен екенін таңда.", soundOn);
    } else {
      addWrong(1);
      playSound("wrong", soundOn);
      setMessage({
        tone: "try",
        title: "Жақынсың! Тағы бір рет ойлан",
        body: "Қалған үш заттың ортақ қасиеті неде? Сол топқа жатпайтын затты тап.",
      });
    }
  };

  const handleReasonPick = (reason: string) => {
    if (reasonDone || eliminatedReason === reason) return;
    if (reason === question.correctReason) {
      addCorrect(1);
      setReasonDone(true);
      playSound("win", soundOn);
      setMessage({
        tone: "celebrate",
        title: "Керемет түсіндірдің!",
        body: question.explanation,
      });
      speak(`Дұрыс. ${question.explanation}`, soundOn);
    } else {
      addWrong(1);
      playSound("wrong", soundOn);
      setMessage({
        tone: "try",
        title: "Бұл себеп емес. Тағы ойлан",
        body: "Үш заттың ортақ белгісін есіңе түсір. Қателесуге болады!",
      });
    }
  };

  const goNext = () => {
    if (index + 1 >= questions.length) {
      if (finishedRef.current) return;
      finishedRef.current = true;
      onFinish({ correct: correctRef.current, wrong: wrongRef.current, total: totalTasks });
      return;
    }
    setIndex((value) => value + 1);
    resetQuestion();
    setMessage({
      tone: "info",
      title: "Келесі тапсырма",
      body: "Төрт суреттің ішінен артығын тап.",
    });
    playSound("click", soundOn);
  };

  useEffect(() => {
    if (helpRequest === 0 || handledHelpRef.current === helpRequest) return;
    handledHelpRef.current = helpRequest;
    if (oddPicked === null) {
      const candidates = question.items.filter((_, itemIndex) => itemIndex !== question.oddIndex);
      const picked = candidates[Math.floor(Math.random() * candidates.length)];
      setHintItem(picked);
      setMessage({
        tone: "info",
        title: "Көмек: осы зат топқа жатады",
        body: `${ITEMS[picked].label} — қалған екі затпен бір топта. Артық затты табу оңайырақ болды.`,
      });
      const timer = window.setTimeout(() => setHintItem(null), 5000);
      return () => window.clearTimeout(timer);
    }
    if (!reasonDone) {
      const options = reasonOptions.filter((reason) => reason !== question.correctReason);
      const removed = options[Math.floor(Math.random() * options.length)];
      setEliminatedReason(removed);
      setMessage({
        tone: "info",
        title: "Көмек: бір қате себеп алынып тасталды",
        body: "Енді екі нұсқа қалды. Ортақ қасиетті ойла.",
      });
    }
    return undefined;
  }, [helpRequest, oddPicked, question, reasonDone, reasonOptions]);

  const progress = index * 2 + (oddPicked !== null ? 1 : 0) + (reasonDone ? 1 : 0);

  return (
    <div className="surface p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Pill tone="neutral">
            <Brain size={14} aria-hidden="true" />
            Артығын тап және түсіндір
          </Pill>
          <h2 className="mt-2 text-xl font-black tracking-tight text-ink sm:text-2xl">
            {index + 1}-тапсырма / {questions.length}
          </h2>
          <p className="text-xs font-semibold text-ink-soft">{question.prompt}</p>
        </div>
        <div className="min-w-[180px] flex-1 sm:max-w-xs">
          <div className="flex items-center justify-between text-xs font-extrabold text-ink-soft">
            <span>Прогресс</span>
            <span className="text-ink">
              {progress} / {totalTasks}
            </span>
          </div>
          <ProgressBar className="mt-1.5" value={progress} max={totalTasks} from="#172C53" to="#26B6B2" label="" />
          <p className="mt-1 text-right text-[11px] font-bold text-ink-soft/80">
            Дұрыс: {correct} · Қате: {wrong}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-4xl bg-canvas p-4 sm:p-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {question.items.map((key, itemIndex) => {
            const isPicked = oddPicked === itemIndex;
            const isOdd = itemIndex === question.oddIndex;
            const tileState = isPicked && isOdd ? "correct" : "idle";
            return (
              <ItemTile
                key={`${question.id}-${key}`}
                itemKey={key}
                size={76}
                state={tileState}
                onClick={() => handleItemPick(itemIndex)}
                disabled={oddPicked !== null || reasonDone}
                selected={isPicked}
                className={hintItem === key ? "animate-pulse ring-2 ring-honey ring-offset-2" : undefined}
              />
            );
          })}
        </div>
      </div>

      {oddPicked !== null ? (
        <div className="mt-4 animate-rise rounded-4xl bg-grapelight p-4 sm:p-5">
          <p className="flex items-center gap-2 text-sm font-black text-ink">
            <HelpCircle size={18} aria-hidden="true" /> Неліктен?
          </p>
          <p className="mt-1 text-xs font-semibold text-ink-soft">
            Таңдауыңды дәлелдейтін ең дұрыс себепті белгіле.
          </p>
          <div className="mt-3 space-y-2">
            {reasonOptions.map((reason) => {
              const isCorrect = reason === question.correctReason;
              const isEliminated = eliminatedReason === reason;
              const showCorrect = reasonDone && isCorrect;
              return (
                <button
                  key={reason}
                  type="button"
                  onClick={() => handleReasonPick(reason)}
                  disabled={reasonDone || isEliminated}
                  className={cx(
                    "flex w-full items-start gap-3 rounded-2xl border-2 bg-white px-4 py-3 text-left text-sm font-bold transition",
                    showCorrect
                      ? "border-mint bg-[#E9FBF3] text-[#176B4E]"
                      : isEliminated
                        ? "border-ink/8 text-ink-soft/50 line-through"
                        : "border-transparent text-ink hover:border-grape/45 hover:bg-white",
                  )}
                >
                  <span
                    className={cx(
                      "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-black",
                      showCorrect ? "bg-mint text-white" : "bg-ink/6 text-ink-soft",
                    )}
                  >
                    {showCorrect ? "✓" : "?"}
                  </span>
                  {reason}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="mt-4 min-h-[74px]">
        <Feedback tone={message.tone} title={message.title}>
          {message.body}
        </Feedback>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[11px] font-extrabold text-ink-soft">
          <Lightbulb size={14} className="text-grape" aria-hidden="true" />
          Көмек: бір дұрыс емес нұсқа алынып тасталады
        </p>
        {reasonDone ? (
          <button type="button" onClick={goNext} className="btn btn-primary px-6 py-3.5 text-base">
            {index + 1 >= questions.length ? (
              <>
                <CheckCircle2 size={18} aria-hidden="true" />
                Нәтижені көру
              </>
            ) : (
              <>
                Келесі тапсырма
                <ArrowRight size={18} aria-hidden="true" />
              </>
            )}
          </button>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full bg-skylight px-3.5 py-2 text-[11px] font-extrabold text-ink">
            <Sparkles size={13} aria-hidden="true" />
            Себебін тапқанда жұлдызға жақындайсың
          </span>
        )}
      </div>
    </div>
  );
}
