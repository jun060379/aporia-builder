---
name: setCellByHeader는 캐릭터 행 전용
description: apps-script/Code.js의 setCellByHeader는 rowInfo.character를 가정하므로 다른 시트의 rowInfo에는 쓰면 안 됨.
---

`setCellByHeader(rowInfo, header, value)`는 시트 셀에 값을 쓴 뒤 `rowInfo.character[header] = value`로 로컬 캐시도 갱신한다. `rowInfo.character`가 없는 형태(예: STATUS_DB는 `.status`, STACK_DB는 `.stack`)로 호출하면 `undefined[header] = value`로 TypeError가 난다.

**Why:** STATUS_DB의 ACTIVE 행을 갱신하기 위해 같은 헬퍼를 재사용하려다 충돌 위험이 있었음. 동일 패턴(`setStatusCell`)을 시트별로 분리해서 해결.

**How to apply:** 새 시트의 행을 셀 단위로 쓸 때는 그 시트 전용 setter를 만들고, 헤더 인덱스가 -1이면 안전하게 false를 반환하도록 한다. 미러 필드명은 그 시트의 rowInfo 구조와 맞춰라.
