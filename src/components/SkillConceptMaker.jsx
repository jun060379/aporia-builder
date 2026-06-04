import { useState, useEffect } from 'react';
import { SKILL_TRADITIONS, SKILL_SERIES, SKILL_RANKS, defaultSkill } from '../data/skillRanks';

// ── 스타일 ──────────────────────────────────────────────────────────────
const inputCls  = "w-full min-w-0 bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-sm focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20 outline-none placeholder:text-slate-400 transition-colors";
const selectCls = "w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-sm focus:border-violet-400 outline-none transition-colors";

// 패시브 개념 신청 기본값(15컬럼 형태 유지 — 직렬화 안전. 메커니즘은 운영자가 채움).
const EMPTY_PASSIVE = {
  key: '', 이름: '', 소유타입: 'global', 소유키: '*',
  해금레벨: '1', 분류: '기타', 효과코드: '기타',
  수치: '', 최대: '', 발동: '수동', 판정: '전체',
  조건: '', 효과: '', 설명: '', 메모: ''
};

const NOTICE =
  '메커니즘(계산식·효과·조건·대가)은 운영자가 검토 후 제작합니다. 여기선 개념만 적어 주세요.';

// ── 스킬 개념 폼 ────────────────────────────────────────────────────────
function SkillConceptForm({ editingSkill, onSave, onCancel }) {
  const init = (src) => ({ ...defaultSkill(), ...(src || {}) });
  const [skill, setSkill] = useState(() => init(editingSkill));

  useEffect(() => { setSkill(init(editingSkill)); }, [editingSkill]);

  const field = (key) => (e) => setSkill(s => ({ ...s, [key]: e.target.value }));

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3 text-[11px] text-indigo-900 leading-relaxed">
        {NOTICE}
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] text-slate-500 tracking-wide">스킬 이름</span>
        <input className={inputCls} value={skill.name} onChange={field('name')} placeholder="스킬 이름" />
      </label>

      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 tracking-wide">계통</span>
          <select className={selectCls} value={skill.tradition} onChange={field('tradition')}>
            {SKILL_TRADITIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 tracking-wide">계열</span>
          <select className={selectCls} value={skill.series} onChange={field('series')}>
            {SKILL_SERIES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>

      <div className="space-y-1.5">
        <span className="text-[11px] text-slate-500 tracking-wide">랭크</span>
        <div className="flex flex-wrap gap-1">
          {SKILL_RANKS.map(({ rank, value }) => (
            <button
              key={rank}
              onClick={() => setSkill(s => ({ ...s, rank }))}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold border transition-all ${
                skill.rank === rank
                  ? 'bg-amber-400 text-white border-amber-400 shadow-sm shadow-amber-200/50'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-amber-300 hover:text-amber-700 hover:bg-amber-50'
              }`}
            >
              {rank} <span className="opacity-50 font-normal">({value})</span>
            </button>
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] text-slate-500 tracking-wide">설명 (원하는 효과·콘셉트)</span>
        <textarea
          className={`${inputCls} h-28 resize-none`}
          value={skill.description}
          onChange={field('description')}
          placeholder="어떤 스킬인지, 원하는 효과를 자유롭게 적어 주세요. (운영자가 이 설명을 보고 메커니즘을 제작합니다)"
        />
      </label>

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onSave(skill)}
          className="flex-1 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm shadow-violet-200"
        >
          {editingSkill ? '스킬 수정' : '스킬 추가'}
        </button>
        {editingSkill && (
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 rounded-xl text-sm transition-colors"
          >
            취소
          </button>
        )}
      </div>
    </div>
  );
}

// ── 패시브 개념 폼 ──────────────────────────────────────────────────────
function PassiveConceptForm({ editingPassive, onSavePassive, onUpdatePassive, onCancelEdit }) {
  const init = (src) => (src ? { ...EMPTY_PASSIVE, ...src } : EMPTY_PASSIVE);
  const [row, setRow] = useState(() => init(editingPassive));

  useEffect(() => { setRow(init(editingPassive)); }, [editingPassive]);

  const field = (k) => (e) => setRow(r => ({ ...r, [k]: e.target.value }));
  const valid = row.이름.trim().length > 0;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3 text-[11px] text-indigo-900 leading-relaxed">
        {NOTICE}
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] text-slate-500 tracking-wide">패시브 이름</span>
        <input className={inputCls} value={row.이름} onChange={field('이름')} placeholder="패시브 이름" />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] text-slate-500 tracking-wide">설명 (원하는 효과·콘셉트)</span>
        <textarea
          className={`${inputCls} h-28 resize-none`}
          value={row.설명}
          onChange={field('설명')}
          placeholder="어떤 패시브인지, 원하는 효과를 자유롭게 적어 주세요. (운영자가 이 설명을 보고 제작합니다)"
        />
      </label>

      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            if (editingPassive) onUpdatePassive({ ...row });
            else { onSavePassive({ ...row }); setRow(EMPTY_PASSIVE); }
          }}
          disabled={!valid}
          className="flex-1 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white font-bold rounded-xl text-sm transition-colors shadow-sm shadow-violet-200"
        >
          {editingPassive ? '패시브 수정' : '패시브 추가'}
        </button>
        {editingPassive && (
          <button
            onClick={onCancelEdit}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 rounded-xl text-sm transition-colors"
          >
            취소
          </button>
        )}
      </div>
    </div>
  );
}

// ── 메인 export — 스킬/패시브 탭 (SkillMaker와 동일 props 시그니처) ──────
export default function SkillConceptMaker({
  editingSkill, onSave, onCancel,
  editingPassive, onSavePassive, onUpdatePassive, onCancelPassiveEdit,
}) {
  const [mode, setMode] = useState('skill');

  useEffect(() => { if (editingPassive) setMode('passive'); }, [editingPassive]);

  const editing = editingSkill || editingPassive;
  const MODES = [
    { id: 'skill',   label: '스킬 신청' },
    { id: 'passive', label: '패시브 신청' },
  ];

  return (
    <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-200/70 shadow-lg shadow-violet-100/20 p-5 space-y-4">
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-violet-300 font-mono tracking-widest">05</span>
            <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">스킬 / 패시브 신청</h2>
            {editing && (
              <span className="text-[11px] text-violet-700 bg-violet-50 border border-violet-200 rounded px-1.5 py-0.5">
                {editingPassive ? '패시브 편집 중' : '편집 중'}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">개념(이름·설명 등)만 작성하면 운영자가 제작합니다.</p>
        </div>
      </div>

      {!editing && (
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === m.id
                  ? 'bg-white text-violet-700 shadow-sm border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}

      {((mode === 'skill' && !editingPassive) || editingSkill) ? (
        <SkillConceptForm editingSkill={editingSkill} onSave={onSave} onCancel={onCancel} />
      ) : (
        <PassiveConceptForm
          editingPassive={editingPassive}
          onSavePassive={onSavePassive}
          onUpdatePassive={onUpdatePassive}
          onCancelEdit={onCancelPassiveEdit}
        />
      )}
    </div>
  );
}
