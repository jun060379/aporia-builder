import { useRef } from 'react';
import { EFFECT_PREFIXES, isEffectAutoApplicable } from '../lib/enemyText';

const BLOCKS = [
  { label: '상태 부여',     text: '상태템플릿부여 대상 상태명 수치:5 횟수:3' },
  { label: '자기 상태 부여', text: '상태템플릿부여 자신 상태명 수치:5 횟수:3' },
  { label: '스택 증가',     text: '스택증가 대상 스택명 +1 최대:5' },
  { label: '자기 스택 증가', text: '스택증가 자신 스택명 +1 최대:5' },
  { label: '스택 감소',     text: '스택감소 대상 스택명 -1' },
  { label: '피해',          text: '피해 대상 5' },
  { label: '회복',          text: '회복 자신 10' },
  { label: '보호막',        text: '상태템플릿부여 자신 보호막 수치:20 최대:20 횟수:2' },
  { label: '출혈',          text: '상태템플릿부여 대상 출혈 수치:5 횟수:3' },
  { label: '구속',          text: '상태템플릿부여 대상 구속 횟수:1' },
];

function insertAtCursor(textareaEl, current, insertText) {
  const isFocused = textareaEl && typeof document !== 'undefined' && document.activeElement === textareaEl;
  if (!textareaEl || !isFocused) {
    const sep = current && !current.endsWith('\n') ? '\n' : '';
    return { value: current + sep + insertText, caret: (current + sep + insertText).length };
  }
  const start = textareaEl.selectionStart ?? current.length;
  const end = textareaEl.selectionEnd ?? current.length;
  const before = current.slice(0, start);
  const after = current.slice(end);
  const needLeadingNL = before.length > 0 && !before.endsWith('\n');
  const needTrailingNL = after.length > 0 && !after.startsWith('\n');
  const chunk = `${needLeadingNL ? '\n' : ''}${insertText}${needTrailingNL ? '\n' : ''}`;
  const value = before + chunk + after;
  const caret = (before + chunk).length;
  return { value, caret };
}

export default function EnemySkillEffectBuilder({ value, onChange, textareaRef }) {
  const internalRef = useRef(null);
  const ref = textareaRef || internalRef;

  const handleInsert = (text) => {
    const el = ref.current;
    const { value: next, caret } = insertAtCursor(el, value || '', text);
    onChange(next);
    requestAnimationFrame(() => {
      if (el) {
        el.focus();
        try { el.setSelectionRange(caret, caret); } catch { /* noop */ }
      }
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {BLOCKS.map((b) => (
          <button
            key={b.label}
            type="button"
            onClick={() => handleInsert(b.text)}
            className="rounded-full border border-indigo-200 bg-indigo-50/70 px-2.5 py-1 text-[11px] text-indigo-700 hover:bg-indigo-100 active:scale-[0.98] transition"
            title={b.text}
          >
            + {b.label}
          </button>
        ))}
      </div>
      <p className="text-[11px] text-slate-400">
        버튼을 누르면 현재 커서 위치에 효과 문법이 삽입됩니다. 자동 적용 가능한 접두어: {EFFECT_PREFIXES.join(' / ')}
      </p>
    </div>
  );
}

export { isEffectAutoApplicable };
