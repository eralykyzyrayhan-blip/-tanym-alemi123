import type { ReactNode } from "react";
import { CheckCircle2, Info, Lightbulb, Sparkles, Star } from "lucide-react";

export function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export function Stars({
  value,
  size = 18,
  className,
  muted = true,
}: {
  value: number;
  size?: number;
  className?: string;
  muted?: boolean;
}) {
  return (
    <span className={cx("inline-flex items-center gap-0.5", className)} aria-label={`${value} жұлдыз`}>
      {[1, 2, 3].map((star) => {
        const active = star <= value;
        return (
          <Star
            key={star}
            size={size}
            strokeWidth={2}
            className={active ? "fill-honey text-honey" : muted ? "text-ink/20" : "text-ink/15"}
            aria-hidden="true"
          />
        );
      })}
    </span>
  );
}

export function ProgressBar({
  value,
  max,
  from = "#26B6B2",
  to = "#9271E8",
  label,
  className,
}: {
  value: number;
  max: number;
  from?: string;
  to?: string;
  label?: string;
  className?: string;
}) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className={className}>
      {label ? (
        <div className="mb-2 flex items-center justify-between text-xs font-bold text-ink-soft">
          <span>{label}</span>
          <span className="text-ink">{percent}%</span>
        </div>
      ) : null}
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-ink/10"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label ?? "Прогресс"}
      >
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{ width: `${percent}%`, backgroundImage: `linear-gradient(90deg, ${from}, ${to})` }}
        />
      </div>
    </div>
  );
}

export function Pill({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "teal" | "grape" | "honey" | "ink" | "white";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-ink/5 text-ink-soft",
    teal: "bg-teal/12 text-teal-deep",
    grape: "bg-grape/12 text-grape-deep",
    honey: "bg-honey/16 text-[#9a6608]",
    ink: "bg-ink text-white",
    white: "bg-white/90 text-ink",
  };
  return <span className={cx("pill", tones[tone], className)}>{children}</span>;
}

export type FeedbackTone = "success" | "try" | "info" | "celebrate";

export function Feedback({
  tone = "success",
  title,
  children,
  className,
}: {
  tone?: FeedbackTone;
  title: string;
  children?: ReactNode;
  className?: string;
}) {
  const config = {
    success: {
      wrapper: "bg-[#E9FBF3] border-[#B8EBD6] text-[#176B4E]",
      icon: <CheckCircle2 size={22} className="shrink-0" aria-hidden="true" />,
    },
    try: {
      wrapper: "bg-[#FFF6E6] border-[#F7DEAC] text-[#8A5A08]",
      icon: <Lightbulb size={22} className="shrink-0" aria-hidden="true" />,
    },
    info: {
      wrapper: "bg-skylight border-[#C6E8FB] text-ink",
      icon: <Info size={22} className="shrink-0" aria-hidden="true" />,
    },
    celebrate: {
      wrapper: "bg-grapelight border-[#DCCCFF] text-grape-deep",
      icon: <Sparkles size={22} className="shrink-0" aria-hidden="true" />,
    },
  }[tone];

  return (
    <div
      className={cx(
        "flex items-start gap-3 rounded-3xl border px-4 py-3 text-sm font-semibold animate-rise",
        config.wrapper,
        className,
      )}
      role="status"
      aria-live="polite"
    >
      {config.icon}
      <div>
        <p className="font-extrabold leading-snug">{title}</p>
        {children ? <div className="mt-0.5 text-[13px] font-semibold opacity-90">{children}</div> : null}
      </div>
    </div>
  );
}

export function StatTile({
  icon,
  label,
  value,
  hint,
  accent = "#26B6B2",
  soft = "#E5F7F6",
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
  accent?: string;
  soft?: string;
}) {
  return (
    <div className="surface flex items-center gap-3.5 p-4 sm:p-5">
      <span
        className="grid size-12 shrink-0 place-items-center rounded-2xl"
        style={{ backgroundColor: soft, color: accent }}
        aria-hidden="true"
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-extrabold uppercase tracking-wide text-ink-soft/80">{label}</p>
        <p className="truncate text-2xl font-black leading-tight text-ink">{value}</p>
        {hint ? <p className="truncate text-xs font-semibold text-ink-soft">{hint}</p> : null}
      </div>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  action?: ReactNode;
}) {
  return (
    <div
      className={cx(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
      )}
    >
      <div className={cx("max-w-2xl", align === "center" && "mx-auto text-center")}>
        <Pill tone="grape" className="mb-3">
          <Sparkles size={14} aria-hidden="true" />
          {eyebrow}
        </Pill>
        <h2 className="text-2xl font-black leading-tight tracking-tight text-ink sm:text-3xl md:text-[2.1rem]">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-sm font-semibold leading-relaxed text-ink-soft sm:text-base">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
