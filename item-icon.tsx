import type { ComponentType, CSSProperties } from "react";
import {
  Apple,
  Backpack,
  Banana,
  Bike,
  Bird,
  Bus,
  Cake,
  Car,
  Cat,
  Cherry,
  Clock,
  Dog,
  Fish,
  Flower2,
  Gift,
  Glasses,
  Grape,
  Key,
  Leaf,
  Pencil,
  Plane,
  Rabbit,
  Scissors,
  Ship,
  Snowflake,
  Squirrel,
  Star,
  Sun,
  TrainFront,
  Turtle,
  Umbrella,
  BookOpen,
} from "lucide-react";

type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  "aria-hidden"?: boolean;
};

function BallIcon({ size = 24, color = "currentColor", strokeWidth = 2, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" {...rest}>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} />
      <path
        d="M12 3c-3.6 2.4-3.6 15.6 0 18M3.3 9c5.7 1.1 11.7-3.4 13.6-6M3.3 15c5.7-1.1 11.7 3.4 13.6 6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

function PearIcon({ size = 24, color = "currentColor", strokeWidth = 2, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" {...rest}>
      <path
        d="M12.4 4.2c1.9 3 1 4.1 2.6 6.1 2.4 3 3.4 8.9-1.4 10.4-3.6 1.1-7.3-2-6.4-5.9.6-2.6 2.9-3.6 3.6-5.6.7-2 0-3.6 1.6-5Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <path d="M12.6 4.4c.2-1.1 1.1-1.9 2.3-2.1" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

function SpoonIcon({ size = 24, color = "currentColor", strokeWidth = 2, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" {...rest}>
      <ellipse cx="12" cy="6.6" rx="4.2" ry="4.6" stroke={color} strokeWidth={strokeWidth} />
      <path d="M12 11.2V21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

function ForkIcon({ size = 24, color = "currentColor", strokeWidth = 2, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" {...rest}>
      <path d="M12 11v10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <path
        d="M8 3v5.5a4 4 0 0 0 8 0V3M8 3v3M12 3v3M16 3v3"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlateIcon({ size = 24, color = "currentColor", strokeWidth = 2, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" {...rest}>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} />
      <circle cx="12" cy="12" r="4.6" stroke={color} strokeWidth={strokeWidth} />
    </svg>
  );
}

export type ItemKey =
  | "apple"
  | "pear"
  | "ball"
  | "book"
  | "cat"
  | "umbrella"
  | "flower"
  | "bag"
  | "scissors"
  | "cherry"
  | "banana"
  | "grape"
  | "bus"
  | "car"
  | "plane"
  | "train"
  | "ship"
  | "bike"
  | "dog"
  | "rabbit"
  | "bird"
  | "fish"
  | "turtle"
  | "squirrel"
  | "pencil"
  | "spoon"
  | "fork"
  | "plate"
  | "glasses"
  | "snowflake"
  | "sun"
  | "leaf"
  | "gift"
  | "key"
  | "clock"
  | "cake"
  | "star";

export type ItemDefinition = {
  label: string;
  color: string;
  Icon: ComponentType<IconProps>;
};

export const ITEMS: Record<ItemKey, ItemDefinition> = {
  apple: { label: "Алма", color: "#EF6B6B", Icon: Apple },
  pear: { label: "Алмұрт", color: "#9CBF3B", Icon: PearIcon },
  ball: { label: "Доп", color: "#F7B23B", Icon: BallIcon },
  book: { label: "Кітап", color: "#26B6B2", Icon: BookOpen },
  cat: { label: "Мысық", color: "#9271E8", Icon: Cat },
  umbrella: { label: "Қолшатыр", color: "#7455CF", Icon: Umbrella },
  flower: { label: "Гүл", color: "#F272A8", Icon: Flower2 },
  bag: { label: "Сөмке", color: "#E8834A", Icon: Backpack },
  scissors: { label: "Қайшы", color: "#4F6FA8", Icon: Scissors },
  cherry: { label: "Шие", color: "#D6455D", Icon: Cherry },
  banana: { label: "Банан", color: "#E8A72B", Icon: Banana },
  grape: { label: "Жүзім", color: "#9271E8", Icon: Grape },
  bus: { label: "Автобус", color: "#7455CF", Icon: Bus },
  car: { label: "Көлік", color: "#4F6FA8", Icon: Car },
  plane: { label: "Ұшақ", color: "#26B6B2", Icon: Plane },
  train: { label: "Пойыз", color: "#D4528B", Icon: TrainFront },
  ship: { label: "Кеме", color: "#2D7DB5", Icon: Ship },
  bike: { label: "Велосипед", color: "#189A97", Icon: Bike },
  dog: { label: "Ит", color: "#C08A57", Icon: Dog },
  rabbit: { label: "Қоян", color: "#9271E8", Icon: Rabbit },
  bird: { label: "Құс", color: "#F08A3C", Icon: Bird },
  fish: { label: "Балық", color: "#2D9DB5", Icon: Fish },
  turtle: { label: "Тасбақа", color: "#4A9E6B", Icon: Turtle },
  squirrel: { label: "Тиін", color: "#C98A11", Icon: Squirrel },
  pencil: { label: "Қарындаш", color: "#F0A62B", Icon: Pencil },
  spoon: { label: "Қасық", color: "#26B6B2", Icon: SpoonIcon },
  fork: { label: "Шанышқы", color: "#7455CF", Icon: ForkIcon },
  plate: { label: "Тәрелке", color: "#4F6FA8", Icon: PlateIcon },
  glasses: { label: "Көзілдірік", color: "#9271E8", Icon: Glasses },
  snowflake: { label: "Қар", color: "#2D9DB5", Icon: Snowflake },
  sun: { label: "Күн", color: "#E8A72B", Icon: Sun },
  leaf: { label: "Жапырақ", color: "#4A9E6B", Icon: Leaf },
  gift: { label: "Сыйлық", color: "#D4528B", Icon: Gift },
  key: { label: "Кілт", color: "#C98A11", Icon: Key },
  clock: { label: "Сағат", color: "#4F6FA8", Icon: Clock },
  cake: { label: "Торт", color: "#F272A8", Icon: Cake },
  star: { label: "Жұлдыз", color: "#F7B23B", Icon: Star },
};

export function tint(color: string, percent = 14): string {
  return `color-mix(in srgb, ${color} ${percent}%, white)`;
}

export function ItemGlyph({
  itemKey,
  size = 34,
  color,
  className,
}: {
  itemKey: ItemKey;
  size?: number;
  color?: string;
  className?: string;
}) {
  const item = ITEMS[itemKey];
  const Icon = item.Icon;
  return <Icon size={size} color={color ?? item.color} strokeWidth={1.9} className={className} aria-hidden />;
}

export function ItemTile({
  itemKey,
  size = 68,
  selected = false,
  state = "idle",
  showLabel = true,
  onClick,
  disabled = false,
  badge,
  className,
  style,
  draggable,
  onDragStart,
  onDragEnd,
  onPointerDown,
}: {
  itemKey: ItemKey;
  size?: number;
  selected?: boolean;
  state?: "idle" | "correct" | "wrong" | "muted" | "reveal";
  showLabel?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  badge?: string;
  className?: string;
  style?: CSSProperties;
  draggable?: boolean;
  onDragStart?: (event: React.DragEvent<HTMLButtonElement>) => void;
  onDragEnd?: () => void;
  onPointerDown?: (event: React.PointerEvent<HTMLButtonElement>) => void;
}) {
  const item = ITEMS[itemKey];
  const border =
    state === "correct" || state === "reveal"
      ? "#35C08F"
      : state === "wrong"
        ? "#F7B23B"
        : selected
          ? "#9271E8"
          : "rgba(23,44,83,0.08)";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onPointerDown={onPointerDown}
      aria-pressed={selected}
      className={`group relative flex w-full min-w-0 flex-col items-center justify-center gap-1 rounded-3xl border-2 bg-white p-2 transition duration-200 ${
        disabled ? "cursor-default opacity-70" : "cursor-pointer hover:-translate-y-0.5 hover:shadow-soft"
      } ${className ?? ""}`}
      style={{
        borderColor: border,
        boxShadow: selected ? "0 0 0 4px rgba(146,113,232,0.15)" : undefined,
        ...style,
      }}
    >
      <span
        className="grid place-items-center rounded-2xl"
        style={{
          width: size,
          height: size,
          backgroundColor:
            state === "muted" ? "#F1F3F9" : state === "reveal" ? "#E9FBF3" : tint(item.color, 14),
          color: item.color,
        }}
      >
        <ItemGlyph itemKey={itemKey} size={Math.round(size * 0.58)} />
      </span>
      {showLabel ? (
        <span className="line-clamp-1 max-w-full px-1 text-[11px] font-extrabold text-ink sm:text-xs">
          {item.label}
        </span>
      ) : null}
      {badge ? (
        <span className="absolute -left-1.5 -top-1.5 grid size-6 place-items-center rounded-full bg-ink text-[11px] font-black text-white shadow-soft">
          {badge}
        </span>
      ) : null}
      {state === "correct" ? (
        <span className="absolute -right-1.5 -top-1.5 grid size-6 place-items-center rounded-full bg-mint text-[12px] font-black text-white shadow-soft">
          ✓
        </span>
      ) : null}
      {state === "wrong" ? (
        <span className="absolute -right-1.5 -top-1.5 grid size-6 place-items-center rounded-full bg-honey text-[12px] font-black text-white shadow-soft">
          !
        </span>
      ) : null}
      {state === "reveal" ? (
        <span className="absolute -right-1.5 -top-1.5 grid size-6 place-items-center rounded-full border-2 border-mint bg-white text-[10px] font-black text-[#176B4E] shadow-soft">
          ★
        </span>
      ) : null}
    </button>
  );
}
