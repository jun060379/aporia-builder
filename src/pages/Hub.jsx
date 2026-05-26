import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Hub() {
  const { user, profile, isAdmin, signOut, loading } = useAuth();
  const displayName = profile?.display_name || user?.email || '';

  return (
    <div className="min-h-screen bg-[#070a1a] text-slate-200 antialiased selection:bg-amber-300/30 selection:text-amber-100">
      <GlobalBackdrop />

      <SiteHeader
        user={user}
        isAdmin={isAdmin}
        displayName={displayName}
        loading={loading}
        signOut={signOut}
      />

      <HeroStage />

      <NewsTicker />

      <main className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <PortalGates user={user} isAdmin={isAdmin} />
        <ChroniclePanel />
      </main>

      <SiteFooter />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 * Global backdrop — 깊은 밤하늘 + 성운 + 별
 * ───────────────────────────────────────────────────────────── */
function GlobalBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(1200px 600px at 50% -10%, rgba(99,102,241,0.35), transparent 60%), radial-gradient(900px 500px at 90% 30%, rgba(168,85,247,0.22), transparent 60%), radial-gradient(700px 500px at 0% 70%, rgba(34,211,238,0.16), transparent 60%), linear-gradient(180deg, #070a1a 0%, #0a0e26 40%, #080a1d 100%)',
        }}
      />
      {/* star field */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            'radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.75) 50%, transparent 51%), radial-gradient(1px 1px at 22% 80%, rgba(255,255,255,0.55) 50%, transparent 51%), radial-gradient(1px 1px at 33% 35%, rgba(255,255,255,0.7) 50%, transparent 51%), radial-gradient(1px 1px at 47% 60%, rgba(255,255,255,0.5) 50%, transparent 51%), radial-gradient(1.4px 1.4px at 55% 15%, rgba(253,230,138,0.6) 50%, transparent 51%), radial-gradient(1px 1px at 70% 75%, rgba(255,255,255,0.6) 50%, transparent 51%), radial-gradient(1px 1px at 82% 40%, rgba(255,255,255,0.5) 50%, transparent 51%), radial-gradient(1.4px 1.4px at 90% 65%, rgba(192,219,255,0.7) 50%, transparent 51%)',
        }}
      />
      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)]" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 * Header — 게임 런처식 다크 네비
 * ───────────────────────────────────────────────────────────── */
function SiteHeader({ user, isAdmin, displayName, loading, signOut }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);

  const navItems = [
    { to: '/', label: 'HOME', kr: '홈' },
    { to: '/builder', label: 'BUILDER', kr: '캐릭터' },
    { to: '/enemy', label: 'ENEMY', kr: '에너미' },
    { to: '/my', label: 'RECORD', kr: '내 신청' },
    { to: '/admin', label: 'COUNCIL', kr: '관리자', adminHighlight: true },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-indigo-500/15 bg-[#070a1a]/85 backdrop-blur-md">
      {/* gold hairline */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />

      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 h-16">
        <Link to="/" className="group inline-flex items-center gap-2.5">
          <RuneMark />
          <div className="leading-none">
            <div className="font-serif text-[19px] tracking-[0.22em] text-amber-100 group-hover:text-amber-50 transition">
              APORIA
            </div>
            <div className="mt-0.5 text-[9px] tracking-[0.42em] text-indigo-300/70">
              URBAN FANTASY PORTAL
            </div>
          </div>
        </Link>

        {/* desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={[
                'group relative rounded-md px-3 py-2 text-[12px] tracking-[0.22em] transition',
                item.adminHighlight && isAdmin
                  ? 'text-amber-200 hover:text-amber-100'
                  : 'text-indigo-100/70 hover:text-white',
              ].join(' ')}
            >
              <span>{item.label}</span>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-2 -bottom-0.5 h-px scale-x-0 bg-gradient-to-r from-transparent via-amber-300/70 to-transparent transition-transform duration-300 group-hover:scale-x-100"
              />
            </Link>
          ))}
        </nav>

        {/* auth (desktop) */}
        <div className="hidden md:flex items-center gap-2">
          {loading ? (
            <span className="text-[11px] text-indigo-200/60">…</span>
          ) : user ? (
            <>
              <span className="max-w-[160px] truncate text-[11px] text-indigo-100/80">
                {displayName}
              </span>
              {isAdmin && (
                <span className="rounded-sm border border-amber-300/40 bg-amber-400/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-[0.18em] text-amber-200">
                  COUNCIL
                </span>
              )}
              <button
                onClick={signOut}
                className="rounded-md border border-indigo-400/20 bg-white/5 px-3 py-1.5 text-[11px] tracking-[0.18em] text-indigo-100/90 hover:bg-white/10"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md border border-amber-300/40 bg-gradient-to-b from-amber-400/20 to-amber-500/10 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.22em] text-amber-100 hover:from-amber-400/30 hover:to-amber-500/20"
              >
                ENTER
              </Link>
              <Link
                to="/signup"
                className="rounded-md border border-indigo-400/30 bg-white/5 px-3 py-1.5 text-[11px] tracking-[0.18em] text-indigo-100/90 hover:bg-white/10"
              >
                JOIN
              </Link>
            </>
          )}
        </div>

        {/* mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden rounded-md border border-indigo-400/25 bg-white/5 px-2.5 py-1.5 text-[11px] tracking-[0.2em] text-indigo-100"
          aria-expanded={open}
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
        >
          {open ? 'CLOSE' : 'MENU'}
        </button>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="md:hidden border-t border-indigo-400/15 bg-[#080b1f]/95 backdrop-blur">
          <nav className="mx-auto flex w-full max-w-6xl flex-col px-4 py-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={[
                  'flex items-center justify-between rounded-md px-3 py-2.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300/70',
                  item.adminHighlight && isAdmin
                    ? 'text-amber-200'
                    : 'text-indigo-100/95 hover:text-white hover:bg-white/5',
                ].join(' ')}
              >
                <span>{item.kr}</span>
                <span className="text-[11px] tracking-[0.3em] text-indigo-200/80">
                  {item.label}
                </span>
              </Link>
            ))}
            <div className="my-2 h-px bg-indigo-400/15" />
            {loading ? (
              <span className="px-3 py-2 text-xs text-indigo-200/60">…</span>
            ) : user ? (
              <div className="flex flex-wrap items-center gap-2 px-3 py-2">
                <span className="text-[11px] text-indigo-100/80 truncate max-w-[55%]">
                  {displayName}
                </span>
                {isAdmin && (
                  <span className="rounded-sm border border-amber-300/40 bg-amber-400/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-[0.18em] text-amber-200">
                    COUNCIL
                  </span>
                )}
                <button
                  onClick={() => {
                    setOpen(false);
                    signOut();
                  }}
                  className="ml-auto rounded-md border border-indigo-400/25 bg-white/5 px-3 py-1.5 text-[11px] tracking-[0.2em] text-indigo-100/95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300/70"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-md border border-amber-300/40 bg-gradient-to-b from-amber-400/20 to-amber-500/10 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.22em] text-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300/80"
                >
                  ENTER
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="rounded-md border border-indigo-400/30 bg-white/5 px-3 py-1.5 text-[11px] tracking-[0.2em] text-indigo-100/95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300/70"
                >
                  JOIN
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

function RuneMark() {
  return (
    <span className="relative inline-flex h-8 w-8 items-center justify-center">
      <span className="absolute inset-0 rounded-full border border-amber-300/40" />
      <span className="absolute inset-1 rounded-full border border-indigo-300/30" />
      <span className="absolute inset-[10px] rounded-full bg-gradient-to-br from-amber-200 to-amber-500 shadow-[0_0_14px_rgba(252,211,77,0.55)]" />
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
 * Hero Stage — 키아트 배너
 * ───────────────────────────────────────────────────────────── */
function HeroStage() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto w-full max-w-7xl">
        <div className="relative h-[440px] sm:h-[520px] lg:h-[560px] overflow-hidden">
          {/* layered background */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 70% 30%, rgba(167,139,250,0.35), transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(56,189,248,0.20), transparent 55%), linear-gradient(180deg, #0a0e26 0%, #10153a 50%, #070a1a 100%)',
            }}
          />
          {/* big moon */}
          <div className="absolute right-[10%] top-[14%] hidden sm:block">
            <div className="relative">
              <div className="absolute -inset-20 rounded-full bg-amber-200/10 blur-3xl" />
              <div className="absolute -inset-8 rounded-full bg-indigo-300/15 blur-2xl" />
              <div className="relative h-24 w-24 lg:h-28 lg:w-28 rounded-full bg-[radial-gradient(circle_at_30%_30%,#fff7ed,#fcd34d_55%,#b45309_100%)] shadow-[0_0_70px_25px_rgba(252,211,77,0.25)]" />
            </div>
          </div>

          {/* big portal rings (key art focal) */}
          <div className="pointer-events-none absolute right-[6%] bottom-[10%] hidden md:block">
            <PortalArt />
          </div>

          {/* mountain silhouettes */}
          <MountainSilhouette />

          {/* city silhouette */}
          <CitySilhouette />

          {/* light shafts */}
          <div
            aria-hidden
            className="absolute inset-0 mix-blend-screen opacity-50"
            style={{
              background:
                'conic-gradient(from 220deg at 75% 35%, transparent 0deg, rgba(252,211,77,0.07) 15deg, transparent 30deg, transparent 360deg)',
            }}
          />

          {/* content */}
          <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col justify-center px-5 sm:px-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-amber-300/60" />
                <span className="text-[10px] tracking-[0.5em] text-amber-200/80">
                  CHAPTER · 0
                </span>
              </div>
              <h1 className="mt-4 font-serif text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-[0.08em] leading-[1.05] text-transparent bg-clip-text bg-gradient-to-b from-white via-indigo-100 to-amber-100 drop-shadow-[0_4px_30px_rgba(99,102,241,0.45)]">
                APORIA
                <span className="block text-2xl sm:text-3xl lg:text-4xl mt-2 tracking-[0.32em] text-indigo-200/90 font-light">
                  PORTAL
                </span>
              </h1>
              <p className="mt-5 text-sm sm:text-base text-indigo-100/85 leading-relaxed">
                일상과 이면의 경계, 그 문을 여는 자리.
              </p>
              <p className="mt-1.5 max-w-lg text-xs sm:text-sm text-indigo-200/70 leading-relaxed">
                도시의 밤 아래 겹쳐진 또 다른 세계 — 캐릭터, 에너미, 사건의 기록을
                이곳에서 시작합니다.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  to="/builder"
                  className="group relative inline-flex items-center gap-2 rounded-md border border-amber-300/50 bg-gradient-to-b from-amber-400/25 to-amber-600/10 px-6 py-3 text-sm font-semibold tracking-[0.22em] text-amber-100 shadow-[0_0_30px_-8px_rgba(252,211,77,0.5)] hover:from-amber-400/40 hover:to-amber-600/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300/80"
                >
                  <span>ENTER PORTAL</span>
                  <span aria-hidden className="transition group-hover:translate-x-0.5">
                    ▸
                  </span>
                </Link>
                <Link
                  to="/enemy"
                  className="inline-flex items-center gap-2 rounded-md border border-indigo-300/30 bg-white/5 px-5 py-3 text-sm tracking-[0.22em] text-indigo-100/95 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300/70"
                >
                  ENEMY ARCHIVE
                </Link>
              </div>
            </div>
          </div>

          {/* bottom ornament line */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}

function PortalArt() {
  return (
    <div className="relative h-72 w-72 lg:h-80 lg:w-80">
      <div className="absolute inset-0 rounded-full border border-amber-300/30" />
      <div className="absolute inset-3 rounded-full border border-amber-200/25" />
      <div className="absolute inset-8 rounded-full border border-indigo-300/30" />
      <div className="absolute inset-14 rounded-full border border-violet-300/25" />
      <div className="absolute inset-20 rounded-full border border-sky-300/30" />
      <div className="absolute inset-[110px] rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.7),rgba(56,189,248,0.15)_60%,transparent_70%)] blur-[2px]" />
      <div className="absolute inset-[125px] rounded-full bg-gradient-to-br from-amber-200/70 via-violet-300/40 to-transparent blur-sm" />
      {/* runic ticks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const r = 142;
        return (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 h-2 w-px bg-amber-200/60"
            style={{
              transform: `translate(-50%, -50%) rotate(${(i * 360) / 12}deg) translateY(-${r}px)`,
            }}
          />
        );
      })}
    </div>
  );
}

function MountainSilhouette() {
  return (
    <svg
      className="pointer-events-none absolute bottom-[88px] left-0 w-full"
      viewBox="0 0 1200 160"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="mtnFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#0a0e26" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path
        d="M0,160 L0,110 L80,70 L160,100 L240,55 L340,95 L430,40 L520,85 L620,30 L720,75 L820,50 L920,90 L1020,55 L1120,80 L1200,60 L1200,160 Z"
        fill="url(#mtnFade)"
      />
    </svg>
  );
}

function CitySilhouette() {
  return (
    <svg
      className="pointer-events-none absolute bottom-0 left-0 w-full"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="cityFade2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#070a1a" stopOpacity="0" />
          <stop offset="100%" stopColor="#04060f" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path
        d="M0,120 L0,75 L60,75 L60,55 L100,55 L100,85 L140,85 L140,45 L180,45 L180,32 L220,32 L220,70 L260,70 L260,55 L300,55 L300,80 L340,80 L340,48 L380,48 L380,62 L430,62 L430,38 L470,38 L470,25 L510,25 L510,58 L560,58 L560,75 L610,75 L610,42 L650,42 L650,58 L700,58 L700,32 L740,32 L740,55 L790,55 L790,68 L830,68 L830,48 L880,48 L880,62 L920,62 L920,38 L970,38 L970,58 L1020,58 L1020,72 L1070,72 L1070,52 L1120,52 L1120,68 L1200,68 L1200,120 Z"
        fill="url(#cityFade2)"
      />
      {/* glowing windows */}
      <g fill="#fcd34d" opacity="0.85">
        <rect x="105" y="66" width="2" height="3" />
        <rect x="148" y="56" width="2" height="3" />
        <rect x="225" y="78" width="2" height="3" />
        <rect x="312" y="86" width="2" height="3" />
        <rect x="395" y="54" width="2" height="3" />
        <rect x="478" y="38" width="2" height="3" />
        <rect x="565" y="68" width="2" height="3" />
        <rect x="660" y="52" width="2" height="3" />
        <rect x="745" y="62" width="2" height="3" />
        <rect x="888" y="56" width="2" height="3" />
        <rect x="978" y="66" width="2" height="3" />
        <rect x="1075" y="62" width="2" height="3" />
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
 * News Ticker — 게임 공지 띠
 * ───────────────────────────────────────────────────────────── */
function NewsTicker() {
  const items = [
    { tag: 'NOTICE', text: '캐릭터 설정 신청이 통과되면 데이터 등록을 진행해 주세요.' },
    { tag: 'EVENT', text: '에너미 템플릿과 스킬은 관리자 승인 후 시트에 등록됩니다.' },
    { tag: 'STATUS', text: 'Portal Online · Applications Open' },
  ];
  return (
    <section className="border-y border-amber-300/15 bg-[#0a0d22]/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-2.5">
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-indigo-100/90">
          {items.map((it, i) => (
            <li key={i} className="inline-flex items-center gap-2">
              <span className="rounded-sm border border-amber-300/40 bg-amber-300/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-[0.22em] text-amber-200">
                {it.tag}
              </span>
              <span className="text-indigo-50/95">{it.text}</span>
            </li>
          ))}
        </ul>
        <Link
          to="/my"
          className="text-xs tracking-[0.2em] text-amber-200 hover:text-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300/70 rounded-sm"
        >
          OPEN RECORD →
        </Link>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
 * Portal Gates — 게임 메뉴 카드
 * ───────────────────────────────────────────────────────────── */
const GATES = [
  {
    key: 'builder',
    to: '/builder',
    code: '01',
    tag: 'CHARACTER',
    title: '캐릭터 빌더',
    desc: '스탯, 기능, 숙련, 스킬을 다듬어 한 명의 인물을 깨워냅니다.',
    accent: 'amber',
    glyph: '⚔',
  },
  {
    key: 'enemy',
    to: '/enemy',
    code: '02',
    tag: 'ENEMY',
    title: '에너미 신청',
    desc: '이면에서 마주칠 존재의 템플릿과 스킬을 봉인합니다.',
    accent: 'violet',
    glyph: '☽',
  },
  {
    key: 'my',
    to: '/my',
    code: '03',
    tag: 'RECORD',
    title: '내 신청',
    desc: '제출한 기록과 검수 상태를 두루마리에서 확인합니다.',
    accent: 'sky',
    glyph: '✦',
    needsAuth: true,
  },
  {
    key: 'admin',
    to: '/admin',
    code: '04',
    tag: 'COUNCIL',
    title: '관리자',
    desc: '제출된 기록을 살펴 승인 또는 반려합니다.',
    accent: 'amber',
    glyph: '✶',
    needsAuth: true,
    adminOnly: true,
  },
];

const ACCENT = {
  amber: {
    border: 'border-amber-300/30',
    borderHover: 'hover:border-amber-300/70',
    glow: 'from-amber-300/30 via-amber-400/10 to-transparent',
    text: 'text-amber-200',
    chip: 'border-amber-300/40 bg-amber-300/10 text-amber-200',
    ring: 'group-hover:shadow-[0_0_36px_-6px_rgba(252,211,77,0.45)]',
  },
  violet: {
    border: 'border-violet-300/25',
    borderHover: 'hover:border-violet-300/70',
    glow: 'from-violet-400/30 via-indigo-400/10 to-transparent',
    text: 'text-violet-200',
    chip: 'border-violet-300/40 bg-violet-300/10 text-violet-200',
    ring: 'group-hover:shadow-[0_0_36px_-6px_rgba(167,139,250,0.45)]',
  },
  sky: {
    border: 'border-sky-300/25',
    borderHover: 'hover:border-sky-300/70',
    glow: 'from-sky-400/30 via-cyan-300/10 to-transparent',
    text: 'text-sky-200',
    chip: 'border-sky-300/40 bg-sky-300/10 text-sky-200',
    ring: 'group-hover:shadow-[0_0_36px_-6px_rgba(125,211,252,0.45)]',
  },
};

function PortalGates({ user, isAdmin }) {
  const navigate = useNavigate();
  const [hint, setHint] = useState('');

  const handleClick = (e, item) => {
    if (item.adminOnly) {
      if (!user) {
        e.preventDefault();
        setHint('관리 회의실(COUNCIL)은 로그인 후 입장할 수 있습니다. 로그인으로 이동합니다.');
        navigate('/login');
        return;
      }
      if (!isAdmin) {
        e.preventDefault();
        setHint('관리자 권한이 필요한 자리입니다.');
        return;
      }
    }
    if (item.needsAuth && !user) {
      e.preventDefault();
      setHint('이 자리는 로그인 후 접근할 수 있습니다. 로그인으로 이동합니다.');
      navigate('/login');
    }
  };

  return (
    <section>
      <SectionHeader code="II" tag="PORTAL GATES" title="문(門)을 선택하세요" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {GATES.map((g) => (
          <GateCard
            key={g.key}
            gate={g}
            highlighted={g.adminOnly && isAdmin}
            onClick={(e) => handleClick(e, g)}
          />
        ))}
      </div>

      <p
        role="status"
        aria-live="polite"
        className={
          hint
            ? 'mt-4 rounded-md border border-amber-300/40 bg-amber-300/10 px-3 py-2 text-xs text-amber-100'
            : 'sr-only'
        }
      >
        {hint}
      </p>
    </section>
  );
}

function GateCard({ gate, highlighted, onClick }) {
  const a = ACCENT[gate.accent] || ACCENT.amber;
  return (
    <Link
      to={gate.to}
      onClick={onClick}
      className={[
        'group relative flex h-full flex-col overflow-hidden rounded-lg border bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-sm p-5 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300/80',
        a.border,
        a.borderHover,
        a.ring,
        'hover:-translate-y-1',
        highlighted ? 'ring-1 ring-amber-300/40' : '',
      ].join(' ')}
    >
      {/* top glow */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-32 w-32 rounded-full bg-gradient-to-br ${a.glow} blur-2xl opacity-70 group-hover:opacity-100 transition`}
      />
      {/* corner bracket */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-2 top-2 h-3 w-3 border-l border-t border-amber-300/40"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-2 top-2 h-3 w-3 border-r border-t border-amber-300/40"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-2 bottom-2 h-3 w-3 border-l border-b border-amber-300/40"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-2 bottom-2 h-3 w-3 border-r border-b border-amber-300/40"
      />

      <div className="flex items-center justify-between">
        <span className={`font-mono text-[10px] tracking-[0.32em] ${a.text}`}>
          GATE · {gate.code}
        </span>
        <span className={`rounded-sm border px-1.5 py-0.5 text-[9px] font-semibold tracking-[0.22em] ${a.chip}`}>
          {gate.tag}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <span className={`font-serif text-3xl ${a.text} drop-shadow-[0_0_10px_rgba(252,211,77,0.35)]`}>
          {gate.glyph}
        </span>
        <h3 className="font-serif text-lg sm:text-xl tracking-wide text-amber-50">
          {gate.title}
        </h3>
      </div>

      <p className="mt-3 flex-1 text-[13px] leading-relaxed text-indigo-100/90">
        {gate.desc}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-amber-300/15 pt-3">
        <span className="text-[11px] font-mono tracking-widest text-indigo-200/70">
          {gate.to}
        </span>
        <span className={`text-[12px] tracking-[0.28em] ${a.text} transition group-hover:translate-x-0.5`}>
          OPEN ▸
        </span>
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────────────────────
 * Chronicle Panel — 게임의 "월드 / 가이드" 섹션
 * ───────────────────────────────────────────────────────────── */
function ChroniclePanel() {
  const chapters = [
    { code: '01', name: 'AWAKEN', kr: '캐릭터 설정 신청' },
    { code: '02', name: 'BIND', kr: '캐릭터 데이터 등록' },
    { code: '03', name: 'FORGE', kr: '스킬 신청' },
    { code: '04', name: 'JUDGE', kr: '관리자 검수' },
    { code: '05', name: 'ENTER', kr: '플레이 참가' },
  ];
  return (
    <section className="mt-14 sm:mt-20">
      <SectionHeader code="III" tag="CHRONICLE" title="이면으로 향하는 다섯 걸음" />

      <ol className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {chapters.map((c, i) => (
          <li
            key={c.code}
            className="relative overflow-hidden rounded-lg border border-amber-300/15 bg-gradient-to-b from-white/[0.04] to-transparent p-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-[0.3em] text-amber-200/80">
                CH · {c.code}
              </span>
              <span className="text-[10px] tracking-[0.28em] text-indigo-300/70">
                {c.name}
              </span>
            </div>
            <p className="mt-3 font-serif text-[15px] text-amber-50">{c.kr}</p>
            {i < chapters.length - 1 && (
              <span
                aria-hidden
                className="pointer-events-none absolute right-[-7px] top-1/2 hidden sm:block h-px w-3 bg-amber-300/40"
              />
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

function SectionHeader({ code, tag, title }) {
  return (
    <div className="mb-7 flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[11px] tracking-[0.3em] text-amber-200/80">
          ✦ ACT · {code}
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-amber-300/40 via-indigo-300/15 to-transparent" />
        <span className="font-mono text-[10px] tracking-[0.32em] text-indigo-200/60">
          {tag}
        </span>
      </div>
      <h2 className="font-serif text-2xl sm:text-3xl tracking-wide text-amber-50">
        {title}
      </h2>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 * Footer
 * ───────────────────────────────────────────────────────────── */
function SiteFooter() {
  return (
    <footer className="relative mt-10 border-t border-amber-300/15 bg-[#04060f]">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-2 px-4 sm:px-6 py-10 text-center">
        <div className="font-serif text-base tracking-[0.32em] text-amber-100">
          APORIA
        </div>
        <p className="text-[12px] tracking-[0.22em] text-indigo-200/70">
          Records beyond the ordinary night.
        </p>
        <p className="mt-3 text-[10px] tracking-[0.35em] text-indigo-300/40">
          © APORIA · ORPG / TRPG
        </p>
      </div>
    </footer>
  );
}
