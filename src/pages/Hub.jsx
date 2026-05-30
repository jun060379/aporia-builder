import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Hub() {
  const { user, profile, isAdmin, signOut, loading } = useAuth();
  const displayName = profile?.display_name || user?.email || '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-violet-50/40 text-slate-800 relative overflow-hidden">
      <AmbientBackdrop />

      <SiteHeader
        user={user}
        isAdmin={isAdmin}
        displayName={displayName}
        loading={loading}
        signOut={signOut}
      />

      <main className="relative mx-auto w-full max-w-5xl px-4 sm:px-6 pt-6 sm:pt-10 pb-16">
        <HeroPanel />
        <MenuGrid user={user} isAdmin={isAdmin} />
        <GuidePanel />
      </main>

      <SiteFooter />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 * Backdrop — 빌더와 동일한 톤
 * ───────────────────────────────────────────────────────────── */
function AmbientBackdrop() {
  return (
    <div aria-hidden className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-100/60 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-200/50 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-100/40 rounded-full blur-2xl" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 * Section header — 빌더 스타일(— + uppercase)
 * ───────────────────────────────────────────────────────────── */
function SectionHeader({ title }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-[10px] text-violet-300 font-mono tracking-widest">—</span>
      <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">
        {title}
      </h2>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 * Header
 * ───────────────────────────────────────────────────────────── */
function SiteHeader({ user, isAdmin, displayName, loading, signOut }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);

  const navItems = [
    { to: '/', label: '홈' },
    { to: '/builder', label: '캐릭터 빌더' },
    { to: '/characters', label: '캐릭터 일람' },
    { to: '/enemy', label: '에너미 신청' },
    { to: '/items', label: '아이템 제작', adminHighlight: true },
    { to: '/my', label: '내 신청' },
    { to: '/admin', label: '관리자', adminHighlight: true },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/70 sticky top-0 z-20 shadow-sm shadow-slate-100/80">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5">
        <Link to="/" className="group inline-flex items-baseline gap-2">
          <span className="bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-xl font-bold text-transparent">
            APORIA
          </span>
          <span className="text-slate-400 text-[13px] font-light tracking-widest">
            PORTAL
          </span>
        </Link>

        {/* desktop nav */}
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={[
                'rounded-full px-3 py-1.5 text-[13px] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300',
                item.adminHighlight && isAdmin
                  ? 'text-violet-700 font-medium hover:bg-violet-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50',
              ].join(' ')}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* auth (desktop) */}
        <div className="hidden md:flex items-center gap-2">
          {loading ? (
            <span className="text-xs text-slate-400">로딩 중…</span>
          ) : user ? (
            <>
              <span className="max-w-[160px] truncate text-xs text-slate-600">
                {displayName}
              </span>
              {isAdmin && (
                <span className="inline-flex items-center rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-medium text-violet-700 border border-violet-200">
                  관리자
                </span>
              )}
              <button
                onClick={signOut}
                className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm shadow-violet-200 hover:from-violet-700 hover:to-indigo-700 active:scale-[0.98] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
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
          className="md:hidden inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
          aria-expanded={open}
          aria-controls="hub-mobile-nav"
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
        >
          {open ? '닫기' : '메뉴'}
        </button>
      </div>

      {/* mobile menu */}
      {open && (
        <div id="hub-mobile-nav" className="md:hidden border-t border-slate-200/70 bg-white/90 backdrop-blur">
          <nav className="mx-auto flex w-full max-w-5xl flex-col px-3 py-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={[
                  'rounded-lg px-3 py-2.5 text-sm hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400',
                  item.adminHighlight && isAdmin
                    ? 'text-violet-700 font-medium'
                    : 'text-slate-700',
                ].join(' ')}
              >
                {item.label}
              </Link>
            ))}
            <div className="my-2 border-t border-slate-100" />
            {loading ? (
              <span className="px-3 py-2 text-xs text-slate-400">로딩 중…</span>
            ) : user ? (
              <div className="flex flex-wrap items-center gap-2 px-3 py-2">
                <span className="text-xs text-slate-600 truncate max-w-[55%]">
                  {displayName}
                </span>
                {isAdmin && (
                  <span className="inline-flex items-center rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-medium text-violet-700 border border-violet-200">
                    관리자
                  </span>
                )}
                <button
                  onClick={() => {
                    setOpen(false);
                    signOut();
                  }}
                  className="ml-auto inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm shadow-violet-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
                >
                  로그인
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
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
 * Hero — 빌더 카드 톤(흰 글래스 + 부드러운 보라/앰버 글로우)
 * ───────────────────────────────────────────────────────────── */
function HeroPanel() {
  return (
    <section className="mt-2 sm:mt-6">
      <div className="relative overflow-hidden bg-white/85 backdrop-blur-sm rounded-2xl border border-indigo-100/70 shadow-sm shadow-violet-100/30 p-6 sm:p-8">
        <div className="pointer-events-none absolute -top-20 -left-10 h-56 w-56 rounded-full bg-amber-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-10 h-56 w-56 rounded-full bg-violet-200/50 blur-3xl" />

        {/* 작은 달/포털 모티프 — 우상단 */}
        <div className="pointer-events-none absolute right-5 top-5 hidden sm:block">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border border-violet-200" />
            <div className="absolute inset-2 rounded-full border border-indigo-200" />
            <div className="absolute inset-5 rounded-full bg-gradient-to-br from-amber-200 to-violet-300 blur-[2px] opacity-80" />
          </div>
        </div>

        <SectionHeader title="APORIA PORTAL" />

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-slate-900 via-indigo-700 to-violet-700 bg-clip-text text-transparent">
            일상과 이면의 경계에서 시작되는 기록
          </span>
        </h1>

        <p className="mt-2.5 max-w-2xl text-sm sm:text-[15px] text-slate-500 leading-relaxed">
          캐릭터 데이터, 에너미 템플릿, 스킬 검수와 등록을 한 곳에서 관리합니다.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Link
            to="/builder"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-violet-200 hover:from-violet-700 hover:to-indigo-700 active:scale-[0.98] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
          >
            캐릭터 빌더 열기
          </Link>
          <Link
            to="/enemy"
            className="inline-flex items-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
          >
            에너미 신청
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
 * Menu Grid — 빌더 카드 톤과 동일
 * ───────────────────────────────────────────────────────────── */
const MENU = [
  {
    key: 'builder',
    to: '/builder',
    title: '캐릭터 빌더',
    desc: '캐릭터 데이터를 작성하고 신청합니다.',
    cta: '빌더 열기',
  },
  {
    key: 'characters',
    to: '/characters',
    title: '캐릭터 & 스킬 일람',
    desc: '등록된 캐릭터와 보유 스킬 목록을 확인합니다.',
    cta: '일람 보기',
  },
  {
    key: 'enemy',
    to: '/enemy',
    title: '에너미 신청',
    desc: '에너미 템플릿과 스킬을 신청합니다.',
    cta: '에너미 신청',
    needsAuth: true,
  },
  {
    key: 'my',
    to: '/my',
    title: '내 신청',
    desc: '제출한 신청과 검수 상태를 확인합니다.',
    cta: '내 신청 보기',
    needsAuth: true,
  },
  {
    key: 'items',
    to: '/items',
    title: '장비 · 아이템 제작',
    desc: 'ITEM_DB에 아이템을 등록하거나 TSV로 내보냅니다.',
    cta: '아이템 제작',
    needsAuth: true,
    adminOnly: true,
  },
  {
    key: 'admin',
    to: '/admin',
    title: '관리자',
    desc: '제출된 신청을 검수하고 승인/반려합니다.',
    cta: '관리자 페이지',
    needsAuth: true,
    adminOnly: true,
  },
];

function MenuGrid({ user, isAdmin }) {
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
    <section className="mt-8 sm:mt-10">
      <SectionHeader title="포털 메뉴" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
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
            ? 'mt-4 rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2 text-xs text-amber-700'
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
    <article
      className={[
        'bg-white/85 backdrop-blur-sm rounded-2xl border shadow-sm shadow-violet-100/20 p-5 sm:p-6 flex flex-col transition',
        highlighted ? 'border-violet-200' : 'border-indigo-100/70',
        'hover:shadow-md hover:shadow-violet-100/40 hover:border-indigo-200',
      ].join(' ')}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg sm:text-xl font-semibold text-slate-800">
          {item.title}
        </h3>
        {highlighted && (
          <span className="inline-flex items-center rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-medium text-violet-700 border border-violet-200">
            관리자
          </span>
        )}
      </div>

      <p className="mt-2 flex-1 text-sm text-slate-500 leading-relaxed">
        {item.desc}
      </p>

      <div className="mt-5">
        <Link
          to={item.to}
          onClick={onClick}
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-violet-200 hover:from-violet-700 hover:to-indigo-700 active:scale-[0.98] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
        >
          {item.cta}
        </Link>
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────────────────────
 * Guide — 빌더 톤 한 장
 * ───────────────────────────────────────────────────────────── */
function GuidePanel() {
  const steps = [
    '캐릭터 설정 신청이 통과되면 데이터 등록을 진행합니다.',
    '에너미 템플릿과 에너미 스킬은 관리자 승인 후 시트에 등록됩니다.',
    '신청 상태는 「내 신청」 페이지에서 확인할 수 있습니다.',
  ];
  return (
    <section className="mt-8 sm:mt-10">
      <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-indigo-100/70 shadow-sm shadow-violet-100/20 p-5 sm:p-6">
        <SectionHeader title="이용 안내" />
        <ul className="space-y-2">
          {steps.map((t, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
              <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-violet-300" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
 * Footer
 * ───────────────────────────────────────────────────────────── */
function SiteFooter() {
  return (
    <footer className="relative mx-auto w-full max-w-5xl px-4 sm:px-6 pb-10 text-center">
      <div className="mx-auto h-px w-32 bg-gradient-to-r from-transparent via-violet-300/50 to-transparent" />
      <p className="mt-4 text-[11px] tracking-widest text-slate-500">
        APORIA · ORPG / TRPG
      </p>
    </footer>
  );
}
