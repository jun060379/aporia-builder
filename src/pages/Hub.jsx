import { Link } from 'react-router-dom';

const CARDS = [
  {
    to: '/builder',
    title: '캐릭터 데이터 빌더',
    desc: '승인된 캐릭터의 스탯, 기능, 숙련, 스킬 데이터를 제작합니다.',
    cta: '빌더 열기',
  },
  {
    to: '/enemy',
    title: '에너미 신청',
    desc: '에너미 템플릿과 에너미 스킬을 작성해 신청합니다.',
    cta: '에너미 신청',
  },
  {
    to: '/my',
    title: '내 신청 목록',
    desc: '내가 제출한 신청의 승인, 반려, 수정 요청 상태를 확인합니다.',
    cta: '신청 확인',
  },
  {
    to: '/admin',
    title: '관리자 페이지',
    desc: '제출된 신청을 검수하고 승인 또는 반려합니다.',
    cta: '관리자 페이지',
  },
];

export default function Hub() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-violet-50/40 text-slate-800 relative overflow-hidden">
      {/* 배경 블러 액센트 (Builder와 동일 톤) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-100/60 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-200/50 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-100/40 rounded-full blur-2xl" />
      </div>

      {/* ── 헤더 ── */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/70 sticky top-0 z-20 shadow-sm shadow-slate-100/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-baseline gap-2.5">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent">
              APORIA
            </h1>
            <span className="text-slate-400 text-base font-light tracking-widest">PORTAL</span>
          </div>
          <p className="text-[11px] text-slate-400 tracking-widest mt-0.5">
            Everyday / Unreality Operation Hub
          </p>
        </div>
      </header>

      {/* ── 본문 ── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <section className="mb-8 sm:mb-10">
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            캐릭터 데이터 제작, 에너미 신청, 신청 현황 확인, 관리자 검수를 위한 포털입니다.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {CARDS.map((card) => (
            <article
              key={card.to}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/70 shadow-sm shadow-slate-100 p-5 sm:p-6 flex flex-col"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
                {card.title}
              </h2>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed flex-1">
                {card.desc}
              </p>
              <div className="mt-5">
                <Link
                  to={card.to}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-violet-200 hover:from-violet-700 hover:to-indigo-700 active:scale-[0.98] transition"
                >
                  {card.cta}
                </Link>
              </div>
            </article>
          ))}
        </div>

        <footer className="mt-12 text-[11px] text-slate-400 tracking-widest text-center">
          APORIA ORPG / TRPG
        </footer>
      </main>
    </div>
  );
}
