import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { withTimeout } from '../lib/withTimeout';

const AuthContext = createContext(null);
const AUTH_TIMEOUT_MS = 15000;
const PROFILE_TIMEOUT_MS = 8000;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  // loading은 "세션 확인 중"만을 의미한다. profile 조회는 백그라운드로 처리한다.
  const [loading, setLoading] = useState(true);
  // profileLoading: user 가 있고 profile 조회가 아직 끝나지 않은 상태.
  // isAdmin 같은 권한 게이트는 이 값이 false 가 될 때까지 판정을 미뤄야 한다.
  const [profileLoading, setProfileLoading] = useState(false);

  const mountedRef = useRef(true);
  const profileReqRef = useRef(0);
  // 현재 user.id를 기억해서 TOKEN_REFRESHED 같은 이벤트에서 같은 사용자면 profile을 재조회하지 않게 한다.
  const currentUserIdRef = useRef(null);

  /**
   * profiles 조회. 없으면 현재 user 정보로 upsert 시도.
   * 어떤 단계에서 실패하더라도 절대 throw 하지 않고 null 반환 — 앱 흐름이 멈추지 않게 한다.
   */
  const fetchProfile = useCallback(async (authUser) => {
    if (!supabase || !authUser?.id) {
      if (mountedRef.current) {
        setProfile(null);
        setProfileLoading(false);
      }
      return null;
    }
    const reqId = ++profileReqRef.current;
    const isLatest = () => mountedRef.current && reqId === profileReqRef.current;
    if (mountedRef.current) setProfileLoading(true);

    try {
      const { data, error } = await withTimeout(
        supabase
          .from('profiles')
          .select('id, display_name, role')
          .eq('id', authUser.id)
          .maybeSingle(),
        PROFILE_TIMEOUT_MS
      );

      if (!isLatest()) return null;

      if (error) {
        // eslint-disable-next-line no-console
        console.warn('[Auth] profile 조회 실패:', error.message);
        setProfileLoading(false);
        return null;
      }

      if (data) {
        setProfile(data);
        setProfileLoading(false);
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
          PROFILE_TIMEOUT_MS
        );
        if (!isLatest()) return null;
        if (upErr) {
          // eslint-disable-next-line no-console
          console.warn('[Auth] profile upsert 실패 (RLS 등):', upErr.message);
          setProfileLoading(false);
          return null;
        }
        if (upserted) setProfile(upserted);
        setProfileLoading(false);
        return upserted || null;
      } catch (e) {
        if (!isLatest()) return null;
        // eslint-disable-next-line no-console
        console.warn('[Auth] profile upsert 예외:', e.message);
        setProfileLoading(false);
        return null;
      }
    } catch (e) {
      if (!isLatest()) return null;
      // eslint-disable-next-line no-console
      console.warn('[Auth] profile 조회 예외:', e.message);
      setProfileLoading(false);
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

    // 초기 세션 부트스트랩.
    // ⚠ profile 조회는 await 하지 않는다 — getSession이 끝나는 즉시 loading=false 로 풀어서
    //   새로고침 후 가드된 페이지가 placeholder로 오래 깜빡이는 문제를 막는다.
    (async () => {
      try {
        const { data, error } = await withTimeout(supabase.auth.getSession(), AUTH_TIMEOUT_MS);
        if (!mountedRef.current) return;
        if (error) {
          // eslint-disable-next-line no-console
          console.warn('[Auth] getSession 실패:', error.message);
        }
        const u = data?.session?.user || null;
        currentUserIdRef.current = u?.id || null;
        setUser(u);
        if (u) {
          // 백그라운드에서 profile 채움. 결과는 setProfile 으로만 흘러간다.
          fetchProfile(u);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[Auth] 초기 세션 로드 예외:', e.message);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mountedRef.current) return;
      const u = session?.user || null;
      const nextId = u?.id || null;
      const prevId = currentUserIdRef.current;

      // SIGNED_OUT — 명시적 로그아웃 / 세션 만료
      if (event === 'SIGNED_OUT' || !u) {
        currentUserIdRef.current = null;
        profileReqRef.current++;
        setUser(null);
        setProfile(null);
        setProfileLoading(false);
        return;
      }

      // 같은 사용자에 대한 TOKEN_REFRESHED / USER_UPDATED / INITIAL_SESSION 등은
      // user 객체만 업데이트하고 profile 은 그대로 둔다 (깜빡임 방지).
      if (prevId && prevId === nextId) {
        setUser(u);
        return;
      }

      // 새 로그인 또는 사용자 변경
      currentUserIdRef.current = nextId;
      setUser(u);
      setProfile(null);
      profileReqRef.current++;
      fetchProfile(u);
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
            PROFILE_TIMEOUT_MS
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

  /**
   * signOut: UI는 즉시 비로그인 상태로 전환하고, supabase 호출은 백그라운드로.
   * 서버 응답을 기다리지 않아 "로그아웃 눌렀는데 한참 그대로" 문제를 막는다.
   */
  const signOut = useCallback(async () => {
    // 1) 로컬 상태 즉시 클리어 → UI 즉시 반영
    currentUserIdRef.current = null;
    profileReqRef.current++;
    setUser(null);
    setProfile(null);
    setProfileLoading(false);

    if (!supabase) return { error: null };

    // 2) 서버에는 백그라운드로 알림. 실패해도 UI는 이미 로그아웃 상태이지만,
    //    호출자가 복구/재시도 신호를 받을 수 있도록 error 는 그대로 전달한다.
    try {
      const res = await withTimeout(supabase.auth.signOut(), AUTH_TIMEOUT_MS);
      return { error: res?.error || null };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[Auth] signOut 네트워크 오류 (UI는 이미 로그아웃):', e?.message);
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
    profileLoading,
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
