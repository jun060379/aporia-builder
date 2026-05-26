import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Hub() {
  const { user, profile, isAdmin, signOut, loading } = useAuth();
  const displayName = profile?.display_name || user?.email || '';

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800">
      <SiteHeader
        user={user}
        isAdmin={isAdmin}
        displayName={displayName}
        loading={loading}
        signOut={signOut}
      />

      <HeroBanner />

      <NoticeBar />

      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
        <PortalMenu user={user} isAdmin={isAdmin} />
        <GuideSection />
      </main>

      <SiteFooter />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 * Header — 얇은 웹사이트 네비게이션
 * ───────────────────────────────────────────────────────────── */
function SiteHeader({ user, isAdmin, displayName, loading, signOut }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const navItems = [
    { to: '/', label: '홈' },
    { to: '/builder', label: '캐릭터 빌더' },
    { to: '/enemy', label: '에너미 신청' },
    { to: '/my', label: '내 신청' },
    { to: '/admin', label: '관리자', adminHighlight: true },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 h-14">
        <Link to="/" className="inline-flex items-baseline gap-2">
          <span className="text-[17px] font-semibold tracking-[0.18em] text-slate-900">
            APORIA
          </span>
          <span className="hidden sm:inline text-[10px] tracking-[0.28em] text-slate-400">
            PORTAL
          </span>
        </Link>

        {/* desktop nav */}
        <nav className="hidden md:flex items-center gap-1 text-sm text-slate-600">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={[
                'rounded-md px-3 py-1.5 transition hover:text-slate-900 hover:bg-slate-50',
                item.adminHighlight && isAdmin ? 'text-blue-700 font-medium' : '',
              ].join(' ')}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* auth (desktop) */}
        <div className="hidden md:flex items-center gap-2">
          {loading ? (
            <span className="text-xs text-slate-400">…</span>
          ) : user ? (
            <>
              <span className="max-w-[160px] truncate text-xs text-slate-500">
                {displayName}
              </span>
              {isAdmin && (
                <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                  ADMIN
                </span>
              )}
              <button
                onClick={signOut}
                className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                회원가입
              </Link>
            </>
          )}
        </div>

        {/* mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center rounded-md border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600"
          aria-expanded={open}
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
        >
          {open ? '닫기' : '메뉴'}
        </button>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <nav className="mx-auto flex w-full max-w-6xl flex-col px-4 py-2 text-sm text-slate-700">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={[
                  'rounded-md px-3 py-2 hover:bg-slate-50',
                  item.adminHighlight && isAdmin ? 'text-blue-700 font-medium' : '',
                ].join(' ')}
              >
                {item.label}
              </Link>
            ))}
            <div className="my-2 border-t border-slate-100" />
            {loading ? (
              <span className="px-3 py-2 text-xs text-slate-400">…</span>
            ) : user ? (
              <div className="flex flex-wrap items-center gap-2 px-3 py-2">
                <span className="text-xs text-slate-500 truncate max-w-[60%]">
                  {displayName}
                </span>
                {isAdmin && (
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                    ADMIN
                  </span>
                )}
                <button
                  onClick={() => {
                    setOpen(false);
                    signOut();
                  }}
                  className="ml-auto rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
                >
                  로그인
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  회원가입
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

/* ─────────────────────────────────────────────────────────────
 * Hero Banner — 푸른 밤, 도시 실루엣, 달, 포털 선
 * ───────────────────────────────────────────────────────────── */
function HeroBanner() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="relative h-[260px] sm:h-[320px] lg:h-[360px] w-full"
        style={{
          background:
            'linear-gradient(180deg, #0b1230 0%, #142154 45%, #1f2f7a 75%, #2c3f9a 100%)',
        }}
      >
        {/* moon */}
        <div className="absolute right-[14%] top-10 hidden sm:block">
          <div className="relative h-16 w-16 rounded-full bg-[radial-gradient(circle_at_30%_30%,#f8fafc,#cbd5ff_60%,#94a3d8_100%)] shadow-[0_0_60px_20px_rgba(191,210,255,0.35)]" />
        </div>
        {/* stars */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.7) 50%, transparent 51%), radial-gradient(1px 1px at 70% 20%, rgba(255,255,255,0.5) 50%, transparent 51%), radial-gradient(1px 1px at 40% 60%, rgba(255,255,255,0.4) 50%, transparent 51%), radial-gradient(1px 1px at 85% 50%, rgba(255,255,255,0.5) 50%, transparent 51%), radial-gradient(1px 1px at 10% 70%, rgba(255,255,255,0.4) 50%, transparent 51%)',
          }}
        />
        {/* thin portal rings — 우측 가운데 */}
        <div className="pointer-events-none absolute right-[8%] bottom-[20%] hidden md:block">
          <div className="relative h-44 w-44">
            <div className="absolute inset-0 rounded-full border border-blue-200/20" />
            <div className="absolute inset-4 rounded-full border border-indigo-200/15" />
            <div className="absolute inset-10 rounded-full border border-violet-200/10" />
          </div>
        </div>

        {/* city silhouette */}
        <CitySilhouette />

        {/* content */}
        <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col justify-center px-5 sm:px-6">
          <div className="max-w-xl">
            <p className="text-[11px] tracking-[0.35em] text-blue-200/80">
              APORIA · URBAN FANTASY
            </p>
            <h1 className="mt-3 text-2xl sm:text-4xl font-semibold tracking-wide text-white">
              APORIA PORTAL
            </h1>
            <p className="mt-3 text-sm sm:text-[15px] text-blue-100/90">
              일상과 이면의 경계에서 시작되는 기록.
            </p>
            <p className="mt-1 text-xs sm:text-[13px] text-blue-200/75 max-w-md">
              캐릭터 신청, 에너미 데이터, 검수와 등록을 한 곳에서 관리합니다.
            </p>
          </div>
        </div>

        {/* small status panel — 우상단 */}
        <div className="absolute right-4 sm:right-6 top-4 z-10 hidden sm:block">
          <div className="rounded-md border border-white/15 bg-white/5 px-3.5 py-2.5 text-right backdrop-blur-sm">
            <p className="text-[9px] tracking-[0.3em] text-blue-200/70">
              CURRENT STATUS
            </p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-medium text-blue-50">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              Portal Online
            </p>
            <p className="text-[10px] text-blue-200/70">Applications Open</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CitySilhouette() {
  // 도시 건물 실루엣 (SVG, 하단에 가로로 깔림)
  return (
    <svg
      className="pointer-events-none absolute bottom-0 left-0 w-full"
      viewBox="0 0 1200 110"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="cityFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b1230" stopOpacity="0" />
          <stop offset="100%" stopColor="#070a1c" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path
        d="M0,110 L0,70 L60,70 L60,55 L100,55 L100,80 L140,80 L140,40 L180,40 L180,30 L220,30 L220,65 L260,65 L260,50 L300,50 L300,75 L340,75 L340,45 L380,45 L380,60 L430,60 L430,35 L470,35 L470,25 L510,25 L510,55 L560,55 L560,70 L610,70 L610,40 L650,40 L650,55 L700,55 L700,30 L740,30 L740,50 L790,50 L790,65 L830,65 L830,45 L880,45 L880,60 L920,60 L920,35 L970,35 L970,55 L1020,55 L1020,70 L1070,70 L1070,50 L1120,50 L1120,65 L1200,65 L1200,110 Z"
        fill="url(#cityFade)"
      />
      {/* 작은 창문 불빛 */}
      <g fill="#fde68a" opacity="0.55">
        <rect x="105" y="62" width="2" height="3" />
        <rect x="148" y="50" width="2" height="3" />
        <rect x="225" y="72" width="2" height="3" />
        <rect x="312" y="80" width="2" height="3" />
        <rect x="395" y="50" width="2" height="3" />
        <rect x="478" y="35" width="2" height="3" />
        <rect x="565" y="62" width="2" height="3" />
        <rect x="660" y="48" width="2" height="3" />
        <rect x="745" y="58" width="2" height="3" />
        <rect x="888" y="52" width="2" height="3" />
        <rect x="978" y="62" width="2" height="3" />
        <rect x="1075" y="58" width="2" height="3" />
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
 * Notice Bar
 * ───────────────────────────────────────────────────────────── */
function NoticeBar() {
  return (
    <section className="border-b border-slate-200 bg-slate-900 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-2.5">
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-[13px]">
          <span className="rounded-sm bg-blue-500/90 px-1.5 py-0.5 text-[10px] font-semibold tracking-widest text-white">
            NOTICE
          </span>
          <span className="text-slate-200">
            캐릭터 설정 신청이 통과되면 데이터 등록을 진행해 주세요.
          </span>
        </div>
        <Link
          to="/my"
          className="text-xs text-blue-200 hover:text-white underline-offset-4 hover:underline"
        >
          내 신청 보기 →
        </Link>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
 * Portal Menu
 * ───────────────────────────────────────────────────────────── */
const MENU = [
  {
    key: 'builder',
    to: '/builder',
    category: 'CHARACTER',
    title: '캐릭터 빌더',
    desc: '캐릭터 데이터를 작성하고 신청합니다.',
  },
  {
    key: 'enemy',
    to: '/enemy',
    category: 'ENEMY',
    title: '에너미 신청',
    desc: '에너미 템플릿과 스킬을 신청합니다.',
  },
  {
    key: 'my',
    to: '/my',
    category: 'MEMBER',
    title: '내 신청',
    desc: '제출한 신청과 검수 상태를 확인합니다.',
    needsAuth: true,
  },
  {
    key: 'admin',
    to: '/admin',
    category: 'STAFF',
    title: '관리자',
    desc: '신청을 검수하고 승인 또는 반려합니다.',
    needsAuth: true,
    adminOnly: true,
  },
];

function PortalMenu({ user, isAdmin }) {
  const navigate = useNavigate();
  const [hint, setHint] = useState('');

  const handleClick = (e, item) => {
    if (item.adminOnly) {
      if (!user) {
        e.preventDefault();
        setHint('관리자 페이지는 로그인 후 이용할 수 있습니다. 로그인 페이지로 이동합니다.');
        navigate('/login');
        return;
      }
      if (!isAdmin) {
        e.preventDefault();
        setHint('관리자 권한이 필요한 페이지입니다.');
        return;
      }
    }
    if (item.needsAuth && !user) {
      e.preventDefault();
      setHint('이 페이지는 로그인 후 이용할 수 있습니다. 로그인 페이지로 이동합니다.');
      navigate('/login');
    }
  };

  return (
    <section>
      <div className="mb-6 flex items-end justify-between border-b border-slate-200 pb-3">
        <div>
          <p className="text-[11px] tracking-[0.32em] text-blue-600/80">PORTAL MENU</p>
          <h2 className="mt-1 text-lg sm:text-xl font-semibold tracking-wide text-slate-900">
            필요한 항목을 선택해 이동하세요
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MENU.map((item) => (
          <MenuCard
            key={item.key}
            item={item}
            highlighted={item.adminOnly && isAdmin}
            onClick={(e) => handleClick(e, item)}
          />
        ))}
      </div>

      <p
        role="status"
        aria-live="polite"
        className={
          hint
            ? 'mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800'
            : 'sr-only'
        }
      >
        {hint}
      </p>
    </section>
  );
}

function MenuCard({ item, highlighted, onClick }) {
  return (
    <Link
      to={item.to}
      onClick={onClick}
      className={[
        'group relative flex h-full flex-col rounded-lg border bg-white p-5 transition-all duration-200',
        'hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-[0_4px_18px_-12px_rgba(37,99,235,0.45)]',
        highlighted ? 'border-blue-300' : 'border-slate-200',
      ].join(' ')}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium tracking-[0.24em] text-blue-600">
          {item.category}
        </span>
        {highlighted && (
          <span className="rounded-sm bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 border border-blue-200">
            ADMIN
          </span>
        )}
      </div>

      <h3 className="mt-3 text-base sm:text-lg font-semibold text-slate-900">
        {item.title}
      </h3>
      <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-slate-500">
        {item.desc}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-[11px] font-mono tracking-wider text-slate-400">
          {item.to}
        </span>
        <span className="text-sm text-blue-600 transition group-hover:translate-x-0.5">
          →
        </span>
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────────────────────
 * Guide Section
 * ───────────────────────────────────────────────────────────── */
function GuideSection() {
  const steps = [
    '캐릭터 설정 신청',
    '캐릭터 데이터 등록',
    '스킬 신청',
    '관리자 검수',
    '플레이 참가',
  ];
  return (
    <section className="mt-12 sm:mt-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-lg border border-slate-200 bg-white px-5 py-6 sm:px-8 sm:py-8">
        <div className="md:col-span-1">
          <p className="text-[11px] tracking-[0.32em] text-blue-600/80">GUIDE</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">이용 순서</h2>
          <p className="mt-2 text-[13px] text-slate-500 leading-relaxed">
            APORIA 포털은 다음 순서로 이용합니다. 각 단계는 관리자의 승인 후 다음
            단계로 진행됩니다.
          </p>
        </div>
        <ol className="md:col-span-2 grid grid-cols-1 sm:grid-cols-5 gap-3">
          {steps.map((s, i) => (
            <li
              key={i}
              className="relative rounded-md border border-slate-100 bg-slate-50/60 px-3 py-3"
            >
              <span className="block text-[10px] font-mono tracking-widest text-blue-500">
                STEP {String(i + 1).padStart(2, '0')}
              </span>
              <span className="mt-1 block text-[13px] font-medium text-slate-800">
                {s}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
 * Footer
 * ───────────────────────────────────────────────────────────── */
function SiteFooter() {
  return (
    <footer className="mt-8 bg-slate-900 text-slate-300">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 sm:px-6 py-8 sm:py-10">
        <p className="text-sm font-semibold tracking-[0.22em] text-white">
          APORIA PORTAL
        </p>
        <p className="text-xs text-slate-400">
          Boundary records for urban fantasy sessions.
        </p>
        <p className="mt-3 text-[11px] tracking-widest text-slate-500">
          © APORIA · ORPG / TRPG
        </p>
      </div>
    </footer>
  );
}
