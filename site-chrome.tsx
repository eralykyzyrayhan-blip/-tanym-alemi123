import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

export function Logo({ href = "/", compact = false }: { href?: string; compact?: boolean }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-3" aria-label="TANЫM — басты бет">
      <span className="relative grid size-11 place-items-center rounded-2xl bg-ink shadow-[0_12px_24px_-14px_rgba(23,44,83,0.8)] transition group-hover:-translate-y-0.5">
        <svg viewBox="0 0 40 40" className="size-9" aria-hidden="true">
          <defs>
            <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#5FE0D6" />
              <stop offset="100%" stopColor="#26B6B2" />
            </linearGradient>
          </defs>
          <circle cx="20" cy="20" r="11" fill="none" stroke="url(#logo-g)" strokeWidth="3" strokeDasharray="46 12" />
          <path d="M20 8.5l2.6 6.1 6.4 2.3-6.4 2.3-2.6 6.1-2.6-6.1-6.4-2.3 6.4-2.3z" fill="#FFFFFF" />
          <circle cx="30.5" cy="10.5" r="2.6" fill="#9271E8" />
        </svg>
        <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-honey ring-2 ring-white" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[1.35rem] font-black tracking-tight text-ink">
          TAN<span className="text-teal">ЫM</span>
        </span>
        {!compact ? (
          <span className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.22em] text-ink-soft/80">
            Таным әлемі
          </span>
        ) : null}
      </span>
    </Link>
  );
}

const NAV = [
  { href: "/#games", label: "Ойындар" },
  { href: "/#progress", label: "Жетістіктер" },
  { href: "/#guide", label: "Нұсқаулық" },
  { href: "/#platform", label: "Платформа" },
];

export function SiteHeader({ right }: { right?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/6 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Logo />
        <nav aria-label="Негізгі мәзір" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-3.5 py-2 text-sm font-bold text-ink-soft transition hover:bg-skylight hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {right}
          <Link href="/#games" className="btn btn-primary hidden px-5 py-2.5 text-sm sm:inline-flex">
            <Sparkles size={17} aria-hidden="true" />
            Ойынды бастау
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-ink/8 bg-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm font-semibold leading-relaxed text-ink-soft">
            «Цифрлық инклюзия» интерактивті жұмыс дәптері. Бастауыш сынып оқушыларының танымдық
            қабілеттерін ойын арқылы дамытуға арналған платформа.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-skylight px-3.5 py-2 text-xs font-extrabold text-ink">
            Тіркелусіз · тегін · барлық құрылғыда
          </p>
        </div>
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.16em] text-ink-soft">Ойындар</h3>
          <ul className="mt-3 space-y-2 text-sm font-bold text-ink-soft">
            <li>
              <Link className="transition hover:text-teal-deep" href="/oiyn/zein">
                Зейінді детектив
              </Link>
            </li>
            <li>
              <Link className="transition hover:text-teal-deep" href="/oiyn/zhad">
                Жад шебері
              </Link>
            </li>
            <li>
              <Link className="transition hover:text-teal-deep" href="/oiyn/logika">
                Логика әлемі
              </Link>
            </li>
            <li>
              <Link className="transition hover:text-teal-deep" href="/oiyn/kolenke">
                Көлеңке құпиясы
              </Link>
            </li>
            <li>
              <Link className="transition hover:text-teal-deep" href="/oiyn/pishin">
                Пішіндер қалашығы
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.16em] text-ink-soft">Пайдалы</h3>
          <ul className="mt-3 space-y-2 text-sm font-bold text-ink-soft">
            <li>
              <Link className="transition hover:text-teal-deep" href="/#guide">
                Қалай ойнау керек?
              </Link>
            </li>
            <li>
              <Link className="transition hover:text-teal-deep" href="/#progress">
                Менің жетістіктерім
              </Link>
            </li>
            <li>
              <Link className="transition hover:text-teal-deep" href="/#games">
                Барлық ойындар
              </Link>
            </li>
          </ul>
          <p className="mt-5 text-xs font-semibold leading-relaxed text-ink-soft/80">
            Нәтижелер құрылғыңда сақталады және платформа статистикасына қосылады.
          </p>
        </div>
      </div>
      <div className="border-t border-ink/8 py-5">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-4 text-xs font-bold text-ink-soft/80 sm:flex-row sm:px-6 lg:px-8">
          <p>© 2026 TANЫM — Таным әлемі</p>
          <p>Балаларға мейіріммен жасалған платформа</p>
        </div>
      </div>
    </footer>
  );
}
