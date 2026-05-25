import { Link } from 'react-router-dom';

export default function PlaceholderPage({ title, body }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-violet-50/40 text-slate-800 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-100/60 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-200/50 rounded-full blur-3xl" />
      </div>

      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/70 sticky top-0 z-20 shadow-sm shadow-slate-100/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-baseline gap-2.5 group">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent group-hover:opacity-80">
              APORIA
            </h1>
            <span className="text-slate-400 text-base font-light tracking-widest">PORTAL</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-violet-200 hover:from-violet-700 hover:to-indigo-700 active:scale-[0.98] transition"
          >
            홈
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/70 shadow-sm shadow-slate-100 p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">
            {title}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            {body}
          </p>

          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 active:scale-[0.98] transition"
            >
              ← 허브로 돌아가기
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
