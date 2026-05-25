import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import AuthShell from './AuthShell.jsx';

export default function Signup() {
  const navigate = useNavigate();
  const { signUp, isConfigured } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    if (!isConfigured) {
      setError('Supabase 환경 변수가 설정되지 않았습니다.');
      return;
    }
    setSubmitting(true);
    const { data, error: err } = await signUp(email.trim(), password, displayName.trim());
    setSubmitting(false);
    if (err) {
      setError(err.message || '회원가입에 실패했습니다.');
      return;
    }
    if (data?.session) {
      navigate('/');
    } else {
      setNotice('가입이 완료되었습니다. 이메일 인증이 필요할 수 있습니다. 인증 후 로그인 페이지에서 로그인하세요.');
    }
  };

  return (
    <AuthShell title="회원가입" subtitle="APORIA 포털 계정을 만듭니다.">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="표시 이름">
          <input
            type="text"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200"
          />
        </Field>
        <Field label="이메일">
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200"
          />
        </Field>
        <Field label="비밀번호">
          <input
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200"
          />
        </Field>

        {error && (
          <p className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700">
            {error}
          </p>
        )}
        {notice && (
          <p className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-700">
            {notice}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-violet-200 hover:from-violet-700 hover:to-indigo-700 active:scale-[0.98] transition disabled:opacity-60"
        >
          {submitting ? '가입 중…' : '회원가입'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-500">
        이미 계정이 있나요?{' '}
        <Link to="/login" className="text-violet-600 hover:underline">
          로그인
        </Link>
      </p>
    </AuthShell>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-slate-600 mb-1">{label}</span>
      {children}
    </label>
  );
}
