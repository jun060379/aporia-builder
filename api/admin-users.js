import { createClient } from '@supabase/supabase-js';

function sendJson(res, status, obj) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(obj));
}

function getSupabaseUrl() {
  return process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string' && req.body.length > 0) {
    try { return JSON.parse(req.body); } catch { return null; }
  }
  return await new Promise((resolve) => {
    let buf = '';
    req.setEncoding && req.setEncoding('utf8');
    req.on('data', (c) => { buf += c; });
    req.on('end', () => {
      if (!buf) return resolve({});
      try { resolve(JSON.parse(buf)); } catch { resolve(null); }
    });
    req.on('error', () => resolve(null));
  });
}

const ALLOWED_ACTIONS = new Set(['list', 'setRole']);
const ALLOWED_ROLES = new Set(['admin', 'user']);

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return sendJson(res, 405, { ok: false, error: 'Method Not Allowed' });
    }

    const supabaseUrl = getSupabaseUrl();
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
      return sendJson(res, 500, { ok: false, error: 'Supabase 서버 환경변수가 설정되지 않았습니다.' });
    }

    const authHeader = req.headers['authorization'] || req.headers['Authorization'] || '';
    const m = /^Bearer\s+(.+)$/i.exec(String(authHeader).trim());
    if (!m) return sendJson(res, 401, { ok: false, error: '인증 토큰이 없습니다.' });
    const accessToken = m[1];

    const body = await readJsonBody(req);
    if (!body || typeof body !== 'object') {
      return sendJson(res, 400, { ok: false, error: '요청 본문을 해석할 수 없습니다.' });
    }
    const action = String(body.action || '').trim();
    if (!ALLOWED_ACTIONS.has(action)) {
      return sendJson(res, 400, { ok: false, error: '허용되지 않은 action: ' + action });
    }

    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // 호출자 인증 + 관리자 검증
    const { data: userResp, error: userErr } = await admin.auth.getUser(accessToken);
    if (userErr || !userResp?.user) {
      return sendJson(res, 401, { ok: false, error: '유효하지 않은 인증 토큰입니다.' });
    }
    const callerId = userResp.user.id;

    const { data: callerProfile, error: profErr } = await admin
      .from('profiles')
      .select('role')
      .eq('id', callerId)
      .maybeSingle();
    if (profErr) {
      return sendJson(res, 500, { ok: false, error: 'profiles 조회 실패: ' + (profErr.message || '') });
    }
    if (!callerProfile || callerProfile.role !== 'admin') {
      return sendJson(res, 403, { ok: false, error: '관리자 권한이 필요합니다.' });
    }

    // ── list: 모든 사용자(프로필 + 이메일) ──
    if (action === 'list') {
      const { data: profiles, error: listErr } = await admin
        .from('profiles')
        .select('id, display_name, role, character_alias');
      if (listErr) {
        return sendJson(res, 500, { ok: false, error: '프로필 목록 조회 실패: ' + (listErr.message || '') });
      }

      // auth.users 에서 이메일 매핑 (페이지네이션 — 최대 수천 명 가정)
      const emailById = {};
      try {
        let page = 1;
        const perPage = 200;
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { data: usersPage, error: uErr } = await admin.auth.admin.listUsers({ page, perPage });
          if (uErr) break;
          const users = usersPage?.users || [];
          users.forEach((u) => { emailById[u.id] = u.email || ''; });
          if (users.length < perPage) break;
          page += 1;
          if (page > 50) break; // 안전장치
        }
      } catch { /* 이메일 매핑 실패는 무시 */ }

      const rows = (profiles || []).map((p) => ({
        id: p.id,
        email: emailById[p.id] || '',
        displayName: p.display_name || '',
        alias: p.character_alias || '',
        role: p.role || 'user',
        isSelf: p.id === callerId,
      })).sort((a, b) => {
        // 관리자 먼저, 그 다음 이메일순
        if ((b.role === 'admin') - (a.role === 'admin') !== 0) {
          return (b.role === 'admin') - (a.role === 'admin');
        }
        return (a.email || a.displayName).localeCompare(b.email || b.displayName);
      });

      return sendJson(res, 200, { ok: true, users: rows });
    }

    // ── setRole: 특정 사용자 권한 변경 ──
    if (action === 'setRole') {
      const targetId = String(body.userId || '').trim();
      const role = String(body.role || '').trim();
      if (!targetId) return sendJson(res, 400, { ok: false, error: 'userId가 필요합니다.' });
      if (!ALLOWED_ROLES.has(role)) {
        return sendJson(res, 400, { ok: false, error: "role은 'admin' 또는 'user'여야 합니다." });
      }
      // 자기 자신의 관리자 권한 해제 방지 (잠금 사고 방지)
      if (targetId === callerId && role !== 'admin') {
        return sendJson(res, 400, { ok: false, error: '자기 자신의 관리자 권한은 해제할 수 없습니다.' });
      }

      const { data: updated, error: updErr } = await admin
        .from('profiles')
        .update({ role })
        .eq('id', targetId)
        .select('id, role')
        .maybeSingle();
      if (updErr) {
        return sendJson(res, 500, { ok: false, error: '권한 변경 실패: ' + (updErr.message || '') });
      }
      if (!updated) {
        return sendJson(res, 404, { ok: false, error: '대상 사용자를 찾을 수 없습니다.' });
      }
      return sendJson(res, 200, { ok: true, id: updated.id, role: updated.role });
    }

    return sendJson(res, 400, { ok: false, error: '처리할 수 없는 요청입니다.' });
  } catch (e) {
    return sendJson(res, 500, { ok: false, error: '서버 오류: ' + (e?.message || String(e)) });
  }
}
