export function HeroArt() {
  return (
    <div className="relative">
      <div className="absolute -left-6 top-10 hidden animate-float rounded-3xl bg-white px-4 py-3 shadow-card lg:block">
        <p className="text-[10px] font-black uppercase tracking-wider text-ink-soft">Бүгінгі мақсат</p>
        <p className="mt-1 text-sm font-black text-ink">1 ойын · 3 жұлдыз</p>
        <div className="mt-2 flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`h-1.5 w-8 rounded-full ${i === 0 ? "bg-teal" : "bg-ink/12"}`}
            />
          ))}
        </div>
      </div>
      <div className="absolute -right-4 bottom-16 z-10 hidden animate-float-slow rounded-3xl bg-white px-4 py-3 shadow-card sm:block">
        <p className="text-[10px] font-black uppercase tracking-wider text-ink-soft">Танымдық бағыт</p>
        <p className="mt-1 text-sm font-black text-grape-deep">5 ойын · 15 деңгей</p>
      </div>

      <svg
        viewBox="0 0 520 440"
        role="img"
        aria-label="Кітап үстінде отырған күлімсіреген үкі және геометриялық пішіндер"
        className="w-full drop-shadow-[0_30px_50px_rgba(23,44,83,0.18)]"
      >
        <defs>
          <linearGradient id="hero-sky" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#EDF8FF" />
            <stop offset="52%" stopColor="#E5F5FF" />
            <stop offset="100%" stopColor="#F0E9FF" />
          </linearGradient>
          <linearGradient id="hero-hill-a" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#CFF3E6" />
            <stop offset="100%" stopColor="#AEE7D7" />
          </linearGradient>
          <linearGradient id="hero-hill-b" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#BDEBDE" />
            <stop offset="100%" stopColor="#93DCC9" />
          </linearGradient>
          <linearGradient id="hero-owl" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A98CF2" />
            <stop offset="100%" stopColor="#8763E0" />
          </linearGradient>
          <clipPath id="hero-clip">
            <rect x="0" y="0" width="520" height="440" rx="44" />
          </clipPath>
        </defs>

        <g clipPath="url(#hero-clip)">
          <rect width="520" height="440" fill="url(#hero-sky)" />
          <circle cx="430" cy="120" r="96" fill="#FFFFFF" opacity="0.45" />
          <circle cx="90" cy="300" r="88" fill="#FFFFFF" opacity="0.4" />

          <circle cx="424" cy="70" r="32" fill="#F7B23B" />
          <circle cx="424" cy="70" r="21" fill="#FFD887" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 424 + Math.cos(rad) * 40;
            const y1 = 70 + Math.sin(rad) * 40;
            const x2 = 424 + Math.cos(rad) * 50;
            const y2 = 70 + Math.sin(rad) * 50;
            return (
              <line
                key={angle}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#F7B23B"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.55"
              />
            );
          })}

          <g fill="#FFFFFF" opacity="0.92">
            <ellipse cx="112" cy="78" rx="34" ry="21" />
            <ellipse cx="142" cy="70" rx="26" ry="18" />
            <ellipse cx="84" cy="86" rx="22" ry="14" />
          </g>
          <g fill="#FFFFFF" opacity="0.8">
            <ellipse cx="286" cy="46" rx="26" ry="16" />
            <ellipse cx="310" cy="40" rx="19" ry="13" />
          </g>

          <path
            d="M40 210 C 120 130, 220 150, 268 208"
            fill="none"
            stroke="#26B6B2"
            strokeWidth="2.5"
            strokeDasharray="3 9"
            strokeLinecap="round"
            opacity="0.55"
          />
          <path
            d="M300 150 C 370 96, 452 140, 478 214"
            fill="none"
            stroke="#9271E8"
            strokeWidth="2.5"
            strokeDasharray="3 9"
            strokeLinecap="round"
            opacity="0.5"
          />

          <g transform="rotate(-12 88 190)">
            <rect x="54" y="156" width="70" height="70" rx="22" fill="#FFFFFF" />
            <circle cx="89" cy="191" r="21" fill="#26B6B2" />
            <circle cx="89" cy="191" r="9" fill="#E5F7F6" />
          </g>
          <g transform="rotate(10 430 176)">
            <rect x="396" y="142" width="70" height="70" rx="22" fill="#FFFFFF" />
            <path d="M431 160 L449 194 L413 194 Z" fill="#9271E8" />
          </g>
          <g transform="rotate(-8 402 288)">
            <rect x="368" y="254" width="68" height="68" rx="22" fill="#FFFFFF" />
            <rect x="386" y="272" width="32" height="32" rx="8" fill="#F272A8" />
          </g>
          <g>
            <circle cx="122" cy="330" r="24" fill="#F7B23B" />
            <path
              d="M122 314l4.4 9.6 10.4 1.6-7.6 7.4 1.8 10.6-9-5-9 5 1.8-10.6-7.6-7.4 10.4-1.6z"
              fill="#FFFFFF"
            />
          </g>
          <g fill="#9271E8" opacity="0.55">
            <circle cx="300" cy="112" r="7" />
            <circle cx="486" cy="330" r="9" />
            <circle cx="64" cy="344" r="5" />
          </g>
          <g fill="#26B6B2" opacity="0.5">
            <circle cx="356" cy="86" r="6" />
            <circle cx="176" cy="122" r="5" />
          </g>
          <g fill="#F7B23B" opacity="0.75">
            <circle cx="212" cy="96" r="5.5" />
            <circle cx="466" cy="138" r="6" />
            <circle cx="48" cy="130" r="4.5" />
          </g>

          <ellipse cx="270" cy="430" rx="250" ry="120" fill="url(#hero-hill-a)" />
          <ellipse cx="70" cy="446" rx="200" ry="110" fill="url(#hero-hill-b)" />
          <ellipse cx="470" cy="458" rx="210" ry="118" fill="url(#hero-hill-b)" opacity="0.9" />

          <g>
            <path d="M168 330 L268 262 L368 330 Z" fill="#FFFFFF" opacity="0.9" />
          </g>

          <ellipse cx="270" cy="404" rx="112" ry="18" fill="#172C53" opacity="0.1" />

          <g>
            <rect x="170" y="392" width="200" height="22" rx="11" fill="#26B6B2" />
            <rect x="186" y="374" width="168" height="20" rx="10" fill="#F7B23B" />
            <rect x="202" y="358" width="136" height="18" rx="9" fill="#FF8A7A" />
            <g stroke="#172C53" strokeWidth="2" opacity="0.18">
              <line x1="242" y1="359" x2="242" y2="375" />
              <line x1="298" y1="359" x2="298" y2="375" />
              <line x1="220" y1="375" x2="220" y2="393" />
              <line x1="320" y1="375" x2="320" y2="393" />
            </g>
          </g>

          <g transform="translate(0 -14)">
            <ellipse cx="270" cy="318" rx="68" ry="66" fill="url(#hero-owl)" />
            <path d="M206 268 L200 226 L238 246 Z" fill="#7455CF" />
            <path d="M334 268 L340 226 L302 246 Z" fill="#7455CF" />
            <ellipse cx="270" cy="336" rx="42" ry="40" fill="#F0E9FF" />
            <ellipse cx="204" cy="316" rx="16" ry="32" fill="#7D59DA" transform="rotate(-16 204 316)" />
            <ellipse cx="336" cy="316" rx="16" ry="32" fill="#7D59DA" transform="rotate(16 336 316)" />
            <circle cx="246" cy="298" r="23" fill="#FFFFFF" />
            <circle cx="294" cy="298" r="23" fill="#FFFFFF" />
            <circle cx="250" cy="301" r="10" fill="#172C53" />
            <circle cx="298" cy="301" r="10" fill="#172C53" />
            <circle cx="253" cy="297" r="3.4" fill="#FFFFFF" />
            <circle cx="301" cy="297" r="3.4" fill="#FFFFFF" />
            <path d="M270 316 L282 328 L258 328 Z" fill="#F7B23B" />
            <circle cx="224" cy="318" r="7" fill="#F272A8" opacity="0.55" />
            <circle cx="316" cy="318" r="7" fill="#F272A8" opacity="0.55" />
            <path d="M262 336 q8 8 16 0" fill="none" stroke="#7455CF" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="252" cy="378" rx="11" ry="6" fill="#F7B23B" />
            <ellipse cx="288" cy="378" rx="11" ry="6" fill="#F7B23B" />
            <path d="M338 244 l6 -14 l6 14 l14 6 l-14 6 l-6 14 l-6 -14 l-14 -6 z" fill="#FFFFFF" opacity="0.9" />
          </g>
        </g>
      </svg>
    </div>
  );
}
