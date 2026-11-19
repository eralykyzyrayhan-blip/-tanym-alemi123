"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Gamepad2, Pencil, Star, TrendingUp, User } from "lucide-react";
import { useProgress } from "@/lib/use-progress";
import { readPlayerName, savePlayerName } from "@/lib/progress";
import { ProgressBar, Stars, cx } from "@/components/ui";

function ProgressRing({ percent, hydrated }: { percent: number; hydrated: boolean }) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, percent) / 100) * circumference;
  return (
    <div className="relative grid size-32 place-items-center sm:size-36">
      <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id="ring-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#26B6B2" />
            <stop offset="100%" stopColor="#9271E8" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#E9EDF6" strokeWidth="11" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="url(#ring-gradient)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={hydrated ? offset : circumference}
          style={{ transition: "stroke-dashoffset 900ms cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="text-center">
        <p className="text-3xl font-black leading-none text-ink">{hydrated ? percent : 0}%</p>
        <p className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-ink-soft/80">прогресс</p>
      </div>
    </div>
  );
}

export function AchievementsPanel() {
  const { summary, hydrated } = useProgress();
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setName(readPlayerName());
  }, []);

  const displayName = name.trim();

  return (
    <section id="progress" aria-labelledby="progress-title" className="scroll-mt-24">
      <div className="relative overflow-hidden rounded-4xl border border-ink/6 bg-white p-5 shadow-soft sm:p-7 lg:p-8">
        <div
          className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-grapelight"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 left-1/3 size-52 rounded-full bg-skylight"
          aria-hidden="true"
        />

        <div className="relative grid gap-7 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="pill bg-grape/12 text-grape-deep">
                <Star size={14} className="fill-grape/30" aria-hidden="true" />
                Жетістіктер панелі
              </span>
              <span className="pill bg-mint/12 text-[#176B4E]">
                <CheckCircle2 size={14} aria-hidden="true" />
                Тіркелусіз
              </span>
            </div>

            <h2 id="progress-title" className="mt-3 text-2xl font-black tracking-tight text-ink sm:text-[1.75rem]">
              Сәлем{displayName ? `, ${displayName}` : ", танымды дос"}! 👋
            </h2>
            <p className="mt-1.5 max-w-lg text-sm font-semibold leading-relaxed text-ink-soft">
              Әр орындалған тапсырма жаңа жұлдыз әкеледі. Нәтижелерің осы құрылғыда автоматты түрде
              сақталады.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {editing ? (
                <form
                  className="flex items-center gap-2"
                  onSubmit={(event) => {
                    event.preventDefault();
                    savePlayerName(name);
                    setEditing(false);
                  }}
                >
                  <label htmlFor="player-name" className="sr-only">
                    Оқушының аты
                  </label>
                  <input
                    id="player-name"
                    autoFocus
                    value={name}
                    maxLength={40}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Атыңды жаз"
                    className="h-11 w-44 rounded-2xl border border-ink/12 bg-canvas px-4 text-sm font-bold text-ink outline-none focus:border-teal"
                  />
                  <button type="submit" className="btn btn-primary px-4 text-sm">
                    Сақтау
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="btn btn-ghost px-4 text-sm"
                >
                  <User size={17} aria-hidden="true" />
                  {displayName ? "Атымды өзгерту" : "Атымды жазу"}
                  <Pencil size={14} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 sm:justify-start lg:justify-center">
            <ProgressRing percent={summary.percent} hydrated={hydrated} />
            <div className="space-y-3">
              <div>
                <p className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wide text-ink-soft/80">
                  <Gamepad2 size={14} aria-hidden="true" />
                  Орындалған ойындар
                </p>
                <p className="text-2xl font-black leading-tight text-ink">
                  {hydrated ? summary.completions : 0}
                  <span className="ml-1 text-sm font-bold text-ink-soft">рет</span>
                </p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wide text-ink-soft/80">
                  <Star size={14} aria-hidden="true" />
                  Жиналған жұлдыздар
                </p>
                <p className="flex items-baseline gap-1.5 text-2xl font-black leading-tight text-ink">
                  {hydrated ? summary.stars : 0}
                  <span className="text-sm font-bold text-ink-soft">/ {summary.maxStars}</span>
                </p>
                <Stars value={Math.min(3, Math.ceil((summary.stars / summary.maxStars) * 3))} size={15} />
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-6 grid gap-4 rounded-3xl bg-canvas p-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <ProgressBar
            value={hydrated ? summary.stars : 0}
            max={summary.maxStars}
            label={`Жалпы прогресс · ${summary.completedLevels}/${summary.totalLevels} деңгей ашылды`}
          />
          <div className={cx("flex items-center gap-2 text-xs font-extrabold text-ink-soft")}>
            <TrendingUp size={16} className="text-teal" aria-hidden="true" />
            {summary.completedLevels >= summary.totalLevels
              ? "Барлық деңгей орындалды!"
              : `${summary.totalLevels - summary.completedLevels} деңгей қалды`}
          </div>
        </div>
      </div>
    </section>
  );
}
