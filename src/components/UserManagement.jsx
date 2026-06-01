import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

async function callAdminUsers(action, extra = {}) {
  if (!supabase) throw new Error('Supabase가 설정되지 않았습니다.');
  const { data: sess } = await supabase.auth.getSession();
  const token = sess?.session?.access_token;
  if (!token) throw new Error('로그인이 필요합니다.');
  const resp = await fetch('/api/admin-users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ action, ...extra }),
  });
  return resp.json();
}

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busyId, setBusyId] = useState('');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const r = await callAdminUsers('list');
      if (r.ok) setUsers(r.users || []);
      else setError(r.error || '목록을 불러오지 못했습니다.');
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const setRole = async (u, role) => {
    setBusyId(u.id); setError(''); setNotice('');
    try {
      const r = await callAdminUsers('setRole', { userId: u.id, role });
      if (r.ok) {
        setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, role: r.role } : x)));
        setNotice(`${u.email || u.displayName || u.id} → ${role === 'admin' ? '관리자' : '일반'} 권한으로 변경`);
      } else {
        setError(r.error || '권한 변경에 실패했습니다.');
      }
    } catch (e) { setError(e.message); }
    finally { setBusyId(''); }
  };

  const q = search.trim().toLowerCase();
  const filtered = !q ? users : users.filter((u) =>
    (u.email || '').toLowerCase().includes(q) ||
    (u.displayName || '').toLowerCase().includes(q) ||
    (u.alias || '').toLowerCase().includes(q)
  );

  const adminCount = users.filter((u) => u.role === 'admin').length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">사용자 관리</h2>
          <p className="text-xs text-slate-500 mt-1">
            계정 목록을 확인하고 관리자 권한을 부여/회수합니다. · 전체 {users.length}명 · 관리자 {adminCount}명
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 active:scale-[0.98] transition disabled:opacity-60"
        >{loading ? '불러오는 중...' : '새로고침'}</button>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="이메일 · 이름 · 캐릭터 별명으로 검색"
        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm placeholder:text-slate-400 focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20 outline-none"
      />

      {error && <p className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700 whitespace-pre-wrap">{error}</p>}
      {notice && <p className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-700">{notice}</p>}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 rounded-full border-2 border-violet-300 border-t-violet-600 animate-spin" />
          <span className="ml-3 text-sm text-slate-400">불러오는 중…</span>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-sm text-slate-400 py-10">{q ? '검색 결과가 없습니다.' : '사용자가 없습니다.'}</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((u) => {
            const isAdmin = u.role === 'admin';
            const busy = busyId === u.id;
            return (
              <div key={u.id} className="flex items-center justify-between gap-3 bg-white rounded-xl border border-slate-200 px-4 py-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-slate-800 truncate">{u.email || '(이메일 없음)'}</span>
                    {isAdmin && <span className="text-[10px] text-violet-700 bg-violet-50 border border-violet-200 rounded px-1.5 py-0.5">관리자</span>}
                    {u.isSelf && <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">나</span>}
                  </div>
                  <div className="flex gap-2 mt-0.5 text-[11px] text-slate-400 flex-wrap">
                    {u.displayName && <span>{u.displayName}</span>}
                    {u.alias && <span>· 캐릭터: {u.alias}</span>}
                    <span className="font-mono">· {u.id.slice(0, 8)}</span>
                  </div>
                </div>
                <div className="shrink-0">
                  {isAdmin ? (
                    <button
                      onClick={() => setRole(u, 'user')}
                      disabled={busy || u.isSelf}
                      title={u.isSelf ? '자기 자신의 관리자 권한은 해제할 수 없습니다' : ''}
                      className="text-xs px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >{busy ? '...' : '관리자 해제'}</button>
                  ) : (
                    <button
                      onClick={() => setRole(u, 'admin')}
                      disabled={busy}
                      className="text-xs px-3 py-1.5 bg-violet-50 hover:bg-violet-100 border border-violet-200 text-violet-700 rounded-lg transition disabled:opacity-40"
                    >{busy ? '...' : '관리자 지정'}</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
