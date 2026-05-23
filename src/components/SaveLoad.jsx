import { useState, useRef } from 'react';

export default function SaveLoad({ onExport, onImport, onReset, lastSaved }) {
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const [showPaste, setShowPaste] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      tryImport(ev.target.result);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const tryImport = (text) => {
    setImportError('');
    setImportSuccess('');
    try {
      const data = JSON.parse(text);
      if (!data || typeof data !== 'object') throw new Error('올바른 JSON 객체가 아닙니다.');
      const result = onImport(data);
      if (result === false) throw new Error('데이터 형식이 맞지 않습니다.');
      setImportSuccess('불러오기 완료!');
      setImportText('');
      setShowPaste(false);
      setTimeout(() => setImportSuccess(''), 3000);
    } catch (err) {
      setImportError(`오류: ${err.message}`);
    }
  };

  const handlePasteImport = () => {
    if (!importText.trim()) {
      setImportError('JSON 내용을 입력해주세요.');
      return;
    }
    tryImport(importText);
  };

  const handleReset = () => {
    if (window.confirm('모든 입력 내용이 초기화됩니다. 계속하시겠습니까?')) {
      onReset();
    }
  };

  const formatTime = (iso) => {
    if (!iso) return null;
    try {
      const d = new Date(iso);
      return `${d.toLocaleDateString('ko-KR')} ${d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return null;
    }
  };

  return (
    <div className="bg-white/85 backdrop-blur-sm rounded-2xl border border-slate-200/70 shadow-lg shadow-violet-100/20 p-5 space-y-5">
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-violet-300 font-mono tracking-widest">—</span>
        <h2 className="text-sm font-semibold text-slate-700 tracking-wide uppercase">저장 / 불러오기</h2>
      </div>

      {/* 자동 저장 상태 */}
      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
        <div className="min-w-0">
          <p className="text-xs font-medium text-emerald-700">자동 저장 활성화됨</p>
          {lastSaved && (
            <p className="text-[11px] text-emerald-600/70 mt-0.5">마지막 저장: {formatTime(lastSaved)}</p>
          )}
        </div>
      </div>

      {/* JSON 내보내기 */}
      <div className="space-y-2">
        <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide">내보내기</p>
        <button
          onClick={onExport}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm shadow-indigo-200"
        >
          JSON 파일로 내보내기
        </button>
        <p className="text-[11px] text-slate-400">캐릭터 이름이 있으면 aporia-이름.json으로 저장됩니다.</p>
      </div>

      {/* JSON 가져오기 */}
      <div className="space-y-2">
        <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide">가져오기</p>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 min-w-[120px] py-2 bg-violet-50 hover:bg-violet-100 border border-violet-200 text-violet-700 font-semibold rounded-xl text-sm transition-colors"
          >
            파일 선택
          </button>
          <button
            onClick={() => { setShowPaste(v => !v); setImportError(''); setImportSuccess(''); }}
            className="flex-1 min-w-[120px] py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-semibold rounded-xl text-sm transition-colors"
          >
            {showPaste ? '붙여넣기 닫기' : 'JSON 붙여넣기'}
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={handleFileUpload}
        />

        {showPaste && (
          <div className="space-y-2">
            <textarea
              className="w-full h-28 bg-white border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs font-mono focus:border-violet-400 focus:ring-1 focus:ring-violet-400/20 outline-none placeholder:text-slate-400 resize-none transition-colors"
              value={importText}
              onChange={e => { setImportText(e.target.value); setImportError(''); }}
              placeholder='{"version":1, "char":{...}, ...} 형식의 JSON을 붙여넣으세요.'
            />
            <button
              onClick={handlePasteImport}
              className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl text-sm transition-colors"
            >
              가져오기 실행
            </button>
          </div>
        )}

        {importError && (
          <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{importError}</p>
        )}
        {importSuccess && (
          <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">✓ {importSuccess}</p>
        )}
      </div>

      {/* 초기화 */}
      <div className="space-y-2 border-t border-slate-100 pt-4">
        <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide">초기화</p>
        <button
          onClick={handleReset}
          className="w-full py-2 bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 hover:text-rose-700 font-semibold rounded-xl text-sm transition-colors"
        >
          전체 초기화
        </button>
        <p className="text-[11px] text-slate-400">모든 입력값이 초기 상태로 돌아갑니다.</p>
      </div>
    </div>
  );
}
