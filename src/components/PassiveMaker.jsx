import { useMemo, useState } from 'react';
import ConditionEditor from './ConditionEditor.jsx';

const inputCls = "w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-sm focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20 outline-none placeholder:text-slate-400 transition-colors";
const selectCls = "w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-sm focus:border-violet-400 outline-none transition-colors";

const OWNER_TYPES = [
  { value: 'global',    label: '공용 (global)' },
  { value: 'character', label: '캐릭터 (character)' },
  { value: 'faction',   label: '소속 (faction)' },
  { value: 'species',   label: '종족 (species)' },
];
const CATEGORIES  = ['판정보정', '피해보정', '회복보정', '저항', '트리거효과', '기타'];
const EFFECT_CODES = [
  '판정보정', '피해보정', '회복보정', '저항확률',
  '상태부여', '상태해제', '스택증가', '스택감소', '체력회복', '체력손상',
  '메시지', '기타'
];
const TRIGGERS = ['항상', '판정계산전', '판정시작', '판정후', '피해직전', '피해후', '세션종료', '수동'];

const HEADERS = [
  'key','이름','소유타입','소유키','해금레벨','분류','효과코드',
  '수치','최대','발동','판정','조건','효과','설명','메모'
];

const EMPTY = {
  key: '', 이름: '', 소유타입: 'global', 소유키: '*',
  해금레벨: '', 분류: '판정보정', 효과코드: '판정보정',
  수치: '', 최대: '', 발동: '판정계산전', 판정: '',
  조건: '', 효과: '', 설명: '', 메모: ''
};

export default function PassiveMaker() {
  const [row, setRow] = useState(EMPTY);
  const [copyMsg, setCopyMsg] = useState('');

  function field(key) {
    return (e) => setRow((r) => ({ ...r, [key]: e.target.value }));
  }

  const tsv = useMemo(() => {
    return HEADERS.map((h) => String(row[h] ?? '').replace(/\t/g, ' ').replace(/\r?\n/g, ' / ')).join('\t');
  }, [row]);

  const errors = useMemo(() => {
    const errs = [];
    if (!row.key.trim()) errs.push('key는 필수입니다.');
    if (/\s/.test(row.key.trim())) errs.push('key에 공백을 사용할 수 없습니다.');
    if (!row.이름.trim()) errs.push('이름은 필수입니다.');
    if (!row.소유타입) errs.push('소유타입은 필수입니다.');
    if (row.소유타입 !== 'global' && !row.소유키.trim()) errs.push('global이 아닐 때는 소유키가 필요합니다.');
    if (!row.분류) errs.push('분류는 필수입니다.');
    if (!row.효과코드) errs.push('효과코드는 필수입니다.');
    if (!row.발동) errs.push('발동 시점은 필수입니다.');
    return errs;
  }, [row]);

  async function copyTsv() {
    try {
      await navigator.clipboard.writeText(tsv);
      setCopyMsg('복사됨!');
      setTimeout(() => setCopyMsg(''), 1500);
    } catch {
      setCopyMsg('복사 실패');
    }
  }

  function reset() {
    setRow(EMPTY);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3 text-[11px] text-indigo-900 leading-relaxed">
        <p className="font-semibold text-indigo-700 mb-1">패시브 제작기</p>
        <p>15컬럼 TSV(탭 구분)를 생성합니다. Google Sheets의 <code>PASSIVE_SKILLS</code> 시트 마지막 행에 붙여넣으세요.</p>
        <p>존재하지 않으면 봇이 <code>!패시브목록</code> 등 호출 시 자동 생성합니다.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 tracking-wide">key (고유, 공백 불가)</span>
          <input className={inputCls} value={row.key} onChange={field('key')} placeholder="ex) blood_focus" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 tracking-wide">이름</span>
          <input className={inputCls} value={row.이름} onChange={field('이름')} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 tracking-wide">소유타입</span>
          <select className={selectCls} value={row.소유타입} onChange={field('소유타입')}>
            {OWNER_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 tracking-wide">소유키 (global=*, 그 외=대상 식별자)</span>
          <input className={inputCls} value={row.소유키} onChange={field('소유키')} placeholder="* 또는 캐릭터별명/소속명/종족명" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 tracking-wide">해금레벨 (빈칸=0)</span>
          <input className={inputCls} value={row.해금레벨} onChange={field('해금레벨')} placeholder="0" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 tracking-wide">분류</span>
          <select className={selectCls} value={row.분류} onChange={field('분류')}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 tracking-wide">효과코드</span>
          <select className={selectCls} value={row.효과코드} onChange={field('효과코드')}>
            {EFFECT_CODES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 tracking-wide">발동 시점</span>
          <select className={selectCls} value={row.발동} onChange={field('발동')}>
            {TRIGGERS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 tracking-wide">수치 (보정값 / 효과 강도)</span>
          <input className={inputCls} value={row.수치} onChange={field('수치')} placeholder="+2 또는 5" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-slate-500 tracking-wide">최대 (누적 상한, 빈칸=무제한)</span>
          <input className={inputCls} value={row.최대} onChange={field('최대')} placeholder="" />
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] text-slate-500 tracking-wide">판정 (적용 대상 판정 라벨, 콤마구분 또는 빈칸=전체)</span>
        <input className={inputCls} value={row.판정} onChange={field('판정')} placeholder="예: 스킬, 공격, 회피" />
      </label>

      <div className="space-y-1">
        <span className="text-[11px] text-slate-500 tracking-wide">조건</span>
        <ConditionEditor value={row.조건} onChange={(v) => setRow((r) => ({ ...r, 조건: v }))} />
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] text-slate-500 tracking-wide">효과 (트리거효과 분류일 때만 사용; 효과코드 + 인자)</span>
        <textarea className={`${inputCls} h-16 resize-none font-mono`} value={row.효과} onChange={field('효과')} placeholder="예) 상태부여 자기 집중 수치:1 횟수:1" />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] text-slate-500 tracking-wide">설명</span>
        <textarea className={`${inputCls} h-14 resize-none`} value={row.설명} onChange={field('설명')} placeholder="플레이어용 설명" />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] text-slate-500 tracking-wide">메모 (운영자용)</span>
        <textarea className={`${inputCls} h-12 resize-none`} value={row.메모} onChange={field('메모')} />
      </label>

      {errors.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1">
          <p className="text-[10px] text-amber-600 font-semibold uppercase tracking-widest">검증</p>
          {errors.map((e, i) => <p key={i} className="text-xs text-amber-700">⚠ {e}</p>)}
        </div>
      )}

      <div className="space-y-2 bg-slate-50 rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">TSV 출력 (탭 구분)</span>
          {copyMsg && <span className="text-[11px] text-emerald-600">{copyMsg}</span>}
        </div>
        <pre className="bg-slate-800 text-slate-100 rounded-lg p-3 text-[11px] whitespace-pre-wrap break-all leading-relaxed font-mono">
{tsv}
        </pre>
        <div className="text-[10px] text-slate-500">
          헤더: {HEADERS.join(' | ')}
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={copyTsv} className="flex-1 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm shadow-violet-200">
          TSV 복사
        </button>
        <button onClick={reset} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 rounded-xl text-sm transition-colors">
          초기화
        </button>
      </div>
    </div>
  );
}
