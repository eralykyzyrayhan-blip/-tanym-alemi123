"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Layers, Lightbulb, Mic, MousePointerClick, Shapes, Sparkles } from "lucide-react";
import { Feedback, Pill, ProgressBar, cx } from "@/components/ui";
import { playSound, speak } from "@/lib/audio";
import type { GameCanvasProps } from "@/lib/game-types";

type ShapeKind = "circle" | "triangle" | "square" | "rectangle";

type ColorDef = { id: string; name: string; value: string; soft: string };

const SHAPES: Record<ShapeKind, { label: string; chip: string }> = {
  circle: { label: "Дөңгелек", chip: "Д-" },
  triangle: { label: "Үшбұрыш", chip: "Ү" },
  square: { label: "Шаршы", chip: "Ш" },
  rectangle: { label: "Тік төртбұрыш", chip: "Т" },
};

const COLORS: ColorDef[] = [
  { id: "teal", name: "көгілдір", value: "#26B6B2", soft: "#E5F7F6" },
  { id: "grape", name: "күлгін", value: "#9271E8", soft: "#F0E9FF" },
  { id: "pink", name: "қызғылт", value: "#F272A8", soft: "#FDEBF3" },
  { id: "amber", name: "сары", value: "#F7B23B", soft: "#FFF6E6" },
  { id: "green", name: "жасыл", value: "#35C08F", soft: "#E9FBF3" },
  { id: "blue", name: "көк", value: "#4F8EF7", soft: "#E8F0FE" },
];

const colorById = (id: string): ColorDef => COLORS.find((color) => color.id === id) ?? COLORS[0];

type Figure = { id: string; kind: ShapeKind; colorId: string };

const LEVEL_ONE_HOUSES: Array<{ kind: ShapeKind; colorId: string }> = [
  { kind: "circle", colorId: "teal" },
  { kind: "triangle", colorId: "pink" },
  { kind: "square", colorId: "grape" },
  { kind: "rectangle", colorId: "amber" },
];

const LEVEL_ONE_FIGURES: Figure[] = LEVEL_ONE_HOUSES.flatMap((house) => [
  { id: `l1-${house.kind}-a`, kind: house.kind, colorId: house.colorId },
  { id: `l1-${house.kind}-b`, kind: house.kind, colorId: house.colorId },
]);

const LEVEL_TWO_FIGURES: Figure[] = [
  { id: "l2-c1", kind: "circle", colorId: "green" },
  { id: "l2-c2", kind: "circle", colorId: "blue" },
  { id: "l2-t1", kind: "triangle", colorId: "teal" },
  { id: "l2-t2", kind: "triangle", colorId: "grape" },
  { id: "l2-s1", kind: "square", colorId: "pink" },
  { id: "l2-s2", kind: "square", colorId: "amber" },
  { id: "l2-r1", kind: "rectangle", colorId: "blue" },
  { id: "l2-r2", kind: "rectangle", colorId: "green" },
];

type Slot = { id: string; kind: ShapeKind; colorId: string; left: number; top: number; width: number };

const MOSAIC_SLOTS: Slot[] = [
  { id: "roof", kind: "triangle", colorId: "pink", left: 35, top: 8, width: 30 },
  { id: "body", kind: "square", colorId: "grape", left: 37, top: 32, width: 26 },
  { id: "door", kind: "rectangle", colorId: "amber", left: 46, top: 55, width: 9 },
  { id: "sun", kind: "circle", colorId: "amber", left: 76, top: 8, width: 15 },
  { id: "window", kind: "square", colorId: "teal", left: 55, top: 39, width: 7 },
  { id: "tree", kind: "circle", colorId: "green", left: 12, top: 46, width: 17 },
];

const MOSAIC_FIGURES: Figure[] = [
  ...MOSAIC_SLOTS.map((slot) => ({ id: `m-${slot.id}`, kind: slot.kind, colorId: slot.colorId })),
  { id: "m-extra-1", kind: "triangle", colorId: "teal" },
  { id: "m-extra-2", kind: "circle", colorId: "pink" },
  { id: "m-extra-3", kind: "rectangle", colorId: "blue" },
];

const PATTERN_QUESTION = {
  sequence: ["circle", "square", "circle", "square"] as ShapeKind[],
  options: ["circle", "triangle", "square", "rectangle"] as ShapeKind[],
  correct: "circle" as ShapeKind,
  explanation: "Реті қайталанып тұр: дөңгелек, шаршы, дөңгелек, шаршы. Сондықтан келесі пішін — дөңгелек.",
};

type Message = { tone: "success" | "try" | "info" | "celebrate"; title: string; body?: string };

function ShapePiece({
  kind,
  colorId,
  size = 60,
  faded = false,
  fluid = false,
  className,
}: {
  kind: ShapeKind;
  colorId: string;
  size?: number;
  faded?: boolean;
  fluid?: boolean;
  className?: string;
}) {
  const color = colorById(colorId);
  const base: React.CSSProperties = {
    width: fluid ? "100%" : size,
    height: fluid ? "100%" : kind === "rectangle" ? size * 0.68 : size,
    background: faded ? color.soft : `linear-gradient(145deg, ${color.value} 0%, ${shade(color.value)} 100%)`,
    opacity: faded ? 0.85 : 1,
    border: faded ? `3px dashed ${color.value}` : "3px solid rgba(255,255,255,0.85)",
    boxShadow: faded ? "none" : `0 14px 24px -16px ${color.value}`,
    clipPath: kind === "triangle" ? "polygon(50% 2%, 100% 100%, 0 100%)" : undefined,
    borderRadius:
      kind === "circle" ? "999px" : kind === "square" ? "22%" : kind === "rectangle" ? "16%" : "6px",
  };
  return (
    <span
      className={cx("inline-block shrink-0", className)}
      style={base}
      aria-hidden="true"
    />
  );
}

function shade(hex: string): string {
  const value = hex.replace("#", "");
  const number = Number.parseInt(value, 16);
  const red = Math.max(0, ((number >> 16) & 255) - 34);
  const green = Math.max(0, ((number >> 8) & 255) - 28);
  const blue = Math.max(0, (number & 255) - 20);
  return `rgb(${red}, ${green}, ${blue})`;
}

function CityFinale({ houses }: { houses: Array<{ kind: ShapeKind; colorId: string; placed: number }> }) {
  return (
    <div className="overflow-hidden rounded-4xl bg-gradient-to-b from-skylight via-white to-[#E9FBF3] p-4">
      <svg viewBox="0 0 520 190" className="w-full" role="img" aria-label="Құрастырылған түрлі-түсті қалашық">
        <circle cx="458" cy="42" r="24" fill="#F7B23B" />
        <circle cx="458" cy="42" r="15" fill="#FFD887" />
        <g fill="#FFFFFF" opacity="0.95">
          <ellipse cx="90" cy="40" rx="30" ry="16" />
          <ellipse cx="116" cy="34" rx="20" ry="12" />
          <ellipse cx="250" cy="30" rx="22" ry="12" />
        </g>
        <ellipse cx="260" cy="196" rx="280" ry="46" fill="#CFEFE1" />
        {houses.map((house, index) => {
          const x = 56 + index * 112;
          const color = colorById(house.colorId);
          return (
            <g key={house.kind}>
              <rect x={x} y={106} width={78} height={62} rx={10} fill="#FFFFFF" stroke="#E4EAF6" strokeWidth="2" />
              <path d={`M${x - 8} 108 L${x + 39} 72 L${x + 86} 108 Z`} fill={color.value} />
              <rect x={x + 30} y={136} width={20} height={32} rx={6} fill={color.value} opacity={0.85} />
              <rect x={x + 9} y={118} width={16} height={14} rx={4} fill="#FFD887" />
              <rect x={x + 55} y={118} width={16} height={14} rx={4} fill="#FFD887" />
              <g transform={`translate(${x + 39} 100)`}>
                {house.kind === "circle" ? <circle r={10} fill="#172C53" opacity={0.85} /> : null}
                {house.kind === "triangle" ? <polygon points="0,-11 11,9 -11,9" fill="#172C53" opacity={0.85} /> : null}
                {house.kind === "square" ? <rect x={-9} y={-9} width={18} height={18} rx={3} fill="#172C53" opacity={0.85} /> : null}
                {house.kind === "rectangle" ? <rect x={-11} y={-7} width={22} height={14} rx={3} fill="#172C53" opacity={0.85} /> : null}
              </g>
              <circle cx={x + 65} cy={92} r={6} fill={color.value} opacity={0.5} />
              <circle cx={x + 13} cy={92} r={6} fill={color.value} opacity={0.5} />
              <text x={x + 39} y={186} textAnchor="middle" fontSize="11" fontWeight="800" fill="#44557A">
                {SHAPES[house.kind].label}
              </text>
            </g>
          );
        })}
        <g>
          <rect x="20" y="128" width="8" height="34" rx="4" fill="#A06B43" />
          <circle cx="24" cy="120" r="20" fill="#3FB89B" />
          <rect x="492" y="128" width="8" height="34" rx="4" fill="#A06B43" />
          <circle cx="496" cy="120" r="20" fill="#3FB89B" />
        </g>
        <path d="M40 176 Q 260 148 480 176" fill="none" stroke="#F5E0B4" strokeWidth="14" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function ShapesGame({ level, soundOn, helpRequest, onFinish }: GameCanvasProps) {
  const houses = LEVEL_ONE_HOUSES;
  const isMosaic = level === 3;
  const figures = useMemo(
    () => (level === 1 ? LEVEL_ONE_FIGURES : level === 2 ? LEVEL_TWO_FIGURES : MOSAIC_FIGURES),
    [level],
  );

  const [selected, setSelected] = useState<Figure | null>(null);
  const [placed, setPlaced] = useState<Record<string, ShapeKind[]>>({});
  const [placedFigures, setPlacedFigures] = useState<string[]>([]);
  const [mosaic, setMosaic] = useState<Record<string, Figure>>({});
  const [wrong, setWrong] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [stage, setStage] = useState<"place" | "puzzle" | "done">("place");
  const [patternAnswer, setPatternAnswer] = useState<ShapeKind | null>(null);
  const [patternDone, setPatternDone] = useState(false);
  const [hintHouse, setHintHouse] = useState<ShapeKind | null>(null);
  const [hintSlot, setHintSlot] = useState<string | null>(null);
  const [eliminated, setEliminated] = useState<ShapeKind | null>(null);
  const [message, setMessage] = useState<Message>({
    tone: "info",
    title: isMosaic ? "Мозаиканы құрастыр" : "Пішінді өз үйіне орналастыр",
    body: isMosaic
      ? "Төмендегі пішінді жоғарыдағы бос орынға сүйреп апар немесе пішінді таңдап, орынды бас."
      : "Пішінді таңдап, тиісті үйді бас. Немесе пішінді үйге сүйреп апар.",
  });

  const correctRef = useRef(0);
  const wrongRef = useRef(0);
  const finishedRef = useRef(false);
  const handledHelpRef = useRef(0);
  const totalTasks = isMosaic ? MOSAIC_SLOTS.length + 1 : figures.length;
  const doneCount = isMosaic ? Object.keys(mosaic).length : placedFigures.length;
  const totalPlacements = isMosaic ? MOSAIC_SLOTS.length : figures.length;

  const addCorrect = (amount = 1) => {
    correctRef.current += amount;
    setCorrect(correctRef.current);
  };
  const addWrong = (amount = 1) => {
    wrongRef.current += amount;
    setWrong(wrongRef.current);
  };

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    speak("Жарайсың! Қалашық дайын!", soundOn);
    onFinish({ correct: correctRef.current, wrong: wrongRef.current, total: totalTasks });
  };

  const handleHouseClick = (kind: ShapeKind, dropped?: Figure) => {
    if (stage !== "place") return;
    const figure = dropped ?? selected;
    if (!figure) {
      setMessage({
        tone: "try",
        title: "Алдымен пішінді таңда",
        body: "Төмендегі пішіндерден біреуін бас, сосын үйді таңда.",
      });
      return;
    }
    if (level === 1 && figure.colorId !== houses.find((house) => house.kind === kind)?.colorId) {
      addWrong(1);
      playSound("wrong", soundOn);
      setMessage({
        tone: "try",
        title: `${SHAPES[kind].label} үйіне басқа түс керек`,
        body: `Бұл үй ${colorById(houses.find((house) => house.kind === kind)?.colorId ?? "teal").name} түсті. Түсі сәйкес пішінді таңда.`,
      });
      return;
    }
    if (figure.kind === kind) {
      setPlaced((current) => ({ ...current, [kind]: [...(current[kind] ?? []), figure.kind] }));
      setPlacedFigures((current) => [...current, figure.id]);
      setSelected(null);
      addCorrect(1);
      playSound("correct", soundOn);
      const totalPlaced = placedFigures.length + 1;
      setMessage({
        tone: totalPlaced === totalPlacements ? "celebrate" : "success",
        title:
          totalPlaced === totalPlacements
            ? "Қалашық дайын! Барлық пішін өз үйінде."
            : `Дұрыс! «${SHAPES[kind].label}» өз үйіне орналасты.`,
        body: totalPlaced === totalPlacements ? "Қалашықты тамашала!" : "Келесі пішінді таңда.",
      });
      if (totalPlaced === totalPlacements) {
        setStage("done");
        playSound("win", soundOn);
      }
    } else {
      addWrong(1);
      playSound("wrong", soundOn);
      setMessage({
        tone: "try",
        title: "Бұл басқа пішіннің үйі",
        body: `${SHAPES[kind].label} үйіне тек ${SHAPES[kind].label.toLowerCase()} пішіні келеді. Қайта көр.`,
      });
    }
  };

  const handleMosaicSlot = (slot: Slot, dropped?: Figure) => {
    if (stage !== "place" || mosaic[slot.id]) return;
    const figure = dropped ?? selected;
    if (!figure) {
      setMessage({
        tone: "try",
        title: "Алдымен пішінді таңда",
        body: "Төмендегі пішіндерден қажеттісін бас, сосын бос орынды таңда.",
      });
      return;
    }
    if (figure.kind === slot.kind && figure.colorId === slot.colorId) {
      const updated = { ...mosaic, [slot.id]: figure };
      setMosaic(updated);
      setPlacedFigures((current) => [...current, figure.id]);
      setSelected(null);
      addCorrect(1);
      playSound("correct", soundOn);
      const filled = Object.keys(updated).length;
      setMessage({
        tone: filled === MOSAIC_SLOTS.length ? "celebrate" : "success",
        title: filled === MOSAIC_SLOTS.length ? "Мозаика құрастырылды!" : "Дұрыс орналастырдың!",
        body:
          filled === MOSAIC_SLOTS.length
            ? "Енді жетіспейтін пішінді тап."
            : `Тағы ${MOSAIC_SLOTS.length - filled} орын қалды.`,
      });
      if (filled === MOSAIC_SLOTS.length) {
        playSound("win", soundOn);
        window.setTimeout(() => setStage("puzzle"), 700);
      }
    } else if (figure.kind === slot.kind) {
      addWrong(1);
      playSound("wrong", soundOn);
      setMessage({
        tone: "try",
        title: "Пішіні дұрыс, түсі басқа",
        body: `Бұл орынға ${colorById(slot.colorId).name} түсті ${SHAPES[slot.kind].label.toLowerCase()} керек.`,
      });
    } else {
      addWrong(1);
      playSound("wrong", soundOn);
      setMessage({
        tone: "try",
        title: "Бұл орынға басқа пішін керек",
        body: `Мұнда ${SHAPES[slot.kind].label.toLowerCase()} пішінінің орны. Пішінді мұқият салыстыр.`,
      });
    }
  };

  const handlePatternAnswer = (kind: ShapeKind) => {
    if (patternDone || eliminated === kind) return;
    if (kind === PATTERN_QUESTION.correct) {
      setPatternDone(true);
      setPatternAnswer(kind);
      addCorrect(1);
      playSound("win", soundOn);
      setMessage({
        tone: "celebrate",
        title: "Дұрыс! Реттілікті аштың.",
        body: PATTERN_QUESTION.explanation,
      });
      speak(`Дұрыс. ${PATTERN_QUESTION.explanation}`, soundOn);
      setStage("done");
    } else {
      addWrong(1);
      playSound("wrong", soundOn);
      setMessage({
        tone: "try",
        title: "Реттілікке тағы қара",
        body: "Пішіндер қалай кезектесіп тұр? Бірінші екеуін салыстырып көр.",
      });
    }
  };

  useEffect(() => {
    if (helpRequest === 0 || handledHelpRef.current === helpRequest) return;
    handledHelpRef.current = helpRequest;
    if (stage === "place") {
      if (isMosaic) {
        const emptySlot = MOSAIC_SLOTS.find((slot) => !mosaic[slot.id]);
        if (emptySlot) {
          setHintSlot(emptySlot.id);
          setMessage({
            tone: "info",
            title: "Көмек: келесі орын",
            body: `Сары белгіленген орынға ${colorById(emptySlot.colorId).name} түсті ${SHAPES[emptySlot.kind].label.toLowerCase()} керек.`,
          });
          const timer = window.setTimeout(() => setHintSlot(null), 5500);
          return () => window.clearTimeout(timer);
        }
      } else {
        const candidate = selected ?? figures.find((figure) => !placedFigures.includes(figure.id));
        if (candidate) {
          setSelected(candidate);
          setHintHouse(candidate.kind);
          setMessage({
            tone: "info",
            title: `Көмек: «${SHAPES[candidate.kind].label}» пішіні`,
            body: `Оны ${SHAPES[candidate.kind].label.toLowerCase()} үйіне орналастыр. Үй сары шеңбермен белгіленді.`,
          });
          const timer = window.setTimeout(() => setHintHouse(null), 5500);
          return () => window.clearTimeout(timer);
        }
      }
    }
    if (stage === "puzzle" && !patternDone) {
      const wrongOption = PATTERN_QUESTION.options.find(
        (option) => option !== PATTERN_QUESTION.correct && option !== eliminated,
      );
      if (wrongOption) {
        setEliminated(wrongOption);
        setMessage({
          tone: "info",
          title: "Көмек: бір қате нұсқа алынып тасталды",
          body: "Қалған нұсқаларды салыстыр. Реттілік қайталанып тұр.",
        });
      }
    }
    return undefined;
  }, [helpRequest, stage, isMosaic, mosaic, selected, figures, placedFigures, patternDone, eliminated]);

  const placedForCity = houses.map((house) => ({
    ...house,
    placed: (placed[house.kind] ?? []).length,
  }));

  const trayFigures = figures.filter((figure) =>
    isMosaic ? !placedFigures.includes(figure.id) : !placedFigures.includes(figure.id),
  );

  return (
    <div className="surface p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Pill tone="teal">
            <Shapes size={14} aria-hidden="true" />
            Пішіндер қалашығы
          </Pill>
          <h2 className="mt-2 text-xl font-black tracking-tight text-ink sm:text-2xl">
            {isMosaic ? "Мозаика: Күншуақ үй" : "Пішіндерді үйлеріне орналастыр"}
          </h2>
          <p className="text-xs font-semibold text-ink-soft">
            {isMosaic
              ? "Бос орындарға қажет пішіндерді орналастырып, суретті толықтыр."
              : "Пішінді таңдап, сәйкес үйге сүйреп апар немесе үйді бас."}
          </p>
        </div>
        <div className="min-w-[180px] flex-1 sm:max-w-xs">
          <div className="flex items-center justify-between text-xs font-extrabold text-ink-soft">
            <span>Орналастырылды</span>
            <span className="text-ink">
              {doneCount} / {totalPlacements}
            </span>
          </div>
          <ProgressBar className="mt-1.5" value={doneCount} max={totalPlacements} from="#F272A8" to="#26B6B2" label="" />
          <p className="mt-1 text-right text-[11px] font-bold text-ink-soft/80">
            Дұрыс: {correct} · Қате: {wrong}
          </p>
        </div>
      </div>

      {stage === "place" && !isMosaic ? (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {houses.map((house) => {
              const color = colorById(house.colorId);
              const contents = placed[house.kind] ?? [];
              return (
                <button
                  key={house.kind}
                  type="button"
                  onClick={() => handleHouseClick(house.kind)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    const id = event.dataTransfer.getData("text/plain");
                    const dropped = trayFigures.find((item) => item.id === id);
                    if (dropped) handleHouseClick(house.kind, dropped);
                  }}
                  aria-label={`${SHAPES[house.kind].label} үйі`}
                  className={cx(
                    "group relative flex flex-col items-center rounded-3xl border-2 bg-white p-3 transition hover:-translate-y-0.5",
                    hintHouse === house.kind ? "animate-pulse ring-2 ring-honey ring-offset-2" : "",
                  )}
                  style={{ borderColor: `${color.value}55` }}
                >
                  <span
                    className="grid h-16 w-full place-items-center rounded-2xl"
                    style={{ background: `linear-gradient(160deg, ${color.soft}, #FFFFFF)` }}
                  >
                    <ShapePiece kind={house.kind} colorId={house.colorId} size={44} />
                  </span>
                  <span className="mt-2 text-xs font-black text-ink">{SHAPES[house.kind].label}</span>
                  <span className="text-[10px] font-bold text-ink-soft">үйі</span>
                  {level === 1 ? (
                    <span
                      className="mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold"
                      style={{ backgroundColor: color.soft, color: shade(color.value) }}
                    >
                      {color.name} түс
                    </span>
                  ) : (
                    <span className="mt-1 rounded-full bg-ink/5 px-2 py-0.5 text-[10px] font-extrabold text-ink-soft">
                      кез келген түс
                    </span>
                  )}
                  <span className="mt-2 flex h-4 items-center gap-1">
                    {contents.map((_, index) => (
                      <span
                        key={index}
                        className="size-2 rounded-full"
                        style={{ backgroundColor: color.value }}
                      />
                    ))}
                    {contents.length === 0 ? (
                      <span className="text-[10px] font-bold text-ink-soft/60">бос</span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 rounded-4xl bg-canvas p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-ink-soft/80">
                <Layers size={14} aria-hidden="true" /> Пішіндер
              </p>
              <p className="text-[11px] font-bold text-ink-soft">Қалғаны: {trayFigures.length}</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {trayFigures.map((figure) => {
                const isSelected = selected?.id === figure.id;
                const color = colorById(figure.colorId);
                return (
                  <div
                    key={figure.id}
                    draggable
                    onDragStart={(event) => {
                      setSelected(figure);
                      event.dataTransfer.setData("text/plain", figure.id);
                    }}
                    className={cx(
                      "relative flex flex-col items-center gap-1 rounded-2xl border-2 bg-white p-2 transition",
                      isSelected ? "border-grape shadow-soft" : "border-transparent hover:border-grape/40",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelected(isSelected ? null : figure);
                        playSound("click", soundOn);
                      }}
                      className="flex w-full flex-col items-center gap-1"
                      aria-pressed={isSelected}
                      aria-label={`${SHAPES[figure.kind].label}, ${color.name} түс`}
                    >
                      <span className="grid h-14 w-full place-items-center">
                        <ShapePiece kind={figure.kind} colorId={figure.colorId} size={48} />
                      </span>
                      <span className="text-[10px] font-extrabold text-ink sm:text-[11px]">
                        {SHAPES[figure.kind].label}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => speak(`${SHAPES[figure.kind].label}. ${color.name} түс.`, soundOn)}
                      className="absolute right-1 top-1 grid size-6 place-items-center rounded-lg bg-ink/5 text-ink-soft transition hover:bg-skylight hover:text-teal-deep"
                      aria-label={`${SHAPES[figure.kind].label} атауын тыңдау`}
                      title="Атауын тыңдау"
                    >
                      <Mic size={12} aria-hidden="true" />
                    </button>
                  </div>
                );
              })}
              {trayFigures.length === 0 ? (
                <p className="col-span-full py-4 text-center text-sm font-bold text-ink-soft">
                  Барлық пішін орналастырылды!
                </p>
              ) : null}
            </div>
          </div>
        </>
      ) : null}

      {stage === "place" && isMosaic ? (
        <>
          <div className="relative mt-4 aspect-4/3 w-full overflow-hidden rounded-4xl bg-gradient-to-b from-skylight via-white to-[#E9FBF3]">
            <div className="absolute inset-0 dotted-canvas opacity-30" aria-hidden="true" />
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black text-ink-soft shadow-soft">
              Мозаика: Күншуақ үй
            </span>
            {MOSAIC_SLOTS.map((slot) => {
              const filled = mosaic[slot.id];
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => handleMosaicSlot(slot)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    const id = event.dataTransfer.getData("text/plain");
                    const dropped = trayFigures.find((item) => item.id === id);
                    if (dropped) handleMosaicSlot(slot, dropped);
                  }}
                  aria-label={`${SHAPES[slot.kind].label} орны`}
                  className={cx(
                    "absolute grid place-items-center rounded-2xl transition",
                    !filled ? "hover:bg-white/60" : "",
                    hintSlot === slot.id ? "animate-pulse ring-2 ring-honey ring-offset-2" : "",
                  )}
                  style={{
                    left: `${slot.left}%`,
                    top: `${slot.top}%`,
                    width: `${slot.width}%`,
                    aspectRatio: slot.kind === "rectangle" ? "1.5" : "1",
                  }}
                >
                  {filled ? (
                    <ShapePiece kind={slot.kind} colorId={slot.colorId} fluid className="h-full w-full animate-pop" />
                  ) : (
                    <ShapePiece kind={slot.kind} colorId={slot.colorId} faded fluid className="h-full w-full" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 rounded-4xl bg-canvas p-4">
            <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-ink-soft/80">
              <Layers size={14} aria-hidden="true" /> Пішіндер себебінен таңда
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2.5 sm:grid-cols-5">
              {trayFigures.map((figure) => {
                const color = colorById(figure.colorId);
                const isSelected = selected?.id === figure.id;
                return (
                  <div key={figure.id} className="relative">
                    <button
                      type="button"
                      draggable
                      onDragStart={(event) => {
                        setSelected(figure);
                        event.dataTransfer.setData("text/plain", figure.id);
                      }}
                      onClick={() => {
                        setSelected(isSelected ? null : figure);
                        playSound("click", soundOn);
                      }}
                      aria-pressed={isSelected}
                      aria-label={`${SHAPES[figure.kind].label}, ${color.name} түс`}
                      className={cx(
                        "flex w-full flex-col items-center gap-1 rounded-2xl border-2 bg-white p-2 transition",
                        isSelected ? "border-grape shadow-soft" : "border-transparent hover:border-grape/40",
                      )}
                    >
                      <span className="grid h-12 w-full place-items-center">
                        <ShapePiece kind={figure.kind} colorId={figure.colorId} size={40} />
                      </span>
                      <span className="text-[10px] font-extrabold text-ink">{SHAPES[figure.kind].label}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => speak(`${SHAPES[figure.kind].label}. ${color.name} түс.`, soundOn)}
                      className="absolute right-1 top-1 grid size-5 place-items-center rounded-md bg-ink/5 text-ink-soft"
                      aria-label="Атауын тыңдау"
                    >
                      <Mic size={11} aria-hidden="true" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : null}

      {stage === "puzzle" ? (
        <div className="mt-4 animate-rise rounded-4xl bg-grapelight p-4 sm:p-5">
          <p className="flex items-center gap-2 text-sm font-black text-ink">
            <Sparkles size={17} aria-hidden="true" /> Жетіспейтін пішінді тап
          </p>
          <p className="mt-1 text-xs font-semibold text-ink-soft">Реттілікке қара: қай пішін жетіспейді?</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {PATTERN_QUESTION.sequence.map((kind, index) => (
              <span key={`${kind}-${index}`} className="grid size-12 place-items-center rounded-xl bg-white">
                <ShapePiece kind={kind} colorId={index % 2 === 0 ? "teal" : "grape"} size={30} />
              </span>
            ))}
            <span className="grid size-12 place-items-center rounded-xl border-2 border-dashed border-grape/50 bg-white text-2xl font-black text-grape">
              ?
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {PATTERN_QUESTION.options.map((kind) => {
              const isEliminated = eliminated === kind;
              const isCorrect = patternDone && kind === PATTERN_QUESTION.correct;
              return (
                <button
                  key={kind}
                  type="button"
                  onClick={() => handlePatternAnswer(kind)}
                  disabled={isEliminated || patternDone}
                  className={cx(
                    "flex flex-col items-center gap-1 rounded-2xl border-2 bg-white p-2 text-xs font-extrabold transition",
                    isCorrect
                      ? "border-mint bg-[#E9FBF3] text-[#176B4E]"
                      : isEliminated
                        ? "border-ink/8 text-ink-soft/40 line-through"
                        : "border-transparent text-ink hover:border-grape/45",
                  )}
                >
                  <ShapePiece kind={kind} colorId={kind === "circle" ? "teal" : "grape"} size={34} />
                  {SHAPES[kind].label}
                </button>
              );
            })}
          </div>
          {patternAnswer ? <p className="mt-2 text-xs font-bold text-ink-soft">{PATTERN_QUESTION.explanation}</p> : null}
        </div>
      ) : null}

      {stage === "done" ? (
        <div className="mt-4 animate-rise">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-3xl bg-[#E9FBF3] px-4 py-3">
            <p className="flex items-center gap-2 text-sm font-black text-[#176B4E]">
              <CheckCircle2 size={18} aria-hidden="true" /> Қалашық толық құрастырылды!
            </p>
            <button type="button" onClick={finish} className="btn btn-primary px-5 py-2.5 text-sm">
              Нәтижені көру
            </button>
          </div>
          <CityFinale houses={placedForCity} />
        </div>
      ) : null}

      <div className="mt-4 min-h-[74px]">
        <Feedback tone={message.tone} title={message.title}>
          {message.body}
        </Feedback>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-3xl bg-skylight p-4">
          <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-ink">
            <MousePointerClick size={14} aria-hidden="true" /> Қалай басқару керек
          </p>
          <p className="mt-1.5 text-xs font-semibold leading-relaxed text-ink-soft">
            Пішінді таңдап, тиісті орынды бас. Немесе пішінді сүйреп апар. Қате таңдасаң, элемент
            бастапқы орнында қалады.
          </p>
        </div>
        <div className="rounded-3xl bg-[#E9FBF3] p-4">
          <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-ink">
            <Lightbulb size={14} aria-hidden="true" /> Кеңес
          </p>
          <p className="mt-1.5 text-xs font-semibold leading-relaxed text-ink-soft">
            Пішіннің атауын тыңдау үшін динамик белгісін бас. Үшбұрыштың — 3 бұрышы, шаршының — 4 тең қабырғасы
            бар.
          </p>
        </div>
      </div>
    </div>
  );
}
