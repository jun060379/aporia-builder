import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 마운트 여부 + 가장 마지막으로 시작된 profile 요청의 토큰. stale응답이 setState 못 하게 막는다.
  const mountedRef = useRef(true);
  const profileReqRef = useRef(0);

  const fetchProfile = useCallback(async (uid) => {
    if (!supabase || !uid) {
      if (mountedRef.current) setProfile(null);
      return null;
    }
    const reqId = ++profileReqRef.current;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, role')
        .eq('id', uid)
        .maybeSingle();

      // 더 새로운 요청이 시작되었거나 언마운트 됐으면 무시.
      if (!mountedRef.current || reqId !== profileReqRef.current) return null;

      if (error) {
        // eslint-disable-next-line no-console
        console.warn('[Auth] profile 조회 실패:', error.message);
        setProfile(null);
        return null;
      }
      setProfile(data || null);
      return data || null;
    } catch (e) {
      if (!mountedRef.current || reqId !== profileReqRef.current) return null;
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

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mountedRef.current) return;
      const u = session?.user || null;
      setUser(u);
      if (u) await fetchProfile(u.id);
      if (mountedRef.current) setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user || null;
      if (!mountedRef.current) return;

      setUser(u);
      if (u) {
        // 사용자 전환 시 이전 사용자의 profile이 잠깐 보이는 것을 막는다.
        setProfile(null);
        // 새 요청 토큰 발급. 진행 중인 이전 fetchProfile은 응답을 무시하게 된다.
        profileReqRef.current++;
        await fetchProfile(u.id);
      } else {
        // 로그아웃 시 진행 중인 fetch 무효화 + profile 초기화.
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

  const signIn = useCallback(async (email, password) => {
    if (!supabase) return { error: { message: 'Supabase가 설정되지 않았습니다.' } };
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  }, []);

  const signUp = useCallback(async (email, password, displayName) => {
    if (!supabase) return { error: { message: 'Supabase가 설정되지 않았습니다.' } };
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName || '' } },
    });
    if (!error && data?.user) {
      try {
        await supabase.from('profiles').upsert(
          { id: data.user.id, display_name: displayName || '', role: 'user' },
          { onConflict: 'id' }
        );
      } catch {
        /* RLS/트리거 환경이면 실패할 수 있으므로 조용히 처리 */
      }
    }
    return { data, error };
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    profileReqRef.current++;
    setUser(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user?.id) return fetchProfile(user.id);
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
