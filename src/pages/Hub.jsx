import { Link } from 'react-router-dom';

const CARDS = [
  {
    to: '/builder',
    title: '캐릭터 데이터 빌더',
    desc: '승인된 캐릭터의 스탯, 기능, 숙련, 스킬 데이터를 제작합니다.',
  },
  {
    to: '/enemy',
    title: '에너미 신청',
    desc: '에너미 템플릿과 에너미 스킬을 작성해 신청합니다.',
  },
  {
    to: '/my',
    title: '내 신청 목록',
    desc: '내가 제출한 신청의 승인, 반려, 수정 요청 상태를 확인합니다.',
  },
  {
    to: '/admin',
    title: '관리자 페이지',
    desc: '제출된 신청을 검수하고 승인 또는 반려합니다.',
  },
];

export default function Hub() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
        <header className="mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Aporia 허브 포털
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
            캐릭터 데이터 제작, 에너미 신청, 신청 현황 확인, 관리자 검수를 위한 포털입니다.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {CARDS.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="group block rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 transition hover:border-slate-600 hover:bg-slate-900"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-slate-100 group-hover:text-white">
                {card.title}
              </h2>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                {card.desc}
              </p>
              <span className="mt-4 inline-flex items-center text-sm font-medium text-sky-400 group-hover:text-sky-300">
                이동하기 →
              </span>
            </Link>
          ))}
        </div>

        <footer className="mt-12 text-xs text-slate-600">
          Aporia ORPG / TRPG
        </footer>
      </div>
    </div>
  );
}
