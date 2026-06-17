import { useMemo, useState } from 'react';
import SkillMaker from './SkillMaker';
import { supabase } from '../lib/supabaseClient';
import { buildSkillText, buildPassiveText } from '../utils/applicationText';
import { buildSkillSummary, describeEffectLine } from '../utils/skillSummary';
import { normalizeFormula, previewFormula } from '../utils/calcSkill';
import { getSkillEffectText } from '../data/skillRanks';
import { STAT_NAMES } from '../data/stats';
import { ABILITY_NAMES } from '../data/abilities';
import { PROFICIENCY_NAMES } from '../data/proficiencies';

// 미리보기/테스트용 기본 스탯(스탯 10 / 기능·숙련 5 / 레벨 1).
const PREVIEW_STATS = Object.fromEntries(STAT_NAMES.map((n) => [n, 10]));
const PREVIEW_ABILITIES = Object.fromEntries(ABILITY_NAMES.map((n) => [n, 5]));
const PREVIEW_PROFICIENCIES = Object.fromEntries(PROFICIENCY_NAMES.map((n) => [n, 5]));
const PREVIEW_LEVEL = 1;

const inputCls = 'w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-sm focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20 outline-none placeholder:text-slate-400 transition-colors';

function CopyBlock({ title, text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  };
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-600">{title}</span>
        <button onClick={copy} className="shrink-0 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition-colors">
          {copied ? '복사됨!' : '복사'}
        </button>
      </div>
      <pre className="bg-slate-800 text-slate-100 rounded-xl p-3 text-[11px] font-mono break-all whitespace-pre-wrap overflow-x-auto leading-relaxed">{text}</pre>
    </div>
  );
}

// ── 실시간 테스트 미리보기 ─────────────────────────────────────────────
function LivePreview({ skill }) {
  const summary = useMemo(
    () => buildSkillSummary(skill, { stats: PREVIEW_STATS, abilities: PREVIEW_ABILITIES, proficiencies: PREVIEW_PROFICIENCIES }),
    [skill]
  );
  const effectLines = useMemo(
    () => getSkillEffectText(skill).split('\n').map((s) => s.trim()).filter(Boolean),
    [skill]
  );
  const formula = String(skill?.formula || '').trim();
  const hasErosion = /이면침식/.test(formula);
  const exp = useMemo(() => {
    if (!formula) return null;
    try { return previewFormula(formula, PREVIEW_STATS, skill.rank, {}, PREVIEW_ABILITIES, PREVIEW_PROFICIENCIES, PREVIEW_LEVEL); }
    catch { return null; }
  }, [formula, skill?.rank]);
  const erosionVariants = useMemo(() => {
    if (!formula || !hasErosion) return null;
    return [0, 6, 9].map((e) => {
      try { return { e, v: previewFormula(formula, PREVIEW_STATS, skill.rank, { 이면침식: e }, PREVIEW_ABILITIES, PREVIEW_PROFICIENCIES, PREVIEW_LEVEL).value }; }
      catch { return { e, v: null }; }
    });
  }, [formula, hasErosion, skill?.rank]);

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-3 sticky top-4">
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-emerald-500 font-mono tracking-widest">LIVE</span>
        <h3 className="text-sm font-semibold text-emerald-800">실시간 테스트 미리보기</h3>
      </div>
      <p className="text-[10px] text-emerald-600/80">스탯 10 / 기능·숙련 5 기준. 입력하는 즉시 갱신됩니다.</p>

      {/* 평문 요약 */}
      <div className="rounded-xl bg-white border border-emerald-100 p-3">
        <p className="text-[10px] text-emerald-500 uppercase tracking-widest mb-1">요약</p>
        <p className="text-sm text-slate-800 leading-relaxed">{summary}</p>
      </div>

      {/* 판정 기대값 */}
      {formula && (
        <div className="rounded-xl bg-white border border-emerald-100 p-3 space-y-1.5">
          <p className="text-[10px] text-emerald-500 uppercase tracking-widest">판정</p>
          {erosionVariants ? (
            <div className="grid grid-cols-3 gap-2">
              {erosionVariants.map(({ e, v }) => (
                <div key={e} className="bg-emerald-50 rounded-lg p-2 text-center border border-emerald-100">
                  <p className="text-[10px] text-slate-400 mb-0.5">침식 {e}</p>
                  <p className={`text-sm font-bold ${v !== null ? 'text-emerald-700' : 'text-rose-600'}`}>{v !== null ? v : '오류'}</p>
                </div>
              ))}
            </div>
          ) : (
            exp && exp.value !== null
              ? <p className="text-sm text-emerald-700">기대값 <span className="font-bold">{exp.value}</span></p>
              : <p className="text-xs text-rose-600">계산식 평가 실패 — 토큰을 확인하세요.</p>
          )}
          {exp && exp.warnings && exp.warnings.map((w, i) => <p key={i} className="text-xs text-amber-600">⚠ {w}</p>)}
        </div>
      )}

      {/* 효과 줄별 풀이 */}
      {effectLines.length > 0 && (
        <div className="rounded-xl bg-white border border-emerald-100 p-3 space-y-1">
          <p className="text-[10px] text-emerald-500 uppercase tracking-widest mb-0.5">효과</p>
          {effectLines.map((line, i) => (
            <div key={i} className="text-xs">
              <span className="text-slate-800">{describeEffectLine(line)}</span>
              <span className="block text-[10px] text-slate-400 font-mono break-all">{line}</span>
            </div>
          ))}
        </div>
      )}

      {/* 조건 / 대가 */}
      {(skill?.condition || skill?.cost) && (
        <div className="rounded-xl bg-white border border-emerald-100 p-3 text-xs text-slate-600 space-y-0.5">
          {skill.condition && <p><span className="text-slate-400">조건 </span>{skill.condition.replace(/\n/g, ' · ')}</p>}
          {skill.cost && <p><span className="text-slate-400">대가 </span>{skill.cost.replace(/\n/g, ' · ')}</p>}
        </div>
      )}
    </div>
  );
}

export default function AdminSkillMaker() {
  const [owner, setOwner] = useState('');
  const [liveSkill, setLiveSkill] = useState(null);
  const [skillText, setSkillText] = useState('');
  const [passiveText, setPassiveText] = useState('');
  const [deploying, setDeploying] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const handleSaveSkill = (skill) => {
    const ownerLine = owner.trim() ? `소유자: ${owner.trim()}\n` : '';
    setSkillText(ownerLine + buildSkillText(skill));
    setPassiveText('');
  };
  const handleSavePassive = (p) => { setPassiveText(buildPassiveText(p)); setSkillText(''); };

  function skillPayload() {
    const s = liveSkill || {};
    return {
      소유자: owner.trim(),
      스킬명: String(s.name || '').trim(),
      계통: s.tradition || '',
      계열: s.series || '',
      랭크: s.rank || '',
      계산식: normalizeFormula(String(s.formula || '')),
      효과: getSkillEffectText(s),
      조건: s.condition || '',
      대가: s.cost || '',
      설명: s.description || '',
    };
  }

  const deployErrors = useMemo(() => {
    const e = [];
    if (!owner.trim()) e.push('소유자(캐릭터 별명)를 입력하세요.');
    if (!liveSkill || !String(liveSkill.name || '').trim()) e.push('스킬 이름을 입력하세요.');
    return e;
  }, [owner, liveSkill]);

  async function deploySkill() {
    setError(''); setNotice(''); setDeploying(true);
    try {
      if (!supabase) { setError('Supabase가 설정되지 않았습니다.'); return; }
      const { data: sess } = await supabase.auth.getSession();
      const token = sess?.session?.access_token;
      if (!token) { setError('로그인이 필요합니다.'); return; }

      const resp = await fetch('/api/skill-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ skill: skillPayload() }),
      });
      const json = await resp.json().catch(() => null);
      if (!resp.ok || !json || json.ok !== true) {
        setError(json?.error || `배포 실패 (HTTP ${resp.status})`);
        return;
      }
      setNotice(`${json.mode === 'updated' ? '갱신' : '등록'}됨: ${json.name} → ${json.owner}`);
    } catch (e) {
      setError(e?.message || '배포 중 오류가 발생했습니다.');
    } finally {
      setDeploying(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_22rem] gap-5 items-start">
      {/* 좌: 에디터 */}
      <div className="space-y-5 min-w-0">
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3 text-[11px] text-indigo-900 leading-relaxed">
          <p className="font-semibold text-indigo-700 mb-0.5">스킬 · 패시브 제작기 (운영자)</p>
          <p>풀 에디터로 직접 제작합니다. 소유자를 지정하고 <strong>웹 배포</strong>로 SKILL_DB에 바로 등록(같은 소유자·스킬명이면 갱신)하거나, 신청텍스트를 복사하세요.</p>
        </div>

        <label className="flex flex-col gap-1 max-w-sm">
          <span className="text-[11px] text-slate-500">소유자 (캐릭터 별명) <span className="text-rose-400">*</span></span>
          <input className={inputCls} value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="예: 호시노 스바루" />
        </label>

        <SkillMaker
          stats={PREVIEW_STATS}
          abilities={PREVIEW_ABILITIES}
          proficiencies={PREVIEW_PROFICIENCIES}
          level={PREVIEW_LEVEL}
          onSave={handleSaveSkill}
          onCancel={() => {}}
          onSavePassive={handleSavePassive}
          onUpdatePassive={handleSavePassive}
          onCancelPassiveEdit={() => {}}
          onSkillChange={setLiveSkill}
        />

        {/* 스킬 웹 배포 */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              onClick={deploySkill}
              disabled={deployErrors.length > 0 || deploying}
              className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-40 text-white font-bold rounded-xl text-sm transition-colors shadow-sm shadow-emerald-200"
            >
              {deploying ? '배포 중…' : '스킬 웹 배포 (SKILL_DB에 등록)'}
            </button>
          </div>
          {deployErrors.length > 0 && (
            <p className="text-[11px] text-amber-600">⚠ {deployErrors.join(' / ')}</p>
          )}
          {error && <p className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700">{error}</p>}
          {notice && <p className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-700">{notice}</p>}
        </div>

        {skillText && <CopyBlock title="스킬 신청텍스트" text={skillText} />}
        {passiveText && <CopyBlock title="패시브 등록텍스트 / TSV" text={passiveText} />}
      </div>

      {/* 우: 실시간 미리보기 */}
      <div className="min-w-0">
        {liveSkill
          ? <LivePreview skill={liveSkill} />
          : <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-400 sticky top-4">스킬 탭에서 값을 입력하면 여기에 실시간 미리보기가 표시됩니다.</div>}
      </div>
    </div>
  );
}
