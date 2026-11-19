"use client";

import Link from "next/link";
import { ArrowRight, Clock3, Layers3, Play } from "lucide-react";
import { GAMES } from "@/lib/games";
import { useProgress } from "@/lib/use-progress";
import { GameCover } from "@/components/game-cover";
import { Stars } from "@/components/ui";

export function GameGrid() {
  const { state, hydrated } = useProgress();

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {GAMES.map((game, index) => {
        const levelStars = [1, 2, 3].map((level) => state.levels[`${game.slug}:${level}`]?.stars ?? 0);
        const total = levelStars.reduce((sum, value) => sum + value, 0);
        const started = hydrated && levelStars.some((value) => value > 0);

        return (
          <Link
            key={game.slug}
            href={`/oiyn/${game.slug}`}
            className="group card-hover surface flex flex-col overflow-hidden p-3 focus-visible:outline-2"
            style={{ animationDelay: `${index * 60}ms` }}
            aria-label={`${game.title} — ойынды бастау`}
          >
            <div className="relative aspect-16/10 w-full">
              <GameCover slug={game.slug} />
              <span className="absolute left-5 top-5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-black text-ink shadow-soft">
                {game.number}
              </span>
              {started ? (
                <span className="absolute right-5 top-5 rounded-full bg-mint px-2.5 py-1 text-[11px] font-black text-white shadow-soft">
                  басталды
                </span>
              ) : null}
            </div>

            <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
              <div className="flex items-center justify-between gap-2">
                <span
                  className="pill"
                  style={{ backgroundColor: game.soft, color: game.deep }}
                >
                  <span className="size-1.5 rounded-full" style={{ backgroundColor: game.accent }} />
                  {game.direction}
                </span>
                <Stars value={Math.min(3, Math.ceil(total / 3))} size={15} />
              </div>

              <h3 className="mt-3 text-xl font-black tracking-tight text-ink">{game.title}</h3>
              <p className="mt-1.5 line-clamp-3 flex-1 text-sm font-semibold leading-relaxed text-ink-soft">
                {game.description}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-extrabold text-ink-soft/85">
                <span className="inline-flex items-center gap-1">
                  <Layers3 size={13} aria-hidden="true" /> 3 деңгей
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock3 size={13} aria-hidden="true" /> {game.duration}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Play size={13} aria-hidden="true" /> {total}/9 жұлдыз
                </span>
              </div>

              <span className="btn btn-primary mt-4 w-full px-5 py-3 text-sm">
                {started ? "Ойынды жалғастыру" : "Ойынды бастау"}
                <ArrowRight
                  size={17}
                  className="transition group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </div>
          </Link>
        );
      })}

      <div className="relative flex flex-col justify-between overflow-hidden rounded-4xl bg-ink p-6 text-white shadow-card">
        <div className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-teal/25" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 size-32 rounded-full bg-grape/30" aria-hidden="true" />
        <div className="relative">
          <span className="pill bg-white/12 text-white">Күннің кеңесі</span>
          <h3 className="mt-4 text-2xl font-black leading-tight">
            Күнде 10 минут ойын — танымды дамытудың ең жеңіл жолы.
          </h3>
          <p className="mt-3 text-sm font-semibold leading-relaxed text-white/75">
            Бір ойыннан баста. Қателесуге болады! Біз жазаламаймыз, керісінше — қолдаймыз.
          </p>
        </div>
        <div className="relative mt-6 space-y-2">
          {[
            "Уақыт шектеусіз, өз қарқыныңмен ойна",
            "«Көмек» батырмасы әрқашан қасыңда",
            "Нәтиже құрылғыда сақталады",
          ].map((item) => (
            <p key={item} className="flex items-center gap-2 text-[13px] font-bold text-white/85">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-teal/25 text-[11px]">✓</span>
              {item}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
