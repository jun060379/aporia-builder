import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import PlaceholderPage from './PlaceholderPage.jsx';
import CharacterApplicationView from '../components/CharacterApplicationView.jsx';
import {
  getAdminApplications,
  updateApplicationStatus,
  TYPE_LABEL,
  STATUS_LABEL,
  STATUS_BADGE_CLASS,
} from '../lib/applications.js';

const FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'pending', label: '대기중' },
  { key: 'approved', label: '승인됨' },
  { key: 'rejected', label: '반려됨' },
  { key: 'needs_revision', label: '수정 요청' },
];

function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('ko-KR');
  } catch {
    return iso;
  }
}

function shortId(id) {
  if (!id) return '';
  return String(id).slice(0, 8);
}

export default function AdminPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: err } = await getAdminApplications();
      if (err) setError(err.message || '목록을 불러오지 못했습니다.');
      setItems(data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) refresh();
  }, [isAdmin, refresh]);

  const filtered = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter((it) => it.status === filter);
  }, [items, filter]);

  if (authLoading) {
    return <PlaceholderPage title="관리자 페이지" body="권한 확인 중입니다…" />;
  }
  if (!user) {
    return (
      <PlaceholderPage
        title="관리자 페이지"
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
  if (!isAdmin) {
    return <PlaceholderPage title="관리자 페이지" body="관리자 권한이 필요합니다." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-violet-50/40 text-slate-800 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-100/60 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-200/50 rounded-full blur-3xl" />
      </div>

      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/70 sticky top-0 z-20 shadow-sm shadow-slate-100/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-baseline gap-2.5 group">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent group-hover:opacity-80">
              APORIA
            </h1>
            <span className="text-slate-400 text-base font-light tracking-widest">ADMIN</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-violet-200 hover:from-violet-700 hover:to-indigo-700 active:scale-[0.98] transition"
          >
            홈
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">신청 검수</h2>
            <p className="text-xs text-slate-500 mt-1">제출된 신청을 검토하고 상태를 변경합니다.</p>
          </div>
          <button
            onClick={refresh}
            disabled={loading}
            className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 active:scale-[0.98] transition disabled:opacity-60"
          >
            {loading ? '불러오는 중...' : '새로고침'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium border transition ${
                filter === f.key
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-transparent shadow-sm shadow-violet-200'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700">
            {error}
          </p>
        )}

        {!loading && filtered.length === 0 && !error && (
          <div className="bg-white/80 rounded-2xl border border-slate-200/70 p-8 text-center text-sm text-slate-500">
            해당 조건의 신청이 없습니다.
          </div>
        )}

        <div className="space-y-3">
          {filtered.map((it) => (
            <AdminApplicationCard
              key={it.id}
              item={it}
              expanded={expandedId === it.id}
              onToggle={() => setExpandedId((prev) => (prev === it.id ? null : it.id))}
              onAfterUpdate={refresh}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

function AdminApplicationCard({ item, expanded, onToggle, onAfterUpdate }) {
  const [reviewComment, setReviewComment] = useState(item.review_comment || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [showPayload, setShowPayload] = useState(false);

  const act = async (status) => {
    setError('');
    setBusy(true);
    try {
      const { error: err } = await updateApplicationStatus({
        id: item.id,
        status,
        reviewComment: reviewComment.trim() || null,
      });
      if (err) {
        setError(err.message || '상태 변경에 실패했습니다.');
        return;
      }
      await onAfterUpdate();
    } catch (e) {
      setError(e?.message || '상태 변경 중 오류가 발생했습니다.');
    } finally {
      setBusy(false);
    }
  };

  const payloadJson = useMemo(() => {
    try {
      return JSON.stringify(item.payload, null, 2);
    } catch {
      return String(item.payload);
    }
  }, [item.payload]);

  return (
    <article className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-200/70 shadow-sm shadow-slate-100 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left p-4 sm:p-5 hover:bg-slate-50/60 transition"
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-slate-800 truncate">
              {item.title || '(제목 없음)'}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
              <span className="rounded-full bg-slate-100 px-2 py-0.5 border border-slate-200">
                {TYPE_LABEL[item.type] || item.type}
              </span>
              <span>신청자: <code className="text-slate-600">{shortId(item.user_id)}</code></span>
              <span>제출: {formatDate(item.created_at)}</span>
              {item.reviewed_at && <span>검수: {formatDate(item.reviewed_at)}</span>}
            </div>
          </div>
          <span
            className={`shrink-0 inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${STATUS_BADGE_CLASS[item.status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}
          >
            {STATUS_LABEL[item.status] || item.status}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-200/70 p-4 sm:p-5 space-y-4 bg-slate-50/40">
          {item.type === 'character_data' ? (
            <CharacterApplicationView application={item} />
          ) : (
            item.output_text && (
              <section>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">출력 텍스트</h4>
                <pre className="bg-slate-800 text-slate-100 rounded-xl border border-slate-700 p-4 text-xs whitespace-pre-wrap overflow-x-auto leading-relaxed font-mono">
                  {item.output_text}
                </pre>
              </section>
            )
          )}

          <section>
            <button
              type="button"
              onClick={() => setShowPayload((v) => !v)}
              className="text-xs text-violet-600 hover:underline"
            >
              {showPayload ? '▾ 원본 JSON 숨기기' : '▸ 원본 JSON 보기'}
            </button>
            {showPayload && (
              <pre className="mt-2 bg-slate-100 text-slate-700 rounded-xl border border-slate-200 p-3 text-[11px] whitespace-pre-wrap overflow-x-auto leading-relaxed font-mono max-h-96">
                {payloadJson}
              </pre>
            )}
          </section>

          <section className="space-y-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">검수 코멘트</label>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              rows={3}
              placeholder="필요 시 검수 코멘트를 입력하세요."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200"
            />
          </section>

          {error && (
            <p className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => act('approved')}
              disabled={busy}
              className="inline-flex items-center rounded-full bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-emerald-200 active:scale-[0.98] transition disabled:opacity-60"
            >
              {busy ? '처리 중...' : '승인'}
            </button>
            <button
              onClick={() => act('rejected')}
              disabled={busy}
              className="inline-flex items-center rounded-full bg-rose-600 hover:bg-rose-700 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-rose-200 active:scale-[0.98] transition disabled:opacity-60"
            >
              {busy ? '처리 중...' : '반려'}
            </button>
            <button
              onClick={() => act('needs_revision')}
              disabled={busy}
              className="inline-flex items-center rounded-full bg-sky-600 hover:bg-sky-700 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-sky-200 active:scale-[0.98] transition disabled:opacity-60"
            >
              {busy ? '처리 중...' : '수정 요청'}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
