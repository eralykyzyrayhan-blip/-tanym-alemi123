import { Apple, Banana, Book, Bus, Cat, Citrus, Search, Sparkles, Triangle, Square, Circle } from "lucide-react";
import type { GameSlug } from "@/lib/games";

function MiniScene({ variant }: { variant: "left" | "right" }) {
  return (
    <svg viewBox="0 0 120 86" className="h-full w-full" aria-hidden="true">
      <rect width="120" height="86" rx="14" fill="#EAF7FF" />
      {variant === "left" ? <circle cx="88" cy="22" r="11" fill="#F7B23B" /> : null}
      <g fill="#FFFFFF" opacity="0.9">
        <ellipse cx="34" cy="22" rx="16" ry="9" />
        <ellipse cx="47" cy="19" rx="12" ry="7" />
      </g>
      <ellipse cx="30" cy="90" rx="62" ry="34" fill="#C8EFDF" />
      <ellipse cx="104" cy="96" rx="60" ry="36" fill="#B4E6D3" />
      <rect x="26" y="48" width="9" height="24" rx="4" fill="#9A6B45" />
      <circle cx="30" cy="44" r="15" fill={variant === "left" ? "#37BFA7" : "#4CC9B1"} />
      <rect x="62" y="52" width="34" height="26" rx="6" fill="#FFFFFF" />
      <path d="M58 54 L79 34 L100 54 Z" fill={variant === "left" ? "#9271E8" : "#7455CF"} />
      <rect x="74" y="62" width="11" height="16" rx="3" fill="#26B6B2" />
      {variant === "left" ? <circle cx="57" cy="76" r="5" fill="#F272A8" /> : null}
    </svg>
  );
}

function CoverFrame({ children, soft }: { children: React.ReactNode; soft: string }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-3xl"
      style={{ backgroundImage: `radial-gradient(120% 120% at 15% 12%, #ffffff 0%, ${soft} 58%, ${soft} 100%)` }}
    >
      <div className="dotted-canvas absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="absolute -right-8 -top-8 size-28 rounded-full bg-white/60" aria-hidden="true" />
      <div className="absolute -bottom-10 -left-6 size-24 rounded-full bg-white/50" aria-hidden="true" />
      <div className="relative flex h-full items-center justify-center px-5 py-4">{children}</div>
    </div>
  );
}

export function GameCover({ slug }: { slug: GameSlug }) {
  if (slug === "zein") {
    return (
      <CoverFrame soft="#E5F7F6">
        <div className="flex items-center gap-2">
          <div className="w-[45%] rotate-[-6deg] rounded-2xl border-[3px] border-white bg-white p-1 shadow-soft">
            <MiniScene variant="left" />
          </div>
          <div className="w-[45%] rotate-[6deg] rounded-2xl border-[3px] border-white bg-white p-1 shadow-soft">
            <MiniScene variant="right" />
          </div>
        </div>
        <span className="absolute bottom-3 right-3 grid size-11 place-items-center rounded-2xl bg-teal text-white shadow-[0_14px_24px_-12px_rgba(38,182,178,0.9)]">
          <Search size={22} aria-hidden="true" />
        </span>
      </CoverFrame>
    );
  }

  if (slug === "zhad") {
    const tiles = [
      { Icon: Apple, color: "#EF6B6B", bg: "#FDECEC" },
      { Icon: Cat, color: "#9271E8", bg: "#F0E9FF" },
      { Icon: Book, color: "#26B6B2", bg: "#E5F7F6" },
    ];
    return (
      <CoverFrame soft="#F0E9FF">
        <div className="grid w-full max-w-[210px] grid-cols-2 gap-2">
          {tiles.map(({ Icon, color, bg }) => (
            <span
              key={color}
              className="grid aspect-square place-items-center rounded-2xl bg-white shadow-soft"
              style={{ backgroundColor: bg }}
            >
              <Icon size={26} color={color} aria-hidden="true" />
            </span>
          ))}
          <span className="grid aspect-square place-items-center rounded-2xl bg-grape text-white shadow-soft">
            <Sparkles size={24} aria-hidden="true" />
          </span>
        </div>
        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black text-grape-deep shadow-soft">
          есте сақта
        </span>
      </CoverFrame>
    );
  }

  if (slug === "logika") {
    const items = [
      { Icon: Apple, color: "#EF6B6B" },
      { Icon: Banana, color: "#E8A72B" },
      { Icon: Citrus, color: "#F08A3C" },
      { Icon: Bus, color: "#9271E8" },
    ];
    return (
      <CoverFrame soft="#E8EDF8">
        <div className="relative grid w-full max-w-[200px] grid-cols-2 gap-2">
          {items.map(({ Icon, color }, index) => (
            <span
              key={color}
              className={`grid aspect-square place-items-center rounded-2xl bg-white shadow-soft ${
                index === 3 ? "ring-2 ring-honey" : ""
              }`}
            >
              <Icon size={26} color={color} aria-hidden="true" />
            </span>
          ))}
          <span className="absolute -right-2 -top-2 grid size-9 place-items-center rounded-full bg-honey text-base font-black text-white shadow-[0_10px_20px_-10px_rgba(247,178,59,0.9)]">
            ?
          </span>
        </div>
      </CoverFrame>
    );
  }

  if (slug === "kolenke") {
    return (
      <CoverFrame soft="#EEE9FB">
        <div className="flex w-full items-center justify-center gap-1">
          <span className="grid size-16 place-items-center rounded-2xl bg-white shadow-soft">
            <Cat size={32} color="#9271E8" aria-hidden="true" />
          </span>
          <svg viewBox="0 0 40 20" className="h-5 w-10" aria-hidden="true">
            <path d="M2 16 C 12 2, 28 2, 38 16" fill="none" stroke="#7455CF" strokeWidth="2.5" strokeDasharray="3 4" strokeLinecap="round" />
          </svg>
          <span className="grid size-16 place-items-center rounded-2xl bg-ink/90 shadow-soft">
            <Cat size={32} color="#C9CEDA" aria-hidden="true" />
          </span>
        </div>
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black text-grape-deep shadow-soft">
          көлеңкені тап
        </span>
      </CoverFrame>
    );
  }

  return (
    <CoverFrame soft="#FDEBF3">
      <div className="relative flex w-full max-w-[220px] items-end justify-center gap-3">
        <div className="flex flex-col items-center">
          <span className="grid size-14 place-items-center rounded-t-2xl bg-grape/15">
            <Circle size={30} color="#9271E8" aria-hidden="true" />
          </span>
          <span className="h-8 w-16 rounded-b-xl bg-white shadow-soft" />
        </div>
        <div className="flex flex-col items-center">
          <span className="grid size-14 place-items-center rounded-t-2xl bg-teal/15">
            <Triangle size={30} color="#26B6B2" aria-hidden="true" />
          </span>
          <span className="h-10 w-16 rounded-b-xl bg-white shadow-soft" />
        </div>
        <div className="flex flex-col items-center">
          <span className="grid size-14 place-items-center rounded-t-2xl bg-berry/15">
            <Square size={28} color="#F272A8" aria-hidden="true" />
          </span>
          <span className="h-7 w-16 rounded-b-xl bg-white shadow-soft" />
        </div>
      </div>
    </CoverFrame>
  );
}
