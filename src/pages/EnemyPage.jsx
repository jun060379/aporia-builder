import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import PlaceholderPage from './PlaceholderPage.jsx';
import EnemyTemplateForm from '../components/EnemyTemplateForm.jsx';
import EnemySkillForm from '../components/EnemySkillForm.jsx';

const TABS = [
  { key: 'template', label: '에너미 템플릿 신청' },
  { key: 'skill', label: '에너미 스킬 신청' },
];

export default function EnemyPage() {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState('template');

  if (loading) {
    return <PlaceholderPage title="에너미 신청" body="로그인 상태 확인 중입니다…" />;
  }
  if (!user) {
    return (
      <PlaceholderPage
        title="에너미 신청"
        body="이 페이지는 로그인 후에 이용할 수 있습니다."
        extra={
          <Link
            to="/login"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-violet-200 hover:from-violet-700 hover:to-indigo-700 active:scale-[0.98] transition"
          >
            로그인하기
          </Link>
        }
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-violet-50/40 text-slate-800 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-100/60 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-200/50 rounded-full blur-3xl" />
      </div>

      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/70 sticky top-0 z-20 shadow-sm shadow-slate-100/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-baseline gap-2.5 group">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent group-hover:opacity-80">
              APORIA
            </h1>
            <span className="text-slate-400 text-base font-light tracking-widest">ENEMY</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-violet-200 hover:from-violet-700 hover:to-indigo-700 active:scale-[0.98] transition"
          >
            홈
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">에너미 신청</h2>
          <p className="text-xs text-slate-500 mt-1">
            제출 후 <Link to="/my" className="text-violet-600 hover:underline">내 신청 목록</Link>에서 상태를 확인할 수 있습니다.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium border transition ${
                tab === t.key
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-transparent shadow-sm shadow-violet-200'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-200/70 shadow-sm shadow-slate-100 p-4 sm:p-6">
          {tab === 'template' ? <EnemyTemplateForm /> : <EnemySkillForm />}
        </div>
      </main>
    </div>
  );
}
