import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { createApplication } from '../lib/applications';
import { buildFullApplicationText } from '../utils/applicationText';

export default function SubmitApplicationPanel({ char, stats, abilities, proficiencies, skills, passives }) {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const hasPassive = (passives?.length ?? 0) > 0;

  const handleSubmit = async () => {
    setError('');
    setNotice('');
    if (!hasPassive) {
      setError('패시브를 1개 이상 등록해야 신청할 수 있습니다. (스킬 패널 → 패시브 신청)');
      return;
    }
    setSubmitting(true);
    try {
      const title = (char?.name && String(char.name).trim()) || '이름 없는 캐릭터 데이터';
      const outputText = buildFullApplicationText({ char, stats, abilities, proficiencies, skills, passives });
      const payload = {
        char,
        stats,
        abilities,
        proficiencies,
        skills,
        passives: passives || [],
        level: char?.level,
        species: char?.race,
        faction: char?.faction || '무소속',
        erosion: char?.erosion,
      };
      const { error: err } = await createApplication({
        type: 'character_data',
        title,
        payload,
        outputText,
      });
      if (err) {
        setError(err.message || '신청 저장에 실패했습니다.');
        return;
      }
      setNotice('등록 신청이 접수되었습니다.');
    } catch (e) {
      setError(e?.message || '신청 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-indigo-100/70 shadow-sm shadow-violet-100/20 p-5 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-violet-300 font-mono tracking-widest">—</span>
        <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">등록 신청</h2>
      </div>

      {!user ? (
        <div className="space-y-3">
          <p className="text-xs text-slate-500">
            등록 신청을 위해서는 로그인이 필요합니다.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-violet-200 hover:from-violet-700 hover:to-indigo-700 active:scale-[0.98] transition"
          >
            로그인하러 가기
          </Link>
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-500">
            현재 빌더의 캐릭터 데이터를 제출합니다. 제출 후 <Link to="/my" className="text-violet-600 hover:underline">내 신청 목록</Link>에서 상태를 확인할 수 있습니다.
          </p>
          {!hasPassive && (
            <p className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700">
              ⚠ 패시브를 1개 이상 등록해야 신청할 수 있습니다. (스킬 패널 → 패시브 신청)
            </p>
          )}
          <button
            onClick={handleSubmit}
            disabled={submitting || !hasPassive}
            className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-violet-200 hover:from-violet-700 hover:to-indigo-700 active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? '신청 중...' : '등록 신청'}
          </button>
        </>
      )}

      {error && (
        <p className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700">
          {error}
        </p>
      )}
      {notice && (
        <p className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-700">
          {notice}
        </p>
      )}
    </div>
  );
}
