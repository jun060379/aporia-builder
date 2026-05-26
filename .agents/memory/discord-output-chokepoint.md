---
name: 디스코드 출력 포맷 chokepoint
description: Apps Script Code.js에서 Discord 응답 포맷을 적용/제외하는 단일 진입점 계약.
---

Code.js의 응답 경로는 두 갈래로 명확히 분리되어 있다.

- **Discord 명령 경로**: `doGet` → `handleCommand(...)` → `jsonResponse({text: formatDiscordReply(result)})`. 모든 명령 핸들러가 반환하는 문자열이 이 chokepoint를 통과한다. 포맷(코드펜스/길이 제한)은 여기서만 적용한다.
- **포털 Webhook 경로**: `doPost` → `returnJson(obj)`. 외부 API용 JSON 응답이므로 코드펜스/길이 제한을 절대 적용하지 않는다.

`formatDiscordReply(text)`는 세 갈래로 동작한다.
1. 입력이 `NOFENCE_SENTINEL`("\u0000NOFENCE\u0000")로 시작 → 펜스 생략, 잘라내기만(buttons/멘션/링크용 opt-out).
2. 입력이 `@@SUMMARY@@\n...\n@@DETAIL@@\n...` 마커 포맷(=`makeFoldedResponse` 출력) → 마커를 그대로 두고 summary/detail 본문만 각각 fenceText로 감싼다. 외부 Discord 봇이 마커 기준으로 split해서 summary는 message.content, detail은 "상세 보기" 버튼 콘텐츠로 사용하므로 마커가 펜스 안에 묻히면 안 된다.
3. 그 외 평문 → 전체를 `fenceText(truncateForDiscord(text, 1900))`.

`fenceText`는 이미 유효한 단일 펜스 블록(`^```lang?\n…\n```$`)이고 본문에 추가 ```가 없을 때만 그대로 반환한다. 내부 ```는 전각 ｀｀｀(U+FF40)로 치환해 펜스 깨짐을 막는다.

**Why:** 각 명령 함수를 손대면 회귀 위험이 크다. 단일 chokepoint에서만 포맷을 적용하면 회귀 표면이 한 곳으로 좁혀지고, 포털 Webhook이 사고로 펜스에 감싸지는 일도 구조적으로 차단된다.

**How to apply:** 새 포맷 규칙은 `formatDiscordReply` 내부에서만 추가. 펜스를 적용하면 안 되는 새 명령이 생기면 그 핸들러가 반환 문자열 앞에 `NOFENCE_SENTINEL`을 붙이면 된다. 새 응답 경로(예: Discord 직접 푸시용 UrlFetchApp)가 추가되면 그 경로에서도 동일 chokepoint를 호출하거나, 정책을 명시적으로 결정한 뒤 적용.
