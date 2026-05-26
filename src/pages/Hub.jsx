import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Hub() {
  const { user, profile, isAdmin, signOut, loading } = useAuth();
  const displayName = profile?.display_name || user?.email || '';

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#eef3ff] via-[#f4f3ff] to-[#f8f7ff] text-slate-800">
      <PortalBackdrop />

      <HubHeader
        user={user}
        isAdmin={isAdmin}
        displayName={displayName}
        loading={loading}
        signOut={signOut}
      />

      <main className="relative mx-auto w-full max-w-5xl px-4 sm:px-6 pt-6 sm:pt-10 pb-16">
        <HeroSection />

        <AuthStatusPanel
          user={user}
          profile={profile}
          isAdmin={isAdmin}
          displayName={displayName}
          loading={loading}
          signOut={signOut}
        />

        <PortalCardGrid user={user} isAdmin={isAdmin} />

        <GuidancePanel />
      </main>

      <SiteFooter />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 * Backdrop — 도시의 밤 + 달빛 + 얇은 포털 링
 * ───────────────────────────────────────────────────────────── */
function PortalBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* moonlight glow */}
      <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-200/50 via-violet-200/40 to-transparent blur-3xl" />
      <div className="absolute -top-24 right-[-120px] h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="absolute bottom-[-160px] left-[-120px] h-[420px] w-[420px] rounded-full bg-violet-300/30 blur-3xl" />

      {/* faint noise via stacked dot-grid */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(99,102,241,0.18) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />

      {/* thin portal rings */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2">
        <div className="h-[360px] w-[360px] rounded-full border border-violet-300/35" />
        <div className="absolute inset-6 rounded-full border border-indigo-300/25" />
        <div className="absolute inset-14 rounded-full border border-sky-300/20" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 * Header
 * ───────────────────────────────────────────────────────────── */
function HubHeader({ user, isAdmin, displayName, loading, signOut }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/60 bg-white/60 backdrop-blur-xl shadow-[0_1px_0_rgba(99,102,241,0.06)]">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5">
        <Link to="/" className="group inline-flex items-baseline gap-2.5">
          <span className="bg-gradient-to-r from-violet-700 via-indigo-600 to-sky-600 bg-clip-text text-xl font-bold tracking-wide text-transparent">
            APORIA
          </span>
          <span className="text-[13px] font-light tracking-[0.32em] text-slate-400 group-hover:text-slate-500 transition">
            PORTAL
          </span>
        </Link>

        <nav className="ml-auto flex flex-wrap items-center justify-end gap-2">
          {loading ? (
            <span className="text-xs text-slate-400">로딩 중…</span>
          ) : user ? (
            <>
              <span className="hidden sm:inline text-xs text-slate-500 max-w-[160px] truncate">
                {displayName}
              </span>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="inline-flex items-center rounded-full border border-violet-200/80 bg-violet-50/80 px-3 py-1.5 text-xs font-medium text-violet-700 hover:bg-violet-100 active:scale-[0.98] transition"
                >
                  관리자
                </Link>
              )}
              <Link
                to="/my"
                className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition"
              >
                내 신청
              </Link>
              <button
                onClick={signOut}
                className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm shadow-violet-200/70 hover:from-violet-700 hover:to-indigo-700 active:scale-[0.98] transition"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition"
              >
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────────────────────
 * Hero
 * ───────────────────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="relative mt-2 sm:mt-6">
      <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/55 px-6 py-10 sm:px-10 sm:py-14 backdrop-blur-xl shadow-[0_10px_40px_-20px_rgba(79,70,229,0.35)]">
        {/* inner glow */}
        <div className="pointer-events-none absolute -top-24 -left-10 h-72 w-72 rounded-full bg-violet-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-sky-300/25 blur-3xl" />

        {/* portal hint ring */}
        <div className="pointer-events-none absolute right-6 top-6 hidden sm:block">
          <div className="relative h-24 w-24">
            <div className="absolute inset-0 rounded-full border border-violet-300/60" />
            <div className="absolute inset-2 rounded-full border border-indigo-300/40" />
            <div className="absolute inset-5 rounded-full border border-sky-300/30" />
            <div className="absolute inset-9 rounded-full bg-gradient-to-br from-violet-400/40 to-indigo-300/30 blur-md" />
          </div>
        </div>

        <p className="text-[11px] uppercase tracking-[0.32em] text-violet-500/80">
          Aporia · Urban Fantasy Operation Hub
        </p>

        <h1 className="mt-3 text-3xl sm:text-5xl font-bold leading-tight tracking-tight">
          <span className="bg-gradient-to-r from-slate-900 via-indigo-700 to-violet-700 bg-clip-text text-transparent">
            APORIA PORTAL
          </span>
        </h1>

        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
          일상과 이면의 경계에서 시작되는 기록.
        </p>
        <p className="mt-1.5 max-w-2xl text-xs sm:text-sm text-slate-500 leading-relaxed">
          캐릭터 데이터, 에너미 템플릿, 스킬 검수와 등록을 한 곳에서 관리합니다.
          도시의 밤 아래 겹쳐진 또 다른 세계, 그 입구를 정돈해 두는 자리입니다.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-2.5">
          <Link
            to="/builder"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-violet-200/70 hover:from-violet-700 hover:to-indigo-700 active:scale-[0.98] transition"
          >
            캐릭터 빌더 열기
          </Link>
          <Link
            to="/enemy"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white/90 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-white active:scale-[0.98] transition"
          >
            에너미 신청
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
 * Auth status (small inline panel)
 * ───────────────────────────────────────────────────────────── */
function AuthStatusPanel({ user, profile, isAdmin, displayName, loading, signOut }) {
  if (loading) return null;

  return (
    <section className="mt-6">
      <div className="rounded-2xl border border-white/70 bg-white/65 backdrop-blur-xl px-4 py-3 sm:px-5 sm:py-3.5 shadow-sm shadow-violet-100/40">
        {user ? (
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200">
                로그인됨
              </span>
              <span className="text-xs text-slate-600 truncate max-w-[220px] sm:max-w-[360px]">
                {displayName}
              </span>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 border border-slate-200">
                {isAdmin ? '관리자' : '일반 회원'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/my"
                className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50/80 px-3 py-1.5 text-xs font-medium text-violet-700 hover:bg-violet-100 active:scale-[0.98] transition"
              >
                내 신청 보기
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm shadow-violet-200/70 hover:from-violet-700 hover:to-indigo-700 active:scale-[0.98] transition"
                >
                  관리자 페이지
                </Link>
              )}
              <button
                onClick={signOut}
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition"
              >
                로그아웃
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <p className="text-xs sm:text-[13px] text-slate-600">
              로그인하면 신청 제출과 진행 상태 확인이 가능합니다.
            </p>
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm shadow-violet-200/70 hover:from-violet-700 hover:to-indigo-700 active:scale-[0.98] transition"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition"
              >
                회원가입
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
 * Card grid
 * ───────────────────────────────────────────────────────────── */
const CARDS = [
  {
    key: 'builder',
    to: '/builder',
    title: '캐릭터 빌더',
    desc: '캐릭터 데이터를 작성하고 신청합니다.',
    cta: '빌더 열기',
    glyph: 'BLD',
    needsAuth: false,
    accent: 'violet',
  },
  {
    key: 'enemy',
    to: '/enemy',
    title: '에너미 신청',
    desc: '에너미 템플릿과 에너미 스킬을 신청합니다.',
    cta: '에너미 관리',
    glyph: 'ENM',
    needsAuth: false,
    accent: 'indigo',
  },
  {
    key: 'my',
    to: '/my',
    title: '내 신청',
    desc: '내가 제출한 신청의 상태를 확인합니다.',
    cta: '내 신청 보기',
    glyph: 'MY',
    needsAuth: true,
    accent: 'sky',
  },
  {
    key: 'admin',
    to: '/admin',
    title: '관리자',
    desc: '제출된 신청을 검수하고 승인/반려합니다.',
    cta: '관리자 페이지',
    glyph: 'GM',
    needsAuth: true,
    adminOnly: true,
    accent: 'violet',
  },
];

function PortalCardGrid({ user, isAdmin }) {
  const navigate = useNavigate();
  const [hint, setHint] = useState('');

  const handleClick = (e, card) => {
    if (card.adminOnly) {
      if (!user) {
        e.preventDefault();
        setHint('관리자 페이지는 로그인 후 이용할 수 있습니다.');
        navigate('/login');
        return;
      }
      if (!isAdmin) {
        e.preventDefault();
        setHint('관리자 권한이 필요한 페이지입니다. 권한 부여를 요청해 주세요.');
        return;
      }
    }
    if (card.needsAuth && !user) {
      e.preventDefault();
      setHint('이 페이지는 로그인 후 이용할 수 있습니다. 로그인 페이지로 이동합니다.');
      navigate('/login');
    }
  };

  return (
    <section className="mt-8 sm:mt-10">
      <div className="mb-3 flex items-center gap-2 px-1">
        <span className="text-[11px] font-mono tracking-widest text-violet-400">—</span>
        <h2 className="text-xs uppercase tracking-[0.28em] text-slate-500">Modules</h2>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((card) => (
          <PortalCard
            key={card.key}
            card={card}
            highlighted={card.adminOnly && isAdmin}
            dimmed={card.adminOnly && !isAdmin}
            onClick={(e) => handleClick(e, card)}
          />
        ))}
      </div>

      <p
        role="status"
        aria-live="polite"
        className={
          hint
            ? 'mt-3 rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-2 text-xs text-amber-700'
            : 'sr-only'
        }
      >
        {hint}
      </p>
    </section>
  );
}

const ACCENT_RING = {
  violet: 'from-violet-400/60 via-indigo-300/40 to-transparent',
  indigo: 'from-indigo-400/60 via-sky-300/40 to-transparent',
  sky: 'from-sky-400/60 via-cyan-300/40 to-transparent',
};

const ACCENT_BTN = {
  violet:
    'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-violet-200/70',
  indigo:
    'bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 shadow-indigo-200/70',
  sky:
    'bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 shadow-sky-200/70',
};

function PortalCard({ card, highlighted, dimmed, onClick }) {
  const ringClass = ACCENT_RING[card.accent] || ACCENT_RING.violet;
  const btnClass = ACCENT_BTN[card.accent] || ACCENT_BTN.violet;

  return (
    <article
      className={[
        'group relative flex flex-col overflow-hidden rounded-2xl border backdrop-blur-xl',
        'p-5 transition-all duration-300',
        'shadow-[0_6px_24px_-12px_rgba(79,70,229,0.25)]',
        'hover:-translate-y-1 hover:shadow-[0_14px_36px_-14px_rgba(79,70,229,0.45)]',
        highlighted
          ? 'border-violet-300/70 bg-gradient-to-br from-white/85 to-violet-50/60'
          : 'border-white/70 bg-white/65',
        dimmed ? 'opacity-90' : '',
      ].join(' ')}
    >
      {/* top portal glow */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 h-24 w-24 rounded-full bg-gradient-to-br ${ringClass} blur-2xl opacity-70 group-hover:opacity-100 transition`}
      />

      <div className="flex items-center justify-between">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-violet-200/70 bg-white/80 text-[10px] font-mono font-semibold tracking-wider text-violet-600">
          {card.glyph}
        </span>
        {highlighted && (
          <span className="inline-flex items-center rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-medium text-violet-700 border border-violet-200">
            관리자
          </span>
        )}
      </div>

      <h3 className="mt-4 text-base sm:text-lg font-semibold text-slate-800">
        {card.title}
      </h3>
      <p className="mt-1.5 flex-1 text-xs sm:text-[13px] leading-relaxed text-slate-500">
        {card.desc}
      </p>

      <div className="mt-5">
        <Link
          to={card.to}
          onClick={onClick}
          className={`inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium text-white shadow-sm active:scale-[0.98] transition ${btnClass}`}
        >
          {card.cta}
        </Link>
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────────────────────
 * Guidance
 * ───────────────────────────────────────────────────────────── */
function GuidancePanel() {
  const lines = [
    '캐릭터 설정 신청이 통과되면 데이터 등록이 진행됩니다.',
    '에너미 템플릿과 에너미 스킬은 관리자 승인 후 실제 시트에 등록됩니다.',
    '신청 상태는 「내 신청」 페이지에서 확인할 수 있습니다.',
  ];
  return (
    <section className="mt-8 sm:mt-10">
      <div className="rounded-2xl border border-white/70 bg-white/55 backdrop-blur-xl px-5 py-4 sm:px-6 sm:py-5 shadow-sm shadow-violet-100/30">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[11px] font-mono tracking-widest text-violet-400">—</span>
          <h2 className="text-xs uppercase tracking-[0.28em] text-slate-500">Notes</h2>
        </div>
        <ul className="space-y-1.5">
          {lines.map((t, i) => (
            <li key={i} className="flex gap-2 text-xs sm:text-[13px] text-slate-600 leading-relaxed">
              <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400/70" />
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
    <footer className="relative mx-auto w-full max-w-5xl px-4 sm:px-6 pb-8 text-center">
      <div className="mx-auto h-px w-32 bg-gradient-to-r from-transparent via-violet-300/50 to-transparent" />
      <p className="mt-4 text-[11px] tracking-[0.32em] text-slate-400">
        APORIA · ORPG / TRPG · URBAN FANTASY
      </p>
    </footer>
  );
}
