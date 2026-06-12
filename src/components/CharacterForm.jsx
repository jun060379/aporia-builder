import { useState } from 'react';
import { LEVEL_TABLE } from '../data/levels';
import { FACTION_OPTIONS, DEFAULT_FACTION } from '../data/factions';

const RACE_OPTIONS = ['인간', '마녀', '흡혈귀', '요괴'];

const inputCls = "w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-sm focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20 outline-none placeholder:text-slate-400 transition-colors";
const selectCls = "w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-sm focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20 outline-none transition-colors cursor-pointer";

export default function CharacterForm({ char, onChange }) {
  const [nameSpaceWarning, setNameSpaceWarning] = useState(false);

  const field = (key) => (e) => onChange({ ...char, [key]: e.target.value });

  const handleNameChange = (e) => {
    const val = e.target.value;
    if (/\s/.test(val)) {
      setNameSpaceWarning(true);
      onChange({ ...char, name: val.replace(/\s/g, '') });
    } else {
      setNameSpaceWarning(false);
      onChange({ ...char, name: val });
    }
  };

  return (
    <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-200/70 shadow-lg shadow-violet-100/20 p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] text-violet-300 font-mono tracking-widest">01</span>
        <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">기본 정보</h2>
      </div>
      <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">캐릭터의 이름·종족·소속을 입력하고, 시뮬레이션할 레벨을 선택합니다.</p>

      <div className="grid grid-cols-2 gap-2.5">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 tracking-wide">이름 <span className="text-slate-400 font-normal">(별명 대응, 띄어쓰기 불가)</span></span>
          <input
            className={inputCls}
            value={char.name}
            onChange={handleNameChange}
            placeholder="별명 (띄어쓰기 없이)"
          />
          {nameSpaceWarning && (
            <span className="text-[11px] text-amber-600 leading-relaxed">
              이름칸에는 띄어쓰기 없는 대표명을 입력하고, 풀네임은 풀네임칸에 넣어주세요.
            </span>
          )}
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 tracking-wide">풀네임 <span className="text-slate-400 font-normal">(닉네임 DB 등록)</span></span>
          <input
            className={inputCls}
            value={char.fullName ?? ''}
            onChange={field('fullName')}
            placeholder="풀네임 (선택사항)"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 tracking-wide">종족</span>
          <select className={selectCls} value={char.race ?? ''} onChange={field('race')}>
            <option value="" disabled>종족 선택</option>
            {RACE_OPTIONS.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 tracking-wide">소속</span>
          <select className={selectCls} value={char.faction ?? DEFAULT_FACTION} onChange={field('faction')}>
            {FACTION_OPTIONS.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 tracking-wide">빌드 기준 레벨</span>
          <select className={selectCls} value={char.level ?? '1'} onChange={field('level')}>
            {LEVEL_TABLE.map(row => (
              <option key={row.level} value={String(row.level)}>
                Lv.{row.level} — 예산 {row.budget}pt
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 tracking-wide">이면침식</span>
          <input type="number" min="0" max="10" className={inputCls} value={char.erosion} onChange={field('erosion')} placeholder="0" />
        </label>
      </div>

      <p className="text-[11px] text-indigo-600 mt-2.5 leading-relaxed bg-indigo-50 rounded-xl px-3 py-1.5 border border-indigo-100">
        이 레벨은 신청 텍스트에 포함되지 않습니다. 해당 레벨의 성장예산으로 어떤 빌드가 가능한지 확인하기 위한 시뮬레이션 값입니다.
      </p>
      <p className="text-[11px] text-amber-700 mt-2 leading-relaxed bg-amber-50 rounded-xl px-3 py-1.5 border border-amber-100">
        이면침식은 스킬 최종값 배율에 영향을 주며, 10에 도달하면 로스트 처리됩니다.
      </p>
      <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
        별명은 디스코드 서버 별명 기준으로 자동 등록됩니다.
      </p>
    </div>
  );
}
