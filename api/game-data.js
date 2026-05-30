export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const webhookUrl    = process.env.APPS_SCRIPT_WEBHOOK_URL;
  const webhookSecret = process.env.APPS_SCRIPT_WEBHOOK_SECRET;

  if (!webhookUrl || !webhookSecret) {
    return res.status(500).json({ ok: false, error: '서버 설정 오류' });
  }

  const url = webhookUrl + '?action=gamedata&secret=' + encodeURIComponent(webhookSecret);

  try {
    const resp = await fetch(url, { redirect: 'follow' });
    const text = await resp.text();
    let data;
    try { data = JSON.parse(text); } catch {
      return res.status(502).json({ ok: false, error: '응답 파싱 실패: ' + text.slice(0, 200) });
    }
    return res.status(200).json(data);
  } catch (e) {
    return res.status(502).json({ ok: false, error: '데이터 조회 실패: ' + (e?.message || String(e)) });
  }
}
