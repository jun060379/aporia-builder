import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import AuthShell from './AuthShell.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!isConfigured) {
      setError('Supabase 환경 변수가 설정되지 않았습니다.');
      return;
    }
    setSubmitting(true);
    try {
      const { error: err } = await signIn(email.trim(), password);
      if (err) {
        setError(err.message || '로그인에 실패했습니다.');
        return;
      }
      navigate('/');
    } catch (err) {
      setError(err?.message || '로그인 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell title="로그인" subtitle="APORIA 포털에 로그인합니다.">
      <form onSubmit={onSubmit} className="space-y-4">
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
            autoComplete="current-password"
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

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-violet-200 hover:from-violet-700 hover:to-indigo-700 active:scale-[0.98] transition disabled:opacity-60"
        >
          {submitting ? '처리 중...' : '로그인'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-500">
        계정이 없으신가요?{' '}
        <Link to="/signup" className="text-violet-600 hover:underline">
          회원가입
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
