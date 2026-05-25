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

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return sendJson(res, 405, { ok: false, error: 'Method Not Allowed' });
    }

    const supabaseUrl = getSupabaseUrl();
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const webhookUrl = process.env.APPS_SCRIPT_WEBHOOK_URL;
    const webhookSecret = process.env.APPS_SCRIPT_WEBHOOK_SECRET;

    if (!supabaseUrl || !serviceKey) {
      return sendJson(res, 500, { ok: false, error: 'Supabase 서버 환경변수가 설정되지 않았습니다.' });
    }
    if (!webhookUrl) {
      return sendJson(res, 500, { ok: false, error: 'Webhook URL이 설정되지 않았습니다.' });
    }
    if (!webhookSecret) {
      return sendJson(res, 500, { ok: false, error: 'Webhook secret이 설정되지 않았습니다.' });
    }

    const authHeader = req.headers['authorization'] || req.headers['Authorization'] || '';
    const m = /^Bearer\s+(.+)$/i.exec(String(authHeader).trim());
    if (!m) {
      return sendJson(res, 401, { ok: false, error: '인증 토큰이 없습니다.' });
    }
    const accessToken = m[1];

    const body = await readJsonBody(req);
    if (!body || typeof body !== 'object') {
      return sendJson(res, 400, { ok: false, error: '요청 본문을 해석할 수 없습니다.' });
    }
    const applicationId = String(body.applicationId || '').trim();
    const reviewComment = body.reviewComment == null ? '' : String(body.reviewComment);
    if (!applicationId) {
      return sendJson(res, 400, { ok: false, error: 'applicationId가 필요합니다.' });
    }

    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: userResp, error: userErr } = await admin.auth.getUser(accessToken);
    if (userErr || !userResp?.user) {
      return sendJson(res, 401, { ok: false, error: '유효하지 않은 인증 토큰입니다.' });
    }
    const adminUser = userResp.user;

    const { data: profile, error: profErr } = await admin
      .from('profiles')
      .select('role')
      .eq('id', adminUser.id)
      .maybeSingle();
    if (profErr) {
      return sendJson(res, 500, { ok: false, error: 'profiles 조회 실패: ' + (profErr.message || '') });
    }
    if (!profile || profile.role !== 'admin') {
      return sendJson(res, 403, { ok: false, error: '관리자 권한이 필요합니다.' });
    }

    const { data: application, error: appErr } = await admin
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .maybeSingle();
    if (appErr) {
      return sendJson(res, 500, { ok: false, error: '신청 조회 실패: ' + (appErr.message || '') });
    }
    if (!application) {
      return sendJson(res, 404, { ok: false, error: '신청을 찾을 수 없습니다.' });
    }

    const webhookBody = {
      source: 'aporia-portal',
      secret: webhookSecret,
      action: 'approve_application',
      application: {
        id: application.id,
        type: application.type,
        title: application.title,
        payload: application.payload,
        output_text: application.output_text,
      },
    };

    let webhookJson = null;
    try {
      const webhookResp = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookBody),
        redirect: 'follow',
      });
      const text = await webhookResp.text();
      try { webhookJson = JSON.parse(text); }
      catch {
        return sendJson(res, 502, {
          ok: false,
          error: 'Apps Script 응답을 JSON으로 해석할 수 없습니다: ' + text.slice(0, 300),
        });
      }
    } catch (e) {
      return sendJson(res, 502, {
        ok: false,
        error: 'Apps Script 호출 실패: ' + (e?.message || String(e)),
      });
    }

    if (!webhookJson || webhookJson.ok !== true) {
      return sendJson(res, 422, {
        ok: false,
        error: 'Apps Script 등록 실패: ' + (webhookJson?.error || '알 수 없는 오류'),
      });
    }

    const patch = {
      status: 'approved',
      review_comment: reviewComment || application.review_comment || '',
      reviewer_id: adminUser.id,
      reviewed_at: new Date().toISOString(),
    };
    const { error: updErr } = await admin
      .from('applications')
      .update(patch)
      .eq('id', applicationId);
    if (updErr) {
      return sendJson(res, 500, {
        ok: false,
        error: '시트 등록은 성공했으나 Supabase 상태 업데이트에 실패했습니다: ' + (updErr.message || ''),
      });
    }

    return sendJson(res, 200, {
      ok: true,
      message: '승인 및 등록이 완료되었습니다.',
      registeredType: webhookJson.registeredType,
      registeredKey: webhookJson.registeredKey,
    });
  } catch (e) {
    return sendJson(res, 500, { ok: false, error: '서버 오류: ' + (e?.message || String(e)) });
  }
}
