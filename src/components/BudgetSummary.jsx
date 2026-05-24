import { getLevelByNumber } from '../data/levels';
import { calcStatCost, calcAbilityCost, calcProficiencyCost, calcSkillsCost } from '../utils/calcBudget';
import { RANK_MAP } from '../data/skillRanks';

function MiniCard({ label, value, accent }) {
  return (
    <div className={`rounded-xl border p-3 text-center ${accent ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-slate-100'}`}>
      <p className={`text-[10px] tracking-wide mb-1 ${accent ? 'text-indigo-400' : 'text-slate-400'}`}>{label}</p>
      <p className={`text-lg font-bold ${accent ? 'text-indigo-700' : 'text-slate-700'}`}>{value}</p>
    </div>
  );
}

export default function BudgetSummary({ char, stats, abilities, proficiencies, skills, editingSkill }) {
  const { level, budget } = getLevelByNumber(char.level);
  const statCost  = calcStatCost(stats);
  const ablCost   = calcAbilityCost(abilities);
  const profCost  = calcProficiencyCost(proficiencies);
  const skillCost = calcSkillsCost(skills);
  const used      = statCost + ablCost + profCost + skillCost;
  const remaining = budget - used;
  const overBudget = remaining < 0;

  const editingCost = editingSkill ? (RANK_MAP[editingSkill.rank] ?? 1) : 0;
  const usedWithSkill = used + editingCost;
  const remainingWithSkill = budget - usedWithSkill;
  const showSkillPreview = editingSkill != null;

  return (
    <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-200/70 shadow-lg shadow-violet-100/20 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-violet-300 font-mono tracking-widest">—</span>
          <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">성장예산</h2>
        </div>
        <span className="text-xs text-slate-400 font-mono">Lv.{level} 기준 · {budget}pt</span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 mb-3">
        <MiniCard label="스탯" value={statCost} />
        <MiniCard label="기능" value={ablCost} />
        <MiniCard label="숙련" value={profCost} />
        <MiniCard label="스킬" value={skillCost} />
      </div>

      <div className="flex items-center justify-between text-sm border-t border-slate-100 pt-3 mb-3">
        <span className="text-slate-500">사용점수</span>
        <span className="font-semibold text-slate-800 font-mono">{used} / {budget}</span>
      </div>

      <div className={`rounded-xl py-2.5 text-center font-bold text-base border transition-colors ${
        overBudget
          ? 'bg-rose-50 border-rose-200 text-rose-700'
          : 'bg-emerald-50 border-emerald-200 text-emerald-700'
      }`}>
        {overBudget ? `초과 ${Math.abs(remaining)}점` : `남은점수 ${remaining}점`}
      </div>

      {overBudget && (
        <p className="text-xs text-rose-500 text-center mt-2">예산을 초과했습니다.</p>
      )}

      {showSkillPreview && (
        <div className="mt-3 border-t border-slate-100 pt-3 space-y-2">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">현재 작성 중인 스킬 1개 기준</p>
          <div className="grid grid-cols-2 gap-1.5">
            <MiniCard label="본체 사용점수" value={used} />
            <MiniCard label={`스킬 비용 (${editingSkill.rank})`} value={`+${editingCost}`} accent />
          </div>
          <div className="flex items-center justify-between text-sm bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
            <span className="text-slate-500 text-xs">스킬 포함 예상 사용점수</span>
            <span className="font-semibold text-slate-800 font-mono text-xs">{usedWithSkill} / {budget}</span>
          </div>
          <div className={`rounded-xl py-2 text-center border transition-colors ${
            remainingWithSkill < 0
              ? 'bg-rose-50 border-rose-200'
              : 'bg-violet-50 border-violet-100'
          }`}>
            <p className={`text-[10px] mb-0.5 ${remainingWithSkill < 0 ? 'text-rose-400' : 'text-violet-400'}`}>
              스킬 포함 예상 남은점수
            </p>
            <p className={`text-sm font-bold ${remainingWithSkill < 0 ? 'text-rose-700' : 'text-violet-700'}`}>
              {remainingWithSkill < 0 ? `초과 ${Math.abs(remainingWithSkill)}pt` : `${remainingWithSkill}pt`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
