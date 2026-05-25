import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { withTimeout } from '../lib/withTimeout';

const AuthContext = createContext(null);
const AUTH_TIMEOUT_MS = 15000;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const mountedRef = useRef(true);
  const profileReqRef = useRef(0);

  /**
   * profiles 조회. 없으면 현재 user 정보로 upsert 시도.
   * 어떤 단계에서 실패하더라도 절대 throw 하지 않고 null 반환 — 앱 흐름이 멈추지 않게 한다.
   */
  const fetchProfile = useCallback(async (authUser) => {
    if (!supabase || !authUser?.id) {
      if (mountedRef.current) setProfile(null);
      return null;
    }
    const reqId = ++profileReqRef.current;
    const isLatest = () => mountedRef.current && reqId === profileReqRef.current;

    try {
      const { data, error } = await withTimeout(
        supabase
          .from('profiles')
          .select('id, display_name, role')
          .eq('id', authUser.id)
          .maybeSingle(),
        AUTH_TIMEOUT_MS
      );

      if (!isLatest()) return null;

      if (error) {
        // eslint-disable-next-line no-console
        console.warn('[Auth] profile 조회 실패:', error.message);
        setProfile(null);
        return null;
      }

      if (data) {
        setProfile(data);
        return data;
      }

      // profile이 없으면 한 번 upsert 시도. 실패해도 조용히 진행.
      const displayName = authUser.user_metadata?.display_name || '';
      try {
        const { data: upserted, error: upErr } = await withTimeout(
          supabase
            .from('profiles')
            .upsert(
              { id: authUser.id, display_name: displayName, role: 'user' },
              { onConflict: 'id' }
            )
            .select('id, display_name, role')
            .maybeSingle(),
          AUTH_TIMEOUT_MS
        );
        if (!isLatest()) return null;
        if (upErr) {
          // eslint-disable-next-line no-console
          console.warn('[Auth] profile upsert 실패 (RLS 등):', upErr.message);
          setProfile(null);
          return null;
        }
        setProfile(upserted || null);
        return upserted || null;
      } catch (e) {
        if (!isLatest()) return null;
        // eslint-disable-next-line no-console
        console.warn('[Auth] profile upsert 예외:', e.message);
        setProfile(null);
        return null;
      }
    } catch (e) {
      if (!isLatest()) return null;
      // eslint-disable-next-line no-console
      console.warn('[Auth] profile 조회 예외:', e.message);
      setProfile(null);
      return null;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    if (!supabase) {
      setLoading(false);
      return () => {
        mountedRef.current = false;
      };
    }

    // 초기 세션 부트스트랩. 어떤 경우에도 loading=false가 되도록 finally로 보장.
    (async () => {
      try {
        const { data, error } = await withTimeout(supabase.auth.getSession(), AUTH_TIMEOUT_MS);
        if (!mountedRef.current) return;
        if (error) {
          // eslint-disable-next-line no-console
          console.warn('[Auth] getSession 실패:', error.message);
        }
        const u = data?.session?.user || null;
        setUser(u);
        if (u) {
          // profile 조회 실패해도 무시
          await fetchProfile(u);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[Auth] 초기 세션 로드 예외:', e.message);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mountedRef.current) return;
      const u = session?.user || null;
      setUser(u);
      if (u) {
        setProfile(null);
        profileReqRef.current++;
        try {
          await fetchProfile(u);
        } catch {
          /* fetchProfile은 throw하지 않지만 방어용 */
        }
      } else {
        profileReqRef.current++;
        setProfile(null);
      }
    });

    return () => {
      mountedRef.current = false;
      profileReqRef.current++;
      sub?.subscription?.unsubscribe?.();
    };
  }, [fetchProfile]);

  /**
   * signIn: 결과를 항상 { data, error } 형태로 반환.
   * 네트워크/타임아웃 등 비정상 상황도 error로 매핑한다 (throw 하지 않음).
   */
  const signIn = useCallback(async (email, password) => {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase가 설정되지 않았습니다.' } };
    }
    try {
      const res = await withTimeout(
        supabase.auth.signInWithPassword({ email, password }),
        AUTH_TIMEOUT_MS
      );
      return { data: res?.data || null, error: res?.error || null };
    } catch (e) {
      return { data: null, error: { message: e?.message || '로그인 요청에 실패했습니다.' } };
    }
  }, []);

  const signUp = useCallback(async (email, password, displayName) => {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase가 설정되지 않았습니다.' } };
    }
    try {
      const res = await withTimeout(
        supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: displayName || '' } },
        }),
        AUTH_TIMEOUT_MS
      );
      const { data, error } = res || {};
      if (!error && data?.user) {
        // profile 자동 생성 시도 — 실패해도 회원가입 자체는 성공 처리.
        try {
          await withTimeout(
            supabase.from('profiles').upsert(
              { id: data.user.id, display_name: displayName || '', role: 'user' },
              { onConflict: 'id' }
            ),
            AUTH_TIMEOUT_MS
          );
        } catch {
          /* ignore */
        }
      }
      return { data: data || null, error: error || null };
    } catch (e) {
      return { data: null, error: { message: e?.message || '회원가입 요청에 실패했습니다.' } };
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return { error: null };
    try {
      const res = await withTimeout(supabase.auth.signOut(), AUTH_TIMEOUT_MS);
      profileReqRef.current++;
      setUser(null);
      setProfile(null);
      return { error: res?.error || null };
    } catch (e) {
      return { error: { message: e?.message || '로그아웃 요청에 실패했습니다.' } };
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) return fetchProfile(user);
    return null;
  }, [user, fetchProfile]);

  const value = {
    user,
    profile,
    loading,
    isAdmin: profile?.role === 'admin',
    isConfigured: isSupabaseConfigured,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
  return ctx;
}
