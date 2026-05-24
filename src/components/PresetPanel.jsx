import { useState } from 'react';
import { ACTIONS } from '../data/actions';
import { defaultStats } from '../data/stats';
import { defaultAbilities } from '../data/abilities';
import { defaultProficiencies } from '../data/proficiencies';

function buildPreset(action) {
  const abilities = action.mult.filter(m => !m.key.endsWith('숙련'));
  const profs     = action.mult.filter(m => m.key.endsWith('숙련'));

  const statPatch  = {};
  const abilPatch  = {};
  const profPatch  = {};

  if (action.base[0]) statPatch[action.base[0].stat] = 'C';
  if (action.base[1]) statPatch[action.base[1].stat] = 'D';
  if (abilities[0])   abilPatch[abilities[0].key] = 3;
  if (abilities[1])   abilPatch[abilities[1].key] = 1;
  if (abilities[2])   abilPatch[abilities[2].key] = 1;
  if (profs[0])       profPatch[profs[0].key] = 2;

  const statLine = [
    action.base[0] ? `${action.base[0].stat} C` : null,
    action.base[1] ? `${action.base[1].stat} D` : null,
  ].filter(Boolean).join(' / ');

  const abilLine = [
    abilities[0] ? `${abilities[0].key} 3` : null,
    abilities[1] ? `${abilities[1].key} 1` : null,
    abilities[2] ? `${abilities[2].key} 1` : null,
  ].filter(Boolean).join(' / ');

  const profLine = profs[0] ? `${profs[0].key} 2` : '';

  return {
    label: `${action.name} 추천형`,
    statLine,
    abilLine,
    profLine,
    statPatch,
    abilPatch,
    profPatch,
  };
}

const PRESETS = ACTIONS.map(buildPreset);

export default function PresetPanel({ onApply }) {
  const [open, setOpen]           = useState(false);
  const [selected, setSelected]   = useState(null);
  const [confirming, setConfirming] = useState(false);

  const handleApply = () => {
    if (!selected) return;
    setConfirming(true);
  };

  const handleConfirm = () => {
    const preset = PRESETS.find(p => p.label === selected);
    if (!preset) return;
    onApply(
      { ...defaultStats(), ...preset.statPatch },
      { ...defaultAbilities(), ...preset.abilPatch },
      { ...defaultProficiencies(), ...preset.profPatch },
    );
    setConfirming(false);
    setOpen(false);
    setSelected(null);
  };

  return (
    <>
      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-full max-w-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800">프리셋 적용 확인</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              <span className="font-semibold text-amber-700">{selected}</span>을 적용하면<br />
              현재 스탯·기능·숙련이 모두 초기화됩니다.<br />
              이름·종족·레벨·이면침식·스킬은 유지됩니다.
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

      {!open && (
        <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-amber-100/70 shadow-lg shadow-amber-100/20 px-5 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-xs font-semibold text-slate-700">초보자 프리셋</span>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              Lv1 기준 기본 빌드를 빠르게 적용합니다.
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="shrink-0 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-xs font-semibold rounded-xl transition-colors"
          >
            선택하기
          </button>
        </div>
      )}

      {open && (
        <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-amber-100/70 shadow-lg shadow-amber-100/20 p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-xs font-semibold text-slate-700">초보자 프리셋</span>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed max-w-xs">
                프리셋은 Lv1 기준으로 안전하게 시작할 수 있는 기본 배치입니다.
                기능은 여러 액션에 걸쳐 성장 경로를 만들고, 숙련은 특정 액션의 전문성을 높입니다.
              </p>
            </div>
            <button
              onClick={() => { setOpen(false); setSelected(null); }}
              className="shrink-0 text-slate-400 hover:text-slate-600 text-xs px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              닫기
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-72 overflow-y-auto pr-0.5">
            {PRESETS.map(preset => {
              const isSelected = selected === preset.label;
              return (
                <button
                  key={preset.label}
                  onClick={() => setSelected(isSelected ? null : preset.label)}
                  className={`text-left rounded-xl border px-3 py-2 transition-all ${
                    isSelected
                      ? 'bg-amber-400 border-amber-400 text-white'
                      : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50 text-slate-700'
                  }`}
                >
                  <p className={`text-[11px] font-bold leading-snug ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                    {preset.label}
                  </p>
                  <p className={`text-[10px] mt-1 leading-relaxed ${isSelected ? 'text-amber-100' : 'text-slate-500'}`}>
                    스탯: {preset.statLine}
                  </p>
                  <p className={`text-[10px] leading-relaxed ${isSelected ? 'text-amber-100' : 'text-slate-400'}`}>
                    기능: {preset.abilLine}
                  </p>
                  {preset.profLine && (
                    <p className={`text-[10px] leading-relaxed ${isSelected ? 'text-amber-100' : 'text-slate-400'}`}>
                      숙련: {preset.profLine}
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            <span className="text-[11px] text-slate-400 truncate pr-2">
              {selected ? `선택됨: ${selected}` : '프리셋을 선택하세요'}
            </span>
            <button
              onClick={handleApply}
              disabled={!selected}
              className={`shrink-0 px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
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
