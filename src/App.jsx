import { useState, useEffect, useCallback } from 'react';
import { defaultStats, STAT_NAMES, getStatValue } from './data/stats';
import { defaultAbilities } from './data/abilities';
import { defaultProficiencies } from './data/proficiencies';
import { getLevelByNumber } from './data/levels';
import { calcStatCost, calcAbilityCost, calcProficiencyCost, calcSkillsCost } from './utils/calcBudget';

import CharacterForm from './components/CharacterForm';
import PresetPanel from './components/PresetPanel';
import StatEditor from './components/StatEditor';
import AbilityEditor from './components/AbilityEditor';
import ProficiencyEditor from './components/ProficiencyEditor';
import BudgetSummary from './components/BudgetSummary';
import ActionTable from './components/ActionTable';
import ActionDetail from './components/ActionDetail';
import SkillMaker from './components/SkillMaker';
import SkillList from './components/SkillList';
import ApplicationText from './components/ApplicationText';
import SaveLoad from './components/SaveLoad';
import Checklist from './components/Checklist';
import ValidationPanel from './components/ValidationPanel';

// ── persistence ──────────────────────────────────────────
const STORAGE_KEY = 'aporia-builder-save-v1';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function buildSaveData(char, stats, abilities, proficiencies, skills) {
  return {
    version: 1,
    savedAt: new Date().toISOString(),
    char, stats, abilities, proficiencies, skills,
  };
}

const DEFAULT_CHAR = { name: '', race: '', level: '1', erosion: '0' };

// ── tabs ─────────────────────────────────────────────────
const TABS_LEFT  = ['캐릭터', '기능/숙련', '스킬'];
const TABS_RIGHT = ['요약', '액션표', '신청텍스트', '저장'];

function TabBar({ tabs, active, onChange, variant = 'warm' }) {
  const activeClass = variant === 'warm'
    ? 'bg-amber-50 text-amber-700 border border-amber-200 shadow-sm'
    : 'bg-violet-50 text-violet-700 border border-violet-200 shadow-sm';

  return (
    <div className="flex gap-1 bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/70 p-1 shadow-sm flex-wrap">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`flex-1 min-w-[60px] py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
            active === tab ? activeClass : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

function CharacterSummary({ char, stats }) {
  const levelInfo = getLevelByNumber(char.level);
  return (
    <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-indigo-100/70 shadow-lg shadow-violet-100/20 p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] text-violet-300 font-mono tracking-widest">—</span>
        <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">캐릭터 요약</h2>
      </div>
      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm mb-4">
        <span className="text-slate-400">이름</span>
        <span className="text-slate-900 font-semibold">{char.name || '—'}</span>
        <span className="text-slate-400">종족</span>
        <span className="text-slate-700">{char.race || '—'}</span>
        <span className="text-slate-400">빌드 레벨</span>
        <span className="text-amber-600 font-bold">Lv.{levelInfo.level} 기준</span>
        <span className="text-slate-400">성장예산</span>
        <span className="text-slate-700">{levelInfo.budget}pt</span>
      </div>
      <div className="border-t border-slate-100 pt-3">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">스탯</p>
        <div className="grid grid-cols-5 gap-1.5">
          {STAT_NAMES.map(s => (
            <div key={s} className="text-center bg-slate-50 rounded-xl py-2 border border-slate-100">
              <div className="text-[10px] text-slate-400 mb-0.5">{s}</div>
              <div className="text-sm font-bold text-amber-600">{stats[s]}</div>
              <div className="text-[10px] text-slate-400">{getStatValue(stats[s])}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── main app ─────────────────────────────────────────────
export default function App() {
  const saved = loadFromStorage();

  const [char, setChar]           = useState(saved?.char          ?? DEFAULT_CHAR);
  const [stats, setStats]         = useState(saved?.stats         ?? defaultStats());
  const [abilities, setAbilities] = useState(saved?.abilities     ?? defaultAbilities());
  const [proficiencies, setProficiencies] = useState(saved?.proficiencies ?? defaultProficiencies());
  const [skills, setSkills]       = useState(saved?.skills        ?? []);
  const [editingSkill, setEditingSkill] = useState(null);
  const [lastSaved, setLastSaved] = useState(saved?.savedAt       ?? null);

  const [leftTab, setLeftTab]   = useState('캐릭터');
  const [rightTab, setRightTab] = useState('요약');

  // derived budget
  const { budget } = getLevelByNumber(char.level);
  const remaining = budget
    - calcStatCost(stats)
    - calcAbilityCost(abilities)
    - calcProficiencyCost(proficiencies)
    - calcSkillsCost(skills);

  // ── auto-save ──
  useEffect(() => {
    const data = buildSaveData(char, stats, abilities, proficiencies, skills);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setLastSaved(data.savedAt);
  }, [char, stats, abilities, proficiencies, skills]);

  // ── export ──
  const handleExport = useCallback(() => {
    const data = buildSaveData(char, stats, abilities, proficiencies, skills);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = char.name ? `aporia-${char.name}.json` : 'aporia-character.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [char, stats, abilities, proficiencies, skills]);

  // ── import ──
  const handleImport = useCallback((data) => {
    if (!data || typeof data !== 'object') return false;
    if (data.char)          setChar({ ...DEFAULT_CHAR, ...data.char });
    if (data.stats)         setStats({ ...defaultStats(), ...data.stats });
    if (data.abilities)     setAbilities({ ...defaultAbilities(), ...data.abilities });
    if (data.proficiencies) setProficiencies({ ...defaultProficiencies(), ...data.proficiencies });
    if (Array.isArray(data.skills)) setSkills(data.skills);
    setEditingSkill(null);
  }, []);

  // ── reset ──
  const handleReset = useCallback(() => {
    setChar(DEFAULT_CHAR);
    setStats(defaultStats());
    setAbilities(defaultAbilities());
    setProficiencies(defaultProficiencies());
    setSkills([]);
    setEditingSkill(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // ── skill handlers ──
  const handleSaveSkill = (skill) => {
    if (editingSkill) {
      setSkills(prev => prev.map(s => s.id === skill.id ? skill : s));
      setEditingSkill(null);
    } else {
      setSkills(prev => [...prev, { ...skill, id: Date.now() }]);
    }
  };

  const handleEditSkill = (skill) => {
    setEditingSkill(skill);
    setLeftTab('스킬');
  };

  const handleRemoveSkill = (id) => {
    setSkills(prev => prev.filter(s => s.id !== id));
  };

  const handleCancelEdit = () => {
    setEditingSkill(null);
  };

  const handleApplyPreset = useCallback((presetStats, presetAbilities, presetProfs) => {
    setStats(presetStats);
    setAbilities(presetAbilities);
    setProficiencies(presetProfs);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-100 text-slate-900 relative">
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-100/60 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-200/50 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-100/40 rounded-full blur-2xl" />
      </div>

      {/* ── 헤더 ── */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/70 sticky top-0 z-20 shadow-sm shadow-slate-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
          <div>
            <div className="flex items-baseline gap-2.5">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent">
                APORIA
              </h1>
              <span className="text-slate-400 text-base font-light tracking-widest">BUILDER</span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-widest mt-0.5">Everyday / Unreality Character Sheet</p>
          </div>
          <p className="text-xs text-slate-400 italic hidden sm:block">
            돌아갈 일상이 있기에, 이면은 더욱 선명해진다.
          </p>
        </div>
      </header>

      <div className="flex flex-col xl:flex-row gap-3 xl:gap-6 p-3 xl:p-6 max-w-7xl mx-auto">

        {/* ── 왼쪽 패널 ── */}
        <div className="w-full xl:w-[440px] xl:shrink-0 space-y-3">
          <TabBar tabs={TABS_LEFT} active={leftTab} onChange={setLeftTab} variant="warm" />

          {leftTab === '캐릭터' && (
            <div className="space-y-3">
              <CharacterForm char={char} onChange={setChar} />
              <PresetPanel onApply={handleApplyPreset} />
              <StatEditor stats={stats} onChange={setStats} />
              <BudgetSummary char={char} stats={stats} abilities={abilities} proficiencies={proficiencies} skills={skills} editingSkill={editingSkill} />
            </div>
          )}

          {leftTab === '기능/숙련' && (
            <div className="space-y-3">
              <BudgetSummary char={char} stats={stats} abilities={abilities} proficiencies={proficiencies} skills={skills} editingSkill={editingSkill} />
              <AbilityEditor abilities={abilities} onChange={setAbilities} />
              <ProficiencyEditor proficiencies={proficiencies} onChange={setProficiencies} />
            </div>
          )}

          {leftTab === '스킬' && (
            <div className="space-y-3">
              <BudgetSummary char={char} stats={stats} abilities={abilities} proficiencies={proficiencies} skills={skills} editingSkill={editingSkill} />
              <SkillMaker editingSkill={editingSkill} stats={stats} onSave={handleSaveSkill} onCancel={handleCancelEdit} />
              <SkillList skills={skills} onEdit={handleEditSkill} onRemove={handleRemoveSkill} />
            </div>
          )}
        </div>

        {/* ── 오른쪽 패널 ── */}
        <div className="flex-1 min-w-0 space-y-3 xl:sticky xl:top-20 xl:self-start xl:max-h-[calc(100vh-5rem)] xl:overflow-y-auto xl:pb-4">
          <TabBar tabs={TABS_RIGHT} active={rightTab} onChange={setRightTab} variant="cool" />

          {rightTab === '요약' && (
            <div className="space-y-3">
              <CharacterSummary char={char} stats={stats} />
              <ValidationPanel char={char} remaining={remaining} skills={skills} stats={stats} abilities={abilities} proficiencies={proficiencies} editingSkill={editingSkill} />
              <ActionDetail stats={stats} abilities={abilities} proficiencies={proficiencies} />
            </div>
          )}

          {rightTab === '액션표' && (
            <ActionTable stats={stats} abilities={abilities} proficiencies={proficiencies} />
          )}

          {rightTab === '신청텍스트' && (
            <div className="space-y-3">
              <Checklist remaining={remaining} skills={skills} />
              <ApplicationText char={char} stats={stats} abilities={abilities} proficiencies={proficiencies} skills={skills} />
            </div>
          )}

          {rightTab === '저장' && (
            <SaveLoad
              onExport={handleExport}
              onImport={handleImport}
              onReset={handleReset}
              lastSaved={lastSaved}
            />
          )}
        </div>
      </div>
    </div>
  );
}
