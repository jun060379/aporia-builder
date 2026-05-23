import { getLevelInfo } from '../data/levels';
import {
  calcStatCost, calcAbilityCost, calcProficiencyCost, calcSkillsCost,
} from '../utils/calcBudget';

function MiniCard({ label, value }) {
  return (
    <div className="bg-slate-800/50 rounded-xl border border-white/8 p-3 text-center">
      <p className="text-[10px] text-slate-500 tracking-wide mb-1">{label}</p>
      <p className="text-lg font-bold text-amber-200/80">{value}</p>
    </div>
  );
}

export default function BudgetSummary({ char, stats, abilities, proficiencies, skills }) {
  const { level, budget } = getLevelInfo(char.exp);
  const statCost  = calcStatCost(stats);
  const ablCost   = calcAbilityCost(abilities);
  const profCost  = calcProficiencyCost(proficiencies);
  const skillCost = calcSkillsCost(skills);
  const used      = statCost + ablCost + profCost + skillCost;
  const remaining = budget - used;
  const overBudget = remaining < 0;

  return (
    <div className="bg-slate-900/70 backdrop-blur-sm rounded-2xl border border-white/10 p-5 shadow-xl shadow-black/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-600 font-mono tracking-widest">—</span>
          <h2 className="text-sm font-semibold text-slate-300 tracking-wide uppercase">성장예산</h2>
        </div>
        <span className="text-xs text-slate-500 font-mono">Lv.{level} · {budget}pt</span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 mb-3">
        <MiniCard label="스탯" value={statCost} />
        <MiniCard label="기능" value={ablCost} />
        <MiniCard label="숙련" value={profCost} />
        <MiniCard label="스킬" value={skillCost} />
      </div>

      <div className="flex items-center justify-between text-sm border-t border-white/8 pt-3 mb-3">
        <span className="text-slate-400">사용점수</span>
        <span className="font-semibold text-slate-200 font-mono">{used} / {budget}</span>
      </div>

      <div className={`rounded-xl py-2.5 text-center font-bold text-base border transition-colors ${
        overBudget
          ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
      }`}>
        {overBudget ? `초과 ${Math.abs(remaining)}점` : `남은점수 ${remaining}점`}
      </div>

      {overBudget && (
        <p className="text-xs text-rose-400/80 text-center mt-2">예산을 초과했습니다.</p>
      )}
    </div>
  );
}
