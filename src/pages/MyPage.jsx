import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import PlaceholderPage from './PlaceholderPage.jsx';
import CharacterApplicationView from '../components/CharacterApplicationView.jsx';
import {
  getMyApplications,
  TYPE_LABEL,
  STATUS_LABEL,
  STATUS_BADGE_CLASS,
} from '../lib/applications.js';

function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('ko-KR');
  } catch {
    return iso;
  }
}

export default function MyPage() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: err } = await getMyApplications();
      if (err) setError(err.message || '목록을 불러오지 못했습니다.');
      setItems(data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) refresh();
  }, [user, refresh]);

  if (authLoading) {
    return <PlaceholderPage title="내 신청 목록" body="로그인 상태 확인 중입니다…" />;
  }
  if (!user) {
    return (
      <PlaceholderPage
        title="내 신청 목록"
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">내 신청 목록</h2>
            <p className="text-xs text-slate-500 mt-1">내가 제출한 신청의 상태를 확인할 수 있습니다.</p>
          </div>
          <button
            onClick={refresh}
            disabled={loading}
            className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 active:scale-[0.98] transition disabled:opacity-60"
          >
            {loading ? '불러오는 중...' : '새로고침'}
          </button>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700">
            {error}
          </p>
        )}

        {!loading && items.length === 0 && !error && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/70 shadow-sm shadow-slate-100 p-8 text-center">
            <p className="text-sm text-slate-500">아직 제출한 신청이 없습니다.</p>
            <Link
              to="/builder"
              className="mt-4 inline-flex items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-violet-200 hover:from-violet-700 hover:to-indigo-700 transition"
            >
              빌더로 가기
            </Link>
          </div>
        )}

        <div className="space-y-3">
          {items.map((it) => (
            <MyApplicationCard key={it.id} item={it} />
          ))}
        </div>
      </main>
    </div>
  );
}

function MyApplicationCard({ item }) {
  const [open, setOpen] = useState(false);
  const shortComment = useMemo(() => {
    if (!item.review_comment) return '';
    const t = String(item.review_comment).replace(/\s+/g, ' ').trim();
    return t.length > 80 ? t.slice(0, 80) + '…' : t;
  }, [item.review_comment]);

  return (
    <article className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-200/70 shadow-sm shadow-slate-100 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left p-4 sm:p-5 hover:bg-slate-50/60 transition"
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-slate-800 truncate">{item.title || '(제목 없음)'}</h3>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
              <span className="rounded-full bg-slate-100 px-2 py-0.5 border border-slate-200">
                {TYPE_LABEL[item.type] || item.type}
              </span>
              <span>제출: {formatDate(item.created_at)}</span>
            </div>
            {shortComment && (
              <p className="mt-1.5 text-[11px] text-slate-500">
                <span className="text-slate-400">검수 코멘트 </span>
                {shortComment}
              </p>
            )}
          </div>
          <span
            className={`shrink-0 inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${STATUS_BADGE_CLASS[item.status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}
          >
            {STATUS_LABEL[item.status] || item.status}
          </span>
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-200/70 p-4 sm:p-5 space-y-4 bg-slate-50/40">
          {item.review_comment && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800 whitespace-pre-wrap">
              <div className="text-[10px] text-amber-600 mb-1 uppercase tracking-wider">검수 코멘트</div>
              {item.review_comment}
            </div>
          )}
          {item.type === 'character_data' ? (
            <CharacterApplicationView application={item} />
          ) : (
            <FallbackPayloadView item={item} />
          )}
        </div>
      )}
    </article>
  );
}

function FallbackPayloadView({ item }) {
  let json = '';
  try {
    json = JSON.stringify(item.payload, null, 2);
  } catch {
    json = String(item.payload);
  }
  return (
    <div className="space-y-3">
      {item.output_text && (
        <pre className="bg-slate-800 text-slate-100 rounded-xl border border-slate-700 p-4 text-xs whitespace-pre-wrap overflow-x-auto leading-relaxed font-mono">
          {item.output_text}
        </pre>
      )}
      <pre className="bg-slate-100 text-slate-700 rounded-xl border border-slate-200 p-3 text-[11px] whitespace-pre-wrap overflow-x-auto leading-relaxed font-mono max-h-96">
        {json}
      </pre>
    </div>
  );
}
