import { useState } from 'react';
import { defaultStats } from '../data/stats';
import { defaultAbilities } from '../data/abilities';
import { defaultProficiencies } from '../data/proficiencies';

const PRESETS = [
  {
    label: '참격 근접형',
    sub: '근력C · 민첩D',
    detail: '무기술 3 · 기동술 1 · 참격숙련 2',
    stats: { 근력: 'C', 민첩: 'D' },
    abilities: { 무기술: 3, 기동술: 1 },
    profs: { 참격숙련: 2 },
  },
  {
    label: '관통 기동형',
    sub: '민첩C · 감각D',
    detail: '무기술 3 · 관찰 1 · 관통숙련 2',
    stats: { 민첩: 'C', 감각: 'D' },
    abilities: { 무기술: 3, 관찰: 1 },
    profs: { 관통숙련: 2 },
  },
  {
    label: '타격 중장형',
    sub: '근력C · 내구D',
    detail: '무기술 3 · 인내 1 · 타격숙련 2',
    stats: { 근력: 'C', 내구: 'D' },
    abilities: { 무기술: 3, 인내: 1 },
    profs: { 타격숙련: 2 },
  },
  {
    label: '격투형',
    sub: '근력C · 민첩D',
    detail: '격투술 3 · 기동술 1 · 격투숙련 2',
    stats: { 근력: 'C', 민첩: 'D' },
    abilities: { 격투술: 3, 기동술: 1 },
    profs: { 격투숙련: 2 },
  },
  {
    label: '사격형',
    sub: '감각C · 민첩D',
    detail: '사격술 3 · 관찰 1 · 사격숙련 2',
    stats: { 감각: 'C', 민첩: 'D' },
    abilities: { 사격술: 3, 관찰: 1 },
    profs: { 사격숙련: 2 },
  },
  {
    label: '방어형',
    sub: '내구C · 근력D',
    detail: '방어술 3 · 무기술 1 · 방어숙련 2',
    stats: { 내구: 'C', 근력: 'D' },
    abilities: { 방어술: 3, 무기술: 1 },
    profs: { 방어숙련: 2 },
  },
  {
    label: '회피형',
    sub: '민첩C · 감각D',
    detail: '기동술 3 · 관찰 1 · 회피숙련 2',
    stats: { 민첩: 'C', 감각: 'D' },
    abilities: { 기동술: 3, 관찰: 1 },
    profs: { 회피숙련: 2 },
  },
  {
    label: '저항형',
    sub: '내구C · 지능D',
    detail: '인내 3 · 이면학 1 · 저항숙련 2',
    stats: { 내구: 'C', 지능: 'D' },
    abilities: { 인내: 3, 이면학: 1 },
    profs: { 저항숙련: 2 },
  },
  {
    label: '조사형',
    sub: '감각C · 지능D',
    detail: '관찰 3 · 지식 1 · 조사숙련 2',
    stats: { 감각: 'C', 지능: 'D' },
    abilities: { 관찰: 3, 지식: 1 },
    profs: { 조사숙련: 2 },
  },
  {
    label: '해석형',
    sub: '지능C · 감각D',
    detail: '이면학 3 · 지식 1 · 해석숙련 2',
    stats: { 지능: 'C', 감각: 'D' },
    abilities: { 이면학: 3, 지식: 1 },
    profs: { 해석숙련: 2 },
  },
  {
    label: '은신형',
    sub: '민첩C · 감각D',
    detail: '은밀행동 3 · 기동술 1 · 은신숙련 2',
    stats: { 민첩: 'C', 감각: 'D' },
    abilities: { 은밀행동: 3, 기동술: 1 },
    profs: { 은신숙련: 2 },
  },
  {
    label: '추적형',
    sub: '감각C · 민첩D',
    detail: '추적술 3 · 관찰 1 · 추적숙련 2',
    stats: { 감각: 'C', 민첩: 'D' },
    abilities: { 추적술: 3, 관찰: 1 },
    profs: { 추적숙련: 2 },
  },
  {
    label: '설득형',
    sub: '지능C · 감각D',
    detail: '화술 3 · 관찰 1 · 설득숙련 2',
    stats: { 지능: 'C', 감각: 'D' },
    abilities: { 화술: 3, 관찰: 1 },
    profs: { 설득숙련: 2 },
  },
];

export default function PresetPanel({ onApply }) {
  const [confirmed, setConfirmed] = useState(null);

  const handleClick = (preset) => {
    if (confirmed === preset.label) {
      const stats = { ...defaultStats(), ...preset.stats };
      const abilities = { ...defaultAbilities(), ...preset.abilities };
      const profs = { ...defaultProficiencies(), ...preset.profs };
      onApply(stats, abilities, profs);
      setConfirmed(null);
    } else {
      setConfirmed(preset.label);
    }
  };

  return (
    <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-amber-100/70 shadow-lg shadow-amber-100/20 p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] text-amber-300 font-mono tracking-widest">PR</span>
        <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">초보자 프리셋</h2>
      </div>
      <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
        프리셋은 Lv1 기준으로 안전하게 시작할 수 있는 기본 배치입니다. 적용 후 세부 수치를 자유롭게 조정할 수 있습니다.
      </p>
      <p className="text-[11px] text-amber-700 bg-amber-50 rounded-xl px-3 py-1.5 border border-amber-100 mb-3 leading-relaxed">
        이름·종족·레벨·이면침식은 유지됩니다. 스탯·기능·숙련만 교체됩니다.
        버튼을 한 번 누르면 선택, 한 번 더 누르면 적용됩니다.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {PRESETS.map(preset => {
          const isSelected = confirmed === preset.label;
          return (
            <button
              key={preset.label}
              onClick={() => handleClick(preset)}
              className={`text-left rounded-xl border px-3 py-2.5 transition-all ${
                isSelected
                  ? 'bg-amber-400 border-amber-400 text-white shadow-sm shadow-amber-200/50'
                  : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50 text-slate-700'
              }`}
            >
              <p className={`text-xs font-bold leading-snug ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                {isSelected ? '한 번 더 누르면 적용' : preset.label}
              </p>
              <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-amber-100' : 'text-amber-600'}`}>
                {preset.sub}
              </p>
              <p className={`text-[10px] mt-0.5 leading-relaxed ${isSelected ? 'text-amber-100' : 'text-slate-400'}`}>
                {preset.detail}
              </p>
            </button>
          );
        })}
      </div>

      {confirmed && (
        <button
          onClick={() => setConfirmed(null)}
          className="mt-2 w-full text-[11px] text-slate-400 hover:text-slate-600 py-1 transition-colors"
        >
          취소
        </button>
      )}
    </div>
  );
}
