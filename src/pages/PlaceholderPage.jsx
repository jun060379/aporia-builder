import { Link } from 'react-router-dom';

export default function PlaceholderPage({ title, body }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed">
          {body}
        </p>

        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-slate-500 hover:bg-slate-800"
          >
            ← 허브로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
