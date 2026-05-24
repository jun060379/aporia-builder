import { useState } from 'react';
import { defaultStats } from '../data/stats';
import { defaultAbilities } from '../data/abilities';
import { defaultProficiencies } from '../data/proficiencies';

const PRESETS = [
  { label: '참격 근접형', sub: '근력C · 민첩D · 무기술3 · 참격숙련2', stats: { 근력: 'C', 민첩: 'D' }, abilities: { 무기술: 3, 기동술: 1 }, profs: { 참격숙련: 2 } },
  { label: '관통 기동형', sub: '민첩C · 감각D · 무기술3 · 관통숙련2', stats: { 민첩: 'C', 감각: 'D' }, abilities: { 무기술: 3, 관찰: 1 }, profs: { 관통숙련: 2 } },
  { label: '타격 중장형', sub: '근력C · 내구D · 무기술3 · 타격숙련2', stats: { 근력: 'C', 내구: 'D' }, abilities: { 무기술: 3, 인내: 1 }, profs: { 타격숙련: 2 } },
  { label: '격투형',     sub: '근력C · 민첩D · 격투술3 · 격투숙련2', stats: { 근력: 'C', 민첩: 'D' }, abilities: { 격투술: 3, 기동술: 1 }, profs: { 격투숙련: 2 } },
  { label: '사격형',     sub: '감각C · 민첩D · 사격술3 · 사격숙련2', stats: { 감각: 'C', 민첩: 'D' }, abilities: { 사격술: 3, 관찰: 1 }, profs: { 사격숙련: 2 } },
  { label: '방어형',     sub: '내구C · 근력D · 방어술3 · 방어숙련2', stats: { 내구: 'C', 근력: 'D' }, abilities: { 방어술: 3, 무기술: 1 }, profs: { 방어숙련: 2 } },
  { label: '회피형',     sub: '민첩C · 감각D · 기동술3 · 회피숙련2', stats: { 민첩: 'C', 감각: 'D' }, abilities: { 기동술: 3, 관찰: 1 }, profs: { 회피숙련: 2 } },
  { label: '저항형',     sub: '내구C · 지능D · 인내3 · 저항숙련2',   stats: { 내구: 'C', 지능: 'D' }, abilities: { 인내: 3, 이면학: 1 }, profs: { 저항숙련: 2 } },
  { label: '조사형',     sub: '감각C · 지능D · 관찰3 · 조사숙련2',   stats: { 감각: 'C', 지능: 'D' }, abilities: { 관찰: 3, 지식: 1 }, profs: { 조사숙련: 2 } },
  { label: '해석형',     sub: '지능C · 감각D · 이면학3 · 해석숙련2', stats: { 지능: 'C', 감각: 'D' }, abilities: { 이면학: 3, 지식: 1 }, profs: { 해석숙련: 2 } },
  { label: '은신형',     sub: '민첩C · 감각D · 은밀행동3 · 은신숙련2', stats: { 민첩: 'C', 감각: 'D' }, abilities: { 은밀행동: 3, 기동술: 1 }, profs: { 은신숙련: 2 } },
  { label: '추적형',     sub: '감각C · 민첩D · 추적술3 · 추적숙련2', stats: { 감각: 'C', 민첩: 'D' }, abilities: { 추적술: 3, 관찰: 1 }, profs: { 추적숙련: 2 } },
  { label: '설득형',     sub: '지능C · 감각D · 화술3 · 설득숙련2',   stats: { 지능: 'C', 감각: 'D' }, abilities: { 화술: 3, 관찰: 1 }, profs: { 설득숙련: 2 } },
];

export default function PresetPanel({ onApply }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const handleApply = () => {
    if (!selected) return;
    setConfirming(true);
  };

  const handleConfirm = () => {
    const preset = PRESETS.find(p => p.label === selected);
    if (!preset) return;
    onApply(
      { ...defaultStats(), ...preset.stats },
      { ...defaultAbilities(), ...preset.abilities },
      { ...defaultProficiencies(), ...preset.profs },
    );
    setConfirming(false);
    setOpen(false);
    setSelected(null);
  };

  return (
    <>
      {/* 확인 모달 */}
      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-full max-w-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800">프리셋 적용 확인</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              <span className="font-semibold text-amber-700">{selected}</span> 프리셋을 적용하면<br />
              현재 스탯·기능·숙련이 모두 초기화됩니다.<br />
              이름·종족·레벨·이면침식은 유지됩니다.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirming(false)}
                className="px-4 py-1.5 rounded-lg text-xs border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-1.5 rounded-lg text-xs bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors"
              >
                적용
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 접힌 상태 — 단일 카드 크기 */}
      {!open && (
        <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-amber-100/70 shadow-lg shadow-amber-100/20 px-5 py-3 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-700">초보자 프리셋</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Lv1 기준 기본 빌드를 빠르게 적용합니다.</p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="shrink-0 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-xs font-semibold rounded-xl transition-colors"
          >
            선택하기
          </button>
        </div>
      )}

      {/* 열린 상태 — 프리셋 선택 + 적용 */}
      {open && (
        <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-amber-100/70 shadow-lg shadow-amber-100/20 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-700">초보자 프리셋</span>
              <p className="text-[11px] text-slate-400 mt-0.5">프리셋을 선택한 후 적용 버튼을 누르세요.</p>
            </div>
            <button
              onClick={() => { setOpen(false); setSelected(null); }}
              className="text-slate-400 hover:text-slate-600 text-sm px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              닫기
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5 max-h-64 overflow-y-auto pr-0.5">
            {PRESETS.map(preset => {
              const isSelected = selected === preset.label;
              return (
                <button
                  key={preset.label}
                  onClick={() => setSelected(isSelected ? null : preset.label)}
                  className={`text-left rounded-xl border px-3 py-2 transition-all text-[11px] ${
                    isSelected
                      ? 'bg-amber-400 border-amber-400 text-white'
                      : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50 text-slate-700'
                  }`}
                >
                  <p className={`font-bold leading-snug ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                    {preset.label}
                  </p>
                  <p className={`mt-0.5 leading-relaxed ${isSelected ? 'text-amber-100' : 'text-slate-400'}`}>
                    {preset.sub}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            <span className="text-[11px] text-slate-400">
              {selected ? `선택됨: ${selected}` : '프리셋을 선택하세요'}
            </span>
            <button
              onClick={handleApply}
              disabled={!selected}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                selected
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-200'
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
              }`}
            >
              적용
            </button>
          </div>
        </div>
      )}
    </>
  );
}
