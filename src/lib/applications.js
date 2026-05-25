import { supabase } from './supabaseClient';
import { withTimeout } from './withTimeout';

const REQ_TIMEOUT_MS = 15000;

const APP_TYPES = new Set(['character_data', 'enemy_template', 'enemy_skill']);
const APP_STATUSES = new Set(['pending', 'approved', 'rejected', 'needs_revision']);

function ensureSupabase() {
  if (!supabase) {
    const err = new Error('Supabase가 설정되지 않았습니다.');
    err.code = 'NO_SUPABASE';
    throw err;
  }
}

async function getCurrentUser() {
  ensureSupabase();
  const { data, error } = await withTimeout(supabase.auth.getUser(), REQ_TIMEOUT_MS);
  if (error) throw new Error(error.message || '사용자 정보를 가져올 수 없습니다.');
  if (!data?.user) {
    const e = new Error('로그인이 필요합니다.');
    e.code = 'NOT_AUTHENTICATED';
    throw e;
  }
  return data.user;
}

/**
 * 신청 생성. 현재 로그인 유저가 없으면 에러.
 * @returns {{ data, error }}
 */
export async function createApplication({ type, title, payload, outputText }) {
  try {
    if (!APP_TYPES.has(type)) {
      return { data: null, error: { message: `허용되지 않은 type: ${type}` } };
    }
    const user = await getCurrentUser();
    const row = {
      user_id: user.id,
      type,
      title: title || '제목 없음',
      payload: payload ?? null,
      output_text: outputText ?? null,
      status: 'pending',
    };
    const { data, error } = await withTimeout(
      supabase.from('applications').insert(row).select('*').maybeSingle(),
      REQ_TIMEOUT_MS
    );
    if (error) return { data: null, error };
    return { data, error: null };
  } catch (e) {
    return { data: null, error: { message: e?.message || '신청 생성에 실패했습니다.', code: e?.code } };
  }
}

/**
 * 현재 유저의 신청 목록 (최신순).
 */
export async function getMyApplications() {
  try {
    const user = await getCurrentUser();
    const { data, error } = await withTimeout(
      supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      REQ_TIMEOUT_MS
    );
    if (error) return { data: [], error };
    return { data: data || [], error: null };
  } catch (e) {
    return { data: [], error: { message: e?.message || '신청 목록을 불러오지 못했습니다.', code: e?.code } };
  }
}

/**
 * 관리자용 전체 신청 목록 (최신순).
 * 실제 권한은 Supabase RLS에서 강제되어야 한다.
 */
export async function getAdminApplications() {
  try {
    ensureSupabase();
    const { data, error } = await withTimeout(
      supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false }),
      REQ_TIMEOUT_MS
    );
    if (error) return { data: [], error };
    return { data: data || [], error: null };
  } catch (e) {
    return { data: [], error: { message: e?.message || '관리자 신청 목록을 불러오지 못했습니다.' } };
  }
}

/**
 * 관리자 전용: 신청 상태 변경 + 코멘트 저장.
 */
export async function updateApplicationStatus({ id, status, reviewComment }) {
  try {
    if (!APP_STATUSES.has(status)) {
      return { data: null, error: { message: `허용되지 않은 status: ${status}` } };
    }
    const user = await getCurrentUser();
    const patch = {
      status,
      review_comment: reviewComment ?? null,
      reviewer_id: user.id,
      reviewed_at: new Date().toISOString(),
    };
    const { data, error } = await withTimeout(
      supabase
        .from('applications')
        .update(patch)
        .eq('id', id)
        .select('*')
        .maybeSingle(),
      REQ_TIMEOUT_MS
    );
    if (error) return { data: null, error };
    return { data, error: null };
  } catch (e) {
    return { data: null, error: { message: e?.message || '상태 변경에 실패했습니다.' } };
  }
}

/**
 * 관리자 전용: 승인 = 서버 API(/api/approve-application) 호출 →
 * Apps Script Webhook으로 실제 등록 → 성공 시 Supabase status=approved.
 */
export async function approveApplicationViaApi({ id, reviewComment }) {
  try {
    ensureSupabase();
    const { data: sessionData, error: sErr } = await withTimeout(
      supabase.auth.getSession(),
      REQ_TIMEOUT_MS,
    );
    if (sErr) return { ok: false, error: sErr.message || '세션을 가져올 수 없습니다.' };
    const accessToken = sessionData?.session?.access_token;
    if (!accessToken) return { ok: false, error: '로그인이 필요합니다.' };

    const resp = await withTimeout(
      fetch('/api/approve-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ applicationId: id, reviewComment: reviewComment ?? '' }),
      }),
      30000,
    );

    let json = null;
    try { json = await resp.json(); } catch { /* noop */ }

    if (!resp.ok || !json || json.ok !== true) {
      return { ok: false, error: json?.error || `요청 실패 (HTTP ${resp.status})` };
    }
    return { ok: true, message: json.message, registeredType: json.registeredType, registeredKey: json.registeredKey };
  } catch (e) {
    return { ok: false, error: e?.message || '승인 요청 중 오류가 발생했습니다.' };
  }
}

// ───── 표시용 라벨 ─────
export const TYPE_LABEL = {
  character_data: '캐릭터 데이터',
  enemy_template: '에너미 템플릿',
  enemy_skill: '에너미 스킬',
};

export const STATUS_LABEL = {
  pending: '대기중',
  approved: '승인됨',
  rejected: '반려됨',
  needs_revision: '수정 요청',
};

export const STATUS_BADGE_CLASS = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  needs_revision: 'bg-sky-50 text-sky-700 border-sky-200',
};
