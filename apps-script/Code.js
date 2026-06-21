const SHEET_BOT_DB = "BOT_DB";
const SHEET_STAT_SCALE = "STAT_SCALE";
const SHEET_ACTION_COMPONENTS = "ACTION_COMPONENTS";
const SHEET_RANK_SCALE = "RANK_SCALE";
const SHEET_SKILL_PENDING = "SKILL_PENDING";
const SHEET_SKILL_DB = "SKILL_DB";
const SHEET_CHAR_PENDING = "CHAR_PENDING";
const SHEET_LEVEL_TABLE = "LEVEL_TABLE";
const SHEET_SKILL_COST = "SKILL_COST";
const SHEET_ANCHOR_DB = "ANCHOR_DB";
const SHEET_COMBAT_PENDING = "COMBAT_PENDING";
const SHEET_STATUS_DB = "STATUS_DB";
const SHEET_STACK_DB = "STACK_DB";
const SHEET_STATUS_TEMPLATE = "STATUS_TEMPLATE";

const SHEET_ENEMY_TEMPLATES = "ENEMY_TEMPLATES";
const SHEET_ENEMIES = "ENEMIES";
const SHEET_ENEMY_SKILLS = "ENEMY_SKILLS";
const SHEET_COMMON_SKILLS = "COMMON_SKILLS";
const SHEET_PASSIVE_SKILLS = "PASSIVE_SKILLS";
const SHEET_NICKNAME_DB    = "NICKNAME_DB";
const SHEET_ITEM_DB        = "ITEM_DB";
const SHEET_INVENTORY_DB   = "INVENTORY_DB";
const SHEET_EQUIPMENT_DB   = "EQUIPMENT_DB";
const SHEET_SHOP_DB        = "SHOP_DB";
const SHEET_PARTY_DB       = "PARTY_DB";
const SILVER_FIELD         = "은화";
const QUICKSLOT_FIELDS     = ["퀵슬롯1", "퀵슬롯2", "퀵슬롯3"];
const COMMON_UNLOCK_LEVELS = [1, 2, 4, 6, 8, 12];
const DEFAULT_FACTION = "무소속";
const ENEMY_ACTION_FIELDS = [
  "참격", "관통", "타격", "격투", "사격",
  "방어", "회피", "저항",
  "조사", "해석", "은신", "추적", "설득", "기만", "협박"
];

const ATTACK_SKILL_TYPES = ["화력"];

const ACTION_DICE_STEP = 5;
const ACTION_DICE_SIDES = 6;

const DEFAULT_DIFFICULTY = 15;
const GREAT_RESULT_MARGIN = 10;
const MAX_EROSION = 10;

const DAMAGE_ACTIONS = [
  "참격",
  "관통",
  "타격",
  "격투",
  "사격"
];

const STAT_FIELDS = ["근력", "민첩", "내구", "감각", "지능"];

const FEATURE_FIELDS = [
  "무기술",
  "격투술",
  "사격술",
  "기동술",
  "방어술",
  "인내",
  "관찰",
  "추적술",
  "은밀행동",
  "지식",
  "이면학",
  "화술"
];

const PROF_FIELDS = [
  "참격숙련",
  "관통숙련",
  "타격숙련",
  "격투숙련",
  "사격숙련",
  "회피숙련",
  "방어숙련",
  "저항숙련",
  "조사숙련",
  "해석숙련",
  "은신숙련",
  "추적숙련",
  "설득숙련",
  "기만숙련",
  "협박숙련"
];

const STAT_ORDER = ["F", "E", "D", "C", "B", "A", "S"];

const STAT_COST = {
  F: 0,
  E: 1,
  D: 3,
  C: 7,
  B: 13,
  A: 30,
  S: 55
};

const FEATURE_COST = {
  0: 0,
  1: 2,
  2: 5,
  3: 10,
  4: 18,
  5: 30
};

const PROF_COST = {
  0: 0,
  1: 3,
  2: 8,
  3: 14,
  4: 24,
  5: 38
};

const MAX_FEATURE = 5;
const MAX_PROF = 5;

const FALLBACK_SKILL_COST = {
  EX: 100,
  U: 80,
  S: 70,
  A: 50,
  B: 40,
  C: 30,
  D: 20,
  E: 10,
  F: 1
};

// ── 공격/판정 유형 상수 ────────────────────────────────────────────────
// processStatusBeforeCheck, applyStatusModifierToValue, COMBAT_PENDING 공격종류 필드에 공통 사용.
var KIND_STAT         = "스탯";
var KIND_ACTION       = "액션";
var KIND_POWER        = "이능";
var KIND_SKILL        = "스킬";
var KIND_RESPONSE     = "대응";
var KIND_ENEMY_ACTION = "에너미액션";
var KIND_ENEMY_SKILL  = "에너미스킬";

// ── 저항 모드 상수 ────────────────────────────────────────────────────
// processSkillEffects, applyStatusWithResistance, processPendingAttackSkillEffects 등에 공통 사용.
// ※ 에너미 스킬의 target_mode("none"/"optional"/"required")와 다른 개념.
var RESIST_NORMAL     = "normal";     // 저항 판정 수행
var RESIST_FORCE_FAIL = "forceFail";  // 판정 생략, 저항 자동 실패 (무대응/맞대응 패배 시)
var RESIST_NONE       = "none";       // 판정 생략, 저항 적용 없이 효과 실행

// ── 행 상태값 상수 (STATUS_DB, SKILL_PENDING, CHAR_PENDING, COMBAT_PENDING 등) ──
var ST_ACTIVE   = "ACTIVE";
var ST_PENDING  = "PENDING";
var ST_RESOLVED = "RESOLVED";
var ST_EXPIRED  = "EXPIRED";
var ST_REMOVED  = "REMOVED";
var ST_CLEARED  = "CLEARED";

// ── 효과 코드 상수 (processPreDamageStatuses, processStatusBeforeCheck 등) ──
var EFFECT_CODE_SHIELD     = "shield";
var EFFECT_CODE_BARRIER    = "barrier";
var EFFECT_CODE_VULNERABLE = "vulnerable";
var EFFECT_CODE_BIND       = "bind";
var EFFECT_CODE_WEAKEN     = "weaken";
var EFFECT_CODE_DEBUFF     = "debuff";
var EFFECT_CODE_ENHANCE    = "enhance";
var EFFECT_CODE_BUFF       = "buff";
var EFFECT_CODE_HASTE      = "haste";
var EFFECT_CODE_FOCUS      = "focus";
var EFFECT_CODE_SLOW       = "slow";
var EFFECT_CODE_BLIND      = "blind";

function doGet(e) {
  try {
    // 인벤토리 JSON API 엔드포인트 (Discord 봇 UI 전용)
    if (e.parameter.api === "inventory") {
      return returnJson(handleInventoryApi(e));
    }

    // 내 캐릭터 관리 API (웹 빌더 전용, Vercel에서 secret 검증 후 호출)
    if (e.parameter.api === "mychar") {
      var expectedMc = "";
      try { expectedMc = PropertiesService.getScriptProperties().getProperty(APORIA_PORTAL_SECRET_PROP) || ""; } catch (_) {}
      if (!expectedMc || String(e.parameter.secret || "") !== expectedMc) {
        return returnJson({ ok: false, error: "Unauthorized" });
      }
      return returnJson(handleMyCharApi(e));
    }

    // 게임 데이터 조회 엔드포인트
    if (e.parameter.action === "gamedata") {
      var expected = "";
      try { expected = PropertiesService.getScriptProperties().getProperty(APORIA_PORTAL_SECRET_PROP) || ""; } catch (_) {}
      var provided = String(e.parameter.secret || "");
      if (!expected || provided !== expected) {
        return returnJson({ ok: false, error: "Unauthorized" });
      }
      return returnJson(getGameData());
    }

    const q = e.parameter.q || "";
    const name = e.parameter.name || "";

    const result = handleCommand(q, name);

    return jsonResponse({ text: formatDiscordReply(result) });
  } catch (err) {
    return jsonResponse({
      text: formatDiscordReply(
        "[Apps Script 오류]\n" +
        "오류명: " + err.name + "\n" +
        "메시지: " + err.message + "\n\n" +
        "스택:\n" + (err.stack || "스택 정보 없음")
      )
    });
  }
}

var GAME_DATA_CACHE_KEY = "aporia_game_data_v1";
var GAME_DATA_CACHE_TTL = 300; // 5분

function getGameData() {
  // CacheService 캐시 시도 (콜드 실행 비용 절감)
  try {
    var sc = CacheService.getScriptCache();
    var cached = sc.get(GAME_DATA_CACHE_KEY);
    if (cached) { return JSON.parse(cached); }
  } catch (_e) {}

  try {
    var charRows    = getSheetData(SHEET_BOT_DB);
    var skillRows   = getSheetData(SHEET_SKILL_DB);
    var passiveRows = [];
    try { passiveRows = getSheetData(SHEET_PASSIVE_SKILLS); } catch(_e) {}

    var statFields    = ["근력","민첩","내구","감각","지능"];
    var featureFields = ["무기술","격투술","사격술","기동술","방어술","인내","관찰","추적술","은밀행동","지식","이면학","화술"];
    var profFields    = ["참격숙련","관통숙련","타격숙련","격투숙련","사격숙련","회피숙련","방어숙련","저항숙련","조사숙련","해석숙련","은신숙련","추적숙련","설득숙련"];

    var characters = charRows.map(function(r) {
      var stats = {};
      statFields.forEach(function(f) { stats[f] = String(r[f] || "F").trim(); });
      var features = {};
      featureFields.forEach(function(f) { features[f] = Number(r[f] || 0); });
      var profs = {};
      profFields.forEach(function(f) { profs[f] = Number(r[f] || 0); });
      return {
        alias:     String(r["별명"]    || "").trim(),
        name:      String(r["이름"]    || "").trim(),
        race:      String(r["종족"]    || "").trim(),
        faction:   String(r["소속"]    || "무소속").trim(),
        level:     Number(r["레벨"]    || 0),
        erosion:   Number(r["이면침식"] || 0),
        maxHp:     Number(r["최대체력"] || 0),
        currentHp: Number(r["현재체력"] || 0),
        stats:    stats,
        features: features,
        profs:    profs,
      };
    }).filter(function(c) { return c.alias; });

    var skills = skillRows.map(function(r) {
      return {
        owner:       String(r["소유자"] || "").trim(),
        name:        String(r["스킬명"] || "").trim(),
        tradition:   String(r["계통"]   || "").trim(),
        series:      String(r["계열"]   || "").trim(),
        rank:        String(r["랭크"]   || "").trim(),
        formula:     String(r["계산식"] || "").trim(),
        condition:   String(r["조건"]   || "").trim(),
        cost:        String(r["대가"]   || "").trim(),
        description: String(r["설명"]   || "").trim(),
      };
    }).filter(function(s) { return s.owner && s.name; });

    var passives = passiveRows.map(function(r) {
      return {
        owner:     String(r["소유키"]  || "").trim(),
        ownerType: String(r["소유타입"] || "").trim(),
        name:      String(r["이름"]    || "").trim(),
        category:  String(r["분류"]    || "").trim(),
        value:     String(r["수치"]    || "").trim(),
        trigger:   String(r["발동"]    || "").trim(),
        condition: String(r["조건"]    || "").trim(),
        description: String(r["설명"] || "").trim(),
      };
    }).filter(function(p) { return p.name; });

    var items = [];
    try { items = getItemDbList(); } catch (_e) { items = []; }

    // 아이템 정의 맵 (이름 → 효과/슬롯) — 조인용
    var itemMap = {};
    items.forEach(function (it) { itemMap[it.name] = it; });

    // 인벤토리 (ACTIVE, 수량>0)
    var inventory = [];
    try {
      ensureItemSheets();
      getSheetData(SHEET_INVENTORY_DB).forEach(function (r) {
        var owner = String(r["소유자"] || "").trim();
        var name  = String(r["아이템명"] || "").trim();
        if (!owner || !name) return;
        if (String(r["상태"] || "").trim() !== "ACTIVE") return;
        if (Number(r["수량"] || 0) <= 0) return;
        var def = itemMap[name] || {};
        inventory.push({
          owner:    owner,
          invId:    String(r["id"] || ""),
          name:     name,
          quantity: Number(r["수량"] || 0),
          category: def.category || "",
          slot:     def.slot     || "",
          effect:   def.effect   || "",
          value:    (def.value === undefined ? "" : def.value),
          description: def.description || ""
        });
      });
    } catch (_e) {}

    // 장비
    var equipment = [];
    try {
      getSheetData(SHEET_EQUIPMENT_DB).forEach(function (r) {
        var owner = String(r["소유자"] || "").trim();
        var name  = String(r["아이템명"] || "").trim();
        if (!owner || !name) return;
        var def = itemMap[name] || {};
        equipment.push({
          owner:  owner,
          slot:   String(r["슬롯"] || ""),
          name:   name,
          effect: def.effect || "",
          value:  (def.value === undefined ? "" : def.value)
        });
      });
    } catch (_e) {}

    // 상점 카탈로그 (SHOP_DB, ITEM_DB 조인)
    var shop = [];
    try { shop = getShopList(); } catch (_e) { shop = []; }

    var result = { ok: true, characters: characters, skills: skills, passives: passives,
                   items: items, inventory: inventory, equipment: equipment, shop: shop };
    // 결과를 캐시에 저장 (100KB 제한 초과 시 무시)
    try {
      var sc = CacheService.getScriptCache();
      sc.put(GAME_DATA_CACHE_KEY, JSON.stringify(result), GAME_DATA_CACHE_TTL);
    } catch (_e) {}
    return result;
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// 게임 데이터 캐시 강제 무효화 (캐릭터/스킬 등록 후 호출)
function invalidateGameDataCache() {
  try { CacheService.getScriptCache().remove(GAME_DATA_CACHE_KEY); } catch (_e) {}
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Discord 출력 유틸 ────────────────────────────────────────────────
// 사용처:
//   - doGet의 일반 텍스트 응답에만 적용 (handleCommand 결과 + 예외 메시지).
//   - doPost/returnJson(Portal Webhook JSON 응답)에는 절대 적용하지 않음.
//   - buttons/components/멘션이 필요한 응답이 추가될 경우, 해당 경로에서는 호출하지 말 것.

// 코드펜스 토큰. 큰따옴표 안 백틱은 이스케이프 불필요하지만 가독성을 위해 상수로 분리.
var DISCORD_FENCE = "" + String.fromCharCode(96, 96, 96);  // ```
var DISCORD_FENCE_SAFE = "" + String.fromCharCode(65344, 65344, 65344);  // 전각 ｀｀｀ (펜스 깨짐 방지)

// 일반 텍스트를 ```text ... ``` 형태로 감싼다.
// - null/undefined → 빈 문자열
// - 이미 유효한 단일 코드펜스 블록이면 그대로 반환 (이중 래핑 방지)
// - 내용에 ```가 있으면 전각 ｀｀｀로 치환해 펜스가 깨지지 않게 한다.
function fenceText(text) {
  if (text === null || text === undefined) return "";
  var s = String(text);
  if (s === "") return "";

  // 유효한 단일 펜스 블록만 통과 (선택적 lang 태그 + 줄바꿈 + 본문 + 마지막 ```).
  // 본문에 ``` 가 추가로 등장하면 안 됨.
  var trimmed = s.replace(/^[\s\n]+|[\s\n]+$/g, "");
  var fenceRe = /^```[A-Za-z0-9_-]*\n([\s\S]*?)\n```$/;
  var m = trimmed.match(fenceRe);
  if (m && m[1].indexOf(DISCORD_FENCE) === -1) {
    return s;
  }

  var safe = s.split(DISCORD_FENCE).join(DISCORD_FENCE_SAFE);
  return DISCORD_FENCE + "text\n" + safe + "\n" + DISCORD_FENCE;
}

// 향후 components/mention/링크 등 펜스를 적용하면 안 되는 응답을 위한 opt-out sentinel.
// 핸들러가 반환 문자열 맨 앞에 NOFENCE_SENTINEL을 붙이면 chokepoint가 펜스를 건너뛴다.
// 현재 핸들러는 모두 평문 텍스트라 사용처 없음 — 확장 대비용.
var NOFENCE_SENTINEL = "\u0000NOFENCE\u0000";

// doGet 응답 텍스트를 디스코드용으로 포맷한다 (펜스 + 길이 제한).
// - NOFENCE_SENTINEL 접두어가 있으면 펜스를 적용하지 않고 잘라내기만 한다.
// - makeFoldedResponse가 만든 "@@SUMMARY@@\n...\n@@DETAIL@@\n..." 마커 포맷이면
//   summary/detail 본문만 각각 펜스로 감싸 마커 구조를 보존한다(상세 보기 버튼 호환).
function formatDiscordReply(text) {
  if (text === null || text === undefined) return "";
  var s = String(text);
  if (s.indexOf(NOFENCE_SENTINEL) === 0) {
    return truncateForDiscord(s.slice(NOFENCE_SENTINEL.length), 1990);
  }

  var SUMMARY_MARK = "@@SUMMARY@@";
  var DETAIL_MARK = "@@DETAIL@@";
  if (s.indexOf(SUMMARY_MARK) === 0 && s.indexOf(DETAIL_MARK) > 0) {
    var detailAt = s.indexOf(DETAIL_MARK);
    var summaryBody = s.slice(SUMMARY_MARK.length, detailAt).replace(/^\n+|\n+$/g, "");
    var detailBody  = s.slice(detailAt + DETAIL_MARK.length).replace(/^\n+|\n+$/g, "");
    return (
      SUMMARY_MARK + "\n" +
      fenceText(truncateForDiscord(summaryBody, 1900)) + "\n" +
      DETAIL_MARK + "\n" +
      fenceText(truncateForDiscord(detailBody, 1900))
    );
  }

  return fenceText(truncateForDiscord(s, 1900));
}

// 디스코드 2000자 한도를 고려해 내부 텍스트를 자른다.
// 코드펜스 오버헤드(```text\n + \n``` = 12자)까지 감안해 기본 1900자.
function truncateForDiscord(text, maxLen) {
  if (text === null || text === undefined) return "";
  var s = String(text);
  var lim = Math.max(50, Math.floor(Number(maxLen) || 1900));
  if (s.length <= lim) return s;
  return s.slice(0, lim - 8) + "\n...(생략)";
}

function handleCommand(utterance, displayName) {
  utterance = String(utterance || "").trim();
  displayName = String(displayName || "").trim();

  if (!utterance) return "명령어가 비어 있습니다.";

  const parts = utterance.split(/\s+/);
  const command = parts[0];

  if (command === "!내정보") return showMyInfo(displayName);
  if (command === "!판정") return statCheck(parts, displayName);
  if (command === "!액션") return actionCheck(parts, displayName);

  if (command === "!화력") return powerCheck(parts, "화력", displayName);
  if (command === "!방호") return powerCheck(parts, "방호", displayName);
  if (command === "!치유") return powerCheck(parts, "치유", displayName);
  if (command === "!재생") return powerCheck(parts, "재생", displayName);
  if (command === "!간섭") return powerCheck(parts, "간섭", displayName);
  if (command === "!강화") return powerCheck(parts, "강화", displayName);

  if (command === "!스킬신청") return skillSubmit(utterance, displayName);
  if (command === "!스킬승인") return skillApprove(parts, displayName);
  if (command === "!스킬반려") return skillReject(parts, displayName, utterance);
  if (command === "!스킬목록") return skillList(displayName);
  if (command === "!스킬") return skillUse(parts, displayName);
  if (command === "!캐스팅") return castingProgressCommand(parts, displayName);

  if (command === "!공용스킬목록") return commonSkillListCommand(parts, displayName);
  if (command === "!공용스킬") return commonSkillUseCommand(parts, displayName);

  if (command === "!캐릭터신청") return characterSubmit(utterance, displayName);
  if (command === "!캐릭터승인") return characterApprove(parts, displayName);
  if (command === "!캐릭터반려") return characterReject(parts, displayName, utterance);

  if (command === "!수정") return characterModify(parts, displayName);
  if (command === "!성장") return characterGrow(parts, displayName);
  if (command === "!경험치") return experienceGrant(parts, displayName);

  if (command === "!관계등록") return anchorRegister(utterance, displayName);
  if (command === "!관계수정") return anchorModify(parts, displayName);
  if (command === "!관계목록") return anchorList(parts, displayName);

  if (command === "!일상점사용") return dailyPointUse(parts, displayName);
  if (command === "!일상점회복") return dailyPointRecover(parts, displayName);

  if (command === "!침식") return erosionModify(parts, displayName);
  if (command === "!피해") return damageApply(parts, displayName);
  if (command === "!대응") return combatResponse(parts, displayName);

  if (command === "!상태목록") return statusListCommand(parts, displayName);
  if (command === "!상태부여") return statusAddCommand(parts, displayName);
  if (command === "!상태해제") return statusRemoveCommand(parts, displayName);

  if (command === "!스택목록") return stackListCommand(parts, displayName);
  if (command === "!스택") return stackModifyCommand(parts, displayName);

  if (command === "!상태템플릿목록") return statusTemplateListCommand(parts, displayName);
  if (command === "!상태템플릿보기") return statusTemplateShowCommand(parts, displayName);
  if (command === "!상태템플릿부여") return statusTemplateApplyCommand(parts, displayName);

  if (command === "!에너미불러오기") return enemyLoad(parts, displayName, utterance);
  if (command === "!에너미목록")     return enemyList(displayName);
  if (command === "!에너미정보")     return enemyInfo(parts, displayName);
  if (command === "!에너미삭제")     return enemyDelete(parts, displayName);
  if (command === "!에너미피해")     return enemyDamage(parts, displayName);
  if (command === "!에너미회복")     return enemyHeal(parts, displayName);
  if (command === "!에너미별명")     return enemyRename(parts, displayName);
  if (command === "!에너미공격")     return enemyAttack(parts, displayName, utterance);
  if (command === "!에너미대응")     return enemyRespond(parts, displayName);
  if (command === "!에너미생성")     return enemyCreate(utterance, displayName);
  if (command === "!에너미스킬목록") return enemySkillList(parts, displayName);
  if (command === "!에너미스킬")         return enemySkillUse(parts, displayName);
  if (command === "!에너미스킬등록")     return enemySkillRegister(utterance, displayName);
  if (command === "!에너미스킬삭제")     return enemySkillDelete(parts, displayName);
  if (command === "!에너미템플릿등록")   return enemyTemplateRegister(utterance, displayName);
  if (command === "!에너미템플릿삭제")   return enemyTemplateDelete(parts, displayName);

  if (command === "!fin" || command === "!세션종료") return finishSession(parts, displayName);
  if (command === "!파티" || command === "!세션시작") return createPartyCommand(parts, displayName);
  if (command === "!파티목록") return partyListCommand();
  if (command === "!파티정보") return partyInfoCommand(parts);
  if (command === "!패시브목록") return passiveListCommand(parts, displayName);
  if (command === "!패시브등록") return passiveRegisterCommand(utterance, displayName);

  if (command === "!닉네임목록")  return nicknameList(parts);
  if (command === "!닉네임추가")  return nicknameAdd(parts);
  if (command === "!닉네임삭제")  return nicknameRemove(parts);

  if (command === "!인벤토리")   return inventoryCommand(parts, displayName);
  if (command === "!장비")       return equipmentShowCommand(parts, displayName);
  if (command === "!아이템지급") return itemGrantCommand(parts, displayName);
  if (command === "!아이템삭제") return itemDeleteCommand(parts, displayName);
  if (command === "!장비착용")   return equipCommand(parts, displayName);
  if (command === "!장비해제")   return unequipCommand(parts, displayName);
  if (command === "!아이템사용") return itemUseCommand(parts, displayName);

  if (command === "!은화")       return silverGrantCommand(parts, displayName);
  if (command === "!교환")       return tradeCommand(parts, displayName);
  if (command === "!퀵슬롯1")    return quickslotUseCommand(parts, displayName, 1);
  if (command === "!퀵슬롯2")    return quickslotUseCommand(parts, displayName, 2);
  if (command === "!퀵슬롯3")    return quickslotUseCommand(parts, displayName, 3);

  if (command === "!명령어목록" || command === "!도움말" || command === "!help") {
    return commandListCommand(parts);
  }

  const dynamicName = command.replace(/^!/, "").trim();
  
  if (dynamicName) {
    if (STAT_FIELDS.includes(dynamicName)) {
      return statCheck(["!판정", dynamicName].concat(parts.slice(1)), displayName);
    }
  
    const actionRows = getSheetData(SHEET_ACTION_COMPONENTS)
      .filter(r => String(r["action"]).trim() === dynamicName);
  
    if (actionRows.length > 0) {
      return actionCheck(["!액션", dynamicName].concat(parts.slice(1)), displayName);
    }

    // 스킬 이름 직접 단축: 개인 스킬 → 공용 스킬 순으로 검색
    const skillCharacter = findCharacter(displayName);
    if (skillCharacter) {
      const skillAlias = String(skillCharacter["별명"]).trim();
      if (findApprovedSkill(skillAlias, dynamicName)) {
        return skillUse(["!스킬", dynamicName].concat(parts.slice(1)), displayName);
      }
      if (findCommonSkill(dynamicName)) {
        // alias를 명시 삽입 → _resolveCommandCharacter에서 스킬명이 별명으로 오인되는 것 방지
        return commonSkillUseCommand(["!공용스킬", skillAlias, dynamicName].concat(parts.slice(1)), displayName);
      }

      // 동적 단축: 명령명이 호출자 퀵슬롯1~3에 등록된 아이템명과 일치하면 그 아이템 사용.
      var _quickItems = QUICKSLOT_FIELDS.map(function (f) { return String(skillCharacter[f] || "").trim(); });
      if (_quickItems.indexOf(dynamicName) >= 0) {
        return quickslotUseCommand(parts, displayName, dynamicName);
      }
    }
  }

  return (
    "❓ 알 수 없는 명령어입니다: " + command + "\n" +
    "스킬 이름을 직접 입력한 경우, 개인 스킬 또는 해금된 공용 스킬인지 확인해주세요.\n" +
    "명령어 목록은 !도움말 을 사용하세요."
  );
}

function commandListCommand(parts) {
  var TOTAL_PAGES = 3;
  var page = 1;
  if (parts && parts.length > 1) {
    var p = parseInt(String(parts[1]), 10);
    if (!isNaN(p) && p >= 1 && p <= TOTAL_PAGES) page = p;
  }

  var summary = [
    "━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "     APORIA 명령어 목록",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━"
  ].join("\n");

  var pageContents = [
    // 1페이지: 캐릭터 / 판정·액션 / 능력 / 스킬 / 공용 스킬
    [
      "[ 캐릭터 ]",
      "  !내정보",
      "  !캐릭터신청",
      "  !캐릭터승인  <신청번호>",
      "  !캐릭터반려  <신청번호> <사유>",
      "  !수정        <캐릭터별명> <항목> <값>",
      "  !성장        <캐릭터별명> <항목>",
      "  !경험치      <별명1> [별명2 …] <경험치량>  (다수 동시 부여)",
      "",
      "[ 판정 · 액션 ]",
      "  !판정        <스탯명> [난이도] [보정]",
      "  !<스탯명>    [난이도] [보정]      (단축)",
      "  !액션        <액션명> [난이도] [보정]",
      "  !<액션명>    [난이도] [보정]      (단축)",
      "  사회 액션:  !설득 / !기만 / !협박",
      "",
      "[ 능력 ]",
      "  !화력 / !방호 / !치유 <랭크>",
      "  !재생 / !간섭 / !강화 <랭크>",
      "",
      "[ 스킬 ]",
      "  !스킬신청",
      "  !스킬승인    <신청번호>",
      "  !스킬반려    <신청번호> <사유>",
      "  !스킬목록",
      "  !스킬        <스킬명>",
      "",
      "[ 공용 스킬 ]",
      "  !공용스킬목록 [캐릭터별명]",
      "  !공용스킬    [캐릭터별명] <스킬명> [대상:대상명] [보정]"
    ].join("\n"),

    // 2페이지: 상태·스택 / 관계·일상점·침식 / 전투 / 에너미
    [
      "[ 상태 · 스택 ]",
      "  !상태목록",
      "  !상태부여    <대상> <상태명> ...옵션",
      "  !상태해제    <대상> <상태명>",
      "  !스택목록",
      "  !스택        <대상> <스택명> <변동>",
      "  !상태템플릿목록",
      "  !상태템플릿보기   <템플릿명>",
      "  !상태템플릿부여   <대상> <템플릿명>",
      "",
      "[ 관계 · 일상점 · 침식 ]",
      "  !관계등록",
      "  !관계수정",
      "  !관계목록",
      "  !일상점사용  / !일상점회복",
      "  !침식        <대상> <변동>",
      "",
      "[ 전투 ]",
      "  !피해        <캐릭터별명> <수치>",
      "  !대응  방어  [보정]",
      "  !대응  회피  [보정]",
      "  !대응  맞대응  <액션명|화력 랭크|스킬 스킬명>  [보정]",
      "  !대응  무대응",
      "",
      "[ 에너미 ]",
      "  !에너미목록 / !에너미정보 <별명>",
      "  !에너미생성 / !에너미불러오기",
      "  !에너미삭제 / !에너미별명 <기존> <신규>",
      "  !에너미피해 <별명> <수치>",
      "  !에너미회복 <별명> <수치>",
      "  !에너미공격 <별명> ...",
      "  !에너미대응 <별명> ...",
      "  !에너미스킬목록   <별명>",
      "  !에너미스킬       <별명> <스킬명>",
      "  !에너미스킬등록   / !에너미스킬삭제",
      "  !에너미템플릿등록 / !에너미템플릿삭제"
    ].join("\n"),

    // 3페이지: 패시브 / 닉네임 / 인벤토리·장비 / 경제·상점 / 세션
    [
      "[ 패시브 ]",
      "  !패시브목록 [캐릭터별명/에너미ID·별명]",
      "  !패시브등록  (멀티라인 필드:값 — key/이름/소유타입/소유키/…/효과/설명)",
      "",
      "[ 닉네임 ]",
      "  !닉네임목록 [별명]        등록된 닉네임 확인",
      "  !닉네임추가 별명 닉네임1 닉네임2 ...",
      "  !닉네임삭제 별명 닉네임",
      "",
      "[ 인벤토리 · 장비 ]",
      "  !인벤토리 [별명]",
      "  !장비 [별명]",
      "  !아이템지급 <별명> <아이템명> [수량]   (관리자 전용)",
      "  !아이템삭제 <인벤토리id>             (관리자 전용)",
      "  !장비착용 [별명] <아이템명>",
      "  !장비해제 [별명] <슬롯|아이템명>",
      "  !아이템사용 <아이템명> [대상:별명]",
      "",
      "[ 경제 · 상점 ]",
      "  !은화 <별명1> [별명2 …] <금액>   (+ 지급 / - 차감, GM)",
      "  !교환 <상대> <아이템명> [수량]    (즉시 양도)",
      "  !교환 <상대> 은화 <금액>",
      "  !퀵슬롯1 / !퀵슬롯2 / !퀵슬롯3 [대상:별명]",
      "  !<아이템명>   (퀵슬롯 등록 아이템 단축 사용·장비 교체)",
      "  ※ 장비 퀵슬롯: 등록된 아이템이 장비이면 현재 착용 장비와 스왑",
      "  ※ 상점 구매·퀵슬롯 등록은 웹 빌더에서",
      "",
      "[ 세션 ]",
      "  !fin / !세션종료        극/세션 종료 (본인 캐릭터만 초기화 및 세션종료 패시브 발동)",
      "  !fin 캐릭터1 캐릭터2    지정한 캐릭터만 임시 상태/스택 정리 + 체력 회복"
    ].join("\n")
  ];

  var navLine;
  if (page === 1) {
    navLine = "(" + page + "/" + TOTAL_PAGES + "페이지)  다음: !도움말 2";
  } else if (page === TOTAL_PAGES) {
    navLine = "← !도움말 " + (page - 1) + "  |  (" + page + "/" + TOTAL_PAGES + "페이지)";
  } else {
    navLine = "← !도움말 " + (page - 1) + "  |  (" + page + "/" + TOTAL_PAGES + "페이지)  |  !도움말 " + (page + 1) + " →";
  }

  var detail = [
    "━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "  APORIA 명령어 목록  (" + page + "/" + TOTAL_PAGES + "페이지)",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    pageContents[page - 1],
    "",
    navLine
  ].join("\n");

  return makeFoldedResponse(summary, detail);
}

// ── 실행 컨텍스트 내 시트 데이터 인메모리 캐시 ─────────────────────────
// GAS는 요청 1건 = 실행 1건이다. 동일 실행 안에서는 같은 시트를 여러 번
// getValues()로 읽어도 결과가 바뀌지 않으므로 첫 번째 결과를 재사용한다.
// (grow/equip 같은 쓰기 경로는 쓴 직후 다시 읽어야 하므로 invalidateSheetCache로 해당 시트만 무효화)
var _ssInstance = null;
function _getSpreadsheet() {
  if (!_ssInstance) _ssInstance = SpreadsheetApp.getActiveSpreadsheet();
  return _ssInstance;
}

var _sheetDataCache = {};
function invalidateSheetCache(sheetName) {
  if (sheetName) delete _sheetDataCache[sheetName];
  else _sheetDataCache = {};
}

function getSheetData(sheetName) {
  if (_sheetDataCache[sheetName]) return _sheetDataCache[sheetName];

  const ss = _getSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error("시트를 찾을 수 없습니다: " + sheetName);
  }

  const values = sheet.getDataRange().getValues();
  const result = values.length < 2 ? [] : (function() {
    const headers = values[0].map(h => String(h).trim());
    return values.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => { obj[header] = row[index]; });
      return obj;
    });
  })();

  _sheetDataCache[sheetName] = result;
  return result;
}

function getSheetHeaders(sheetName) {
  const ss = _getSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error("시트를 찾을 수 없습니다: " + sheetName);
  }

  return sheet.getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0]
    .map(h => String(h).trim());
}

function findCharacter(displayName) {
  return findCharacterByAlias(displayName);
}

function findCharacterByAlias(alias) {
  var s = String(alias || "").trim();
  if (!s) return null;
  const rows = getSheetData(SHEET_BOT_DB);

  // 1. 정확한 별명 매칭
  var exact = rows.find(r => String(r["별명"] || "").trim() === s);
  if (exact) return exact;

  // 2. 닉네임 테이블에서 역조회
  var resolved = _resolveNickname(s);
  if (resolved !== s) {
    return rows.find(r => String(r["별명"] || "").trim() === resolved) || null;
  }
  return null;
}

// ── 닉네임 시스템 ────────────────────────────────────────────
// NICKNAME_DB 시트: 별명 | 닉네임 (쉼표 구분, 공백 포함 가능)

function ensureNicknameSheet() {
  var ss = _getSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NICKNAME_DB);
  if (sh) return sh;
  sh = ss.insertSheet(SHEET_NICKNAME_DB);
  sh.getRange(1, 1, 1, 2).setValues([["별명", "닉네임"]]);
  sh.setFrozenRows(1);
  return sh;
}

// 토큰 배열에서 가장 긴 캐릭터 별명/닉네임을 찾는다.
// tokens: 분리된 단어 배열, start: 탐색 시작 인덱스, minRemaining: 뒤에 남겨야 할 최소 토큰 수
// 반환: { alias: 정식별명, rest: 나머지토큰 }
// 못 찾으면 { alias: tokens[start], rest: tokens.slice(start+1) }
function _resolveAliasFromTokens(tokens, start, minRemaining) {
  start = start || 1;
  minRemaining = minRemaining || 0;
  var maxLen = tokens.length - start - minRemaining;
  if (maxLen < 1) return { alias: tokens[start] || "", rest: tokens.slice(start + 1) };

  // 긴 것부터 시도 (공백 포함 닉네임 우선)
  for (var len = maxLen; len >= 1; len--) {
    var candidate = tokens.slice(start, start + len).join(" ");
    var char = findCharacterByAlias(candidate);  // 내부에서 닉네임도 체크
    if (char) {
      return { alias: String(char["별명"] || candidate).trim(), rest: tokens.slice(start + len) };
    }
  }
  // 매칭 실패 → 첫 토큰 반환 (기존 동작)
  return { alias: tokens[start] || "", rest: tokens.slice(start + 1) };
}

// 입력값 → 정식 별명 변환. 못 찾으면 입력값 그대로 반환.
function _resolveNickname(input) {
  var s = String(input || "").trim();
  if (!s) return s;
  try {
    ensureNicknameSheet();
    var rows = getSheetData(SHEET_NICKNAME_DB);
    var sLow = s.toLowerCase();
    for (var i = 0; i < rows.length; i++) {
      var canonical = String(rows[i]["별명"] || "").trim();
      if (!canonical) continue;
      var nickRaw = String(rows[i]["닉네임"] || "").trim();
      if (!nickRaw) continue;
      var nicks = nickRaw.split(/[,，\n\r]+/).map(function(n) { return n.trim().toLowerCase(); }).filter(Boolean);
      if (nicks.indexOf(sLow) >= 0) return canonical;
    }
  } catch(_e) { /* 시트 없거나 오류면 무시 */ }
  return s;
}

// 닉네임 행 찾기 (별명 기준)
function _findNicknameRow(alias) {
  try {
    ensureNicknameSheet();
    var ss = _getSpreadsheet();
    var sh = ss.getSheetByName(SHEET_NICKNAME_DB);
    var values = sh.getDataRange().getValues();
    var headers = values[0].map(function(h){ return String(h).trim(); });
    var aliasCol = headers.indexOf("별명");
    if (aliasCol < 0) return null;
    for (var i = 1; i < values.length; i++) {
      if (String(values[i][aliasCol] || "").trim() === alias) {
        return { sheet: sh, rowIndex: i + 1, headers: headers, values: values[i] };
      }
    }
  } catch(_e) {}
  return null;
}

// !닉네임목록 [별명]
function nicknameList(parts) {
  ensureNicknameSheet();
  var rows = getSheetData(SHEET_NICKNAME_DB);
  if (rows.length === 0) return "등록된 닉네임이 없습니다.";

  var filterAlias = "";
  if (parts && parts.length >= 2) {
    filterAlias = _resolveAliasFromTokens(parts, 1, 0).alias;
  }
  var filtered = filterAlias
    ? rows.filter(function(r){ return String(r["별명"] || "").trim() === filterAlias; })
    : rows;

  if (filtered.length === 0) return "닉네임이 없습니다: " + filterAlias;

  var lines = ["[닉네임 목록]"];
  filtered.forEach(function(r) {
    var canonical = String(r["별명"] || "").trim();
    var nicks = String(r["닉네임"] || "").trim();
    if (canonical) lines.push(canonical + " → " + (nicks || "(없음)"));
  });
  return lines.join("\n");
}

// !닉네임추가 별명 닉네임1 닉네임2 ...  (별명에 공백 포함 가능, 닉네임은 공백 없이 각각)
function nicknameAdd(parts) {
  if (!parts || parts.length < 3) {
    return "사용법: !닉네임추가 별명 닉네임1 닉네임2 ...\n예시: !닉네임추가 월하륜 월하 월짱";
  }
  var resolved = _resolveAliasFromTokens(parts, 1, 1);
  var alias = resolved.alias;
  if (!findCharacterByAlias(alias)) return "BOT_DB에 없는 별명입니다: " + alias;

  var newNicks = resolved.rest.map(function(n){ return n.trim(); }).filter(Boolean);
  if (newNicks.length === 0) return "추가할 닉네임을 입력하세요.";

  ensureNicknameSheet();
  var existing = _findNicknameRow(alias);

  if (existing) {
    // 기존 행 업데이트
    var nickCol = existing.headers.indexOf("닉네임");
    if (nickCol < 0) return "닉네임 열을 찾을 수 없습니다.";
    var curRaw = String(existing.values[nickCol] || "").trim();
    var curList = curRaw ? curRaw.split(/[,，]+/).map(function(n){ return n.trim(); }).filter(Boolean) : [];
    newNicks.forEach(function(n) {
      if (curList.indexOf(n) < 0) curList.push(n);
    });
    existing.sheet.getRange(existing.rowIndex, nickCol + 1).setValue(curList.join(", "));
    return "[닉네임 추가]\n별명: " + alias + "\n현재 닉네임: " + curList.join(", ");
  } else {
    // 새 행 추가
    appendRowByHeaders(SHEET_NICKNAME_DB, { 별명: alias, 닉네임: newNicks.join(", ") });
    return "[닉네임 추가]\n별명: " + alias + "\n닉네임: " + newNicks.join(", ");
  }
}

// !닉네임삭제 별명 닉네임  (별명/닉네임 모두 공백 포함 가능)
function nicknameRemove(parts) {
  if (!parts || parts.length < 3) {
    return "사용법: !닉네임삭제 별명 닉네임\n예시: !닉네임삭제 월하륜 월짱";
  }
  var resolved = _resolveAliasFromTokens(parts, 1, 1);
  var alias  = resolved.alias;
  var target = resolved.rest.join(" ").trim().toLowerCase();

  ensureNicknameSheet();
  var existing = _findNicknameRow(alias);
  if (!existing) return "닉네임 등록 정보가 없습니다: " + alias;

  var nickCol = existing.headers.indexOf("닉네임");
  if (nickCol < 0) return "닉네임 열을 찾을 수 없습니다.";

  var curRaw = String(existing.values[nickCol] || "").trim();
  var curList = curRaw ? curRaw.split(/[,，]+/).map(function(n){ return n.trim(); }).filter(Boolean) : [];
  var next = curList.filter(function(n){ return n.toLowerCase() !== target; });

  if (next.length === curList.length) return "해당 닉네임이 없습니다: " + target;

  existing.sheet.getRange(existing.rowIndex, nickCol + 1).setValue(next.join(", "));
  return "[닉네임 삭제]\n별명: " + alias + "\n삭제됨: " + target + "\n남은 닉네임: " + (next.join(", ") || "(없음)");
}

function findCharacterRowByAlias(alias) {
  const ss = _getSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_BOT_DB);

  if (!sheet) {
    throw new Error("시트를 찾을 수 없습니다: " + SHEET_BOT_DB);
  }

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return null;

  const headers = values[0].map(h => String(h).trim());
  const aliasIndex = headers.indexOf("별명");

  if (aliasIndex < 0) {
    throw new Error("BOT_DB에 별명 열이 없습니다.");
  }

  for (let r = 1; r < values.length; r++) {
    if (String(values[r][aliasIndex]).trim() === String(alias).trim()) {
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = values[r][i];
      });

      return {
        sheet: sheet,
        rowIndex: r + 1,
        headers: headers,
        character: obj
      };
    }
  }

  return null;
}

function rereadCharacterRow(alias) {
  SpreadsheetApp.flush();
  return findCharacterRowByAlias(alias);
}

function parseStatMap(text) {
  const map = {};

  text = String(text || "")
    .replace(/\u200B/g, "")
    .replace(/[，、;]/g, ",")
    .trim();

  if (!text) return map;

  const parts = text.split(/[,\n]/);

  parts.forEach(part => {
    part = String(part || "").trim();
    if (!part) return;

    const match = part.match(/^(.+?)\s*[:：=]\s*(-?\d+(?:\.\d+)?)\s*$/);
    if (!match) return;

    const key = String(match[1]).trim();
    const value = Number(match[2]);

    if (key) {
      map[key] = isNaN(value) ? 0 : value;
    }
  });

  return map;
}

function getScaleValue(sheetName, keyColumn, valueColumn, key) {
  const rows = getSheetData(sheetName);
  const target = String(key).trim().toUpperCase();

  const found = rows.find(r => {
    return String(r[keyColumn]).trim().toUpperCase() === target;
  });

  if (!found) {
    throw new Error("변환표에서 값을 찾을 수 없습니다: " + key);
  }

  return Number(found[valueColumn]);
}

// 시트 조회 실패 시 fallback. STAT_SCALE 시트에 F행이 없는 경우에도 동작.
const STAT_VALUE_FALLBACK = { F: 1, E: 3, D: 5, C: 10, B: 20, A: 30, S: 40 };

function statToValue(statGrade) {
  if (typeof statGrade === "number") return statGrade;

  const key = String(statGrade).trim().toUpperCase();
  try {
    return getScaleValue(SHEET_STAT_SCALE, "grade", "value", key);
  } catch (_e) {
    if (STAT_VALUE_FALLBACK.hasOwnProperty(key)) return STAT_VALUE_FALLBACK[key];
    throw new Error("변환표에서 값을 찾을 수 없습니다: " + key);
  }
}

function rankToValue(rank) {
  const key = String(rank).trim().toUpperCase();
  return getScaleValue(SHEET_RANK_SCALE, "rank", "value", key);
}

function getLevelTableRows() {
  return getSheetData(SHEET_LEVEL_TABLE).map(r => ({
    level: Number(r["레벨"]),
    exp: Number(r["필요경험치"]),
    budget: Number(r["성장예산"])
  })).filter(r => !isNaN(r.level) && !isNaN(r.exp) && !isNaN(r.budget));
}

function getLevelFromExp(exp) {
  exp = Number(exp || 0);
  const rows = getLevelTableRows().sort((a, b) => a.exp - b.exp);

  let result = rows.length > 0 ? rows[0].level : 1;

  rows.forEach(r => {
    if (exp >= r.exp) {
      result = r.level;
    }
  });

  return result;
}

function getBudgetFromLevel(level) {
  level = Number(level || 1);
  const rows = getLevelTableRows().sort((a, b) => a.level - b.level);

  let result = rows.length > 0 ? rows[0].budget : 70;

  rows.forEach(r => {
    if (level >= r.level) {
      result = r.budget;
    }
  });

  return result;
}

function readCharacterLevel(character) {
  const sheetLevel = Number(character["레벨"]);
  if (!isNaN(sheetLevel) && sheetLevel > 0) return sheetLevel;

  return getLevelFromExp(Number(character["경험치"] || 0));
}

function readCharacterBudget(character) {
  const sheetBudget = Number(character["성장예산"]);
  if (!isNaN(sheetBudget) && sheetBudget > 0) return sheetBudget;

  const level = readCharacterLevel(character);
  return getBudgetFromLevel(level);
}

function getDirectNumber(character, name) {
  name = String(name || "").trim();

  if (!(name in character)) {
    return null;
  }

  const raw = character[name];

  if (raw === "" || raw === null || raw === undefined) {
    return 0;
  }

  const value = Number(String(raw).replace(/\s/g, ""));

  if (isNaN(value)) {
    return null;
  }

  return value;
}

function getCostFromTable(table, value) {
  value = Number(value || 0);

  if (!Number.isInteger(value)) {
    throw new Error("비용표 값은 정수여야 합니다: " + value);
  }

  if (value < 0) {
    throw new Error("비용표 값은 0 미만일 수 없습니다: " + value);
  }

  if (table[value] !== undefined) {
    return Number(table[value]);
  }

  throw new Error("비용표에 없는 값입니다: " + value);
}

function getStatCost(grade) {
  const g = String(grade || "E").trim().toUpperCase();
  return Number(STAT_COST[g] || 0);
}

function getSkillCostByRank(rank) {
  const key = String(rank || "").trim().toUpperCase();

  try {
    const rows = getSheetData(SHEET_SKILL_COST);

    const found = rows.find(r => {
      return String(r["rank"]).trim().toUpperCase() === key;
    });

    if (found) {
      const cost = Number(found["cost"]);
      if (!isNaN(cost)) {
        return cost;
      }
    }
  } catch (e) {
    // SKILL_COST 시트가 없거나 깨졌을 때 fallback 사용
  }

  return Number(FALLBACK_SKILL_COST[key] || 0);
}

function calculateCharacterUsedPoints(character) {
  let total = 0;

  STAT_FIELDS.forEach(field => {
    total += getStatCost(character[field]);
  });

  FEATURE_FIELDS.forEach(field => {
    const value = Number(character[field] || 0);
    total += getCostFromTable(FEATURE_COST, value);
  });

  PROF_FIELDS.forEach(field => {
    const value = Number(character[field] || 0);
    total += getCostFromTable(PROF_COST, value);
  });

  const alias = String(character["별명"] || "").trim();
  const skills = getSheetData(SHEET_SKILL_DB)
    .filter(r => String(r["소유자"]).trim() === alias);

  skills.forEach(skill => {
    total += getSkillCostByRank(skill["랭크"]);
  });

  return Math.floor(total);
}

function calculateGrowthCostDelta(character, field) {
  const beforeUsed = calculateCharacterUsedPoints(character);
  const nextCharacter = Object.assign({}, character);

  if (STAT_FIELDS.includes(field)) {
    const current = String(character[field] || "E").trim().toUpperCase();
    const idx = STAT_ORDER.indexOf(current);

    if (idx < 0) {
      throw new Error("현재 스탯 등급이 올바르지 않습니다: " + current);
    }

    if (idx >= STAT_ORDER.length - 1) {
      throw new Error(field + "은 이미 최대 등급입니다: " + current);
    }

    nextCharacter[field] = STAT_ORDER[idx + 1];

  } else if (FEATURE_FIELDS.includes(field)) {
    const current = Number(character[field] || 0);

    if (!Number.isInteger(current)) {
      throw new Error(field + " 값이 정수가 아닙니다: " + current);
    }

    if (current >= MAX_FEATURE) {
      throw new Error(field + "은 이미 최대치입니다: " + MAX_FEATURE);
    }

    nextCharacter[field] = current + 1;

  } else if (PROF_FIELDS.includes(field)) {
    const current = Number(character[field] || 0);

    if (!Number.isInteger(current)) {
      throw new Error(field + " 값이 정수가 아닙니다: " + current);
    }

    if (current >= MAX_PROF) {
      throw new Error(field + "은 이미 최대치입니다: " + MAX_PROF);
    }

    nextCharacter[field] = current + 1;

  } else {
    throw new Error("성장 가능한 항목이 아닙니다: " + field);
  }

  const afterUsed = calculateCharacterUsedPoints(nextCharacter);

  return {
    oldValue: character[field],
    newValue: nextCharacter[field],
    beforeUsed: beforeUsed,
    afterUsed: afterUsed,
    need: afterUsed - beforeUsed
  };
}

function refreshCharacterBudget(alias) {
  let rowInfo = rereadCharacterRow(alias);

  if (!rowInfo) {
    return null;
  }

  const budget = readCharacterBudget(rowInfo.character);
  const used = calculateCharacterUsedPoints(rowInfo.character);
  const remain = budget - used;

  setCellByHeader(rowInfo, "사용점수", used);
  setCellByHeader(rowInfo, "남은점수", remain);

  rowInfo = rereadCharacterRow(alias);

  return {
    rowInfo: rowInfo,
    budget: budget,
    used: used,
    remain: remain
  };
}

function getHealthInfo(character) {
  const maxHp = Number(character["최대체력"]);
  const currentHp = Number(character["현재체력"]);

  return {
    maxHp: isNaN(maxHp) ? 0 : Math.floor(maxHp),
    currentHp: isNaN(currentHp) ? 0 : Math.floor(currentHp)
  };
}

function setCellByHeader(rowInfo, headerName, value) {
  const columnIndex = rowInfo.headers.indexOf(headerName);
  if (columnIndex < 0) return false;

  rowInfo.sheet.getRange(rowInfo.rowIndex, columnIndex + 1).setValue(value);
  // rowInfo의 데이터 객체 캐시 갱신 — character/stack/status 중 존재하는 것.
  // (캐릭터 행은 .character, 스택 행은 .stack, 상태 행은 .status를 가진다)
  if (rowInfo.character) rowInfo.character[headerName] = value;
  if (rowInfo.stack)     rowInfo.stack[headerName]     = value;
  if (rowInfo.status)    rowInfo.status[headerName]    = value;
  // 이 시트의 실행-내 캐시 무효화 (다음 읽기에서 최신값 반영)
  invalidateSheetCache(rowInfo.sheet.getName());
  return true;
}

function clampHp(value, maxHp) {
  const v = Math.floor(Number(value));
  const m = Math.floor(Number(maxHp));

  if (isNaN(v)) return 0;
  if (isNaN(m) || m <= 0) return Math.max(0, v);

  return Math.max(0, Math.min(v, m));
}

// 회복후 트리거 재진입 가드: 회복후 패시브가 또 회복을 일으켜 무한 재귀하는 것을 막는다.
var _HEAL_TRIGGER_ACTIVE = false;

function applyHealingToCharacter(alias, healAmount) {
  const rowInfo = findCharacterRowByAlias(alias);

  if (!rowInfo) {
    return {
      ok: false,
      text: "체력 회복 적용 실패: 캐릭터를 찾을 수 없습니다."
    };
  }

  if (!rowInfo.headers.includes("최대체력") || !rowInfo.headers.includes("현재체력")) {
    return {
      ok: false,
      text: "체력 회복 적용 실패: BOT_DB에 최대체력/현재체력 열이 없습니다."
    };
  }

  SpreadsheetApp.flush();
  const fresh = findCharacterRowByAlias(alias);
  const hp = getHealthInfo(fresh.character);

  if (hp.maxHp <= 0) {
    return {
      ok: false,
      text: "체력 회복 적용 실패: 최대체력 값이 비어 있거나 0입니다."
    };
  }

  const baseHeal = Math.max(0, Math.floor(Number(healAmount) || 0));

  // 회복보정 패시브 적용
  const passiveHealResult = _applyPassiveHealingModifier(alias, baseHeal);
  // 회복보정 상태(임시 보정) 적용
  const statusHealResult = _applyStatusHealingModifier(alias, passiveHealResult.amount);
  const heal = statusHealResult.amount;

  const before = hp.currentHp;
  const after  = clampHp(before + heal, hp.maxHp);

  setCellByHeader(fresh, "현재체력", after);

  // 회복후 패시브 트리거 (회복을 받은 쪽). 실제 회복량이 0이어도 발동.
  // (예: 회복 대상이 되면 중독 — 회복량이 0으로 보정돼도 트리거는 돈다)
  var passiveHealTriggerText = "";
  if (!_HEAL_TRIGGER_ACTIVE) {
    _HEAL_TRIGGER_ACTIVE = true;
    try {
      var charForHealPassive = findCharacterByAlias(alias);
      if (charForHealPassive) {
        passiveHealTriggerText = firePassiveTriggerEffects(charForHealPassive, "회복후", {
          resistanceMode: RESIST_NONE,
          finalValue: heal
        });
      }
    } catch (_e) { /* 패시브 시트 없거나 오류 → 무시 */ }
    finally { _HEAL_TRIGGER_ACTIVE = false; }
  }

  // 파티 트리거: 같은 파티원에게 파티회복시 발동
  var partyHealText = "";
  if (!_PARTY_TRIGGER_ACTIVE) {
    _PARTY_TRIGGER_ACTIVE = true;
    try {
      var _healPartyMembers = getPartyMembersForAlias(String(alias).trim());
      var _healPartyLogs = [];
      _healPartyMembers.forEach(function(_hpm) {
        if (String(_hpm).trim() === String(alias).trim()) return;
        var _hpmChar = findCharacterByAlias(_hpm);
        if (!_hpmChar) return;
        var _hpt = firePassiveTriggerEffects(_hpmChar, "파티회복시", {
          targetAlias: alias, finalValue: heal, resistanceMode: RESIST_NONE
        });
        if (_hpt) _healPartyLogs.push("[패시브: " + _hpm + "]\n" + _hpt);
      });
      if (_healPartyLogs.length > 0) partyHealText = "[파티 트리거 — 회복]\n" + _healPartyLogs.join("\n\n");
    } catch (_e) {}
    finally { _PARTY_TRIGGER_ACTIVE = false; }
  }

  const passiveLogs = passiveHealResult.logs.concat(statusHealResult.logs);
  if (passiveHealTriggerText) passiveLogs.push(passiveHealTriggerText);
  if (partyHealText) passiveLogs.push(partyHealText);
  const passiveBlock = passiveLogs.length > 0
    ? "\n\n" + passiveLogs.join("\n\n")
    : "";

  return {
    ok: true,
    before: before,
    after: after,
    maxHp: hp.maxHp,
    heal: heal,
    text:
      "[체력 회복]\n" +
      "대상: " + alias + "\n" +
      "회복량: " + heal + (heal !== baseHeal ? " (기본: " + baseHeal + ")" : "") + "\n" +
      "현재체력: " + before + " → " + after + " / " + hp.maxHp +
      passiveBlock
  };
}

// 취약 상태가 있으면 damage를 증가시킨다. { damage, logs } 반환.
function _applyVulnerableEffects(rows, damage) {
  const logs = [];
  rows.forEach(status => {
    const code    = String(status["효과코드"] || "").trim();
    const name    = String(status["상태명"]   || "").trim();
    const trigger = String(status["발동타이밍"] || "").trim();

    const isVulnerable =
      code === EFFECT_CODE_VULNERABLE || code === "취약" || name === "취약";

    if (!isVulnerable) return;
    if (trigger && trigger !== "피해직전" && trigger !== "전체") return;

    const value = Math.max(0, Math.floor(Number(status["수치"] || 0)));
    if (value <= 0) return;

    const before = damage;
    damage += value;
    logs.push(
      "[상태 발동: 취약]\n" +
      "피해 증가: +" + value + "\n" +
      "피해: " + before + " → " + damage
    );
    consumeStatusCount(status);
  });
  return { damage, logs };
}

// 보호막 상태가 있으면 damage를 흡수한다. { damage, logs } 반환.
// ※ 취약 처리 이후에 호출해야 한다 (순서 의존).
function _applyShieldEffects(rows, damage) {
  const logs = [];
  rows.forEach(status => {
    if (damage <= 0) return;

    const code    = String(status["효과코드"] || "").trim();
    const name    = String(status["상태명"]   || "").trim();
    const trigger = String(status["발동타이밍"] || "").trim();

    const isShield =
      code === EFFECT_CODE_SHIELD ||
      code === EFFECT_CODE_BARRIER ||
      code === "보호막" ||
      name === "보호막";

    if (!isShield) return;
    if (trigger && trigger !== "피해직전" && trigger !== "전체") return;

    const shieldValue = Math.max(0, Math.floor(Number(status["수치"] || 0)));
    if (shieldValue <= 0) return;

    const absorb      = Math.min(shieldValue, damage);
    const remainShield = shieldValue - absorb;
    const before      = damage;
    damage -= absorb;

    if (remainShield <= 0) {
      updateRowById(SHEET_STATUS_DB, "id", status["id"], {
        상태: ST_EXPIRED, 수치: 0, 남은횟수: 0,
        처리일: getNowText(), 메모: "보호막 소진"
      });
    } else {
      updateRowById(SHEET_STATUS_DB, "id", status["id"], {
        수치: remainShield, 메모: "보호막 피해 흡수"
      });
      consumeStatusCount(status);
    }

    logs.push(
      "[상태 발동: 보호막]\n" +
      "흡수량: " + absorb + "\n" +
      "피해: " + before + " → " + damage + "\n" +
      "보호막: " + shieldValue + " → " + remainShield
    );
  });
  return { damage, logs };
}

// 패시브 수치 필드 파싱.
// "* 수식" 또는 "× 수식" → { mode:'mult', value:N }  (피해/회복/판정값에 곱셈 적용)
// 그 외 수식/숫자    → { mode:'add',  value:N }  (기존 덧셈 보정)
function _parsePassiveSuChi(raw, vars) {
  var s = String(raw == null ? "" : raw).trim();
  if (!s) return { mode: 'add', value: 0 };

  if (/^[*×]/.test(s)) {
    var formulaPart = s.slice(1).trim();
    try {
      var res = safeEvalFormula(formulaPart || "1", vars || {});
      // 배율은 소수(×1.5 등)가 그대로 필요하므로 정수화 전 rawValue 사용
      var v = res && res.rawValue !== undefined ? res.rawValue
            : (res && res.value !== undefined ? res.value : Number(res));
      return { mode: 'mult', value: isNaN(v) ? 1 : v };
    } catch (_e) {
      return { mode: 'mult', value: 1 };
    }
  }

  var n = Number(s);
  if (!isNaN(n)) return { mode: 'add', value: Math.floor(n) };
  try {
    var res = safeEvalFormula(s, vars || {});
    var v = res && res.value !== undefined ? res.value : Number(res);
    return { mode: 'add', value: isNaN(v) ? 0 : Math.floor(v) };
  } catch (_e) {
    return { mode: 'add', value: 0 };
  }
}

// 콤마 구분 판정 유형 목록(typeStr)이 현재 판정 유형(checkTypes)과 겹치면 true.
// 빈 값/"전체"는 항상 매칭. _passiveJudgmentMatches와 동일 규칙.
function _matchCheckTypes(typeStr, checkTypes) {
  var raw = String(typeStr || "").trim();
  if (!raw || raw === "전체") return true;
  var list = raw.split(/[,，、]/).map(function (s) { return s.trim(); }).filter(Boolean);
  var ct = (checkTypes || []).map(function (t) { return String(t || "").trim(); }).filter(Boolean);
  if (!ct.length) return false;
  return ct.some(function (t) { return list.indexOf(t) >= 0; });
}

// 패시브의 "효과" 컬럼에서 모디파이어 set-effect 줄을 추출.
//   각 줄: "[세부조건 =>] 변수 [유형목록] = 값"  (변수 ∈ varNames)
//   - 세부조건은 evaluateConditionList(ctx)로 게이트
//   - 판정보정은 유형목록 vs checkTypes 매칭(checkTypes 미지정이면 유형 무시)
// 반환: [{ variable, mode:'add'|'mult', value }]
function _collectPassiveEffectModifiers(passive, varNames, ctx, checkTypes) {
  var out = [];
  var effectText = String(passive["효과"] || "").trim();
  if (!effectText) return out;
  effectText.split(/[\n;]/).map(function (l) { return l.trim(); }).filter(Boolean)
    .forEach(function (line) {
      var effPart = line;
      var arrow = line.match(/^([\s\S]*?)\s*(?:=>|⇒|→|->)\s*([\s\S]*)$/);
      if (arrow) {
        var condPart = arrow[1].trim();
        effPart = arrow[2].trim();
        if (condPart) {
          var cr = evaluateConditionList(condPart, ctx);
          if (!cr.ok) return;
        }
      }
      if (!effPart) return;
      var setEff = _parseSetEffect(effPart);
      if (!setEff || varNames.indexOf(setEff.variable) < 0) return;
      if (checkTypes && setEff.variable === "판정보정" &&
          !_matchCheckTypes(setEff.checkType, checkTypes)) return;
      var parsed = _parsePassiveSuChi(setEff.value, ctx.vars);
      out.push({ variable: setEff.variable, mode: parsed.mode, value: parsed.value });
    });
  return out;
}

// 피해보정 패시브 (분류=피해보정 또는 효과코드=피해보정) 적용.
// 취약(damage 증가) 이후, 보호막(damage 흡수) 이전에 호출한다.
function _applyPassiveDamageModifier(alias, damage) {
  const logs = [];
  const debugLogs = [];
  try {
    const character = _resolveCharLike(alias);
    if (!character) { debugLogs.push("대상 없음: " + alias); return { damage, logs, debugLogs }; }

    const passives = getCandidatePassivesForOwner(character);
    debugLogs.push("후보수=" + passives.length + " 캐릭터=" + alias);
    const ctx      = buildConditionContext(character, "");
    debugLogs.push("현재체력비율=" + (ctx.vars["현재체력비율"] || 0));
    let addDelta  = 0;
    let multFactor = 1;

    passives.forEach(function (p) {
      const category   = String(p["분류"]    || "").trim();
      const effectCode = String(p["효과코드"] || "").trim();
      if (category !== "피해보정" && effectCode !== "피해보정") { debugLogs.push("분류불일치: 분류=" + category + " 효과코드=" + effectCode); return; }

      const trigger = String(p["발동"] || "").trim();
      if (trigger && trigger !== "피해직전" && trigger !== "항상" && trigger !== "전체") { debugLogs.push("발동불일치: " + trigger); return; }

      const result = evaluateConditionList(p["조건"], ctx);
      debugLogs.push("조건결과 ok=" + result.ok + " failed=" + JSON.stringify(result.failed));
      if (!result.ok) return;

      const name   = p["이름"] || p["key"];

      // 효과 컬럼의 줄-효과(피해보정/피해감소) 합산. 피해감소는 양수=경감 → 음수 보정.
      _collectPassiveEffectModifiers(p, ["피해보정", "피해감소"], ctx, null).forEach(function (m) {
        if (m.mode === 'mult') {
          if (m.value === 1) return;
          multFactor *= m.value;
          logs.push("[패시브: " + name + "]\n피해 배율: ×" + m.value);
        } else {
          var v = (m.variable === "피해감소") ? -Math.abs(Math.floor(m.value)) : Math.floor(m.value);
          if (!v) return;
          addDelta += v;
          logs.push("[패시브: " + name + "]\n피해 보정: " + formatSigned(v));
        }
      });

      const parsed = _parsePassiveSuChi(p["수치"], ctx.vars);
      const dMult  = result.detailMult  || 1;
      const dBonus = result.detailBonus || 0;

      if (parsed.mode === 'mult') {
        const factor = parsed.value * dMult;
        if (factor === 1 && !dBonus) { debugLogs.push("배율=1 스킵"); return; }
        multFactor *= factor;
        if (dBonus) addDelta += dBonus;
        logs.push("[패시브: " + name + "]\n피해 배율: ×" + factor + (dBonus ? " 추가보정 " + formatSigned(dBonus) : ""));
      } else {
        const v = Math.floor(parsed.value * dMult) + dBonus;
        if (!v) { debugLogs.push("수치=0 스킵"); return; }
        addDelta += v;
        const noteStr = (dMult !== 1 || dBonus) ? " (세부 ×" + dMult + (dBonus ? " +" + dBonus : "") + " 적용)" : "";
        logs.push("[패시브: " + name + "]\n피해 보정: " + formatSigned(v) + noteStr);
      }
    });

    damage = Math.max(0, Math.round(damage * multFactor) + addDelta);
  } catch (_e) { debugLogs.push("오류: " + _e.message); }

  return { damage, logs, debugLogs };
}

// 회복보정 패시브 (분류=회복보정 또는 효과코드=회복보정) 적용.
function _applyPassiveHealingModifier(alias, amount) {
  const logs = [];
  try {
    const character = _resolveCharLike(alias);
    if (!character) return { amount, logs };

    const passives = getCandidatePassivesForOwner(character);
    const ctx      = buildConditionContext(character, "");
    let addDelta  = 0;
    let multFactor = 1;

    passives.forEach(function (p) {
      const category   = String(p["분류"]    || "").trim();
      const effectCode = String(p["효과코드"] || "").trim();
      if (category !== "회복보정" && effectCode !== "회복보정") return;

      const trigger = String(p["발동"] || "").trim();
      if (trigger && trigger !== "회복시" && trigger !== "항상" && trigger !== "전체") return;

      const result = evaluateConditionList(p["조건"], ctx);
      if (!result.ok) return;

      const name   = p["이름"] || p["key"];

      // 효과 컬럼의 줄-효과(회복보정) 합산.
      _collectPassiveEffectModifiers(p, ["회복보정"], ctx, null).forEach(function (m) {
        if (m.mode === 'mult') {
          if (m.value === 1) return;
          multFactor *= m.value;
          logs.push("[패시브: " + name + "]\n회복 배율: ×" + m.value);
        } else {
          var v = Math.floor(m.value);
          if (!v) return;
          addDelta += v;
          logs.push("[패시브: " + name + "]\n회복 보정: " + formatSigned(v));
        }
      });

      const parsed = _parsePassiveSuChi(p["수치"], ctx.vars);
      const dMult  = result.detailMult  || 1;
      const dBonus = result.detailBonus || 0;

      if (parsed.mode === 'mult') {
        const factor = parsed.value * dMult;
        if (factor === 1 && !dBonus) return;
        multFactor *= factor;
        if (dBonus) addDelta += dBonus;
        logs.push("[패시브: " + name + "]\n회복 배율: ×" + factor);
      } else {
        const v = Math.floor(parsed.value * dMult) + dBonus;
        if (!v) return;
        addDelta += v;
        logs.push("[패시브: " + name + "]\n회복 보정: " + formatSigned(v));
      }
    });

    amount = Math.max(0, Math.round(amount * multFactor) + addDelta);
  } catch (_e) { /* 무시 */ }

  return { amount, logs };
}

// 상태 기반 피해보정 (분류 또는 효과코드 = 피해보정). 수치 음수=경감, *N=배율.
// 설정효과(피해보정/피해감소 = N)나 상태부여로 걸린 임시 보정에 사용. 지속(횟수 미소모).
function _applyStatusDamageModifier(alias, damage) {
  const logs = [];
  try {
    const rows = getActiveStatusRows(alias);
    let addDelta = 0;
    let multFactor = 1;
    rows.forEach(function (s) {
      const cat  = String(s["분류"]   || "").trim();
      const code = String(s["효과코드"] || "").trim();
      if (cat !== "피해보정" && code !== "피해보정") return;
      const raw = s["수치"];
      const nm = s["상태명"] || "피해보정";
      if (_isMultValue(raw)) {
        const f = _multFactor(raw);
        if (f !== 1) { multFactor *= f; logs.push("[상태: " + nm + "]\n피해 배율: ×" + f); }
      } else {
        const v = Math.floor(Number(raw) || 0);
        if (v) { addDelta += v; logs.push("[상태: " + nm + "]\n피해 보정: " + formatSigned(v)); }
      }
    });
    damage = Math.max(0, Math.round(damage * multFactor) + addDelta);
  } catch (_e) { /* 무시 */ }
  return { damage, logs };
}

// 상태 기반 회복보정 (분류 또는 효과코드 = 회복보정).
function _applyStatusHealingModifier(alias, amount) {
  const logs = [];
  try {
    const rows = getActiveStatusRows(alias);
    let addDelta = 0;
    let multFactor = 1;
    rows.forEach(function (s) {
      const cat  = String(s["분류"]   || "").trim();
      const code = String(s["효과코드"] || "").trim();
      if (cat !== "회복보정" && code !== "회복보정") return;
      const raw = s["수치"];
      const nm = s["상태명"] || "회복보정";
      if (_isMultValue(raw)) {
        const f = _multFactor(raw);
        if (f !== 1) { multFactor *= f; logs.push("[상태: " + nm + "]\n회복 배율: ×" + f); }
      } else {
        const v = Math.floor(Number(raw) || 0);
        if (v) { addDelta += v; logs.push("[상태: " + nm + "]\n회복 보정: " + formatSigned(v)); }
      }
    });
    amount = Math.max(0, Math.round(amount * multFactor) + addDelta);
  } catch (_e) { /* 무시 */ }
  return { amount, logs };
}

function processPreDamageStatuses(alias, damageAmount) {
  const rows   = getActiveStatusRows(alias);
  let damage   = Math.max(0, Math.floor(Number(damageAmount) || 0));

  // 1. 취약 (피해 증가)
  const vulnResult    = _applyVulnerableEffects(rows, damage);
  damage              = vulnResult.damage;

  // 2. 피해보정 패시브 (취약 반영 후, 보호막 전)
  const passiveDmgResult = _applyPassiveDamageModifier(alias, damage);
  damage                 = passiveDmgResult.damage;

  // 2-1. 피해보정 상태 (임시 보정 — 설정효과/상태부여로 걸린 것)
  const statusDmgResult = _applyStatusDamageModifier(alias, damage);
  damage                = statusDmgResult.damage;

  // 3. 보호막 (피해 흡수)
  const shieldResult  = _applyShieldEffects(rows, damage);
  damage              = shieldResult.damage;

  // 4. 장비 피해감소
  const equipDmgResult = _applyEquipmentDamageModifier(alias, damage);
  damage               = equipDmgResult.damage;

  const logs = [...vulnResult.logs, ...passiveDmgResult.logs, ...statusDmgResult.logs, ...shieldResult.logs, ...equipDmgResult.logs];
  const debugLogs = passiveDmgResult.debugLogs || [];
  return { damage, text: logs.join("\n\n"), debugText: debugLogs.join("\n") };
}

// 가해후 트리거 재진입 가드: 가해후 패시브가 또 피해를 입혀 무한 재귀하는 것을 막는다.
var _DEALT_TRIGGER_ACTIVE = false;
var _PARTY_TRIGGER_ACTIVE = false;

function applyDamageToCharacter(alias, damageAmount, opts) {
  opts = opts || {};
  const rowInfo = findCharacterRowByAlias(alias);

  if (!rowInfo) {
    return {
      ok: false,
      text: "피해 적용 실패: 캐릭터를 찾을 수 없습니다: " + alias
    };
  }

  if (!rowInfo.headers.includes("최대체력") || !rowInfo.headers.includes("현재체력")) {
    return {
      ok: false,
      text: "피해 적용 실패: BOT_DB에 최대체력/현재체력 열이 없습니다."
    };
  }

  SpreadsheetApp.flush();

  const fresh = findCharacterRowByAlias(alias);
  const hp = getHealthInfo(fresh.character);

  const originalDamage = Math.max(0, Math.floor(Number(damageAmount) || 0));
  const preDamage = processPreDamageStatuses(alias, originalDamage);
  const damage = Math.max(0, Math.floor(Number(preDamage.damage) || 0));

  // 피해직전 패시브 트리거
  var passivePreText = "";
  try {
    var charForPrePassive = findCharacterByAlias(alias);
    if (charForPrePassive) {
      passivePreText = firePassiveTriggerEffects(charForPrePassive, "피해직전", {
        resistanceMode: RESIST_NONE,
        finalValue: damage
      });
    }
  } catch (_e) { /* 패시브 시트 없거나 오류 → 무시 */ }

  const before = hp.currentHp;
  const after = Math.max(0, before - damage);

  setCellByHeader(fresh, "현재체력", after);

  // 피해후 패시브 트리거 (피해를 받은 쪽)
  var passivePostText = "";
  try {
    var charForPostPassive = findCharacterByAlias(alias);
    if (charForPostPassive) {
      passivePostText = firePassiveTriggerEffects(charForPostPassive, "피해후", {
        resistanceMode: RESIST_NONE,
        finalValue: damage
      });
    }
  } catch (_e) { /* 패시브 시트 없거나 오류 → 무시 */ }

  // 공격 해결 시 공격자 쪽 트리거 (자기 자신 제외).
  //  - 공격해결후: 피해 0 포함 항상 1회 (성공/실패 판정용)
  //  - 가해후    : 실제 피해 > 0 일 때만 (기존 동작 유지)
  var passiveDealtText = "";
  var attackerAlias = String(opts.attackerAlias || "").trim();
  if (attackerAlias && !_DEALT_TRIGGER_ACTIVE && attackerAlias !== String(alias).trim()) {
    _DEALT_TRIGGER_ACTIVE = true;
    try {
      var dealerChar = _resolveCharLike(attackerAlias);  // 공격자가 PC 또는 에너미
      if (dealerChar) {
        var _argName = String(opts.sourceName || "").trim();
        var _parts = [];
        var _resolvedText = firePassiveTriggerEffects(dealerChar, "공격해결후", {
          targetAlias: alias, finalValue: damage, triggerArg: _argName, resistanceMode: RESIST_NONE
        });
        if (_resolvedText) _parts.push(_resolvedText);
        if (damage > 0) {
          var _dealtText = firePassiveTriggerEffects(dealerChar, "가해후", {
            targetAlias: alias, finalValue: damage, triggerArg: _argName, resistanceMode: RESIST_NONE
          });
          if (_dealtText) _parts.push(_dealtText);
        }
        passiveDealtText = _parts.join("\n\n");
      }
    } catch (_e) { /* 패시브 시트 없거나 오류 → 무시 */ }
    finally { _DEALT_TRIGGER_ACTIVE = false; }
  }

  // 파티 트리거: 피해받은 캐릭터의 파티원에게 파티피해시 발동
  var passivePartyDmgText = "";
  if (!_PARTY_TRIGGER_ACTIVE) {
    _PARTY_TRIGGER_ACTIVE = true;
    try {
      var _dmgPartyMembers = getPartyMembersForAlias(String(alias).trim());
      var _dmgPartyLogs = [];
      _dmgPartyMembers.forEach(function(_dpm) {
        if (String(_dpm).trim() === String(alias).trim()) return;
        var _dpmChar = findCharacterByAlias(_dpm);
        if (!_dpmChar) return;
        var _dpt = firePassiveTriggerEffects(_dpmChar, "파티피해시", {
          targetAlias: alias, finalValue: damage, resistanceMode: RESIST_NONE
        });
        if (_dpt) _dmgPartyLogs.push("[패시브: " + _dpm + "]\n" + _dpt);
      });
      if (_dmgPartyLogs.length > 0) passivePartyDmgText = _dmgPartyLogs.join("\n\n");
    } catch (_e) {}
    finally { _PARTY_TRIGGER_ACTIVE = false; }
  }

  // 파티 트리거: 공격자의 파티원에게 파티가해시 발동
  var passivePartyDealtText = "";
  if (attackerAlias && damage > 0 && !_PARTY_TRIGGER_ACTIVE) {
    _PARTY_TRIGGER_ACTIVE = true;
    try {
      var _atkerPartyMembers = getPartyMembersForAlias(attackerAlias);
      var _atkerPartyLogs = [];
      _atkerPartyMembers.forEach(function(_apm) {
        if (String(_apm).trim() === String(attackerAlias).trim()) return;
        var _apmChar = findCharacterByAlias(_apm);
        if (!_apmChar) return;
        var _apt = firePassiveTriggerEffects(_apmChar, "파티가해시", {
          targetAlias: alias, finalValue: damage, resistanceMode: RESIST_NONE
        });
        if (_apt) _atkerPartyLogs.push("[패시브: " + _apm + "]\n" + _apt);
      });
      if (_atkerPartyLogs.length > 0) passivePartyDealtText = _atkerPartyLogs.join("\n\n");
    } catch (_e) {}
    finally { _PARTY_TRIGGER_ACTIVE = false; }
  }

  let downText = "";

  if (after <= 0 && before > 0) {
    downText =
      "\n\n[전투불능]\n" +
      alias + "의 현재체력이 0이 되었습니다.\n" +
      "기절, 중상, 행동 불능, 포획 등은 장면 맥락에 따라 처리하세요.";
  }

  const modifierText = preDamage.text
    ? "\n\n" + preDamage.text
    : "";
  const passivePreBlock  = passivePreText  ? "\n\n" + passivePreText  : "";
  const passivePostBlock = passivePostText ? "\n\n" + passivePostText : "";
  const passiveDealtBlock = passiveDealtText
    ? "\n\n[공격 후 패시브: " + attackerAlias + "]\n" + passiveDealtText
    : "";
  const passivePartyDmgBlock  = passivePartyDmgText  ? "\n\n[파티 트리거 — 피해]\n" + passivePartyDmgText  : "";
  const passivePartyDealtBlock = passivePartyDealtText ? "\n\n[파티 트리거 — 가해]\n" + passivePartyDealtText : "";

  const shortText =
    "[피해 적용]\n" +
    "대상: " + alias + "\n" +
    "현재체력: " + before + " → " + after + " / " + hp.maxHp +
    downText;

  const mainText =
    "[피해 적용]\n" +
    "대상: " + alias + "\n" +
    "기본피해: " + originalDamage + "\n" +
    "최종피해: " + damage + "\n" +
    "현재체력: " + before + " → " + after + " / " + hp.maxHp +
    modifierText +
    passivePreBlock +
    downText +
    passivePostBlock +
    passiveDealtBlock +
    passivePartyDmgBlock +
    passivePartyDealtBlock;

  const detailText = preDamage.debugText
    ? mainText + "\n\n[패시브 디버그]\n" + preDamage.debugText
    : "";

  return {
    ok: true,
    before: before,
    after: after,
    maxHp: hp.maxHp,
    originalDamage: originalDamage,
    damage: damage,
    modifierText: preDamage.text,
    text: mainText,
    shortText: shortText,
    detailText: detailText,
    // 공격 후 패시브(랜덤지정 메시지 등) — 요약에도 노출하기 위해 분리 제공.
    dealtText: passiveDealtText,
    attackerAlias: attackerAlias,
  };
}

function damageApply(parts, displayName) {
  if (parts.length < 3) {
    return (
      "사용법: !피해 캐릭터별명 수치\n" +
      "예시: !피해 월하륜 13"
    );
  }

  const resolved = _resolveAliasFromTokens(parts, 1, 1);
  const alias  = resolved.alias;
  const amount = resolved.rest[0] || parts[parts.length - 1];

  const result = applyDamageToCharacter(alias, amount);
  if (!result.ok) return result.text;
  if (result.detailText) return makeFoldedResponse(result.text, result.detailText);
  return result.text;
}

function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function rollDice(count, sides) {
  const rolls = [];

  for (let i = 0; i < count; i++) {
    rolls.push(rollDie(sides));
  }

  return rolls;
}

function expandDiceNotationInFormula(expr) {
  const diceLogs = [];

  expr = String(expr || "");

  const replaced = expr.replace(
    /(^|[^가-힣A-Za-z0-9_])(\d*)[dD](\d+)(?![가-힣A-Za-z0-9_])/g,
    function(full, prefix, countText, sidesText) {
      const count = countText ? Number(countText) : 1;
      const sides = Number(sidesText);

      if (!Number.isInteger(count) || count < 1 || count > 100) {
        throw new Error("다이스 개수가 올바르지 않습니다: " + full.trim());
      }

      if (!Number.isInteger(sides) || sides < 2 || sides > 1000) {
        throw new Error("다이스 면수가 올바르지 않습니다: " + full.trim());
      }

      const rolls = rollDice(count, sides);
      const sum = rolls.reduce((a, b) => a + b, 0);

      const label = (countText || "1") + "d" + sides;
      diceLogs.push(label + " [" + rolls.join(", ") + "] = " + sum);

      return prefix + String(sum);
    }
  );

  return {
    expression: replaced,
    diceLogs: diceLogs
  };
}

function formatDiceLogs(diceLogs) {
  if (!diceLogs || diceLogs.length === 0) {
    return "없음";
  }

  return diceLogs.join("\n");
}

function applyMods(value, mods) {
  let result = Number(value);

  // 연산자와 숫자가 공백으로 분리돼 들어온 경우(예: "+", "99") 병합.
  // "+ 99" 처럼 띄어 써도 "+99"와 동일하게 처리.
  const list = [];
  (mods || []).forEach(m => {
    const s = String(m == null ? "" : m).trim();
    if (!s) return;
    if (/^[+\-*×x]$/.test(s) && list.length === 0) { list.push(s); return; } // 선두 단독 연산자
    if (/^[+\-*×x]$/.test(s)) { list.push(s); return; }
    // 직전이 단독 연산자면 병합
    if (list.length > 0 && /^[+\-*×x]$/.test(list[list.length - 1]) && /^\d/.test(s)) {
      list[list.length - 1] = list[list.length - 1] + s;
    } else {
      list.push(s);
    }
  });

  list.forEach(mod => {
    if (mod.startsWith("+")) {
      result += Number(mod.slice(1));
    } else if (mod.startsWith("-")) {
      result -= Number(mod.slice(1));
    } else if (mod.startsWith("*") || mod.startsWith("×") || mod.startsWith("x")) {
      result *= Number(mod.slice(1));
    }
  });

  return Math.floor(result);
}

function parseTargetAndMods(tokens) {
  const mods = [];
  let target = "";
  let i = 0;

  while (i < tokens.length) {
    var token = String(tokens[i] || "").trim();
    if (!token) { i++; continue; }

    if (token.startsWith("대상:") || token.startsWith("대상=")) {
      target = token.replace(/^대상[:=]/, "").trim();
      i++;
      // 다음 토큰이 이름의 연장인지 탐욕적으로 확인 (공백 포함 닉네임 지원)
      while (i < tokens.length) {
        var next = String(tokens[i] || "").trim();
        // +2/-3 보정값, key:value 옵션이면 중단
        if (!next || /^[+\-]/.test(next) || /^[가-힣A-Za-z0-9_]+[:=]/.test(next)) break;
        // 쉼표로 끝나는 다중 대상 누적 (예: "대상:A," 다음 "B" → "A,B")
        if (target.endsWith(",") || target.endsWith("，")) {
          target = target + next;
          i++;
          continue;
        }
        var combined = target + " " + next;
        if (findCharacterByAlias(combined)) {
          target = combined;
          i++;
        } else {
          break;
        }
      }
    } else {
      mods.push(token);
      i++;
    }
  }

  // 쉼표로 구분된 개별 대상 분리
  var rawTargets = target.split(/[,，]+/).map(function(s) { return s.trim(); }).filter(Boolean);

  // 단일 대상일 때만 닉네임 → 정식 별명 변환 (다중 대상은 resolveMultiTargets에서 처리)
  if (rawTargets.length === 1) {
    var t0 = rawTargets[0];
    if (t0 && t0 !== "자신" && t0 !== "대상") {
      var charFound = findCharacterByAlias(t0);
      if (charFound) {
        target = String(charFound["별명"] || t0).trim();
        rawTargets[0] = target;
      } else {
        target = t0;
      }
    } else {
      target = t0 || "";
    }
  } else if (rawTargets.length > 1) {
    target = rawTargets[0];
  }

  return { target: target, mods: mods, rawTargets: rawTargets };
}

// 다중 대상 문자열 배열(rawTargets)을 정규 별명 목록으로 변환.
// 파티명이 포함된 경우 파티 멤버 전체로 확장한다.
function resolveMultiTargets(rawTargets) {
  if (!rawTargets || rawTargets.length === 0) return [];
  var resolved = [];
  var seen = {};

  rawTargets.forEach(function(t) {
    t = String(t || "").trim();
    if (!t) return;

    if (t === "자신" || t === "대상") {
      if (!seen[t]) { seen[t] = true; resolved.push(t); }
      return;
    }

    // 파티명 확인 → 멤버 전체 확장
    var members = getPartyMembers(t);
    if (members.length > 0) {
      members.forEach(function(m) {
        m = String(m || "").trim();
        if (m && !seen[m]) { seen[m] = true; resolved.push(m); }
      });
      return;
    }

    // 캐릭터 별명 정규화
    var ch = findCharacterByAlias(t);
    if (ch) {
      var canon = String(ch["별명"] || t).trim();
      if (!seen[canon]) { seen[canon] = true; resolved.push(canon); }
      return;
    }

    // 에너미 (createPendingAttackFlex가 처리; 원본 문자열 유지)
    try {
      var enemy = resolveEnemy(t);
      if (enemy) {
        var ekey = String(enemy["enemy_id"] || t).trim();
        if (!seen[ekey]) { seen[ekey] = true; resolved.push(t); }
        return;
      }
    } catch(_e) {}

    // 알 수 없는 대상 — 원본 보존 (호출부에서 오류 처리)
    if (!seen[t]) { seen[t] = true; resolved.push(t); }
  });

  return resolved;
}

function statCheck(parts, displayName) {
  if (parts.length < 2) {
    return "사용법: !판정 스탯명 [난이도] [보정]\n예시: !판정 민첩 20 +2\n단축: !민첩 20 +2";
  }

  const character = findCharacter(displayName);

  if (!character) {
    return (
      "캐릭터를 찾을 수 없습니다.\n" +
      "디스코드 별명: " + displayName + "\n" +
      "BOT_DB의 별명 열과 디스코드 서버 별명이 같은지 확인하세요."
    );
  }

  const alias = String(character["별명"]).trim();

  const statusResult = processStatusBeforeCheck(alias, KIND_STAT);

  if (statusResult.blocked) {
    return statusResult.text;
  }

  const statName = parts[1];

  if (!(statName in character)) {
    return "존재하지 않는 스탯입니다: " + statName;
  }

  const parsed = parseDifficultyAndMods(parts.slice(2));
  const difficulty = parsed.difficulty;
  const mods = parsed.mods;

  const statGrade = character[statName];
  const statValue = statToValue(statGrade);
  const dice = rollDie(20);

  const base = dice + statValue;

  let finalValue;
  let statusMod = {
   value: 0,
   delta: 0,
   text: "",
   before: 0,
   after: 0
  };

  try {
   finalValue = applyMods(base, mods);
   statusMod = applyStatusModifierToValue(alias, finalValue, [KIND_STAT, statName]);
   finalValue = statusMod.value;
   var _statEquipMod = getEquipmentModifier(alias, [KIND_STAT, statName]);
   finalValue += _statEquipMod.delta;
  } catch (e) {
    return (
      "[스탯 판정 오류]\n" +
      character["이름"] + " - " + statName + "\n\n" +
      "보정 처리 중 오류가 발생했습니다.\n\n" +
      "오류: " + e.message
    );
  }

  const judged = getDifficultyResultText(finalValue, difficulty);

  // summary: 상태 처리(패시브 제외) + 핵심 결과만
  const statusPrefix = statusResult.text
    ? statusResult.text + "\n\n"
    : "";
  // detail: 패시브 포함 전체 상태 처리
  const detailStatusPrefix = statusResult.fullText
    ? statusResult.fullText + "\n\n"
    : "";

  const summary =
    statusPrefix +
    "[스탯 판정]\n" +
    character["이름"] + " - " + statName + "\n\n" +
    "최종값: " + finalValue + "\n" +
    "난이도: " + difficulty + "\n" +
    "차이: " + formatSigned(judged.diff) + "\n" +
    judged.text;

  const detail =
    detailStatusPrefix +
    "[스탯 판정 상세]\n" +
    character["이름"] + " - " + statName + "\n\n" +
    "난수: " + dice + "\n" +
    statName + " " + statGrade + "(" + statValue + ")\n" +
    "기본값: " + base + "\n" +
    "보정: " + (mods.join(" ") || "없음") + "\n\n" +
    (_formatJudgeModDetail(statusMod, _statEquipMod)
      ? _formatJudgeModDetail(statusMod, _statEquipMod) + "\n\n" : "") +
    _statusModSummaryLine(statusMod) +
    "최종값: " + finalValue + "\n" +
    "난이도: " + difficulty + "\n" +
    "차이: " + formatSigned(judged.diff) + "\n" +
    judged.text;

  return makeFoldedResponse(summary, detail);
}

function getComponentValue(character, component) {
  const type = String(component["type"]).trim();
  const name = String(component["name"]).trim();

  if (type === "stat") {
    if (!(name in character)) {
      throw new Error("캐릭터에 해당 스탯이 없습니다: " + name);
    }

    return statToValue(character[name]);
  }

  if (type === "feature" || type === "prof") {
    const directValue = getDirectNumber(character, name);

    if (directValue !== null) {
      return directValue;
    }

    if (type === "feature") {
      const features = parseStatMap(character["기능"]);
      return Number(features[name] || 0);
    }

    if (type === "prof") {
      const profs = parseStatMap(character["숙련"]);
      return Number(profs[name] || 0);
    }
  }

  throw new Error("알 수 없는 component type: " + type);
}

function rollActionValueForCharacter(character, actionName, mods) {
  mods = mods || [];

  const components = getSheetData(SHEET_ACTION_COMPONENTS)
    .filter(r => String(r["action"]).trim() === String(actionName).trim());

  if (components.length === 0) {
    throw new Error("존재하지 않는 액션입니다: " + actionName);
  }

  let baseTotal = 0;
  let factorBonus = 0;
  const detailLines = [];

  components.forEach(c => {
    const part = String(c["part"]).trim();
    const name = String(c["name"]).trim();
    const coef = Number(c["coef"]);

    const value = getComponentValue(character, c);
    const contribution = value * coef;

    if (part === "base") {
      baseTotal += contribution;
      detailLines.push(
        "[기초] " + name + "(" + value + ") × " + coef + " = " + round2(contribution)
      );
    } else if (part === "factor") {
      factorBonus += contribution;
      detailLines.push(
        "[배율] " + name + "(" + value + ") × " + coef + " = " + round2(contribution)
      );
    }
  });

  const factor = 1 + factorBonus;
  const rawCoef = baseTotal * factor;
  // 명령어 보정·장비 보정은 더 이상 계수(다이스 전)에 넣지 않는다.
  // 다이스 수는 순수 계수로만 정하고, 보정/장비는 굴린 최종값에 더한다.
  const finalCoef = Math.max(0, Math.floor(rawCoef));

  const diceCount = Math.max(1, Math.ceil(finalCoef / ACTION_DICE_STEP));
  const rolls = rollDice(diceCount, ACTION_DICE_SIDES);
  let sum = rolls.reduce((a, b) => a + b, 0);

  const alias = String(character["별명"] || "").trim();
  const statusMod = applyStatusModifierToValue(alias, sum, [KIND_ACTION, actionName, KIND_RESPONSE]);
  sum = statusMod.value;
  // 장비 보정(최종값 가산)
  const equipMod = getEquipmentModifier(alias, [KIND_ACTION, actionName, KIND_RESPONSE]);
  sum += equipMod.delta;
  // 명령어 보정(최종값에 +N/-N/*N 적용)
  sum = applyMods(sum, mods);

  return {
    actionName: actionName,
    baseTotal: baseTotal,
    factorBonus: factorBonus,
    factor: factor,
    rawCoef: rawCoef,
    finalCoef: finalCoef,
    diceCount: diceCount,
    rolls: rolls,
    sum: sum,
    statusMod: statusMod,
    equipMod: equipMod,
    mods: mods,
    detailLines: detailLines
  };
}

function actionCheck(parts, displayName) {
  if (parts.length < 2) {
    return "사용법: !액션 액션명 [난이도] [보정]\n예시: !액션 은신 18 +2\n단축: !은신 18 +2";
  }

  const character = findCharacter(displayName);

  if (!character) {
    return (
      "캐릭터를 찾을 수 없습니다.\n" +
      "디스코드 별명: " + displayName + "\n" +
      "BOT_DB의 별명 열과 디스코드 서버 별명이 같은지 확인하세요."
    );
  }

  const alias = String(character["별명"]).trim();

  const actionName = parts[1];
  const statusResult = processStatusBeforeCheck(alias, [KIND_ACTION, actionName]);

  if (statusResult.blocked) {
    return statusResult.text;
  }
  const isDamage = isDamageAction(actionName);

  const targetParsed = parseTargetAndMods(parts.slice(2));

  const parsed = isDamage
    ? { difficulty: null, mods: targetParsed.mods, target: targetParsed.target }
    : parseDifficultyAndMods(parts.slice(2));

  const difficulty = parsed.difficulty;
  const mods = parsed.mods;

  const components = getSheetData(SHEET_ACTION_COMPONENTS)
    .filter(r => String(r["action"]).trim() === String(actionName).trim());

  if (components.length === 0) {
    return "존재하지 않는 액션입니다: " + actionName;
  }

  let baseTotal = 0;
  let factorBonus = 0;
  const detailLines = [];

  components.forEach(c => {
    const part = String(c["part"]).trim();
    const name = String(c["name"]).trim();
    const coef = Number(c["coef"]);

    const value = getComponentValue(character, c);
    const contribution = value * coef;

    if (part === "base") {
      baseTotal += contribution;
      detailLines.push(
        "[기초] " + name + "(" + value + ") × " + coef + " = " + round2(contribution)
      );
    } else if (part === "factor") {
      factorBonus += contribution;
      detailLines.push(
        "[배율] " + name + "(" + value + ") × " + coef + " = " + round2(contribution)
      );
    }
  });

  const factor = 1 + factorBonus;
  const rawCoef = baseTotal * factor;

  // 명령어 보정은 계수(다이스 전)가 아니라 굴린 최종값에 더한다. 다이스 수는 순수 계수로만.
  const finalCoef = Math.max(0, Math.floor(rawCoef));

  const diceCount = Math.max(1, Math.ceil(finalCoef / ACTION_DICE_STEP));
  const rolls = rollDice(diceCount, ACTION_DICE_SIDES);
  let sum = rolls.reduce((a, b) => a + b, 0);

  const statusMod = applyStatusModifierToValue(alias, sum, [KIND_ACTION, actionName]);
  sum = statusMod.value;
  const _actEquipMod = getEquipmentModifier(alias, [KIND_ACTION, actionName]);
  sum += _actEquipMod.delta;
  // 명령어 보정(최종값에 +N/-N/*N 적용)
  try {
    sum = applyMods(sum, mods);
  } catch (e) {
    return (
      "[액션 판정 오류]\n" +
      character["이름"] + " - " + actionName + "\n\n" +
      "보정 처리 중 오류가 발생했습니다.\n\n" +
      "오류: " + e.message
    );
  }

  let combatText = "";

  if (isDamage && parsed.target) {
    const attackerAlias = alias;
    const targets = resolveMultiTargets(
      parsed.rawTargets && parsed.rawTargets.length > 0 ? parsed.rawTargets : [parsed.target]
    );
    const combatTexts = [];
    targets.forEach(function(tgt) {
      const pending = createPendingAttackFlex(attackerAlias, tgt, "액션", actionName, sum);
      combatTexts.push(pending.ok ? makeCombatChoiceTextFlex(pending) : pending.text);
    });
    if (combatTexts.length > 0) combatText = "\n\n" + combatTexts.join("\n\n");
  }

  const judged = isDamage ? null : getDifficultyResultText(sum, difficulty);

  const judgeSummary = judged
    ? "\n난이도: " + difficulty +
      "\n차이: " + formatSigned(judged.diff) +
      "\n" + judged.text
    : "";

  // summary: 상태 처리(패시브 제외), detail: 패시브 포함 전체
  const statusPrefix = statusResult.text
    ? statusResult.text + "\n\n"
    : "";
  const detailStatusPrefix = statusResult.fullText
    ? statusResult.fullText + "\n\n"
    : "";

  // 액션사용후 패시브 트리거. "액션사용후"(모든 액션) 또는 "액션사용후:액션명"(특정 액션).
  var actionPostText = "";
  try {
    actionPostText = firePassiveTriggerEffects(character, "액션사용후", {
      triggerArg: actionName, finalValue: sum, targetAlias: parsed.target || "",
      resistanceMode: RESIST_NONE
    });
  } catch (_e) { /* 패시브 시트 없거나 오류 → 무시 */ }
  const actionPostBlock = actionPostText ? "\n\n" + actionPostText : "";

  const summary =
    statusPrefix +
    "[액션 판정]\n" +
    character["이름"] + " - " + actionName + "\n\n" +
    "최종 계수: " + finalCoef + "\n" +
    "주사위: " + diceCount + "d" + ACTION_DICE_SIDES + "\n" +
    "합계: " + sum +
    judgeSummary +
    combatText;

  const detail =
    detailStatusPrefix +
    "[액션 판정 상세]\n" +
    character["이름"] + " - " + actionName + "\n\n" +
    detailLines.join("\n") + "\n\n" +
    "기초부 합계: " + round2(baseTotal) + "\n" +
    "배율부: 1 + " + round2(factorBonus) + " = " + round2(factor) + "\n" +
    "계수값: " + round2(rawCoef) + "\n" +
    "최종 계수: " + finalCoef + "\n\n" +
    "주사위: " + diceCount + "d" + ACTION_DICE_SIDES + "\n" +
    "결과: " + rolls.join(", ") + "\n" +
    (_formatJudgeModDetail(statusMod, _actEquipMod)
      ? _formatJudgeModDetail(statusMod, _actEquipMod) + "\n\n" : "") +
    "명령 보정: " + (mods.join(" ") || "없음") + "\n" +
    "합계: " + sum +
    judgeSummary +
    combatText +
    actionPostBlock;

  return makeFoldedResponse(summary, detail);
}

function powerCheck(parts, type, displayName) {
  if (parts.length < 2) {
    return "사용법: !" + type + " 랭크\n예시: !" + type + " A +2";
  }

  const character = findCharacter(displayName);

  if (!character) {
    return (
      "캐릭터를 찾을 수 없습니다.\n" +
      "디스코드 별명: " + displayName
    );
  }

  const alias = String(character["별명"]).trim();

  const statusResult = processStatusBeforeCheck(alias, KIND_POWER);

  if (statusResult.blocked) {
    return statusResult.text;
  }

  const rank = String(parts[1]).trim().toUpperCase();
  const targetParsed = parseTargetAndMods(parts.slice(2));
  const mods = targetParsed.mods;
  const targetAlias = targetParsed.target;

  let rankValue;

  try {
    rankValue = rankToValue(rank);
  } catch (e) {
    return "존재하지 않는 랭크입니다: " + rank;
  }

  const dice = rollDie(20);

  let base = dice + rankValue;
  let typeBonusText = "";

  if (type === "방호") {
    base += 3;
    typeBonusText = "방호 보정: +3\n";
  }
  let finalValue;
  let statusMod = {
   value: 0,
   delta: 0,
   text: "",
   before: 0,
   after: 0
  };

  try {
   finalValue = applyMods(base, mods);
   statusMod = applyStatusModifierToValue(alias, finalValue, [KIND_POWER, type]);
   finalValue = statusMod.value;
   var _powEquipMod = getEquipmentModifier(alias, [KIND_POWER, type]);
   finalValue += _powEquipMod.delta;
  } catch (e) {
    return (
      "[" + type + " 판정 오류]\n" +
      "보정 처리 중 오류가 발생했습니다.\n\n" +
      "오류: " + e.message
    );
  }

  const resultText = getSkillResultText(type, finalValue);

  let healingText = "";

  if (type === "치유" || type === "재생") {
    const healTarget = targetAlias || alias;
    const healResult = applyHealingToCharacter(healTarget, finalValue);
    healingText = "\n\n" + healResult.text;
  }

  let combatText = "";

  if (type === "화력" && targetAlias) {
    const targets = resolveMultiTargets(
      targetParsed.rawTargets && targetParsed.rawTargets.length > 0
        ? targetParsed.rawTargets : [targetAlias]
    );
    const combatTexts = [];
    targets.forEach(function(tgt) {
      const pending = createPendingAttackFlex(alias, tgt, KIND_POWER, "화력 " + rank, finalValue);
      combatTexts.push(pending.ok ? makeCombatChoiceTextFlex(pending) : pending.text);
    });
    if (combatTexts.length > 0) combatText = "\n\n" + combatTexts.join("\n\n");
  }

  // summary: 상태 처리(패시브 제외), detail: 패시브 포함 전체
  const statusPrefix = statusResult.text
    ? statusResult.text + "\n\n"
    : "";
  const detailStatusPrefix = statusResult.fullText
    ? statusResult.fullText + "\n\n"
    : "";

  const summary =
    statusPrefix +
    "[" + type + " 판정]\n\n" +
    "사용자: " + alias + "\n" +
    "랭크: " + rank + "(" + rankValue + ")\n" +
    "최종값: " + finalValue + "\n" +
    resultText +
    healingText +
    combatText;

  const detail =
    detailStatusPrefix +
    "[" + type + " 판정 상세]\n\n" +
    "사용자: " + alias + "\n" +
    "난수: " + dice + "\n" +
    "랭크: " + rank + "(" + rankValue + ")\n" +
    typeBonusText +
    "기본값: " + base + "\n" +
    "보정: " + (mods.join(" ") || "없음") + "\n\n" +
    (_formatJudgeModDetail(statusMod, _powEquipMod)
      ? _formatJudgeModDetail(statusMod, _powEquipMod) + "\n\n" : "") +
    "최종값: " + finalValue + "\n" +
    resultText +
    healingText +
    combatText;

  return makeFoldedResponse(summary, detail);
}

function showMyInfo(displayName) {
  const character = findCharacter(displayName);

  if (!character) {
    return (
      "캐릭터를 찾을 수 없습니다.\n" +
      "디스코드 별명: " + displayName + "\n" +
      "BOT_DB의 별명 열과 디스코드 서버 별명이 같은지 확인하세요."
    );
  }

  const alias = String(character["별명"]).trim();
  refreshCharacterBudget(alias);

  const fresh = findCharacter(alias) || character;

  const name = fresh["이름"] || "이름 없음";
  const race = fresh["종족"] || "종족 미상";
  const faction = getCharacterFaction(fresh);
  const level = fresh["레벨"] || readCharacterLevel(fresh);
  const exp = fresh["경험치"] || 0;

  const maxHp = fresh["최대체력"] || 0;
  const currentHp = fresh["현재체력"] || 0;

  const budget = fresh["성장예산"] || readCharacterBudget(fresh);
  const used = fresh["사용점수"] || calculateCharacterUsedPoints(fresh);
  const remain = fresh["남은점수"] || (Number(budget) - Number(used));

  const daily = fresh["일상점"] || 0;
  const erosion = fresh["이면침식"] || 0;
  const silver = Number(fresh["은화"] || 0);

  const statBlock =
    "근력 " + safeValue(fresh["근력"]) + "　" +
    "민첩 " + safeValue(fresh["민첩"]) + "　" +
    "내구 " + safeValue(fresh["내구"]) + "\n" +
    "감각 " + safeValue(fresh["감각"]) + "　" +
    "지능 " + safeValue(fresh["지능"]);

  const featureBlock = makeGroupedLines([
    ["무기술", fresh["무기술"]],
    ["격투술", fresh["격투술"]],
    ["사격술", fresh["사격술"]],
    ["기동술", fresh["기동술"]],
    ["방어술", fresh["방어술"]],
    ["인내", fresh["인내"]],
    ["관찰", fresh["관찰"]],
    ["추적술", fresh["추적술"]],
    ["은밀행동", fresh["은밀행동"]],
    ["지식", fresh["지식"]],
    ["이면학", fresh["이면학"]],
    ["화술", fresh["화술"]]
  ], 3);

  const profBlock = makeGroupedLines([
    ["참격", fresh["참격숙련"]],
    ["관통", fresh["관통숙련"]],
    ["타격", fresh["타격숙련"]],
    ["격투", fresh["격투숙련"]],
    ["사격", fresh["사격숙련"]],
    ["회피", fresh["회피숙련"]],
    ["방어", fresh["방어숙련"]],
    ["저항", fresh["저항숙련"]],
    ["조사", fresh["조사숙련"]],
    ["해석", fresh["해석숙련"]],
    ["은신", fresh["은신숙련"]],
    ["추적", fresh["추적숙련"]],
    ["설득", fresh["설득숙련"]],
    ["기만", fresh["기만숙련"]],
    ["협박", fresh["협박숙련"]]
  ], 3);

  const hpBar = makeGaugeBar(Number(currentHp), Number(maxHp), 10);
  const erosionBar = makeGaugeBar(Number(erosion), 10, 10);

  return (
    "╔═══ 〔 CHARACTER STATUS 〕 ═══╗\n" +
    name + "\n" +
    race + " / " + faction + " / Lv." + level + "\n\n" +
    "HP  " + currentHp + " / " + maxHp + "  " + hpBar + "\n" +
    "EXP " + exp + "\n" +
    "성장예산 " + budget + "\n" +
    "사용점수 " + used + "\n" +
    "남은점수 " + remain + "\n" +
    "소지 은화 " + silver + "\n" +
    "╚════════════════════════════╝\n\n" +

    "【기초 스탯】\n" +
    statBlock + "\n\n" +

    "【기능】\n" +
    featureBlock + "\n\n" +

    "【숙련】\n" +
    profBlock + "\n\n" +

    "【이면 상태】\n" +
    "일상점: " + daily + " / " + safeValue(fresh["최대일상점"]) + "\n" +
    "사용일상점: " + safeValue(fresh["사용일상점"]) + "\n" +
    "이면침식: " + erosion + " / 10 " + erosionBar
  );
}

function parseFormBlock(utterance) {
  const lines = String(utterance || "").split(/\n/).slice(1);
  const data = {};
  let currentKey = "";

  lines.forEach(rawLine => {
    const line = String(rawLine || "").trim();

    if (!line) {
      return;
    }

    // "이름:", "계통:", "효과:" 같은 양식 헤더만 새 항목으로 인식한다.
    // 핵심: 공백이 들어간 긴 줄의 "수치:0", "확률:30" 같은 옵션은 새 항목으로 보지 않는다.
    const match = line.match(/^([가-힣A-Za-z0-9_]+)\s*[:：]\s*(.*)$/);

    if (match) {
      currentKey = match[1].trim();
      data[currentKey] = match[2].trim();
      return;
    }

    // 현재 항목이 있으면 이어붙인다.
    // 예: 효과: 다음 줄의 상태부여 명령들
    if (currentKey) {
      if (data[currentKey]) {
        data[currentKey] += "\n" + line;
      } else {
        data[currentKey] = line;
      }
    }
  });

  return data;
}

function getNowText() {
  return Utilities.formatDate(new Date(), "Asia/Seoul", "yyyy-MM-dd HH:mm:ss");
}

function makeId(prefix, sheetName) {
  const rows = getSheetData(sheetName);
  const num = rows.length + 1;
  return prefix + "-" + String(num).padStart(4, "0");
}

function appendRowByHeaders(sheetName, obj) {
  const ss = _getSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error("시트를 찾을 수 없습니다: " + sheetName);
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0]
    .map(h => String(h).trim());

  const row = headers.map(h => obj[h] !== undefined ? obj[h] : "");
  sheet.appendRow(row);
  invalidateSheetCache(sheetName);
}

function makeAttackId() {
  return makeId("ATK", SHEET_COMBAT_PENDING);
}

function createPendingAttack(attackerAlias, targetAlias, attackKind, attackName, attackValue) {
  const target = findCharacterByAlias(targetAlias);

  if (!target) {
    return {
      ok: false,
      text: "대상 캐릭터를 찾을 수 없습니다: " + targetAlias
    };
  }

  const id = makeAttackId();
  const now = getNowText();

  appendRowByHeaders(SHEET_COMBAT_PENDING, {
    id: id,
    상태: "PENDING",
    공격자: attackerAlias,
    대상: targetAlias,
    공격종류: attackKind,
    공격명: attackName,
    공격값: Math.floor(Number(attackValue) || 0),
    생성일: now,
    처리일: "",
    대응종류: "",
    대응값: "",
    최종피해: "",
    메모: ""
  });

  return {
    ok: true,
    id: id,
    attacker: attackerAlias,
    target: targetAlias,
    attackKind: attackKind,
    attackName: attackName,
    attackValue: Math.floor(Number(attackValue) || 0)
  };
}

function makeCombatChoiceText(attack) {
  const id = attack.id || attack["id"] || "";
  const attacker = attack.attacker || attack["공격자"] || "";
  const target = attack.target || attack["대상"] || "";
  const attackName = attack.attackName || attack["공격명"] || "";
  const attackValue = attack.attackValue || attack["공격값"] || "";

  return (
    "[대응 대기]\n" +
    "공격번호: " + id + "\n" +
    "공격자: " + attacker + "\n" +
    "대상: " + target + "\n\n" +
    "공격: " + attackName + "\n" +
    "공격값: " + attackValue + "\n\n" +
    "대응: !대응 방어/회피/맞대응/무대응\n" +
    "지정 대응: !대응 " + id + " 방어/회피/맞대응/무대응"
  );
}

function findPendingAttackById(id) {
  const rows = getSheetData(SHEET_COMBAT_PENDING);

  return rows.find(r => {
    return (
      String(r["id"]).trim() === String(id).trim() &&
      String(r["상태"]).trim() === "PENDING"
    );
  }) || null;
}

function findLatestPendingAttackForTarget(targetAlias) {
  const rows = getSheetData(SHEET_COMBAT_PENDING);

  for (let i = rows.length - 1; i >= 0; i--) {
    const r = rows[i];

    if (
      String(r["상태"]).trim() === "PENDING" &&
      String(r["대상"]).trim() === String(targetAlias).trim()
    ) {
      return r;
    }
  }

  return null;
}

function resolvePendingAttack(id, updates) {
  updates = Object.assign({}, updates, {
    상태: "RESOLVED",
    처리일: getNowText()
  });

  return updateRowById(SHEET_COMBAT_PENDING, "id", id, updates);
}

function updateRowById(sheetName, idColumn, idValue, updates) {
  const ss = _getSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error("시트를 찾을 수 없습니다: " + sheetName);
  }

  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(h => String(h).trim());

  const idIndex = headers.indexOf(idColumn);
  if (idIndex < 0) throw new Error("id 열을 찾을 수 없습니다: " + idColumn);

  for (let r = 1; r < values.length; r++) {
    if (String(values[r][idIndex]).trim() === String(idValue).trim()) {
      Object.keys(updates).forEach(key => {
        const c = headers.indexOf(key);
        if (c >= 0) {
          sheet.getRange(r + 1, c + 1).setValue(updates[key]);
        }
      });
      invalidateSheetCache(sheetName);
      return true;
    }
  }

  return false;
}

function makeSkillId() {
  return makeId("SK", SHEET_SKILL_PENDING);
}

function findPendingSkill(id) {
  const rows = getSheetData(SHEET_SKILL_PENDING);

  return rows.find(r => {
    return String(r["id"]).trim() === String(id).trim();
  }) || null;
}

function findApprovedSkill(owner, skillName) {
  const rows = getSheetData(SHEET_SKILL_DB);

  return rows.find(r => {
    return (
      String(r["소유자"]).trim() === String(owner).trim() &&
      String(r["스킬명"]).trim() === String(skillName).trim()
    );
  }) || null;
}

function validateSkillData(data) {
  const required = ["이름", "계통", "계열", "랭크", "계산식"];

  for (const key of required) {
    if (!data[key]) {
      return "누락된 항목이 있습니다: " + key;
    }
  }

  const allowedSystems = ["마술", "주술", "신성", "마법", "혈계", "요력", "특수"];
  const allowedTypes = ["화력", "방호", "치유", "재생", "간섭", "강화", "특수"];

  if (!allowedSystems.includes(data["계통"])) {
    return "허용되지 않은 계통입니다: " + data["계통"];
  }

  if (!allowedTypes.includes(data["계열"])) {
    return "허용되지 않은 계열입니다: " + data["계열"];
  }

  try {
    rankToValue(data["랭크"]);
  } catch (e) {
    return "허용되지 않은 랭크입니다: " + data["랭크"];
  }

  return "";
}

function skillSubmit(utterance, displayName) {
  const character = findCharacter(displayName);

  if (!character) {
    return (
      "캐릭터를 찾을 수 없습니다.\n" +
      "디스코드 별명: " + displayName + "\n" +
      "BOT_DB의 별명 열을 확인하세요.\n\n" +
      "캐릭터가 아직 없다면 먼저 !캐릭터신청 을 사용하세요."
    );
  }

  const data = parseFormBlock(utterance);
  const error = validateSkillData(data);

  if (error) {
    return (
      "[스킬 신청 실패]\n" +
      error + "\n\n" +
      "양식:\n" +
      "!스킬신청\n" +
      "이름:\n" +
      "계통:\n" +
      "계열:\n" +
      "랭크:\n" +
      "계산식:\n" +
      "효과:\n" +
      "조건:\n" +
      "대가:\n" +
      "설명:"
    );
  }

  const id = makeSkillId();
  const now = getNowText();
  const effectText = data["효과"] || "";

  appendRowByHeaders(SHEET_SKILL_PENDING, {
    id: id,
    상태: "PENDING",
    신청자: character["별명"],
    스킬명: data["이름"],
    계통: data["계통"],
    계열: data["계열"],
    랭크: data["랭크"],
    계산식: data["계산식"],
    효과: effectText,
    조건: data["조건"],
    대가: data["대가"],
    설명: data["설명"],
    신청일: now,
    처리자: "",
    처리메모: ""
  });

  const effectPreview = effectText
    ? "\n효과:\n" + effectText + "\n"
    : "\n효과: 없음\n";

  return (
    "[스킬 신청 접수]\n" +
    "신청번호: " + id + "\n" +
    "신청자: " + character["별명"] + "\n" +
    "스킬명: " + data["이름"] + "\n" +
    "계통: " + data["계통"] + "\n" +
    "계열: " + data["계열"] + "\n" +
    "랭크: " + data["랭크"] + "\n" +
    "필요예산: " + getSkillCostByRank(data["랭크"]) + "\n" +
    effectPreview + "\n" +
    "상태: 승인 대기\n\n" +
    "GM 승인:\n" +
    "!스킬승인 " + id + "\n\n" +
    "GM 반려:\n" +
    "!스킬반려 " + id + " 사유"
  );
}

function skillApprove(parts, displayName) {
  if (parts.length < 2) {
    return "사용법: !스킬승인 신청번호\n예시: !스킬승인 SK-0001";
  }

  const id = parts[1];
  const pending = findPendingSkill(id);

  if (!pending) {
    return "신청번호를 찾을 수 없습니다: " + id;
  }

  if (String(pending["상태"]).trim() !== "PENDING") {
    return "이미 처리된 신청입니다: " + id + "\n현재 상태: " + pending["상태"];
  }

  const owner = String(pending["신청자"]).trim();
  const ownerRow = findCharacterRowByAlias(owner);

  if (!ownerRow) {
    return "스킬 소유자 캐릭터를 찾을 수 없습니다: " + owner;
  }

  const budgetInfo = refreshCharacterBudget(owner);
  const skillCost = getSkillCostByRank(pending["랭크"]);
  const afterUsed = budgetInfo.used + skillCost;

  // 포털(웹 빌더) 자동 승인 경로는 예산 검사를 생략한다.
  // 빌드 단계에서 이미 빌드 레벨 예산으로 검증됐고, 등록 시 경험치=0(Lv1)으로
  // 재검사하면 Lv1 예산을 넘는 정상 빌드의 스킬이 부당하게 거부되기 때문이다.
  const _isPortal = String(displayName || "").trim() === "aporia-portal";

  if (!_isPortal && afterUsed > budgetInfo.budget) {
    return (
      "[스킬 승인 실패]\n" +
      "성장예산을 초과합니다.\n\n" +
      "소유자: " + owner + "\n" +
      "스킬명: " + pending["스킬명"] + "\n" +
      "랭크: " + pending["랭크"] + "\n\n" +
      "현재 성장예산: " + budgetInfo.budget + "\n" +
      "현재 사용점수: " + budgetInfo.used + "\n" +
      "남은점수: " + budgetInfo.remain + "\n" +
      "스킬 필요점수: " + skillCost + "\n\n" +
      "부족한 성장예산: " + (afterUsed - budgetInfo.budget) + "\n\n" +
      "필요한 자원:\n" +
      "- 경험치를 올려 레벨업\n" +
      "- 낮은 랭크 스킬로 재신청\n" +
      "- 다른 성장 항목을 낮춰 사용점수 확보"
    );
  }

  const duplicate = findApprovedSkill(owner, pending["스킬명"]);

  if (duplicate) {
    return (
      "[스킬 승인 실패]\n" +
      "이미 같은 이름의 스킬이 등록되어 있습니다.\n" +
      "소유자: " + owner + "\n" +
      "스킬명: " + pending["스킬명"]
    );
  }

  const now = getNowText();
  const effectText = pending["효과"] || "";

  appendRowByHeaders(SHEET_SKILL_DB, {
    소유자: pending["신청자"],
    스킬명: pending["스킬명"],
    계통: pending["계통"],
    계열: pending["계열"],
    랭크: pending["랭크"],
    계산식: pending["계산식"],
    효과: effectText,
    조건: pending["조건"],
    대가: pending["대가"],
    설명: pending["설명"],
    승인자: displayName,
    승인일: now
  });

  updateRowById(SHEET_SKILL_PENDING, "id", id, {
    상태: "APPROVED",
    처리자: displayName,
    처리메모: "승인됨"
  });

  invalidateGameDataCache();
  const refreshed = refreshCharacterBudget(owner);

  const effectPreview = effectText
    ? "\n효과:\n" + effectText + "\n"
    : "\n효과: 없음\n";

  return (
    "[스킬 승인 완료]\n" +
    "신청번호: " + id + "\n" +
    "소유자: " + pending["신청자"] + "\n" +
    "스킬명: " + pending["스킬명"] + "\n" +
    "스킬 필요점수: " + skillCost + "\n" +
    effectPreview + "\n" +
    "현재 성장예산: " + refreshed.budget + "\n" +
    "변경 후 사용점수: " + refreshed.used + "\n" +
    "남은점수: " + refreshed.remain + "\n\n" +
    "SKILL_DB에 등록되었습니다."
  );
}

function skillReject(parts, displayName, utterance) {
  if (parts.length < 2) {
    return "사용법: !스킬반려 신청번호 사유";
  }

  const id = parts[1];
  const reason = String(utterance).split(/\s+/).slice(2).join(" ") || "사유 없음";

  const pending = findPendingSkill(id);

  if (!pending) {
    return "신청번호를 찾을 수 없습니다: " + id;
  }

  if (String(pending["상태"]).trim() !== "PENDING") {
    return "이미 처리된 신청입니다: " + id + "\n현재 상태: " + pending["상태"];
  }

  updateRowById(SHEET_SKILL_PENDING, "id", id, {
    상태: "REJECTED",
    처리자: displayName,
    처리메모: reason
  });

  return (
    "[스킬 반려]\n" +
    "신청번호: " + id + "\n" +
    "스킬명: " + pending["스킬명"] + "\n\n" +
    "사유:\n" + reason
  );
}

function skillList(displayName) {
  const character = findCharacter(displayName);

  if (!character) {
    return (
      "캐릭터를 찾을 수 없습니다.\n" +
      "디스코드 별명: " + displayName
    );
  }

  const alias = String(character["별명"]).trim();
  const rows = getSheetData(SHEET_SKILL_DB)
    .filter(r => String(r["소유자"]).trim() === alias);

  if (rows.length === 0) {
    return "[스킬 목록]\n" + alias + "에게 등록된 스킬이 없습니다.";
  }

  const lines = rows.map(r => {
    return "- " + r["스킬명"] + " / " + r["계통"] + " / " + r["계열"] + " " + r["랭크"] + " / 비용 " + getSkillCostByRank(r["랭크"]);
  });

  return (
    "[스킬 목록]\n" +
    alias + "\n\n" +
    lines.join("\n")
  );
}

function buildFormulaVariables(character, rankValue, targetAlias) {
  const vars = {};

  vars["랭크"] = rankValue;

  const metaNames = [
    "별명",
    "이름",
    "종족",
    "기능",
    "숙련"
  ];

  STAT_FIELDS.forEach(name => {
    vars[name] = statToValue(character[name]);
  });

  Object.keys(character).forEach(key => {
    key = String(key || "").trim();

    if (!key) return;
    if (STAT_FIELDS.includes(key)) return;
    if (metaNames.includes(key)) return;

    const value = getDirectNumber(character, key);

    if (value !== null) {
      vars[key] = value;
    }
  });

  const features = parseStatMap(character["기능"]);
  const profs = parseStatMap(character["숙련"]);

  Object.keys(features).forEach(k => {
    vars[k] = Number(features[k] || 0);
  });

  Object.keys(profs).forEach(k => {
    vars[k] = Number(profs[k] || 0);
  });

  const selfAlias = String(character["별명"] || "").trim();

  // 현재체력비율: 조건식에서 "현재체력비율 <= 50" 형태로 사용
  const _maxHp = Number(vars["최대체력"] || 0);
  const _curHp = Number(vars["현재체력"] || 0);
  vars["현재체력비율"] = _maxHp > 0 ? Math.floor(_curHp / _maxHp * 100) : 0;

  injectStackVariables(vars, selfAlias, "");
  injectStatusVariables(vars, selfAlias, "");

  if (targetAlias) {
    // 대상이 에너미면 상태/스택 키를 정규 별명으로 통일 (PC가 enemy_id로 지정해도 일치).
    var _tStatusKey = targetAlias;
    var _tEnemy = null;
    if (!findCharacterByAlias(targetAlias)) {
      try { _tEnemy = resolveEnemy(targetAlias); } catch (_e) { _tEnemy = null; }
      if (_tEnemy) _tStatusKey = enemyCanonicalAlias(_tEnemy);
    }

    injectStackVariables(vars, _tStatusKey, "대상");
    injectStatusVariables(vars, _tStatusKey, "대상");

    // 대상 HP 비율 ("대상현재체력비율 <= 30" 등 조건에서 사용)
    try {
      const _tChar = findCharacterByAlias(targetAlias);
      if (_tChar) {
        const _tMax = Number(getDirectNumber(_tChar, "최대체력") || 0);
        const _tCur = Number(getDirectNumber(_tChar, "현재체력") || 0);
        vars["대상최대체력"]     = _tMax;
        vars["대상현재체력"]     = _tCur;
        vars["대상현재체력비율"] = _tMax > 0 ? Math.floor(_tCur / _tMax * 100) : 0;
      } else if (_tEnemy) {
        const _eMax = Math.floor(Number(_tEnemy["max_hp"])     || 0);
        const _eCur = Math.floor(Number(_tEnemy["current_hp"]) || 0);
        vars["대상최대체력"]     = _eMax;
        vars["대상현재체력"]     = _eCur;
        vars["대상현재체력비율"] = _eMax > 0 ? Math.floor(_eCur / _eMax * 100) : 0;
      }
    } catch (_e) { /* 대상 미존재 시 무시 */ }
  }

  return vars;
}

function escapeRegExp(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function safeEvalFormula(formula, variables) {
  let expr = String(formula || "")
    .replace(/\u200B/g, "")
    .replace(/[×＊]/g, "*")
    .replace(/＋/g, "+")
    .replace(/－/g, "-")
    .replace(/[／÷]/g, "/");

  const diceExpanded = expandDiceNotationInFormula(expr);
  expr = diceExpanded.expression;

  const keys = Object.keys(variables).sort((a, b) => b.length - a.length);

  keys.forEach(key => {
    const value = Number(variables[key] || 0);
    const re = new RegExp(escapeRegExp(key), "g");
    expr = expr.replace(re, String(value));
  });

  // 존재하지 않는 상태/스택 참조는 0으로 처리
  expr = expr.replace(/대상상태_[가-힣A-Za-z0-9_]+_(수치|개수|최대|존재|확률)/g, "0");
  expr = expr.replace(/상태_[가-힣A-Za-z0-9_]+_(수치|개수|최대|존재|확률)/g, "0");
  expr = expr.replace(/대상스택_[가-힣A-Za-z0-9_]+/g, "0");
  expr = expr.replace(/스택_[가-힣A-Za-z0-9_]+/g, "0");

  expr = expr.replace(/\)\s*\(/g, ")*(");
  expr = expr.replace(/(\d)\s*\(/g, "$1*(");
  expr = expr.replace(/\)\s*(\d)/g, ")*$1");

  const leftoverWords = expr.match(/[가-힣A-Za-z_][가-힣A-Za-z0-9_]*/g);

  if (leftoverWords && leftoverWords.length > 0) {
    throw new Error(
      "계산식에 DB에서 찾을 수 없는 변수가 있습니다: " +
      Array.from(new Set(leftoverWords)).join(", ") +
      "\n\n대입식:\n" +
      expr
    );
  }

  if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
    throw new Error("계산식에 허용되지 않은 문자가 있습니다:\n" + expr);
  }

  const result = Function('"use strict"; return (' + expr + ');')();

  if (!Number.isFinite(result)) {
    throw new Error("계산 결과가 유효하지 않습니다:\n" + expr);
  }

  return {
    value: Math.floor(result),
    rawValue: result,           // 정수화 전 원본값 (배율 등 소수가 필요한 경우 사용)
    expression: expr,
    diceLogs: diceExpanded.diceLogs || []
  };
}

// ── TASK-12/13: 스킬 효과 처리 분기 헬퍼 ──────────────────────────────
// skillUse / commonSkillUseCommand 양쪽에서 동일하게 사용.
// opts = { rawEffectText, skillForEffects, alias, targetAlias, rawTargets, finalValue, type }
// rawTargets(선택): 다중 대상 배열. 미지정 시 targetAlias 단일 대상으로 동작.
// 성공: { ok:true, pendingId, healingDetailText, combatDetailText,
//                  interferenceDetailText, effectDetailText, effectSummary }
// 실패: { ok:false, errorText }
function _buildSkillEffectResult(opts) {
  const rawEffectText  = opts.rawEffectText  || "";
  const skillForEffects = opts.skillForEffects;
  const alias          = opts.alias;
  const targetAlias    = opts.targetAlias    || "";
  const finalValue     = opts.finalValue;
  const type           = opts.type           || "";
  const skillName      = String((skillForEffects && skillForEffects["스킬명"]) || "").trim();

  // 다중 대상 해소
  const _rawTargets = opts.rawTargets && opts.rawTargets.length > 0
    ? opts.rawTargets : (targetAlias ? [targetAlias] : []);
  const targets = resolveMultiTargets(_rawTargets);

  const isTargetedAttack      = ATTACK_SKILL_TYPES.includes(type) && targets.length > 0;
  const isTargetedInterference = type === "간섭" && targets.length > 0;

  let pendingId            = "";
  let healingDetailText    = "";
  let combatDetailText     = "";
  let interferenceDetailText = "";
  let effectDetailText     = "";
  let effectSummary        = summarizeSkillEffects(rawEffectText);

  // ── 치유/재생 ──
  if (type === "치유" || type === "재생") {
    const healTargets = targets.length > 0 ? targets : [targetAlias || alias];
    const healTexts = [];
    healTargets.forEach(function(ht) {
      const healResult = applyHealingToCharacter(ht || alias, finalValue);
      healTexts.push(healResult.text);
    });
    healingDetailText = "\n\n" + healTexts.join("\n\n");
    effectSummary = rawEffectText ? effectSummary : "회복 적용";
  }

  // ── 화력 대상 공격 → 공격 대기 ──
  if (isTargetedAttack) {
    const pendingIds = [];
    const combatTexts = [];
    targets.forEach(function(tgt) {
      const pending = createPendingAttackFlex(alias, tgt, KIND_SKILL, skillName, finalValue);
      if (pending.ok) {
        pendingIds.push(pending.id);
        combatTexts.push(makeCombatChoiceTextFlex(pending));
      } else {
        combatTexts.push((targets.length > 1 ? "[" + tgt + "] " : "") + (pending.text || "공격 대기 생성 실패"));
      }
    });

    pendingId = pendingIds.join(", ");
    combatDetailText = combatTexts.length > 0 ? "\n\n" + combatTexts.join("\n\n") : "";

    if (pendingIds.length > 0) {
      if (rawEffectText) {
        effectSummary    = "맞게 될 시 " + summarizeSkillEffects(rawEffectText);
        effectDetailText =
          "\n\n[스킬 효과 대기]\n" +
          "화력계 대상 지정 스킬의 효과는 즉시 발동하지 않습니다.\n" +
          "대상의 대응 결과에 따라 처리됩니다.\n\n" +
          "방어/회피 성공: 효과 무효\n" +
          "방어/회피 실패: 효과 저항 판정\n" +
          "무대응/맞대응 패배: 효과 저항 자동 실패";
      } else {
        effectSummary = "없음";
      }
    } else {
      effectSummary = "공격 대기 생성 실패";
    }

  // ── 간섭 대상 → 저항 판정 후 효과 처리 ──
  } else if (isTargetedInterference) {
    const interfTexts = [];
    const effectTexts = [];
    let allResisted = true;

    for (var _ti = 0; _ti < targets.length; _ti++) {
      var _tgt = targets[_ti];
      var _resistance;
      try {
        _resistance = rollResistanceForStatus(_tgt, finalValue, []);
      } catch (e) {
        return { ok: false, errorText: "[간섭 저항 오류]\n" + skillName + "\n\n오류: " + e.message };
      }
      var _label = targets.length > 1 ? "[" + _tgt + "]\n" : "";
      interfTexts.push(_label + _resistance.text + "\n결과: " + (_resistance.success ? "간섭 무효" : "간섭 적중"));

      if (!_resistance.success) {
        allResisted = false;
        try {
          var _processed = processSkillEffects(rawEffectText, {
            userAlias: alias, targetAlias: _tgt, finalValue: finalValue, skillName: skillName,
            skill: skillForEffects, resistanceMode: RESIST_NONE
          });
          if (_processed) effectTexts.push(_processed);
        } catch (e) {
          return {
            ok: false,
            errorText: "[간섭 효과 처리 오류]\n" + skillName + "\n\n오류: " + e.message +
                       "\n\n효과:\n```" + rawEffectText + "```"
          };
        }
      }
    }

    interferenceDetailText = "\n\n[간섭 저항]\n" + interfTexts.join("\n\n");

    if (allResisted) {
      effectSummary    = rawEffectText ? "저항 성공으로 무효" : "간섭 무효";
      effectDetailText = rawEffectText
        ? "\n\n[스킬 효과 무효]\n대상이 간섭 저항에 성공하여 효과가 발동하지 않습니다."
        : "";
    } else {
      effectDetailText = effectTexts.join("\n\n");
      effectSummary    = effectTexts.length > 0 ? "적용됨 / " + summarizeSkillEffects(rawEffectText) : "없음";
    }

  // ── 그 외 (강화/방호/특수/자가치유 등) ──
  } else {
    try {
      const processed = processSkillEffects(rawEffectText, {
        userAlias: alias, targetAlias, finalValue, skillName,
        skill: skillForEffects, resistanceMode: RESIST_NORMAL
      });
      effectDetailText = processed;
      effectSummary    = processed ? "처리됨 / " + summarizeSkillEffects(rawEffectText) : "없음";
    } catch (e) {
      return {
        ok: false,
        errorText: "[스킬 효과 처리 오류]\n" + skillName + "\n\n오류: " + e.message +
                   "\n\n효과:\n```" + rawEffectText + "```"
      };
    }
  }

  return {
    ok: true,
    pendingId, healingDetailText, combatDetailText,
    interferenceDetailText, effectDetailText, effectSummary
  };
}

function getSkillResultText(type, value) {
  if (type === "화력") {
    return "처리: 피해/공격 판정값으로 사용.";
  }

  if (type === "방호") {
    return "처리: 상대 화력 또는 간섭에 대한 방호 판정값으로 사용.";
  }

  if (type === "치유") {
    return "처리: 최종값만큼 현재체력 회복.";
  }

  if (type === "재생") {
    return "처리: 최종값만큼 현재체력 회복.";
  }

  if (type === "간섭") {
    if (value < 10) return "결과: 간섭 실패.";
    if (value < 15) return "결과: 약한 간섭. 대상 저항 판정 권장.";
    if (value < 20) return "결과: 표준 간섭. 대상 저항 판정 필요.";
    if (value < 25) return "결과: 강한 간섭. 저항 실패 시 뚜렷한 제약 발생.";
    if (value < 30) return "결과: 고강도 간섭. 저항 실패 시 전투 흐름을 바꿀 수 있음.";
    return "결과: 초월적 간섭. GM 판정하에 장면급 효과 가능.";
  }

  if (type === "강화") {
    if (value < 10) return "결과: 강화 실패.";
    if (value < 15) return "결과: 다음 관련 판정 +1.";
    if (value < 20) return "결과: 다음 관련 판정 +2.";
    if (value < 25) return "결과: 다음 관련 판정 +3.";
    if (value < 30) return "결과: 다음 관련 판정 +4.";
    return "결과: 다음 관련 판정 +5 또는 장면 지속 강화.";
  }

  if (type === "특수") {
    if (value >= 15) {
      return "결과: 성공.\n처리: 특수 계열 효과는 GM이 스킬 설명과 상황에 따라 적용합니다.";
    }

    return "결과: 실패.\n처리: 특수 계열 효과는 발동하지 않거나 불완전하게 적용됩니다.";
  }

  return "";
}

// 스킬 판정값 공통 계산 코어.
// skillRow: SKILL_DB 또는 COMMON_SKILLS 행 (계산식/계열 필드 공통).
// 반환 객체는 rollSkillValueForCharacter / rollCommonSkillValueForCharacter와 동일한 구조.
function _computeSkillRollCore(character, skillRow, rank, mods, targetAlias) {
  mods        = mods        || [];
  targetAlias = targetAlias || "";

  const alias     = String(character["별명"]).trim();
  const rankValue = rankToValue(rank);
  const erosion   = Number(character["이면침식"] || 0);

  const variables = buildFormulaVariables(character, rankValue, targetAlias);
  const calc      = safeEvalFormula(skillRow["계산식"], variables);

  let result = Math.floor(calc.value);
  const erosionMultiplier = getErosionMultiplier(erosion);

  let typeBonusText = "";
  const type = String(skillRow["계열"] || "").trim();
  const tradition = String(skillRow["계통"] || "").trim();
  if (type === "방호") { result += 3; typeBonusText = "방호 보정: +3"; }

  let finalValue = applyMods(result, mods);
  // 계열(type)·계통 둘 다 판정 유형 키로 사용 → 상태/장비 보정이 양쪽에 매칭.
  const statusMod = applyStatusModifierToValue(alias, finalValue, [KIND_SKILL, type, tradition, KIND_RESPONSE], targetAlias || "");
  finalValue = statusMod.value;
  // 장비 계열/계통 보정: 스킬의 계열(type)·계통에 맞는 계열보정/계통보정 장비를 합산.
  const equipMod = getEquipmentModifier(alias, [KIND_SKILL, type, tradition]);
  finalValue += equipMod.delta;

  // 이면침식 배율은 모든 보정 완료 후 마지막에 적용
  const beforeErosionMultiplier = finalValue;
  finalValue = Math.floor(finalValue * erosionMultiplier);

  return {
    alias, type, rank, rankValue,
    diceLogs: calc.diceLogs || [],
    expression: calc.expression,
    baseValue: Math.floor(calc.value),
    beforeErosionMultiplier, erosion, erosionMultiplier,
    typeBonusText, mods, statusMod, equipMod, finalValue
  };
}

function rollSkillValueForCharacter(character, skillName, mods, targetAlias) {
  const alias = String(character["별명"]).trim();
  const skill = findApprovedSkill(alias, skillName);

  if (!skill) {
    throw new Error("등록된 스킬을 찾을 수 없습니다.\n소유자: " + alias + "\n스킬명: " + skillName);
  }

  const erosion = Number(character["이면침식"] || 0);
  if (erosion >= MAX_EROSION) {
    throw new Error(alias + "은/는 이미 로스트 상태입니다. 스킬을 사용할 수 없습니다.");
  }

  const rank = String(skill["랭크"]).trim().toUpperCase();
  const core = _computeSkillRollCore(character, skill, rank, mods || [], targetAlias || "");
  return Object.assign({ skill: skill, skillName: skillName }, core);
}

// 대응용 공용 스킬 판정값 산출 (효과/대상자동처리 없이 finalValue만 계산)
function rollCommonSkillValueForCharacter(character, skillName, mods, targetAlias) {
  const alias       = String(character["별명"]).trim();
  const commonSkill = findCommonSkill(skillName);

  if (!commonSkill) {
    const err = new Error("등록된 공용 스킬을 찾을 수 없습니다.\n스킬명: " + skillName);
    err.code = "COMMON_NOT_FOUND";
    throw err;
  }

  const displayName = String(commonSkill["이름"] || skillName).trim();
  const status      = _commonSkillUnlockStatus(commonSkill, character);

  if (!status.conditionMatched) {
    throw new Error("공용 스킬 사용 불가: " + displayName + "\n사유: " + status.conditionReason);
  }
  if (!status.levelMatched) {
    throw new Error("공용 스킬 잠김: " + displayName + "\n필요 레벨: " + status.unlockLevel + " / 현재: " + status.charLevel);
  }

  const erosion = Number(character["이면침식"] || 0);
  if (erosion >= MAX_EROSION) {
    throw new Error(alias + "은/는 이미 로스트 상태입니다. 공용 스킬을 사용할 수 없습니다.");
  }

  const rank = String(commonSkill["랭크"]).trim().toUpperCase();
  const core = _computeSkillRollCore(character, commonSkill, rank, mods || [], targetAlias || "");
  return Object.assign({ skill: commonSkill, isCommon: true, skillName: displayName }, core);
}

function skillUse(parts, displayName) {
  if (parts.length < 2) {
    return "사용법: !스킬 스킬명 [대상:캐릭터별명] [보정]\n예시: !스킬 월광참 대상:적A +2";
  }

  const skillName = parts[1];
  const targetParsed = parseTargetAndMods(parts.slice(2));
  const mods = targetParsed.mods;
  const targetAlias = targetParsed.target;

  const character = findCharacter(displayName);

  if (!character) {
    return (
      "캐릭터를 찾을 수 없습니다.\n" +
      "디스코드 별명: " + displayName
    );
  }

  const alias = String(character["별명"]).trim();

  // 다른 스킬 캐스팅 진행 중 차단 — 해당 스킬 자신의 캐스팅(완료 포함)은 통과
  const castingBlock = _checkAnyCastingBlock(alias);
  if (castingBlock.blocked) {
    // 이 스킬 자신의 캐스팅이 완료 상태(count=0)라면 통과
    const selfCastInfo = findActiveStatusRowInfo(alias, _castingStatusName(skillName));
    const selfCastDone = selfCastInfo && _statusToNum(selfCastInfo.status["남은횟수"]) === 0;
    if (!selfCastDone) return castingBlock.text;
  }

  const skill = findApprovedSkill(alias, skillName);

  if (!skill) {
    // 개인 스킬에 없으면 공용 스킬로 폴백
    // (alias를 명시 삽입해 스킬명이 다른 캐릭터 별명과 같을 때의 오인 방지)
    if (findCommonSkill(skillName)) {
      return commonSkillUseCommand(["!공용스킬", alias, skillName].concat(parts.slice(2)), displayName);
    }

    return (
      "스킬을 찾을 수 없습니다.\n" +
      "개인 스킬 또는 해금된 공용 스킬인지 확인해주세요.\n" +
      "공용 스킬 목록은 !공용스킬목록 으로 확인할 수 있습니다.\n\n" +
      "소유자: " + alias + "\n" +
      "스킬명: " + skillName + "\n\n" +
      "등록된 개인 스킬 확인: !스킬목록"
    );
  }

  const erosion = Number(character["이면침식"] || 0);
  const erosionStage = getErosionStageText(erosion);

  if (erosion >= MAX_EROSION) {
    return (
      "[로스트]\n" +
      alias + "은/는 이미 경계를 넘어섰습니다.\n\n" +
      "이면침식: " + erosion + " / " + MAX_EROSION + "\n" +
      "상태: " + erosionStage + "\n\n" +
      "이 캐릭터는 더 이상 플레이어 캐릭터로 사용할 수 없습니다."
    );
  }

  const rank = String(skill["랭크"]).trim().toUpperCase();

  let rankValue;

  try {
    rankValue = rankToValue(rank);
  } catch (e) {
    return (
      "[스킬 오류]\n" +
      skill["스킬명"] + "\n\n" +
      "허용되지 않은 랭크입니다: " + rank
    );
  }

  // 조건 자동 판정 (필수 + 세부)
  const condCheck = checkSkillConditions(skill["조건"], {
    label: "스킬",
    name: skill["스킬명"],
    character: character,
    targetAlias: targetAlias
  });
  if (condCheck.blocked) return condCheck.text;
  const conditionHeaderText = condCheck.headerText || "";
  const condDetailBonus = condCheck.detailBonus || 0;
  const condDetailMult  = condCheck.detailMult  || 1;

  // ── 대가 게이트 (쿨타임/캐스팅/스택·상태 부족 차단) ──
  const costText = String(skill["대가"] || "").trim();
  const costGate = checkSkillCostGate(alias, String(skill["스킬명"]), costText);
  if (costGate.blocked) return costGate.text;

  const statusResult = processStatusBeforeCheck(alias, KIND_SKILL);

  if (statusResult.blocked) {
    return statusResult.text;
  }

  const variables = buildFormulaVariables(character, rankValue, targetAlias);

  let calc;

  try {
    calc = safeEvalFormula(skill["계산식"], variables);
  } catch (e) {
    return (
      "[스킬 계산 오류]\n" +
      skill["스킬명"] + "\n\n" +
      "오류: " + e.message + "\n\n" +
      "계산식:\n```" +
      skill["계산식"] +
      "```"
    );
  }

  let result = Math.floor(calc.value);
  const erosionMultiplier = getErosionMultiplier(erosion);

  let typeBonusText = "";
  const type = String(skill["계열"]).trim();
  const tradition = String(skill["계통"] || "").trim();

  if (type === "방호") {
    result += 3;
    typeBonusText = "방호 보정: +3\n";
  }

  let finalValue;
  let statusMod;
  let equipMod = { delta: 0, text: "" };

  try {
    finalValue = applyMods(result, mods);
    // 계열(type)·계통 둘 다 판정 유형 키로 사용 → 상태/장비 보정이 양쪽에 매칭.
    statusMod = applyStatusModifierToValue(alias, finalValue, [KIND_SKILL, type, tradition], targetAlias || "");
    finalValue = statusMod.value;
    // 세부 조건 보정 적용 (곱셈 → 덧셈 순)
    if (condDetailMult !== 1) finalValue = Math.floor(finalValue * condDetailMult);
    if (condDetailBonus !== 0) finalValue += condDetailBonus;
    // 장비 계열/계통 보정: 스킬 계열(type)·계통에 맞는 계열보정/계통보정 장비 합산.
    equipMod = getEquipmentModifier(alias, [KIND_SKILL, type, tradition]);
    finalValue += equipMod.delta;
    // 이면침식 배율은 모든 보정 완료 후 마지막에 적용
  } catch (e) {
    return (
      "[스킬 판정 오류]\n" +
      skill["스킬명"] + "\n\n" +
      "보정 처리 중 오류가 발생했습니다.\n\n" +
      "오류: " + e.message
    );
  }

  const beforeErosionMultiplier = finalValue;
  finalValue = Math.floor(finalValue * erosionMultiplier);

  const resultText = getSkillResultText(type, finalValue);
  const rawEffectText = String(skill["효과"] || "").trim();

  const _efx = _buildSkillEffectResult({
    rawEffectText, skillForEffects: skill,
    alias, targetAlias, rawTargets: targetParsed.rawTargets || [],
    finalValue, type
  });
  if (!_efx.ok) return _efx.errorText;

  const { pendingId, healingDetailText, combatDetailText,
          interferenceDetailText, effectDetailText, effectSummary } = _efx;

  // ── 대가 지불 (코스트 실행) ──
  var costResult = payCost(alias, String(skill["스킬명"]), costText, {
    userAlias: alias, targetAlias: targetAlias, finalValue: finalValue
  });
  var costDetailText = costResult.logs.length > 0
    ? "\n\n[대가 처리]\n" + costResult.logs.join("\n")
    : "";

  // 판정후 / 스킬사용후 트리거 패시브 (디메리트 침식 변경 등 포함)
  // "판정후"/"스킬사용후"(모든 스킬) 또는 ":스킬명"(특정 스킬) 매칭.
  var postPassiveText = "";
  try {
    var charAfter = findCharacterByAlias(alias);
    if (charAfter) {
      var _ppCtx = {
        targetAlias: targetAlias, finalValue: finalValue,
        triggerArg: String(skill["스킬명"] || ""), resistanceMode: RESIST_NONE
      };
      var _pp = [
        firePassiveTriggerEffects(charAfter, "판정후", _ppCtx),
        firePassiveTriggerEffects(charAfter, "스킬사용후", _ppCtx)
      ].filter(Boolean);
      if (_pp.length) postPassiveText = _pp.join("\n\n");
    }
  } catch (_e) { /* 패시브 시트 없거나 오류 → 무시 */ }

  const diceText = formatDiceLogs(calc.diceLogs);
  const statusModDetail = _formatJudgeModDetail(statusMod, equipMod);
  const condModLines =
    (condDetailMult !== 1 ? "세부조건 배율: ×" + condDetailMult + "\n" : "") +
    (condDetailBonus !== 0 ? "세부조건 보정: " + formatSigned(condDetailBonus) + "\n" : "");

  const displayTargetAlias = (targetParsed.rawTargets && targetParsed.rawTargets.length > 1)
    ? targetParsed.rawTargets.join(", ")
    : targetAlias;

  const summary =
    formatSkillSummaryBlock(
      skill,
      alias,
      displayTargetAlias,
      rank,
      rankValue,
      finalValue,
      effectSummary,
      pendingId
    );

  const detail =
    (conditionHeaderText ? conditionHeaderText + "\n\n" : "") +
    (statusResult.fullText ? statusResult.fullText + "\n\n" : "") +
    "[스킬 사용 상세]\n" +
    alias + " - " + skill["스킬명"] + "\n\n" +
    "계통: " + skill["계통"] + "\n" +
    "계열: " + skill["계열"] + "\n" +
    "랭크: " + rank + "(" + rankValue + ")\n" +
    "필요예산: " + getSkillCostByRank(rank) + "\n\n" +
    "조건:\n" + (skill["조건"] || "없음") + "\n\n" +
    "대가:\n" + (costText || "없음") + "\n\n" +
    "설명:\n" + skill["설명"] + "\n\n" +
    "주사위:\n" + diceText + "\n\n" +
    "계산식:\n```" + skill["계산식"] + "```\n\n" +
    "대입식:\n```" + calc.expression + "```\n" +
    "계산 결과: " + Math.floor(calc.value) + "\n" +
    typeBonusText +
    "보정: " + (mods.join(" ") || "없음") + "\n" +
    (statusModDetail ? statusModDetail + "\n" : "") +
    condModLines +
    "이면침식: " + erosion + " / " + MAX_EROSION + "\n" +
    "침식단계: " + erosionStage + "\n" +
    "침식배율: ×" + erosionMultiplier + "\n" +
    "침식 전 값: " + beforeErosionMultiplier + "\n\n" +
    "최종값: " + finalValue + "\n" +
    resultText +
    healingDetailText +
    combatDetailText +
    interferenceDetailText +
    effectDetailText +
    costDetailText +
    (postPassiveText ? "\n\n" + postPassiveText : "");

  return makeFoldedResponse(summary, detail);
}

function makeCharacterId() {
  return makeId("CH", SHEET_CHAR_PENDING);
}

function findPendingCharacter(id) {
  const rows = getSheetData(SHEET_CHAR_PENDING);

  return rows.find(r => {
    return String(r["id"]).trim() === String(id).trim();
  }) || null;
}

function validateCharacterData(data) {
  const required = [
    "이름",
    "종족",
    "근력",
    "민첩",
    "내구",
    "감각",
    "지능"
  ];

  for (const key of required) {
    if (!data[key]) {
      return "누락된 항목이 있습니다: " + key;
    }
  }

  const allowedRaces = ["인간", "마녀", "흡혈귀", "요괴"];

  if (!allowedRaces.includes(data["종족"])) {
    return "허용되지 않은 종족입니다: " + data["종족"];
  }

  const allowedStats = ["F", "E", "D", "C", "B", "A", "S"];

  for (const key of STAT_FIELDS) {
    const value = String(data[key]).trim().toUpperCase();

    if (!allowedStats.includes(value)) {
      return key + " 스탯이 올바르지 않습니다: " + data[key] + "\n허용: F, E, D, C, B, A, S";
    }
  }

  for (const key of FEATURE_FIELDS) {
    const raw = data[key];

    if (raw === undefined || raw === null || raw === "") continue;

    const value = Number(raw);

    if (!Number.isInteger(value) || value < 0 || value > MAX_FEATURE) {
      return key + " 기능 값이 올바르지 않습니다: " + raw + "\n허용: 0~" + MAX_FEATURE;
    }
  }

  for (const key of PROF_FIELDS) {
    const raw = data[key];

    if (raw === undefined || raw === null || raw === "") continue;

    const value = Number(raw);

    if (!Number.isInteger(value) || value < 0 || value > MAX_PROF) {
      return key + " 숙련 값이 올바르지 않습니다: " + raw + "\n허용: 0~" + MAX_PROF;
    }
  }

  return "";
}

function getNumberField(data, key, defaultValue) {
  if (data[key] === undefined || data[key] === null || data[key] === "") {
    return defaultValue;
  }

  const value = Number(String(data[key]).trim());

  if (isNaN(value)) {
    return defaultValue;
  }

  return value;
}

function characterSubmit(utterance, displayName) {
  const data = parseFormBlock(utterance);

  const error = validateCharacterData(data);

  if (error) {
    return (
      "[캐릭터 신청 실패]\n" +
      error + "\n\n" +
      "양식:\n" +
      getCharacterFormText()
    );
  }

  const alias = String(displayName).trim();

  if (findCharacterByAlias(alias)) {
    return (
      "[캐릭터 신청 실패]\n" +
      "이미 BOT_DB에 등록된 캐릭터가 있습니다.\n" +
      "별명: " + alias
    );
  }

  const id = makeCharacterId();
  const now = getNowText();

  const row = {
    id: id,
    상태: "PENDING",
    신청자: alias,
    별명: alias,
    이름: data["이름"],
    종족: data["종족"],
    소속: (data["소속"] && String(data["소속"]).trim()) || DEFAULT_FACTION,

    레벨: "",
    경험치: 0,
    성장예산: "",
    사용점수: "",
    남은점수: "",
    사용일상점: 0,

    근력: String(data["근력"]).trim().toUpperCase(),
    민첩: String(data["민첩"]).trim().toUpperCase(),
    내구: String(data["내구"]).trim().toUpperCase(),
    감각: String(data["감각"]).trim().toUpperCase(),
    지능: String(data["지능"]).trim().toUpperCase(),

    최대체력: "",
    현재체력: "",

    무기술: getNumberField(data, "무기술", 0),
    격투술: getNumberField(data, "격투술", 0),
    사격술: getNumberField(data, "사격술", 0),
    기동술: getNumberField(data, "기동술", 0),
    방어술: getNumberField(data, "방어술", 0),
    인내: getNumberField(data, "인내", 0),
    관찰: getNumberField(data, "관찰", 0),
    추적술: getNumberField(data, "추적술", 0),
    은밀행동: getNumberField(data, "은밀행동", 0),
    지식: getNumberField(data, "지식", 0),
    이면학: getNumberField(data, "이면학", 0),
    화술: getNumberField(data, "화술", 0),

    참격숙련: getNumberField(data, "참격숙련", 0),
    관통숙련: getNumberField(data, "관통숙련", 0),
    타격숙련: getNumberField(data, "타격숙련", 0),
    격투숙련: getNumberField(data, "격투숙련", 0),
    사격숙련: getNumberField(data, "사격숙련", 0),
    회피숙련: getNumberField(data, "회피숙련", 0),
    방어숙련: getNumberField(data, "방어숙련", 0),
    저항숙련: getNumberField(data, "저항숙련", 0),
    조사숙련: getNumberField(data, "조사숙련", 0),
    해석숙련: getNumberField(data, "해석숙련", 0),
    은신숙련: getNumberField(data, "은신숙련", 0),
    추적숙련: getNumberField(data, "추적숙련", 0),
    설득숙련: getNumberField(data, "설득숙련", 0),
    기만숙련: getNumberField(data, "기만숙련", 0),
    협박숙련: getNumberField(data, "협박숙련", 0),

    일상점: (data["일상점"] !== undefined && String(data["일상점"]).trim() !== "") ? getNumberField(data, "일상점", 0) : "",
    이면침식: getNumberField(data, "이면침식", 0),

    신청일: now,
    처리자: "",
    처리메모: ""
  };

  _ensureSheetColumn(SHEET_CHAR_PENDING, "소속", "종족");
  appendRowByHeaders(SHEET_CHAR_PENDING, row);

  return (
    "[캐릭터 신청 접수]\n" +
    "신청번호: " + id + "\n" +
    "신청자/별명: " + alias + "\n" +
    "이름: " + data["이름"] + "\n" +
    "종족: " + data["종족"] + "\n\n" +
    "상태: 승인 대기\n\n" +
    "GM 승인:\n" +
    "!캐릭터승인 " + id + "\n\n" +
    "GM 반려:\n" +
    "!캐릭터반려 " + id + " 사유"
  );
}

function characterApprove(parts, displayName) {
  if (parts.length < 2) {
    return "사용법: !캐릭터승인 신청번호\n예시: !캐릭터승인 CH-0001";
  }

  const id = parts[1];
  const pending = findPendingCharacter(id);

  if (!pending) {
    return "신청번호를 찾을 수 없습니다: " + id;
  }

  if (String(pending["상태"]).trim() !== "PENDING") {
    return "이미 처리된 신청입니다: " + id + "\n현재 상태: " + pending["상태"];
  }

  if (findCharacterByAlias(pending["별명"])) {
    return (
      "이미 BOT_DB에 같은 별명의 캐릭터가 있습니다.\n" +
      "별명: " + pending["별명"]
    );
  }

  const headers = getSheetHeaders(SHEET_BOT_DB);
  const rowObj = {};

  headers.forEach(h => {
    if (h in pending) {
      rowObj[h] = pending[h];
    }
  });

  _ensureSheetColumn(SHEET_BOT_DB, "소속", "종족");
  appendRowByHeaders(SHEET_BOT_DB, rowObj);

  updateRowById(SHEET_CHAR_PENDING, "id", id, {
    상태: "APPROVED",
    처리자: displayName,
    처리메모: "승인됨"
  });

  SpreadsheetApp.flush();

  const alias = String(pending["별명"]).trim();
  const rowInfo = findCharacterRowByAlias(alias);

  if (rowInfo) {
    SpreadsheetApp.flush();
    const fresh = findCharacterRowByAlias(alias);

    const hp = getHealthInfo(fresh.character);
    if (fresh.headers.includes("현재체력") && hp.maxHp > 0 && hp.currentHp <= 0) {
      setCellByHeader(fresh, "현재체력", hp.maxHp);
    }

    refreshCharacterBudget(alias);
  }

  return (
    "[캐릭터 승인 완료]\n" +
    "신청번호: " + id + "\n" +
    "별명: " + pending["별명"] + "\n" +
    "이름: " + pending["이름"] + "\n\n" +
    "BOT_DB에 등록되었습니다.\n" +
    "이제 !내정보 로 확인할 수 있습니다."
  );
}

function characterReject(parts, displayName, utterance) {
  if (parts.length < 2) {
    return "사용법: !캐릭터반려 신청번호 사유";
  }

  const id = parts[1];
  const reason = String(utterance).split(/\s+/).slice(2).join(" ") || "사유 없음";

  const pending = findPendingCharacter(id);

  if (!pending) {
    return "신청번호를 찾을 수 없습니다: " + id;
  }

  if (String(pending["상태"]).trim() !== "PENDING") {
    return "이미 처리된 신청입니다: " + id + "\n현재 상태: " + pending["상태"];
  }

  updateRowById(SHEET_CHAR_PENDING, "id", id, {
    상태: "REJECTED",
    처리자: displayName,
    처리메모: reason
  });

  return (
    "[캐릭터 반려]\n" +
    "신청번호: " + id + "\n" +
    "이름: " + pending["이름"] + "\n\n" +
    "사유:\n" + reason
  );
}

function getCharacterFormText() {
  return (
    "!캐릭터신청\n" +
    "이름:\n" +
    "종족:\n" +
    "소속:\n" +
    "근력:\n" +
    "민첩:\n" +
    "내구:\n" +
    "감각:\n" +
    "지능:\n" +
    "무기술:\n" +
    "격투술:\n" +
    "사격술:\n" +
    "기동술:\n" +
    "방어술:\n" +
    "인내:\n" +
    "관찰:\n" +
    "추적술:\n" +
    "은밀행동:\n" +
    "지식:\n" +
    "이면학:\n" +
    "화술:\n" +
    "참격숙련:\n" +
    "관통숙련:\n" +
    "타격숙련:\n" +
    "격투숙련:\n" +
    "사격숙련:\n" +
    "회피숙련:\n" +
    "방어숙련:\n" +
    "저항숙련:\n" +
    "조사숙련:\n" +
    "해석숙련:\n" +
    "은신숙련:\n" +
    "추적숙련:\n" +
    "설득숙련:\n" +
    "일상점:\n" +
    "이면침식:"
  );
}

function characterModify(parts, displayName) {
  if (parts.length < 4) {
    return (
      "사용법: !수정 캐릭터별명 항목 변경값\n\n" +
      "예시:\n" +
      "!수정 월하륜 경험치 +3\n" +
      "!수정 월하륜 현재체력 -10\n" +
      "!수정 월하륜 현재체력 =50\n" +
      "!수정 월하륜 이면침식 +5\n" +
      "!수정 월하륜 종족 =마녀\n\n" +
      "주의:\n" +
      "레벨, 성장예산, 사용점수, 남은점수, 최대체력은 자동 계산 항목입니다."
    );
  }

  const alias = parts[1];
  const field = parts[2];
  const changeText = parts.slice(3).join(" ");

  let found = findCharacterRowByAlias(alias);

  if (!found) {
    return "캐릭터를 찾을 수 없습니다: " + alias;
  }

  const headers = found.headers;
  const columnIndex = headers.indexOf(field);

  if (columnIndex < 0) {
    return (
      "BOT_DB에서 해당 항목을 찾을 수 없습니다: " + field + "\n\n" +
      "사용 가능한 항목:\n" +
      headers.join(", ")
    );
  }

  const protectedFields = ["별명", "레벨", "성장예산", "사용점수", "남은점수", "최대체력"];
  if (protectedFields.includes(field)) {
    return (
      "이 항목은 직접 수정할 수 없습니다: " + field + "\n\n" +
      "레벨/성장예산/최대체력은 시트 함수로 관리됩니다.\n" +
      "사용점수/남은점수는 봇이 자동 갱신합니다."
    );
  }

  const oldValue = found.character[field];
  const oldLevel = readCharacterLevel(found.character);

  const textFields = ["이름", "종족"];

  let newValue;

  try {
    if (STAT_FIELDS.includes(field)) {
      newValue = modifyStatGrade(oldValue, changeText);
    } else if (textFields.includes(field)) {
      newValue = modifyTextField(oldValue, changeText);
    } else {
      newValue = modifyNumericField(oldValue, changeText);
    }
  } catch (e) {
    return (
      "[수정 실패]\n" +
      "대상: " + alias + "\n" +
      "항목: " + field + "\n" +
      "오류: " + e.message
    );
  }

  if (field === "현재체력") {
    const hp = getHealthInfo(found.character);
    newValue = clampHp(newValue, hp.maxHp);
  }

  found.sheet.getRange(found.rowIndex, columnIndex + 1).setValue(newValue);

  SpreadsheetApp.flush();

  found = rereadCharacterRow(alias);

  let hpText = "";
  if (field === "내구" || field === "현재체력") {
    const hp = getHealthInfo(found.character);

    if (field === "내구" && found.headers.includes("현재체력") && hp.maxHp > 0 && hp.currentHp > hp.maxHp) {
      setCellByHeader(found, "현재체력", hp.maxHp);
      hpText =
        "\n\n[체력 보정]\n" +
        "현재체력이 최대체력을 초과하여 조정되었습니다.\n" +
        "현재체력: " + hp.currentHp + " → " + hp.maxHp + " / " + hp.maxHp;
    }
  }

  const budgetInfo = refreshCharacterBudget(alias);

  let levelText = "";
  if (field === "경험치") {
    const afterRow = rereadCharacterRow(alias);
    const newLevel = readCharacterLevel(afterRow.character);

    if (newLevel > oldLevel) {
      levelText =
        "\n\n[레벨업]\n" +
        afterRow.character["이름"] + "의 경계가 깊어졌습니다.\n" +
        "Lv." + oldLevel + " → Lv." + newLevel + "\n\n" +
        "일상과 비일상의 경계에서, 새로운 가능성이 열립니다.";
    } else if (newLevel < oldLevel) {
      levelText =
        "\n\n[레벨 변동]\n" +
        afterRow.character["이름"] + "의 레벨이 하락했습니다.\n" +
        "Lv." + oldLevel + " → Lv." + newLevel;
    }
  }

  return (
    "[캐릭터 수정 완료]\n" +
    "처리자: " + displayName + "\n" +
    "대상: " + alias + "\n" +
    "항목: " + field + "\n\n" +
    "기존값: " + oldValue + "\n" +
    "변경값: " + newValue + "\n\n" +
    "현재 성장예산: " + budgetInfo.budget + "\n" +
    "현재 사용점수: " + budgetInfo.used + "\n" +
    "남은점수: " + budgetInfo.remain +
    hpText +
    levelText
  );
}

function characterGrow(parts, displayName) {
  if (parts.length < 3) {
    return (
      "사용법: !성장 캐릭터별명 항목\n\n" +
      "예시:\n" +
      "!성장 월하륜 민첩\n" +
      "!성장 월하륜 무기술\n" +
      "!성장 월하륜 참격숙련"
    );
  }

  const alias = parts[1];
  const field = parts[2];

  let found = findCharacterRowByAlias(alias);

  if (!found) {
    return "캐릭터를 찾을 수 없습니다: " + alias;
  }

  if (!STAT_FIELDS.includes(field) && !FEATURE_FIELDS.includes(field) && !PROF_FIELDS.includes(field)) {
    return (
      "[성장 실패]\n" +
      "성장 가능한 항목이 아닙니다: " + field + "\n\n" +
      "성장 가능 항목:\n" +
      "- 스탯: " + STAT_FIELDS.join(", ") + "\n" +
      "- 기능: " + FEATURE_FIELDS.join(", ") + "\n" +
      "- 숙련: " + PROF_FIELDS.join(", ")
    );
  }

  const budget = readCharacterBudget(found.character);
  const currentUsed = calculateCharacterUsedPoints(found.character);

  let growth;

  try {
    growth = calculateGrowthCostDelta(found.character, field);
  } catch (e) {
    return (
      "[성장 실패]\n" +
      "대상: " + alias + "\n" +
      "항목: " + field + "\n\n" +
      "오류: " + e.message
    );
  }

  if (growth.afterUsed > budget) {
    return (
      "[성장 실패]\n" +
      "대상: " + alias + "\n" +
      "항목: " + field + "\n\n" +
      field + ": " + growth.oldValue + " → " + growth.newValue + " 성장 시도\n\n" +
      "현재 성장예산: " + budget + "\n" +
      "현재 사용점수: " + currentUsed + "\n" +
      "남은점수: " + (budget - currentUsed) + "\n" +
      "필요 추가점수: " + growth.need + "\n\n" +
      "부족한 성장예산: " + (growth.afterUsed - budget) + "\n\n" +
      "필요한 자원:\n" +
      "- 성장예산 " + (growth.afterUsed - budget) + "점 추가 필요\n" +
      "- 또는 경험치를 올려 레벨업 필요\n" +
      "- 또는 다른 항목을 낮춰 사용점수 확보 필요"
    );
  }

  const columnIndex = found.headers.indexOf(field);
  if (columnIndex < 0) {
    return "BOT_DB에서 해당 항목을 찾을 수 없습니다: " + field;
  }

  found.sheet.getRange(found.rowIndex, columnIndex + 1).setValue(growth.newValue);

  SpreadsheetApp.flush();

  if (field === "내구") {
    const hpRow = rereadCharacterRow(alias);
    const hp = getHealthInfo(hpRow.character);

    if (hpRow.headers.includes("현재체력") && hp.maxHp > 0 && hp.currentHp > hp.maxHp) {
      setCellByHeader(hpRow, "현재체력", hp.maxHp);
    }
  }

  const refreshed = refreshCharacterBudget(alias);

  return (
    "[성장 완료]\n" +
    "처리자: " + displayName + "\n" +
    "대상: " + alias + "\n" +
    "항목: " + field + "\n\n" +
    field + ": " + growth.oldValue + " → " + growth.newValue + "\n\n" +
    "현재 성장예산: " + refreshed.budget + "\n" +
    "기존 사용점수: " + growth.beforeUsed + "\n" +
    "추가 필요점수: " + growth.need + "\n" +
    "변경 후 사용점수: " + refreshed.used + "\n" +
    "남은점수: " + refreshed.remain
  );
}

// !경험치 별명1 [별명2 ...] 경험치량
// 여러 캐릭터에게 동시에 경험치를 가산(마지막 토큰이 부여량, 음수 가능).
// 레벨은 BOT_DB의 시트 함수가 경험치로 자동 계산하므로 flush 후 재읽기.
function experienceGrant(parts, displayName) {
  var tokens = (parts || []).slice(1).map(function (t) { return String(t || "").trim(); }).filter(Boolean);
  if (tokens.length < 2) {
    return (
      "사용법: !경험치 별명1 [별명2 ...] 경험치량\n\n" +
      "예시:\n" +
      "!경험치 월하륜 아테나 샤를 50\n" +
      "!경험치 월하륜 +30   (음수도 가능: -10)\n\n" +
      "마지막 값이 부여할 경험치량입니다."
    );
  }

  var amountToken = tokens[tokens.length - 1];
  if (!/^[+-]?\d+$/.test(amountToken)) {
    return "경험치량(마지막 값)은 정수여야 합니다: " + amountToken;
  }
  var amount = parseInt(amountToken, 10);
  var aliases = tokens.slice(0, tokens.length - 1);

  var results = [];
  var notFound = [];
  var oldLevels = {};

  // 1) 경험치 가산 (찾은 캐릭터만)
  aliases.forEach(function (a) {
    var found = findCharacterRowByAlias(a);
    if (!found) { notFound.push(a); return; }
    var idx = found.headers.indexOf("경험치");
    if (idx < 0) { notFound.push(a + "(경험치 열 없음)"); return; }
    var canonical = String(found.character["별명"] || a).trim();
    if (oldLevels.hasOwnProperty(canonical)) return; // 중복 별명 방지
    var oldExp = Number(found.character["경험치"] || 0);
    var newExp = Math.max(0, oldExp + amount);
    oldLevels[canonical] = readCharacterLevel(found.character);
    found.sheet.getRange(found.rowIndex, idx + 1).setValue(newExp);
    results.push({ alias: canonical, oldExp: oldExp, newExp: newExp });
  });

  if (results.length === 0) {
    return "[경험치 부여 실패]\n적용된 캐릭터가 없습니다.\n찾을 수 없음: " + (notFound.join(", ") || "-");
  }

  SpreadsheetApp.flush();

  // 2) 레벨/예산 재계산 + 보고
  var lines = [];
  lines.push("[경험치 부여]");
  lines.push("처리자: " + displayName);
  lines.push("부여량: " + (amount >= 0 ? "+" : "") + amount);
  lines.push("");
  results.forEach(function (r) {
    var after = rereadCharacterRow(r.alias);
    var newLevel = after ? readCharacterLevel(after.character) : oldLevels[r.alias];
    try { refreshCharacterBudget(r.alias); } catch (_e) {}
    var oldLv = oldLevels[r.alias];
    var lvText = "";
    if (newLevel > oldLv) lvText = "  ▲ Lv." + oldLv + "→" + newLevel + " 레벨업!";
    else if (newLevel < oldLv) lvText = "  ▼ Lv." + oldLv + "→" + newLevel;
    lines.push("• " + r.alias + ": 경험치 " + r.oldExp + " → " + r.newExp + " (Lv." + newLevel + ")" + lvText);
  });
  if (notFound.length > 0) {
    lines.push("");
    lines.push("찾을 수 없음: " + notFound.join(", "));
  }
  return lines.join("\n");
}

function modifyStatGrade(oldValue, changeText) {
  const oldGrade = String(oldValue || "").trim().toUpperCase();
  const change = String(changeText || "").trim().toUpperCase();

  if (!STAT_ORDER.includes(oldGrade)) {
    throw new Error("기존 스탯 등급이 올바르지 않습니다: " + oldValue);
  }

  if (change.startsWith("=")) {
    const target = change.slice(1).trim().toUpperCase();

    if (!STAT_ORDER.includes(target)) {
      throw new Error("설정할 스탯 등급이 올바르지 않습니다: " + target);
    }

    return target;
  }

  if (STAT_ORDER.includes(change)) {
    return change;
  }

  const delta = Number(change);

  if (isNaN(delta)) {
    throw new Error("스탯은 +1, -1, =A 같은 형식으로 수정하세요.");
  }

  const oldIndex = STAT_ORDER.indexOf(oldGrade);
  const nextIndex = Math.max(0, Math.min(STAT_ORDER.length - 1, oldIndex + delta));

  return STAT_ORDER[nextIndex];
}

function modifyNumericField(oldValue, changeText) {
  const change = String(changeText || "").trim();

  if (change.startsWith("=")) {
    const target = Number(change.slice(1).trim());

    if (isNaN(target)) {
      throw new Error("숫자 항목은 =3, +1, -1 같은 형식으로 수정하세요.");
    }

    return target;
  }

  const oldNumber = Number(oldValue || 0);

  if (isNaN(oldNumber)) {
    throw new Error("기존 값이 숫자가 아닙니다: " + oldValue);
  }

  const delta = Number(change);

  if (isNaN(delta)) {
    throw new Error("숫자 항목은 +1, -1, =3 같은 형식으로 수정하세요.");
  }

  return oldNumber + delta;
}

function modifyTextField(oldValue, changeText) {
  const change = String(changeText || "").trim();

  if (!change.startsWith("=")) {
    throw new Error("문자 항목은 =값 형식으로 수정하세요. 예: =마녀");
  }

  const target = change.slice(1).trim();

  if (!target) {
    throw new Error("설정할 값이 비어 있습니다.");
  }

  return target;
}

function round2(value) {
  return Math.round(Number(value) * 100) / 100;
}

function makeFoldedResponse(summary, detail) {
  return (
    "@@SUMMARY@@\n" +
    String(summary || "").trim() +
    "\n@@DETAIL@@\n" +
    String(detail || "").trim()
  );
}

var NAMED_DIFFICULTY_MAP = {
  "쉬움": 5,
  "보통": 15,
  "어려움": 25,
  "매우어려움": 35
};

function parseDifficultyAndMods(tokens) {
  let difficulty = DEFAULT_DIFFICULTY;
  const mods = [];

  tokens.forEach(token => {
    token = String(token || "").trim();

    if (!token) return;

    if (token in NAMED_DIFFICULTY_MAP) {
      difficulty = NAMED_DIFFICULTY_MAP[token];
      return;
    }

    if (/^\d+$/.test(token)) {
      difficulty = Number(token);
      return;
    }

    mods.push(token);
  });

  return {
    difficulty: difficulty,
    mods: mods
  };
}

function getDifficultyResultText(value, difficulty) {
  value = Number(value || 0);
  difficulty = Number(difficulty || DEFAULT_DIFFICULTY);

  const diff = value - difficulty;

  if (diff <= -GREAT_RESULT_MARGIN) {
    return {
      diff: diff,
      text: "결과: 대실패."
    };
  }

  if (diff < 0) {
    return {
      diff: diff,
      text: "결과: 실패."
    };
  }

  if (diff >= GREAT_RESULT_MARGIN) {
    return {
      diff: diff,
      text: "결과: 대성공."
    };
  }

  return {
    diff: diff,
    text: "결과: 성공."
  };
}

function formatSigned(value) {
  value = Number(value || 0);

  if (value > 0) {
    return "+" + value;
  }

  return String(value);
}

// 판정 요약에 표시할 상태보정 한 줄. 배율(×N)과 덧셈(+N)을 함께 표기.
function _statusModSummaryLine(statusMod) {
  if (!statusMod || !statusMod.text) return "";
  var parts = [];
  if (statusMod.mult && statusMod.mult !== 1) parts.push("×" + statusMod.mult);
  if (statusMod.delta) parts.push(formatSigned(statusMod.delta));
  if (parts.length === 0) return "";
  return "\n상태보정: " + parts.join(" ") + "\n";
}

// 판정 세부: 상태/패시브/장비 보정의 적용 과정을 수치와 함께 단계별로 표기.
// statusMod: applyStatusModifierToValue 반환값({before, mult, delta, after, text}).
// equipMod : getEquipmentModifier 반환값({delta, text}) — 없으면 생략.
// 반환: "[보정 적용]" 단계별 계산 + 출처별 상세 블록. 보정이 전혀 없으면 "".
function _formatJudgeModDetail(statusMod, equipMod) {
  statusMod = statusMod || {};
  var mult  = statusMod.mult  || 1;
  var delta = statusMod.delta || 0;
  var equipDelta = (equipMod && equipMod.delta) || 0;

  var hasMath = (mult !== 1) || !!delta || !!equipDelta;
  var hasText = !!statusMod.text || !!(equipMod && equipMod.text);
  if (!hasMath && !hasText) return "";

  var out = "";

  if (hasMath) {
    var v = (statusMod.before != null) ? Math.floor(Number(statusMod.before) || 0) : 0;
    var steps = ["적용 전: " + v];
    // 적용 순서: 적용 전 × 곱셈버프합 + 정수보정, 그 뒤 장비 보정.
    if (mult !== 1) {
      v = Math.round(v * mult);
      steps.push("곱셈버프 합산: ×" + mult + " → " + v);
    }
    if (delta) {
      v = v + delta;
      steps.push("상태·패시브 보정: " + formatSigned(delta) + " → " + v);
    }
    if (equipDelta) {
      v = v + equipDelta;
      steps.push("장비 보정: " + formatSigned(equipDelta) + " → " + v);
    }
    out += "[보정 적용]\n" + steps.join("\n");
  }

  var sources = [];
  if (statusMod.text) sources.push(statusMod.text);
  if (equipMod && equipMod.text) sources.push(equipMod.text);
  if (sources.length) out += (out ? "\n\n" : "") + sources.join("\n\n");

  return out;
}

function isDamageAction(actionName) {
  return DAMAGE_ACTIONS.includes(String(actionName || "").trim());
}
function safeValue(value) {
  if (value === "" || value === null || value === undefined) {
    return "0";
  }

  return String(value);
}

function makeGroupedLines(items, perLine) {
  const chunks = [];
  let current = [];

  items.forEach(pair => {
    const name = pair[0];
    const value = safeValue(pair[1]);

    current.push(name + " " + value);

    if (current.length >= perLine) {
      chunks.push(current.join(" / "));
      current = [];
    }
  });

  if (current.length > 0) {
    chunks.push(current.join(" / "));
  }

  return chunks.join("\n");
}

function makeGaugeBar(current, max, length) {
  current = Number(current || 0);
  max = Number(max || 0);
  length = Number(length || 10);

  if (max <= 0) {
    return "[----------]";
  }

  const ratio = Math.max(0, Math.min(1, current / max));
  const filled = Math.round(ratio * length);
  const empty = length - filled;

  return "[" + "■".repeat(filled) + "□".repeat(empty) + "]";

}

function makeAnchorId() {
  return makeId("AN", SHEET_ANCHOR_DB);
}

function findAnchorById(id) {
  const rows = getSheetData(SHEET_ANCHOR_DB);

  return rows.find(r => {
    return String(r["id"]).trim() === String(id).trim();
  }) || null;
}

function findAnchorRowById(id) {
  const ss = _getSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_ANCHOR_DB);

  if (!sheet) {
    throw new Error("시트를 찾을 수 없습니다: " + SHEET_ANCHOR_DB);
  }

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return null;

  const headers = values[0].map(h => String(h).trim());
  const idIndex = headers.indexOf("id");

  if (idIndex < 0) {
    throw new Error("ANCHOR_DB에 id 열이 없습니다.");
  }

  for (let r = 1; r < values.length; r++) {
    if (String(values[r][idIndex]).trim() === String(id).trim()) {
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = values[r][i];
      });

      return {
        sheet: sheet,
        rowIndex: r + 1,
        headers: headers,
        anchor: obj
      };
    }
  }

  return null;
}

function anchorRegister(utterance, displayName) {
  const firstLine = String(utterance || "").split(/\n/)[0].trim();
  const parts = firstLine.split(/\s+/);

  if (parts.length < 2) {
    return (
      "사용법:\n" +
      "!관계등록 캐릭터별명\n" +
      "관계명:\n" +
      "관계대상:\n" +
      "관계종류:\n" +
      "관계단계:\n" +
      "주는일상점개수:\n" +
      "메모:\n\n" +
      "예시:\n" +
      "!관계등록 월하륜\n" +
      "관계명: 여동생\n" +
      "관계대상: 월하은\n" +
      "관계종류: 가족\n" +
      "관계단계: 2\n" +
      "주는일상점개수: 2\n" +
      "메모: 돌아갈 집의 이유"
    );
  }

  const owner = parts[1];

  if (!findCharacterByAlias(owner)) {
    return "캐릭터를 찾을 수 없습니다: " + owner;
  }

  const data = parseFormBlock(utterance);

  const required = ["관계명", "관계대상", "관계종류", "관계단계", "주는일상점개수"];

  for (const key of required) {
    if (!data[key]) {
      return "[관계 등록 실패]\n누락된 항목이 있습니다: " + key;
    }
  }

  const level = Number(data["관계단계"]);
  const point = Number(data["주는일상점개수"]);

  if (isNaN(level) || level < 0) {
    return "[관계 등록 실패]\n관계단계는 0 이상의 숫자로 입력하세요.";
  }

  if (isNaN(point) || point < 0) {
    return "[관계 등록 실패]\n주는일상점개수는 0 이상의 숫자로 입력하세요.";
  }

  const id = makeAnchorId();
  const now = getNowText();

  appendRowByHeaders(SHEET_ANCHOR_DB, {
    id: id,
    소유자: owner,
    관계명: data["관계명"],
    관계대상: data["관계대상"],
    관계종류: data["관계종류"],
    관계단계: level,
    주는일상점개수: point,
    상태: data["상태"] || "정상",
    메모: data["메모"] || "",
    등록일: now,
    수정일: ""
  });

  SpreadsheetApp.flush();

  return (
    "[관계 등록 완료]\n" +
    "관계ID: " + id + "\n" +
    "소유자: " + owner + "\n" +
    "관계명: " + data["관계명"] + "\n" +
    "관계대상: " + data["관계대상"] + "\n" +
    "관계종류: " + data["관계종류"] + "\n" +
    "관계단계: " + level + "\n" +
    "주는일상점개수: " + point + "\n\n" +
    "최대일상점은 시트 함수에 따라 자동 반영됩니다."
  );
}

function anchorModify(parts, displayName) {
  if (parts.length < 4) {
    return (
      "사용법: !관계수정 관계ID 항목 변경값\n\n" +
      "예시:\n" +
      "!관계수정 AN-0001 관계단계 =3\n" +
      "!관계수정 AN-0001 주는일상점개수 =3\n" +
      "!관계수정 AN-0001 상태 =불안정\n" +
      "!관계수정 AN-0001 메모 =이면을 목격함"
    );
  }

  const id = parts[1];
  const field = parts[2];
  const changeText = parts.slice(3).join(" ");

  const found = findAnchorRowById(id);

  if (!found) {
    return "관계ID를 찾을 수 없습니다: " + id;
  }

  const headers = found.headers;
  const columnIndex = headers.indexOf(field);

  if (columnIndex < 0) {
    return (
      "ANCHOR_DB에서 해당 항목을 찾을 수 없습니다: " + field + "\n\n" +
      "수정 가능 항목:\n" +
      headers.filter(h => h !== "id" && h !== "등록일" && h !== "수정일").join(", ")
    );
  }

  const protectedFields = ["id", "등록일", "수정일"];

  if (protectedFields.includes(field)) {
    return "이 항목은 직접 수정할 수 없습니다: " + field;
  }

  const oldValue = found.anchor[field];

  let newValue;

  try {
    if (field === "관계단계" || field === "주는일상점개수") {
      newValue = modifyNumericField(oldValue, changeText);

      if (Number(newValue) < 0) {
        return "[관계 수정 실패]\n" + field + "는 0 미만이 될 수 없습니다.";
      }
    } else {
      newValue = modifyTextField(oldValue, changeText);
    }
  } catch (e) {
    return (
      "[관계 수정 실패]\n" +
      "관계ID: " + id + "\n" +
      "항목: " + field + "\n" +
      "오류: " + e.message
    );
  }

  found.sheet.getRange(found.rowIndex, columnIndex + 1).setValue(newValue);

  const updatedAtIndex = headers.indexOf("수정일");
  if (updatedAtIndex >= 0) {
    found.sheet.getRange(found.rowIndex, updatedAtIndex + 1).setValue(getNowText());
  }

  SpreadsheetApp.flush();

  return (
    "[관계 수정 완료]\n" +
    "관계ID: " + id + "\n" +
    "소유자: " + found.anchor["소유자"] + "\n" +
    "관계명: " + found.anchor["관계명"] + "\n" +
    "항목: " + field + "\n\n" +
    "기존값: " + oldValue + "\n" +
    "변경값: " + newValue + "\n\n" +
    "최대일상점은 시트 함수에 따라 자동 반영됩니다."
  );
}

function anchorList(parts, displayName) {
  let owner = "";

  if (parts.length >= 2) {
    owner = parts[1];
  } else {
    const character = findCharacter(displayName);

    if (!character) {
      return (
        "캐릭터를 찾을 수 없습니다.\n" +
        "사용법: !관계목록 캐릭터별명"
      );
    }

    owner = String(character["별명"]).trim();
  }

  const rows = getSheetData(SHEET_ANCHOR_DB)
    .filter(r => String(r["소유자"]).trim() === String(owner).trim());

  if (rows.length === 0) {
    return "[관계 목록]\n" + owner + "에게 등록된 관계가 없습니다.";
  }

  const totalPoint = rows.reduce((sum, r) => {
    return sum + Number(r["주는일상점개수"] || 0);
  }, 0);

  const lines = rows.map(r => {
    return (
      "- " + r["id"] +
      " / " + r["관계명"] +
      " / 대상: " + r["관계대상"] +
      " / 종류: " + r["관계종류"] +
      " / 단계: " + r["관계단계"] +
      " / 일상점 +" + r["주는일상점개수"] +
      " / 상태: " + r["상태"]
    );
  });

  return (
    "[관계 목록]\n" +
    owner + "\n\n" +
    lines.join("\n") +
    "\n\n" +
    "최대일상점 합계: " + totalPoint
  );
}

function getDailyPointInfo(alias) {
  const rowInfo = findCharacterRowByAlias(alias);

  if (!rowInfo) {
    return null;
  }

  const current = Number(rowInfo.character["일상점"] || 0);
  const max = Number(rowInfo.character["최대일상점"] || 0);
  const used = Number(rowInfo.character["사용일상점"] || 0);

  return {
    rowInfo: rowInfo,
    current: isNaN(current) ? 0 : current,
    max: isNaN(max) ? 0 : max,
    used: isNaN(used) ? 0 : used
  };
}

function dailyPointUse(parts, displayName) {
  if (parts.length < 3) {
    return (
      "사용법: !일상점사용 캐릭터별명 용도\n\n" +
      "예시:\n" +
      "!일상점사용 월하륜 리롤\n" +
      "!일상점사용 월하륜 스킬강화\n" +
      "!일상점사용 월하륜 침식회복\n\n" +
      "효과:\n" +
      "- 리롤: 방금 판정을 다시 시도할 수 있습니다.\n" +
      "- 스킬강화: 다음 스킬 사용 시 수동으로 보정을 적용하세요.\n" +
      "- 침식회복: 이면침식 -1"
    );
  }

  const alias = parts[1];
  const purpose = parts.slice(2).join(" ");

  const info = getDailyPointInfo(alias);

  if (!info) {
    return "캐릭터를 찾을 수 없습니다: " + alias;
  }

  if (!info.rowInfo.headers.includes("사용일상점")) {
    return "BOT_DB에 사용일상점 열이 없습니다.";
  }

  if (!info.rowInfo.headers.includes("일상점")) {
    return "BOT_DB에 일상점 열이 없습니다.";
  }

  SpreadsheetApp.flush();

  const freshInfo = getDailyPointInfo(alias);

  if (freshInfo.current <= 0) {
    return (
      "[일상점 사용 실패]\n" +
      "대상: " + alias + "\n\n" +
      "남은 일상점이 없습니다.\n" +
      "일상점: " + freshInfo.current + " / " + freshInfo.max + "\n" +
      "사용일상점: " + freshInfo.used
    );
  }

  const beforeUsed = freshInfo.used;
  const beforeCurrent = freshInfo.current;
  const beforeMax = freshInfo.max;

  const afterUsed = beforeUsed + 1;

  let guide = "";

  if (purpose === "침식회복") {
    if (!freshInfo.rowInfo.headers.includes("이면침식")) {
      return "BOT_DB에 이면침식 열이 없습니다.";
    }

    const beforeErosion = Number(freshInfo.rowInfo.character["이면침식"] || 0);

    if (beforeErosion >= MAX_EROSION) {
      return (
        "[일상점 사용 실패]\n" +
        "대상: " + alias + "\n" +
        "용도: 침식회복\n\n" +
        "이면침식이 이미 최대치에 도달했습니다.\n" +
        "이면침식: " + beforeErosion + " / " + MAX_EROSION + "\n\n" +
        "로스트에 도달한 캐릭터는 일상점으로 되돌릴 수 없습니다."
      );
    }

    if (beforeErosion <= 0) {
      return (
        "[일상점 사용 실패]\n" +
        "대상: " + alias + "\n" +
        "용도: 침식회복\n\n" +
        "이면침식이 이미 0입니다."
      );
    }

    const afterErosion = Math.max(0, beforeErosion - 1);

    setCellByHeader(freshInfo.rowInfo, "사용일상점", afterUsed);
    setCellByHeader(freshInfo.rowInfo, "이면침식", afterErosion);

    SpreadsheetApp.flush();

    const afterInfo = getDailyPointInfo(alias);
    const afterStage = getErosionStageText(afterErosion);
    const afterMultiplier = getErosionMultiplier(afterErosion);

    return (
      "[일상점 사용]\n" +
      "대상: " + alias + "\n" +
      "용도: 침식회복\n\n" +
      "사용일상점: " + beforeUsed + " → " + afterUsed + "\n" +
      "일상점: " + beforeCurrent + " → " + afterInfo.current + " / " + beforeMax + "\n\n" +
      "이면침식: " + beforeErosion + " → " + afterErosion + " / " + MAX_EROSION + "\n" +
      "침식단계: " + afterStage + "\n" +
      "스킬 배율: ×" + afterMultiplier + "\n\n" +
      "붙잡은 관계가 " + alias + "을/를 다시 이쪽으로 끌어당깁니다."
    );
  }

  setCellByHeader(freshInfo.rowInfo, "사용일상점", afterUsed);

  SpreadsheetApp.flush();

  const afterInfo = getDailyPointInfo(alias);

  if (purpose === "리롤") {
    guide =
      "\n\n[효과]\n" +
      "방금 판정을 다시 시도할 수 있습니다.\n" +
      "같은 명령어를 다시 입력하세요.";
  } else if (purpose === "스킬강화") {
    guide =
      "\n\n[효과]\n" +
      "다음 스킬 판정에 +3 보정을 적용할 수 있습니다.\n" +
      "예시: !스킬 스킬명 +3";
  } else {
    guide =
      "\n\n[효과]\n" +
      "용도: " + purpose + "\n" +
      "마스터와 합의한 방식으로 처리하세요.";
  }

  return (
    "[일상점 사용]\n" +
    "대상: " + alias + "\n" +
    "용도: " + purpose + "\n\n" +
    "사용일상점: " + beforeUsed + " → " + afterUsed + "\n" +
    "일상점: " + beforeCurrent + " → " + afterInfo.current + " / " + beforeMax +
    guide
  );
}

function dailyPointRecover(parts, displayName) {
  if (parts.length < 3) {
    return (
      "사용법: !일상점회복 캐릭터별명 수치\n\n" +
      "예시:\n" +
      "!일상점회복 월하륜 1\n" +
      "!일상점회복 월하륜 2"
    );
  }

  const alias = parts[1];
  const amount = Number(parts[2]);

  if (isNaN(amount) || amount <= 0) {
    return "[일상점 회복 실패]\n회복 수치는 1 이상의 숫자로 입력하세요.";
  }

  const info = getDailyPointInfo(alias);

  if (!info) {
    return "캐릭터를 찾을 수 없습니다: " + alias;
  }

  if (!info.rowInfo.headers.includes("사용일상점")) {
    return "BOT_DB에 사용일상점 열이 없습니다.";
  }

  SpreadsheetApp.flush();

  const freshInfo = getDailyPointInfo(alias);

  const beforeUsed = freshInfo.used;
  const beforeCurrent = freshInfo.current;
  const beforeMax = freshInfo.max;

  const afterUsed = Math.max(0, beforeUsed - amount);

  setCellByHeader(freshInfo.rowInfo, "사용일상점", afterUsed);

  SpreadsheetApp.flush();

  const afterInfo = getDailyPointInfo(alias);

  return (
    "[일상점 회복]\n" +
    "대상: " + alias + "\n\n" +
    "사용일상점: " + beforeUsed + " → " + afterUsed + "\n" +
    "일상점: " + beforeCurrent + " → " + afterInfo.current + " / " + beforeMax + "\n\n" +
    "소중한 인연들이 아직 당신을 붙들고 있습니다."
  );
}

// 침식 단계 임계값 변경은 이 함수 하나만 수정하면 됨.
function getErosionInfo(erosion) {
  erosion = Number(erosion || 0);
  if (erosion >= 10) return { multiplier: 0,    stage: "로스트",         flavor: "캐릭터 로스트.\n이 캐릭터는 더 이상 플레이어 캐릭터로 사용할 수 없습니다.\n\n마지막 장면을 선언하십시오.\n그가 죽었는지, 괴이가 되었는지, 계약에 삼켜졌는지,\n혹은 모두의 기억에서 사라졌는지는 이야기로 결정됩니다." };
  if (erosion >= 9)  return { multiplier: 1.5,  stage: "경계 붕괴 직전", flavor: "경고:\n경계가 무너지기 직전입니다.\n다음 침식 증가는 로스트로 이어질 수 있습니다." };
  if (erosion >= 6)  return { multiplier: 1.25, stage: "침식",           flavor: "침식 단계:\n이면의 힘이 강해졌습니다.\n그러나 현재의 자신을 붙드는 감각은 점점 희미해집니다." };
  if (erosion >= 3)  return { multiplier: 1.1,  stage: "위화감",         flavor: "위화감 단계:\n이면이 당신을 알아보기 시작했습니다." };
  return               { multiplier: 1,    stage: "정상",           flavor: "정상 단계: 아직은 돌아올 수 있습니다." };
}

function getErosionMultiplier(erosion) { return getErosionInfo(erosion).multiplier; }
function getErosionStageText(erosion)  { return getErosionInfo(erosion).stage; }

function getErosionFlavorText(erosion) { return getErosionInfo(erosion).flavor; }

function erosionModify(parts, displayName) {
  if (parts.length < 3) {
    return (
      "사용법: !침식 캐릭터별명 변경값\n\n" +
      "예시:\n" +
      "!침식 월하륜 +1\n" +
      "!침식 월하륜 -1\n" +
      "!침식 월하륜 =5"
    );
  }

  const alias = parts[1];
  const changeText = parts.slice(2).join(" ");

  const rowInfo = findCharacterRowByAlias(alias);

  if (!rowInfo) {
    return "캐릭터를 찾을 수 없습니다: " + alias;
  }

  if (!rowInfo.headers.includes("이면침식")) {
    return "BOT_DB에 이면침식 열이 없습니다.";
  }

  const oldValueRaw = rowInfo.character["이면침식"];
  const oldValue = Number(oldValueRaw || 0);

  let newValue;

  try {
    newValue = modifyNumericField(oldValue, changeText);
  } catch (e) {
    return (
      "[이면침식 수정 실패]\n" +
      "대상: " + alias + "\n" +
      "오류: " + e.message
    );
  }

  newValue = Math.floor(Number(newValue || 0));
  if (newValue < 0) newValue = 0;

  setCellByHeader(rowInfo, "이면침식", newValue);

  SpreadsheetApp.flush();

  const stage = getErosionStageText(newValue);
  const multiplier = getErosionMultiplier(newValue);
  const flavor = getErosionFlavorText(newValue);

  const header = newValue >= MAX_EROSION ? "[로스트]" : "[이면침식 변동]";

  return (
    header + "\n" +
    "처리자: " + displayName + "\n" +
    "대상: " + alias + "\n\n" +
    "이면침식: " + oldValue + " → " + newValue + " / " + MAX_EROSION + "\n" +
    "단계: " + stage + "\n" +
    "스킬 배율: ×" + multiplier + "\n\n" +
    flavor
  );
}

function rollPowerValueForResponse(type, rank, mods) {
  rank = String(rank || "").trim().toUpperCase();
  mods = mods || [];

  const rankValue = rankToValue(rank);
  const dice = rollDie(20);

  let base = dice + rankValue;

  if (type === "방호") {
    base += 3;
  }

  const finalValue = applyMods(base, mods);

  return {
    type: type,
    rank: rank,
    rankValue: rankValue,
    dice: dice,
    base: base,
    finalValue: finalValue
  };
}

// 대응에 쓰인 스킬(개인/공용)의 효과를 적용한다.
// response: _rollResponseSkillByMode가 돌려준 객체. {kind:"스킬", source, isCommon, name, skill, value}
// userAlias: 효과 사용자(자신)
// targetAlias: 효과 대상(방어/회피/저항/맞대응 모두 공격자)
// resistanceMode: RESIST_NONE | RESIST_NORMAL | RESIST_FORCE_FAIL
function _applyResponseSkillEffects(response, userAlias, targetAlias, resistanceMode) {
  if (!response || response.kind !== "스킬" || !response.skill) return "";

  const skillRow = response.skill;
  const effectText = String(skillRow["효과"] || "").trim();
  if (!effectText) return "";

  const skillName = response.name || skillRow["스킬명"] || skillRow["이름"] || "";

  // 공용 스킬 행은 "이름" 키를 쓰므로 처리 함수가 기대하는 "스킬명" 형태로 호환 객체를 만든다.
  const skillForEffects = response.isCommon
    ? {
        "스킬명": skillName,
        "계통": skillRow["계통"] || "",
        "계열": skillRow["계열"] || "",
        "랭크": skillRow["랭크"] || "",
        "계산식": skillRow["계산식"] || "",
        "효과": effectText,
        "조건": skillRow["조건"] || "",
        "대가": "",
        "설명": skillRow["설명"] || ""
      }
    : skillRow;

  try {
    const out = processSkillEffects(effectText, {
      userAlias: userAlias,
      targetAlias: targetAlias,
      finalValue: response.value,
      skillName: skillName,
      skill: skillForEffects,
      resistanceMode: resistanceMode || RESIST_NONE
    });
    return out || "";
  } catch (e) {
    return (
      "\n\n[대응 스킬 효과 처리 오류]\n" +
      skillName + "\n" +
      "오류: " + e.message
    );
  }
}

// 보정/모디파이어 토큰 판별 (+2, -3, 5 같은 형태)
function _isResponseModifierToken(t) {
  if (t === null || t === undefined) return false;
  const s = String(t).trim();
  if (!s) return false;
  return /^[+\-]?\d+(\.\d+)?$/.test(s);
}

// 대응에 사용할 스킬을 모드에 맞춰 굴림 (effect/pendingAttack 부수효과 없음)
function _rollResponseSkillByMode(character, mode, skillName, mods, targetAlias) {
  const alias = String(character["별명"]).trim();
  let rolled;
  let source;

  if (mode === "common") {
    rolled = rollCommonSkillValueForCharacter(character, skillName, mods, targetAlias);
    source = "공용";
  } else if (mode === "personal") {
    const skill = findApprovedSkill(alias, skillName);
    if (!skill) {
      throw new Error(
        "등록된 개인 스킬을 찾을 수 없습니다.\n" +
        "소유자: " + alias + "\n" +
        "스킬명: " + skillName
      );
    }
    rolled = rollSkillValueForCharacter(character, skillName, mods, targetAlias);
    source = "개인";
  } else {
    // auto: 개인 스킬 우선, 없으면 공용 스킬
    const personal = findApprovedSkill(alias, skillName);
    if (personal) {
      rolled = rollSkillValueForCharacter(character, skillName, mods, targetAlias);
      source = "개인";
    } else if (findCommonSkill(skillName)) {
      rolled = rollCommonSkillValueForCharacter(character, skillName, mods, targetAlias);
      source = "공용";
    } else {
      throw new Error(
        "스킬을 찾을 수 없습니다.\n" +
        "개인/공용 스킬 모두 검색했습니다.\n" +
        "스킬명: " + skillName + "\n\n" +
        "공용 스킬만 검색하려면: 공용스킬 " + skillName
      );
    }
  }

  const sourceLabel = source === "공용" ? "공용 스킬" : "개인 스킬";
  const diceText = formatDiceLogs(rolled.diceLogs);

  const summaryText =
    sourceLabel + ": " + rolled.skillName + "\n" +
    "계열: " + rolled.type + "\n" +
    "최종값: " + rolled.finalValue;

  const detailText =
    sourceLabel + ": " + rolled.skillName + "\n" +
    "계열: " + rolled.type + "\n" +
    "랭크: " + rolled.rank + "(" + rolled.rankValue + ")\n" +
    "주사위:\n" + diceText + "\n\n" +
    "대입식:\n```" + rolled.expression + "```\n" +
    "계산 결과: " + rolled.baseValue + "\n" +
    "이면침식: " + rolled.erosion + " / " + MAX_EROSION + "\n" +
    "침식배율: ×" + rolled.erosionMultiplier + "\n" +
    "배율 적용 결과: " + rolled.beforeErosionMultiplier + " → " +
      Math.floor(rolled.beforeErosionMultiplier * rolled.erosionMultiplier) + "\n" +
    (rolled.typeBonusText ? rolled.typeBonusText + "\n" : "") +
    "보정: " + ((rolled.mods && rolled.mods.length > 0) ? rolled.mods.join(" ") : "없음") + "\n" +
    "최종값: " + rolled.finalValue;

  return {
    kind: "스킬",
    source: source,            // "개인" | "공용"
    isCommon: !!rolled.isCommon,
    name: rolled.skillName,
    skill: rolled.skill,
    value: rolled.finalValue,
    summaryText: summaryText,
    detailText: detailText,
    text: detailText
  };
}

function rollResponseValue(character, defaultActionName, tokens, targetAlias) {
  tokens = tokens || [];
  targetAlias = targetAlias || "";

  // ── 스킬 모드 파싱 ───────────────────────────────────────
  // 1) "공용스킬 <이름>"  → common only
  // 2) "스킬 <이름>"      → auto (개인 우선, 공용 폴백)
  // 3) defaultActionName 이 방어/회피/저항 이고 tokens[0] 가 비모디파이어면 → auto
  let skillMode = null;
  let skillName = "";
  let skillMods = [];

  if (tokens.length >= 1 && tokens[0] === "공용스킬") {
    if (tokens.length < 2) {
      throw new Error("공용스킬 키워드 뒤에 스킬명이 필요합니다.\n예: 공용스킬 방호각인");
    }
    skillMode = "common";
    skillName = tokens[1];
    skillMods = tokens.slice(2);
  } else if (tokens.length >= 1 && tokens[0] === "스킬") {
    if (tokens.length < 2) {
      throw new Error("스킬 키워드 뒤에 스킬명이 필요합니다.\n예: 스킬 월광방벽");
    }
    skillMode = "auto";
    skillName = tokens[1];
    skillMods = tokens.slice(2);
  } else if (
    (defaultActionName === "방어" || defaultActionName === "회피" || defaultActionName === "저항") &&
    tokens.length >= 1 &&
    tokens[0] &&
    !_isResponseModifierToken(tokens[0]) &&
    // 이능(화력/방호/치유/재생/간섭/강화) 키워드는 기존 이능 분기로 흘려보낸다
    !(tokens.length >= 2 && ["화력", "방호", "치유", "재생", "간섭", "강화"].includes(tokens[0]))
  ) {
    skillMode = "auto";
    skillName = tokens[0];
    skillMods = tokens.slice(1);
  } else if (
    // 맞대응(defaultActionName="")에서도 베어네임으로 스킬 사용 허용.
    // 단, 액션명("참격" 등)으로 쓰는 기존 동작을 보존하기 위해
    // 실제로 스킬이 존재할 때만 스킬 모드로 라우팅한다.
    !defaultActionName &&
    tokens.length >= 1 &&
    tokens[0] &&
    !_isResponseModifierToken(tokens[0]) &&
    !(tokens.length >= 2 && ["화력", "방호", "치유", "재생", "간섭", "강화"].includes(tokens[0]))
  ) {
    const _alias = String(character["별명"]).trim();
    const _hasPersonal = findApprovedSkill(_alias, tokens[0]);
    const _hasCommon = _hasPersonal ? null : findCommonSkill(tokens[0]);
    if (_hasPersonal || _hasCommon) {
      skillMode = "auto";
      skillName = tokens[0];
      skillMods = tokens.slice(1);
    }
  }

  if (skillMode) {
    return _rollResponseSkillByMode(character, skillMode, skillName, skillMods, targetAlias);
  }

  if (tokens.length >= 2 && ["화력", "방호", "치유", "재생", "간섭", "강화"].includes(tokens[0])) {
    const type = tokens[0];
    const rank = tokens[1];
    const mods = tokens.slice(2);

    const rolled = rollPowerValueForResponse(type, rank, mods);

    const summaryText =
      "이능: " + type + " " + rank + "\n" +
      "최종값: " + rolled.finalValue;

    const detailText =
      "이능: " + type + " " + rank + "\n" +
      "d20: " + rolled.dice + "\n" +
      "랭크값: " + rolled.rankValue + "\n" +
      "기본값: " + rolled.base + "\n" +
      "보정: " + (mods.join(" ") || "없음") + "\n" +
      "최종값: " + rolled.finalValue;

    return {
      kind: "이능",
      name: type + " " + rank,
      value: rolled.finalValue,
      summaryText: summaryText,
      detailText: detailText,
      text: detailText
    };
  }

  const actionName = defaultActionName || tokens[0];

  if (!actionName) {
    throw new Error("대응에 사용할 액션이 지정되지 않았습니다.");
  }

  const mods = defaultActionName ? tokens : tokens.slice(1);
  const rolled = rollActionValueForCharacter(character, actionName, mods);

  const summaryText =
    "액션: " + actionName + "\n" +
    "합계: " + rolled.sum;

  const detailText =
    "액션: " + actionName + "\n" +
    "최종 계수: " + rolled.finalCoef + "\n" +
    "주사위: " + rolled.diceCount + "d" + ACTION_DICE_SIDES + "\n" +
    "결과: " + rolled.rolls.join(", ") + "\n" +
    "합계: " + rolled.sum;

  return {
    kind: "액션",
    name: actionName,
    value: rolled.sum,
    summaryText: summaryText,
    detailText: detailText,
    text: detailText
  };
}

// 공격자 쪽 공격해결후(+가해후) 트리거 발동 후 로그 텍스트 반환(래퍼 없음).
// 피해 0(회피/방어 성공)이어도 공격해결후는 발동해야 하므로, applyDamage를 타지
// 않는 경로(방어/회피 성공 등)에서 직접 호출한다. 공격자가 PC가 아니면 "".
function _fireAttackerResolvedText(attackerAlias, argName, damage, targetAlias) {
  attackerAlias = String(attackerAlias || "").trim();
  if (!attackerAlias || _DEALT_TRIGGER_ACTIVE) return "";
  var dealer = _resolveCharLike(attackerAlias);  // 공격자가 PC 또는 에너미
  if (!dealer) return "";
  _DEALT_TRIGGER_ACTIVE = true;
  try {
    var dmg = Math.max(0, Number(damage) || 0);
    var argN = String(argName || "").trim();
    var parts = [];
    var resolved = firePassiveTriggerEffects(dealer, "공격해결후", {
      targetAlias: targetAlias || "", finalValue: dmg, triggerArg: argN, resistanceMode: RESIST_NONE
    });
    if (resolved) parts.push(resolved);
    if (dmg > 0) {
      var dealt = firePassiveTriggerEffects(dealer, "가해후", {
        targetAlias: targetAlias || "", finalValue: dmg, triggerArg: argN, resistanceMode: RESIST_NONE
      });
      if (dealt) parts.push(dealt);
    }
    return parts.join("\n\n");
  } finally { _DEALT_TRIGGER_ACTIVE = false; }
}

// ── TASK-08: 무대응 / 상태이상 차단 ────────────────────────────────────
function _resolveCombatNoResponse(attack, attackValue, attackerAlias, targetAlias) {
  // 효과 먼저 실행(피해 보정 누적) → 기본 피해 + 보정을 한 번에 적용
  const foldState = { amount: 0 };
  const attackEffectText = processPendingAttackSkillEffects(attack, RESIST_FORCE_FAIL, attackValue, foldState);
  const damage = Math.max(0, attackValue + foldState.amount);
  const damageResult = applyDamageToCharacter(targetAlias, damage, { attackerAlias: attackerAlias, sourceName: String(attack["공격명"] || "") });
  const foldNote = foldState.amount !== 0 ? "\n피해 보정: " + formatSigned(foldState.amount) : "";

  resolvePendingAttack(attack["id"], {
    대응종류: "무대응", 대응값: 0, 최종피해: damage,
    메모: "무대응으로 피해 전부 적용. 스킬 효과 저항 자동 실패"
  });

  const summary =
    "[무대응]\n" +
    "공격번호: " + attack["id"] + "\n" +
    "공격값: " + attackValue + foldNote + "\n" +
    "최종피해: " + damage + "\n" +
    compactDamageText(damageResult) +
    (attackEffectText ? "\n효과: 저항 자동 실패 / 강제 적용" : "");

  const detail =
    "[무대응 상세]\n" +
    "공격번호: " + attack["id"] + "\n" +
    "공격자: " + attackerAlias + "\n" +
    "대상: " + targetAlias + "\n" +
    "공격값: " + attackValue + foldNote + "\n" +
    "최종피해: " + damage + "\n\n" +
    damageResult.text + attackEffectText;

  return makeFoldedResponse(summary, detail);
}

function _resolveCombatStatusBlocked(attack, attackValue, attackerAlias, targetAlias, statusResult) {
  const foldState = { amount: 0 };
  const attackEffectText = processPendingAttackSkillEffects(attack, RESIST_FORCE_FAIL, attackValue, foldState);
  const damage = Math.max(0, attackValue + foldState.amount);
  const damageResult = applyDamageToCharacter(targetAlias, damage, { attackerAlias: attackerAlias, sourceName: String(attack["공격명"] || "") });
  const foldNote = foldState.amount !== 0 ? "\n피해 보정: " + formatSigned(foldState.amount) : "";

  resolvePendingAttack(attack["id"], {
    대응종류: "상태이상으로 대응불가", 대응값: 0, 최종피해: damage,
    메모: "상태이상으로 대응 행동 저지. 무대응 처리. 스킬 효과 저항 자동 실패"
  });

  const summary =
    "[대응 불가]\n" +
    "상태이상으로 대응하지 못했습니다.\n" +
    "공격번호: " + attack["id"] + "\n" +
    "공격값: " + attackValue + foldNote + "\n" +
    "최종피해: " + damage + "\n" +
    compactDamageText(damageResult) +
    (attackEffectText ? "\n효과: 저항 자동 실패 / 강제 적용" : "");

  const detail =
    (statusResult.fullText || statusResult.text) + "\n\n" +
    "[대응 불가 상세]\n" +
    "공격번호: " + attack["id"] + "\n" +
    "공격자: " + attackerAlias + "\n" +
    "대상: " + targetAlias + "\n" +
    "공격값: " + attackValue + "\n" +
    "최종피해: " + damage + "\n\n" +
    damageResult.text + attackEffectText;

  return makeFoldedResponse(summary, detail);
}

// ── TASK-09: 방어 / 회피 ────────────────────────────────────────────────
function _resolveCombatDefend(attack, character, rest, selfAlias, attackValue, attackerAlias, targetAlias, statusDetailPrefix, statusSummaryLine) {
  let response;
  try {
    response = rollResponseValue(character, "방어", rest, attackerAlias);
  } catch (e) {
    return "[방어 대응 오류]\n" + e.message;
  }

  const defenseValue    = response.value;
  const baseDamage      = Math.max(0, attackValue - defenseValue);
  const defenseSuccess  = baseDamage <= 0;

  let damage, damageResult, attackEffectText, foldNote = "";
  if (defenseSuccess) {
    damage = 0;
    // 피해 0이어도 공격자 공격해결후 발동(스택 감소 등). applyDamage는 안 탐.
    // dealtText로 넘기면 compactDamageText가 요약에 노출.
    damageResult = { text: "피해 없음.",
                     dealtText: _fireAttackerResolvedText(attackerAlias, String(attack["공격명"] || ""), 0, targetAlias),
                     attackerAlias: attackerAlias };
    attackEffectText = getSkillFromPendingAttack(attack)
      ? "\n\n[스킬 효과 무효]\n방어에 성공하여 공격 스킬의 효과가 발동하지 않습니다." : "";
  } else {
    // 효과 먼저 실행(피해 보정 누적) → 방어후 기본 피해 + 보정을 한 번에 적용
    const foldState = { amount: 0 };
    attackEffectText = processPendingAttackSkillEffects(attack, RESIST_NORMAL, attackValue, foldState);
    damage = Math.max(0, baseDamage + foldState.amount);
    damageResult = applyDamageToCharacter(targetAlias, damage, { attackerAlias: attackerAlias, sourceName: String(attack["공격명"] || "") });
    if (foldState.amount !== 0) foldNote = "\n피해 보정: " + formatSigned(foldState.amount);
  }

  const defenseSkillEffectText = _applyResponseSkillEffects(response, selfAlias, attackerAlias, RESIST_NONE);
  const defenseSkillBlock = defenseSkillEffectText
    ? "\n\n[방어 스킬 효과]\n" + response.name + "\n" + defenseSkillEffectText
    : "";

  resolvePendingAttack(attack["id"], {
    대응종류: "방어", 대응값: defenseValue, 최종피해: damage,
    메모: (defenseSuccess ? "방어 성공. 공격 스킬 효과 무효" : "방어 실패. 공격 스킬 효과 저항 판정")
          + (defenseSkillEffectText ? ". 방어 스킬 효과 적용" : "")
  });

  const methodLine = response.kind === "스킬"
    ? "방어 방식: " + (response.source === "공용" ? "공용 스킬" : "개인 스킬") + " - " + response.name + "\n"
    : "방어 방식: 액션 방어\n";

  const summary =
    "[방어 대응]\n" + statusSummaryLine +
    "공격번호: " + attack["id"] + "\n" + methodLine + "\n" +
    "공격값: " + attackValue + "\n" +
    "방어값: " + defenseValue + foldNote + "\n\n" +
    "결과: " + (defenseSuccess ? "방어 성공" : "방어 실패") + "\n" +
    "최종피해: " + damage + "\n" +
    compactDamageText(damageResult) +
    (attackEffectText ? "\n효과: " + (defenseSuccess ? "무효" : "저항 판정 / 상세보기") : "") +
    (defenseSkillEffectText ? "\n방어 스킬 효과: 적용 / 상세보기" : "");

  const defenseDealtBlock = (defenseSuccess && damageResult.dealtText)
    ? "\n\n[공격 후 패시브: " + attackerAlias + "]\n" + damageResult.dealtText
    : "";

  const detail =
    statusDetailPrefix +
    "[방어 대응 상세]\n" +
    "공격번호: " + attack["id"] + "\n" +
    "공격자: " + attackerAlias + "\n" +
    "대상: " + targetAlias + "\n" +
    "공격값: " + attackValue + foldNote + "\n\n" +
    response.detailText + "\n\n" +
    "결과: " + (defenseSuccess ? "방어 성공" : "방어 실패") + "\n" +
    "최종피해: " + damage + "\n\n" +
    damageResult.text + defenseDealtBlock + attackEffectText + defenseSkillBlock;

  return makeFoldedResponse(summary, detail);
}

function _resolveCombatEvade(attack, character, rest, selfAlias, attackValue, attackerAlias, targetAlias, statusDetailPrefix, statusSummaryLine) {
  let response;
  try {
    response = rollResponseValue(character, "회피", rest, attackerAlias);
  } catch (e) {
    return "[회피 대응 오류]\n" + e.message;
  }

  const evadeValue  = response.value;
  const success     = evadeValue >= attackValue;

  let damage, damageResult, attackEffectText, foldNote = "";
  if (success) {
    damage = 0;
    damageResult = { text: "피해 없음.",
                     dealtText: _fireAttackerResolvedText(attackerAlias, String(attack["공격명"] || ""), 0, targetAlias),
                     attackerAlias: attackerAlias };
    attackEffectText = getSkillFromPendingAttack(attack)
      ? "\n\n[스킬 효과 무효]\n회피에 성공하여 공격 스킬의 효과가 발동하지 않습니다." : "";
  } else {
    const foldState = { amount: 0 };
    attackEffectText = processPendingAttackSkillEffects(attack, RESIST_NORMAL, attackValue, foldState);
    damage = Math.max(0, attackValue + foldState.amount);
    damageResult = applyDamageToCharacter(targetAlias, damage, { attackerAlias: attackerAlias, sourceName: String(attack["공격명"] || "") });
    if (foldState.amount !== 0) foldNote = "\n피해 보정: " + formatSigned(foldState.amount);
  }

  const evadeSkillEffectText = _applyResponseSkillEffects(response, selfAlias, attackerAlias, RESIST_NONE);
  const evadeSkillBlock = evadeSkillEffectText
    ? "\n\n[회피 스킬 효과]\n" + response.name + "\n" + evadeSkillEffectText
    : "";

  resolvePendingAttack(attack["id"], {
    대응종류: "회피", 대응값: evadeValue, 최종피해: damage,
    메모: (success ? "회피 성공. 공격 스킬 효과 무효" : "회피 실패. 공격 스킬 효과 저항 판정")
          + (evadeSkillEffectText ? ". 회피 스킬 효과 적용" : "")
  });

  const methodLine = response.kind === "스킬"
    ? "회피 방식: " + (response.source === "공용" ? "공용 스킬" : "개인 스킬") + " - " + response.name + "\n"
    : "회피 방식: 액션 회피\n";

  const summary =
    "[회피 대응]\n" + statusSummaryLine +
    "공격번호: " + attack["id"] + "\n" + methodLine + "\n" +
    "공격값: " + attackValue + "\n" +
    "회피값: " + evadeValue + foldNote + "\n\n" +
    "결과: " + (success ? "회피 성공" : "회피 실패") + "\n" +
    "최종피해: " + damage + "\n" +
    compactDamageText(damageResult) +
    (attackEffectText ? "\n효과: " + (success ? "무효" : "저항 판정 / 상세보기") : "") +
    (evadeSkillEffectText ? "\n회피 스킬 효과: 적용 / 상세보기" : "") +
    (success ? "\n추가: 다음 판정에 이득 가능" : "");

  const evadeDealtBlock = (success && damageResult.dealtText)
    ? "\n\n[공격 후 패시브: " + attackerAlias + "]\n" + damageResult.dealtText
    : "";

  const detail =
    statusDetailPrefix +
    "[회피 대응 상세]\n" +
    "공격번호: " + attack["id"] + "\n" +
    "공격자: " + attackerAlias + "\n" +
    "대상: " + targetAlias + "\n" +
    "공격값: " + attackValue + foldNote + "\n\n" +
    response.detailText + "\n\n" +
    "결과: " + (success ? "회피 성공" : "회피 실패") + "\n" +
    "최종피해: " + damage + "\n\n" +
    damageResult.text + evadeDealtBlock + attackEffectText + evadeSkillBlock +
    (success ? "\n\n다음 판정에 추가 이득을 얻을 수 있습니다." : "");

  return makeFoldedResponse(summary, detail);
}

// ── TASK-10: 맞대응 / 저항 ──────────────────────────────────────────────
function _resolveCombatCounter(attack, character, rest, selfAlias, attackValue, attackerAlias, targetAlias, statusDetailPrefix, statusSummaryLine) {
  if (rest.length < 1) {
    return (
      "맞대응에 사용할 액션/이능/스킬을 입력하세요.\n" +
      "예시:\n" +
      "!대응 맞대응 참격\n" +
      "!대응 맞대응 화력 A\n" +
      "!대응 맞대응 월광참            (개인→공용 순으로 검색)\n" +
      "!대응 맞대응 스킬 월광참       (개인→공용)\n" +
      "!대응 맞대응 공용스킬 마탄     (공용만)"
    );
  }

  let response;
  try {
    response = rollResponseValue(character, "", rest, attackerAlias);
  } catch (e) {
    return "[맞대응 오류]\n" + e.message;
  }

  const counterValue = response.value;

  // 성공 기준: 공격값의 1.5배 이상 (정수 비교: counterValue * 2 >= attackValue * 3)
  // 부동소수점 없이 정확히 처리.
  const counterSuccess = counterValue * 2 >= attackValue * 3;

  // ── 맞대응 성공 ──
  if (counterSuccess) {
    const threshold = Math.ceil(attackValue * 1.5);
    const damage      = counterValue;
    const damageResult = applyDamageToRef(attackerAlias, damage, { attackerAlias: selfAlias });
    // 공격자의 공격은 맞대응당해 피해 0 → 공격자 쪽 공격해결후 발동(실패 처리).
    const _atkResolved = _fireAttackerResolvedText(attackerAlias, String(attack["공격명"] || ""), 0, targetAlias);
    const _atkResolvedBlock = _atkResolved ? "\n\n[공격 후 패시브: " + attackerAlias + "]\n" + _atkResolved : "";

    let counterEffectText = "";
    if (response.kind === "스킬" && response.skill) {
      counterEffectText = _applyResponseSkillEffects(response, selfAlias, attackerAlias, RESIST_FORCE_FAIL);
    }

    const attackEffectInvalidText = getSkillFromPendingAttack(attack)
      ? "\n\n[공격 스킬 효과 무효]\n맞대응에 패배하여 공격자의 스킬 효과는 발동하지 않습니다."
      : "";

    resolvePendingAttack(attack["id"], {
      대응종류: "맞대응", 대응값: counterValue, 최종피해: damage,
      메모: "맞대응 성공 (기준 " + threshold + " 이상). 공격자의 공격 무효화. 공격 스킬 효과 무효. 맞대응 스킬 효과 강제 적용"
    });

    const summary =
      "[맞대응]\n" + statusSummaryLine +
      "공격번호: " + attack["id"] + "\n" +
      "공격값: " + attackValue + " (성공 기준: " + threshold + ")\n" +
      "맞대응값: " + counterValue + "\n\n" +
      "결과: 맞대응 성공\n" + "반격피해: " + damage + "\n" +
      compactDamageText(damageResult) +
      (attackEffectInvalidText ? "\n공격 효과: 무효" : "") +
      (counterEffectText ? "\n맞대응 효과: 강제 적용 / 상세보기" : "");

    const detail =
      statusDetailPrefix +
      "[맞대응 상세]\n" +
      "공격번호: " + attack["id"] + "\n공격자: " + attackerAlias + "\n대상: " + targetAlias + "\n" +
      "공격값: " + attackValue + "  (성공 기준: 공격값 × 1.5 = " + threshold + " 이상)\n\n" +
      response.detailText + "\n\n" +
      "결과: 맞대응 성공\n공격자의 공격은 무효화됩니다.\n공격자에게 맞대응값 전체 피해를 적용합니다.\n\n" +
      "반격피해: " + damage + "\n\n" + damageResult.text + attackEffectInvalidText + counterEffectText + _atkResolvedBlock;

    return makeFoldedResponse(summary, detail);
  }

  // ── 맞대응 실패 (1.5배 미달 전부 — 동률 포함) ──
  {
    const threshold = Math.ceil(attackValue * 1.5);
    const foldState = { amount: 0 };
    const attackEffectText = processPendingAttackSkillEffects(attack, RESIST_FORCE_FAIL, attackValue, foldState);
    const damage = Math.max(0, attackValue + foldState.amount);
    const damageResult = applyDamageToCharacter(targetAlias, damage, { attackerAlias: attackerAlias, sourceName: String(attack["공격명"] || "") });
    const foldNote = foldState.amount !== 0 ? "\n피해 보정: " + formatSigned(foldState.amount) : "";

    const shortReason = counterValue >= attackValue
      ? "맞대응값 " + counterValue + "이 기준(" + threshold + ")에 미달"
      : "맞대응값 " + counterValue + "이 공격값(" + attackValue + ")보다 낮음";

    resolvePendingAttack(attack["id"], {
      대응종류: "맞대응", 대응값: counterValue, 최종피해: damage,
      메모: "맞대응 실패 (" + shortReason + "). 맞대응 무효화. 공격 스킬 효과 저항 자동 실패"
    });

    const summary =
      "[맞대응]\n" + statusSummaryLine +
      "공격번호: " + attack["id"] + "\n" +
      "공격값: " + attackValue + " (성공 기준: " + threshold + ")" + foldNote + "\n" +
      "맞대응값: " + counterValue + "\n" +
      "결과: 맞대응 실패\n최종피해: " + damage + "\n" +
      compactDamageText(damageResult) +
      (attackEffectText ? "\n공격 효과: 저항 자동 실패 / 강제 적용" : "");

    const detail =
      statusDetailPrefix +
      "[맞대응 상세]\n" +
      "공격번호: " + attack["id"] + "\n공격자: " + attackerAlias + "\n대상: " + targetAlias + "\n" +
      "공격값: " + attackValue + "  (성공 기준: 공격값 × 1.5 = " + threshold + " 이상)\n\n" +
      response.detailText + "\n\n" +
      "결과: 맞대응 실패 (" + shortReason + ")\n" +
      "대상의 맞대응은 무효화됩니다.\n대상에게 공격값 전체 피해를 적용합니다.\n" +
      "공격 스킬 효과에 대한 저항 판정은 수행하지 않습니다.\n\n" +
      "최종피해: " + damage + "\n\n" + damageResult.text + attackEffectText;

    return makeFoldedResponse(summary, detail);
  }
}

function _resolveCombatResist(attack, character, rest, selfAlias, attackValue, attackerAlias, targetAlias, statusDetailPrefix, statusSummaryLine) {
  if (rest.length < 1) {
    return (
      "저항에 사용할 스킬을 입력하세요.\n" +
      "예시:\n" +
      "!대응 저항 정신방벽\n" +
      "!대응 저항 스킬 정신방벽\n" +
      "!대응 저항 공용스킬 정신방벽"
    );
  }

  let response;
  try {
    response = rollResponseValue(character, "저항", rest, attackerAlias);
  } catch (e) {
    return "[저항 대응 오류]\n" + e.message;
  }

  if (response.kind !== "스킬") {
    return (
      "[저항 대응 오류]\n" +
      "저항 대응은 스킬 또는 공용 스킬로만 처리할 수 있습니다.\n" +
      "예: !대응 저항 정신방벽"
    );
  }

  const resistValue   = response.value;
  const methodLine    = "저항 방식: " + (response.source === "공용" ? "공용 스킬" : "개인 스킬") + " - " + response.name + "\n";
  const resistSkillEffectText = _applyResponseSkillEffects(response, selfAlias, attackerAlias, RESIST_NONE);
  const resistSkillBlock = resistSkillEffectText
    ? "\n\n[저항 스킬 효과]\n" + response.name + "\n" + resistSkillEffectText
    : "";

  const summary =
    "[저항 대응]\n" + statusSummaryLine +
    "공격번호: " + attack["id"] + "\n" + methodLine +
    "공격값: " + attackValue + "\n저항값: " + resistValue + "\n" +
    (resistSkillEffectText ? "저항 스킬 효과: 적용 / 상세보기\n" : "") +
    "안내: 저항 대응은 자동 피해 처리/공격 대기 해소를 수행하지 않습니다.\n" +
    "필요 시 방어/회피/무대응으로 후속 처리하세요.";

  const detail =
    statusDetailPrefix +
    "[저항 대응 상세]\n" +
    "공격번호: " + attack["id"] + "\n공격자: " + attackerAlias + "\n대상: " + targetAlias + "\n" +
    "공격값: " + attackValue + "\n\n" + response.detailText + "\n\n" +
    "저항값: " + resistValue + "\n" +
    "안내: 저항 대응 명령은 안내성 판정값 출력만 수행합니다.\n" +
    "공격 대기는 그대로 유지되며, 실제 피해 처리는 별도 대응 명령으로 진행하세요." +
    resistSkillBlock;

  return makeFoldedResponse(summary, detail);
}

// ── combatResponse 본체 — 파싱 + 분기 라우팅만 담당 ──────────────────
function combatResponse(parts, displayName) {
  const character = findCharacter(displayName);
  if (!character) {
    return "캐릭터를 찾을 수 없습니다.\n디스코드 별명: " + displayName;
  }

  const selfAlias = String(character["별명"]).trim();

  if (parts.length < 2) {
    return (
      "사용법:\n" +
      "!대응 방어 [보정]\n" +
      "!대응 회피 [보정]\n" +
      "!대응 방어 <스킬명> [보정]            (개인→공용 순으로 검색)\n" +
      "!대응 방어 스킬 <스킬명> [보정]       (개인→공용 순으로 검색)\n" +
      "!대응 방어 공용스킬 <스킬명> [보정]   (공용 스킬만)\n" +
      "!대응 회피 <스킬명> / 회피 스킬 / 회피 공용스킬 도 동일\n" +
      "!대응 저항 <스킬명> [보정]            (안내성, 자동 피해 처리 없음)\n" +
      "!대응 맞대응 액션명 [보정]\n" +
      "!대응 맞대응 화력 랭크 [보정]\n" +
      "!대응 맞대응 <스킬명> [보정]          (개인→공용 순으로 검색)\n" +
      "!대응 맞대응 스킬 <스킬명> [보정]     (개인→공용)\n" +
      "!대응 맞대응 공용스킬 <스킬명> [보정] (공용 스킬만)\n" +
      "!대응 무대응\n\n" +
      "공격번호 지정:\n" +
      "!대응 ATK-0001 방어\n" +
      "!대응 ATK-0001 방어 공용스킬 방호각인"
    );
  }

  let index = 1;
  let attackId = "";

  if (/^ATK-\d+/i.test(String(parts[index] || ""))) {
    attackId = parts[index];
    index++;
  }

  const mode = String(parts[index] || "").trim();
  const rest = parts.slice(index + 1);

  if (!mode) return "대응 종류를 입력하세요: 방어 / 회피 / 저항 / 맞대응 / 무대응";

  const attack = attackId
    ? findPendingAttackById(attackId)
    : findLatestPendingAttackForTarget(selfAlias);

  if (!attack) {
    return (
      "대응할 공격을 찾을 수 없습니다.\n" +
      "대상: " + selfAlias + "\n\n" +
      "공격이 여러 개라면 공격번호를 지정하세요.\n" +
      "예시: !대응 ATK-0001 방어"
    );
  }

  if (String(attack["대상"]).trim() !== selfAlias) {
    return (
      "이 공격의 대상이 아닙니다.\n" +
      "공격번호: " + attack["id"] + "\n" +
      "공격 대상: " + attack["대상"] + "\n" +
      "현재 캐릭터: " + selfAlias
    );
  }

  const attackValue   = Math.floor(Number(attack["공격값"]) || 0);
  const attackerAlias = String(attack["공격자"]).trim();
  const targetAlias   = String(attack["대상"]).trim();

  if (mode === "무대응") {
    return _resolveCombatNoResponse(attack, attackValue, attackerAlias, targetAlias);
  }

  const statusResult = processStatusBeforeCheck(selfAlias, KIND_RESPONSE);

  if (statusResult.blocked) {
    return _resolveCombatStatusBlocked(attack, attackValue, attackerAlias, targetAlias, statusResult);
  }

  const statusDetailPrefix = (statusResult.fullText || statusResult.text) ? (statusResult.fullText || statusResult.text) + "\n\n" : "";
  const statusSummaryLine  = (statusResult.fullText || statusResult.text) ? "상태 처리: 상세보기 참고\n" : "";

  if (mode === "방어")   return _resolveCombatDefend (attack, character, rest, selfAlias, attackValue, attackerAlias, targetAlias, statusDetailPrefix, statusSummaryLine);
  if (mode === "회피")   return _resolveCombatEvade  (attack, character, rest, selfAlias, attackValue, attackerAlias, targetAlias, statusDetailPrefix, statusSummaryLine);
  if (mode === "맞대응") return _resolveCombatCounter(attack, character, rest, selfAlias, attackValue, attackerAlias, targetAlias, statusDetailPrefix, statusSummaryLine);
  if (mode === "저항")   return _resolveCombatResist (attack, character, rest, selfAlias, attackValue, attackerAlias, targetAlias, statusDetailPrefix, statusSummaryLine);

  return "알 수 없는 대응입니다: " + mode + "\n가능한 대응: 방어 / 회피 / 저항 / 맞대응 / 무대응";
}
function makeVarSafeName(name) {
  return String(name || "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^가-힣A-Za-z0-9_]/g, "_");
}

function getStackRows(alias) {
  try {
    return getSheetData(SHEET_STACK_DB).filter(r => {
      return String(r["대상"]).trim() === String(alias).trim();
    });
  } catch (e) {
    return [];
  }
}

function injectStackVariables(vars, alias, prefix) {
  const rows = getStackRows(alias);
  const p = prefix || "";

  rows.forEach(r => {
    const name = makeVarSafeName(r["스택명"]);
    if (!name) return;

    const value = Number(r["수치"] || 0);
    vars[p + "스택_" + name] = isNaN(value) ? 0 : value;
  });
}

function getActiveStatusRows(alias) {
  try {
    return getSheetData(SHEET_STATUS_DB).filter(r => {
      return (
        String(r["상태"]).trim() === "ACTIVE" &&
        String(r["대상"]).trim() === String(alias).trim()
      );
    });
  } catch (e) {
    return [];
  }
}

function injectStatusVariables(vars, alias, prefix) {
  const rows = getActiveStatusRows(alias);
  const p = prefix || "";

  const grouped = {};

  rows.forEach(r => {
    const name = makeVarSafeName(r["상태명"]);
    if (!name) return;

    if (!grouped[name]) grouped[name] = [];
    grouped[name].push(r);

    // "접두어_접미" 형태 상태명이면 접미 부분을 문자열 변수로 노출.
    //   예: 활성 상태 "지정_참격" → 상태접미_지정 = "참격"
    //   조건에서 사용액션 == 상태접미_지정 같은 비교에 사용.
    const us = name.indexOf("_");
    if (us > 0 && us < name.length - 1) {
      vars[p + "상태접미_" + name.slice(0, us)] = name.slice(us + 1);
    }
  });

  Object.keys(grouped).forEach(name => {
    const list = grouped[name];

    let sum = 0;
    let max = 0;
    let chanceMax = 0;
    let capMax = 0;
    let count = list.length;

    list.forEach(r => {
      const value = Number(r["수치"] || 0);
      const chance = Number(r["확률"] || 0) + Number(r["누적확률"] || 0);
      const cap = Number(r["최대값"] || r["최대치"] || 0);

      if (!isNaN(value)) {
        sum += value;
        if (value > max) max = value;
      }

      if (!isNaN(chance) && chance > chanceMax) {
        chanceMax = chance;
      }

      if (!isNaN(cap) && cap > capMax) {
        capMax = cap;
      }
    });

    // _최대: STATUS_DB에 최대값/최대치 열이 있고 값이 있으면 그 cap을, 없으면 기존처럼 단일 수치 최댓값.
    vars[p + "상태_" + name + "_개수"] = count;
    vars[p + "상태_" + name + "_수치"] = sum;
    vars[p + "상태_" + name + "_최대"] = capMax > 0 ? capMax : max;
    vars[p + "상태_" + name + "_존재"] = count > 0 ? 1 : 0;
    vars[p + "상태_" + name + "_확률"] = chanceMax;
  });
}

function findStackRowInfo(alias, stackName) {
  const ss = _getSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_STACK_DB);

  if (!sheet) {
    throw new Error("시트를 찾을 수 없습니다: " + SHEET_STACK_DB);
  }

  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(h => String(h).trim());

  const targetIndex = headers.indexOf("대상");
  const nameIndex = headers.indexOf("스택명");

  if (targetIndex < 0 || nameIndex < 0) {
    throw new Error("STACK_DB에 대상/스택명 열이 없습니다.");
  }

  for (let r = 1; r < values.length; r++) {
    if (
      String(values[r][targetIndex]).trim() === String(alias).trim() &&
      String(values[r][nameIndex]).trim() === String(stackName).trim()
    ) {
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = values[r][i];
      });

      return {
        sheet: sheet,
        rowIndex: r + 1,
        headers: headers,
        stack: obj
      };
    }
  }

  return null;
}

function setStackValue(alias, stackName, value, maxValue, memo) {
  const now = getNowText();
  const max = Number(maxValue || 0);
  let v = Math.floor(Number(value) || 0);

  if (max > 0) {
    v = Math.min(v, max);
  }

  v = Math.max(0, v);

  const rowInfo = findStackRowInfo(alias, stackName);

  if (!rowInfo) {
    appendRowByHeaders(SHEET_STACK_DB, {
      대상: alias,
      스택명: stackName,
      수치: v,
      최대치: max || "",
      메모: memo || "",
      수정일: now
    });

    return "[스택 생성]\n" + alias + " / " + stackName + ": " + v;
  }

  setCellByHeader(rowInfo, "수치", v);

  if (max > 0) {
    setCellByHeader(rowInfo, "최대치", max);
  }

  setCellByHeader(rowInfo, "수정일", now);

  return "[스택 변경]\n" + alias + " / " + stackName + ": " + v;
}

function modifyStackValue(alias, stackName, delta, maxValue, memo) {
  const rowInfo = findStackRowInfo(alias, stackName);
  const current = rowInfo ? Number(rowInfo.stack["수치"] || 0) : 0;

  return setStackValue(
    alias,
    stackName,
    current + Number(delta || 0),
    maxValue,
    memo
  );
}

function makeStatusId() {
  return makeId("ST", SHEET_STATUS_DB);
}

// 숫자 안전 변환 (status 전용 헬퍼)
function _statusToNum(v) {
  if (v === undefined || v === null || v === "") return 0;
  var n = Number(v);
  return isFinite(n) ? n : 0;
}

// 곱셈 보정 마커 판별/파싱.
// 효과 수치가 "*N" / "×N" 형태이면 덧셈이 아니라 곱셈 배율로 취급한다.
function _isMultValue(v) {
  return /^\s*[*×＊]/.test(String(v == null ? "" : v));
}
function _multFactor(v) {
  var s = String(v == null ? "" : v).trim();
  if (!_isMultValue(s)) return 1;
  var n = Number(s.replace(/^[*×＊]\s*/, ""));
  return isFinite(n) ? n : 1;
}

// 옵션 maxValue 후보(최대/최대값/최대치/최대수치) 중 첫 유효값 반환. 없으면 "".
function _pickMaxOption(opts) {
  if (!opts) return "";
  var keys = ["최대", "최대값", "최대치", "최대수치"];
  for (var i = 0; i < keys.length; i++) {
    var v = opts[keys[i]];
    if (v !== undefined && v !== null && String(v).trim() !== "") return v;
  }
  return "";
}

// 옵션 maxCount 후보(최대횟수) 반환. 없으면 "".
function _pickMaxCountOption(opts) {
  if (!opts) return "";
  var v = opts["최대횟수"];
  return (v !== undefined && v !== null && String(v).trim() !== "") ? v : "";
}

// STATUS_DB에서 같은 대상/상태명의 ACTIVE 행 찾기 (가장 최근 = 가장 아래 행)
function findActiveStatusRowInfo(targetAlias, statusName, checkType) {
  var ss = _getSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_STATUS_DB);
  if (!sheet) return null;

  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return null;

  var headers = values[0].map(function(h){ return String(h).trim(); });
  var iStatus = headers.indexOf("상태");
  var iTarget = headers.indexOf("대상");
  var iName   = headers.indexOf("상태명");
  if (iStatus < 0 || iTarget < 0 || iName < 0) return null;

  var alias = String(targetAlias || "").trim();
  var name  = String(statusName  || "").trim();
  // checkType이 지정된 경우 대상판정도 매칭 (예: "저항"과 "전체"를 별도 행으로 구분)
  var filterCheckType = checkType ? String(checkType).trim() : null;
  var iCheckType = filterCheckType !== null ? headers.indexOf("대상판정") : -1;

  // 가장 최근(아래쪽) ACTIVE 행을 찾는다.
  for (var r = values.length - 1; r >= 1; r--) {
    if (String(values[r][iStatus]).trim() !== "ACTIVE") continue;
    if (String(values[r][iTarget]).trim() !== alias) continue;
    if (String(values[r][iName]).trim()   !== name)  continue;
    if (filterCheckType !== null && iCheckType >= 0) {
      var rowCT = String(values[r][iCheckType] || "전체").trim() || "전체";
      if (rowCT !== filterCheckType) continue;
    }

    var obj = {};
    headers.forEach(function(h, i){ obj[h] = values[r][i]; });

    return { sheet: sheet, rowIndex: r + 1, headers: headers, status: obj };
  }
  return null;
}

// 헤더가 있을 때만 셀에 값 쓰기. STATUS_DB 행 전용 (rowInfo.status 미러).
function setStatusCell(rowInfo, headerName, value) {
  if (!rowInfo || !rowInfo.headers) return false;
  var idx = rowInfo.headers.indexOf(headerName);
  if (idx < 0) return false;
  rowInfo.sheet.getRange(rowInfo.rowIndex, idx + 1).setValue(value);
  if (rowInfo.status) rowInfo.status[headerName] = value;
  return true;
}

// 덮어쓰기 계열 stackMode 인지 판별
function _isOverwriteStackMode(mode) {
  var m = String(mode || "").trim();
  return m === "덮어쓰기" || m === "불가" || m === "갱신" || m === "교체";
}

function addStatusToCharacter(targetAlias, statusName, category, effectCode, options) {
  options = options || {};
  var now = getNowText();
  var stackMode = String(options.stackMode || "허용").trim();

  // 옵션 maxValue (수치 상한, 없으면 "")
  var optMax = options.maxValue;
  if (optMax === undefined || optMax === null || String(optMax).trim() === "") optMax = "";
  var optMaxNum = _statusToNum(optMax);

  // 옵션 maxCount (횟수 상한, 없으면 "")
  var optMaxCount = options.maxCount;
  if (optMaxCount === undefined || optMaxCount === null || String(optMaxCount).trim() === "") optMaxCount = "";
  var optMaxCountNum = _statusToNum(optMaxCount);

  var existing = findActiveStatusRowInfo(targetAlias, statusName, options.checkType || null);

  // ─── A. 신규 행 ───────────────────────────────────────────────
  if (!existing) {
    var id = makeStatusId();
    var initIsMult = _isMultValue(options.value);
    var initValue = initIsMult ? ("*" + _multFactor(options.value)) : _statusToNum(options.value);
    var initCount = (options.count === undefined || options.count === null || options.count === "")
      ? "" : _statusToNum(options.count);
    // 수치 상한: 최대 적용 (곱셈 배율 마커에는 적용하지 않음)
    if (!initIsMult && optMaxNum > 0 && initValue > optMaxNum) initValue = optMaxNum;
    // 횟수 상한: 최대횟수 적용
    if (optMaxCountNum > 0 && initCount !== "" && initCount > optMaxCountNum) initCount = optMaxCountNum;

    var row = {
      id: id,
      상태: "ACTIVE",
      대상: targetAlias,
      상태명: statusName,
      분류: category,
      효과코드: effectCode,
      수치: initValue,
      확률: options.chance || 100,
      누적확률: options.accum || 0,
      증가확률: options.increase || 0,
      최대확률: options.maxChance || 100,
      발동타이밍: options.trigger || "판정시작",
      대상판정: options.checkType || "전체",
      남은횟수: initCount,
      중복방식: stackMode,
      출처: options.source || "",
      메모: options.memo || "",
      생성일: now,
      처리일: ""
    };
    // 최대값/최대치(수치 상한) 헤더가 있으면 기록
    if (optMax !== "") { row["최대값"] = optMax; row["최대치"] = optMax; }
    // 최대횟수(횟수 상한) 헤더가 있으면 기록
    if (optMaxCount !== "") { row["최대횟수"] = optMaxCount; }
    appendRowByHeaders(SHEET_STATUS_DB, row);

    var out = "[상태 부여]\n" +
              "대상: " + targetAlias + "\n" +
              "상태: " + statusName + "\n" +
              "분류: " + category + "\n" +
              "효과코드: " + effectCode +
              "\n수치: " + initValue;
    if (initCount !== "")   out += "\n남은횟수: " + initCount;
    if (optMax !== "")      out += "\n최대수치: " + optMax;
    if (optMaxCount !== "") out += "\n최대횟수: " + optMaxCount;
    return out;
  }

  // ─── B/C. 기존 ACTIVE 갱신 ────────────────────────────────────
  // 최대(수치 상한)·최대횟수(횟수 상한)는 이번 스킬 효과에서만 참조한다.
  // STATUS_DB에 저장된 값은 수식 변수(상태_X_최대) 참조 목적이며 캡 계산에 쓰지 않는다.
  var maxCap = optMaxNum;       // 0 = 무제한
  var maxCountCap = optMaxCountNum; // 0 = 무제한

  var prevValueRaw = existing.status["수치"];
  var prevValue = _statusToNum(prevValueRaw);
  var prevCountRaw = existing.status["남은횟수"];
  var prevCount = _statusToNum(prevCountRaw);
  var prevCountBlank = (prevCountRaw === undefined || prevCountRaw === null || String(prevCountRaw).trim() === "");

  // options.count는 명시적으로 들어왔을 때만 의미가 있다 (공란/미지정 시 기존 횟수 유지).
  var countProvided = (options.count !== undefined && options.count !== null && String(options.count).trim() !== "");
  var addValue = _statusToNum(options.value);
  var addCount = countProvided ? _statusToNum(options.count) : 0;

  var newValue;
  var isOverwrite = _isOverwriteStackMode(stackMode);
  var addIsMult = _isMultValue(options.value);
  var prevIsMult = _isMultValue(prevValueRaw);
  if (addIsMult || prevIsMult) {
    // 곱셈 보정 마커: 덮어쓰기/기존이 덧셈이면 새 배율로 교체, 누적이면 배율을 곱한다.
    if (!addIsMult && isOverwrite) {
      // 덮어쓰기인데 새 값이 덧셈형이면 mult→additive로 타입 전환
      newValue = addValue;
      if (maxCap > 0 && newValue > maxCap) newValue = maxCap;
    } else {
      var newFactor = addIsMult ? _multFactor(options.value) : 1;
      if (isOverwrite || !prevIsMult) {
        newValue = "*" + newFactor;
      } else {
        newValue = "*" + (Math.round(_multFactor(prevValueRaw) * newFactor * 1e6) / 1e6);
      }
    }
  } else if (isOverwrite) {
    newValue = addValue;
    if (maxCap > 0 && newValue > maxCap) newValue = maxCap;
  } else {
    newValue = prevValue + addValue;
    if (maxCap > 0 && newValue > maxCap) newValue = maxCap;
  }

  // newCount: 미지정 시 기존값 보존. 지정 시 모드별 처리.
  var newCount;        // 최종 셀에 쓸 값 (공란 가능)
  var newCountForLog;  // 로그용 숫자
  if (!countProvided) {
    newCount = prevCountBlank ? "" : prevCount;
    newCountForLog = prevCountBlank ? "-" : prevCount;
  } else {
    var calc = isOverwrite ? addCount : (prevCountBlank ? addCount : (prevCount + addCount));
    if (maxCountCap > 0 && calc > maxCountCap) calc = maxCountCap;  // 횟수는 maxCountCap으로
    newCount = calc;
    newCountForLog = calc;
  }

  setStatusCell(existing, "수치", newValue);
  if (countProvided) {
    setStatusCell(existing, "남은횟수", newCount);
  }

  // 기타 옵션은 값이 들어왔을 때만 갱신 (헤더 없으면 setStatusCell이 무시)
  if (category)   setStatusCell(existing, "분류", category);
  if (effectCode) setStatusCell(existing, "효과코드", effectCode);
  if (options.chance    !== undefined && options.chance    !== "") setStatusCell(existing, "확률", options.chance);
  if (options.accum     !== undefined && options.accum     !== "") setStatusCell(existing, "누적확률", options.accum);
  if (options.increase  !== undefined && options.increase  !== "") setStatusCell(existing, "증가확률", options.increase);
  if (options.maxChance !== undefined && options.maxChance !== "") setStatusCell(existing, "최대확률", options.maxChance);
  if (options.trigger)   setStatusCell(existing, "발동타이밍", options.trigger);
  if (options.checkType) setStatusCell(existing, "대상판정", options.checkType);
  setStatusCell(existing, "중복방식", stackMode);
  if (options.source) setStatusCell(existing, "출처", options.source);
  if (options.memo)   setStatusCell(existing, "메모", options.memo);
  if (maxCap > 0) { setStatusCell(existing, "최대값", maxCap); setStatusCell(existing, "최대치", maxCap); }
  if (maxCountCap > 0) setStatusCell(existing, "최대횟수", maxCountCap);
  setStatusCell(existing, "처리일", now);
  setStatusCell(existing, "수정일", now);

  var header = isOverwrite ? "[상태 갱신]" : "[상태 누적 갱신]";
  var body = header + "\n" +
             "대상: " + targetAlias + "\n" +
             "상태: " + statusName + "\n";
  if (isOverwrite) {
    body += "수치: " + newValue + "\n" +
            "남은횟수: " + newCountForLog;
  } else {
    var prevValueForLog = (prevIsMult || addIsMult) ? (prevIsMult ? ("*" + _multFactor(prevValueRaw)) : prevValue) : prevValue;
    body += "수치: " + prevValueForLog + " → " + newValue + "\n" +
            "남은횟수: " + (prevCountBlank ? "-" : prevCount) + " → " + newCountForLog;
  }
  if (maxCap > 0)      body += "\n최대수치: " + maxCap;
  if (maxCountCap > 0) body += "\n최대횟수: " + maxCountCap;
  return body;
}

function removeStatusFromCharacter(targetAlias, statusName) {
  const rows = getActiveStatusRows(targetAlias);
  let count = 0;

  rows.forEach(r => {
    if (String(r["상태명"]).trim() === String(statusName).trim()) {
      updateRowById(SHEET_STATUS_DB, "id", r["id"], {
        상태: "REMOVED",
        처리일: getNowText(),
        메모: "상태해제"
      });
      count++;
    }
  });

  return (
    "[상태 해제]\n" +
    "대상: " + targetAlias + "\n" +
    "상태: " + statusName + "\n" +
    "해제 수: " + count
  );
}

// ══════════════════════════════════════════════════════════════════════
// 대가(코스트) 시스템
// ══════════════════════════════════════════════════════════════════════
//
// 대가 문법 (한 줄에 하나, 여러 줄 가능):
//   체력감소:N          — 자신에게 N 직접 피해 (패시브·보호막 없이)
//   체력감소:N%         — 최대 체력의 N% 만큼 차감
//   침식증가:N          — 이면침식 +N
//   스택소모:스택명:N   — 스택 N 차감 (부족하면 차단)
//   상태소모:상태명     — 해당 상태 제거 (없으면 차단)
//   쿨타임:N            — 사용 후 N턴 재사용 불가 (상태 기반)
//   캐스팅:N            — N턴 캐스팅 후 발동 (상태 기반)
//
// 반환: { ok: true/false, blocked: true/false, reason: string, logs: string[] }
//   ok      = 모든 코스트 지불 성공
//   blocked = 코스트 부족으로 스킬 차단
//   reason  = 차단 이유 (blocked=true일 때)
//   logs    = 지불 완료된 코스트 결과 로그

var COST_COOLDOWN_PREFIX  = "쿨타임_";
var COST_CASTING_PREFIX   = "캐스팅_";
var COST_COOLDOWN_CAT     = "시스템";
var COST_COOLDOWN_CODE    = "쿨타임";
var COST_CASTING_CODE     = "캐스팅";

// 쿨타임 상태명
function _cooldownStatusName(skillName) { return COST_COOLDOWN_PREFIX + skillName; }
// 캐스팅 상태명
function _castingStatusName(skillName) { return COST_CASTING_PREFIX + skillName; }

// 쿨타임/캐스팅 사전 차단 검사 — 스킬 조건 통과 직후, 코스트 지불 전에 호출.
// 반환: { blocked: false } 또는 { blocked: true, text: string }
function checkSkillCostGate(alias, skillName, costText) {
  costText = String(costText || "").trim();
  if (!costText) return { blocked: false };

  var lines = costText.split(/[\n;]/).map(function(l){ return l.trim(); }).filter(Boolean);

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];

    // 쿨타임 확인
    var cdM = line.match(/^쿨타임[:：](\d+(?:\.\d+)?)$/);
    if (cdM) {
      var cdStatus = findActiveStatusRowInfo(alias, _cooldownStatusName(skillName));
      if (cdStatus) {
        var cdRemain = _statusToNum(cdStatus.status["남은횟수"]);
        return {
          blocked: true,
          text: "[쿨타임]\n" + skillName + "\n해당 스킬은 아직 사용할 수 없습니다.\n남은 쿨타임: " + cdRemain
        };
      }
    }

    // 캐스팅 확인 — 캐스팅 상태가 없으면 시작, 있으면 count 확인
    var caM = line.match(/^캐스팅[:：](\d+(?:\.\d+)?)$/);
    if (caM) {
      var caStatus = findActiveStatusRowInfo(alias, _castingStatusName(skillName));
      if (!caStatus) {
        // 캐스팅 상태 없음 → 캐스팅 시작 (스킬 차단, 상태 부여)
        var caTurns = Number(caM[1]);
        // 첫 !스킬명 사용 자체가 1번째 캐스팅 턴 — count = N-1
        var caInitCount = Math.max(0, caTurns - 1);
        addStatusToCharacter(alias, _castingStatusName(skillName), COST_COOLDOWN_CAT, COST_CASTING_CODE, {
          value: caTurns,
          count: caInitCount,
          stackMode: "덮어쓰기",
          trigger: "판정시작",
          checkType: "전체",
          source: skillName,
          memo: "캐스팅 중"
        });
        if (caInitCount === 0) {
          // 캐스팅:1 — 첫 사용으로 즉시 완료
          return {
            blocked: true,
            text: "[캐스팅 완료]\n" + skillName + "\n" +
                  "집속이 완료되었습니다! 발동 준비가 됐습니다.\n\n" +
                  "!스킬 " + skillName + "\n또는\n!공용스킬 " + skillName + "\n\n" +
                  "위 명령으로 발동하세요."
          };
        }
        return {
          blocked: true,
          text: "[캐스팅 시작]\n" + skillName + " (" + caInitCount + "턴 남음)\n" +
                "집속을 시작합니다. !캐스팅 명령으로 계속 진행하세요.\n\n" +
                "!캐스팅 " + skillName + "\n\n" +
                "캐스팅 중에는 다른 스킬을 사용할 수 없습니다."
        };
      }
      // 캐스팅 상태 있음 — 남은 횟수 확인
      var caRemain = _statusToNum(caStatus.status["남은횟수"]);
      if (caRemain > 0) {
        return {
          blocked: true,
          text: "[캐스팅 진행 중]\n" + skillName + " (" + caRemain + "턴 남음)\n" +
                "캐스팅 중에는 다른 스킬을 사용할 수 없습니다.\n\n" +
                "!캐스팅 " + skillName + "\n\n" +
                "위 명령으로 집속을 진행하세요."
        };
      }
      // caRemain === 0 → 캐스팅 완료 → 발동 허용 (상태는 payCost에서 소모)
    }

    // 스택 소모 차단 확인 (부족하면 차단)
    var stM = line.match(/^스택소모[:：]([^:：]+)[:：](\d+(?:\.\d+)?)$/);
    if (stM) {
      var stName  = stM[1].trim();
      var stNeed  = Number(stM[2]);
      var stRow   = findStackRowInfo(alias, stName);
      var stHave  = stRow ? Number(stRow.stack["수치"] || 0) : 0;
      if (stHave < stNeed) {
        return {
          blocked: true,
          text: "[스킬 사용 불가: 스택 부족]\n스킬: " + skillName +
                "\n스택: " + stName + " (보유 " + stHave + " / 필요 " + stNeed + ")"
        };
      }
    }

    // 상태 소모 차단 확인 (없으면 차단)
    var ssM = line.match(/^상태소모[:：](.+)$/);
    if (ssM) {
      var ssName = ssM[1].trim();
      var ssRow  = findActiveStatusRowInfo(alias, ssName);
      if (!ssRow) {
        return {
          blocked: true,
          text: "[스킬 사용 불가: 상태 없음]\n스킬: " + skillName +
                "\n필요 상태: " + ssName + " (현재 없음)"
        };
      }
    }
  }

  return { blocked: false };
}

// 코스트 지불 실행 — checkSkillCostGate 통과 후 호출.
// 반환: { ok: true, logs: string[] }
function payCost(alias, skillName, costText, context) {
  costText = String(costText || "").trim();
  if (!costText) return { ok: true, logs: [] };

  var logs = [];
  var lines = costText.split(/[\n;]/).map(function(l){ return l.trim(); }).filter(Boolean);
  context = context || {};

  lines.forEach(function(line) {

    // 체력감소:N — 직접 HP 차감 (패시브/보호막 우회)
    // 체력감소:N% — 최대 체력의 N% 만큼 차감
    var hpM = line.match(/^체력감소[:：](.+)$/);
    if (hpM) {
      var rInfo = rereadCharacterRow(alias);
      if (!rInfo) { logs.push("[대가] 체력감소: 캐릭터를 찾을 수 없습니다."); return; }
      var hp = getHealthInfo(rInfo.character);
      var rawHp = String(hpM[1]).trim();
      var pctM = rawHp.match(/^([\s\S]+?)\s*%$/);
      var hpN;
      if (pctM) {
        var pct = readEffectNumber(pctM[1].trim(), context, 0);
        hpN = Math.max(0, Math.floor(hp.maxHp * pct / 100));
      } else {
        hpN = Math.max(0, Math.floor(readEffectNumber(rawHp, context, 0)));
      }
      var after = Math.max(0, hp.currentHp - hpN);
      setCellByHeader(rInfo, "현재체력", after);
      logs.push("[대가] 체력감소: " + hpN + (pctM ? " (최대체력 " + rawHp + ")" : "") +
                " (" + hp.currentHp + " → " + after + ")");
      return;
    }

    // 침식증가:N
    var erM = line.match(/^침식증가[:：](.+)$/);
    if (erM) {
      var erN = Math.max(0, Math.floor(readEffectNumber(erM[1], context, 0)));
      var erInfo = rereadCharacterRow(alias);
      if (erInfo) {
        var before = Number(erInfo.character["이면침식"] || 0);
        var erAfter = Math.min(MAX_EROSION, before + erN);
        setCellByHeader(erInfo, "이면침식", erAfter);
        logs.push("[대가] 침식증가: +" + erN + " (" + before + " → " + erAfter + ")");
      } else {
        logs.push("[대가] 침식증가: 캐릭터를 찾을 수 없습니다.");
      }
      return;
    }

    // 스택소모:스택명:N
    var stM = line.match(/^스택소모[:：]([^:：]+)[:：](\d+(?:\.\d+)?)$/);
    if (stM) {
      var stName = stM[1].trim();
      var stN    = Number(stM[2]);
      logs.push(modifyStackValue(alias, stName, -stN, "", skillName + " 대가"));
      return;
    }

    // 상태소모:상태명
    var ssM = line.match(/^상태소모[:：](.+)$/);
    if (ssM) {
      logs.push(removeStatusFromCharacter(alias, ssM[1].trim()));
      return;
    }

    // 쿨타임:N — 쿨타임 상태 부여
    var cdM = line.match(/^쿨타임[:：](\d+(?:\.\d+)?)$/);
    if (cdM) {
      var cdN = Number(cdM[1]);
      addStatusToCharacter(alias, _cooldownStatusName(skillName), COST_COOLDOWN_CAT, COST_COOLDOWN_CODE, {
        value: cdN,
        count: cdN,
        stackMode: "덮어쓰기",
        trigger: "판정시작",
        checkType: "전체",
        source: skillName,
        memo: "쿨타임"
      });
      logs.push("[대가] 쿨타임 " + cdN + "턴 시작: " + _cooldownStatusName(skillName));
      return;
    }

    // 캐스팅:N — 캐스팅 상태 소모 (게이트에서 이미 통과 확인됨)
    var caM = line.match(/^캐스팅[:：](\d+(?:\.\d+)?)$/);
    if (caM) {
      removeStatusFromCharacter(alias, _castingStatusName(skillName));
      logs.push("[대가] 캐스팅 완료: " + _castingStatusName(skillName) + " 소모");
      return;
    }

    // 알 수 없는 대가 — 로그만 남기고 무시하지 않음 (텍스트로 표시)
    logs.push("[대가] " + line + " (처리됨)");
  });

  return { ok: true, logs: logs };
}

// ── 캐스팅 진행 중 여부 확인 — 다른 스킬 사용 시 차단용 ─────────────────
// 현재 캐릭터에게 count > 0 인 캐스팅 상태가 있으면 { blocked, text } 반환.
function _checkAnyCastingBlock(alias) {
  var rows = getActiveStatusRows(alias);
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    if (String(r["분류"]    || "").trim() !== COST_COOLDOWN_CAT) continue;
    if (String(r["효과코드"] || "").trim() !== COST_CASTING_CODE) continue;
    var sName = String(r["상태명"] || "").trim();
    if (!sName.startsWith(COST_CASTING_PREFIX)) continue;
    var remain = _statusToNum(r["남은횟수"]);
    if (remain <= 0) continue;  // count=0 은 "완료 대기" — 발동 허용
    var castSkill = sName.slice(COST_CASTING_PREFIX.length);
    return {
      blocked: true,
      text: "[캐스팅 진행 중]\n" + castSkill + " (" + remain + "턴 남음)\n" +
            "캐스팅 중에는 다른 스킬을 사용할 수 없습니다.\n\n" +
            "!캐스팅 " + castSkill + "\n\n" +
            "위 명령으로 집속을 계속 진행하세요."
    };
  }
  return { blocked: false };
}

// ── !캐스팅 커맨드 ────────────────────────────────────────────────────────
function castingProgressCommand(parts, displayName) {
  var character = findCharacter(displayName);
  if (!character) return "캐릭터를 찾을 수 없습니다.\n디스코드 별명: " + displayName;
  var alias = String(character["별명"]).trim();

  // 인자 없음 → 진행 중인 캐스팅 목록 표시
  if (parts.length < 2) {
    var allRows = getActiveStatusRows(alias).filter(function(r) {
      return String(r["분류"] || "").trim() === COST_COOLDOWN_CAT &&
             String(r["효과코드"] || "").trim() === COST_CASTING_CODE &&
             String(r["상태명"] || "").trim().startsWith(COST_CASTING_PREFIX);
    });
    if (allRows.length === 0) {
      return "[캐스팅 없음]\n현재 진행 중인 캐스팅이 없습니다.";
    }
    var lines = allRows.map(function(r) {
      var sn = String(r["상태명"] || "").trim().slice(COST_CASTING_PREFIX.length);
      var cnt = _statusToNum(r["남은횟수"]);
      return cnt > 0
        ? sn + " — " + cnt + "턴 남음 (계속: !캐스팅 " + sn + ")"
        : sn + " — 발동 준비 완료 (!스킬 " + sn + " 또는 !공용스킬 " + sn + ")";
    });
    return "[캐스팅 목록]\n" + lines.join("\n");
  }

  var skillName = parts.slice(1).join(" ");
  var statusName = _castingStatusName(skillName);
  var statusInfo = findActiveStatusRowInfo(alias, statusName);

  if (!statusInfo) {
    return "[캐스팅 오류]\n" + skillName + "의 캐스팅이 진행 중이 아닙니다.\n" +
           "먼저 !스킬 " + skillName + " 또는 !공용스킬 " + skillName + " 으로 캐스팅을 시작하세요.";
  }

  var current = _statusToNum(statusInfo.status["남은횟수"]);

  if (current <= 0) {
    // 이미 완료
    return "[캐스팅 완료]\n" + skillName + "\n" +
           "집속이 이미 완료되었습니다. 다음 명령으로 발동하세요.\n\n" +
           "!스킬 " + skillName + "\n또는\n!공용스킬 " + skillName;
  }

  var next = current - 1;
  updateRowById(SHEET_STATUS_DB, "id", statusInfo.status["id"], { 남은횟수: next });
  invalidateSheetCache(SHEET_STATUS_DB);

  if (next > 0) {
    return "[캐스팅 중]\n" + skillName + "\n" +
           "집속 진행 중... (" + next + "턴 남음)\n\n" +
           "!캐스팅 " + skillName + "\n\n" +
           "위 명령을 " + next + "번 더 입력하세요.";
  }

  // next === 0 → 완료!
  return "[캐스팅 완료]\n" + skillName + "\n" +
         "집속이 완료되었습니다! 발동 준비가 됐습니다.\n\n" +
         "!스킬 " + skillName + "\n또는\n!공용스킬 " + skillName + "\n\n" +
         "위 명령으로 발동하세요.";
}

function parseEffectOptions(tokens) {
  const options = {};
  // 옵션 키는 "한글/영문 식별자 + : (또는 ：)" 로 시작하는 토큰만 인정한다.
  // 그 외 토큰(계수식의 '(', 숫자, 연산자 *, ×, +, 변수명, 콤마 항목 등)은
  // 직전 옵션 값에 공백으로 이어붙인다 → 공백이 포함된 계수식 수치를 보존.
  //   예: 수치:(민첩 + 근력 × 0.5) × (1 + 무기술 × 0.12 ...) * 0.55
  //       판정:타격, 방어, 저항
  const keyRe = /^([가-힣A-Za-z][가-힣A-Za-z0-9_]*)[:：]([\s\S]*)$/;
  let currentKey = null;

  tokens.forEach(token => {
    token = String(token || "").trim();
    if (!token) return;

    const m = token.match(keyRe);
    if (m) {
      currentKey = m[1].trim();
      options[currentKey] = m[2];
    } else if (currentKey) {
      options[currentKey] = (options[currentKey] + " " + token).trim();
    }
    // currentKey 없고 키도 아니면 무시 (위치 인자는 이미 slice로 제거됨)
  });

  return options;
}

// 효과 수치 옵션 평가.
//  - "*수식" / "×수식" → 곱셈 보정 마커 문자열 "*<배율>" 반환 (소수 유지).
//  - 그 외(숫자/계수식, '-' 포함 가능) → readEffectNumber로 숫자 평가.
function _evalEffectValue(raw, context) {
  var s = String(raw == null ? "" : raw).trim();
  if (s === "") return 0;
  if (_isMultValue(s)) {
    var body = s.replace(/^[*×＊]\s*/, "");
    var vars = (context && context.vars) ? context.vars : {};
    if (context && context.finalValue != null) {
      vars = Object.assign({}, vars, { 최종값: context.finalValue });
    }
    try {
      var res = safeEvalFormula(body || "1", vars);
      // 배율은 소수(×2.2 등)가 그대로 필요하므로 정수화 전 rawValue 사용
      var f = (res && res.rawValue !== undefined) ? res.rawValue
            : (res && res.value !== undefined ? res.value : Number(res));
      if (!isFinite(f)) f = 1;
      // 부동소수 잡음 제거
      f = Math.round(f * 1e6) / 1e6;
      return "*" + f;
    } catch (_e) {
      return "*1";
    }
  }
  return readEffectNumber(s, context, 0);
}

// 옵션 숫자 값 평가 — 빈 값은 ""(무제한/미지정) 유지, 숫자/계수식은 정수로 평가.
function _evalOptNum(raw, context) {
  var s = String(raw == null ? "" : raw).trim();
  if (s === "") return "";
  var n = Number(s);
  if (!isNaN(n)) return Math.floor(n);
  var v = readEffectNumber(s, context, NaN);
  return isNaN(Number(v)) ? "" : Math.floor(Number(v));
}

// 상태/스택 저장 키 정규화 — 대상이 에너미면 정규 별명(alias→name→enemy_id)으로 통일한다.
// STATUS_DB/STACK_DB 쓰기와 전투/패시브 조회가 같은 키를 쓰도록 보장. PC는 그대로 둔다.
function _canonStatusTarget(alias) {
  alias = String(alias || "").trim();
  if (!alias || alias === "자신" || alias === "대상") return alias;
  if (findCharacterByAlias(alias)) return alias;  // PC 우선
  try {
    var e = resolveEnemy(alias);
    if (e) return enemyCanonicalAlias(e);
  } catch (_e) { /* 에너미 아님 → 원본 유지 */ }
  return alias;
}

function resolveEffectTarget(token, context) {
  token = String(token || "").trim();
  context = context || {};

  if (token === "자신") {
    return _canonStatusTarget(context.userAlias || "");
  }

  if (token === "대상") {
    const targetAlias = String(context.targetAlias || "").trim();

    // 대상 미지정이면 빈 값 반환.
    // processSkillEffects()에서 해당 효과 줄을 무효 처리한다.
    if (!targetAlias) {
      return "";
    }

    // !스킬 스킬명 대상:자신 을 허용.
    if (targetAlias === "자신") {
      return _canonStatusTarget(context.userAlias || "");
    }

    return _canonStatusTarget(targetAlias);
  }

  // 직접 별명을 적은 경우.
  // 예: 상태부여 몬스터A 출혈 ...
  return _canonStatusTarget(token);
}

function readEffectNumber(value, context, fallback) {
  value = String(value || "").trim();

  if (!value) return fallback || 0;
  if (value === "최종값") return (context && context.finalValue != null) ? context.finalValue : (fallback || 0);

  const n = Number(value);
  if (!isNaN(n)) return n;

  // 수식 평가 (스탯·스택·DB 변수 참조 가능)
  try {
    var vars = (context && context.vars) ? context.vars : {};
    if (context && context.finalValue != null) vars = Object.assign({}, vars, { 최종값: context.finalValue });
    var res = safeEvalFormula(value, vars);
    var v = res && res.value !== undefined ? res.value : Number(res);
    if (!isNaN(v)) return v;
  } catch (_e) { /* 수식 평가 실패 시 fallback */ }

  return fallback || 0;
}

function parseResistanceMods(value) {
  value = String(value || "").trim();

  if (!value) {
    return [];
  }

  return value
    .split(/[,，、\s]+/)
    .map(v => String(v || "").trim())
    .filter(Boolean);
}

function isResistanceEnabled(value) {
  const v = String(value || "").trim();

  return (
    v === "가능" ||
    v === "true" ||
    v === "TRUE" ||
    v === "1" ||
    v === "yes" ||
    v === "YES"
  );
}

function rollResistanceForStatus(targetAlias, difficulty, mods) {
  mods = mods || [];

  const targetCharacter = findCharacterByAlias(targetAlias);

  if (!targetCharacter) {
    // 캐릭터가 아니면 에너미로 시도 — 에너미는 '저항' 액션 주사위로 굴린다.
    var enemyT = null;
    try { enemyT = resolveEnemy(targetAlias); } catch (_e) { /* 에너미도 아님 */ }
    if (enemyT) {
      var bonusSum = (mods || []).reduce(function (a, m) {
        var n = Number(String(m).replace(/[^0-9+\-]/g, ""));
        return a + (isNaN(n) ? 0 : n);
      }, 0);
      var er = rollEnemyAction(enemyT, "저항", bonusSum);
      var diffE = Math.floor(Number(difficulty) || 0);
      var successE = er.total >= diffE;
      return {
        targetAlias: targetAlias,
        difficulty: diffE,
        mods: mods,
        rolled: er,
        value: er.total,
        success: successE,
        text:
          "[상태 저항]\n" +
          "대상: " + targetAlias + " (에너미)\n" +
          "저항난이도: " + diffE + "\n\n" +
          "액션: 저항\n" +
          "굴림: " + er.rollText + "\n\n" +
          "판정: " + (successE ? "저항 성공" : "저항 실패")
      };
    }
    throw new Error("저항 대상을 찾을 수 없습니다(캐릭터/에너미 아님): " + targetAlias);
  }

  // 판정시작 패시브 발동: actionCheck와 달리 processStatusBeforeCheck를 거치지 않으므로
  // 직접 패시브를 발동시켜야 판정보정 저항 같은 항상-트리거 SET-EFFECT 상태가 생성된다.
  var _resistPassiveLog = "";
  try {
    var _rpt = firePassiveTriggerEffects(targetCharacter, "판정시작", { resistanceMode: RESIST_NONE });
    if (_rpt) {
      _resistPassiveLog = _rpt;
      try { SpreadsheetApp.flush(); } catch (_e) {}
      invalidateSheetCache(SHEET_STATUS_DB);
    }
  } catch (_e) { /* 패시브 오류 무시 */ }

  const rolled = rollActionValueForCharacter(targetCharacter, "저항", mods);
  const resistanceValue = rolled.sum;
  const diff = Math.floor(Number(difficulty) || 0);
  const success = resistanceValue >= diff;

  return {
    targetAlias: targetAlias,
    difficulty: diff,
    mods: mods,
    rolled: rolled,
    value: resistanceValue,
    success: success,
    text:
      "[상태 저항]\n" +
      "대상: " + targetAlias + "\n" +
      "저항난이도: " + diff + "\n\n" +
      (_resistPassiveLog ? "[패시브]\n" + _resistPassiveLog + "\n\n" : "") +
      "액션: 저항\n" +
      "최종 계수: " + rolled.finalCoef + "\n" +
      "주사위: " + rolled.diceCount + "d" + ACTION_DICE_SIDES + "\n" +
      "결과: " + rolled.rolls.join(", ") + "\n" +
      "합계: " + resistanceValue + "\n" +
      "보정: " + (mods.join(" ") || "없음") + "\n\n" +
      "판정: " + (success ? "저항 성공" : "저항 실패")
  };
}

function getSkillFromPendingAttack(attack) {
  if (!attack) return null;

  const attackKind = String(attack["공격종류"] || "").trim();

  if (attackKind !== KIND_SKILL) {
    return null;
  }

  const attackerAlias = String(attack["공격자"] || "").trim();
  const skillName = String(attack["공격명"] || "").trim();

  if (!attackerAlias || !skillName) {
    return null;
  }

  // 개인 스킬 먼저 검색
  const personalSkill = findApprovedSkill(attackerAlias, skillName);
  if (personalSkill) return personalSkill;

  // 공용 스킬 폴백 (개인 스킬에 없는 경우)
  const commonSkill = findCommonSkill(skillName);
  if (commonSkill) {
    return {
      "스킬명": String(commonSkill["이름"] || skillName),
      "계통":   String(commonSkill["계통"] || ""),
      "계열":   String(commonSkill["계열"] || ""),
      "랭크":   String(commonSkill["랭크"] || ""),
      "계산식": String(commonSkill["계산식"] || ""),
      "효과":   String(commonSkill["효과"] || ""),
      "조건":   String(commonSkill["조건"] || ""),
      "대가":   String(commonSkill["대가"] || ""),
      "설명":   String(commonSkill["설명"] || ""),
      "소유자": attackerAlias
    };
  }
  return null;
}

function processPendingAttackSkillEffects(attack, resistanceMode, finalValueForEffect, foldState) {
  const skill = getSkillFromPendingAttack(attack);

  if (!skill) {
    const _kind = String(attack["공격종류"] || "").trim();
    if (_kind === KIND_ENEMY_SKILL && Math.floor(Number(finalValueForEffect) || 0) > 0) {
      const _enemySkill = getEnemySkillFromPendingAttack(attack);
      if (_enemySkill) {
        const _effectText = String(_enemySkill["effect"] || "").trim();
        if (_effectText) {
          return applyEnemySkillEffect(_effectText, {
            userAlias:      String(attack["공격자"] || "").trim(),
            targetAlias:    String(attack["대상"]   || "").trim(),
            finalValue:     Math.floor(Number(finalValueForEffect) || 0),
            skillName:      String(_enemySkill["name"] || _enemySkill["skill_key"] || ""),
            resistanceMode: resistanceMode,
            foldState:      foldState || null
          });
        }
      }
    }
    return "";
  }

  const effectText = String(skill["효과"] || "").trim();

  if (!effectText) {
    return "";
  }

  const attackerAlias = String(attack["공격자"] || "").trim();
  const targetAlias = String(attack["대상"] || "").trim();
  const finalValue = Math.floor(Number(finalValueForEffect || attack["공격값"] || 0));

  try {
    return processSkillEffects(effectText, {
      foldState: foldState || null,
      userAlias: attackerAlias,
      targetAlias: targetAlias,
      finalValue: finalValue,
      skillName: skill["스킬명"],
      skill: skill,
      resistanceMode: resistanceMode
    });
  } catch (e) {
    return (
      "\n\n[공격 스킬 효과 처리 오류]\n" +
      "스킬명: " + skill["스킬명"] + "\n" +
      "오류: " + e.message + "\n\n" +
      "효과:\n```" +
      effectText +
      "```"
    );
  }
}

function pickOption(opts, key, fallback) {
  if (opts && opts[key] !== undefined && opts[key] !== "") {
    return opts[key];
  }
  return fallback;
}

function buildStatusOptionsFromTemplate(template, opts, context) {
  opts = opts || {};
  context = context || {};

  return {
    value: _evalEffectValue(pickOption(opts, "수치", template["수치"]), context),
    chance: readEffectNumber(pickOption(opts, "확률", template["확률"]), context, 100),
    accum: readEffectNumber(
      pickOption(opts, "누적", pickOption(opts, "누적확률", template["누적확률"])),
      context,
      0
    ),
    increase: readEffectNumber(
      pickOption(opts, "증가", pickOption(opts, "증가확률", template["증가확률"])),
      context,
      0
    ),
    maxChance: readEffectNumber(pickOption(opts, "최대확률", template["최대확률"]), context, 100),
    trigger: pickOption(opts, "발동", pickOption(opts, "발동타이밍", template["발동타이밍"] || "판정시작")),
    checkType: pickOption(opts, "판정", pickOption(opts, "대상판정", template["대상판정"] || "전체")),
    count: pickOption(opts, "횟수", pickOption(opts, "남은횟수", template["남은횟수"] || "")),
    stackMode: pickOption(opts, "중복", pickOption(opts, "중복방식", template["중복방식"] || "허용")),
    maxValue: _pickMaxOption(opts) || template["최대값"] || template["최대치"] || "",
    maxCount: _pickMaxCountOption(opts) || template["최대횟수"] || "",
    source: context.skillName || "상태템플릿",
    memo: pickOption(opts, "메모", template["메모"] || "")
  };
}

function applyStatusWithResistance(targetAlias, statusName, category, effectCode, opts, context, resistanceMode) {
  opts = opts || {};
  context = context || {};
  resistanceMode = resistanceMode || RESIST_NORMAL;

  const logs = [];

  if (!targetAlias) {
    return (
      "[효과 무효]\n" +
      "효과: " + statusName + " 부여\n" +
      "이유: 대상이 지정되지 않았습니다.\n" +
      "자가 적용이 필요하면 효과 대상을 '자신'으로 쓰거나, 명령어에 대상:자신을 지정하세요."
    );
  }

  const resistanceRequested = isResistanceEnabled(opts["저항"]);

  if (resistanceRequested && resistanceMode === RESIST_NORMAL) {
    const difficulty = readEffectNumber(
      opts["저항난이도"] || "최종값",
      context,
      context.finalValue || 0
    );

    const resistanceMods = parseResistanceMods(opts["저항보정"]);
    const resistance = rollResistanceForStatus(targetAlias, difficulty, resistanceMods);

    logs.push(
      resistance.text + "\n\n" +
      "대상 상태: " + statusName
    );

    if (resistance.success) {
      logs.push(
        "[상태 부여 실패]\n" +
        "대상: " + targetAlias + "\n" +
        "상태: " + statusName + "\n" +
        "이유: 저항 성공"
      );

      return logs.join("\n\n");
    }

    logs.push(
      "[상태 부여 진행]\n" +
      "대상: " + targetAlias + "\n" +
      "상태: " + statusName + "\n" +
      "이유: 저항 실패"
    );
  }

  if (resistanceRequested && resistanceMode === RESIST_FORCE_FAIL) {
    logs.push(
      "[상태 저항 자동 실패]\n" +
      "대상: " + targetAlias + "\n" +
      "상태: " + statusName + "\n" +
      "이 효과는 대응 실패/무대응/맞대응 패배로 강제 적용됩니다.\n" +
      "저항 판정을 수행하지 않습니다."
    );
  }

  if (resistanceRequested && resistanceMode === RESIST_NONE) {
    logs.push(
      "[상태 저항 생략]\n" +
      "대상: " + targetAlias + "\n" +
      "상태: " + statusName + "\n" +
      "이미 선행 저항 판정 또는 별도 판정 절차가 처리되었습니다."
    );
  }

  logs.push(addStatusToCharacter(targetAlias, statusName, category, effectCode, {
    value: _evalEffectValue(opts["수치"], context),
    chance: readEffectNumber(opts["확률"], context, 100),
    accum: readEffectNumber(opts["누적"], context, 0),
    increase: readEffectNumber(opts["증가"], context, 0),
    maxChance: readEffectNumber(opts["최대확률"], context, 100),
    trigger: opts["발동"] || "판정시작",
    checkType: opts["판정"] || "전체",
    count: _evalOptNum(opts["횟수"], context),
    stackMode: opts["중복"] || "허용",
    maxValue: _evalOptNum(_pickMaxOption(opts), context),
    maxCount: _evalOptNum(_pickMaxCountOption(opts), context),
    source: context.skillName || "",
    memo: opts["메모"] || ""
  }));

  return logs.join("\n\n");
}

function applyTemplateStatusWithResistance(targetAlias, templateName, opts, context, resistanceMode) {
  opts = opts || {};
  context = context || {};
  resistanceMode = resistanceMode || RESIST_NORMAL;

  const template = findStatusTemplate(templateName);

  if (!template) {
    return (
      "[효과 무효]\n" +
      "상태 템플릿을 찾을 수 없습니다: " + templateName
    );
  }

  if (!targetAlias) {
    return (
      "[효과 무효]\n" +
      "효과: 상태템플릿부여 " + templateName + "\n" +
      "이유: 대상이 지정되지 않았습니다.\n" +
      "자가 적용이 필요하면 효과 대상을 '자신'으로 쓰거나, 명령어에 대상:자신을 지정하세요."
    );
  }

  const statusName = opts["상태명"] || template["상태명"];
  const category = opts["분류"] || template["분류"];
  const effectCode = opts["효과코드"] || template["효과코드"];

  const statusOptions = buildStatusOptionsFromTemplate(template, opts, context);

  const mergedOpts = {
    수치: statusOptions.value,
    확률: statusOptions.chance,
    누적: statusOptions.accum,
    증가: statusOptions.increase,
    최대확률: statusOptions.maxChance,
    발동: statusOptions.trigger,
    판정: statusOptions.checkType,
    횟수: statusOptions.count,
    중복: statusOptions.stackMode,
    최대: statusOptions.maxValue,
    최대횟수: statusOptions.maxCount,
    메모: statusOptions.memo,
    저항: opts["저항"] || "",
    저항난이도: opts["저항난이도"] || "",
    저항보정: opts["저항보정"] || ""
  };

  const result = applyStatusWithResistance(
    targetAlias,
    statusName,
    category,
    effectCode,
    mergedOpts,
    context,
    resistanceMode
  );

  return (
    "[상태 템플릿 적용]\n" +
    "템플릿: " + templateName + "\n" +
    "대상: " + targetAlias + "\n\n" +
    result
  );
}

// ── 세부효과: "변수 = 값" / "변수 == 값" 설정 표현식 파서 ──────────────
// 단일 변수명 뒤에 = 또는 == 가 오면 "값 설정" 효과로 인식.
// 기존 효과 명령(상태부여/스택증가 등)은 첫 토큰 뒤에 공백+다른 단어가
// 오므로 이 정규식과 매칭되지 않는다 → 충돌 없음.
function _parseSetEffect(effPart) {
  var s = String(effPart == null ? "" : effPart);
  // 모디파이어 변수(판정보정/피해보정/피해감소/회복보정)는 변수와 = 사이에
  // 콤마 판정 유형 목록을 가질 수 있다. 예: "판정보정 참격,관통 = 3" → checkType="참격,관통".
  // 값 뒤에 "횟수:N"(유지 횟수)·"소비:TYPE"(판정보정 전용: 횟수를 소비할 판정 유형)을 추가 가능.
  var mod = s.match(/^\s*(판정보정|피해보정|피해감소|회복보정)\s*([^=<>!]*?)\s*(==|=)\s*(.+?)\s*$/);
  if (mod) {
    var rawValue = mod[4].trim();
    var count = null;
    var consumeType = null;
    rawValue = rawValue.replace(/\s+횟수:(\d+)/g, function(_, n) { count = parseInt(n, 10); return ""; })
                       .replace(/\s+소비:([^\s]+)/g, function(_, t) { consumeType = t; return ""; })
                       .trim();
    return { variable: mod[1].trim(), checkType: (mod[2] || "").trim(), value: rawValue, count: count, consumeType: consumeType };
  }
  var m = s.match(/^\s*([^\s=<>!]+)\s*(==|=)\s*(.+?)\s*$/);
  if (!m) return null;
  return { variable: m[1].trim(), value: m[3].trim() };
}

// 설정 효과 실행.
// DB 직접 기록 변수(이면침식/현재체력/일상점)는 시트 셀에 set + 클램프.
// 모디파이어 개념 변수(피해감소/피해보정/회복보정/판정보정)는 이번 단계에서는
//   로그/반환값까지만 (실제 전투 합산 연동은 후속).
// 그 외 변수는 오류 메시지 반환.
function applySetEffect(variable, valueExpr, context, checkType, extraOpts) {
  context = context || {};
  extraOpts = extraOpts || {};
  var v = String(variable).trim();
  var checkTypeStr = String(checkType || "").trim() || "전체";

  var alias = String(
    context.userAlias ||
    (context.character && context.character["별명"]) || ""
  ).trim();
  var character = context.character || (alias ? findCharacterByAlias(alias) : null);

  // 우변 평가용 컨텍스트(스탯/DB 변수 참조 허용)
  var evalCtx = context;
  if (character && !context.vars) {
    try {
      var cc = buildConditionContext(character, context.targetAlias || "");
      evalCtx = Object.assign({}, context, { vars: cc.vars });
    } catch (_e) { /* vars 없이 진행 */ }
  }

  // 곱셈 보정 마커(*N / ×N) 지원 — 모디파이어 변수는 배율로 저장한다.
  // 예: "판정보정 ... = *(1 + 0.04*스택_근기)" → 수치 "*1.2" 상태 생성(× 적용).
  var _valStr = String(valueExpr == null ? "" : valueExpr).trim();
  var isMult  = /^[*×＊]/.test(_valStr);
  var num = NaN, multFactor = NaN;
  if (isMult) {
    var _inner = _valStr.replace(/^[*×＊]\s*/, "");
    try {
      var _r = safeEvalFormula(_inner || "1", (evalCtx && evalCtx.vars) || {});
      multFactor = (_r && _r.rawValue !== undefined) ? _r.rawValue
                 : Number(_r && _r.value !== undefined ? _r.value : _r);
    } catch (_e) { multFactor = NaN; }
    if (isNaN(Number(multFactor))) {
      return "[설정 실패]\n변수: " + v + "\n배율 식을 해석할 수 없습니다: " + valueExpr;
    }
    multFactor = Math.round(Number(multFactor) * 1e6) / 1e6;
  } else {
    try { num = readEffectNumber(valueExpr, evalCtx, NaN); }
    catch (_e) { num = NaN; }
    if (isNaN(Number(num))) {
      return "[설정 실패]\n변수: " + v + "\n값을 숫자로 해석할 수 없습니다: " + valueExpr;
    }
    num = Math.floor(Number(num));
  }

  // ── 모디파이어 개념 변수: 임시 상태로 실제 적용 ──
  //   판정보정 → 강화/약화 상태(getStatusValueModifier가 판정에 반영)
  //   피해보정/피해감소 → 분류=피해보정 상태(processPreDamageStatuses가 반영)
  //   회복보정 → 분류=회복보정 상태(applyHealingToCharacter가 반영)
  //   지속: 횟수 미지정(장면 동안, !fin까지) · 중복: 덮어쓰기("= 값" 의미)
  var MODIFIER_LABEL = {
    "피해감소": "받는 피해 감소",
    "피해보정": "피해 보정",
    "회복보정": "회복 보정",
    "판정보정": "판정 보정"
  };
  if (MODIFIER_LABEL.hasOwnProperty(v)) {
    if (!alias) return "[설정 실패]\n변수: " + v + "\n대상 캐릭터를 확인할 수 없습니다.";
    // 설정 효과(판정보정/피해보정 등)는 DSL에 명시적 대상 지정이 없으므로 항상 시전자에게 적용.
    // context.targetAlias는 전투 맥락의 공격/피해 대상이지 효과 대상이 아님.
    var modTarget = _canonStatusTarget(alias);

    if (v === "판정보정") {
      var jBuff = isMult ? (multFactor >= 1) : (num >= 0);
      var jVal  = isMult ? ("*" + multFactor) : num;
      var jMemo = extraOpts.consumeType ? ("소비:" + String(extraOpts.consumeType).trim()) : "";
      var jCount = (extraOpts.count != null && !isNaN(Number(extraOpts.count))) ? Number(extraOpts.count) : undefined;
      var jResult = addStatusToCharacter(modTarget, "판정보정", jBuff ? "강화" : "약화",
        jBuff ? "buff" : "debuff",
        { value: jVal, trigger: "판정시작", checkType: checkTypeStr, stackMode: "덮어쓰기",
          count: jCount, source: context.skillName || "판정보정", memo: jMemo });
      if (extraOpts.consumeType) jResult += "\n소비판정: " + extraOpts.consumeType;
      return jResult;
    }
    if (v === "피해보정" || v === "피해감소") {
      // 곱셈(*N)은 그대로 배율 저장. 덧셈은 피해감소=음수(경감)/피해보정=그대로.
      var dv = isMult ? ("*" + multFactor) : ((v === "피해감소") ? -Math.abs(num) : num);
      return addStatusToCharacter(modTarget, v, "피해보정", "피해보정",
        { value: dv, trigger: "피해직전", checkType: "전체", stackMode: "덮어쓰기",
          source: context.skillName || v, memo: "" });
    }
    // 회복보정
    var hv = isMult ? ("*" + multFactor) : num;
    return addStatusToCharacter(modTarget, "회복보정", "회복보정", "회복보정",
      { value: hv, trigger: "회복시", checkType: "전체", stackMode: "덮어쓰기",
        source: context.skillName || "회복보정", memo: "" });
  }

  // ── DB 직접 기록 변수 ──
  if (v !== "이면침식" && v !== "현재체력" && v !== "일상점") {
    return "[설정 실패]\n설정할 수 없는 변수입니다: " + v +
      "\n(가능: 이면침식, 현재체력, 일상점, 피해감소, 회복보정, 판정보정)";
  }
  if (isMult) {
    return "[설정 실패]\n변수: " + v + "\n곱셈(*N)은 보정 변수(판정보정/피해보정/회복보정)에만 쓸 수 있습니다.";
  }
  if (!alias) {
    return "[설정 실패]\n변수: " + v + "\n대상 캐릭터를 확인할 수 없습니다.";
  }

  var rowInfo = rereadCharacterRow(alias);
  if (!rowInfo) return "[설정 실패]\n캐릭터를 찾을 수 없습니다: " + alias;
  if (rowInfo.headers.indexOf(v) < 0) {
    return "[설정 실패]\nBOT_DB에 " + v + " 열이 없습니다.";
  }

  var before = Number(rowInfo.character[v] || 0);
  var after = num;
  if (v === "이면침식") {
    after = Math.max(0, Math.min(MAX_EROSION, num));
  } else if (v === "현재체력") {
    var hp = getHealthInfo(rowInfo.character);
    after = clampHp(num, hp.maxHp);
  } else if (v === "일상점") {
    var maxDaily = Number(rowInfo.character["최대일상점"] || 0);
    after = maxDaily > 0 ? Math.max(0, Math.min(maxDaily, num)) : Math.max(0, num);
  }
  setCellByHeader(rowInfo, v, after);
  return "[설정] " + v + ": " + before + " → " + after;
}

function processSkillEffects(effectText, context) {
  effectText = String(effectText || "").trim();

  if (!effectText) {
    return "";
  }

  context = context || {};

  // 효과 옵션의 계수식(수치:(민첩 + 근력 * 0.5) ... 등) 평가를 위해
  // 시전자(userAlias)의 스탯/기능/숙련/스택/상태 변수를 미리 준비한다.
  if (!context.vars && context.userAlias) {
    try {
      var _caster = context.character || findCharacterByAlias(context.userAlias);
      if (_caster) {
        var _rankVal = 0;
        try {
          var _rk = context.skill && (context.skill["랭크"] || context.skill["rank"]);
          if (_rk) _rankVal = rankToValue(_rk);
        } catch (_e) {}
        context.vars = buildFormulaVariables(_caster, _rankVal, context.targetAlias || "");
      }
    } catch (_e) { /* 변수 준비 실패 시 빈 vars로 진행 */ }
  }

  let resistanceMode = String(context.resistanceMode || "").trim();

  if (!resistanceMode) {
    if (context.allowResistance === false) {
      resistanceMode = RESIST_FORCE_FAIL;
    } else {
      resistanceMode = RESIST_NORMAL;
    }
  }

  // 줄 구분: 개행, ';', ' / ' (공백+슬래시+공백).
  // 주의: ' / '는 수치 계수식 안에 나눗셈 공백이 있으면 잘못 분리될 수 있으므로 반드시 양측 공백 필요.
  const rawLines = effectText.split(/[\n;]| \/ /).map(l => l.trim()).filter(Boolean);
  // 파티 대상 확장: "파티"가 두 번째 토큰(대상 위치)인 줄을 각 파티원별 줄로 분리한다.
  // 조건부 효과(=> 포함)에서는 확장되지 않음 — 단순 직접 효과만 지원.
  const lines = [];
  rawLines.forEach(function(rawLine) {
    var _tks = rawLine.split(/\s+/);
    if (_tks.length >= 2 && _tks[1] === "파티") {
      var _ua = String(context.userAlias || "").trim();
      var _pm = _ua ? getPartyMembersForAlias(_ua) : [];
      if (_pm.length > 0) {
        _pm.forEach(function(_m) { var _e = _tks.slice(); _e[1] = _m; lines.push(_e.join(" ")); });
        return;
      }
    }
    lines.push(rawLine);
  });
  const logs = [];

  lines.forEach(line => {
    // ── 조건부 효과: "세부조건 => 세부효과" ──
    // 화살표가 없으면 기존 동작 그대로(무조건 실행).
    // 좌측 조건이 비어 있으면 항상 실행.
    let effPart = line;
    const arrow = line.match(/^([\s\S]*?)\s*(?:=>|⇒|→|->)\s*([\s\S]*)$/);
    if (arrow) {
      const condPart = arrow[1].trim();
      effPart = arrow[2].trim();
      if (condPart) {
        const condChar = context.character ||
          (context.userAlias ? findCharacterByAlias(context.userAlias) : null);
        const condCtx = buildConditionContext(condChar, context.targetAlias || "");
        // 방금 사용한 액션/스킬명, 판정 최종값을 줄 조건에 노출
        // (예: 사용액션 == 상태접미_지정, 최종값 >= 1)
        if (context.usedAction !== undefined) condCtx.vars["사용액션"] = String(context.usedAction || "");
        if (context.finalValue !== undefined) condCtx.vars["최종값"] = Number(context.finalValue) || 0;
        const condResult = evaluateConditionList(condPart, condCtx);
        if (!condResult.ok) {
          logs.push("[조건 미충족] " + condPart);
          return;
        }
      }
    }
    if (!effPart) return;

    // ── 값 설정 효과: "변수 = 값" / "변수 == 값" ──
    const setEff = _parseSetEffect(effPart);
    if (setEff) {
      logs.push(applySetEffect(setEff.variable, setEff.value, context, setEff.checkType, { count: setEff.count, consumeType: setEff.consumeType }));
      return;
    }

    const tokens = effPart.split(/\s+/);
    const command = tokens[0];

    if (command === "상태템플릿부여") {
      if (tokens.length < 3) {
        throw new Error("상태템플릿부여 효과 형식 오류: " + line);
      }

      const targetAlias = resolveEffectTarget(tokens[1], context);
      const templateName = tokens[2];
      const opts = parseEffectOptions(tokens.slice(3));

      logs.push(applyTemplateStatusWithResistance(
        targetAlias,
        templateName,
        opts,
        context,
        resistanceMode
      ));

      return;
    }

    if (command === "상태부여") {
      if (tokens.length < 5) {
        throw new Error("상태부여 효과 형식 오류: " + line);
      }

      const targetAlias = resolveEffectTarget(tokens[1], context);
      const statusName = tokens[2];
      const category = tokens[3];
      const effectCode = tokens[4];
      const opts = parseEffectOptions(tokens.slice(5));

      logs.push(applyStatusWithResistance(
        targetAlias,
        statusName,
        category,
        effectCode,
        opts,
        context,
        resistanceMode
      ));

      return;
    }

    // 랜덤상태부여 <대상> <접두어> <항목1,항목2,...> [옵션...]
    //  목록 중 하나를 무작위 선택해 "<접두어>_<선택>" 상태를 부여하고,
    //  같은 접두어의 다른 상태는 제거(항상 1개만 활성). 조건에서 상태접미_<접두어>로 참조.
    //  옵션: 수치(주면 강화 버프로 부여, 대상판정=선택 액션), 발동, 판정, 횟수, 최대, 문구, 메모.
    if (command === "랜덤상태부여") {
      if (tokens.length < 4) {
        throw new Error("랜덤상태부여 효과 형식 오류: " + line);
      }

      const targetAlias = resolveEffectTarget(tokens[1], context);
      const prefix = tokens[2];
      const opts = parseEffectOptions(tokens.slice(4));
      const items = String(tokens[3] || "").split(/[,，、]/).map(function (s) { return s.trim(); }).filter(Boolean);

      if (!targetAlias) {
        logs.push("[효과 무효]\n효과: 랜덤상태부여 " + prefix + "\n이유: 대상이 지정되지 않았습니다.");
        return;
      }
      if (!items.length) {
        logs.push("[효과 무효]\n효과: 랜덤상태부여 " + prefix + "\n이유: 선택 목록이 비어 있습니다.");
        return;
      }

      // 같은 접두어의 기존 상태 모두 제거 (항상 1개만 활성 보장)
      items.forEach(function (it) {
        try { removeStatusFromCharacter(targetAlias, prefix + "_" + it); } catch (_e) {}
      });

      const pick = items[Math.floor(Math.random() * items.length)];
      const hasVal = opts["수치"] !== undefined && String(opts["수치"]).trim() !== "";

      logs.push(addStatusToCharacter(
        targetAlias,
        prefix + "_" + pick,
        opts["분류"] || (hasVal ? "강화" : "지정"),
        opts["효과코드"] || (hasVal ? "buff" : "표식"),
        {
          value: _evalEffectValue(opts["수치"], context),
          chance: 100,
          trigger: opts["발동"] || "판정시작",
          checkType: opts["판정"] || pick,   // 기본: 지정된 항목(액션)에만 적용
          count: _evalOptNum(opts["횟수"], context),
          stackMode: opts["중복"] || "덮어쓰기",
          maxValue: _evalOptNum(_pickMaxOption(opts), context),
          source: context.skillName || "랜덤지정",
          memo: opts["메모"] || ""
        }
      ));

      logs.push("[랜덤 지정] " + (opts["문구"] ? (opts["문구"] + ": " + pick) : ("이번 턴 지정: " + pick)));
      return;
    }

    if (command === "상태해제") {
      if (tokens.length < 3) {
        throw new Error("상태해제 효과 형식 오류: " + line);
      }

      const targetAlias = resolveEffectTarget(tokens[1], context);
      const statusName = tokens[2];

      if (!targetAlias) {
        logs.push(
          "[효과 무효]\n" +
          "효과: 상태해제 " + statusName + "\n" +
          "이유: 대상이 지정되지 않았습니다."
        );
        return;
      }

      logs.push(removeStatusFromCharacter(targetAlias, statusName));
      return;
    }

    if (command === "스택증가") {
      if (tokens.length < 4) {
        throw new Error("스택증가 효과 형식 오류: " + line);
      }

      const targetAlias = resolveEffectTarget(tokens[1], context);
      const stackName = tokens[2];
      const delta = Number(String(tokens[3]).replace(/^\+/, "")) || 0;
      const opts = parseEffectOptions(tokens.slice(4));

      if (!targetAlias) {
        logs.push(
          "[효과 무효]\n" +
          "효과: 스택증가 " + stackName + "\n" +
          "이유: 대상이 지정되지 않았습니다."
        );
        return;
      }

      logs.push(modifyStackValue(
        targetAlias,
        stackName,
        delta,
        opts["최대"] || "",
        context.skillName || ""
      ));

      return;
    }

    if (command === "스택감소") {
      if (tokens.length < 4) {
        throw new Error("스택감소 효과 형식 오류: " + line);
      }

      const targetAlias = resolveEffectTarget(tokens[1], context);
      const stackName = tokens[2];
      const delta = -Math.abs(Number(String(tokens[3]).replace(/^-/, "")) || 0);
      const opts = parseEffectOptions(tokens.slice(4));

      if (!targetAlias) {
        logs.push(
          "[효과 무효]\n" +
          "효과: 스택감소 " + stackName + "\n" +
          "이유: 대상이 지정되지 않았습니다."
        );
        return;
      }

      logs.push(modifyStackValue(
        targetAlias,
        stackName,
        delta,
        opts["최대"] || "",
        context.skillName || ""
      ));

      return;
    }

    if (command === "스택설정") {
      if (tokens.length < 4) {
        throw new Error("스택설정 효과 형식 오류: " + line);
      }

      const targetAlias = resolveEffectTarget(tokens[1], context);
      const stackName = tokens[2];
      const value = Number(String(tokens[3]).replace(/^=/, "")) || 0;
      const opts = parseEffectOptions(tokens.slice(4));

      if (!targetAlias) {
        logs.push(
          "[효과 무효]\n" +
          "효과: 스택설정 " + stackName + "\n" +
          "이유: 대상이 지정되지 않았습니다."
        );
        return;
      }

      logs.push(setStackValue(
        targetAlias,
        stackName,
        value,
        opts["최대"] || "",
        context.skillName || ""
      ));

      return;
    }

    if (command === "피해") {
      if (tokens.length < 3) {
        throw new Error("피해 효과 형식 오류: " + line);
      }

      const targetAlias = resolveEffectTarget(tokens[1], context);
      const rawAmount = Math.floor(readEffectNumber(tokens[2], context, 0));

      if (!targetAlias) {
        logs.push(
          "[효과 무효]\n" +
          "효과: 피해 " + (tokens[2] || "") + "\n" +
          "이유: 대상이 지정되지 않았습니다."
        );
        return;
      }

      // 합산 모드: 공격 대상에 대한 피해는 기본 피해(공격값/방어후 값)에 합산되어
      // 한 번에 적용된다. 명중판정/피해판정이 분리되지 않은 룰 보완용 —
      // 음수 보정으로 "명중 높고 피해 낮은 공격" 등을 구현할 수 있다.
      if (context.foldState && targetAlias === context.targetAlias) {
        context.foldState.amount += rawAmount;
        logs.push("[피해 보정] " + formatSigned(rawAmount) + " (기본 피해에 합산)");
        return;
      }

      // 직접 모드(비-공격 효과 등): 음수는 0으로 간주(회복 아님).
      logs.push(applyDamageToRef(targetAlias, Math.max(0, rawAmount), {
        attackerAlias: context.userAlias || "",
        sourceName: context.skillName || ""
      }).text || "");
      return;
    }

    if (command === "회복") {
      if (tokens.length < 3) {
        throw new Error("회복 효과 형식 오류: " + line);
      }

      const targetAlias = resolveEffectTarget(tokens[1], context);
      const amount = Math.max(0, Math.floor(readEffectNumber(tokens[2], context, 0)));

      if (!targetAlias) {
        logs.push(
          "[효과 무효]\n" +
          "효과: 회복 " + (tokens[2] || "") + "\n" +
          "이유: 대상이 지정되지 않았습니다."
        );
        return;
      }

      logs.push(applyHealingToRef(targetAlias, amount).text || "");
      return;
    }

    throw new Error("알 수 없는 효과 명령입니다: " + command);
  });

  return "\n\n[스킬 효과]\n" + logs.join("\n\n");
}

function statusMatchesCheckType(status, checkType) {
  const raw = String(status["대상판정"] || "전체").trim();

  if (!raw || raw === "전체") return true;

  const list = raw.split(/[,，、]/).map(s => s.trim()).filter(Boolean);
  return list.includes(checkType);
}

function consumeStatusCount(status) {
  const raw = String(status["남은횟수"] || "").trim();

  if (!raw) return;

  const count = Number(raw);
  if (isNaN(count)) return;

  const next = count - 1;

  if (next <= 0) {
    updateRowById(SHEET_STATUS_DB, "id", status["id"], {
      상태: "EXPIRED",
      남은횟수: 0,
      처리일: getNowText()
    });
  } else {
    updateRowById(SHEET_STATUS_DB, "id", status["id"], {
      남은횟수: next
    });
  }
}

function processStatusBeforeCheck(alias, checkTypeOrTypes) {
  var checkTypes = Array.isArray(checkTypeOrTypes) ? checkTypeOrTypes : [checkTypeOrTypes];
  const rows = getActiveStatusRows(alias);
  const logs = [];
  const detailLogs = [];
  let blocked = false;

  rows.forEach(status => {
    if (String(status["발동타이밍"] || "").trim() !== "판정시작") return;
    if (!statusMatchesAnyCheckType(status, checkTypes)) return;

    const category = String(status["분류"] || "").trim();
    const code = String(status["효과코드"] || "").trim();

    if (category === "지속피해") {
      const damage = Math.max(0, Math.floor(Number(status["수치"] || 0)));
      const damageResult = applyDamageToCharacter(alias, damage);
      const statusPrefix = "[상태 발동: " + status["상태명"] + "]\n" + "지속피해: " + damage + "\n";

      logs.push(statusPrefix + damageResult.shortText);
      detailLogs.push(statusPrefix + damageResult.text);

      consumeStatusCount(status);
      return;
    }

    // 구속 bind:
    // 해제 성공 = 구속 해제 + 행동 가능
    // 해제 실패 = 구속 유지 + 행동 불가 + 다음 해제 확률 증가
    if (category === "행동방해" && code === "bind") {
      const baseChance = Number(status["확률"] || 0);
      const accum = Number(status["누적확률"] || 0);
      const increase = Number(status["증가확률"] || 0);
      const maxChance = Number(status["최대확률"] || 100);

      const currentChance = Math.min(maxChance, baseChance + accum);
      const roll = rollDie(100);

      if (roll <= currentChance) {
        // 해제 성공: 행동 가능
        updateRowById(SHEET_STATUS_DB, "id", status["id"], {
          상태: "REMOVED",
          처리일: getNowText(),
          메모: "구속 해제 성공"
        });

        var bindSuccessEntry =
          "[상태 판정: 구속]\n" +
          "해제 확률: " + currentChance + "%\n" +
          "굴림: " + roll + "\n" +
          "결과: 구속 해제 성공.\n" +
          "구속 상태가 해제됩니다.\n" +
          "이번 행동은 가능합니다.";
        logs.push(bindSuccessEntry);
        detailLogs.push(bindSuccessEntry);

      } else {
        // 해제 실패: 행동 불가
        blocked = true;

        // 누적확률은 '추가치'다.
        // 실제 해제 확률은 확률 + 누적확률.
        // 최대확률을 넘지 않도록 누적치의 상한은 최대확률 - 기본확률.
        const maxAccum = Math.max(0, maxChance - baseChance);
        const nextAccum = Math.min(maxAccum, accum + increase);
        const nextChance = Math.min(maxChance, baseChance + nextAccum);

        updateRowById(SHEET_STATUS_DB, "id", status["id"], {
          누적확률: nextAccum
        });

        var bindFailEntry =
          "[상태 판정: 구속]\n" +
          "해제 확률: " + currentChance + "%\n" +
          "굴림: " + roll + "\n" +
          "결과: 구속 해제 실패.\n" +
          "이번 행동은 불가능합니다.\n" +
          "구속 상태는 유지됩니다.\n" +
          "다음 해제 확률: " + nextChance + "%";
        logs.push(bindFailEntry);
        detailLogs.push(bindFailEntry);
      }

      return;
    }

    // 일반 행동방해:
    // 발동 성공 시 행동 저지.
    if (category === "행동방해") {
      const chance = Number(status["확률"] || 0);
      const roll = rollDie(100);

      if (roll <= chance) {
        blocked = true;

        var hbBlockEntry =
          "[상태 발동: " + status["상태명"] + "]\n" +
          "확률: " + chance + "%\n" +
          "굴림: " + roll + "\n" +
          "결과: 행동이 저지됩니다.";
        logs.push(hbBlockEntry);
        detailLogs.push(hbBlockEntry);
      } else {
        var hbMissEntry =
          "[상태 판정: " + status["상태명"] + "]\n" +
          "확률: " + chance + "%\n" +
          "굴림: " + roll + "\n" +
          "결과: 발동하지 않았습니다.";
        logs.push(hbMissEntry);
        detailLogs.push(hbMissEntry);
      }

      consumeStatusCount(status);
      return;
    }

    // 시스템 분류 — 쿨타임만 자동 차감, 캐스팅은 !캐스팅 명령으로만 진행
    if (category === "시스템") {
      const code = String(status["효과코드"] || "").trim();
      if (code === "쿨타임") {
        consumeStatusCount(status);  // 0이 되면 EXPIRED 만료
      }
      // 캐스팅은 여기서 건드리지 않음 — !캐스팅 명령에서만 차감
      return;
    }
  });

  // 패시브 발동: 판정시작
  var passiveLogs = [];
  var _passiveFiredAny = false;
  try {
    var charForPassive = findCharacterByAlias(alias);
    if (charForPassive) {
      var passiveFireText = firePassiveTriggerEffects(charForPassive, "판정시작", { resistanceMode: RESIST_NONE });
      if (passiveFireText) { passiveLogs.push(passiveFireText); _passiveFiredAny = true; }
    }
  } catch (e) {
    // 패시브 시트 없거나 오류 → 무시.
  }
  // 패시브가 STATUS_DB에 새 상태를 추가/갱신했을 수 있으므로,
  // 이후 getStatusValueModifier가 최신 데이터를 볼 수 있도록 flush + 캐시 무효화.
  if (_passiveFiredAny) {
    try { SpreadsheetApp.flush(); } catch (_e) {}
    invalidateSheetCache(SHEET_STATUS_DB);
  }

  var statusOnlyText = logs.length > 0 ? logs.join("\n\n") : "";
  var allDetailLogs = detailLogs.concat(passiveLogs);
  var fullText = allDetailLogs.length > 0 ? "[상태 처리]\n" + allDetailLogs.join("\n\n") : "";

  return {
    blocked: blocked,
    text: statusOnlyText,
    passiveText: passiveLogs.join("\n\n"),
    fullText: fullText
  };
}

function compactDamageText(damageResult) {
  if (!damageResult) {
    return "";
  }

  var base = "";
  if (damageResult.before !== undefined && damageResult.after !== undefined) {
    base =
      "체력: " +
      damageResult.before +
      " → " +
      damageResult.after +
      " / " +
      damageResult.maxHp;
  } else if (damageResult.text) {
    base = String(damageResult.text).split("\n")[0];
  }

  return base;
}

function compactEffectText(effectText, fallbackText) {
  effectText = String(effectText || "").trim();

  if (!effectText) {
    return "";
  }

  return fallbackText || "효과 처리: 상세보기 참고";
}

function sectionTitle(title) {
  return "【" + title + "】";
}

function kv(label, value) {
  if (value === "" || value === null || value === undefined) return "";
  return label + ": " + value;
}

function joinLines(lines) {
  return lines
    .filter(line => line !== "" && line !== null && line !== undefined)
    .join("\n");
}

function compactSkillHeader(skillName, alias, type, rank, rankValue, finalValue) {
  return joinLines([
    sectionTitle("스킬"),
    skillName,
    kv("사용자", alias),
    kv("계열/랭크", type + " " + rank + "(" + rankValue + ")"),
    kv("최종값", finalValue)
  ]);
}

function compactAttackWaitText(pending, targetAlias) {
  const id = pending.id || pending["id"] || "";
  const target = targetAlias || pending.target || pending["대상"] || "";

  return joinLines([
    kv("공격번호", id),
    kv("대상", target),
    "대응: !대응 방어/회피/맞대응/무대응",
    "지정 대응: !대응 " + id + " 방어/회피/맞대응/무대응"
  ]);
}

function noneText(value) {
  value = String(value || "").trim();
  return value ? value : "-";
}

function summarizeEffectLine(line) {
  line = String(line || "").trim();
  if (!line) return "";

  const tokens = line.split(/\s+/);
  const command = tokens[0];

  if (command === "상태부여") {
    const target = tokens[1] || "대상";
    const statusName = tokens[2] || "상태";
    return target + "에게 " + statusName + " 부여";
  }

  if (command === "상태해제") {
    const target = tokens[1] || "대상";
    const statusName = tokens[2] || "상태";
    return target + "의 " + statusName + " 해제";
  }

  if (command === "스택증가") {
    const target = tokens[1] || "대상";
    const stackName = tokens[2] || "스택";
    const value = tokens[3] || "";
    return target + " " + stackName + " " + value;
  }

  if (command === "스택감소") {
    const target = tokens[1] || "대상";
    const stackName = tokens[2] || "스택";
    const value = tokens[3] || "";
    return target + " " + stackName + " " + value;
  }

  if (command === "스택설정") {
    const target = tokens[1] || "대상";
    const stackName = tokens[2] || "스택";
    const value = tokens[3] || "";
    return target + " " + stackName + " " + value;
  }

  return line;
}

function summarizeSkillEffects(effectText) {
  effectText = String(effectText || "").trim();

  if (!effectText) {
    return "없음";
  }

  const lines = effectText
    .split(/\n/)
    .map(l => l.trim())
    .filter(Boolean);

  const summaries = lines
    .map(summarizeEffectLine)
    .filter(Boolean);

  if (summaries.length === 0) {
    return "있음";
  }

  if (summaries.length <= 2) {
    return summaries.join(" / ");
  }

  return summaries.slice(0, 2).join(" / ") + " 외 " + (summaries.length - 2) + "개";
}

function formatSkillSummaryBlock(skill, alias, targetAlias, rank, rankValue, finalValue, effectSummary, pendingId) {
  const skillName = String(skill["스킬명"] || "").trim();
  const type = String(skill["계열"] || "").trim();
  const hasTarget = String(targetAlias || "").trim() !== "";

  let text =
    "【" + skillName + "】\n\n" +
    "사용자: " + noneText(alias) + "\n" +
    "대상: " + noneText(targetAlias) + "\n\n" +
    "계열/랭크: " + type + " " + rank + "(" + rankValue + ")\n" +
    "최종값: " + finalValue + "\n\n" +
    "효과: " + noneText(effectSummary);

  if (!hasTarget && String(effectSummary || "").includes("대상")) {
    text += "\n※ 대상 지정 효과는 대상 미지정 시 적용되지 않습니다.";
  }

  if (pendingId) {
    var _pids = String(pendingId).split(",").map(function(s) { return s.trim(); }).filter(Boolean);
    if (_pids.length === 1) {
      text +=
        "\n\n" +
        "공격번호: " + _pids[0] + "\n\n" +
        "대응: !대응 방어/회피/맞대응/무대응\n" +
        "지정 대응: !대응 " + _pids[0] + " 방어/회피/맞대응/무대응";
    } else {
      text += "\n\n공격번호: " + _pids.join(", ");
      text += "\n\n대응 (각 대상별):\n";
      text += _pids.map(function(pid) {
        return "  !대응 " + pid + " 방어/회피/맞대응/무대응";
      }).join("\n");
    }
  }

  return text;
}

function getSelfAlias(displayName) {
  const character = findCharacter(displayName);

  if (!character) {
    throw new Error("캐릭터를 찾을 수 없습니다.\n디스코드 별명: " + displayName);
  }

  return String(character["별명"]).trim();
}

function parseMaybeTarget(parts, displayName, startIndex) {
  const first = String(parts[startIndex] || "").trim();

  // 1) 캐릭터 별명이면 대상으로.
  if (first && findCharacterByAlias(first)) {
    return {
      targetAlias: first,
      nextIndex: startIndex + 1
    };
  }

  // 2) 에너미(ID/별명/이름)면 정규 별명으로 대상 지정 (상태 키 일관성 유지).
  if (first) {
    var enemyT = null;
    try { enemyT = resolveEnemy(first); } catch (_e) { /* 에너미 아님 */ }
    if (enemyT) {
      return {
        targetAlias: enemyCanonicalAlias(enemyT),
        nextIndex: startIndex + 1
      };
    }
  }

  // 3) 그 외 → 시전자 자신.
  return {
    targetAlias: getSelfAlias(displayName),
    nextIndex: startIndex
  };
}

function statusListCommand(parts, displayName) {
  let targetAlias = "";

  if (parts.length >= 2) {
    targetAlias = _resolveAliasFromTokens(parts, 1, 0).alias;
  } else {
    try {
      targetAlias = getSelfAlias(displayName);
    } catch (e) {
      return e.message;
    }
  }

  const rows = getActiveStatusRows(targetAlias);

  if (rows.length === 0) {
    return (
      "【상태 목록】\n\n" +
      "대상: " + targetAlias + "\n" +
      "ACTIVE 상태 없음."
    );
  }

  const lines = rows.map(r => {
    const chance = Number(r["확률"] || 0) + Number(r["누적확률"] || 0);
    const cap = Number(r["최대값"] || r["최대치"] || 0);
    const capPart = cap > 0 ? " / 최대 " + cap : "";

    return (
      "- " + r["상태명"] +
      " / " + r["분류"] +
      " / " + r["효과코드"] +
      " / 수치 " + (r["수치"] || 0) +
      capPart +
      " / 확률 " + chance + "%" +
      " / 판정 " + (r["대상판정"] || "전체") +
      " / 횟수 " + noneText(r["남은횟수"])
    );
  });

  return (
    "【상태 목록】\n\n" +
    "대상: " + targetAlias + "\n\n" +
    lines.join("\n")
  );
}

function statusAddCommand(parts, displayName) {
  if (parts.length < 4) {
    return (
      "사용법:\n" +
      "!상태부여 [대상] 상태명 분류 효과코드 [옵션]\n\n" +
      "예시:\n" +
      "!상태부여 테스트 출혈 지속피해 bleed 수치:5 확률:100 횟수:3 발동:판정시작 판정:액션,스킬 중복:허용\n" +
      "!상태부여 구속 행동방해 bind 확률:30 누적:0 증가:10 최대확률:90"
    );
  }

  let parsed;

  try {
    parsed = parseMaybeTarget(parts, displayName, 1);
  } catch (e) {
    return e.message;
  }

  const targetAlias = parsed.targetAlias;
  const i = parsed.nextIndex;

  if (parts.length < i + 3) {
    return "상태명 / 분류 / 효과코드를 입력하세요.";
  }

  const statusName = parts[i];
  const category = parts[i + 1];
  const effectCode = parts[i + 2];
  const opts = parseEffectOptions(parts.slice(i + 3));

  const text = addStatusToCharacter(targetAlias, statusName, category, effectCode, {
    value: readEffectNumber(opts["수치"], { finalValue: 0 }, 0),
    chance: readEffectNumber(opts["확률"], { finalValue: 0 }, 100),
    accum: readEffectNumber(opts["누적"], { finalValue: 0 }, 0),
    increase: readEffectNumber(opts["증가"], { finalValue: 0 }, 0),
    maxChance: readEffectNumber(opts["최대확률"], { finalValue: 0 }, 100),
    trigger: opts["발동"] || "판정시작",
    checkType: opts["판정"] || "전체",
    count: opts["횟수"] || "",
    stackMode: opts["중복"] || "허용",
    maxValue: _pickMaxOption(opts),
    source: "수동명령",
    memo: opts["메모"] || ""
  });

  return text;
}

function statusRemoveCommand(parts, displayName) {
  if (parts.length < 2) {
    return (
      "사용법:\n" +
      "!상태해제 [대상] 상태명\n\n" +
      "예시:\n" +
      "!상태해제 테스트 출혈\n" +
      "!상태해제 출혈"
    );
  }

  let parsed;

  try {
    parsed = parseMaybeTarget(parts, displayName, 1);
  } catch (e) {
    return e.message;
  }

  const targetAlias = parsed.targetAlias;
  const statusName = parts[parsed.nextIndex];

  if (!statusName) {
    return "해제할 상태명을 입력하세요.";
  }

  return removeStatusFromCharacter(targetAlias, statusName);
}

function stackListCommand(parts, displayName) {
  let targetAlias = "";

  if (parts.length >= 2) {
    targetAlias = _resolveAliasFromTokens(parts, 1, 0).alias;
  } else {
    try {
      targetAlias = getSelfAlias(displayName);
    } catch (e) {
      return e.message;
    }
  }

  const rows = getStackRows(targetAlias);

  if (rows.length === 0) {
    return (
      "【스택 목록】\n\n" +
      "대상: " + targetAlias + "\n" +
      "스택 없음."
    );
  }

  const lines = rows.map(r => {
    return (
      "- " + r["스택명"] +
      ": " + (r["수치"] || 0) +
      (r["최대치"] ? " / " + r["최대치"] : "")
    );
  });

  return (
    "【스택 목록】\n\n" +
    "대상: " + targetAlias + "\n\n" +
    lines.join("\n")
  );
}

function stackModifyCommand(parts, displayName) {
  if (parts.length < 3) {
    return (
      "사용법:\n" +
      "!스택 [대상] 스택명 +1 [최대:10]\n" +
      "!스택 [대상] 스택명 -1\n" +
      "!스택 [대상] 스택명 =5 [최대:10]\n\n" +
      "예시:\n" +
      "!스택 테스트 혈인 +1 최대:10\n" +
      "!스택 혈인 +1 최대:10"
    );
  }

  let parsed;

  try {
    parsed = parseMaybeTarget(parts, displayName, 1);
  } catch (e) {
    return e.message;
  }

  const targetAlias = parsed.targetAlias;
  const i = parsed.nextIndex;

  const stackName = parts[i];
  const change = parts[i + 1];

  if (!stackName || !change) {
    return "스택명과 변경값을 입력하세요.";
  }

  const opts = parseEffectOptions(parts.slice(i + 2));
  const maxValue = opts["최대"] || "";

  if (String(change).startsWith("=")) {
    const value = Number(String(change).replace(/^=/, ""));

    if (isNaN(value)) {
      return "스택 설정값이 숫자가 아닙니다: " + change;
    }

    return setStackValue(targetAlias, stackName, value, maxValue, "수동명령");
  }

  const delta = Number(String(change).replace(/^\+/, ""));

  if (isNaN(delta)) {
    return "스택 변경값이 숫자가 아닙니다: " + change;
  }

  return modifyStackValue(targetAlias, stackName, delta, maxValue, "수동명령");
}

function getStatusTemplateRows() {
  return getSheetData(SHEET_STATUS_TEMPLATE);
}

function findStatusTemplate(templateName) {
  const rows = getStatusTemplateRows();
  const name = String(templateName || "").trim();

  return rows.find(r => {
    return String(r["상태명"] || "").trim() === name;
  }) || null;
}

function statusTemplateListCommand(parts, displayName) {
  let rows;

  try {
    rows = getStatusTemplateRows();
  } catch (e) {
    return (
      "[상태 템플릿 오류]\n" +
      "STATUS_TEMPLATE 시트를 찾을 수 없습니다.\n\n" +
      "필요 헤더:\n" +
      "상태명 / 분류 / 효과코드 / 수치 / 확률 / 누적확률 / 증가확률 / 최대확률 / 발동타이밍 / 대상판정 / 남은횟수 / 중복방식 / 메모 / 설명"
    );
  }

  if (rows.length === 0) {
    return "【상태 템플릿 목록】\n\n등록된 상태 템플릿이 없습니다.";
  }

  const lines = rows.map(r => {
    return (
      "- " + r["상태명"] +
      " / " + r["분류"] +
      " / " + r["효과코드"] +
      " / 수치 " + noneText(r["수치"]) +
      " / 확률 " + noneText(r["확률"]) + "%"
    );
  });

  return (
    "【상태 템플릿 목록】\n\n" +
    lines.join("\n") + "\n\n" +
    "상세 보기:\n" +
    "!상태템플릿보기 구속\n\n" +
    "부여:\n" +
    "!상태템플릿부여 대상별명 구속"
  );
}

function statusTemplateShowCommand(parts, displayName) {
  if (parts.length < 2) {
    return (
      "사용법:\n" +
      "!상태템플릿보기 상태명\n\n" +
      "예시:\n" +
      "!상태템플릿보기 구속"
    );
  }

  const templateName = parts[1];
  const t = findStatusTemplate(templateName);

  if (!t) {
    return "상태 템플릿을 찾을 수 없습니다: " + templateName;
  }

  return (
    "【상태 템플릿】\n\n" +
    "상태명: " + t["상태명"] + "\n" +
    "분류: " + t["분류"] + "\n" +
    "효과코드: " + t["효과코드"] + "\n" +
    "수치: " + noneText(t["수치"]) + "\n" +
    "확률: " + noneText(t["확률"]) + "%\n" +
    "누적확률: " + noneText(t["누적확률"]) + "%\n" +
    "증가확률: " + noneText(t["증가확률"]) + "%\n" +
    "최대확률: " + noneText(t["최대확률"]) + "%\n" +
    "발동타이밍: " + noneText(t["발동타이밍"]) + "\n" +
    "대상판정: " + noneText(t["대상판정"]) + "\n" +
    "남은횟수: " + noneText(t["남은횟수"]) + "\n" +
    "중복방식: " + noneText(t["중복방식"]) + "\n" +
    "메모: " + noneText(t["메모"]) + "\n\n" +
    "설명:\n" +
    noneText(t["설명"])
  );
}

function resolveStatusTemplateApplyArgs(parts, displayName) {
  if (parts.length < 2) {
    throw new Error(
      "사용법:\n" +
      "!상태템플릿부여 [대상] 상태명 [옵션]\n\n" +
      "예시:\n" +
      "!상태템플릿부여 테스트 구속\n" +
      "!상태템플릿부여 구속\n" +
      "!상태템플릿부여 몬스터A 출혈 수치:8 횟수:3"
    );
  }

  const first = String(parts[1] || "").trim();
  const second = String(parts[2] || "").trim();

  // 1) 첫 번째 값이 템플릿명이면 대상 생략 → 사용자 자신
  const firstTemplate = findStatusTemplate(first);
  if (firstTemplate) {
    return {
      targetAlias: getSelfAlias(displayName),
      templateName: first,
      optionStartIndex: 2,
      template: firstTemplate
    };
  }

  // 2) 두 번째 값이 템플릿명이면 첫 번째 값은 대상.
  // 이 방식이면 BOT_DB에 없는 NPC/몬스터 이름도 대상명으로 쓸 수 있다.
  const secondTemplate = findStatusTemplate(second);
  if (secondTemplate) {
    return {
      targetAlias: first,
      templateName: second,
      optionStartIndex: 3,
      template: secondTemplate
    };
  }

  throw new Error(
    "상태 템플릿을 찾을 수 없습니다.\n" +
    "입력값: " + first + (second ? " / " + second : "") + "\n\n" +
    "템플릿 목록 확인:\n" +
    "!상태템플릿목록"
  );
}

function statusTemplateApplyCommand(parts, displayName) {
  let resolved;

  try {
    resolved = resolveStatusTemplateApplyArgs(parts, displayName);
  } catch (e) {
    return e.message;
  }

  const t = resolved.template;
  const targetAlias = _canonStatusTarget(resolved.targetAlias);
  const opts = parseEffectOptions(parts.slice(resolved.optionStartIndex));

  // 명령어 옵션이 있으면 템플릿 값보다 우선한다.
  const statusName = opts["상태명"] || t["상태명"];
  const category = opts["분류"] || t["분류"];
  const effectCode = opts["효과코드"] || t["효과코드"];

  const text = addStatusToCharacter(targetAlias, statusName, category, effectCode, {
    value: readEffectNumber(opts["수치"] || t["수치"], { finalValue: 0 }, 0),
    chance: readEffectNumber(opts["확률"] || t["확률"], { finalValue: 0 }, 100),
    accum: readEffectNumber(opts["누적"] || opts["누적확률"] || t["누적확률"], { finalValue: 0 }, 0),
    increase: readEffectNumber(opts["증가"] || opts["증가확률"] || t["증가확률"], { finalValue: 0 }, 0),
    maxChance: readEffectNumber(opts["최대확률"] || t["최대확률"], { finalValue: 0 }, 100),
    trigger: opts["발동"] || opts["발동타이밍"] || t["발동타이밍"] || "판정시작",
    checkType: opts["판정"] || opts["대상판정"] || t["대상판정"] || "전체",
    count: opts["횟수"] || opts["남은횟수"] || t["남은횟수"] || "",
    stackMode: opts["중복"] || opts["중복방식"] || t["중복방식"] || "허용",
    maxValue: _pickMaxOption(opts) || t["최대값"] || t["최대치"] || "",
    source: "상태템플릿:" + t["상태명"],
    memo: opts["메모"] || t["메모"] || ""
  });

  return (
    "【상태 템플릿 부여】\n\n" +
    "대상: " + targetAlias + "\n" +
    "템플릿: " + t["상태명"] + "\n\n" +
    text
  );
}

function statusMatchesAnyCheckType(status, checkTypes) {
  checkTypes = (checkTypes || []).map(v => String(v || "").trim()).filter(Boolean);

  const raw = String(status["대상판정"] || "전체").trim();

  if (!raw || raw === "전체") return true;

  const list = raw.split(/[,，、]/).map(s => s.trim()).filter(Boolean);

  return checkTypes.some(t => list.includes(t));
}

function getStatusValueModifier(alias, checkTypes) {
  const rows = getActiveStatusRows(alias);
  let delta = 0;
  // 곱셈 버프는 곱이 아니라 합산한다: 여러 배율을 모아 합(multSum)과 개수(multCount)로 반환.
  let multSum = 0;
  let multCount = 0;
  const logs = [];

  rows.forEach(status => {
    const category = String(status["분류"] || "").trim();
    const code = String(status["효과코드"] || "").trim();
    const name = String(status["상태명"] || "").trim();
    const trigger = String(status["발동타이밍"] || "").trim();

    if (trigger && trigger !== "판정시작" && trigger !== "판정계산전" && trigger !== "판정계산후" && trigger !== "전체") return;

    // 메모에 "소비:TYPE" 이 있으면 해당 판정 유형 발생 시 횟수 차감(적용 판정과 별도 설정 가능).
    const memo = String(status["메모"] || "").trim();
    const consumeTypeMatch = memo.match(/(?:^|;)\s*소비:([^\s;]+)/);
    const consumeType = consumeTypeMatch ? consumeTypeMatch[1] : null;

    const appliesHere = statusMatchesAnyCheckType(status, checkTypes);
    const consumesHere = consumeType
      ? checkTypes.some(function(t) { return consumeType.split(/[,，、]/).map(function(s) { return s.trim(); }).filter(Boolean).indexOf(t) >= 0; })
      : appliesHere;

    if (!appliesHere && !consumesHere) return;

    const rawCell = status["수치"];

    const isDebuff =
      code === "weaken" ||
      code === "debuff" ||
      code === "slow" ||
      code === "blind" ||
      code === "쇠약" ||
      name === "쇠약" ||
      name === "둔화" ||
      name === "실명" ||
      category === "약화" ||
      category === "쇠약";

    const isBuff =
      code === "enhance" ||
      code === "haste" ||
      code === "focus" ||
      code === "buff" ||
      code === "강화" ||
      code === "가속" ||
      name === "강화" ||
      name === "가속" ||
      name === "집중" ||
      category === "강화";

    // 쇠약강화 전용 분류이거나 효과코드/카테고리가 버프/디버프면 처리
    if (category !== "쇠약강화" && !isBuff && !isDebuff) return;

    if (appliesHere) {
      // 버프/디버프 값 적용
      if (_isMultValue(rawCell)) {
        const factor = _multFactor(rawCell);
        if (factor !== 1) {
          multSum += factor;
          multCount++;
          logs.push(
            "[상태 보정: " + name + "]\n" +
            "대상판정: " + (status["대상판정"] || "전체") + "\n" +
            "보정: ×" + factor
          );
        }
      } else {
        const rawValue = Math.floor(Number(rawCell || 0));
        if (rawValue !== 0) {
          let modValue = rawValue;
          if (isDebuff) modValue = -Math.abs(rawValue);
          else if (isBuff) modValue = Math.abs(rawValue);
          delta += modValue;
          logs.push(
            "[상태 보정: " + name + "]\n" +
            "대상판정: " + (status["대상판정"] || "전체") + "\n" +
            "보정: " + formatSigned(modValue)
          );
        }
      }
      if (consumesHere) consumeStatusCount(status);
    } else {
      // 적용 판정은 아니지만 소비 판정에 해당 → 횟수만 차감
      consumeStatusCount(status);
    }
  });

  return {
    delta: delta,
    multSum: multSum,
    multCount: multCount,
    text: logs.join("\n\n")
  };
}

function applyStatusModifierToValue(alias, value, checkTypes, targetAlias) {
  const modifier = getStatusValueModifier(alias, checkTypes);

  // 패시브(분류=판정보정) 보정도 합산.
  var passiveDelta     = 0;
  var passiveMultSum   = 0;
  var passiveMultCount = 0;
  var passiveText      = "";
  try {
    var character = findCharacterByAlias(alias);
    if (character) {
      var pm = getPassiveValueModifier(character, checkTypes, String(targetAlias || ""));
      passiveDelta     = pm.delta     || 0;
      passiveMultSum   = pm.multSum   || 0;
      passiveMultCount = pm.multCount || 0;
      passiveText      = pm.text      || "";
    }
  } catch (e) {
    // 패시브 시트 없거나 오류 → 무시.
  }

  const before = Math.floor(Number(value) || 0);
  const totalDelta = modifier.delta + passiveDelta;
  // 곱셈 버프(상태+패시브)는 서로 곱하지 않고 (배율-1)을 합산한다.
  //   배율 = 1 + Σ(곱버프ᵢ - 1)   예: ×1.5 + ×2.2 → 1 + 0.5 + 1.2 = ×2.7
  //   버프가 하나도 없으면 ×1.
  const multCount = (modifier.multCount || 0) + passiveMultCount;
  const multSum   = (modifier.multSum  || 0) + passiveMultSum;
  // 합산 시 부동소수 잡음 제거 (예: 1 + 0.5 + 1.2 = 2.7000000000000002 → 2.7)
  const combinedMult = Math.round((1 + (multSum - multCount)) * 1e6) / 1e6;
  // 정수보정(+N)은 곱셈 바깥에 더한다: 결과값 × 곱버프배율 + 정수보정합.
  // 이면침식 등 추가 배율은 호출부에서 이 결과(+장비)에 다시 곱한다.
  // 곱 보정은 반올림(내림 시 ×1.08 같은 소폭 버프가 작은 판정값에서 통째로 사라짐).
  const after = Math.round(before * combinedMult) + totalDelta;

  var combinedText = modifier.text || "";
  if (passiveText) combinedText = combinedText ? (combinedText + "\n\n" + passiveText) : passiveText;

  return {
    value: after,
    delta: totalDelta,
    mult: combinedMult,
    text: combinedText,
    before: before,
    after: after
  };
}

function formatCombatSummaryBlock(title, attack, responseName, responseValue, resultText, damage, effectSummary) {
  return (
    "【" + title + "】\n\n" +
    "공격번호: " + attack["id"] + "\n" +
    "공격자: " + attack["공격자"] + "\n" +
    "대상: " + attack["대상"] + "\n\n" +
    "공격값: " + attack["공격값"] + "\n" +
    (responseName ? responseName + ": " + responseValue + "\n" : "") +
    "결과: " + resultText + "\n" +
    "최종피해: " + damage +
    (effectSummary ? "\n\n효과: " + effectSummary : "")
  );
}

function responseDetailText(response) {
  if (!response) return "";
  return response.detailText || response.text || "";
}

// =====================================================================
// !fin — 극/세션 종료 (임시 상태/스택 정리)
// =====================================================================

var FIN_KEEP_KEYWORDS = ["영구", "장기", "유지", "세션유지"];
var FIN_KEEP_CATEGORIES = ["영구", "장기", "유지"];

function _finHasKeepKeyword(text) {
  var s = String(text == null ? "" : text);
  if (!s) return false;
  for (var i = 0; i < FIN_KEEP_KEYWORDS.length; i++) {
    if (s.indexOf(FIN_KEEP_KEYWORDS[i]) >= 0) return true;
  }
  return false;
}

function _finStatusShouldKeep(status) {
  var category = String(status["분류"] || "").trim();
  if (FIN_KEEP_CATEGORIES.indexOf(category) >= 0) return true;
  if (_finHasKeepKeyword(status["메모"])) return true;
  if (_finHasKeepKeyword(status["중복방식"])) return true;
  if (_finHasKeepKeyword(status["출처"])) return true;
  if (_finHasKeepKeyword(status["상태명"])) return true;
  return false;
}

function _finStackShouldKeep(stack) {
  var category = String(stack["분류"] || "").trim();
  if (FIN_KEEP_CATEGORIES.indexOf(category) >= 0) return true;
  if (_finHasKeepKeyword(stack["스택명"])) return true;
  if (_finHasKeepKeyword(stack["메모"])) return true;
  if (_finHasKeepKeyword(stack["출처"])) return true;
  return false;
}

function _finAppendMemo(oldMemo) {
  var base = String(oldMemo == null ? "" : oldMemo);
  var tag = "!fin으로 정리";
  if (base.indexOf(tag) >= 0) return base;
  return base ? (base + " | " + tag) : tag;
}

// aliasSet: {별명: true} 형태의 필터. 주면 해당 대상만 정리. 없으면 전체.
// BOT_DB의 현재체력을 최대체력으로 회복.
function _finRestoreHp(aliasSet) {
  var ss = _getSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_BOT_DB);
  if (!sheet) return { restored: 0, logs: [] };

  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return { restored: 0, logs: [] };

  var headers = values[0].map(function(h) { return String(h).trim(); });
  var idxAlias = headers.indexOf("별명");
  var idxMax   = headers.indexOf("최대체력");
  var idxCur   = headers.indexOf("현재체력");
  if (idxAlias < 0 || idxMax < 0 || idxCur < 0) return { restored: 0, logs: [] };

  var restored = 0;
  var logs = [];

  for (var r = 1; r < values.length; r++) {
    var alias = String(values[r][idxAlias] || "").trim();
    if (!alias) continue;
    if (aliasSet && !aliasSet[alias]) continue;

    var maxHp = Math.floor(Number(values[r][idxMax] || 0));
    var curHp = Math.floor(Number(values[r][idxCur] || 0));
    if (isNaN(maxHp) || maxHp <= 0) continue;
    if (curHp >= maxHp) continue;

    sheet.getRange(r + 1, idxCur + 1).setValue(maxHp);
    logs.push(alias + ": " + curHp + " → " + maxHp);
    restored++;
  }

  if (restored > 0) invalidateSheetCache(SHEET_BOT_DB);
  return { restored: restored, logs: logs };
}

// aliasSet: {별명: true} 형태의 필터. 주면 해당 대상만 정리. 없으면 전체.
function clearTemporaryStatuses(aliasSet) {
  var rows;
  try {
    rows = getSheetData(SHEET_STATUS_DB);
  } catch (e) {
    return { cleared: 0, kept: 0 };
  }

  var now = getNowText();
  var cleared = 0;
  var kept = 0;

  rows.forEach(function (r) {
    var state = String(r["상태"] || "").trim();
    if (state !== "ACTIVE") return;
    if (aliasSet && !aliasSet[String(r["대상"] || "").trim()]) return;

    if (_finStatusShouldKeep(r)) {
      kept++;
      return;
    }

    updateRowById(SHEET_STATUS_DB, "id", r["id"], {
      상태: "CLEARED",
      처리일: now,
      메모: _finAppendMemo(r["메모"])
    });
    cleared++;
  });

  return { cleared: cleared, kept: kept };
}

// aliasSet: {별명: true} 형태의 필터. 주면 해당 대상만 정리. 없으면 전체.
function clearTemporaryStacks(aliasSet) {
  var ss = _getSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_STACK_DB);
  if (!sheet) return { cleared: 0, kept: 0 };

  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return { cleared: 0, kept: 0 };

  var headers = values[0].map(function (h) { return String(h).trim(); });
  var idxValue = headers.indexOf("수치");
  var idxMemo = headers.indexOf("메모");
  var idxModified = headers.indexOf("수정일");
  var idxState = headers.indexOf("상태");
  var idxActive = headers.indexOf("활성");

  if (idxValue < 0) return { cleared: 0, kept: 0 };

  var now = getNowText();
  var cleared = 0;
  var kept = 0;

  for (var r = 1; r < values.length; r++) {
    var rowObj = {};
    headers.forEach(function (h, i) { rowObj[h] = values[r][i]; });

    var current = Number(rowObj["수치"] || 0);
    if (isNaN(current) || current <= 0) continue;
    if (aliasSet && !aliasSet[String(rowObj["대상"] || "").trim()]) continue;

    if (_finStackShouldKeep(rowObj)) {
      kept++;
      continue;
    }

    sheet.getRange(r + 1, idxValue + 1).setValue(0);
    if (idxModified >= 0) sheet.getRange(r + 1, idxModified + 1).setValue(now);
    if (idxMemo >= 0) {
      sheet.getRange(r + 1, idxMemo + 1).setValue(_finAppendMemo(rowObj["메모"]));
    }
    if (idxState >= 0) sheet.getRange(r + 1, idxState + 1).setValue("CLEARED");
    if (idxActive >= 0) sheet.getRange(r + 1, idxActive + 1).setValue(false);

    cleared++;
  }

  return { cleared: cleared, kept: kept };
}

function finishSession(parts, displayName) {
  var tokens = (parts || []).slice(1);
  var keepStatus = false;
  var keepStack = false;
  var noClear = false;
  var rest = [];

  tokens.forEach(function (t) {
    var s = String(t || "").trim();
    if (!s) return;
    if (s === "--keep-status") { keepStatus = true; return; }
    if (s === "--keep-stack")  { keepStack  = true; return; }
    if (s === "--no-clear")    { noClear    = true; return; }
    rest.push(s);
  });

  if (noClear) {
    keepStatus = true;
    keepStack = true;
  }

  // 비-플래그 토큰이 전부 캐릭터 별명으로 해석되면 → 그 캐릭터들만 초기화.
  //   (!fin 캐릭터1 캐릭터2 ...)
  // 토큰 없으면 → 명령어 친 사람(displayName)의 캐릭터만 초기화.
  // 하나라도 별명이 아니면 → 전체 토큰을 종료 메시지로 취급(기존 동작).
  var targetAliases = [];
  var aliasSet = null;
  if (rest.length > 0) {
    var resolved = rest.map(function (t) {
      var c = findCharacterByAlias(t);
      return c ? String(c["별명"] || t).trim() : null;
    });
    if (resolved.every(function (x) { return !!x; })) {
      aliasSet = {};
      resolved.forEach(function (a) { if (!aliasSet[a]) { aliasSet[a] = true; targetAliases.push(a); } });
    } else if (rest.length === 1) {
      // 캐릭터 별명이 아닌 단일 토큰 → 파티명으로 해산 시도
      var _partyRow = null;
      try { _partyRow = getPartyByName(rest[0]); } catch (_e) {}
      if (_partyRow) {
        var _partyMemberList = [];
        try { _partyMemberList = getPartyMembers(rest[0]); } catch (_e) {}
        dissolvePartyByName(rest[0]);
        return "[파티 해산]\n파티명: " + rest[0] + "\n" +
          "멤버: " + (_partyMemberList.length > 0 ? _partyMemberList.join(", ") : "없음");
      }
    }
  } else {
    // 인수 없이 !fin 사용 → 명령어 친 사람의 캐릭터만 초기화
    var selfChar = findCharacter(displayName);
    if (!selfChar) {
      return "캐릭터를 찾을 수 없습니다: " + displayName + "\n특정 캐릭터를 초기화하려면 !fin 캐릭터별명 으로 지정해 주세요.";
    }
    var selfAlias = String(selfChar["별명"] || "").trim();
    aliasSet = {};
    aliasSet[selfAlias] = true;
    targetAliases.push(selfAlias);
  }
  var targeted = !!aliasSet;

  var message = targeted ? "" : rest.join(" ").trim();
  if (!message) message = "...다음 시간에 계속.";

  // 세션종료 패시브 효과 — aliasSet이 지정된 경우 해당 캐릭터만, 없으면 전체
  var passiveLogs = [];
  try {
    var allChars = getSheetData(SHEET_BOT_DB);
    allChars.forEach(function (ch) {
      var aliasV = String(ch["별명"] || "").trim();
      if (!aliasV) return;
      if (aliasSet && !aliasSet[aliasV]) return;
      var out = firePassiveTriggerEffects(ch, "세션종료", { resistanceMode: RESIST_NONE });
      if (out) passiveLogs.push("[" + aliasV + "]\n" + out);
    });
  } catch (e) {
    // 패시브 시트 없거나 오류 → 무시.
  }

  var statusResult = keepStatus ? { cleared: 0, kept: 0 } : clearTemporaryStatuses(aliasSet);
  var stackResult  = keepStack  ? { cleared: 0, kept: 0 } : clearTemporaryStacks(aliasSet);
  var hpResult     = _finRestoreHp(aliasSet);

  // ── 접힌 요약: 종료 메시지만 ──
  var summaryLines = ["[극/세션 종료]"];
  if (targeted) summaryLines.push("대상: " + targetAliases.join(", "));
  summaryLines.push("");
  summaryLines.push(message);
  var summary = summaryLines.join("\n");

  // ── 상세: 정리 결과/옵션/패시브 ──
  var lines = [];
  lines.push("[극/세션 종료 상세]");
  lines.push(targeted
    ? "초기화 대상: " + targetAliases.join(", ") + " (" + targetAliases.length + "명)"
    : "초기화 범위: 전체 캐릭터");
  lines.push("");
  lines.push("정리 결과:");
  lines.push("상태 초기화: " + statusResult.cleared + "개");
  if (!keepStatus) lines.push("상태 유지: " + statusResult.kept + "개");
  lines.push("스택 초기화: " + stackResult.cleared + "개");
  if (!keepStack) lines.push("스택 유지: " + stackResult.kept + "개");
  lines.push("체력 회복: " + hpResult.restored + "명");
  if (hpResult.logs.length > 0) lines.push(hpResult.logs.join(", "));
  lines.push("");
  lines.push("옵션:");
  lines.push("상태 정리: " + (keepStatus ? "OFF" : "ON"));
  lines.push("스택 정리: " + (keepStack ? "OFF" : "ON"));
  lines.push("");
  lines.push("종료 시각: " + getNowText());
  if (displayName) lines.push("진행자: " + displayName);
  lines.push("");
  lines.push("다음 진행 시 필요한 상태/스택은 다시 부여해주세요.");

  if (passiveLogs.length > 0) {
    lines.push("");
    lines.push("[세션종료 패시브 효과]");
    lines.push(passiveLogs.join("\n\n"));
  }

  return makeFoldedResponse(summary, lines.join("\n"));
}

// =====================================================================
// PASSIVE SKILLS + 조건 평가 시스템
// =====================================================================

var PASSIVE_HEADERS = [
  "key","이름","소유타입","소유키","해금레벨","분류","효과코드",
  "수치","최대","발동","판정","조건","효과","설명","메모"
];

function ensurePassiveSheet() {
  var ss = _getSpreadsheet();
  var sh = ss.getSheetByName(SHEET_PASSIVE_SKILLS);
  if (sh) return sh;
  sh = ss.insertSheet(SHEET_PASSIVE_SKILLS);
  sh.getRange(1, 1, 1, PASSIVE_HEADERS.length).setValues([PASSIVE_HEADERS]);
  sh.setFrozenRows(1);
  return sh;
}

function getAllPassiveRows() {
  try {
    ensurePassiveSheet();
    return getSheetData(SHEET_PASSIVE_SKILLS);
  } catch (e) {
    return [];
  }
}

// 소유타입 정규화 — 한국어/영어 동시 지원, 알 수 없는 값은 "unknown".
function _normalizePassiveOwnerType(raw) {
  var s = String(raw == null ? "" : raw).trim().toLowerCase();
  if (!s) return "global";
  if (s === "global" || s === "공용" || s === "전역") return "global";
  if (s === "character" || s === "캐릭터" || s === "개인") return "character";
  if (s === "faction" || s === "소속" || s === "파벌") return "faction";
  if (s === "species" || s === "종족") return "species";
  if (s === "enemy" || s === "에너미" || s === "적") return "enemy";
  if (s === "template" || s === "템플릿" || s === "에너미템플릿") return "template";
  return "unknown";
}

// 에너미의 정규 별명 — 상태/스택/체력 키로 일관되게 사용 (alias → name → enemy_id 우선).
// STATUS_DB·STACK_DB는 이 문자열을 대상 키로 쓰므로 모든 경로에서 동일해야 한다.
function enemyCanonicalAlias(enemy) {
  if (!enemy) return "";
  return String(enemy["alias"] || enemy["name"] || enemy["enemy_id"] || "").trim();
}

// 에너미 행을 패시브/조건/효과 처리용 의사(疑似) 캐릭터 객체로 변환.
// buildFormulaVariables / firePassiveTriggerEffects 등이 캐릭터 객체를 기대하므로,
// 별명·체력·액션 수치를 캐릭터 필드명에 맞춰 매핑한다. __enemy 플래그로 후보 선별을 분기.
function enemyToPseudoCharacter(enemy) {
  if (!enemy) return null;
  var alias = enemyCanonicalAlias(enemy);
  var pseudo = {
    "별명": alias,
    "이름": String(enemy["name"] || alias),
    "종족": "",
    "소속": "",
    "최대체력": Math.floor(Number(enemy["max_hp"]) || 0),
    "현재체력": Math.floor(Number(enemy["current_hp"]) || 0),
    __enemy: true,
    __enemyRow: enemy
  };
  // 에너미 액션 수치(참격/방어/저항 …)를 직접 변수로 노출 — 조건/계산식에서 참조 가능.
  ENEMY_ACTION_FIELDS.forEach(function (f) {
    if (enemy[f] !== undefined && enemy[f] !== "") pseudo[f] = Math.floor(Number(enemy[f]) || 0);
  });
  return pseudo;
}

// 에너미 소유 패시브 후보(조건 평가 전). owner=enemy(enemy_id/별명 일치) 또는 template(template_key 일치).
// 캐릭터 전용 소유타입(global/character/faction/species)은 에너미에 적용하지 않는다.
function getCandidatePassivesForEnemy(enemy) {
  if (!enemy) return [];
  var rows = getAllPassiveRows();
  var id    = String(enemy["enemy_id"] || "").trim();
  var alias = normalizeEnemyRef(enemy["alias"]);
  var name  = normalizeEnemyRef(enemy["name"]);
  var tkey  = String(enemy["template_key"] || "").trim();

  return rows.filter(function (p) {
    var nm = String(p["이름"] || p["key"] || "").trim();
    if (!nm) return false;

    var owner = _normalizePassiveOwnerType(p["소유타입"]);
    var ownerKey = String(p["소유키"] || "").trim();

    if (owner === "enemy") {
      if (!ownerKey || ownerKey === "*") return true;
      var nk = normalizeEnemyRef(ownerKey);
      return ownerKey === id || (alias && nk === alias) || (name && nk === name);
    }
    if (owner === "template") {
      if (!ownerKey || ownerKey === "*") return false;
      return tkey && ownerKey === tkey;
    }
    return false;
  });
}

// 소유 엔티티(캐릭터/에너미)에 맞는 후보 패시브 목록을 반환.
function getCandidatePassivesForOwner(character) {
  if (character && character.__enemy) return getCandidatePassivesForEnemy(character.__enemyRow);
  return getCandidatePassivesForCharacter(character);
}

// 별명/ID로 캐릭터 또는 에너미를 해석해 (의사)캐릭터 객체를 반환. 우선순위: 캐릭터 → 에너미.
function _resolveCharLike(ref) {
  ref = String(ref || "").trim();
  if (!ref) return null;
  var c = findCharacterByAlias(ref);
  if (c) return c;
  try {
    var e = resolveEnemy(ref);
    if (e) return enemyToPseudoCharacter(e);
  } catch (_e) { /* 에너미도 아님 */ }
  return null;
}

// 소유타입/소유키/해금레벨로 필터링한 1차 후보(조건 평가 전).
function getCandidatePassivesForCharacter(character) {
  if (!character) return [];
  var rows = getAllPassiveRows();
  var alias = String(character["별명"] || "").trim();
  var faction = String(character["소속"] || "").trim();
  var species = String(character["종족"] || "").trim();
  var level;
  try { level = readCharacterLevel(character); } catch (_e) { level = 99; }

  return rows.filter(function (p) {
    var name = String(p["이름"] || p["key"] || "").trim();
    if (!name) return false;

    var owner = _normalizePassiveOwnerType(p["소유타입"]);
    var ownerKey = String(p["소유키"] || "").trim();

    if (owner === "unknown") return false;
    if (owner === "enemy" || owner === "template") return false;  // 에너미 전용 — 캐릭터엔 미적용
    if (owner === "character" && ownerKey && ownerKey !== alias) return false;
    if (owner === "faction" && ownerKey && ownerKey !== faction) return false;
    if (owner === "species" && ownerKey && ownerKey !== species) return false;
    // global: 모두 통과

    var unlock = Number(p["해금레벨"]);
    if (isNaN(unlock) || unlock < 0) unlock = 0;
    if (level < unlock) return false;

    return true;
  });
}

// ── 조건 파서 ────────────────────────────────────────────────────────
//
// 조건 텍스트 포맷:
//   필수 조건 — 일반 줄. 하나라도 실패하면 스킬 발동 차단.
//   세부 조건 — "세부:" 접두어로 시작. 발동 차단은 없으나 충족 시 판정값 보너스 적용.
//              형식: 세부: <조건> [+N 또는 -N]   (보너스 생략 시 +0)
//   HP 비율  — 현재체력비율, 대상현재체력비율 변수로 비교 가능.
//              예: 현재체력비율 <= 50
//
// parseConditionList → { required: string[], detail: {cond, bonus}[] }
// evaluateConditionList → { ok, failed, passed, plainText, detailMet, detailBonus }
// checkSkillConditions  → { blocked, text, headerText, detailBonus }

function _parseDetailLine(raw) {
  // "세부:" 접두어 제거 후 끝의 보너스/배율 추출.
  // 형식: +N/-N (덧셈) 또는 *N/×N (곱셈, 기본 1)
  var s = raw.replace(/^세부\s*[:：]\s*/i, "").trim();
  var bonus = 0;
  var mult  = 1;
  var mMult = s.match(/[*×](\d+(?:\.\d+)?)\s*$/);
  if (mMult) {
    mult = Number(mMult[1]);
    s = s.slice(0, s.length - mMult[0].length).trim();
  } else {
    var mAdd = s.match(/([+-]\d+(?:\.\d+)?)\s*$/);
    if (mAdd) {
      bonus = Number(mAdd[1]);
      s = s.slice(0, s.length - mAdd[0].length).trim();
    }
  }
  return { cond: s, bonus: bonus, mult: mult };
}

function parseConditionList(conditionText) {
  var s = String(conditionText == null ? "" : conditionText).trim();
  if (!s) return { required: [], detail: [] };

  // " / " is the PassiveMaker TSV newline substitute — treat as line break.
  s = s.replace(/\s*\/\s*/g, "\n");
  // "세부:" appearing mid-line (space-separated) — split before it.
  s = s.replace(/\s+(?=세부\s*[:：])/gi, "\n");

  var required = [];
  var detail   = [];

  s.split(/[,，\n\r]+/).forEach(function (raw) {
    raw = String(raw || "").trim();
    if (!raw) return;
    if (/^세부\s*[:：]/i.test(raw)) {
      detail.push(_parseDetailLine(raw));
    } else {
      required.push(raw);
    }
  });

  return { required: required, detail: detail };
}

// 비교 연산자 분리. 반환: {variable, op, value} 또는 null.
function _parseComparison(cond) {
  var m = cond.match(/^\s*([^!=<>\s][^!=<>]*?)\s*(>=|<=|==|!=|=|>|<)\s*(.+?)\s*$/);
  if (!m) return null;
  var v = m[1].trim();
  var op = m[2].trim();
  var rhs = m[3].trim();
  if (op === "=") op = "==";
  return { variable: v, op: op, value: rhs };
}

function _compareNumeric(a, op, b) {
  var x = Number(a);
  var y = Number(b);
  if (isNaN(x) || isNaN(y)) {
    if (op === "==") return String(a) === String(b);
    if (op === "!=") return String(a) !== String(b);
    return false;
  }
  switch (op) {
    case ">=": return x >= y;
    case "<=": return x <= y;
    case ">":  return x > y;
    case "<":  return x < y;
    case "==": return x === y;
    case "!=": return x !== y;
  }
  return false;
}

// 조건 평가용 context 빌더.
// rankValue=0으로 buildFormulaVariables 재사용 → 변수 이름 규칙 일치.
function buildConditionContext(character, targetAlias) {
  var ctx = {
    vars: {},
    hasTarget: !!targetAlias,
    self: character || null,
    targetAlias: targetAlias || ""
  };

  if (character) {
    try {
      ctx.vars = buildFormulaVariables(character, 0, targetAlias || "");
    } catch (e) {
      ctx.vars = {};
    }
  }

  return ctx;
}

// 단일 조건 평가.
function evaluateRecognizedCondition(rawCond, ctx) {
  var cond = String(rawCond || "").trim();
  if (!cond) return { recognized: true, ok: true, message: cond };

  ctx = ctx || { vars: {}, hasTarget: false };
  var vars = ctx.vars || {};

  // 부정 존재 조건: !상태:이름 / !대상상태:이름 / !스택:이름 / !대상스택:이름
  var negEx = cond.match(/^!\s*(상태|대상상태|스택|대상스택)\s*[:：]\s*(.+)$/);
  if (negEx) {
    var negKind = negEx[1];
    var negName = makeVarSafeName(negEx[2].trim());
    if (!negName) return { recognized: false, ok: true, message: cond };
    if (negKind === "상태")      return { recognized: true, ok: Number(vars["상태_" + negName + "_존재"] || 0) <= 0, message: cond };
    if (negKind === "대상상태")  {
      if (!ctx.hasTarget) return { recognized: true, ok: false, message: cond + " (대상 없음)" };
      return { recognized: true, ok: Number(vars["대상상태_" + negName + "_존재"] || 0) <= 0, message: cond };
    }
    if (negKind === "스택")      return { recognized: true, ok: Number(vars["스택_" + negName] || 0) <= 0, message: cond };
    if (negKind === "대상스택")  {
      if (!ctx.hasTarget) return { recognized: true, ok: false, message: cond + " (대상 없음)" };
      return { recognized: true, ok: Number(vars["대상스택_" + negName] || 0) <= 0, message: cond };
    }
  }

  // 존재 조건: 상태:이름 / 대상상태:이름 / 스택:이름 / 대상스택:이름
  var ex = cond.match(/^(상태|대상상태|스택|대상스택)\s*[:：]\s*(.+)$/);
  if (ex) {
    var kind = ex[1];
    var nm = makeVarSafeName(ex[2].trim());
    if (!nm) return { recognized: false, ok: true, message: cond };
    if (kind === "상태")      return { recognized: true, ok: Number(vars["상태_" + nm + "_존재"] || 0) > 0, message: cond };
    if (kind === "대상상태")  {
      if (!ctx.hasTarget) return { recognized: true, ok: false, message: cond + " (대상 없음)" };
      return { recognized: true, ok: Number(vars["대상상태_" + nm + "_존재"] || 0) > 0, message: cond };
    }
    if (kind === "스택")      return { recognized: true, ok: Number(vars["스택_" + nm] || 0) > 0, message: cond };
    if (kind === "대상스택")  {
      if (!ctx.hasTarget) return { recognized: true, ok: false, message: cond + " (대상 없음)" };
      return { recognized: true, ok: Number(vars["대상스택_" + nm] || 0) > 0, message: cond };
    }
  }

  // 비교식
  var cmp = _parseComparison(cond);
  if (cmp) {
    var varName = cmp.variable;
    // 대상 참조 변수가 있고 대상이 없으면 평가 불가 → 실패 처리.
    if (/^대상/.test(varName) && !ctx.hasTarget) {
      return { recognized: true, ok: false, message: cond + " (대상 조건을 확인할 수 없습니다)" };
    }
    // 변수가 vars에 없으면 산술식으로 평가 시도 (예: 상태_A_수치 + 상태_B_수치).
    // 평가 실패 시 0으로 fallback (기존 동작 유지).
    var lhs;
    if (varName in vars) {
      lhs = vars[varName];
    } else {
      try {
        var _exprResult = safeEvalFormula(varName, vars);
        lhs = (_exprResult && _exprResult.rawValue !== undefined) ? _exprResult.rawValue : 0;
      } catch (_e) {
        lhs = 0;
      }
    }
    // 우변도 변수명이면 치환 (예: 사용액션 == 상태접미_지정). 변수가 아니면 리터럴.
    // 문자열 비교는 _compareNumeric이 NaN일 때 String 비교로 자동 처리.
    var rhs = (cmp.value in vars) ? vars[cmp.value] : cmp.value;
    return { recognized: true, ok: _compareNumeric(lhs, cmp.op, rhs), message: cond };
  }

  return { recognized: false, ok: true, message: cond };
}

// 조건 목록 전체 평가.
// 반환: { ok, failed, passed, plainText, detailBonus, detailMet, detailMissed }
function evaluateConditionList(conditionText, ctx) {
  var parsed = parseConditionList(conditionText);
  var passed    = [];
  var failed    = [];
  var plainText = [];

  // ── 필수 조건 ──
  parsed.required.forEach(function (cond) {
    var r = evaluateRecognizedCondition(cond, ctx);
    if (!r.recognized) {
      plainText.push(r.message);
      return;
    }
    if (r.ok) passed.push(r.message);
    else failed.push(r.message);
  });

  // ── 세부 조건 ──
  var detailBonus  = 0;
  var detailMult   = 1;
  var detailMet    = [];
  var detailMissed = [];

  parsed.detail.forEach(function (item) {
    if (!item.cond) return;
    var r = evaluateRecognizedCondition(item.cond, ctx);
    if (!r.recognized) {
      plainText.push("[세부] " + item.cond);
      return;
    }
    if (r.ok) {
      detailBonus += item.bonus;
      detailMult  *= item.mult;
      detailMet.push({ cond: item.cond, bonus: item.bonus, mult: item.mult });
    } else {
      detailMissed.push({ cond: item.cond, bonus: item.bonus, mult: item.mult });
    }
  });

  return {
    ok:           failed.length === 0,
    failed:       failed,
    passed:       passed,
    plainText:    plainText,
    detailBonus:  detailBonus,
    detailMult:   detailMult,
    detailMet:    detailMet,
    detailMissed: detailMissed
  };
}

// ── 액티브 스킬 조건 검사 ────────────────────────────────────────────

// 반환:
//   { blocked: true,  text: "...", headerText: "",    detailBonus: 0 }  — 필수 조건 미충족
//   { blocked: false, text: "",    headerText: "...", detailBonus: N }  — 통과 + 세부 보너스
function checkSkillConditions(rawCondText, options) {
  options = options || {};
  var label       = options.label || "스킬";
  var name        = options.name  || "";
  var character   = options.character   || null;
  var targetAlias = options.targetAlias || "";

  var text = String(rawCondText || "").trim();
  if (!text) return { blocked: false, headerText: "", detailBonus: 0 };

  var ctx    = buildConditionContext(character, targetAlias);
  var result = evaluateConditionList(text, ctx);

  if (!result.ok) {
    var blockLines = [];
    blockLines.push("[" + label + " 사용 불가]");
    if (name) blockLines.push("스킬: " + name);
    blockLines.push("조건을 만족하지 못했습니다.");
    blockLines.push("");
    blockLines.push("실패:");
    result.failed.forEach(function (c) { blockLines.push("- " + c); });
    if (result.plainText.length > 0) {
      blockLines.push("");
      blockLines.push("수동 확인:");
      result.plainText.forEach(function (c) { blockLines.push("- " + c); });
    }
    return { blocked: true, text: blockLines.join("\n"), headerText: "", detailBonus: 0 };
  }

  var lines = [];
  var hasInfo = result.passed.length > 0 || result.plainText.length > 0 ||
                result.detailMet.length > 0 || result.detailMissed.length > 0;

  if (hasInfo) {
    lines.push("[조건 확인]");
    if (result.passed.length > 0) {
      lines.push("통과:");
      result.passed.forEach(function (c) { lines.push("- " + c); });
    }
    if (result.detailMet.length > 0) {
      if (lines.length > 1) lines.push("");
      lines.push("세부 충족:");
      result.detailMet.forEach(function (d) {
        lines.push("- " + d.cond + (d.bonus !== 0 ? " → " + formatSigned(d.bonus) : ""));
      });
      if (result.detailBonus !== 0) {
        lines.push("세부 보너스 합계: " + formatSigned(result.detailBonus));
      }
    }
    if (result.detailMissed.length > 0) {
      if (lines.length > 1) lines.push("");
      lines.push("세부 미충족:");
      result.detailMissed.forEach(function (d) {
        lines.push("- " + d.cond + (d.bonus !== 0 ? " (" + formatSigned(d.bonus) + " 미적용)" : ""));
      });
    }
    if (result.plainText.length > 0) {
      if (lines.length > 1) lines.push("");
      lines.push("수동 확인:");
      result.plainText.forEach(function (c) { lines.push("- " + c); });
    }
  }

  return {
    blocked:     false,
    text:        "",
    headerText:  lines.join("\n"),
    detailBonus: result.detailBonus || 0
  };
}

// ── 패시브 보정/효과 ─────────────────────────────────────────────────

function _passiveJudgmentMatches(passive, checkTypes) {
  var raw = String(passive["판정"] || "").trim();
  if (!raw || raw === "전체") return true;
  var list = raw.split(/[,，、]/).map(function (s) { return s.trim(); }).filter(Boolean);
  var ct = (checkTypes || []).map(function (t) { return String(t || "").trim(); }).filter(Boolean);
  return ct.some(function (t) { return list.indexOf(t) >= 0; });
}

// 판정계산전/항상 분류=판정보정 패시브 합산.
// 판정값 보정 패시브 합산.
// 분류=판정보정 또는 효과코드=판정보정 인 패시브를 처리.
// 세부 조건 보너스도 반영.
function getPassiveValueModifier(character, checkTypes, targetAlias) {
  if (!character) return { delta: 0, multSum: 0, multCount: 0, text: "" };
  var passives = getCandidatePassivesForCharacter(character);
  var ctx = buildConditionContext(character, String(targetAlias || ""));
  var delta = 0;
  // 곱셈 버프는 곱이 아니라 합산 (상태 버프와 동일 규칙).
  var multSum   = 0;
  var multCount = 0;
  var lines = [];

  passives.forEach(function (p) {
    var category   = String(p["분류"]    || "").trim();
    var effectCode = String(p["효과코드"] || "").trim();
    // 판정보정 패시브만 처리 (분류 또는 효과코드 중 하나가 "판정보정"이면 OK)
    if (category !== "판정보정" && effectCode !== "판정보정") return;

    var trigger = String(p["발동"] || "").trim();
    if (trigger && trigger !== "판정계산전" && trigger !== "항상" && trigger !== "전체") return;

    if (!_passiveJudgmentMatches(p, checkTypes)) return;

    var cond = evaluateConditionList(p["조건"], ctx);
    if (!cond.ok) return;

    var name   = p["이름"] || p["key"];

    // 효과 컬럼의 줄-효과(판정보정 [유형] = 값) 합산. 유형은 checkTypes와 매칭.
    // 단, 발동=항상/전체인 패시브는 firePassiveTriggerEffects(판정시작)에서 이미 효과가
    // 실행되어 STATUS를 생성하고, 그 STATUS가 getStatusValueModifier에서 처리된다.
    // 따라서 항상/전체 패시브의 효과 컬럼을 여기서 다시 직접 합산하면 이중 적용이 발생하므로 건너뜀.
    // 판정계산전 패시브는 트리거로 실행되지 않으므로(판정시작 트리거에 매칭 안 됨) 직접 합산이 필요.
    if (trigger === "판정계산전") {
      _collectPassiveEffectModifiers(p, ["판정보정"], ctx, checkTypes).forEach(function (m) {
        if (m.mode === 'mult') {
          if (m.value !== 1) { multSum += m.value; multCount++; lines.push("[패시브: " + name + "]\n판정 배율: ×" + m.value); }
        } else {
          var mv = Math.floor(m.value);
          if (mv) { delta += mv; lines.push("[패시브: " + name + "]\n보정: " + formatSigned(mv)); }
        }
      });
    }

    var parsed = _parsePassiveSuChi(p["수치"], ctx.vars);
    var dMult  = cond.detailMult  || 1;
    var dBonus = cond.detailBonus || 0;
    if (parsed.mode === 'mult') {
      var factor = parsed.value * dMult;
      if (factor !== 1) { multSum += factor; multCount++; lines.push("[패시브: " + name + "]\n판정 배율: ×" + factor); }
      if (dBonus) { delta += dBonus; }
    } else {
      var v = Math.floor(parsed.value * dMult) + dBonus;
      if (!v) return;
      delta += v;
      lines.push("[패시브: " + name + "]\n보정: " + formatSigned(v));
    }
  });

  return { delta: delta, multSum: multSum, multCount: multCount, text: lines.join("\n\n") };
}

// 트리거 기반 패시브 효과 실행. 1차 구현: 효과 필드가 있으면 processSkillEffects로 처리.
// 사용처: 판정시작 / 판정후 / 피해직전 / 피해후 / 세션종료 등.
// 패시브 발동타이밍 매칭.
//  - "항상"/"전체" → 모든 시점에 발동
//  - 정확히 같은 트리거 → 발동
//  - "트리거:인자" 형태(예: "액션사용후:은신") → base가 일치하고 인자가
//    현재 사용한 액션/스킬명(triggerArg)과 같을 때 발동.
//    인자는 콤마로 여러 개 지정 가능(OR): "액션사용후:참격,타격" → 참격 또는 타격.
// 파티 트리거 목록. 이 트리거들은 항상/전체 패시브를 발동시키지 않는다.
// (캐릭터 고유 패시브가 파티원 이벤트에 반응하는 버그 방지)
var _PARTY_TRIGGER_NAMES = ["파티피해시", "파티가해시", "파티회복시"];

function _passiveTriggerMatches(pTrigger, trigger, triggerArg) {
  pTrigger = String(pTrigger || "").trim();
  if (!pTrigger) return false;
  // 파티 트리거는 항상/전체를 허용하지 않음 — 명시적으로 파티 트리거를 지정한 패시브만 발동
  var isPartyTrigger = _PARTY_TRIGGER_NAMES.indexOf(trigger) >= 0;
  if (!isPartyTrigger && (pTrigger === "항상" || pTrigger === "전체")) return true;
  if (pTrigger === trigger) return true;

  var ci = pTrigger.indexOf(":");
  if (ci < 0) ci = pTrigger.indexOf("："); // 전각 콜론도 허용
  if (ci > 0) {
    var base = pTrigger.slice(0, ci).trim();
    var arg  = pTrigger.slice(ci + 1).trim();
    if (base === trigger && arg) {
      var ta = String(triggerArg || "").trim();
      var argList = arg.split(/[,，、]/).map(function (s) { return s.trim(); }).filter(Boolean);
      if (argList.indexOf(ta) >= 0) return true;
    }
  }
  return false;
}

function firePassiveTriggerEffects(character, trigger, ctxOpts) {
  if (!character) return "";
  ctxOpts = ctxOpts || {};
  var targetAlias = ctxOpts.targetAlias || "";
  var triggerArg = ctxOpts.triggerArg || "";
  var passives = getCandidatePassivesForOwner(character);
  var ctx = buildConditionContext(character, targetAlias);
  // 조건에서 방금 사용한 액션/스킬명을 참조할 수 있게 노출 (예: 사용액션 == 상태접미_지정)
  ctx.vars["사용액션"] = String(triggerArg || "");
  var alias = String(character["별명"] || "").trim();
  var logs = [];

  passives.forEach(function (p) {
    var pTrigger = String(p["발동"] || "").trim();
    if (!_passiveTriggerMatches(pTrigger, trigger, triggerArg)) return;

    var effectText = String(p["효과"] || "").trim();
    if (!effectText) return;

    var cond = evaluateConditionList(p["조건"], ctx);
    if (!cond.ok) return;

    try {
      var processed = processSkillEffects(effectText, {
        userAlias: alias,
        targetAlias: targetAlias,
        finalValue: Number(ctxOpts.finalValue || 0),
        usedAction: String(triggerArg || ""),  // 효과 줄 조건에서 사용액션 == 상태접미_X 비교 지원
        skillName: "패시브: " + (p["이름"] || p["key"]),
        skill: { 스킬명: p["이름"] || p["key"], 효과: effectText },
        resistanceMode: ctxOpts.resistanceMode || RESIST_NONE
      });
      if (processed) logs.push("[패시브 효과: " + (p["이름"] || p["key"]) + "]\n" + processed);
    } catch (e) {
      logs.push("[패시브 효과 오류: " + (p["이름"] || p["key"]) + "] " + e.message);
    }
  });

  return logs.join("\n\n");
}

// ── !패시브등록 ──────────────────────────────────────────────────────
// 멀티라인 "필드: 값" 형식을 PASSIVE_SKILLS 행으로 upsert(key 기준).
// 라벨(PASSIVE_HEADERS)로 시작하지 않는 줄은 직전 필드에 이어붙임 → 효과/설명 여러 줄 지원.
function passiveRegisterCommand(utterance, displayName) {
  var body = String(utterance || "").replace(/^\s*!패시브등록[ \t]*\r?\n?/, "");
  if (!body.trim()) {
    return "사용법: !패시브등록 (다음 줄부터 '필드: 값')\n\n" +
      "key: 고유키(공백 불가)\n이름: 표시 이름\n" +
      "소유타입: global|character|faction|species|enemy|template\n" +
      "소유키: (global이면 * 또는 생략, 그 외엔 대상 식별자)\n" +
      "해금레벨: 0\n분류: 판정보정|피해보정|회복보정|저항|트리거효과|기타\n" +
      "효과코드: 판정보정|상태부여|스택증가|… \n수치: \n최대: \n" +
      "발동: 항상|판정시작|액션사용후[:액션명,…]|피해후|가해후|… \n" +
      "판정: 전체\n조건: \n효과: (DSL, 여러 줄 가능)\n설명: (여러 줄 가능)\n메모: ";
  }

  var labels = PASSIVE_HEADERS; // ["key","이름",...,"메모"]
  var fields = {};
  var current = null;
  body.split(/\r?\n/).forEach(function (line) {
    var m = line.match(/^[ \t]*([^:：]+)[:：][ \t]?(.*)$/);
    if (m && labels.indexOf(m[1].trim()) >= 0) {
      current = m[1].trim();
      fields[current] = m[2];
    } else if (current !== null) {
      fields[current] += "\n" + line;  // 직전 필드의 이어지는 줄(효과/설명 멀티라인)
    }
  });

  function fv(k) { return (fields[k] === undefined ? "" : String(fields[k]).trim()); }

  var key       = fv("key");
  var name      = fv("이름");
  var ownerType = fv("소유타입") || "global";
  var ownerKey  = fv("소유키");

  if (!key)            return "[패시브 등록 오류] key는 필수입니다.";
  if (/\s/.test(key))  return "[패시브 등록 오류] key에 공백을 쓸 수 없습니다: " + key;
  if (!name)           return "[패시브 등록 오류] 이름은 필수입니다.";
  if (ownerType === "global" && !ownerKey) ownerKey = "*";
  if (ownerType !== "global" && !ownerKey) {
    return "[패시브 등록 오류] 소유타입이 '" + ownerType + "'이면 소유키가 필요합니다.";
  }

  ensurePassiveSheet();
  var row = {};
  labels.forEach(function (h) { row[h] = fv(h); });
  row["key"]     = key;
  row["이름"]    = name;
  row["소유타입"] = ownerType;
  row["소유키"]  = ownerKey;

  var mode = upsertRowByKey(SHEET_PASSIVE_SKILLS, "key", key, row);
  invalidateSheetCache(SHEET_PASSIVE_SKILLS);
  invalidateGameDataCache();

  return "[패시브 " + (mode === "updated" ? "갱신" : "등록") + "]\n" +
    "key: " + key + "\n이름: " + name + "\n" +
    "소유: " + ownerType + (ownerKey ? " / " + ownerKey : "") + "  Lv." + (fv("해금레벨") || "0") + "\n" +
    "분류: " + (fv("분류") || "-") + " / 효과코드: " + (fv("효과코드") || "-") + "\n" +
    "발동: " + (fv("발동") || "-") + "\n" +
    "효과: " + (fv("효과") || "(없음)");
}

// ── !패시브목록 명령어 ──────────────────────────────────────────────

// 에너미 패시브 목록 텍스트. 에너미는 레벨 개념이 없어 잠김 섹션이 없다.
function _enemyPassiveListText(enemy) {
  var pseudo = enemyToPseudoCharacter(enemy);
  var alias = String(pseudo["별명"] || "").trim();
  var rows = getCandidatePassivesForEnemy(enemy);
  var ctx = buildConditionContext(pseudo, "");

  var applied = [];
  var manual = [];
  var failed = [];

  rows.forEach(function (p) {
    var name = String(p["이름"] || p["key"] || "").trim();
    if (!name) return;
    var summary = name +
      (p["분류"] ? " / " + p["분류"] : "") +
      (Number(p["수치"]) ? " " + formatSigned(Number(p["수치"])) : "") +
      (p["판정"] ? " / 판정: " + p["판정"] : "");

    var cond = evaluateConditionList(p["조건"], ctx);
    if (!cond.ok) { failed.push(summary + "\n  실패: " + cond.failed.join(", ")); return; }
    if (cond.plainText.length > 0) { manual.push(summary + "\n  조건: " + cond.plainText.join(", ")); return; }
    applied.push(summary);
  });

  var lines = ["[에너미 패시브 목록]", "에너미: " + alias + " (" + enemy["enemy_id"] + ")"];
  if (enemy["template_key"]) lines.push("템플릿: " + enemy["template_key"]);
  lines.push("");

  function section(title, arr) {
    lines.push(title + ":");
    if (arr.length === 0) lines.push("- (없음)");
    else arr.forEach(function (s) { lines.push("- " + s); });
    lines.push("");
  }
  section("적용 중", applied);
  section("수동 확인", manual);
  section("조건 미충족", failed);

  return lines.join("\n").replace(/\n+$/, "");
}

function passiveListCommand(parts, displayName) {
  var targetAlias = "";
  if (parts && parts.length >= 2) {
    var r = _resolveAliasFromTokens(parts, 1, 0);
    targetAlias = r.alias;
  }
  var character = targetAlias ? findCharacterByAlias(targetAlias) : findCharacter(displayName);

  if (!character) {
    // 캐릭터가 아니면 에너미 패시브 목록을 시도.
    if (targetAlias) {
      var enemyForList = null;
      try { enemyForList = resolveEnemy(targetAlias); } catch (_e) { /* 에너미도 아님 */ }
      if (enemyForList) return _enemyPassiveListText(enemyForList);
    }
    return "캐릭터를 찾을 수 없습니다.\n" + (targetAlias || "디스코드 별명: " + displayName);
  }

  var alias = String(character["별명"] || "").trim();
  var level; try { level = readCharacterLevel(character); } catch (_e) { level = 99; }
  var faction = String(character["소속"] || "").trim();
  var species = String(character["종족"] || "").trim();
  var allRows = getAllPassiveRows();

  var applied = [];
  var manual = [];
  var locked = [];
  var failed = [];

  var ctx = buildConditionContext(character, "");

  allRows.forEach(function (p) {
    var name = String(p["이름"] || p["key"] || "").trim();
    if (!name) return;

    var owner = _normalizePassiveOwnerType(p["소유타입"]);
    var ownerKey = String(p["소유키"] || "").trim();

    var ownerMatch =
      (owner === "global") ||
      (owner === "character" && (!ownerKey || ownerKey === alias)) ||
      (owner === "faction"   && (!ownerKey || ownerKey === faction)) ||
      (owner === "species"   && (!ownerKey || ownerKey === species));
    if (!ownerMatch) return;

    var unlock = Number(p["해금레벨"]);
    if (isNaN(unlock) || unlock < 0) unlock = 0;

    var summary = "Lv." + unlock + " " + name +
      (p["분류"] ? " / " + p["분류"] : "") +
      (Number(p["수치"]) ? " " + formatSigned(Number(p["수치"])) : "") +
      (p["판정"] ? " / 판정: " + p["판정"] : "");

    if (level < unlock) { locked.push(summary); return; }

    var cond = evaluateConditionList(p["조건"], ctx);
    if (!cond.ok) {
      failed.push(summary + "\n  실패: " + cond.failed.join(", "));
      return;
    }
    if (cond.plainText.length > 0) {
      manual.push(summary + "\n  조건: " + cond.plainText.join(", "));
      return;
    }
    applied.push(summary);
  });

  var lines = [];
  lines.push("[패시브 목록]");
  lines.push("캐릭터: " + alias);
  if (faction) lines.push("소속: " + faction);
  if (species) lines.push("종족: " + species);
  lines.push("레벨: " + level);
  lines.push("");

  function section(title, arr) {
    lines.push(title + ":");
    if (arr.length === 0) lines.push("- (없음)");
    else arr.forEach(function (s) { lines.push("- " + s); });
    lines.push("");
  }
  section("적용 중", applied);
  section("수동 확인", manual);
  section("잠김", locked);
  section("조건 미충족", failed);

  return lines.join("\n").replace(/\n+$/, "");
}

// =====================================================================
// ENEMY SYSTEM v0.1
// =====================================================================

// ── Sheet setup ──────────────────────────────────────────────────────

function ensureEnemySheets() {
  const ss = _getSpreadsheet();

  if (!ss.getSheetByName(SHEET_ENEMY_TEMPLATES)) {
    const sh = ss.insertSheet(SHEET_ENEMY_TEMPLATES);
    const h = ["template_key", "name", "category", "threat", "max_hp"]
      .concat(ENEMY_ACTION_FIELDS)
      .concat(["rule", "signs", "memo"]);
    sh.getRange(1, 1, 1, h.length).setValues([h]);
  }

  if (!ss.getSheetByName(SHEET_ENEMIES)) {
    const sh = ss.insertSheet(SHEET_ENEMIES);
    const h = ["enemy_id", "alias", "template_key", "name", "category", "threat",
               "current_hp", "max_hp"]
      .concat(ENEMY_ACTION_FIELDS)
      .concat(["rule", "signs", "memo", "active", "created_at"]);
    sh.getRange(1, 1, 1, h.length).setValues([h]);
  }

  if (!ss.getSheetByName(SHEET_ENEMY_SKILLS)) {
    const sh = ss.insertSheet(SHEET_ENEMY_SKILLS);
    const h = ["skill_key", "owner_type", "owner_key", "name", "category",
               "rank", "formula", "effect", "target_mode", "memo"];
    sh.getRange(1, 1, 1, h.length).setValues([h]);
  }
}

// ── Core utilities ───────────────────────────────────────────────────

function normalizeEnemyRef(v) {
  return String(v || "").replace(/\s+/g, "").toLowerCase();
}

function getEnemyTemplates() {
  ensureEnemySheets();
  return getSheetData(SHEET_ENEMY_TEMPLATES);
}

function getActiveEnemies() {
  ensureEnemySheets();
  return getSheetData(SHEET_ENEMIES).filter(function(r) {
    const v = r["active"];
    if (v === true) return true;
    const s = String(v || "").trim().toLowerCase();
    return s === "true" || s === "1";
  });
}

function resolveEnemy(ref) {
  ensureEnemySheets();
  const enemies = getActiveEnemies();
  ref = String(ref || "").trim();
  const normRef = normalizeEnemyRef(ref);

  const byId = enemies.filter(function(e) {
    return String(e["enemy_id"]).trim() === ref;
  });
  if (byId.length === 1) return byId[0];
  if (byId.length > 1) throw new Error("에너미 지정이 애매합니다. ID로 지정해주세요: " + ref);

  const byAlias = enemies.filter(function(e) {
    return normalizeEnemyRef(e["alias"]) === normRef && normRef !== "";
  });
  if (byAlias.length === 1) return byAlias[0];
  if (byAlias.length > 1) throw new Error("에너미 지정이 애매합니다. ID로 지정해주세요: " + ref);

  const byName = enemies.filter(function(e) {
    return normalizeEnemyRef(e["name"]) === normRef;
  });
  if (byName.length === 1) return byName[0];
  if (byName.length > 1) throw new Error("에너미 지정이 애매합니다. ID로 지정해주세요: " + ref);

  throw new Error("에너미를 찾을 수 없습니다: " + ref);
}

function isEnemyRef(ref) {
  try {
    resolveEnemy(ref);
    return true;
  } catch(e) {
    return false;
  }
}

function updateEnemy(enemy_id, patch) {
  return updateRowById(SHEET_ENEMIES, "enemy_id", enemy_id, patch);
}

function rollEnemyAction(enemy, actionName, bonus) {
  const diceCount = Math.max(1, Math.floor(Number(enemy[actionName]) || 1));
  const rolls = rollDice(diceCount, ACTION_DICE_SIDES);
  let total = rolls.reduce(function(a, b) { return a + b; }, 0);
  bonus = Math.floor(Number(bonus) || 0);
  total += bonus;
  const bonusText = bonus !== 0 ? " " + formatSigned(bonus) : "";
  return {
    diceCount: diceCount,
    rolls: rolls,
    bonus: bonus,
    total: total,
    rollText: diceCount + "d6 [" + rolls.join(", ") + "]" + bonusText + " = " + total
  };
}

// 에너미 피해/회복 트리거 재진입 가드 (피해후 패시브가 또 자기에게 피해를 입혀 무한 재귀하는 것 방지).
var _ENEMY_HP_TRIGGER_ACTIVE = false;

function applyEnemyHpChange(enemy_id, delta, isHeal) {
  ensureEnemySheets();
  const ss = _getSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_ENEMIES);
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(function(h) { return String(h).trim(); });
  const idIdx    = headers.indexOf("enemy_id");
  const curIdx   = headers.indexOf("current_hp");
  const maxIdx   = headers.indexOf("max_hp");
  const aliasIdx = headers.indexOf("alias");
  const nameIdx  = headers.indexOf("name");

  for (let r = 1; r < values.length; r++) {
    if (String(values[r][idIdx]).trim() === String(enemy_id).trim()) {
      const before = Math.floor(Number(values[r][curIdx]) || 0);
      const maxHp  = Math.floor(Number(values[r][maxIdx]) || 0);
      const alias  = String((aliasIdx >= 0 ? values[r][aliasIdx] : "") ||
                            (nameIdx  >= 0 ? values[r][nameIdx]  : "") || enemy_id).trim();

      let amount = Math.abs(Math.floor(Number(delta) || 0));
      const passiveLogs = [];

      if (isHeal) {
        // 회복보정 패시브 + 상태 보정
        const ph = _applyPassiveHealingModifier(alias, amount);
        amount = ph.amount;
        const sh = _applyStatusHealingModifier(alias, amount);
        amount = sh.amount;
        passiveLogs.push.apply(passiveLogs, ph.logs.concat(sh.logs));
      } else {
        // 취약 → 피해보정 패시브 → 피해보정 상태 → 보호막 → 장비 (캐릭터와 동일 파이프라인)
        const pre = processPreDamageStatuses(alias, amount);
        amount = pre.damage;
        if (pre.text) passiveLogs.push(pre.text);

        // 피해직전 패시브 트리거 (HP 반영 전).
        if (!_ENEMY_HP_TRIGGER_ACTIVE) {
          _ENEMY_HP_TRIGGER_ACTIVE = true;
          try {
            const pseudoPre = enemyToPseudoCharacter(resolveEnemy(enemy_id));
            if (pseudoPre) {
              const preText = firePassiveTriggerEffects(pseudoPre, "피해직전", {
                resistanceMode: RESIST_NONE, finalValue: amount
              });
              if (preText) passiveLogs.push(preText);
            }
          } catch (_e) { /* 무시 */ }
          finally { _ENEMY_HP_TRIGGER_ACTIVE = false; }
        }
      }

      const after = isHeal
        ? Math.min(maxHp, before + amount)
        : Math.max(0, before - amount);
      sheet.getRange(r + 1, curIdx + 1).setValue(after);
      invalidateSheetCache(SHEET_ENEMIES);

      // 피해후 / 회복후 패시브 트리거 (재진입 가드).
      let triggerText = "";
      if (!_ENEMY_HP_TRIGGER_ACTIVE) {
        _ENEMY_HP_TRIGGER_ACTIVE = true;
        try {
          const pseudo = enemyToPseudoCharacter(resolveEnemy(enemy_id));
          if (pseudo) {
            triggerText = firePassiveTriggerEffects(pseudo, isHeal ? "회복후" : "피해후", {
              resistanceMode: RESIST_NONE, finalValue: amount
            });
          }
        } catch (_e) { /* 패시브 시트 없거나 오류 → 무시 */ }
        finally { _ENEMY_HP_TRIGGER_ACTIVE = false; }
      }
      if (triggerText) passiveLogs.push(triggerText);

      const passiveText = passiveLogs.filter(Boolean).join("\n\n");
      return { ok: true, before: before, after: after, maxHp: maxHp,
               damage: amount, passiveText: passiveText };
    }
  }
  return { ok: false, before: 0, after: 0, maxHp: 0, damage: 0, passiveText: "" };
}

// applyEnemyHpChange 결과의 패시브 로그를 출력에 덧붙이기 위한 헬퍼.
function _enemyPassiveBlock(result) {
  return (result && result.passiveText) ? "\n\n" + result.passiveText : "";
}

function applyDamageToRef(ref, damage, opts) {
  opts = opts || {};
  var enemy = null;
  try { enemy = resolveEnemy(ref); } catch(e) {}

  if (enemy) {
    const result = applyEnemyHpChange(enemy["enemy_id"], damage, false);
    const label  = enemy["alias"] || enemy["name"];
    if (!result.ok) {
      return { ok: false, text: "[에너미 피해 오류]\n에너미를 찾을 수 없습니다: " + ref };
    }
    const downText = (result.after <= 0 && result.before > 0)
      ? "\n\n[에너미 전투불능]\n" + label + "의 체력이 0이 되었습니다."
      : "";

    // 공격 해결 시 공격자(PC/에너미) 쪽 트리거 — 공격해결후(피해 0 포함) + 가해후(피해>0).
    var dealtBlock = "";
    var attackerAlias = String(opts.attackerAlias || "").trim();
    if (attackerAlias && !_DEALT_TRIGGER_ACTIVE) {
      _DEALT_TRIGGER_ACTIVE = true;
      try {
        var dealerChar = _resolveCharLike(attackerAlias);
        if (dealerChar) {
          var _argName = String(opts.sourceName || "").trim();
          var _parts = [];
          var _resolvedText = firePassiveTriggerEffects(dealerChar, "공격해결후", {
            targetAlias: label, finalValue: damage, triggerArg: _argName, resistanceMode: RESIST_NONE
          });
          if (_resolvedText) _parts.push(_resolvedText);
          if (damage > 0) {
            var dealtText = firePassiveTriggerEffects(dealerChar, "가해후", {
              targetAlias: label, finalValue: damage, triggerArg: _argName, resistanceMode: RESIST_NONE
            });
            if (dealtText) _parts.push(dealtText);
          }
          if (_parts.length) dealtBlock = "\n\n[공격 후 패시브: " + attackerAlias + "]\n" + _parts.join("\n\n");
        }
      } catch (_e) { /* 무시 */ }
      finally { _DEALT_TRIGGER_ACTIVE = false; }
    }

    return {
      ok: true,
      before: result.before,
      after:  result.after,
      maxHp:  result.maxHp,
      damage: damage,
      text:
        "[에너미 피해]\n" +
        "대상: " + label + "\n" +
        "피해: " + damage + "\n" +
        "체력: " + result.before + " → " + result.after + " / " + result.maxHp +
        _enemyPassiveBlock(result) + downText + dealtBlock
    };
  }

  return applyDamageToCharacter(ref, damage, opts);
}

// applyDamageToRef의 회복 대칭 버전. ref가 에너미면 applyEnemyHpChange, PC면 applyHealingToCharacter.
function applyHealingToRef(ref, amount) {
  var enemy = null;
  try { enemy = resolveEnemy(ref); } catch(e) {}

  if (enemy) {
    const result = applyEnemyHpChange(enemy["enemy_id"], amount, true);
    const label  = enemy["alias"] || enemy["name"];
    return {
      ok: true,
      before: result.before,
      after:  result.after,
      maxHp:  result.maxHp,
      text:
        "[회복 적용]\n" +
        "대상: " + label + "\n" +
        "회복량: " + amount + "\n" +
        "체력: " + result.before + " → " + result.after + " / " + result.maxHp +
        _enemyPassiveBlock(result)
    };
  }

  return applyHealingToCharacter(ref, amount);
}

// ── Pending attack helpers ────────────────────────────────────────────

function createPendingAttackFlex(attackerRef, targetRef, attackKind, attackName, attackValue) {
  ensureEnemySheets();

  var enemy = null;
  try { enemy = resolveEnemy(targetRef); } catch(e) {}

  if (!enemy) {
    return createPendingAttack(attackerRef, targetRef, attackKind, attackName, attackValue);
  }

  const id             = makeAttackId();
  const now            = getNowText();
  const canonicalId    = enemy["enemy_id"];
  const targetDisplay  = enemy["alias"] || enemy["name"];

  appendRowByHeaders(SHEET_COMBAT_PENDING, {
    id:       id,
    상태:     "PENDING",
    공격자:   attackerRef,
    대상:     canonicalId,
    공격종류: attackKind,
    공격명:   attackName,
    공격값:   Math.floor(Number(attackValue) || 0),
    생성일:   now,
    처리일:   "",
    대응종류: "",
    대응값:   "",
    최종피해: "",
    메모:     "TARGET_TYPE:ENEMY"
  });

  return {
    ok:            true,
    id:            id,
    attacker:      attackerRef,
    target:        canonicalId,
    targetDisplay: targetDisplay,
    attackKind:    attackKind,
    attackName:    attackName,
    attackValue:   Math.floor(Number(attackValue) || 0),
    isEnemyTarget: true,
    메모:          "TARGET_TYPE:ENEMY"
  };
}

function makeCombatChoiceTextFlex(attack) {
  const memo = String(attack["메모"] || attack.memo || "");
  if (memo.indexOf("TARGET_TYPE:ENEMY") < 0) {
    return makeCombatChoiceText(attack);
  }

  const id          = attack.id          || attack["id"]    || "";
  const attacker    = attack.attacker    || attack["공격자"] || "";
  const target      = attack.targetDisplay || attack.target || attack["대상"] || "";
  const attackName  = attack.attackName  || attack["공격명"] || "";
  const attackValue = attack.attackValue !== undefined
    ? attack.attackValue
    : (attack["공격값"] || "");

  return (
    "[에너미 대응 대기]\n" +
    "공격번호: " + id        + "\n" +
    "공격자: "  + attacker   + "\n" +
    "대상: "    + target     + "\n\n" +
    "공격: "    + attackName + "\n" +
    "공격값: "  + attackValue + "\n\n" +
    "대응: !에너미대응 " + target + " 방어/회피/맞대응/무대응\n" +
    "지정 대응: !에너미대응 " + target + " " + id + " 방어/회피/맞대응/무대응"
  );
}

function findLatestPendingAttackForEnemy(ref) {
  ensureEnemySheets();
  var enemy;
  try { enemy = resolveEnemy(ref); } catch(e) {
    throw new Error("에너미를 찾을 수 없습니다: " + ref);
  }
  const enemyId = enemy["enemy_id"];
  const rows    = getSheetData(SHEET_COMBAT_PENDING);

  for (let i = rows.length - 1; i >= 0; i--) {
    const r = rows[i];
    if (String(r["상태"]).trim() === "PENDING" &&
        String(r["대상"]).trim() === enemyId) {
      return r;
    }
  }
  return null;
}

// ── Command: !에너미불러오기 ─────────────────────────────────────────

function enemyLoad(parts, displayName, utterance) {
  ensureEnemySheets();

  if (parts.length < 2) {
    return (
      "사용법: !에너미불러오기 <template_key 또는 이름> [별명:별명]\n" +
      "예시: !에너미불러오기 골목괴이\n" +
      "      !에너미불러오기 골목괴이 별명:A조"
    );
  }

  const templateRef = parts[1];
  var alias = "";

  for (let i = 2; i < parts.length; i++) {
    const t = String(parts[i] || "").trim();
    if (t.startsWith("별명:") || t.startsWith("별명=")) {
      alias = t.replace(/^별명[:=]/, "").trim();
    }
  }

  const templates = getEnemyTemplates();
  var tpl = templates.find(function(r) {
    return String(r["template_key"]).trim() === templateRef;
  });
  if (!tpl) {
    tpl = templates.find(function(r) {
      return normalizeEnemyRef(r["name"]) === normalizeEnemyRef(templateRef);
    });
  }

  if (!tpl) {
    return (
      "[에너미 불러오기 실패]\n" +
      "ENEMY_TEMPLATES에서 찾을 수 없습니다: " + templateRef + "\n\n" +
      "!에너미목록 으로 등록된 에너미를 확인하세요."
    );
  }

  const baseName = String(tpl["name"] || tpl["template_key"]).trim();

  if (!alias) {
    const sameNameCount = getActiveEnemies().filter(function(e) {
      return normalizeEnemyRef(e["name"]) === normalizeEnemyRef(baseName);
    }).length;
    alias = sameNameCount > 0 ? baseName + "-" + (sameNameCount + 1) : baseName;
  }

  const dupAlias = getActiveEnemies().find(function(e) {
    return normalizeEnemyRef(e["alias"]) === normalizeEnemyRef(alias);
  });
  if (dupAlias) {
    return "[에너미 불러오기 실패]\n별명이 이미 사용 중입니다: " + alias;
  }

  const id    = makeId("E", SHEET_ENEMIES);
  const now   = getNowText();
  const maxHp = Math.floor(Number(tpl["max_hp"]) || 0);

  const row = {
    enemy_id:     id,
    alias:        alias,
    template_key: String(tpl["template_key"] || "").trim(),
    name:         baseName,
    category:     String(tpl["category"]     || "").trim(),
    threat:       String(tpl["threat"]       || "").trim(),
    current_hp:   maxHp,
    max_hp:       maxHp,
    rule:         String(tpl["rule"]         || "").trim(),
    signs:        String(tpl["signs"]        || "").trim(),
    memo:         String(tpl["memo"]         || "").trim(),
    active:       "true",
    created_at:   now
  };

  ENEMY_ACTION_FIELDS.forEach(function(a) {
    row[a] = (tpl[a] !== undefined && tpl[a] !== "") ? tpl[a] : 0;
  });

  appendRowByHeaders(SHEET_ENEMIES, row);

  return (
    "[에너미 생성]\n" +
    "ID: "    + id                        + "\n" +
    "별명: "  + alias                     + "\n" +
    "이름: "  + row.name                  + "\n" +
    "분류: "  + (row.category || "—")     + "\n" +
    "위험도: " + (row.threat  || "—")    + "\n" +
    "체력: "  + maxHp + " / " + maxHp
  );
}

// ── Command: !에너미목록 ─────────────────────────────────────────────

function enemyList(displayName) {
  ensureEnemySheets();
  const enemies = getActiveEnemies();

  if (enemies.length === 0) {
    return "[에너미 목록]\n현재 활성 에너미가 없습니다.";
  }

  const lines = enemies.map(function(e) {
    const hp    = Math.floor(Number(e["current_hp"]) || 0);
    const maxHp = Math.floor(Number(e["max_hp"])     || 0);
    return (
      e["enemy_id"] + " / " +
      (e["alias"] || "—") + " / " +
      e["name"] +
      " / HP " + hp + "/" + maxHp
    );
  });

  return "[에너미 목록]\n" + lines.join("\n");
}

// ── Command: !에너미정보 ─────────────────────────────────────────────

function enemyInfo(parts, displayName) {
  ensureEnemySheets();

  if (parts.length < 2) {
    return "사용법: !에너미정보 <에너미 ID/별명/이름>";
  }

  var enemy;
  try { enemy = resolveEnemy(parts[1]); } catch(e) {
    return "[에너미 정보 오류]\n" + e.message;
  }

  const hp    = Math.floor(Number(enemy["current_hp"]) || 0);
  const maxHp = Math.floor(Number(enemy["max_hp"])     || 0);

  const actionLines = ENEMY_ACTION_FIELDS.map(function(a) {
    return a + ":" + Math.floor(Number(enemy[a]) || 0) + "d6";
  }).join("  ");

  return (
    "[에너미 정보]\n" +
    "ID: "   + enemy["enemy_id"]            + "\n" +
    "별명: " + (enemy["alias"] || "—")      + "\n" +
    "이름: " + enemy["name"]                + "\n" +
    "분류: " + (enemy["category"] || "—")   + "\n" +
    "위험도: " + (enemy["threat"] || "—")   + "\n" +
    "체력: " + hp + " / " + maxHp           + "\n\n" +
    actionLines +
    (enemy["rule"]  ? "\n\n규칙: " + enemy["rule"]  : "") +
    (enemy["signs"] ? "\n징표: "   + enemy["signs"] : "") +
    (enemy["memo"]  ? "\n메모: "   + enemy["memo"]  : "")
  );
}

// ── Command: !에너미삭제 ─────────────────────────────────────────────

function enemyDelete(parts, displayName) {
  ensureEnemySheets();

  if (parts.length < 2) {
    return "사용법: !에너미삭제 <에너미 ID/별명/이름>";
  }

  var enemy;
  try { enemy = resolveEnemy(parts[1]); } catch(e) {
    return "[에너미 삭제 오류]\n" + e.message;
  }

  updateEnemy(enemy["enemy_id"], { active: "false" });

  return (
    "[에너미 비활성화]\n" +
    "ID: "   + enemy["enemy_id"]       + "\n" +
    "별명: " + (enemy["alias"] || "—") + "\n" +
    "이름: " + enemy["name"]
  );
}

// ── Command: !에너미피해 ─────────────────────────────────────────────

function enemyDamage(parts, displayName) {
  ensureEnemySheets();

  if (parts.length < 3) {
    return "사용법: !에너미피해 <에너미 ID/별명/이름> <수치>";
  }

  var enemy;
  try { enemy = resolveEnemy(parts[1]); } catch(e) {
    return "[에너미 피해 오류]\n" + e.message;
  }

  const amount = Math.max(0, Math.floor(Number(parts[2]) || 0));
  const result = applyEnemyHpChange(enemy["enemy_id"], amount, false);

  return (
    "[에너미 피해]\n" +
    "대상: " + (enemy["alias"] || enemy["name"]) + "\n" +
    "피해: " + amount + "\n" +
    "체력: " + result.before + " → " + result.after + " / " + result.maxHp +
    _enemyPassiveBlock(result) +
    (result.after <= 0 && result.before > 0 ? "\n\n[에너미 전투불능]\n체력이 0이 되었습니다." : "")
  );
}

// ── Command: !에너미회복 ─────────────────────────────────────────────

function enemyHeal(parts, displayName) {
  ensureEnemySheets();

  if (parts.length < 3) {
    return "사용법: !에너미회복 <에너미 ID/별명/이름> <수치>";
  }

  var enemy;
  try { enemy = resolveEnemy(parts[1]); } catch(e) {
    return "[에너미 회복 오류]\n" + e.message;
  }

  const amount = Math.max(0, Math.floor(Number(parts[2]) || 0));
  const result = applyEnemyHpChange(enemy["enemy_id"], amount, true);

  return (
    "[에너미 회복]\n" +
    "대상: " + (enemy["alias"] || enemy["name"]) + "\n" +
    "회복: " + amount + "\n" +
    "체력: " + result.before + " → " + result.after + " / " + result.maxHp +
    _enemyPassiveBlock(result)
  );
}

// ── Command: !에너미별명 ─────────────────────────────────────────────

function enemyRename(parts, displayName) {
  ensureEnemySheets();

  if (parts.length < 3) {
    return "사용법: !에너미별명 <에너미 ID/별명/이름> <새별명>";
  }

  var enemy;
  try { enemy = resolveEnemy(parts[1]); } catch(e) {
    return "[에너미 별명 오류]\n" + e.message;
  }

  const newAlias = String(parts[2] || "").trim();
  if (!newAlias) return "[에너미 별명 오류]\n새 별명을 입력하세요.";

  const dup = getActiveEnemies().find(function(e) {
    return e["enemy_id"] !== enemy["enemy_id"] &&
           normalizeEnemyRef(e["alias"]) === normalizeEnemyRef(newAlias);
  });
  if (dup) return "[에너미 별명 오류]\n별명이 이미 사용 중입니다: " + newAlias;

  const oldAlias = String(enemy["alias"] || "—");
  updateEnemy(enemy["enemy_id"], { alias: newAlias });

  return (
    "[에너미 별명 변경]\n" +
    "ID: "        + enemy["enemy_id"] + "\n" +
    "이전 별명: " + oldAlias          + "\n" +
    "새 별명: "   + newAlias
  );
}

// ── Command: !에너미공격 ─────────────────────────────────────────────

function enemyAttack(parts, displayName, utterance) {
  ensureEnemySheets();

  if (parts.length < 3) {
    return (
      "사용법: !에너미공격 <에너미 ID/별명> <액션명> [대상:캐릭터별명] [보정]\n" +
      "예시: !에너미공격 골목괴이 참격 대상:월하륜\n" +
      "      !에너미공격 E-0001 사격 대상:아르 +2"
    );
  }

  var enemy;
  try { enemy = resolveEnemy(parts[1]); } catch(e) {
    return "[에너미 공격 오류]\n" + e.message;
  }

  const actionName = String(parts[2] || "").trim();
  if (!ENEMY_ACTION_FIELDS.includes(actionName)) {
    return (
      "[에너미 공격 오류]\n" +
      "알 수 없는 액션: " + actionName + "\n" +
      "사용 가능: " + ENEMY_ACTION_FIELDS.join(", ")
    );
  }

  const diceCount = Math.floor(Number(enemy[actionName]) || 0);
  if (diceCount <= 0) {
    return (
      "[에너미 공격 오류]\n" +
      (enemy["alias"] || enemy["name"]) + "의 " + actionName + " 수치가 0입니다."
    );
  }

  var targetAlias = "";
  var bonus = 0;

  parts.slice(3).forEach(function(t) {
    t = String(t || "").trim();
    if (t.startsWith("대상:") || t.startsWith("대상=")) {
      targetAlias = t.replace(/^대상[:=]/, "").trim();
    } else if (/^[+\-]?\d+$/.test(t)) {
      bonus += Number(t);
    }
  });

  const enemyAlias   = enemyCanonicalAlias(enemy);
  const statusResult = processStatusBeforeCheck(enemyAlias, [KIND_ACTION, actionName]);
  const enemyLabel   = enemy["alias"] || enemy["name"];

  if (statusResult.blocked) {
    return (
      "[에너미 행동 불가]\n" +
      "공격자: " + enemyLabel + " (" + enemy["enemy_id"] + ")\n" +
      "액션: " + actionName + "\n\n" +
      (statusResult.text || "상태이상으로 행동이 저지됐습니다.")
    );
  }

  const result    = rollEnemyAction(enemy, actionName, bonus);

  var combatText = "";

  if (targetAlias) {
    const pcTarget = findCharacterByAlias(targetAlias);
    if (!pcTarget) {
      combatText = "\n\n대상 캐릭터를 찾을 수 없습니다: " + targetAlias;
    } else {
      const attackName = actionName + "(" + enemyLabel + ")";
      const pending = createPendingAttack(
        enemy["enemy_id"],
        targetAlias,
        KIND_ENEMY_ACTION,
        attackName,
        result.total
      );
      if (pending.ok) {
        combatText = "\n\n" + makeCombatChoiceText(pending);
      } else {
        combatText = "\n\n" + pending.text;
      }
    }
  }

  return (
    (statusResult.text ? statusResult.text + "\n\n" : "") +
    "[에너미 공격]\n" +
    "공격자: " + enemyLabel  + " (" + enemy["enemy_id"] + ")\n" +
    "액션: "   + actionName  + "\n" +
    "굴림: "   + result.rollText +
    combatText
  );
}

// ── Command: !에너미대응 ─────────────────────────────────────────────

// ── TASK-14: 에너미 대응 모드별 헬퍼 ──────────────────────────────────
// 적이 PC 공격에 대응 완료한 뒤, 공격자(PC) 쪽 트리거 발동.
//  - 공격해결후: 피해 0 포함 항상 (성공/실패 판정 + 다음 지령 등)
//  - 가해후    : 실제 피해 > 0 일 때만
// 적 피해는 applyEnemyHpChange로 직접 처리돼 applyDamageToRef를 안 타므로, 여기서 별도 발동.
// triggerArg=공격명(=액션명), finalValue=최종피해. 공격자가 PC/에너미가 아니면 스킵.
function _fireAttackerResolvedOnEnemy(attack, damage) {
  try {
    var attackerAlias = String((attack && attack["공격자"]) || "").trim();
    if (!attackerAlias || _DEALT_TRIGGER_ACTIVE) return "";
    var dealer = _resolveCharLike(attackerAlias);  // 공격자가 PC 또는 에너미
    if (!dealer) return "";
    _DEALT_TRIGGER_ACTIVE = true;
    try {
      var argName = String(attack["공격명"] || "").trim();
      var dmg = Math.max(0, Number(damage) || 0);
      var parts = [];
      var resolved = firePassiveTriggerEffects(dealer, "공격해결후", {
        targetAlias: "", finalValue: dmg, triggerArg: argName, resistanceMode: RESIST_NONE
      });
      if (resolved) parts.push(resolved);
      if (dmg > 0) {
        var dealt = firePassiveTriggerEffects(dealer, "가해후", {
          targetAlias: "", finalValue: dmg, triggerArg: argName, resistanceMode: RESIST_NONE
        });
        if (dealt) parts.push(dealt);
      }
      return parts.length ? "\n\n[공격 후 패시브: " + attackerAlias + "]\n" + parts.join("\n\n") : "";
    } finally { _DEALT_TRIGGER_ACTIVE = false; }
  } catch (_e) { return ""; }
}

function _resolveEnemyStatusBlocked(enemy, attack, attackValue, statusResult) {
  const result    = applyEnemyHpChange(enemy["enemy_id"], attackValue, false);
  const effectOut = applyPendingAttackEffectIfHit(attack, attackValue, enemy["enemy_id"]);
  resolvePendingAttack(attack["id"], {
    대응종류: "상태이상으로 대응불가", 대응값: 0, 최종피해: attackValue,
    메모: "상태이상으로 에너미 대응 행동 저지. 무대응 처리"
  });
  return (
    (statusResult.text ? statusResult.text + "\n\n" : "") +
    "[에너미 대응 불가]\n" +
    "상태이상으로 대응하지 못했습니다.\n" +
    "공격번호: " + attack["id"] + "\n공격값: " + attackValue + "\n최종피해: " + attackValue + "\n" +
    "체력: " + result.before + " → " + result.after + " / " + result.maxHp +
    _enemyPassiveBlock(result) +
    (result.after <= 0 && result.before > 0 ? "\n\n[에너미 전투불능]" : "") + effectOut +
    _fireAttackerResolvedOnEnemy(attack, attackValue)
  );
}

function _resolveEnemyNoResponse(enemy, attack, attackValue) {
  const result    = applyEnemyHpChange(enemy["enemy_id"], attackValue, false);
  const effectOut = applyPendingAttackEffectIfHit(attack, attackValue, enemy["enemy_id"]);
  resolvePendingAttack(attack["id"], { 대응종류: "무대응", 대응값: 0, 최종피해: attackValue, 메모: "에너미 무대응. 피해 전부 적용" });
  return (
    "[에너미 무대응]\n" +
    "공격번호: " + attack["id"] + "\n공격값: " + attackValue + "\n최종피해: " + attackValue + "\n" +
    "체력: " + result.before + " → " + result.after + " / " + result.maxHp +
    _enemyPassiveBlock(result) +
    (result.after <= 0 && result.before > 0 ? "\n\n[에너미 전투불능]" : "") + effectOut +
    _fireAttackerResolvedOnEnemy(attack, attackValue)
  );
}

function _resolveEnemyDefend(enemy, attack, attackValue) {
  const defDice = Math.floor(Number(enemy["방어"]) || 0);
  if (defDice <= 0) return "[에너미 대응 오류]\n방어 수치가 0입니다. 무대응 또는 회피를 사용하세요.";

  const defRoll  = rollEnemyAction(enemy, "방어", 0);
  const damage   = Math.max(0, attackValue - defRoll.total);
  const success  = damage <= 0;
  const result   = damage > 0
    ? applyEnemyHpChange(enemy["enemy_id"], damage, false)
    : { before: Math.floor(Number(enemy["current_hp"]) || 0),
        after:  Math.floor(Number(enemy["current_hp"]) || 0),
        maxHp:  Math.floor(Number(enemy["max_hp"])     || 0) };
  const effectOut = success ? "" : applyPendingAttackEffectIfHit(attack, damage, enemy["enemy_id"]);

  resolvePendingAttack(attack["id"], { 대응종류: "방어", 대응값: defRoll.total, 최종피해: damage, 메모: success ? "에너미 방어 성공" : "에너미 방어 실패" });
  return (
    "[에너미 방어]\n공격번호: " + attack["id"] + "\n공격값: " + attackValue + "\n" +
    "방어 굴림: " + defRoll.rollText + "\n결과: " + (success ? "방어 성공" : "방어 실패") + "\n최종피해: " + damage + "\n" +
    (damage > 0 ? "체력: " + result.before + " → " + result.after + " / " + result.maxHp : "피해 없음") +
    _enemyPassiveBlock(result) +
    (result.after <= 0 && result.before > 0 ? "\n\n[에너미 전투불능]" : "") + effectOut +
    _fireAttackerResolvedOnEnemy(attack, damage)
  );
}

function _resolveEnemyEvade(enemy, attack, attackValue) {
  const evDice = Math.floor(Number(enemy["회피"]) || 0);
  if (evDice <= 0) return "[에너미 대응 오류]\n회피 수치가 0입니다. 무대응 또는 방어를 사용하세요.";

  const evRoll  = rollEnemyAction(enemy, "회피", 0);
  const success = evRoll.total >= attackValue;
  const damage  = success ? 0 : attackValue;
  const result  = damage > 0
    ? applyEnemyHpChange(enemy["enemy_id"], damage, false)
    : { before: Math.floor(Number(enemy["current_hp"]) || 0),
        after:  Math.floor(Number(enemy["current_hp"]) || 0),
        maxHp:  Math.floor(Number(enemy["max_hp"])     || 0) };
  const effectOut = success ? "" : applyPendingAttackEffectIfHit(attack, damage, enemy["enemy_id"]);

  resolvePendingAttack(attack["id"], { 대응종류: "회피", 대응값: evRoll.total, 최종피해: damage, 메모: success ? "에너미 회피 성공" : "에너미 회피 실패" });
  return (
    "[에너미 회피]\n공격번호: " + attack["id"] + "\n공격값: " + attackValue + "\n" +
    "회피 굴림: " + evRoll.rollText + "\n결과: " + (success ? "회피 성공" : "회피 실패") + "\n최종피해: " + damage + "\n" +
    (damage > 0 ? "체력: " + result.before + " → " + result.after + " / " + result.maxHp : "피해 없음") +
    _enemyPassiveBlock(result) +
    (result.after <= 0 && result.before > 0 ? "\n\n[에너미 전투불능]" : "") + effectOut +
    _fireAttackerResolvedOnEnemy(attack, damage)
  );
}

function _resolveEnemyCounter(enemy, attack, attackValue, attackerRef, counterActionName) {
  const ctrDice = Math.floor(Number(enemy[counterActionName]) || 0);
  if (ctrDice <= 0) return "[에너미 대응 오류]\n" + counterActionName + " 수치가 0입니다.";

  const ctrRoll  = rollEnemyAction(enemy, counterActionName, 0);
  const ctrValue = ctrRoll.total;
  const header   = "[에너미 맞대응]\n공격번호: " + attack["id"] + "\n공격값: " + attackValue + "\n맞대응 굴림: " + ctrRoll.rollText + "\n";

  if (ctrValue > attackValue) {
    const damageResult = applyDamageToRef(attackerRef, ctrValue);
    resolvePendingAttack(attack["id"], { 대응종류: "맞대응", 대응값: ctrValue, 최종피해: ctrValue, 메모: "에너미 맞대응 성공. 공격자에게 반격 피해" });
    // 공격자의 공격은 적에게 피해 0(맞대응당함) → 공격해결후 발동(실패).
    return header + "결과: 에너미 맞대응 성공\n반격피해: " + ctrValue + "\n\n" + damageResult.text +
      _fireAttackerResolvedOnEnemy(attack, 0);
  }

  if (ctrValue < attackValue) {
    const result      = applyEnemyHpChange(enemy["enemy_id"], attackValue, false);
    const effectOut   = applyPendingAttackEffectIfHit(attack, attackValue, enemy["enemy_id"]);
    resolvePendingAttack(attack["id"], { 대응종류: "맞대응", 대응값: ctrValue, 최종피해: attackValue, 메모: "에너미 맞대응 실패. 에너미에게 피해" });
    return header + "결과: 에너미 맞대응 실패\n최종피해: " + attackValue + "\n" +
      "체력: " + result.before + " → " + result.after + " / " + result.maxHp +
      _enemyPassiveBlock(result) +
      (result.after <= 0 && result.before > 0 ? "\n\n[에너미 전투불능]" : "") + effectOut +
      _fireAttackerResolvedOnEnemy(attack, attackValue);
  }

  resolvePendingAttack(attack["id"], { 대응종류: "맞대응", 대응값: ctrValue, 최종피해: 0, 메모: "에너미 맞대응 동률. 상쇄" });
  return header + "결과: 동률 / 상쇄\n최종피해: 0" + _fireAttackerResolvedOnEnemy(attack, 0);
}

// ── enemyRespond 본체 — 파싱 + 모드 라우팅 ───────────────────────────
function enemyRespond(parts, displayName) {
  ensureEnemySheets();

  if (parts.length < 3) {
    return (
      "사용법: !에너미대응 <에너미 ID/별명> <대응방식> [액션명(맞대응 시)]\n" +
      "또는:   !에너미대응 <에너미 ID/별명> <공격번호> <대응방식> [액션명]\n\n" +
      "대응방식: 방어 / 회피 / 무대응 / 맞대응"
    );
  }

  var enemy;
  try { enemy = resolveEnemy(parts[1]); } catch(e) {
    return "[에너미 대응 오류]\n" + e.message;
  }

  var index = 2;
  var attackId = "";
  if (/^ATK-\d+/i.test(String(parts[index] || ""))) { attackId = parts[index]; index++; }

  const mode = String(parts[index] || "").trim();
  const rest = parts.slice(index + 1);
  if (!mode) return "[에너미 대응 오류]\n대응 방식을 입력하세요: 방어 / 회피 / 무대응 / 맞대응";

  var attack;
  try {
    attack = attackId ? findPendingAttackById(attackId) : findLatestPendingAttackForEnemy(parts[1]);
  } catch(e) {
    return "[에너미 대응 오류]\n" + e.message;
  }

  if (!attack) {
    return (
      "[에너미 대응 오류]\n" +
      (enemy["alias"] || enemy["name"]) + "을(를) 대상으로 한 미처리 공격이 없습니다.\n" +
      "공격번호로 지정: !에너미대응 " + parts[1] + " ATK-0001 방어"
    );
  }

  const attackValue = Math.floor(Number(attack["공격값"]) || 0);
  const attackerRef = String(attack["공격자"]).trim();

  if (mode === "무대응") return _resolveEnemyNoResponse(enemy, attack, attackValue);

  const enemyRespondAlias   = enemyCanonicalAlias(enemy);
  const respondStatusResult = processStatusBeforeCheck(enemyRespondAlias, KIND_RESPONSE);
  if (respondStatusResult.blocked) return _resolveEnemyStatusBlocked(enemy, attack, attackValue, respondStatusResult);

  if (mode === "방어")   return _resolveEnemyDefend    (enemy, attack, attackValue);
  if (mode === "회피")   return _resolveEnemyEvade     (enemy, attack, attackValue);

  if (mode === "맞대응") {
    const counterActionName = String(rest[0] || "").trim();
    if (!counterActionName || !ENEMY_ACTION_FIELDS.includes(counterActionName)) {
      return (
        "[에너미 맞대응 오류]\n맞대응에 사용할 액션명을 입력하세요.\n" +
        "예: !에너미대응 " + parts[1] + " 맞대응 참격\n" +
        "사용 가능: " + ENEMY_ACTION_FIELDS.join(", ")
      );
    }
    return _resolveEnemyCounter(enemy, attack, attackValue, attackerRef, counterActionName);
  }

  return "[에너미 대응 오류]\n알 수 없는 대응 방식: " + mode + "\n방어 / 회피 / 무대응 / 맞대응 액션명";
}

// ── End of Enemy System v0.1 ─────────────────────────────────────────

// =====================================================================
// ENEMY SYSTEM v0.2
// =====================================================================

// ── Skill sheet utilities ─────────────────────────────────────────────

function getEnemySkills() {
  ensureEnemySheets();
  return getSheetData(SHEET_ENEMY_SKILLS);
}

function getAvailableEnemySkills(enemy) {
  const skills      = getEnemySkills();
  const enemyId     = String(enemy["enemy_id"]     || "").trim();
  const templateKey = String(enemy["template_key"] || "").trim();

  return skills.filter(function(s) {
    const ownerType = String(s["owner_type"] || "").trim().toLowerCase();
    const ownerKey  = String(s["owner_key"]  || "").trim();

    if (ownerType === "global") return true;
    if (ownerType === "enemy"    && ownerKey === enemyId)                          return true;
    if (ownerType === "template" && templateKey && ownerKey === templateKey)       return true;
    return false;
  });
}

function resolveEnemySkill(enemy, skillRef) {
  const available = getAvailableEnemySkills(enemy);
  skillRef = String(skillRef || "").trim();

  const byKey = available.filter(function(s) {
    return String(s["skill_key"]).trim() === skillRef;
  });
  if (byKey.length === 1) return byKey[0];
  if (byKey.length > 1)   throw new Error("스킬 지정이 애매합니다: " + skillRef);

  const byName = available.filter(function(s) {
    return String(s["name"]).trim() === skillRef;
  });
  if (byName.length === 1) return byName[0];
  if (byName.length > 1)   throw new Error("스킬 지정이 애매합니다: " + skillRef);

  throw new Error("사용 가능한 스킬을 찾을 수 없습니다: " + skillRef);
}

// ── Formula evaluation ────────────────────────────────────────────────

function evaluateEnemySkillFormula(formula, rankValue) {
  var expr = String(formula || "랭크").trim();
  expr = expr.replace(/랭크/g, String(rankValue));

  var expanded;
  try {
    expanded = expandDiceNotationInFormula(expr);
  } catch(e) {
    throw new Error("계산식 오류: " + formula + " → " + e.message);
  }

  var total;
  try {
    // eval is safe here: formula is GM-authored spreadsheet data
    total = Math.floor(eval(expanded.expression)); // eslint-disable-line no-eval
  } catch(e) {
    throw new Error("계산식 평가 오류: " + expanded.expression + " → " + e.message);
  }

  return {
    total:    total,
    diceLogs: expanded.diceLogs,
    original: formula
  };
}

function rollEnemySkill(enemy, skill, bonus) {
  const rank = String(skill["rank"] || "E").trim().toUpperCase();
  var rankValue;
  try { rankValue = rankToValue(rank); } catch(e) { rankValue = 10; }

  bonus = Math.floor(Number(bonus) || 0);

  const ev    = evaluateEnemySkillFormula(String(skill["formula"] || "랭크"), rankValue);
  const total = ev.total + bonus;

  return {
    rank:      rank,
    rankValue: rankValue,
    base:      ev.total,
    total:     total,
    diceLogs:  ev.diceLogs,
    bonus:     bonus
  };
}

// ── Key-value parser for !에너미생성 ─────────────────────────────────

var ENEMY_CREATE_KNOWN_KEYS = [
  "이름", "별명", "분류", "위험도", "체력",
  "참격", "관통", "타격", "격투", "사격",
  "방어", "회피", "저항", "조사", "해석", "은신", "추적", "설득",
  "규칙", "징후", "메모"
];

function parseKeyValueArgs(text) {
  return parseKeyValueArgsWithKeys(text, ENEMY_CREATE_KNOWN_KEYS);
}

// ── Command: !에너미생성 ─────────────────────────────────────────────

function enemyCreate(utterance, displayName) {
  ensureEnemySheets();

  const rawArgs = String(utterance || "").replace(/^!에너미생성\s*/, "").trim();

  if (!rawArgs) {
    return (
      "사용법: !에너미생성 이름:<이름> 체력:<체력> [별명:<별명>] [분류:<분류>] [위험도:<위험도>]\n" +
      "         [참격:<n>] [관통:<n>] ... [규칙:<텍스트>] [징후:<텍스트>] [메모:<텍스트>]\n\n" +
      "예시:\n!에너미생성 이름:골목괴이 별명:A조 분류:괴이 위험도:2 체력:50 참격:5 방어:3 회피:4"
    );
  }

  const args = parseKeyValueArgs(rawArgs);

  const name = String(args["이름"] || "").trim();
  const hpRaw = String(args["체력"] || "").trim();

  if (!name) {
    return "[에너미 생성 실패]\n이름은 필수 항목입니다.\n이름:<이름> 을 포함해주세요.";
  }
  if (!hpRaw || isNaN(Number(hpRaw))) {
    return "[에너미 생성 실패]\n체력은 필수 항목입니다.\n체력:<숫자> 를 포함해주세요.";
  }

  const maxHp = Math.max(0, Math.floor(Number(hpRaw)));

  var alias = String(args["별명"] || "").trim();
  if (!alias) {
    const sameNameCount = getActiveEnemies().filter(function(e) {
      return normalizeEnemyRef(e["name"]) === normalizeEnemyRef(name);
    }).length;
    alias = sameNameCount > 0 ? name + "-" + (sameNameCount + 1) : name;
  }

  const dupAlias = getActiveEnemies().find(function(e) {
    return normalizeEnemyRef(e["alias"]) === normalizeEnemyRef(alias);
  });
  if (dupAlias) {
    return "[에너미 생성 실패]\n별명이 이미 사용 중입니다: " + alias;
  }

  const id  = makeId("E", SHEET_ENEMIES);
  const now = getNowText();

  const row = {
    enemy_id:     id,
    alias:        alias,
    template_key: "manual",
    name:         name,
    category:     String(args["분류"]   || "").trim(),
    threat:       String(args["위험도"] || "").trim(),
    current_hp:   maxHp,
    max_hp:       maxHp,
    rule:         String(args["규칙"]   || "").trim(),
    signs:        String(args["징후"]   || "").trim(),
    memo:         String(args["메모"]   || "").trim(),
    active:       "true",
    created_at:   now
  };

  ENEMY_ACTION_FIELDS.forEach(function(a) {
    const v = args[a];
    row[a] = (v !== undefined && v !== "") ? Math.max(0, Math.floor(Number(v) || 0)) : 0;
  });

  appendRowByHeaders(SHEET_ENEMIES, row);

  return (
    "[에너미 생성]\n" +
    "ID: "       + id                        + "\n" +
    "별명: "     + alias                     + "\n" +
    "이름: "     + name                      + "\n" +
    "분류: "     + (row.category || "—")     + "\n" +
    "위험도: "   + (row.threat   || "—")     + "\n" +
    "체력: "     + maxHp + " / " + maxHp     + "\n" +
    "생성 방식: 수동"
  );
}

// ── Command: !에너미스킬목록 ─────────────────────────────────────────

function enemySkillList(parts, displayName) {
  ensureEnemySheets();

  if (parts.length < 2) {
    return "사용법: !에너미스킬목록 <에너미 ID/별명/이름>";
  }

  var enemy;
  try { enemy = resolveEnemy(parts[1]); } catch(e) {
    return "[에너미 스킬 목록 오류]\n" + e.message;
  }

  const available = getAvailableEnemySkills(enemy);
  const label     = enemy["alias"] || enemy["name"];

  if (available.length === 0) {
    return (
      "[에너미 스킬 목록]\n" +
      "사용자: " + label + "\n\n" +
      "사용 가능한 스킬이 없습니다.\n" +
      "ENEMY_SKILLS 시트에 스킬을 등록하세요."
    );
  }

  const lines = available.map(function(s) {
    return (
      (s["skill_key"] || "—") + " / " +
      (s["name"]      || "—") + " / " +
      (s["category"]  || "—") + " / " +
      (s["rank"]      || "—") + " / " +
      (s["formula"]   || "—")
    );
  });

  return (
    "[에너미 스킬 목록]\n" +
    "사용자: " + label + "\n\n" +
    lines.join("\n")
  );
}

// ── Command: !에너미스킬 ─────────────────────────────────────────────

function enemySkillUse(parts, displayName) {
  ensureEnemySheets();

  if (parts.length < 3) {
    return (
      "사용법: !에너미스킬 <에너미 ID/별명> <skill_key 또는 이름> [대상:<대상명>] [보정]\n" +
      "예시:\n" +
      "  !에너미스킬 골목괴이 절단선 대상:월하륜\n" +
      "  !에너미스킬 E-0001 cut_line 대상:아르 +2"
    );
  }

  var enemy;
  try { enemy = resolveEnemy(parts[1]); } catch(e) {
    return "[에너미 스킬 오류]\n" + e.message;
  }

  var skill;
  try { skill = resolveEnemySkill(enemy, parts[2]); } catch(e) {
    return "[에너미 스킬 오류]\n" + e.message;
  }

  // Parse 대상: and bonus from remaining tokens
  var targetRef     = "";
  var _rawTargetStr = "";
  var bonus         = 0;

  parts.slice(3).forEach(function(t) {
    t = String(t || "").trim();
    if (t.startsWith("대상:") || t.startsWith("대상=")) {
      _rawTargetStr = t.replace(/^대상[:=]/, "").trim();
    } else if (_rawTargetStr && (_rawTargetStr.endsWith(",") || _rawTargetStr.endsWith("，")) && !/^[+\-]/.test(t) && !/^[가-힣A-Za-z0-9_]+[:=]/.test(t)) {
      // 쉼표 뒤 이어지는 추가 대상 토큰 누적
      _rawTargetStr = _rawTargetStr + t;
    } else if (/^[+\-]?\d+$/.test(t)) {
      bonus += Number(t);
    }
  });

  // 쉼표로 구분된 대상 목록 파싱 (다중 대상 지원)
  var _enemyRawTargets = _rawTargetStr
    ? _rawTargetStr.split(/[,，]+/).map(function(s) { return s.trim(); }).filter(Boolean)
    : [];
  targetRef = _enemyRawTargets[0] || "";

  const targetMode = String(skill["target_mode"] || "none").trim().toLowerCase();
  if (targetMode === "required" && !targetRef) {
    return (
      "[에너미 스킬 오류]\n" +
      skill["name"] + " 스킬은 대상이 필요합니다.\n" +
      "대상:<캐릭터 또는 에너미 별명> 을 추가해주세요."
    );
  }

  // ── Resolve target ────────────────────────────────────────────────
  // 파티명이거나 다중 대상이면 resolveMultiTargets로 먼저 확인.
  // 단일 대상인 경우에만 PC/에너미 구별 검사를 수행한다.
  var targetIsPC     = false;
  var targetIsEnemy  = false;
  var targetEnemyObj = null;

  if (targetRef) {
    // 파티 확인: 파티명이면 유효한 다중 대상으로 취급하고 단일 유효성 검사를 건너뜀
    var _isPartyTarget = getPartyMembers(targetRef).length > 0;
    var _isMultiTarget = _enemyRawTargets.length > 1 || _isPartyTarget;

    if (!_isMultiTarget) {
      const pcChar   = findCharacterByAlias(targetRef);
      var   enemyObj = null;
      try { enemyObj = resolveEnemy(targetRef); } catch(e2) {}

      if (pcChar && enemyObj) {
        return (
          "[에너미 스킬 오류]\n" +
          "대상 지정이 애매합니다. 캐릭터명 또는 에너미 ID를 정확히 입력해주세요.\n" +
          "대상: " + targetRef
        );
      }
      if (!pcChar && !enemyObj) {
        return "[에너미 스킬 오류]\n대상을 찾을 수 없습니다: " + targetRef;
      }
      targetIsPC     = !!pcChar;
      targetIsEnemy  = !!enemyObj;
      targetEnemyObj = enemyObj;
    }
  }

  // 조건 자동 판정 (에너미는 캐릭터 컨텍스트 없음 → 자유텍스트 위주)
  var enemyCondCheck = checkSkillConditions(skill["condition"] || skill["조건"], {
    label: "에너미 스킬",
    name: String(skill["name"] || skill["skill_key"] || "").trim(),
    character: null,
    targetAlias: targetRef
  });
  if (enemyCondCheck.blocked) return enemyCondCheck.text;
  var enemyConditionHeader = enemyCondCheck.headerText || "";

  // ── 판정시작 상태 체크 ───────────────────────────────────────────────
  const _skillEnemyAlias   = enemyCanonicalAlias(enemy);
  const _skillStatusResult = processStatusBeforeCheck(_skillEnemyAlias, KIND_SKILL);
  if (_skillStatusResult.blocked) {
    return (
      "[에너미 행동 불가]\n" +
      "사용자: " + (enemy["alias"] || enemy["name"]) + " (" + enemy["enemy_id"] + ")\n" +
      "스킬: " + String(skill["name"] || skill["skill_key"] || "").trim() + "\n\n" +
      (_skillStatusResult.text || "상태이상으로 행동이 저지됐습니다.")
    );
  }

  // ── Roll ──────────────────────────────────────────────────────────
  var rollResult;
  try { rollResult = rollEnemySkill(enemy, skill, bonus); } catch(e) {
    return "[에너미 스킬 오류]\n" + e.message;
  }

  const skillName  = String(skill["name"]     || skill["skill_key"] || "").trim();
  const category   = String(skill["category"] || "").trim();
  const rank       = rollResult.rank;
  const effectText = String(skill["effect"]   || "").trim();
  const enemyLabel = enemy["alias"] || enemy["name"];
  // 다중 대상 해소 (파티명 확장 포함)
  const _resolvedEnemyTargets = _enemyRawTargets.length > 0
    ? resolveMultiTargets(_enemyRawTargets) : [];
  const _targetDisplayStr = _resolvedEnemyTargets.length > 0
    ? _resolvedEnemyTargets.join(", ") : targetRef;
  const targetLine = _targetDisplayStr ? "대상: " + _targetDisplayStr + "\n" : "";
  const diceDetail = rollResult.diceLogs.length > 0
    ? rollResult.diceLogs.join("\n") + "\n"
    : "";
  const bonusLine  = rollResult.bonus !== 0
    ? "보정: " + formatSigned(rollResult.bonus) + "\n"
    : "";

  var combatText = "";
  var healText   = "";

  // ── Combat (화력) ─────────────────────────────────────────────────
  if (category === "화력" && _resolvedEnemyTargets.length > 0) {
    const combatParts = [];
    _resolvedEnemyTargets.forEach(function(tgt) {
      const pending = createPendingAttackFlex(
        enemy["enemy_id"], tgt, KIND_ENEMY_SKILL, skillName, rollResult.total
      );
      combatParts.push(pending.ok
        ? makeCombatChoiceTextFlex(pending)
        : "공격 대기 생성 실패: " + (pending.text || ""));
    });
    combatText = "\n" + combatParts.join("\n\n");
  } else if (category === "화력" && targetRef) {
    const pending = createPendingAttackFlex(
      enemy["enemy_id"], targetRef, KIND_ENEMY_SKILL, skillName, rollResult.total
    );
    combatText = pending.ok
      ? "\n" + makeCombatChoiceTextFlex(pending)
      : "\n공격 대기 생성 실패: " + (pending.text || "");
  }

  // ── Heal (치유/재생) ──────────────────────────────────────────────
  if (category === "치유" || category === "재생") {
    var healTargetLabel = "";

    if (!targetRef || targetRef === enemy["alias"] || targetRef === enemy["name"] ||
        targetRef === enemy["enemy_id"]) {
      // self-heal
      const result = applyEnemyHpChange(enemy["enemy_id"], rollResult.total, true);
      healTargetLabel = enemyLabel;
      healText = (
        "\n[회복 적용]\n" +
        "대상: " + healTargetLabel + "\n" +
        "회복량: " + rollResult.total + "\n" +
        "체력: " + result.before + " → " + result.after + " / " + result.maxHp +
        _enemyPassiveBlock(result)
      );
    } else if (targetIsEnemy && targetEnemyObj) {
      const result = applyEnemyHpChange(targetEnemyObj["enemy_id"], rollResult.total, true);
      healTargetLabel = targetEnemyObj["alias"] || targetEnemyObj["name"];
      healText = (
        "\n[회복 적용]\n" +
        "대상: " + healTargetLabel + "\n" +
        "회복량: " + rollResult.total + "\n" +
        "체력: " + result.before + " → " + result.after + " / " + result.maxHp +
        _enemyPassiveBlock(result)
      );
    } else if (targetIsPC) {
      const result = applyHealingToCharacter(targetRef, rollResult.total);
      healText = "\n" + result.text;
    }
  }

  // ── Effect DSL (상태부여/스택/상태해제 등) ─────────────────────────
  // 화력은 적중 시 processPendingAttackSkillEffects → applyEnemySkillEffect로 지연 처리.
  // 그 외 계열은 여기서 즉시 실행. 자신=에너미 별명, 대상=지정 대상(PC/에너미).
  var effectOut = "";
  if (effectText && category !== "화력") {
    effectOut = applyEnemySkillEffect(effectText, {
      userAlias:      enemyCanonicalAlias(enemy),
      targetAlias:    targetRef,
      finalValue:     rollResult.total,
      skillName:      skillName,
      resistanceMode: RESIST_NORMAL
    });
  }

  // ── Build output ──────────────────────────────────────────────────
  return (
    (_skillStatusResult.text ? _skillStatusResult.text + "\n\n" : "") +
    (enemyConditionHeader ? enemyConditionHeader + "\n\n" : "") +
    "【" + skillName + "】\n" +
    "사용자: " + enemyLabel + "\n" +
    targetLine +
    "\n" +
    "계열/랭크: " + category + " " + rank + "\n" +
    "계산식: "   + skill["formula"] + "\n" +
    diceDetail  +
    bonusLine   +
    "최종값: "   + rollResult.total +
    (effectText ? "\n\n효과: " + effectText : "") +
    combatText  +
    healText     +
    effectOut
  );
}

// ── End of Enemy System v0.2 ─────────────────────────────────────────

// =====================================================================
// ENEMY SYSTEM v0.3 + v0.4
// =====================================================================

// ── Generic key-value parser with explicit key list ───────────────────

function parseKeyValueArgsWithKeys(text, allowedKeys) {
  text = String(text || "");
  const positions = [];

  allowedKeys.forEach(function(key) {
    const pattern = key + ":";
    var searchFrom = 0;
    while (searchFrom < text.length) {
      const idx = text.indexOf(pattern, searchFrom);
      if (idx === -1) break;
      const prevChar = idx > 0 ? text[idx - 1] : " ";
      if (/\s/.test(prevChar) || idx === 0) {
        positions.push({ key: key, start: idx, valueStart: idx + pattern.length });
      }
      searchFrom = idx + 1;
    }
  });

  positions.sort(function(a, b) { return a.start - b.start; });

  const result = {};
  for (var i = 0; i < positions.length; i++) {
    const valueStart = positions[i].valueStart;
    const end        = i + 1 < positions.length ? positions[i + 1].start : text.length;
    result[positions[i].key] = text.slice(valueStart, end).trim();
  }
  return result;
}

// ── Response hint (PC target vs enemy target) ─────────────────────────

function formatResponseHint(attack) {
  const id   = attack.id       || attack["id"]    || "";
  const memo = String(attack["메모"] || attack.memo || "");

  if (memo.indexOf("TARGET_TYPE:ENEMY") >= 0) {
    const target = attack.targetDisplay || attack.target || attack["대상"] || "";
    return (
      "대응: !에너미대응 " + target + " 방어/회피/맞대응/무대응\n" +
      "지정 대응: !에너미대응 " + target + " " + id + " 방어/회피/맞대응/무대응"
    );
  }

  return (
    "대응: !대응 방어/회피/맞대응/무대응\n" +
    "지정 대응: !대응 " + id + " 방어/회피/맞대응/무대응"
  );
}

// ── Effect validation ─────────────────────────────────────────────────

function validateEnemySkillEffect(effectText) {
  effectText = String(effectText || "").trim();
  if (!effectText) return { ok: true, parsed: [] };

  const validCmds    = ["상태템플릿부여","상태부여","상태해제","스택증가","스택감소","스택설정","피해","회복"];
  const validTargets = ["대상","자신"];

  const lines  = effectText.split(/\n/).map(function(l) { return l.trim(); }).filter(Boolean);
  const errors = [];
  const parsed = [];

  lines.forEach(function(line) {
    const tokens = line.split(/\s+/);
    const cmd    = tokens[0];

    if (!validCmds.includes(cmd)) {
      errors.push(
        "알 수 없는 효과 명령어: \"" + cmd + "\"\n" +
        "허용: " + validCmds.join(", ")
      );
      return;
    }

    const tgt = tokens[1];
    if (!validTargets.includes(tgt)) {
      errors.push(
        "대상 지정 오류: \"" + (tgt || "(없음)") + "\" — 대상 또는 자신이어야 합니다.\n효과: " + line
      );
      return;
    }

    const minTokens = {
      "상태템플릿부여": 3, "상태부여": 5, "상태해제": 3,
      "스택증가": 4, "스택감소": 4, "스택설정": 4,
      "피해": 3, "회복": 3
    };
    if (tokens.length < (minTokens[cmd] || 2)) {
      errors.push(cmd + " 효과 토큰 부족 (최소 " + minTokens[cmd] + "개):\n효과: " + line);
      return;
    }

    parsed.push({ cmd: cmd, target: tgt, tokens: tokens });
  });

  if (errors.length > 0) return { ok: false, errors: errors };
  return { ok: true, parsed: parsed };
}

// ── Enemy skill lookup from pending attack ────────────────────────────

function getEnemySkillFromPendingAttack(attack) {
  if (!attack) return null;
  if (String(attack["공격종류"] || "").trim() !== KIND_ENEMY_SKILL) return null;

  const attackerRef = String(attack["공격자"] || "").trim();
  const skillName   = String(attack["공격명"] || "").trim();
  if (!attackerRef || !skillName) return null;

  var enemy = null;
  try { enemy = resolveEnemy(attackerRef); } catch(e) { return null; }

  try { return resolveEnemySkill(enemy, skillName); } catch(e) { return null; }
}

// ── Enemy skill effect application ───────────────────────────────────

// 피해/회복은 processSkillEffects(applyDamageToRef / applyHealingToRef)가 처리.
// 상태/스택은 별명 키(STATUS_DB/STACK_DB)로 저장되며 에너미 별명도 동일하게 동작하므로,
// 모든 효과 줄을 processSkillEffects에 그대로 위임한다.
function applyEnemySkillEffect(effectText, context) {
  effectText = String(effectText || "").trim();
  if (!effectText) return "";

  context = context || {};

  const lines = effectText.split(/\n/).map(function(l) { return l.trim(); }).filter(Boolean);
  const logs  = [];

  lines.forEach(function(line) {
    try {
      const r = processSkillEffects(line, context);
      if (r) logs.push(r.replace(/^\n+\[스킬 효과\]\n/, ""));
    } catch(e) {
      logs.push("[효과 오류]\n" + e.message);
    }
  });

  return logs.length > 0 ? "\n\n[스킬 효과]\n" + logs.join("\n\n") : "";
}

// ── Effect application after hit ─────────────────────────────────────

function applyPendingAttackEffectIfHit(attack, finalDamage, targetRef) {
  finalDamage = Math.floor(Number(finalDamage) || 0);
  if (finalDamage <= 0) return "";

  const attackKind  = String(attack["공격종류"] || "").trim();
  const attackerRef = String(attack["공격자"]   || "").trim();
  const atkTarget   = String(attack["대상"]     || "").trim();
  const resolvedTarget = targetRef || atkTarget;

  if (attackKind === KIND_ENEMY_SKILL) {
    const enemySkill = getEnemySkillFromPendingAttack(attack);
    if (!enemySkill) return "";
    const effectText = String(enemySkill["effect"] || "").trim();
    if (!effectText) return "";
    const category = String(enemySkill["category"] || "").trim();
    if (category !== "화력") return "";
    return applyEnemySkillEffect(effectText, {
      userAlias:   attackerRef,
      targetAlias: resolvedTarget,
      finalValue:  finalDamage,
      skillName:   String(enemySkill["name"] || enemySkill["skill_key"] || "")
    });
  }

  if (attackKind === KIND_SKILL) {
    const memo = String(attack["메모"] || "").trim();
    if (memo.indexOf("TARGET_TYPE:ENEMY") < 0) return "";
    const skill = getSkillFromPendingAttack(attack);
    if (!skill) return "";
    const effectText = String(skill["효과"] || "").trim();
    if (!effectText) return "";
    return applyEnemySkillEffect(effectText, {
      userAlias:   attackerRef,
      targetAlias: resolvedTarget,
      finalValue:  finalDamage,
      skillName:   String(skill["스킬명"] || "")
    });
  }

  return "";
}

// ── Row sheet utilities ───────────────────────────────────────────────

function findRowByKey(sheetName, keyCol, keyVal) {
  const rows = getSheetData(sheetName);
  return rows.find(function(r) {
    return String(r[keyCol] || "").trim() === String(keyVal).trim();
  }) || null;
}

function deleteRowByKey(sheetName, keyCol, keyVal) {
  const ss    = _getSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error("시트를 찾을 수 없습니다: " + sheetName);

  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(function(h) { return String(h).trim(); });
  const colIdx  = headers.indexOf(keyCol);
  if (colIdx < 0) throw new Error("열을 찾을 수 없습니다: " + keyCol);

  for (var r = 1; r < values.length; r++) {
    if (String(values[r][colIdx]).trim() === String(keyVal).trim()) {
      sheet.deleteRow(r + 1);
      return true;
    }
  }
  return false;
}

function upsertRowByKey(sheetName, keyCol, keyVal, obj) {
  const ss    = _getSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error("시트를 찾을 수 없습니다: " + sheetName);

  const values  = sheet.getDataRange().getValues();
  const headers = values[0].map(function(h) { return String(h).trim(); });
  const colIdx  = headers.indexOf(keyCol);
  if (colIdx < 0) throw new Error("열을 찾을 수 없습니다: " + keyCol);

  for (var r = 1; r < values.length; r++) {
    if (String(values[r][colIdx]).trim() === String(keyVal).trim()) {
      Object.keys(obj).forEach(function(key) {
        const c = headers.indexOf(key);
        if (c >= 0) sheet.getRange(r + 1, c + 1).setValue(obj[key]);
      });
      return "updated";
    }
  }

  appendRowByHeaders(sheetName, obj);
  return "inserted";
}

// ── Command: !에너미스킬등록 ─────────────────────────────────────────

var ENEMY_SKILL_REG_KEYS = [
  "key", "소유", "소유키", "이름", "계열", "랭크", "계산식", "효과", "대상", "조건", "메모"
];
var VALID_SKILL_CATEGORIES = ["화력","방호","치유","재생","간섭","강화","특수"];
var VALID_SKILL_RANKS      = ["F","E","D","C","B","A","S","U","EX"];
var VALID_OWNER_TYPES_ES   = ["template","enemy","global"];
var VALID_TARGET_MODES_ES  = ["none","optional","required"];

function enemySkillRegister(utterance, displayName) {
  ensureEnemySheets();

  const rawArgs = String(utterance || "").replace(/^!에너미스킬등록\s*/, "").trim();
  if (!rawArgs) {
    return (
      "사용법: !에너미스킬등록 key:<skill_key> 이름:<이름> 계열:<계열> 랭크:<랭크> 계산식:<계산식>\n" +
      "   [소유:<owner_type>] [소유키:<owner_key>] [효과:<effect>] [대상:<target_mode>] [메모:<메모>]\n\n" +
      "계열: " + VALID_SKILL_CATEGORIES.join(", ") + "\n" +
      "랭크: " + VALID_SKILL_RANKS.join(", ")
    );
  }

  const args = parseKeyValueArgsWithKeys(rawArgs, ENEMY_SKILL_REG_KEYS);

  const skillKey  = String(args["key"]    || "").trim();
  const name      = String(args["이름"]   || "").trim();
  const category  = String(args["계열"]   || "").trim();
  const rank      = String(args["랭크"]   || "").trim().toUpperCase();
  const formula   = String(args["계산식"] || "").trim();

  if (!skillKey) return "[에너미 스킬 등록 실패]\nkey: 는 필수 항목입니다.";
  if (!name)     return "[에너미 스킬 등록 실패]\n이름: 은 필수 항목입니다.";
  if (!category) return "[에너미 스킬 등록 실패]\n계열: 은 필수 항목입니다.";
  if (!rank)     return "[에너미 스킬 등록 실패]\n랭크: 는 필수 항목입니다.";
  if (!formula)  return "[에너미 스킬 등록 실패]\n계산식: 는 필수 항목입니다.";

  if (!VALID_SKILL_CATEGORIES.includes(category)) {
    return "[에너미 스킬 등록 실패]\n허용되지 않는 계열: " + category +
           "\n허용: " + VALID_SKILL_CATEGORIES.join(", ");
  }
  if (!VALID_SKILL_RANKS.includes(rank)) {
    return "[에너미 스킬 등록 실패]\n허용되지 않는 랭크: " + rank +
           "\n허용: " + VALID_SKILL_RANKS.join(", ");
  }

  var ownerType = String(args["소유"] || "global").trim().toLowerCase();
  if (!VALID_OWNER_TYPES_ES.includes(ownerType)) ownerType = "global";

  var ownerKey = String(args["소유키"] || "").trim();
  if (ownerType === "global" && !ownerKey) ownerKey = "*";

  var targetMode = String(args["대상"] || "optional").trim().toLowerCase();
  if (!VALID_TARGET_MODES_ES.includes(targetMode)) targetMode = "optional";

  const effectText = String(args["효과"] || "").trim();
  const condition  = String(args["조건"] || "").trim();
  const memo       = String(args["메모"] || "").trim();

  if (effectText) {
    const vResult = validateEnemySkillEffect(effectText);
    if (!vResult.ok) {
      return (
        "[에너미 스킬 등록 실패]\n" +
        "효과 문법을 해석할 수 없습니다.\n\n" +
        "문제:\n- " + vResult.errors.join("\n- ") + "\n\n" +
        "올바른 효과 예시:\n상태템플릿부여 대상 출혈 수치:5 횟수:3"
      );
    }
  }

  const row = {
    skill_key:   skillKey,
    owner_type:  ownerType,
    owner_key:   ownerKey,
    name:        name,
    category:    category,
    rank:        rank,
    formula:     formula,
    effect:      effectText,
    target_mode: targetMode,
    condition:   condition,
    memo:        memo
  };

  const action = upsertRowByKey(SHEET_ENEMY_SKILLS, "skill_key", skillKey, row);
  const label  = action === "inserted" ? "[에너미 스킬 등록]" : "[에너미 스킬 갱신]";

  return (
    label + "\n" +
    "key: "  + skillKey  + "\n" +
    "이름: " + name      + "\n" +
    "계열: " + category  + "\n" +
    "랭크: " + rank      + "\n" +
    "소유: " + ownerType + " / " + ownerKey + "\n" +
    "대상: " + targetMode +
    (effectText ? "\n효과: " + effectText : "")
  );
}

// ── Command: !에너미스킬삭제 ─────────────────────────────────────────

function enemySkillDelete(parts, displayName) {
  ensureEnemySheets();

  if (parts.length < 2) return "사용법: !에너미스킬삭제 <skill_key>";

  const skillKey = String(parts[1] || "").trim();
  const existing = findRowByKey(SHEET_ENEMY_SKILLS, "skill_key", skillKey);

  if (!existing) {
    return "[에너미 스킬 삭제 실패]\n스킬을 찾을 수 없습니다: " + skillKey;
  }

  try { deleteRowByKey(SHEET_ENEMY_SKILLS, "skill_key", skillKey); } catch(e) {
    return "[에너미 스킬 삭제 오류]\n" + e.message;
  }

  return (
    "[에너미 스킬 삭제]\n" +
    "key: "  + skillKey + "\n" +
    "이름: " + String(existing["name"] || existing["skill_key"] || "—")
  );
}

// ── Command: !에너미템플릿등록 ───────────────────────────────────────

var ENEMY_TPL_REG_KEYS = [
  "key", "이름", "분류", "위험도", "체력",
  "참격", "관통", "타격", "격투", "사격",
  "방어", "회피", "저항", "조사", "해석", "은신", "추적", "설득",
  "규칙", "징후", "메모"
];

function enemyTemplateRegister(utterance, displayName) {
  ensureEnemySheets();

  const rawArgs = String(utterance || "").replace(/^!에너미템플릿등록\s*/, "").trim();
  if (!rawArgs) {
    return (
      "사용법: !에너미템플릿등록 key:<template_key> 이름:<이름> 체력:<max_hp>\n" +
      "   [분류:<분류>] [위험도:<위험도>] [참격:<n>] ... [규칙:<텍스트>]\n\n" +
      "예시:\n!에너미템플릿등록 key:alley_cut 이름:골목의 절단 괴이 분류:괴이 위험도:2 체력:45 참격:5"
    );
  }

  const args  = parseKeyValueArgsWithKeys(rawArgs, ENEMY_TPL_REG_KEYS);
  const tKey  = String(args["key"]  || "").trim();
  const name  = String(args["이름"] || "").trim();
  const hpRaw = String(args["체력"] || "").trim();

  if (!tKey)                          return "[에너미 템플릿 등록 실패]\nkey: 는 필수 항목입니다.";
  if (!name)                          return "[에너미 템플릿 등록 실패]\n이름: 은 필수 항목입니다.";
  if (!hpRaw || isNaN(Number(hpRaw))) return "[에너미 템플릿 등록 실패]\n체력은 숫자여야 합니다.";

  const maxHp = Math.max(0, Math.floor(Number(hpRaw)));

  const row = {
    template_key: tKey,
    name:         name,
    category:     String(args["분류"]   || "").trim(),
    threat:       String(args["위험도"] || "").trim(),
    max_hp:       maxHp,
    rule:         String(args["규칙"]   || "").trim(),
    signs:        String(args["징후"]   || "").trim(),
    memo:         String(args["메모"]   || "").trim()
  };

  ENEMY_ACTION_FIELDS.forEach(function(a) {
    const v = args[a];
    row[a] = (v !== undefined && v !== "") ? Math.max(0, Math.floor(Number(v) || 0)) : 0;
  });

  const action = upsertRowByKey(SHEET_ENEMY_TEMPLATES, "template_key", tKey, row);
  const label  = action === "inserted" ? "[에너미 템플릿 등록]" : "[에너미 템플릿 갱신]";

  return (
    label + "\n" +
    "key: "    + tKey                   + "\n" +
    "이름: "   + name                   + "\n" +
    "분류: "   + (row.category || "—") + "\n" +
    "위험도: " + (row.threat   || "—") + "\n" +
    "체력: "   + maxHp
  );
}

// ── Command: !에너미템플릿삭제 ───────────────────────────────────────

function enemyTemplateDelete(parts, displayName) {
  ensureEnemySheets();

  if (parts.length < 2) return "사용법: !에너미템플릿삭제 <template_key>";

  const tKey     = String(parts[1] || "").trim();
  const existing = findRowByKey(SHEET_ENEMY_TEMPLATES, "template_key", tKey);

  if (!existing) {
    return "[에너미 템플릿 삭제 실패]\n템플릿을 찾을 수 없습니다: " + tKey;
  }

  try { deleteRowByKey(SHEET_ENEMY_TEMPLATES, "template_key", tKey); } catch(e) {
    return "[에너미 템플릿 삭제 오류]\n" + e.message;
  }

  return (
    "[에너미 템플릿 삭제]\n" +
    "key: "  + tKey + "\n" +
    "이름: " + String(existing["name"] || existing["template_key"] || "—")
  );
}

// ── End of Enemy System v0.3 + v0.4 ──────────────────────────────────
// ── Aporia Portal Webhook ────────────────────────────────────────────
// 웹 포털(/admin)에서 신청 승인 시 호출되는 Webhook.
// 기존 Discord 명령어 처리(doGet/handleCommand)와 분리되어 있다.

const APORIA_PORTAL_SOURCE  = "aporia-portal";
const APORIA_PORTAL_SECRET_PROP = "APORIA_PORTAL_SECRET";

function doPost(e) {
  // 1) JSON 파싱 시도. 실패하면 — 향후 Discord webhook 등록 시를 위해 — 안전하게 무시.
  var raw = "";
  try { raw = (e && e.postData && e.postData.contents) || ""; } catch (_) { raw = ""; }

  var body = null;
  if (raw) {
    try { body = JSON.parse(raw); } catch (_) { body = null; }
  }

  // 2) 포털 Webhook 분기 (source 매칭)
  if (body && body.source === APORIA_PORTAL_SOURCE) {
    try {
      return returnJson(handlePortalWebhook(body));
    } catch (err) {
      return returnJson({
        ok: false,
        error: "[Apps Script 예외] " + (err && err.message ? err.message : String(err))
      });
    }
  }

  // 3) 포털이 아닌 요청 — 기존 Discord 명령어 흐름이 doPost를 쓰지 않으므로 단순 응답.
  //    (향후 다른 webhook이 추가될 때 여기서 분기하면 됨)
  return returnJson({ ok: false, error: "Unsupported request" });
}

function returnJson(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function handlePortalWebhook(body) {
  // secret 검증
  var expected = "";
  try {
    expected = PropertiesService.getScriptProperties().getProperty(APORIA_PORTAL_SECRET_PROP) || "";
  } catch (_) { expected = ""; }

  var provided = String((body && body.secret) || "");
  if (!expected || provided !== expected) {
    return { ok: false, error: "Unauthorized" };
  }

  var action      = String((body && body.action) || "");
  var application = (body && body.application) || null;

  // 로그
  try {
    Logger.log(
      "[portal webhook] action=" + action +
      " type=" + (application && application.type) +
      " id="   + (application && application.id)
    );
    console.log("[portal webhook]", {
      action: action,
      type:   application && application.type,
      id:     application && application.id
    });
  } catch (_) { /* noop */ }

  // 아이템 등록 (관리자 전용, Vercel에서 admin 검증 후 호출)
  if (action === "register_item") {
    return registerItemFromPayload((body && body.item) || null);
  }

  // 캐릭터 스킬 직접 등록 (관리자 전용)
  if (action === "register_skill") {
    return registerSkillFromPayload((body && body.skill) || null);
  }

  // 상점 품목 등록/삭제 (관리자 전용)
  if (action === "register_shop_item") {
    return registerShopItemFromPayload((body && body.shopItem) || null);
  }
  if (action === "delete_shop_item") {
    return deleteShopItem(String((body && body.name) || ""));
  }

  if (action !== "approve_application") {
    return { ok: false, error: "Unsupported action: " + action };
  }
  if (!application || typeof application !== "object") {
    return { ok: false, error: "application 필드가 비어 있습니다." };
  }

  var type        = String(application.type || "");
  var payload     = application.payload || {};
  var outputText  = String(application.output_text || "");

  if (type === "enemy_template") return registerPortalEnemyTemplate(payload, outputText, application);
  if (type === "enemy_skill")    return registerPortalEnemySkill(payload, outputText, application);
  if (type === "character_data") return registerPortalCharacterData(payload, outputText, application);

  return { ok: false, error: "Unsupported type: " + type };
}

function _portalLooksLikeFailure(text) {
  var s = String(text || "").trim();
  if (!s) return true;
  if (/^\[[^\]]*(실패|오류)\]/.test(s)) return true;
  if (/^사용법:/.test(s)) return true;
  // 평문 실패 패턴 (characterApprove/skillApprove 등이 [..실패] 없이 그대로 돌려주는 케이스)
  if (/찾을 수 없습니다/.test(s)) return true;
  if (/이미 처리된 신청입니다/.test(s)) return true;
  if (/이미 BOT_DB에/.test(s)) return true;
  if (/이미 같은 이름의 스킬이 등록되어 있습니다/.test(s)) return true;
  if (/스킬 소유자 캐릭터를 찾을 수 없습니다/.test(s)) return true;
  return false;
}

function registerPortalEnemyTemplate(payload, outputText, application) {
  // 1) output_text가 !에너미템플릿등록으로 시작하면 그대로 재사용 (UI/봇 동작 일치 보장)
  // 2) 아니면 payload로부터 명령어 문자열을 재구성
  var utterance = outputText && /^!에너미템플릿등록(?:$|\s)/.test(outputText)
    ? outputText
    : _portalBuildEnemyTemplateUtterance(payload);

  if (!utterance) {
    return { ok: false, error: "에너미 템플릿 등록 명령어를 만들 수 없습니다." };
  }

  var result;
  try {
    result = enemyTemplateRegister(utterance, "aporia-portal");
  } catch (err) {
    return { ok: false, error: "[등록 예외] " + (err && err.message ? err.message : String(err)) };
  }

  if (_portalLooksLikeFailure(result)) {
    return { ok: false, error: String(result) };
  }

  var registeredKey = String((payload && payload.template_key) || "");
  try {
    Logger.log("[portal webhook] enemy_template registered key=" + registeredKey);
  } catch (_) { /* noop */ }

  return {
    ok: true,
    message: String(result),
    registeredType: "enemy_template",
    registeredKey: registeredKey
  };
}

function registerPortalEnemySkill(payload, outputText, application) {
  var utterance = outputText && /^!에너미스킬등록(?:$|\s)/.test(outputText)
    ? outputText
    : _portalBuildEnemySkillUtterance(payload);

  if (!utterance) {
    return { ok: false, error: "에너미 스킬 등록 명령어를 만들 수 없습니다." };
  }

  var result;
  try {
    result = enemySkillRegister(utterance, "aporia-portal");
  } catch (err) {
    return { ok: false, error: "[등록 예외] " + (err && err.message ? err.message : String(err)) };
  }

  if (_portalLooksLikeFailure(result)) {
    return { ok: false, error: String(result) };
  }

  var registeredKey = String((payload && payload.skill_key) || "");
  try {
    Logger.log("[portal webhook] enemy_skill registered key=" + registeredKey);
  } catch (_) { /* noop */ }

  return {
    ok: true,
    message: String(result),
    registeredType: "enemy_skill",
    registeredKey: registeredKey
  };
}

// payload → !에너미템플릿등록 utterance 재구성 (output_text 누락 시 안전망)
function _portalBuildEnemyTemplateUtterance(p) {
  if (!p) return "";
  var parts = ["!에너미템플릿등록"];
  parts.push("key:" + String(p.template_key || ""));
  parts.push("이름:" + String(p.name || ""));
  if (p.category !== undefined) parts.push("분류:" + String(p.category || ""));
  if (p.threat   !== undefined) parts.push("위험도:" + String(p.threat || ""));
  parts.push("체력:" + String(p.max_hp != null ? p.max_hp : ""));
  var actions = (p.actions && typeof p.actions === "object") ? p.actions : {};
  ENEMY_ACTION_FIELDS.forEach(function(a) {
    var v = actions[a];
    if (v !== undefined && v !== null && v !== "") parts.push(a + ":" + String(v));
  });
  if (p.rule)  parts.push("규칙:" + String(p.rule));
  if (p.signs) parts.push("징후:" + String(p.signs));
  if (p.memo)  parts.push("메모:" + String(p.memo));
  return parts.join(" ");
}

// payload → !에너미스킬등록 utterance 재구성 (output_text 누락 시 안전망)
function _portalBuildEnemySkillUtterance(p) {
  if (!p) return "";
  var parts = ["!에너미스킬등록"];
  parts.push("key:" + String(p.skill_key || ""));
  if (p.owner_type) parts.push("소유:" + String(p.owner_type));
  if (p.owner_key)  parts.push("소유키:" + String(p.owner_key));
  parts.push("이름:" + String(p.name || ""));
  parts.push("계열:" + String(p.category || ""));
  parts.push("랭크:" + String(p.rank || ""));
  parts.push("계산식:" + String(p.formula || ""));
  if (p.effect)      parts.push("효과:" + String(p.effect));
  if (p.target_mode) parts.push("대상:" + String(p.target_mode));
  if (p.condition)   parts.push("조건:" + String(p.condition));
  if (p.memo)        parts.push("메모:" + String(p.memo));
  return parts.join(" ");
}

// 캐릭터 + 플레이어 스킬 묶음 자동 등록.
// outputText는 buildFullApplicationText 결과:
//   "!캐릭터신청\n이름: ...\n...\n\n!스킬신청\n이름: ...\n...\n\n!스킬신청\n..."
// 따라서 빈 줄(\n\n+)로 split 하면 [characterBlock, ...skillBlocks].
function registerPortalCharacterData(payload, outputText, application) {
  var rawText = String(outputText || "");
  if (!rawText) {
    return { ok: false, error: "캐릭터 신청 텍스트(output_text)가 비어 있습니다." };
  }

  // 별명(alias) — Discord 봇에서 character["별명"]로 쓰는 키. 캐릭터 이름을 사용한다.
  var charName = "";
  try {
    charName = String((payload && payload.char && payload.char.name) || "").trim();
  } catch (_) { charName = ""; }
  if (!charName) {
    return { ok: false, error: "payload.char.name(캐릭터 이름)이 비어 있어 별명을 만들 수 없습니다." };
  }

  var blocks = rawText.split(/\n\s*\n+/).map(function(b){ return String(b || "").trim(); }).filter(Boolean);
  if (blocks.length === 0) {
    return { ok: false, error: "캐릭터 신청 텍스트를 파싱할 수 없습니다." };
  }

  var charBlock = blocks[0];
  if (!/^!캐릭터신청(?:$|\s)/.test(charBlock)) {
    return { ok: false, error: "첫 블록이 !캐릭터신청으로 시작하지 않습니다." };
  }
  var skillBlocks = blocks.slice(1).filter(function(b){ return /^!스킬신청(?:$|\s)/.test(b); });

  // 1) 캐릭터 신청 → CH-xxxx
  var charSubmitResp;
  try {
    charSubmitResp = characterSubmit(charBlock, charName);
  } catch (err) {
    return { ok: false, error: "[캐릭터 신청 예외] " + (err && err.message ? err.message : String(err)) };
  }
  if (_portalLooksLikeFailure(charSubmitResp)) {
    return { ok: false, error: String(charSubmitResp) };
  }
  var charId = _portalExtractId(charSubmitResp);
  if (!charId) {
    return { ok: false, error: "캐릭터 신청 번호를 응답에서 추출하지 못했습니다.\n원응답:\n" + charSubmitResp };
  }

  // 2) 캐릭터 승인 → BOT_DB 등록
  var charApproveResp;
  try {
    charApproveResp = characterApprove(["!캐릭터승인", charId], "aporia-portal");
  } catch (err) {
    return { ok: false, error: "[캐릭터 승인 예외] " + (err && err.message ? err.message : String(err)) };
  }
  if (_portalLooksLikeFailure(charApproveResp) || !/\[캐릭터 승인 완료\]/.test(String(charApproveResp))) {
    return { ok: false, error: "캐릭터는 접수됐으나 승인 단계에서 실패했습니다.\n" + String(charApproveResp) };
  }

  // BOT_DB 쓰기가 즉시 반영되도록 flush
  try { SpreadsheetApp.flush(); } catch (_e) {}

  // 2-b) 풀네임이 있으면 NICKNAME_DB에 등록
  var fullName = "";
  try {
    fullName = String((payload && payload.char && payload.char.fullName) || "").trim();
  } catch (_) { fullName = ""; }
  if (fullName) {
    try {
      ensureNicknameSheet();
      var existingNick = _findNicknameRow(charName);
      if (existingNick) {
        var nickCol = existingNick.headers.indexOf("닉네임");
        if (nickCol >= 0) {
          var curRaw = String(existingNick.values[nickCol] || "").trim();
          var curList = curRaw ? curRaw.split(/[,，]+/).map(function(n){ return n.trim(); }).filter(Boolean) : [];
          if (curList.indexOf(fullName) < 0) {
            curList.push(fullName);
            existingNick.sheet.getRange(existingNick.rowIndex, nickCol + 1).setValue(curList.join(", "));
          }
        }
      } else {
        appendRowByHeaders(SHEET_NICKNAME_DB, { 별명: charName, 닉네임: fullName });
      }
    } catch (_e) { /* 닉네임 등록 실패는 경고만 */ }
  }

  // 3) 플레이어 스킬들 신청 + 승인 (개별 실패는 경고로만 누적)
  var skillResults = [];
  var skillWarnings = [];
  for (var i = 0; i < skillBlocks.length; i++) {
    var sBlock = skillBlocks[i];
    var sName = _portalPeekField(sBlock, "이름") || ("(스킬 " + (i + 1) + ")");

    var sSubmitResp;
    try {
      sSubmitResp = skillSubmit(sBlock, charName);
    } catch (err) {
      skillWarnings.push("[" + sName + "] 신청 예외: " + (err && err.message ? err.message : String(err)));
      continue;
    }
    if (_portalLooksLikeFailure(sSubmitResp)) {
      skillWarnings.push("[" + sName + "] 신청 실패: " + String(sSubmitResp).split("\n")[0]);
      continue;
    }
    var sId = _portalExtractId(sSubmitResp);
    if (!sId) {
      skillWarnings.push("[" + sName + "] 신청 번호 추출 실패");
      continue;
    }

    var sApproveResp;
    try {
      sApproveResp = skillApprove(["!스킬승인", sId], "aporia-portal");
    } catch (err) {
      skillWarnings.push("[" + sName + "] 승인 예외: " + (err && err.message ? err.message : String(err)));
      continue;
    }
    if (_portalLooksLikeFailure(sApproveResp) || !/\[스킬 승인 완료\]/.test(String(sApproveResp))) {
      // 가장 흔한 실패: 성장예산 초과 (신규 캐릭터는 예산이 0이라 모든 스킬이 실패할 수 있음)
      skillWarnings.push("[" + sName + "] 승인 실패: " + String(sApproveResp).split("\n").slice(0, 3).join(" / "));
      continue;
    }
    skillResults.push(sName);
  }

  // 4) 패시브 등록 (PASSIVE_SKILLS 직접 쓰기)
  var passives = (payload && Array.isArray(payload.passives)) ? payload.passives : [];
  var passiveResults = [];
  var passiveWarnings = [];
  if (passives.length > 0) {
    try { ensurePassiveSheet(); } catch (_e) { /* noop */ }
    for (var j = 0; j < passives.length; j++) {
      var p = passives[j];
      var pName = String(p["이름"] || p["key"] || ("(패시브 " + (j + 1) + ")"));
      try {
        var ownerType = String(p["소유타입"] || "global");
        var ownerKey  = String(p["소유키"]   || "*");
        if (ownerType === "global") { ownerType = "character"; }
        if (ownerKey  === "*")      { ownerKey  = charName; }
        appendRowByHeaders(SHEET_PASSIVE_SKILLS, {
          key:      String(p["key"]      || ""),
          이름:     String(p["이름"]     || ""),
          소유타입: ownerType,
          소유키:   ownerKey,
          해금레벨: String(p["해금레벨"] || "1"),
          분류:     String(p["분류"]     || ""),
          효과코드: String(p["효과코드"] || ""),
          수치:     String(p["수치"]     || ""),
          최대:     String(p["최대"]     || ""),
          발동:     String(p["발동"]     || ""),
          판정:     String(p["판정"]     || ""),
          조건:     String(p["조건"]     || ""),
          효과:     String(p["효과"]     || ""),
          설명:     String(p["설명"]     || ""),
          메모:     String(p["메모"]     || ""),
        });
        passiveResults.push(pName);
      } catch (err) {
        passiveWarnings.push("[" + pName + "] " + (err && err.message ? err.message : String(err)));
      }
    }
  }

  try {
    Logger.log("[portal webhook] character_data registered alias=" + charName +
               " charId=" + charId +
               " skillsOk=" + skillResults.length +
               " skillsWarn=" + skillWarnings.length +
               " passivesOk=" + passiveResults.length);
  } catch (_) { /* noop */ }

  var msg = "[캐릭터 자동 등록 완료]\n" +
            "별명: " + charName + "\n" +
            "신청번호: " + charId + "\n" +
            "등록된 스킬: " + skillResults.length + " / " + skillBlocks.length + "\n" +
            "등록된 패시브: " + passiveResults.length + " / " + passives.length;
  if (skillResults.length > 0) {
    msg += "\n\n[스킬]\n- " + skillResults.join("\n- ");
  }
  if (skillWarnings.length > 0) {
    msg += "\n\n[스킬 경고]\n- " + skillWarnings.join("\n- ");
  }
  if (passiveResults.length > 0) {
    msg += "\n\n[패시브]\n- " + passiveResults.join("\n- ");
  }
  if (passiveWarnings.length > 0) {
    msg += "\n\n[패시브 경고]\n- " + passiveWarnings.join("\n- ");
  }

  // 캐릭터/스킬 등록 후 게임 데이터 캐시 무효화
  invalidateGameDataCache();

  return {
    ok: true,
    message: msg,
    registeredType: "character_data",
    registeredKey: charName,
    skillRegistered: skillResults.length,
    skillTotal: skillBlocks.length,
    skillWarnings: skillWarnings,
    passiveRegistered: passiveResults.length,
    passiveTotal: passives.length,
    passiveWarnings: passiveWarnings,
  };
}

// 봇 응답에서 "신청번호: CH-0001" / "신청번호: SK-0003" 형태의 id를 추출.
function _portalExtractId(text) {
  var m = String(text || "").match(/신청번호\s*[:：]\s*([A-Za-z0-9_\-]+)/);
  return m ? m[1].trim() : "";
}

// 블록에서 "키: 값"의 값만 한 번 꺼낸다 (멀티라인 미고려, 라벨 표시용).
function _portalPeekField(block, key) {
  var re = new RegExp("(?:^|\\n)\\s*" + key + "\\s*[:：]\\s*([^\\n]+)");
  var m = String(block || "").match(re);
  return m ? m[1].trim() : "";
}

// ── End of Aporia Portal Webhook ─────────────────────────────────────

// ── 공용 스킬 (COMMON_SKILLS) ────────────────────────────────────────

function getCharacterFaction(character) {
  if (!character) return DEFAULT_FACTION;
  const raw = character["소속"];
  if (raw === undefined || raw === null) return DEFAULT_FACTION;
  const v = String(raw).trim();
  return v || DEFAULT_FACTION;
}

function getCharacterRaceText(character) {
  if (!character) return "";
  const raw = character["종족"];
  if (raw === undefined || raw === null) return "";
  return String(raw).trim();
}

function readCommonSkills() {
  try {
    return getSheetData(SHEET_COMMON_SKILLS);
  } catch (e) {
    return null;
  }
}

function _normalizeCommonSkillType(skill) {
  const t = String(skill["유형"] || "").trim().toLowerCase();
  if (t === "global" || t === "faction" || t === "species") return t;
  return "global";
}

function _commonSkillUnlockStatus(skill, character) {
  const type = _normalizeCommonSkillType(skill);
  const unlockLevel = Number(skill["해금레벨"] || 0) || 0;
  const charLevel = Number(readCharacterLevel(character) || 0) || 0;
  const charFaction = getCharacterFaction(character);
  const charRace = getCharacterRaceText(character);

  let conditionMatched = true;
  let conditionReason = "";

  if (type === "faction") {
    const skillFaction = String(skill["소속"] || "").trim() || DEFAULT_FACTION;
    if (skillFaction !== charFaction) {
      conditionMatched = false;
      conditionReason = "소속 불일치 (필요: " + skillFaction + " / 캐릭터: " + charFaction + ")";
    }
  } else if (type === "species") {
    const skillRace = String(skill["종족"] || "").trim();
    if (skillRace !== charRace) {
      conditionMatched = false;
      conditionReason = "종족 불일치 (필요: " + skillRace + " / 캐릭터: " + (charRace || "-") + ")";
    }
  }

  const levelMatched = charLevel >= unlockLevel;
  const unlocked = conditionMatched && levelMatched;

  return {
    type: type,
    unlockLevel: unlockLevel,
    charLevel: charLevel,
    conditionMatched: conditionMatched,
    conditionReason: conditionReason,
    levelMatched: levelMatched,
    unlocked: unlocked
  };
}

function findCommonSkill(nameOrKey) {
  const rows = readCommonSkills();
  if (!rows) return null;
  const needle = String(nameOrKey || "").trim();
  if (!needle) return null;

  return rows.find(r => {
    const k = String(r["key"] || "").trim();
    const n = String(r["이름"] || "").trim();
    return k === needle || n === needle;
  }) || null;
}

function _resolveCommandCharacter(parts, displayName) {
  if (parts.length >= 2) {
    const candidate = String(parts[1] || "").trim();
    if (candidate) {
      const byAlias = findCharacterByAlias(candidate);
      if (byAlias) {
        return { character: byAlias, alias: String(byAlias["별명"]).trim(), consumed: 2 };
      }
    }
  }
  const self = findCharacter(displayName);
  if (self) {
    return { character: self, alias: String(self["별명"]).trim(), consumed: 1 };
  }
  return null;
}

function commonSkillListCommand(parts, displayName) {
  const resolved = _resolveCommandCharacter(parts, displayName);
  if (!resolved) {
    return (
      "캐릭터를 찾을 수 없습니다.\n" +
      "디스코드 별명: " + displayName + "\n" +
      "BOT_DB의 별명 열과 디스코드 서버 별명이 같은지 확인하세요."
    );
  }

  const character = resolved.character;
  const rows = readCommonSkills();

  if (rows === null) {
    return "COMMON_SKILLS 시트가 없습니다.\n관리자가 시트를 생성해야 합니다.";
  }

  const faction = getCharacterFaction(character);
  const race = getCharacterRaceText(character) || "-";
  const level = Number(readCharacterLevel(character) || 0) || 0;

  const available = [];
  const locked = [];

  rows.forEach(r => {
    const name = String(r["이름"] || "").trim();
    if (!name) return;
    const status = _commonSkillUnlockStatus(r, character);
    if (!status.conditionMatched) return;

    const series = String(r["계열"] || "").trim() || "-";
    const rank = String(r["랭크"] || "").trim() || "-";
    const line = "- Lv." + (status.unlockLevel || "?") + " " + name + " / " + series + " " + rank;

    if (status.unlocked) available.push(line);
    else locked.push(line);
  });

  if (available.length === 0 && locked.length === 0) {
    return (
      "[공용 스킬 목록]\n" +
      "캐릭터: " + resolved.alias + "\n" +
      "소속: " + faction + "\n" +
      "종족: " + race + "\n" +
      "레벨: " + level + "\n\n" +
      "표시 가능한 공용 스킬이 없습니다.\n" +
      "(COMMON_SKILLS 시트에 해당 캐릭터 조건의 행이 없습니다)"
    );
  }

  let text =
    "[공용 스킬 목록]\n" +
    "캐릭터: " + resolved.alias + "\n" +
    "소속: " + faction + "\n" +
    "종족: " + race + "\n" +
    "레벨: " + level + "\n";

  if (available.length > 0) {
    text += "\n사용 가능:\n" + available.join("\n");
  }
  if (locked.length > 0) {
    text += "\n\n잠김:\n" + locked.join("\n");
  }

  return text;
}

function commonSkillUseCommand(parts, displayName) {
  if (parts.length < 2) {
    return (
      "사용법: !공용스킬 [캐릭터별명] <스킬명> [대상:대상명] [보정]\n" +
      "예시:\n" +
      "  !공용스킬 마탄 대상:에너미A\n" +
      "  !공용스킬 월하륜 마탄 대상:에너미A +2"
    );
  }

  const resolved = _resolveCommandCharacter(parts, displayName);
  if (!resolved) {
    return (
      "캐릭터를 찾을 수 없습니다.\n" +
      "디스코드 별명: " + displayName
    );
  }

  const character = resolved.character;
  const alias = resolved.alias;
  const rest = parts.slice(resolved.consumed);

  if (rest.length < 1) {
    return "스킬명이 필요합니다.\n사용법: !공용스킬 [캐릭터별명] <스킬명> [대상:대상명] [보정]";
  }

  const skillName = rest[0];
  const targetParsed = parseTargetAndMods(rest.slice(1));
  const mods = targetParsed.mods;
  const targetAlias = targetParsed.target;

  // 다른 스킬 캐스팅 진행 중 차단 — 해당 스킬 자신의 캐스팅(완료)은 통과
  const commonCastBlock = _checkAnyCastingBlock(alias);
  if (commonCastBlock.blocked) {
    const selfCastInfo = findActiveStatusRowInfo(alias, _castingStatusName(skillName));
    const selfCastDone = selfCastInfo && _statusToNum(selfCastInfo.status["남은횟수"]) === 0;
    if (!selfCastDone) return commonCastBlock.text;
  }

  const skillRows = readCommonSkills();
  if (skillRows === null) {
    return "COMMON_SKILLS 시트가 없습니다.\n관리자가 시트를 생성해야 합니다.";
  }

  const commonSkill = findCommonSkill(skillName);
  if (!commonSkill) {
    return (
      "공용 스킬을 찾을 수 없습니다.\n" +
      "스킬명: " + skillName + "\n\n" +
      "확인: !공용스킬목록"
    );
  }

  const displaySkillName = String(commonSkill["이름"] || skillName).trim();
  const status = _commonSkillUnlockStatus(commonSkill, character);

  if (!status.conditionMatched) {
    return (
      "[공용 스킬 사용 불가]\n" +
      "캐릭터: " + alias + "\n" +
      "스킬: " + displaySkillName + "\n\n" +
      "사유: " + status.conditionReason
    );
  }

  if (!status.levelMatched) {
    return (
      "[공용 스킬 잠김]\n" +
      "캐릭터: " + alias + "\n" +
      "스킬: " + displaySkillName + "\n\n" +
      "필요 레벨: " + status.unlockLevel + " / 현재 레벨: " + status.charLevel
    );
  }

  const targetSpec = String(commonSkill["대상"] || "").trim().toLowerCase();
  let targetWarning = "";

  // required: 대상 자동 처리에 대상이 필요하다는 의미. 대상 없이도 순수 판정은 허용.
  // none: 대상 지정이 불가능. 대상값은 무시.
  // optional: 대상 있으면 대상 처리, 없으면 판정값만.
  if (targetSpec === "none" && targetAlias) {
    targetWarning = "\n※ 이 공용 스킬은 대상 지정이 없는 스킬입니다. 대상값은 무시되었습니다.\n";
  }
  const effectiveTarget = (targetSpec === "none") ? "" : targetAlias;
  const noTargetMode = !effectiveTarget;

  const erosion = Number(character["이면침식"] || 0);
  const erosionStage = getErosionStageText(erosion);

  if (erosion >= MAX_EROSION) {
    return (
      "[로스트]\n" +
      alias + "은/는 이미 경계를 넘어섰습니다.\n\n" +
      "이면침식: " + erosion + " / " + MAX_EROSION + "\n" +
      "상태: " + erosionStage + "\n\n" +
      "이 캐릭터는 더 이상 플레이어 캐릭터로 사용할 수 없습니다."
    );
  }

  const rank = String(commonSkill["랭크"] || "").trim().toUpperCase();
  let rankValue;
  try {
    rankValue = rankToValue(rank);
  } catch (e) {
    return (
      "[공용 스킬 오류]\n" +
      displaySkillName + "\n\n" +
      "허용되지 않은 랭크입니다: " + rank
    );
  }

  // 조건 자동 판정
  const commonCondCheck = checkSkillConditions(commonSkill["조건"], {
    label: "공용 스킬",
    name: displaySkillName,
    character: character,
    targetAlias: effectiveTarget
  });
  if (commonCondCheck.blocked) return commonCondCheck.text;
  const conditionHeaderText = commonCondCheck.headerText || "";
  const condDetailBonus     = commonCondCheck.detailBonus || 0;
  const condDetailMult      = commonCondCheck.detailMult  || 1;

  // ── 대가 게이트 (공용 스킬) ──
  const commonCostText = String(commonSkill["대가"] || "").trim();
  const commonCostGate = checkSkillCostGate(alias, displaySkillName, commonCostText);
  if (commonCostGate.blocked) return commonCostGate.text;

  const statusResult = processStatusBeforeCheck(alias, KIND_SKILL);
  if (statusResult.blocked) {
    return statusResult.text;
  }

  const variables = buildFormulaVariables(character, rankValue, effectiveTarget);

  let calc;
  try {
    calc = safeEvalFormula(commonSkill["계산식"], variables);
  } catch (e) {
    return (
      "[공용 스킬 계산 오류]\n" +
      displaySkillName + "\n\n" +
      "오류: " + e.message + "\n\n" +
      "계산식:\n```" +
      commonSkill["계산식"] +
      "```"
    );
  }

  let result = Math.floor(calc.value);
  const erosionMultiplier = getErosionMultiplier(erosion);

  let typeBonusText = "";
  const type = String(commonSkill["계열"] || "").trim();
  const tradition = String(commonSkill["계통"] || "").trim();
  if (type === "방호") {
    result += 3;
    typeBonusText = "방호 보정: +3\n";
  }

  let finalValue;
  let statusMod;
  let equipMod = { delta: 0, text: "" };
  try {
    finalValue = applyMods(result, mods);
    // 계열(type)·계통 둘 다 판정 유형 키로 사용 → 상태/장비 보정이 양쪽에 매칭.
    statusMod = applyStatusModifierToValue(alias, finalValue, [KIND_SKILL, type, tradition], effectiveTarget || "");
    finalValue = statusMod.value;
    if (condDetailMult !== 1) finalValue = Math.floor(finalValue * condDetailMult);
    if (condDetailBonus !== 0) finalValue += condDetailBonus;
    // 장비 계열/계통 보정: 공용 스킬 계열(type)·계통에 맞는 계열보정/계통보정 장비 합산.
    equipMod = getEquipmentModifier(alias, [KIND_SKILL, type, tradition]);
    finalValue += equipMod.delta;
    // 이면침식 배율은 모든 보정 완료 후 마지막에 적용
  } catch (e) {
    return (
      "[공용 스킬 판정 오류]\n" +
      displaySkillName + "\n\n" +
      "보정 처리 중 오류가 발생했습니다.\n\n" +
      "오류: " + e.message
    );
  }

  const beforeErosionMultiplier = finalValue;
  finalValue = Math.floor(finalValue * erosionMultiplier);

  const resultText = getSkillResultText(type, finalValue);
  const rawEffectText = String(commonSkill["효과"] || "").trim();

  // 공용 스킬을 processSkillEffects 호환 형태로 래핑 (스킬명 키 매핑)
  const skillForEffects = {
    "스킬명": displaySkillName,
    "계통":   commonSkill["계통"] || "",
    "계열":   type,
    "랭크":   rank,
    "계산식": commonSkill["계산식"] || "",
    "효과":   rawEffectText,
    "조건":   commonSkill["조건"] || "",
    "대가":   "",
    "설명":   commonSkill["설명"] || ""
  };

  const _efx = _buildSkillEffectResult({
    rawEffectText, skillForEffects,
    alias, targetAlias: effectiveTarget,
    rawTargets: targetSpec === "none" ? [] : (targetParsed.rawTargets || []),
    finalValue, type
  });
  if (!_efx.ok) return _efx.errorText;

  const { pendingId, healingDetailText, combatDetailText,
          interferenceDetailText, effectDetailText, effectSummary } = _efx;

  // 판정후 / 스킬사용후 트리거 패시브 (디메리트 침식 변경 등 포함)
  var postPassiveText = "";
  try {
    var charAfter = findCharacterByAlias(alias);
    if (charAfter) {
      var _ppCtx = {
        targetAlias: effectiveTarget, finalValue: finalValue,
        triggerArg: String(displaySkillName || ""), resistanceMode: RESIST_NONE
      };
      var _pp = [
        firePassiveTriggerEffects(charAfter, "판정후", _ppCtx),
        firePassiveTriggerEffects(charAfter, "스킬사용후", _ppCtx)
      ].filter(Boolean);
      if (_pp.length) postPassiveText = _pp.join("\n\n");
    }
  } catch (_e) { /* 패시브 시트 없거나 오류 → 무시 */ }

  const diceText = formatDiceLogs(calc.diceLogs);
  const statusModDetail = _formatJudgeModDetail(statusMod, equipMod);
  const condModLines =
    (condDetailMult !== 1 ? "세부조건 배율: ×" + condDetailMult + "\n" : "") +
    (condDetailBonus !== 0 ? "세부조건 보정: " + formatSigned(condDetailBonus) + "\n" : "");

  const summaryBlock = formatSkillSummaryBlock(
    skillForEffects,
    alias,
    effectiveTarget,
    rank,
    rankValue,
    finalValue,
    effectSummary,
    pendingId
  );

  let noTargetNote = "";
  if (noTargetMode) {
    if (type === "치유" || type === "재생") {
      noTargetNote = "\n처리: 대상 없음 → 자신 회복\n";
    } else {
      noTargetNote = "\n처리: 대상 없음 → 판정값만 출력\n" +
        "※ 대상이 필요한 자동 처리(공격 대기/저항 판정/대상 효과)는 생략되었습니다.\n";
    }
  }

  // ── 대가 지불 (공용 스킬) ──
  var commonCostResult = payCost(alias, displaySkillName, commonCostText, {
    userAlias: alias, targetAlias: effectiveTarget, finalValue: finalValue
  });
  var commonCostDetailText = commonCostResult.logs.length > 0
    ? "\n\n[대가 처리]\n" + commonCostResult.logs.join("\n")
    : "";

  const summary = "[공용 스킬]\n" + alias + " - " + displaySkillName + "\n\n" + summaryBlock + targetWarning + noTargetNote;

  const detail =
    (conditionHeaderText ? conditionHeaderText + "\n\n" : "") +
    (statusResult.fullText ? statusResult.fullText + "\n\n" : "") +
    "[공용 스킬 사용 상세]\n" +
    alias + " - " + displaySkillName + "\n\n" +
    "유형: " + status.type + "\n" +
    "해금레벨: " + status.unlockLevel + " (현재 Lv." + status.charLevel + ")\n" +
    "소속: " + getCharacterFaction(character) + "\n" +
    "종족: " + (getCharacterRaceText(character) || "-") + "\n\n" +
    "계통: " + (commonSkill["계통"] || "-") + "\n" +
    "계열: " + (type || "-") + "\n" +
    "랭크: " + rank + "(" + rankValue + ")\n\n" +
    "조건:\n" + (commonSkill["조건"] || "-") + "\n\n" +
    "대가:\n" + (commonCostText || "없음") + "\n\n" +
    "설명:\n" + (commonSkill["설명"] || "-") + "\n\n" +
    "주사위:\n" + diceText + "\n\n" +
    "계산식:\n```" + (commonSkill["계산식"] || "") + "```\n\n" +
    "대입식:\n```" + calc.expression + "```\n" +
    "계산 결과: " + Math.floor(calc.value) + "\n" +
    typeBonusText +
    "보정: " + (mods.join(" ") || "없음") + "\n" +
    (statusModDetail ? statusModDetail + "\n" : "") +
    condModLines +
    "이면침식: " + erosion + " / " + MAX_EROSION + "\n" +
    "침식단계: " + erosionStage + "\n" +
    "침식배율: ×" + erosionMultiplier + "\n" +
    "침식 전 값: " + beforeErosionMultiplier + "\n\n" +
    "최종값: " + finalValue + "\n" +
    resultText +
    healingDetailText +
    combatDetailText +
    interferenceDetailText +
    effectDetailText +
    commonCostDetailText +
    (postPassiveText ? "\n\n" + postPassiveText : "");

  return makeFoldedResponse(summary, detail);
}


// =====================================================================
// 인벤토리 · 장비 시스템 (1차 구현)
// =====================================================================

function ensureItemSheets() {
  var ss = _getSpreadsheet();
  function ensure(name, headers) {
    var sh = ss.getSheetByName(name);
    if (sh) return sh;
    sh = ss.insertSheet(name);
    sh.getRange(1, 1, 1, headers.length).setValues([headers]);
    sh.setFrozenRows(1);
    return sh;
  }
  ensure(SHEET_ITEM_DB,      ["id","이름","분류","슬롯","랭크","효과코드","수치","횟수","설명","메모"]);
  ensure(SHEET_INVENTORY_DB, ["id","소유자","아이템명","수량","상태","획득일"]);
  ensure(SHEET_EQUIPMENT_DB, ["id","소유자","슬롯","아이템명","장착일"]);

  // 기존 ITEM_DB에 랭크 컬럼이 없으면 추가(메타데이터 전용 등급, 계산 영향 없음).
  _ensureSheetColumn(SHEET_ITEM_DB, "랭크", "슬롯");
}

// 시트에 지정 헤더 컬럼이 없으면 추가한다. afterHeader가 있으면 그 컬럼 바로 뒤에 삽입,
// 없으면 맨 끝에 추가. 이미 있으면 아무것도 하지 않는다.
function _ensureSheetColumn(sheetName, colName, afterHeader) {
  var ss = _getSpreadsheet();
  var sh = ss.getSheetByName(sheetName);
  if (!sh) return;
  var lastCol = sh.getLastColumn();
  var headers = sh.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) { return String(h).trim(); });
  if (headers.indexOf(colName) >= 0) return;
  var afterIdx = afterHeader ? headers.indexOf(afterHeader) : -1;
  if (afterIdx >= 0) {
    sh.insertColumnAfter(afterIdx + 1);
    sh.getRange(1, afterIdx + 2).setValue(colName);
  } else {
    sh.getRange(1, lastCol + 1).setValue(colName);
  }
  invalidateSheetCache(sheetName);
}

function _makeItemId() {
  ensureItemSheets();
  var rows = getSheetData(SHEET_ITEM_DB);
  return "ITEM-" + String(rows.length + 1).padStart(4, "0");
}
function _makeInvId() {
  ensureItemSheets();
  var rows = getSheetData(SHEET_INVENTORY_DB);
  return "INV-" + String(rows.length + 1).padStart(4, "0");
}
function _makeEqId() {
  ensureItemSheets();
  var rows = getSheetData(SHEET_EQUIPMENT_DB);
  return "EQ-" + String(rows.length + 1).padStart(4, "0");
}

function getItemByName(name) {
  try {
    ensureItemSheets();
    var rows = getSheetData(SHEET_ITEM_DB);
    var n = String(name || "").trim().toLowerCase();
    return rows.find(function(r) {
      return String(r["이름"] || "").trim().toLowerCase() === n;
    }) || null;
  } catch(_e) { return null; }
}

function getInventoryRows(alias) {
  try {
    ensureItemSheets();
    return getSheetData(SHEET_INVENTORY_DB).filter(function(r) {
      return String(r["소유자"] || "").trim() === alias &&
             String(r["상태"]   || "").trim() === "ACTIVE" &&
             Number(r["수량"]   || 0) > 0;
    });
  } catch(_e) { return []; }
}

function getEquipmentRows(alias) {
  try {
    ensureItemSheets();
    return getSheetData(SHEET_EQUIPMENT_DB).filter(function(r) {
      return String(r["소유자"] || "").trim() === alias;
    });
  } catch(_e) { return []; }
}

function getEquipmentModifier(alias, checkTypes) {
  var delta = 0;
  var logs  = [];
  try {
    var eqRows = getEquipmentRows(alias);
    eqRows.forEach(function(eq) {
      var item = getItemByName(eq["아이템명"]);
      if (!item) return;
      var effectCode = String(item["효과코드"] || "").trim();
      var value = Number(item["수치"] || 0);
      if (!effectCode || !value) return;
      // 스탯/액션/계열/계통 보정. (이능보정은 구데이터 하위호환 별칭 → 계열로 취급)
      var m = effectCode.match(/^(스탯|액션|계열|계통|이능)보정:(.+)$/);
      if (!m) return;
      // 대상은 콤마로 여러 개 지정 가능: "계열보정:화력,간섭" / "계통보정:마술,주술".
      var targets = m[2].split(/[,，、]/).map(function(s){ return s.trim(); }).filter(Boolean);
      var types = (checkTypes || []).map(function(t){ return String(t||"").trim(); });
      var matched = types.indexOf("전체") >= 0 || targets.some(function(t){ return types.indexOf(t) >= 0; });
      if (!matched) return;
      delta += value;
      logs.push("[장비: " + String(eq["아이템명"]) + "]\n보정: " + formatSigned(value));
    });
  } catch(_e) {}
  return { delta: delta, text: logs.join("\n\n") };
}

function _applyEquipmentDamageModifier(alias, damage) {
  var logs = [];
  try {
    var eqRows = getEquipmentRows(alias);
    var delta = 0;
    eqRows.forEach(function(eq) {
      var item = getItemByName(eq["아이템명"]);
      if (!item) return;
      if (String(item["효과코드"] || "").trim() !== "피해감소") return;
      var v = Math.abs(Number(item["수치"] || 0));
      if (!v) return;
      delta -= v;
      logs.push("[장비: " + String(eq["아이템명"]) + "]\n피해 감소: " + formatSigned(-v));
    });
    damage = Math.max(0, damage + delta);
  } catch(_e) {}
  return { damage: damage, logs: logs };
}

function inventoryCommand(parts, displayName) {
  var alias;
  if (parts && parts.length >= 2) {
    alias = _resolveAliasFromTokens(parts, 1, 0).alias;
  } else {
    var self = findCharacter(displayName);
    if (!self) return "캐릭터를 찾을 수 없습니다. 디스코드 별명: " + displayName;
    alias = String(self["별명"]).trim();
  }
  if (!findCharacterByAlias(alias)) return "캐릭터를 찾을 수 없습니다: " + alias;
  var silver = getSilverByAlias(alias);
  var rows = getInventoryRows(alias);
  var lines = ["[인벤토리: " + alias + "]", "소지 은화: " + silver + "은화"];
  if (rows.length === 0) {
    lines.push("보유 아이템 없음");
  } else {
    rows.forEach(function(r) {
      lines.push("• " + String(r["id"]) + "  " + String(r["아이템명"]) + "  ×" + String(r["수량"]));
    });
  }
  return lines.join("\n");
}

function equipmentShowCommand(parts, displayName) {
  var alias;
  if (parts && parts.length >= 2) {
    alias = _resolveAliasFromTokens(parts, 1, 0).alias;
  } else {
    var self = findCharacter(displayName);
    if (!self) return "캐릭터를 찾을 수 없습니다. 디스코드 별명: " + displayName;
    alias = String(self["별명"]).trim();
  }
  if (!findCharacterByAlias(alias)) return "캐릭터를 찾을 수 없습니다: " + alias;
  var rows = getEquipmentRows(alias);
  if (rows.length === 0) return "[장착 장비: " + alias + "]\n장착 중인 장비 없음";
  var lines = ["[장착 장비: " + alias + "]"];
  rows.forEach(function(r) {
    var item = getItemByName(String(r["아이템명"]));
    var effectInfo = item ? ("  " + String(item["효과코드"] || "") + " " + (item["수치"] ? formatSigned(Number(item["수치"])) : "")) : "";
    var rankInfo = (item && String(item["랭크"] || "").trim()) ? " (랭크 " + String(item["랭크"]).trim() + ")" : "";
    lines.push("[" + String(r["슬롯"]) + "] " + String(r["아이템명"]) + rankInfo + effectInfo);
  });
  return lines.join("\n");
}

function itemGrantCommand(parts, displayName) {
  if (!parts || parts.length < 3) {
    return "사용법: !아이템지급 <캐릭터별명> <아이템명> [수량]\n(관리자 전용)";
  }
  var resolved = _resolveAliasFromTokens(parts, 1, 1);
  var alias = resolved.alias;
  if (!findCharacterByAlias(alias)) return "캐릭터를 찾을 수 없습니다: " + alias;
  var rest = resolved.rest.slice();
  var qty = 1;
  if (rest.length > 0 && !isNaN(Number(rest[rest.length - 1]))) {
    qty = Math.max(1, Number(rest.pop()));
  }
  var itemName = rest.join(" ").trim();
  if (!itemName) return "아이템명을 입력하세요.";
  if (!getItemByName(itemName)) return "ITEM_DB에 없는 아이템입니다: " + itemName;
  ensureItemSheets();
  appendRowByHeaders(SHEET_INVENTORY_DB, {
    id: _makeInvId(), 소유자: alias, 아이템명: itemName,
    수량: qty, 상태: "ACTIVE", 획득일: getNowText()
  });
  return "[아이템 지급]\n대상: " + alias + "\n아이템: " + itemName + " × " + qty;
}

function itemDeleteCommand(parts, displayName) {
  if (!parts || parts.length < 2) {
    return "사용법: !아이템삭제 <인벤토리id>\n예시: !아이템삭제 INV-0001\n(관리자 전용)";
  }
  var id = String(parts[1]).trim();
  ensureItemSheets();
  var rows = getSheetData(SHEET_INVENTORY_DB);
  var row = rows.find(function(r){ return String(r["id"]).trim() === id; });
  if (!row) return "인벤토리 항목을 찾을 수 없습니다: " + id;
  updateRowById(SHEET_INVENTORY_DB, "id", id, { 상태: "REMOVED", 수량: 0 });
  return "[아이템 삭제]\nid: " + id + "\n아이템: " + String(row["아이템명"]) + "\n소유자: " + String(row["소유자"]);
}

function equipCommand(parts, displayName) {
  if (!parts || parts.length < 2) return "사용법: !장비착용 [캐릭터별명] <아이템명>";
  var alias, itemName;
  var selfChar = findCharacter(displayName);
  if (selfChar && parts.length === 2) {
    alias = String(selfChar["별명"]).trim();
    itemName = String(parts[1]).trim();
  } else {
    var resolved = _resolveAliasFromTokens(parts, 1, 1);
    alias = resolved.alias;
    itemName = resolved.rest.join(" ").trim();
  }
  if (!findCharacterByAlias(alias)) return "캐릭터를 찾을 수 없습니다: " + alias;
  if (!itemName) return "아이템명을 입력하세요.";
  var item = getItemByName(itemName);
  if (!item) return "ITEM_DB에 없는 아이템입니다: " + itemName;
  if (String(item["분류"] || "").trim() !== "장비") return "장비 아이템이 아닙니다: " + itemName;
  var invRows = getInventoryRows(alias);
  var inInv = invRows.find(function(r){ return String(r["아이템명"]).trim() === itemName; });
  if (!inInv) return "인벤토리에 없는 아이템입니다: " + itemName;
  var slot = String(item["슬롯"] || "").trim();
  if (!slot) return "슬롯 정보가 없는 아이템입니다.";
  ensureItemSheets();
  var existing = getEquipmentRows(alias).find(function(r){ return String(r["슬롯"]).trim() === slot; });
  if (existing) {
    updateRowById(SHEET_EQUIPMENT_DB, "id", String(existing["id"]), { 아이템명: itemName, 장착일: getNowText() });
    return "[장비 교체]\n캐릭터: " + alias + "\n슬롯: " + slot + "\n" + String(existing["아이템명"]) + " → " + itemName;
  }
  appendRowByHeaders(SHEET_EQUIPMENT_DB, {
    id: _makeEqId(), 소유자: alias, 슬롯: slot, 아이템명: itemName, 장착일: getNowText()
  });
  return "[장비 착용]\n캐릭터: " + alias + "\n슬롯: " + slot + "\n아이템: " + itemName;
}

function unequipCommand(parts, displayName) {
  if (!parts || parts.length < 2) return "사용법: !장비해제 [캐릭터별명] <슬롯|아이템명>";
  var alias, target;
  var selfChar = findCharacter(displayName);
  if (selfChar && parts.length === 2) {
    alias  = String(selfChar["별명"]).trim();
    target = String(parts[1]).trim();
  } else {
    var resolved = _resolveAliasFromTokens(parts, 1, 1);
    alias  = resolved.alias;
    target = resolved.rest.join(" ").trim();
  }
  if (!findCharacterByAlias(alias)) return "캐릭터를 찾을 수 없습니다: " + alias;
  if (!target) return "슬롯 또는 아이템명을 입력하세요.";
  var eqRows = getEquipmentRows(alias);
  var row = eqRows.find(function(r){
    return String(r["슬롯"]).trim() === target || String(r["아이템명"]).trim() === target;
  });
  if (!row) return "장착 중인 장비를 찾을 수 없습니다: " + target;
  ensureItemSheets();
  var sh = _getSpreadsheet().getSheetByName(SHEET_EQUIPMENT_DB);
  var data = sh.getDataRange().getValues();
  var headers = data[0].map(function(h){ return String(h).trim(); });
  var idCol = headers.indexOf("id");
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][idCol]).trim() === String(row["id"]).trim()) { sh.deleteRow(i + 1); break; }
  }
  return "[장비 해제]\n캐릭터: " + alias + "\n슬롯: " + String(row["슬롯"]) + "\n아이템: " + String(row["아이템명"]);
}

function itemUseCommand(parts, displayName) {
  if (!parts || parts.length < 2) return "사용법: !아이템사용 <아이템명> [대상:별명]";
  var selfChar = findCharacter(displayName);
  if (!selfChar) return "캐릭터를 찾을 수 없습니다. 디스코드 별명: " + displayName;
  var alias = String(selfChar["별명"]).trim();

  var parsed      = parseTargetAndMods(parts.slice(1));
  var itemName    = parsed.mods.join(" ").trim();
  var targetAlias = parsed.target || alias;
  if (targetAlias === "자신") targetAlias = alias;
  if (!itemName) return "아이템명을 입력하세요.";

  var item = getItemByName(itemName);
  if (!item) return "ITEM_DB에 없는 아이템입니다: " + itemName;
  if (String(item["분류"] || "").trim() !== "소모품") return "소모품 아이템이 아닙니다: " + itemName;

  var invRows = getInventoryRows(alias);
  var invRow  = invRows.find(function(r){ return String(r["아이템명"]).trim() === itemName; });
  if (!invRow) return "인벤토리에 없는 아이템입니다: " + itemName;

  var effectCode = String(item["효과코드"] || "").trim();
  var value      = Number(item["수치"]     || 0);
  var itemCount  = Number(item["횟수"]     || 1);
  var result     = "";

  if (effectCode === "회복") {
    var healResult = applyHealingToCharacter(targetAlias, value);
    result = healResult.text || "[회복] " + formatSigned(value);
  } else {
    var m = effectCode.match(/^(스탯|액션|이능)보정:(.+)$/);
    var statusCat  = "강화";
    var statusCode = "enhance";
    var checkType  = "전체";
    if (m) {
      var kindMap = { "스탯": KIND_STAT, "액션": KIND_ACTION, "이능": KIND_POWER };
      checkType = (kindMap[m[1]] || "전체") + "," + m[2].trim();
    } else if (effectCode === "피해감소") {
      statusCat  = "쇠약강화";
      statusCode = "debuff";
    }
    ensureItemSheets();
    appendRowByHeaders(SHEET_STATUS_DB, {
      id: makeStatusId(), 상태: "ACTIVE", 대상: targetAlias,
      상태명: itemName, 분류: statusCat, 효과코드: statusCode,
      수치: value, 확률: 100, 누적확률: 0, 증가확률: 0, 최대확률: 100,
      발동타이밍: "판정시작", 대상판정: checkType,
      남은횟수: itemCount, 중복방식: "덮어쓰기",
      출처: "아이템:" + itemName, 메모: "", 생성일: getNowText(), 처리일: ""
    });
    result = "[효과 적용]\n상태: " + itemName + "\n효과: " + effectCode +
             " " + formatSigned(value) + "\n대상: " + targetAlias + "\n지속: " + itemCount + "회";
  }

  var newQty = Number(invRow["수량"]) - 1;
  if (newQty <= 0) {
    updateRowById(SHEET_INVENTORY_DB, "id", String(invRow["id"]), { 수량: 0, 상태: "REMOVED" });
  } else {
    updateRowById(SHEET_INVENTORY_DB, "id", String(invRow["id"]), { 수량: newQty });
  }
  var qtyNote = newQty <= 0 ? "\n(소진됨)" : "\n남은 수량: " + newQty;
  return "[아이템 사용]\n" + alias + " → " + itemName + qtyNote + "\n\n" + result;
}

// =====================================================================
// 인벤토리 JSON API (Discord 봇 UI 전용)
// doGet에서 ?api=inventory 로 진입. formatDiscordReply를 거치지 않고 JSON 반환.
// =====================================================================

function handleInventoryApi(e) {
  try {
    var action = String((e && e.parameter && e.parameter.action) || "").trim();
    var alias  = String((e && e.parameter && e.parameter.alias)  || "").trim();
    var invId  = String((e && e.parameter && e.parameter.invId)  || "").trim();
    var slot   = String((e && e.parameter && e.parameter.slot)   || "").trim();
    var target = String((e && e.parameter && e.parameter.target) || "").trim();

    if (!alias) return { ok: false, message: "alias가 필요합니다." };

    // 닉네임 → 정식 별명
    var charRow = findCharacterByAlias(alias);
    if (!charRow) return { ok: false, message: "캐릭터를 찾을 수 없습니다: " + alias };
    alias = String(charRow["별명"] || alias).trim();

    if (action === "view")    return _invApiView(alias);
    if (action === "equip")   return _invApiEquip(alias, invId);
    if (action === "unequip") return _invApiUnequip(alias, slot || invId);
    if (action === "use")     return _invApiUse(alias, invId, target);

    return { ok: false, message: "알 수 없는 action: " + action };
  } catch (err) {
    return { ok: false, message: "[인벤토리 API 오류] " + (err && err.message ? err.message : String(err)) };
  }
}

// 현재 인벤토리/장비 상태를 봇 UI 형식으로 반환.
function _invApiView(alias) {
  var invRows = getInventoryRows(alias);
  var items = invRows.map(function (r) {
    var item = getItemByName(r["아이템명"]) || {};
    return {
      invId:       String(r["id"] || ""),
      name:        String(r["아이템명"] || ""),
      category:    String(item["분류"]   || ""),
      slot:        String(item["슬롯"]   || ""),
      effect:      String(item["효과코드"] || ""),
      value:       (item["수치"] === undefined || item["수치"] === "") ? "" : Number(item["수치"]),
      quantity:    Number(r["수량"] || 0),
      description: String(item["설명"] || "")
    };
  });

  var eqRows = getEquipmentRows(alias);
  var equipment = eqRows.map(function (r) {
    var item = getItemByName(r["아이템명"]) || {};
    return {
      slot:   String(r["슬롯"]    || ""),
      name:   String(r["아이템명"] || ""),
      effect: String(item["효과코드"] || ""),
      value:  (item["수치"] === undefined || item["수치"] === "") ? "" : Number(item["수치"])
    };
  });

  return { ok: true, alias: alias, items: items, equipment: equipment };
}

// invId로 인벤토리 행을 찾는다 (ACTIVE, 수량>0).
function _invFindRowById(alias, invId) {
  var rows = getInventoryRows(alias);
  return rows.find(function (r) { return String(r["id"] || "").trim() === invId; }) || null;
}

// 장비 착용 (invId 기반). 같은 슬롯 자동 교체.
function _invApiEquip(alias, invId) {
  if (!invId) return { ok: false, message: "invId가 필요합니다." };
  var invRow = _invFindRowById(alias, invId);
  if (!invRow) return { ok: false, message: "인벤토리 항목을 찾을 수 없습니다: " + invId };

  var itemName = String(invRow["아이템명"] || "").trim();
  var item = getItemByName(itemName);
  if (!item) return { ok: false, message: "ITEM_DB에 없는 아이템입니다: " + itemName };
  if (String(item["분류"] || "").trim() !== "장비") return { ok: false, message: "장비 아이템이 아닙니다: " + itemName };

  var slot = String(item["슬롯"] || "").trim();
  if (!slot) return { ok: false, message: "슬롯 정보가 없는 아이템입니다." };

  ensureItemSheets();
  var existing = getEquipmentRows(alias).find(function (r) { return String(r["슬롯"]).trim() === slot; });
  if (existing) {
    updateRowById(SHEET_EQUIPMENT_DB, "id", String(existing["id"]), { 아이템명: itemName, 장착일: getNowText() });
    return Object.assign(_invApiView(alias), {
      ok: true,
      message: "[장비 교체] " + slot + ": " + String(existing["아이템명"]) + " → " + itemName
    });
  }

  appendRowByHeaders(SHEET_EQUIPMENT_DB, {
    id: _makeEqId(), 소유자: alias, 슬롯: slot, 아이템명: itemName, 장착일: getNowText()
  });
  return Object.assign(_invApiView(alias), { ok: true, message: "[장비 착용] " + slot + ": " + itemName });
}

// 장비 해제 (슬롯명 또는 invId 허용).
function _invApiUnequip(alias, slotOrInvId) {
  if (!slotOrInvId) return { ok: false, message: "슬롯 또는 invId가 필요합니다." };

  // invId면 아이템명으로 변환
  var target = slotOrInvId;
  var invRow = _invFindRowById(alias, slotOrInvId);
  if (invRow) target = String(invRow["아이템명"] || "").trim();

  var eqRows = getEquipmentRows(alias);
  var row = eqRows.find(function (r) {
    return String(r["슬롯"]).trim() === target || String(r["아이템명"]).trim() === target;
  });
  if (!row) return { ok: false, message: "장착 중인 장비를 찾을 수 없습니다: " + target };

  ensureItemSheets();
  var sh = _getSpreadsheet().getSheetByName(SHEET_EQUIPMENT_DB);
  var data = sh.getDataRange().getValues();
  var headers = data[0].map(function (h) { return String(h).trim(); });
  var idCol = headers.indexOf("id");
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][idCol]).trim() === String(row["id"]).trim()) { sh.deleteRow(i + 1); break; }
  }

  return Object.assign(_invApiView(alias), {
    ok: true,
    message: "[장비 해제] " + String(row["슬롯"]) + ": " + String(row["아이템명"])
  });
}

// 소모품 사용 핵심 — 인벤토리 행(invRow) 효과 적용 + 수량 차감. { ok, message } 반환.
// invId 기반(_invApiUse)·이름 기반(퀵슬롯/단축 명령) 양쪽에서 공유한다.
function _consumeInventoryRow(alias, invRow, target) {
  var itemName = String(invRow["아이템명"] || "").trim();
  var item = getItemByName(itemName);
  if (!item) return { ok: false, message: "ITEM_DB에 없는 아이템입니다: " + itemName };
  if (String(item["분류"] || "").trim() !== "소모품") return { ok: false, message: "소모품 아이템이 아닙니다: " + itemName };

  var targetAlias = String(target || "").trim() || alias;
  if (targetAlias === "자신") targetAlias = alias;
  // 대상 닉네임 정규화
  var tChar = findCharacterByAlias(targetAlias);
  if (tChar) targetAlias = String(tChar["별명"] || targetAlias).trim();

  var effectCode = String(item["효과코드"] || "").trim();
  var value      = Number(item["수치"] || 0);
  var itemCount  = Number(item["횟수"] || 1);
  var result     = "";

  if (effectCode === "회복") {
    var healResult = applyHealingToCharacter(targetAlias, value);
    result = healResult.text || "[회복] " + formatSigned(value);
  } else {
    var m = effectCode.match(/^(스탯|액션|이능)보정:(.+)$/);
    var statusCat  = "강화";
    var statusCode = "enhance";
    var checkType  = "전체";
    if (m) {
      var kindMap = { "스탯": KIND_STAT, "액션": KIND_ACTION, "이능": KIND_POWER };
      checkType = (kindMap[m[1]] || "전체") + "," + m[2].trim();
    } else if (effectCode === "피해감소") {
      statusCat  = "쇠약강화";
      statusCode = "debuff";
    }
    ensureItemSheets();
    appendRowByHeaders(SHEET_STATUS_DB, {
      id: makeStatusId(), 상태: "ACTIVE", 대상: targetAlias,
      상태명: itemName, 분류: statusCat, 효과코드: statusCode,
      수치: value, 확률: 100, 누적확률: 0, 증가확률: 0, 최대확률: 100,
      발동타이밍: "판정시작", 대상판정: checkType,
      남은횟수: itemCount, 중복방식: "덮어쓰기",
      출처: "아이템:" + itemName, 메모: "", 생성일: getNowText(), 처리일: ""
    });
    result = "[효과 적용] " + itemName + " (" + effectCode + " " + formatSigned(value) + ", " + itemCount + "회) → " + targetAlias;
  }

  var newQty = Number(invRow["수량"]) - 1;
  if (newQty <= 0) {
    updateRowById(SHEET_INVENTORY_DB, "id", String(invRow["id"]), { 수량: 0, 상태: "REMOVED" });
  } else {
    updateRowById(SHEET_INVENTORY_DB, "id", String(invRow["id"]), { 수량: newQty });
  }
  var qtyNote = newQty <= 0 ? " (소진됨)" : " (남은 수량: " + newQty + ")";
  return { ok: true, message: result + qtyNote };
}

// 소모품 사용 (invId 기반). 효과 적용 + 수량 차감. → 인벤토리 뷰 반환.
function _invApiUse(alias, invId, target) {
  if (!invId) return { ok: false, message: "invId가 필요합니다." };
  var invRow = _invFindRowById(alias, invId);
  if (!invRow) return { ok: false, message: "인벤토리 항목을 찾을 수 없습니다: " + invId };
  var r = _consumeInventoryRow(alias, invRow, target);
  if (!r.ok) return r;
  return Object.assign(_invApiView(alias), { ok: true, message: r.message });
}

// 이름 기반 아이템 사용 (퀵슬롯/단축 명령). { ok, message } 반환(뷰 미포함).
// 장비 아이템이면 장착 교체(스왑), 소모품이면 소모 처리.
function useInventoryItemByName(alias, itemName, target) {
  itemName = String(itemName || "").trim();
  if (!itemName) return { ok: false, message: "아이템명이 필요합니다." };
  var invRow = getInventoryRows(alias).find(function (r) {
    return String(r["아이템명"] || "").trim() === itemName;
  });
  if (!invRow) return { ok: false, message: "인벤토리에 없는 아이템입니다: " + itemName };
  var itemDef = getItemByName(itemName);
  if (itemDef && String(itemDef["분류"] || "").trim() === "장비") {
    return _swapEquipmentQuickslot(alias, itemName, itemDef);
  }
  return _consumeInventoryRow(alias, invRow, target);
}

// 장비 퀵슬롯 스왑: 퀵슬롯의 장비를 착용하고, 기존 착용 장비를 해당 퀵슬롯으로 이동.
function _swapEquipmentQuickslot(alias, itemName, itemDef) {
  var slot = String(itemDef["슬롯"] || "").trim();
  if (!slot) return { ok: false, message: "슬롯 정보가 없는 아이템입니다." };

  ensureItemSheets();

  // 현재 해당 슬롯의 착용 장비 확인
  var existing = getEquipmentRows(alias).find(function (r) {
    return String(r["슬롯"] || "").trim() === slot;
  });
  var oldItemName = existing ? String(existing["아이템명"] || "").trim() : "";

  // 장비 교체 또는 신규 착용
  if (existing) {
    updateRowById(SHEET_EQUIPMENT_DB, "id", String(existing["id"]), {
      아이템명: itemName, 장착일: getNowText()
    });
  } else {
    appendRowByHeaders(SHEET_EQUIPMENT_DB, {
      id: _makeEqId(), 소유자: alias, 슬롯: slot, 아이템명: itemName, 장착일: getNowText()
    });
  }

  // 이전 착용 장비를 해당 퀵슬롯 칸으로 교체 (스왑)
  var rowInfo = findCharacterRowByAlias(alias);
  if (rowInfo) {
    for (var i = 0; i < QUICKSLOT_FIELDS.length; i++) {
      if (String(rowInfo.character[QUICKSLOT_FIELDS[i]] || "").trim() === itemName) {
        setCellByHeader(rowInfo, QUICKSLOT_FIELDS[i], oldItemName);
        break;
      }
    }
  }

  // 무기 슬롯 교체 시 무기교체 상태 부여 (택티컬 시프트 등 연동용)
  if (slot === "무기") {
    try {
      appendRowByHeaders(SHEET_STATUS_DB, {
        id: makeStatusId(), 상태: "ACTIVE", 대상: alias,
        상태명: "무기교체", 분류: "지정", 효과코드: "기타",
        수치: 0, 확률: 100, 누적확률: 0, 증가확률: 0, 최대확률: 100,
        발동타이밍: "판정시작", 대상판정: "전체",
        남은횟수: 1, 중복방식: "덮어쓰기",
        출처: "장비교체:" + itemName, 메모: "", 생성일: getNowText(), 처리일: ""
      });
    } catch (_e) {}
  }

  _invalidateMyCharCache(alias);

  var lines = ["[장비 교체] " + slot + ": " + (oldItemName || "없음") + " → " + itemName];
  if (oldItemName) lines.push(oldItemName + " → 퀵슬롯으로 이동");
  if (slot === "무기") lines.push("무기교체 상태 부여됨 (1회)");
  return { ok: true, message: lines.join("\n") };
}

// ── 아이템 등록 (웹 빌더 배포용, 관리자 전용) ─────────────────────────
// payload: { 이름, 분류, 슬롯, 효과코드, 수치, 횟수, 설명, 메모 }
// 같은 이름이 있으면 갱신(id 유지), 없으면 새 id로 추가.
function registerItemFromPayload(item) {
  try {
    if (!item || typeof item !== "object") {
      return { ok: false, error: "item 데이터가 비어 있습니다." };
    }
    var name = String(item["이름"] || "").trim();
    if (!name) return { ok: false, error: "아이템 이름은 필수입니다." };

    var category = String(item["분류"] || "").trim();
    if (["소모품", "장비", "기타"].indexOf(category) < 0) {
      return { ok: false, error: "분류는 소모품/장비/기타 중 하나여야 합니다: " + category };
    }

    ensureItemSheets();

    var row = {
      이름:     name,
      분류:     category,
      슬롯:     String(item["슬롯"]    || "").trim(),
      랭크:     String(item["랭크"]    || "").trim(),
      효과코드: String(item["효과코드"] || "").trim(),
      수치:     (item["수치"] === undefined || item["수치"] === null || String(item["수치"]).trim() === "") ? "" : Number(item["수치"]),
      횟수:     (item["횟수"] === undefined || item["횟수"] === null || String(item["횟수"]).trim() === "") ? "" : Number(item["횟수"]),
      설명:     String(item["설명"] || "").trim(),
      메모:     String(item["메모"] || "").trim()
    };

    var existing = getItemByName(name);
    if (existing) {
      var existingId = String(existing["id"] || "").trim();
      updateRowById(SHEET_ITEM_DB, "id", existingId, row);
      return { ok: true, message: "아이템 갱신됨", id: existingId, name: name, mode: "updated" };
    } else {
      var id = _makeItemId();
      row["id"] = id;
      appendRowByHeaders(SHEET_ITEM_DB, row);
      return { ok: true, message: "아이템 등록됨", id: id, name: name, mode: "inserted" };
    }
  } catch (err) {
    return { ok: false, error: "[아이템 등록 오류] " + (err && err.message ? err.message : String(err)) };
  }
}

// 캐릭터 스킬 직접 등록(운영자 도구 → Vercel admin 검증 후 호출).
// (소유자 + 스킬명)으로 upsert. SKILL_DB 컬럼: 소유자/스킬명/계통/계열/랭크/계산식/효과/조건/대가/설명.
function registerSkillFromPayload(skill) {
  try {
    if (!skill || typeof skill !== "object") return { ok: false, error: "skill 데이터가 비어 있습니다." };
    var owner = String(skill["소유자"] || skill.owner || "").trim();
    var name  = String(skill["스킬명"] || skill.name || "").trim();
    if (!owner) return { ok: false, error: "소유자(캐릭터 별명)는 필수입니다." };
    if (!name)  return { ok: false, error: "스킬명은 필수입니다." };
    if (!findCharacterRowByAlias(owner)) return { ok: false, error: "소유자 캐릭터를 찾을 수 없습니다: " + owner };

    var now = getNowText();
    var row = {
      소유자:  owner,
      스킬명:  name,
      계통:    String(skill["계통"]   || "").trim(),
      계열:    String(skill["계열"]   || "").trim(),
      랭크:    String(skill["랭크"]   || "").trim(),
      계산식:  String(skill["계산식"] || "").trim(),
      효과:    String(skill["효과"]   || "").trim(),
      조건:    String(skill["조건"]   || "").trim(),
      대가:    String(skill["대가"]   || "").trim(),
      설명:    String(skill["설명"]   || "").trim(),
      승인자:  "aporia-portal",
      승인일:  now
    };

    // (소유자+스킬명) 일치 행 있으면 갱신, 없으면 추가.
    var data = getSheetData(SHEET_SKILL_DB);
    var idx = -1;
    for (var i = 0; i < data.length; i++) {
      if (String(data[i]["소유자"]).trim() === owner && String(data[i]["스킬명"]).trim() === name) { idx = i; break; }
    }

    if (idx >= 0) {
      var sh = _getSpreadsheet().getSheetByName(SHEET_SKILL_DB);
      var headers = getSheetHeaders(SHEET_SKILL_DB);
      var rowNum = idx + 2; // 헤더 1행 + 1-based
      headers.forEach(function (h, c) {
        if (row[h] !== undefined) sh.getRange(rowNum, c + 1).setValue(row[h]);
      });
      invalidateSheetCache(SHEET_SKILL_DB);
      invalidateGameDataCache();
      return { ok: true, message: "스킬 갱신됨", name: name, owner: owner, mode: "updated" };
    }

    appendRowByHeaders(SHEET_SKILL_DB, row);
    invalidateSheetCache(SHEET_SKILL_DB);
    invalidateGameDataCache();
    return { ok: true, message: "스킬 등록됨", name: name, owner: owner, mode: "inserted" };
  } catch (err) {
    return { ok: false, error: "[스킬 등록 오류] " + (err && err.message ? err.message : String(err)) };
  }
}

// 아이템 목록 조회 API (ITEM_DB 전체). doGet ?api=inventory&action=items 로도 접근 가능하게.
function getItemDbList() {
  try {
    ensureItemSheets();
    var rows = getSheetData(SHEET_ITEM_DB);
    return rows.map(function (r) {
      return {
        id:       String(r["id"]     || ""),
        name:     String(r["이름"]   || ""),
        category: String(r["분류"]   || ""),
        slot:     String(r["슬롯"]   || ""),
        rank:     String(r["랭크"]   || ""),
        effect:   String(r["효과코드"] || ""),
        value:    (r["수치"] === undefined || r["수치"] === "") ? "" : Number(r["수치"]),
        count:    (r["횟수"] === undefined || r["횟수"] === "") ? "" : Number(r["횟수"]),
        description: String(r["설명"] || ""),
        memo:     String(r["메모"]   || "")
      };
    }).filter(function (i) { return i.name; });
  } catch (e) { return []; }
}

// =====================================================================
// 은화(재화) + 상점(SHOP_DB) + 퀵슬롯 경제 시스템
// =====================================================================

// BOT_DB 은화/퀵슬롯 열 + SHOP_DB 시트를 멱등 보장.
function ensureEconomySheets() {
  try {
    _ensureSheetColumn(SHEET_BOT_DB, SILVER_FIELD, "현재체력");
    QUICKSLOT_FIELDS.forEach(function (c) { _ensureSheetColumn(SHEET_BOT_DB, c); });
  } catch (_e) { /* 열 추가 실패는 무시 (권한/시트 부재) */ }
  try {
    var ss = _getSpreadsheet();
    if (!ss.getSheetByName(SHEET_SHOP_DB)) {
      var sh = ss.insertSheet(SHEET_SHOP_DB);
      sh.getRange(1, 1, 1, 4).setValues([["아이템명", "가격", "공개", "메모"]]);
      sh.setFrozenRows(1);
    }
  } catch (_e) {}
}

// ── 은화 ───────────────────────────────────────────────────────────
function getSilverByAlias(alias) {
  var ch = findCharacterByAlias(alias);
  return ch ? Math.max(0, Math.floor(Number(ch[SILVER_FIELD] || 0))) : 0;
}

// 은화 가감. delta 음수면 차감(0 미만으로 내려가지 않음). { ok, before, after } 반환.
function addSilver(alias, delta) {
  ensureEconomySheets();
  var rowInfo = findCharacterRowByAlias(alias);
  if (!rowInfo) return { ok: false, error: "캐릭터를 찾을 수 없습니다: " + alias };
  if (rowInfo.headers.indexOf(SILVER_FIELD) < 0) {
    return { ok: false, error: "BOT_DB에 '" + SILVER_FIELD + "' 열이 없습니다. 시트에 열을 추가하세요." };
  }
  var before = Math.max(0, Math.floor(Number(rowInfo.character[SILVER_FIELD] || 0)));
  var after  = Math.max(0, before + Math.floor(Number(delta) || 0));
  setCellByHeader(rowInfo, SILVER_FIELD, after);
  _invalidateMyCharCache(alias);
  return { ok: true, before: before, after: after };
}

// ── 상점(SHOP_DB) ──────────────────────────────────────────────────
// 상점 카탈로그. ITEM_DB 정의를 조인해 효과/슬롯/설명까지 포함.
function getShopList() {
  try {
    ensureEconomySheets();
    return getSheetData(SHEET_SHOP_DB).map(function (r) {
      var name = String(r["아이템명"] || "").trim();
      if (!name) return null;
      var def = getItemByName(name) || {};
      var pub = String(r["공개"] == null ? "" : r["공개"]).trim().toLowerCase();
      return {
        name:     name,
        price:    Math.max(0, Math.floor(Number(r["가격"] || 0))),
        isPublic: !(pub === "false" || pub === "0" || pub === "n" || pub === "no" || pub === "비공개"),
        memo:     String(r["메모"] || ""),
        category: String(def["분류"]   || ""),
        slot:     String(def["슬롯"]   || ""),
        rank:     String(def["랭크"]   || ""),
        effect:   String(def["효과코드"] || ""),
        value:    (def["수치"] === undefined || def["수치"] === "") ? "" : Number(def["수치"]),
        count:    (def["횟수"] === undefined || def["횟수"] === "") ? "" : Number(def["횟수"]),
        description: String(def["설명"] || "")
      };
    }).filter(Boolean);
  } catch (_e) { return []; }
}

// 상점 품목 등록(관리자, Vercel admin 검증 후 호출). 아이템명 키 upsert.
// payload: { 아이템명, 가격, 공개, 메모 }
function registerShopItemFromPayload(payload) {
  try {
    if (!payload || typeof payload !== "object") return { ok: false, error: "shop 데이터가 비어 있습니다." };
    var name = String(payload["아이템명"] || payload.name || "").trim();
    if (!name) return { ok: false, error: "아이템명은 필수입니다." };
    if (!getItemByName(name)) return { ok: false, error: "ITEM_DB에 없는 아이템입니다: " + name };

    var priceRaw = (payload["가격"] != null) ? payload["가격"] : payload.price;
    var price = Math.max(0, Math.floor(Number(priceRaw) || 0));
    var pubRaw = (payload["공개"] != null) ? payload["공개"] : payload.public;
    var isPublic = !(pubRaw === false || String(pubRaw).trim().toLowerCase() === "false");

    ensureEconomySheets();
    var row = {
      아이템명: name,
      가격:     price,
      공개:     isPublic ? "TRUE" : "FALSE",
      메모:     String(payload["메모"] || payload.memo || "").trim()
    };
    var mode = upsertRowByKey(SHEET_SHOP_DB, "아이템명", name, row);
    invalidateSheetCache(SHEET_SHOP_DB);
    invalidateGameDataCache();
    return { ok: true, message: mode === "updated" ? "상점 갱신됨" : "상점 등록됨",
             name: name, price: price, mode: mode };
  } catch (err) {
    return { ok: false, error: "[상점 등록 오류] " + (err && err.message ? err.message : String(err)) };
  }
}

// 상점 품목 삭제(관리자).
function deleteShopItem(name) {
  try {
    ensureEconomySheets();
    var removed = deleteRowByKey(SHEET_SHOP_DB, "아이템명", String(name || "").trim());
    invalidateSheetCache(SHEET_SHOP_DB);
    invalidateGameDataCache();
    return { ok: !!removed, name: name };
  } catch (err) {
    return { ok: false, error: "[상점 삭제 오류] " + (err && err.message ? err.message : String(err)) };
  }
}

// ── 인벤토리 추가(스택) ────────────────────────────────────────────
// ACTIVE 동일 아이템 행이 있으면 수량 합산, 없으면 새 행 추가.
function _addToInventory(alias, itemName, qty) {
  ensureItemSheets();
  qty = Math.max(1, Math.floor(Number(qty) || 1));
  var existing = getInventoryRows(alias).find(function (r) {
    return String(r["아이템명"] || "").trim() === itemName;
  });
  if (existing) {
    var newQty = Math.max(0, Number(existing["수량"] || 0)) + qty;
    updateRowById(SHEET_INVENTORY_DB, "id", String(existing["id"]), { 수량: newQty });
    return newQty;
  }
  appendRowByHeaders(SHEET_INVENTORY_DB, {
    id: _makeInvId(), 소유자: alias, 아이템명: itemName,
    수량: qty, 상태: "ACTIVE", 획득일: getNowText()
  });
  return qty;
}

// ── 명령어: !은화 (GM 지급/차감, 다중 대상) ─────────────────────────
// !은화 <캐릭터1> [캐릭터2 ...] <금액(부호 가능)>
function silverGrantCommand(parts, displayName) {
  if (!parts || parts.length < 3) {
    return "사용법: !은화 <캐릭터1> [캐릭터2 ...] <금액>\n" +
           "예시: !은화 월하륜 아르 100   /   !은화 월하륜 -50\n" +
           "(금액 부호: + 지급 / - 차감)";
  }
  var amountTok = String(parts[parts.length - 1]).trim();
  if (!/^[+-]?\d+$/.test(amountTok)) return "마지막 인자는 금액(정수)이어야 합니다: " + amountTok;
  var amount = Number(amountTok);
  if (amount === 0) return "금액이 0입니다.";

  var aliases = parts.slice(1, parts.length - 1).map(function (t) { return String(t).trim(); }).filter(Boolean);
  if (aliases.length === 0) return "대상 캐릭터를 1명 이상 지정하세요.";

  var lines = [];
  aliases.forEach(function (a) {
    var ch = findCharacterByAlias(a);
    if (!ch) { lines.push("✗ " + a + ": 캐릭터 없음"); return; }
    var canonical = String(ch["별명"] || a).trim();
    var r = addSilver(canonical, amount);
    if (!r.ok) { lines.push("✗ " + canonical + ": " + (r.error || "실패")); return; }
    lines.push("• " + canonical + ": " + r.before + " → " + r.after + " (" + formatSigned(amount) + ")");
  });

  return "[은화 " + (amount >= 0 ? "지급" : "차감") + "]\n" + lines.join("\n");
}

// ── 명령어: !교환 (즉시 일방 양도) ─────────────────────────────────
// !교환 <상대> <아이템명> [수량]   |   !교환 <상대> 은화 <금액>
function tradeCommand(parts, displayName) {
  if (!parts || parts.length < 3) {
    return "사용법:\n!교환 <상대> <아이템명> [수량]\n!교환 <상대> 은화 <금액>\n" +
           "예: !교환 아르 회복약 2   /   !교환 아르 은화 30";
  }
  var giver = findCharacter(displayName);
  if (!giver) return "캐릭터를 찾을 수 없습니다. 디스코드 별명: " + displayName;
  var giverAlias = String(giver["별명"] || "").trim();

  var resolved = _resolveAliasFromTokens(parts, 1, 1);
  var toAlias = resolved.alias;
  var toChar = findCharacterByAlias(toAlias);
  if (!toChar) return "상대 캐릭터를 찾을 수 없습니다: " + toAlias;
  toAlias = String(toChar["별명"] || toAlias).trim();
  if (toAlias === giverAlias) return "자기 자신과는 교환할 수 없습니다.";

  var rest = resolved.rest.slice();
  if (rest.length === 0) return "교환할 아이템명 또는 '은화'를 입력하세요.";

  // 은화 교환
  if (rest[0] === "은화") {
    var amt = Math.floor(Number(rest[1]) || 0);
    if (amt <= 0) return "교환할 은화 금액을 양수로 입력하세요.";
    var bal = getSilverByAlias(giverAlias);
    if (bal < amt) return "은화가 부족합니다. 보유: " + bal;
    addSilver(giverAlias, -amt);
    var rr = addSilver(toAlias, amt);
    return "[은화 교환]\n" + giverAlias + " → " + toAlias + "\n금액: " + amt +
           "\n" + giverAlias + " 잔액: " + getSilverByAlias(giverAlias) +
           "\n" + toAlias + " 잔액: " + rr.after;
  }

  // 아이템 교환
  var qty = 1;
  if (rest.length > 1 && /^\d+$/.test(String(rest[rest.length - 1]))) {
    qty = Math.max(1, Number(rest.pop()));
  }
  var itemName = rest.join(" ").trim();
  if (!itemName) return "교환할 아이템명을 입력하세요.";

  var invRow = getInventoryRows(giverAlias).find(function (r) {
    return String(r["아이템명"] || "").trim() === itemName;
  });
  if (!invRow) return "인벤토리에 없는 아이템입니다: " + itemName;
  var have = Number(invRow["수량"] || 0);
  if (have < qty) return "수량이 부족합니다. 보유: " + have + " / 요청: " + qty;

  var newQty = have - qty;
  if (newQty <= 0) updateRowById(SHEET_INVENTORY_DB, "id", String(invRow["id"]), { 수량: 0, 상태: "REMOVED" });
  else updateRowById(SHEET_INVENTORY_DB, "id", String(invRow["id"]), { 수량: newQty });
  _addToInventory(toAlias, itemName, qty);

  return "[아이템 교환]\n" + giverAlias + " → " + toAlias + "\n아이템: " + itemName + " × " + qty +
         "\n" + giverAlias + " 남은 수량: " + Math.max(0, newQty);
}

// ── 퀵슬롯/단축 사용 ───────────────────────────────────────────────
// slotRef: 숫자(1~3, 퀵슬롯 번호) 또는 문자열(아이템명). [대상:XXX] 또는 첫 토큰을 대상으로.
function quickslotUseCommand(parts, displayName, slotRef) {
  var self = findCharacter(displayName);
  if (!self) return "캐릭터를 찾을 수 없습니다. 디스코드 별명: " + displayName;
  var alias = String(self["별명"] || "").trim();

  var target = "";
  var tail = (parts || []).slice(1);
  tail.forEach(function (t) {
    t = String(t || "").trim();
    if (t.indexOf("대상:") === 0 || t.indexOf("대상=") === 0) target = t.replace(/^대상[:=]/, "").trim();
  });
  if (!target && tail.length > 0 && tail[0].indexOf("대상") !== 0) target = tail[0];

  var itemName = "";
  if (typeof slotRef === "number") {
    var col = QUICKSLOT_FIELDS[slotRef - 1];
    itemName = String(self[col] || "").trim();
    if (!itemName) return "퀵슬롯" + slotRef + "에 등록된 아이템이 없습니다. 빌더 캐릭터 관리에서 등록하세요.";
  } else {
    itemName = String(slotRef || "").trim();
  }

  var r = useInventoryItemByName(alias, itemName, target);
  if (!r.ok) return r.message || "사용 실패";
  return "[" + itemName + " 사용]\n" + r.message;
}

// =====================================================================
// 내 캐릭터 관리 API (웹 빌더 전용)
// doGet ?api=mychar&secret=... 로 진입. Vercel이 JWT 검증 후 호출.
// =====================================================================

function handleMyCharApi(e) {
  try {
    var action   = String((e && e.parameter && e.parameter.action) || "").trim();
    var alias    = String((e && e.parameter && e.parameter.alias)  || "").trim();
    var field    = String((e && e.parameter && e.parameter.field)  || "").trim();
    var invId    = String((e && e.parameter && e.parameter.invId)  || "").trim();
    var slot     = String((e && e.parameter && e.parameter.slot)   || "").trim();
    var itemName = String((e && e.parameter && e.parameter.itemName) || "").trim();
    var qty      = Math.max(1, Math.floor(Number((e && e.parameter && e.parameter.qty) || 1)));
    var slotIndex = Math.floor(Number((e && e.parameter && e.parameter.slotIndex) || 0));

    if (!alias) return { ok: false, error: "alias가 필요합니다." };
    var charRow = findCharacterByAlias(alias);
    if (!charRow) return { ok: false, error: "캐릭터를 찾을 수 없습니다: " + alias };
    alias = String(charRow["별명"] || alias).trim();

    if (action === "view")      return _myCharViewCached(alias);
    if (action === "grow")      return _myCharGrow(alias, field);
    if (action === "equip")     return _myCharEquip(alias, invId);
    if (action === "unequip")   return _myCharUnequip(alias, slot || invId);
    if (action === "buy")       return _myCharBuy(alias, itemName, qty);
    if (action === "quickslot") return _myCharSetQuickslot(alias, slotIndex, itemName);

    return { ok: false, error: "알 수 없는 action: " + action };
  } catch (err) {
    return { ok: false, error: "[내캐릭터 API 오류] " + (err && err.message ? err.message : String(err)) };
  }
}

// 한 항목의 다음 성장 비용/최대 여부 계산.
function _growthInfo(character, field) {
  try {
    var g = calculateGrowthCostDelta(character, field);
    return { next: g.newValue, cost: g.need, isMax: false };
  } catch (_e) {
    return { next: null, cost: null, isMax: true };
  }
}

var MYCHAR_CACHE_TTL = 30; // 초

function _myCharCacheKey(alias) { return "mychar_v1_" + alias; }

function _myCharViewCached(alias) {
  try {
    var sc = CacheService.getScriptCache();
    var hit = sc.get(_myCharCacheKey(alias));
    if (hit) return JSON.parse(hit);
  } catch (_e) {}
  var result = _myCharView(alias);
  if (result && result.ok) {
    try {
      CacheService.getScriptCache().put(_myCharCacheKey(alias), JSON.stringify(result), MYCHAR_CACHE_TTL);
    } catch (_e) {}
  }
  return result;
}

function _invalidateMyCharCache(alias) {
  try { CacheService.getScriptCache().remove(_myCharCacheKey(alias)); } catch (_e) {}
}

function _myCharView(alias) {
  // view는 읽기 전용이므로 flush() 없이 직접 읽는다 (rereadCharacterRow는 flush 포함).
  var rowInfo = findCharacterRowByAlias(alias);
  if (!rowInfo) return { ok: false, error: "캐릭터 행을 찾을 수 없습니다: " + alias };
  var character = rowInfo.character;

  var budget = readCharacterBudget(character);
  var used   = calculateCharacterUsedPoints(character);
  var remain = budget - used;

  function buildGroup(fields) {
    var out = {};
    fields.forEach(function (f) {
      var cur = STAT_FIELDS.indexOf(f) >= 0
        ? String(character[f] || "E").trim()
        : Number(character[f] || 0);
      var gi = _growthInfo(character, f);
      out[f] = { current: cur, next: gi.next, cost: gi.cost, isMax: gi.isMax };
    });
    return out;
  }

  var stats    = buildGroup(STAT_FIELDS);
  var features = buildGroup(FEATURE_FIELDS);
  var profs    = buildGroup(PROF_FIELDS);

  // 소유 스킬
  var skills = getSheetData(SHEET_SKILL_DB)
    .filter(function (r) { return String(r["소유자"] || "").trim() === alias; })
    .map(function (r) {
      return {
        name:        String(r["스킬명"] || ""),
        tradition:   String(r["계통"]   || ""),
        series:      String(r["계열"]   || ""),
        rank:        String(r["랭크"]   || ""),
        formula:     String(r["계산식"] || ""),
        condition:   String(r["조건"]   || ""),
        cost:        String(r["대가"]   || ""),
        description: String(r["설명"]   || "")
      };
    });

  // 적용 가능한 패시브 (소유타입/소유키/해금레벨 필터 통과분)
  var passives = [];
  try {
    passives = getCandidatePassivesForCharacter(character).map(function (p) {
      return {
        key:         String(p["key"]   || ""),
        name:        String(p["이름"]   || p["key"] || ""),
        category:    String(p["분류"]   || ""),
        ownerType:   String(p["소유타입"] || ""),
        trigger:     String(p["발동"]   || ""),
        value:       String(p["수치"]   || ""),
        condition:   String(p["조건"]   || ""),
        effect:      String(p["효과"]   || ""),
        description: String(p["설명"]   || "")
      };
    });
  } catch (_e) { passives = []; }

  // 인벤토리 / 장비 (인벤토리 API 재사용)
  var view = _invApiView(alias);

  // 은화 + 퀵슬롯 (BOT_DB 열)
  var silver = Math.max(0, Math.floor(Number(character[SILVER_FIELD] || 0)));
  var quickslots = QUICKSLOT_FIELDS.map(function (f) { return String(character[f] || "").trim(); });

  return {
    ok: true,
    alias: alias,
    name:  String(character["이름"] || ""),
    race:  String(character["종족"] || ""),
    faction: String(character["소속"] || "무소속"),
    level: Number(character["레벨"] || 0),
    budget: budget, used: used, remain: remain,
    stats: stats, features: features, profs: profs,
    skills: skills,
    passives: passives,
    items: view.items || [],
    equipment: view.equipment || [],
    silver: silver,
    quickslots: quickslots
  };
}

function _myCharGrow(alias, field) {
  if (!field) return { ok: false, error: "성장할 항목(field)이 필요합니다." };
  if (STAT_FIELDS.indexOf(field) < 0 && FEATURE_FIELDS.indexOf(field) < 0 && PROF_FIELDS.indexOf(field) < 0) {
    return { ok: false, error: "성장 가능한 항목이 아닙니다: " + field };
  }
  var resultText = characterGrow(["!성장", alias, field], "web");
  var success = /\[성장 완료\]/.test(String(resultText));
  if (!success) {
    return { ok: false, error: String(resultText).split("\n").slice(0, 6).join("\n") };
  }
  _invalidateMyCharCache(alias);
  return Object.assign(_myCharView(alias), { ok: true, message: field + " 성장 완료" });
}

function _myCharEquip(alias, invId) {
  var r = _invApiEquip(alias, invId);
  if (!r.ok) return r;
  _invalidateMyCharCache(alias);
  return Object.assign(_myCharView(alias), { ok: true, message: r.message });
}

function _myCharUnequip(alias, slotOrInvId) {
  var r = _invApiUnequip(alias, slotOrInvId);
  if (!r.ok) return r;
  _invalidateMyCharCache(alias);
  return Object.assign(_myCharView(alias), { ok: true, message: r.message });
}

// 상점 구매 — 본인 은화로 결제 후 인벤토리 지급.
function _myCharBuy(alias, itemName, qty) {
  itemName = String(itemName || "").trim();
  qty = Math.max(1, Math.floor(Number(qty) || 1));
  if (!itemName) return { ok: false, error: "구매할 아이템명이 필요합니다." };

  var shopRow = getShopList().find(function (s) { return s.name === itemName; });
  if (!shopRow) return { ok: false, error: "상점에 없는 아이템입니다: " + itemName };
  if (!shopRow.isPublic) return { ok: false, error: "현재 판매하지 않는 아이템입니다: " + itemName };

  var unit = Math.max(0, Math.floor(Number(shopRow.price) || 0));
  var total = unit * qty;
  var silver = getSilverByAlias(alias);
  if (silver < total) {
    return { ok: false, error: "은화가 부족합니다. 필요: " + total + " / 보유: " + silver };
  }

  var pay = addSilver(alias, -total);
  if (!pay.ok) return pay;
  _addToInventory(alias, itemName, qty);

  _invalidateMyCharCache(alias);
  return Object.assign(_myCharView(alias), {
    ok: true,
    message: "[구매] " + itemName + " × " + qty + " (−" + total + " 은화, 잔액 " + pay.after + ")"
  });
}

// 퀵슬롯 지정/해제. slotIndex 1~3, itemName 빈 값이면 해제.
function _myCharSetQuickslot(alias, slotIndex, itemName) {
  slotIndex = Math.floor(Number(slotIndex) || 0);
  if (slotIndex < 1 || slotIndex > QUICKSLOT_FIELDS.length) {
    return { ok: false, error: "퀵슬롯 번호는 1~" + QUICKSLOT_FIELDS.length + " 입니다." };
  }
  itemName = String(itemName || "").trim();

  // 지정 시 인벤토리 보유 + 소모품/장비 아이템만 허용.
  if (itemName) {
    var inInv = getInventoryRows(alias).some(function (r) {
      return String(r["아이템명"] || "").trim() === itemName;
    });
    if (!inInv) return { ok: false, error: "인벤토리에 없는 아이템입니다: " + itemName };
    var def = getItemByName(itemName);
    if (!def) return { ok: false, error: "ITEM_DB에 없는 아이템입니다: " + itemName };
    var cat = String(def["분류"] || "").trim();
    if (cat !== "소모품" && cat !== "장비") {
      return { ok: false, error: "퀵슬롯에는 소모품 또는 장비만 등록할 수 있습니다: " + itemName };
    }
  }

  ensureEconomySheets();
  var rowInfo = findCharacterRowByAlias(alias);
  if (!rowInfo) return { ok: false, error: "캐릭터를 찾을 수 없습니다: " + alias };
  var col = QUICKSLOT_FIELDS[slotIndex - 1];
  if (rowInfo.headers.indexOf(col) < 0) return { ok: false, error: "BOT_DB에 '" + col + "' 열이 없습니다." };
  setCellByHeader(rowInfo, col, itemName);

  _invalidateMyCharCache(alias);
  return Object.assign(_myCharView(alias), {
    ok: true,
    message: itemName ? ("퀵슬롯" + slotIndex + " → " + itemName) : ("퀵슬롯" + slotIndex + " 해제")
  });
}

// =====================================================================
// PARTY SYSTEM — PARTY_DB
// =====================================================================

const PARTY_HEADERS = ["파티명", "멤버"];

function ensurePartySheet() {
  var ss = _getSpreadsheet();
  var sh = ss.getSheetByName(SHEET_PARTY_DB);
  if (sh) return sh;
  sh = ss.insertSheet(SHEET_PARTY_DB);
  sh.getRange(1, 1, 1, PARTY_HEADERS.length).setValues([PARTY_HEADERS]);
  sh.setFrozenRows(1);
  return sh;
}

function getPartyByName(partyName) {
  partyName = String(partyName || "").trim();
  if (!partyName) return null;
  try {
    ensurePartySheet();
    var rows = getSheetData(SHEET_PARTY_DB);
    for (var i = 0; i < rows.length; i++) {
      if (String(rows[i]["파티명"] || "").trim() === partyName) return rows[i];
    }
  } catch (_e) {}
  return null;
}

function getPartyMembers(partyName) {
  var row = getPartyByName(partyName);
  if (!row) return [];
  return String(row["멤버"] || "").split(/[,，、]+/).map(function(s) { return s.trim(); }).filter(Boolean);
}

// 별명이 속한 파티의 전체 멤버 목록 반환. 파티 미소속이면 빈 배열.
function getPartyMembersForAlias(alias) {
  alias = String(alias || "").trim();
  if (!alias) return [];
  try {
    ensurePartySheet();
    var rows = getSheetData(SHEET_PARTY_DB);
    for (var i = 0; i < rows.length; i++) {
      var members = String(rows[i]["멤버"] || "").split(/[,，、]+/).map(function(s) { return s.trim(); }).filter(Boolean);
      if (members.indexOf(alias) >= 0) return members;
    }
  } catch (_e) {}
  return [];
}

function getPartyNameForAlias(alias) {
  alias = String(alias || "").trim();
  if (!alias) return "";
  try {
    ensurePartySheet();
    var rows = getSheetData(SHEET_PARTY_DB);
    for (var i = 0; i < rows.length; i++) {
      var members = String(rows[i]["멤버"] || "").split(/[,，、]+/).map(function(s) { return s.trim(); }).filter(Boolean);
      if (members.indexOf(alias) >= 0) return String(rows[i]["파티명"] || "").trim();
    }
  } catch (_e) {}
  return "";
}

function dissolvePartyByName(partyName) {
  partyName = String(partyName || "").trim();
  if (!partyName) return false;
  try {
    var ss = _getSpreadsheet();
    var sh = ss.getSheetByName(SHEET_PARTY_DB);
    if (!sh) return false;
    var data = sh.getDataRange().getValues();
    for (var i = data.length - 1; i >= 1; i--) {
      if (String(data[i][0]).trim() === partyName) {
        sh.deleteRow(i + 1);
        invalidateSheetCache(SHEET_PARTY_DB);
        return true;
      }
    }
  } catch (_e) {}
  return false;
}

// !파티 파티명 캐릭터1 캐릭터2 ...
// !세션시작 파티명 캐릭터1 캐릭터2 ...  (동의어)
function createPartyCommand(parts, displayName) {
  if (!parts || parts.length < 3) {
    return "사용법: !파티 파티명 캐릭터1 캐릭터2 ...\n" +
      "파티를 구성하려면 파티명과 2명 이상의 캐릭터 별명을 지정하세요.\n" +
      "파티 해산: !fin 파티명\n" +
      "파티 목록: !파티목록\n" +
      "파티 정보: !파티정보 파티명";
  }

  var partyName = String(parts[1] || "").trim();
  if (!partyName) return "[파티 오류] 파티명이 비어 있습니다.";

  var memberTokens = parts.slice(2);
  var resolvedMembers = [];
  var notFound = [];

  memberTokens.forEach(function(t) {
    var c = findCharacterByAlias(t);
    if (c) {
      resolvedMembers.push(String(c["별명"] || t).trim());
    } else {
      notFound.push(t);
    }
  });

  if (notFound.length > 0) {
    return "[파티 오류] 다음 캐릭터 별명을 찾을 수 없습니다: " + notFound.join(", ");
  }
  if (resolvedMembers.length < 2) {
    return "[파티 오류] 파티는 최소 2명이 필요합니다.";
  }

  ensurePartySheet();

  // 기존 파티가 있으면 멤버 갱신, 없으면 새로 추가
  var ss = _getSpreadsheet();
  var sh = ss.getSheetByName(SHEET_PARTY_DB);
  var data = sh.getDataRange().getValues();
  var updated = false;
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === partyName) {
      sh.getRange(i + 1, 2).setValue(resolvedMembers.join(", "));
      updated = true;
      break;
    }
  }
  if (!updated) {
    appendRowByHeaders(SHEET_PARTY_DB, { 파티명: partyName, 멤버: resolvedMembers.join(", ") });
  }
  invalidateSheetCache(SHEET_PARTY_DB);

  return "[파티 " + (updated ? "갱신" : "구성") + "]\n" +
    "파티명: " + partyName + "\n" +
    "멤버 (" + resolvedMembers.length + "명): " + resolvedMembers.join(", ");
}

function partyListCommand() {
  try {
    ensurePartySheet();
    var rows = getSheetData(SHEET_PARTY_DB);
    if (!rows || rows.length === 0) return "[파티 목록] 현재 활성 파티가 없습니다.";
    var lines = ["[파티 목록]"];
    rows.forEach(function(r) {
      var name = String(r["파티명"] || "").trim();
      var members = String(r["멤버"] || "").trim();
      if (name) lines.push("• " + name + ": " + (members || "(멤버 없음)"));
    });
    return lines.join("\n");
  } catch (_e) {
    return "[파티 목록] 현재 활성 파티가 없습니다.";
  }
}

function partyInfoCommand(parts) {
  if (!parts || parts.length < 2) {
    return "사용법: !파티정보 파티명";
  }
  var partyName = String(parts[1] || "").trim();
  var row = getPartyByName(partyName);
  if (!row) return "[파티 정보] '" + partyName + "' 파티를 찾을 수 없습니다.";
  var members = getPartyMembers(partyName);
  return "[파티 정보]\n파티명: " + partyName + "\n멤버 (" + members.length + "명): " + members.join(", ");
}

// ── 세부조건/세부효과 파서 단위 테스트 (시트 쓰기 없음) ─────────────────
// Apps Script 편집기에서 실행 → 실행 로그(View > Logs)로 결과 확인.
function _testDetailEffects() {
  var out = [];

  // (1) "조건 => 효과" 화살표 분리
  var arrowCases = [
    "이면침식 <= 3 => 이면침식 = 3",
    "현재체력비율 <= 50 => 피해감소 = 5",
    "=> 회복보정 = 3",
    "상태부여 자신 집중 버프 enhance 수치:3 횟수:1"
  ];
  arrowCases.forEach(function (line) {
    var m = line.match(/^([\s\S]*?)\s*(?:=>|⇒|→)\s*([\s\S]*)$/);
    if (m) out.push("[화살표] 조건={" + m[1].trim() + "} 효과={" + m[2].trim() + "}");
    else   out.push("[화살표 없음] 효과={" + line + "}  (무조건 실행)");
  });

  // (2) 설정 표현식 파서
  ["이면침식 = 3", "이면침식 == 3", "피해감소 = 5", "회복보정 = 3",
   "상태부여 자신 집중", "스택설정 자신 혈인 =3"].forEach(function (eff) {
    var s = _parseSetEffect(eff);
    out.push("[설정파서] " + eff + " → " + (s ? (s.variable + " = " + s.value) : "null(명령으로 처리)"));
  });

  // (3) 조건 평가 (합성 컨텍스트)
  var ctx = { vars: { "이면침식": 2, "현재체력비율": 40 }, hasTarget: false };
  [["이면침식 <= 3", true], ["이면침식 <= 1", false],
   ["현재체력비율 <= 50", true]].forEach(function (c) {
    var r = evaluateConditionList(c[0], ctx);
    out.push("[조건] " + c[0] + " → ok=" + r.ok + " (기대 " + c[1] + ")");
  });

  // (4) 잘못된/허용 안 된 변수 설정 (시트 접근 없이 메시지만)
  out.push("[오류] " + applySetEffect("존재안함", "9", {}).split("\n")[0]);

  Logger.log(out.join("\n"));
  return out.join("\n");
}
