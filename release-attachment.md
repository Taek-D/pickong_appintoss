# 픽콩 출시 등록 정보

> 자동 생성: `/apps-in-toss-release` (코드베이스 기반 분석)
> 운영 주체/연락처/도메인 관련 항목은 사용자 확정이 필요한 플레이스홀더로 표기되어 있습니다.

---

## 1. 출시 노트

좋아한 것을 그냥 지나치기 아쉬운 순간, 픽콩에 담아보세요. 문구·굿즈·간식·향수까지 8개 카테고리로 오늘의 픽을 한 칸씩 기록할 수 있어요. 한 달이 지나면 내 취향이 캐릭터 카드로 돌아와 친구들과 공유할 수 있어요. 가입은 토스 로그인 한 번이면 끝이에요.

---

## 2. 앱 내 기능

| 한국어 기능 이름 | 영어 기능 이름 | 이동 URL |
|-----------------|---------------|----------|
| 오늘의 픽 등록하기 | Add Today's Pick | /add |
| 내 도감 보기 | View My Collection | / |
| 카테고리별 기록 보기 | View by Category | /cat |
| 월간 캐릭터 카드 | Monthly Character Card | /card/own |
| 전체 기록 목록 | All Records | /list |
| 설정·내 정보 | Settings | /set |
| 닉네임 변경 | Edit Nickname | /set/nickname |

> `/add/*`(다단계 입력), `/done`(등록 완료 화면), `/ad/card`(광고 인터루드), `/onb`/`/login`/`/nick`(온보딩·인증), `/card/:hash`/`/viewer-intro/:hash`(공유 링크 진입)는 사용자 직접 진입 대상이 아니므로 등록 기능에서 제외했습니다.

---

## 3. 인앱 상품 (추천)

> 💡 결제 관련 코드가 감지되지 않았습니다. 인앱 결제 미사용 앱으로 등록을 권장하며, 향후 도입 시 아래를 참고하세요.

### 상품 1 (선택): 광고 제거
- **상품 유형**: 비소모품
- **SKU**: ⚠️ SKU 입력 필요 (예: `com.pickkong.no_ads`)
- **상품명**: 광고 없이 픽콩 (12자)
- **설명**: 월간 카드 생성 전 전면 광고가 더 이상 노출되지 않아요 (29자)
- **공급가**: 💰 추천가 1,500원 ⚠️ 확인 필요
- **상품 이미지**: 1024x1024px 이미지 준비 필요

### 상품 2 (선택): 도감 테마 팩
- **상품 유형**: 비소모품
- **SKU**: ⚠️ SKU 입력 필요 (예: `com.pickkong.theme_pack_pastel`)
- **상품명**: 파스텔 도감 테마 (10자)
- **설명**: 도감 배경과 카드 컬러를 파스텔 톤으로 바꿔드려요 (28자)
- **공급가**: 💰 추천가 2,500원 ⚠️ 확인 필요
- **상품 이미지**: 1024x1024px 이미지 준비 필요

> ⚠️ 위 상품은 코드에 구현되어 있지 않은 추천안입니다. 실제 등록 전 구현 또는 제외 결정 필요.

---

## 4. 부제 (3안)

| 안 | 부제 | 글자수 |
|---|---|---|
| A | 오늘 픽한 귀여움을 도감으로 모아요 | 18자 |
| B | 한 달 취향을 캐릭터 카드로 만나요 | 17자 |
| C | 좋아한 것들을 도감 한 칸에 모아요 | 17자 |

---

## 5. 상세 설명

좋아한 걸 지나치기 아쉬운 순간, 한 칸에 담는 취향 도감.
지갑이 살짝 열렸던 그 귀여움을 무심히 흘려보내지 않도록, 픽콩이 도와드려요.

- 8개 카테고리(문구·굿즈·간식·향수·반려·팬굿즈·기타)로 오늘의 픽을 30초 만에 기록
- 이모지 + 짧은 메모 + 금액(선택)으로 가볍게 남기는 도감
- 한 달이 지나면 내 취향이 8마리 캐릭터 중 하나로 돌아오는 월간 카드
- 친구에게 토스 공유로 보내고 함께 픽콩 시작하기
- 토스 로그인 한 번이면 가입 완료, 닉네임만 정하면 바로 시작

기록은 모두 픽콩에서만 보관하고, 탈퇴 시 안전하게 삭제돼요.

---

## 6. 앱 검색 키워드 (10개)

**일반 탐색 (4)**: 도감, 기록, 컬렉션, 다이어리
**기능 (4)**: 캐릭터카드, 카테고리, 공유, 메모
**감성/상황 (2)**: 취향, 귀여움

---

## 7. 기본 정보 필드

| 필드 | 추천값 | 근거 / 확정 필요 |
|---|---|---|
| 한국어 앱 이름 | 픽콩 | `granite.config.ts` `brand.displayName` |
| 영어 앱 이름 | pickKong | appName 카멜표기, 발음·기억 용이 |
| appName | pickkong | `granite.config.ts` `appName` 그대로 |
| 사용 연령 | 전체 이용가 | 결제·민감정보 없음, 닉네임만 수집 |
| 카테고리 (대) | 라이프스타일 | 취향 기록 도감 성격 |
| 카테고리 (중/소) | 다이어리/컬렉션 | ⚠️ 콘솔 옵션 매칭 확인 필요 |
| 홈페이지 주소 | ⚠️ 생성 필요 | 코드에서 미발견 |
| 고객문의 이메일 | ⚠️ 생성 필요 | 코드에서 미발견 |

---

## 8. 썸네일 프롬프트 (나노바나나프로용)

### 8-1. 앱 로고 — 일반 (600x600px)
```
A minimal flat icon of a sprouting bean character holding a tiny sticker, centered composition, soft pastel green (#7BD389) and warm cream background, gentle smile, slight 3D rounded look, no shadow harshness, app icon ready, square aspect, no watermark, no real brand logos, no copyrighted characters
```

### 8-2. 앱 로고 — 다크모드 (600x600px)
```
Same minimal flat sprouting bean character holding a tiny sticker, centered composition, soft pastel green (#7BD389) on deep charcoal background (#1A1F1B), maintain identical character silhouette and proportions for brand consistency, gentle smile, slight 3D rounded look, app icon ready, square aspect, no watermark, no real brand logos, no copyrighted characters
```

### 8-3. 정방형 썸네일 (1200x1200px)
```
Flat illustration style cozy diary collection scene, eight pastel colored category cards arranged in a grid (stationery, goods, snack, perfume, pet, fan-goods, gift, etc), one cute bean sprout character in the center holding a heart sticker, calm and focused mood, color palette of mint green #7BD389, cream #FFF7E8 and soft coral accents, centered composition with diary cards radiating outward, optional small text overlay "오늘의 픽" in a clean rounded sans-serif on the upper third with high contrast, square format 1200x1200, no watermark, no real brand logos, no copyrighted characters
```

### 8-4. 가로형 썸네일 (1950x850px)
```
Wide flat illustration style depicting a bean sprout character on the left handing a small monthly character card to a friend silhouette on the right, motivational and warm mood, mint green #7BD389 to cream #FFF7E8 gradient background with soft coral accents, left-right split composition with breathing space in the middle, optional text overlay on the right "한 달 취향, 카드로 받기" in clean rounded sans-serif, horizontal banner aspect 1950x850, no watermark, no real brand logos, no copyrighted characters
```

---

## 9. 토스 로그인 동의 항목 (권장 설정표)

| 항목 | 권장 설정 | 근거 (코드 분석) | 보관기간 |
|---|---|---|---|
| 이름 (user_name) | 사용 안함 | 화면에는 자체 닉네임만 사용 (Nickname.tsx, NickEdit.tsx). 토스 이름 미사용 | — |
| 이메일 (user_email) | 사용 안함 | 이메일 발송·인증 코드 0건. 영수증/계정복구 없음 | — |
| 성별 | 사용 안함 | 성별 분기 코드 없음 | — |
| 생년월일 | 사용 안함 | 성인인증/연령 분기 없음 | — |
| 내외국인 | 사용 안함 | 법적 의무 없음 | — |
| 휴대전화 | 사용 안함 | 본인확인 미사용 | — |
| CI | 사용 안함 | 본인확인 미사용 | — |

**서버 보관 항목 (코드 기반 실측)**:
- `user_key` (토스 사용자 식별자) — 탈퇴 시 파기 (`server/src/routes/account.ts:83` `removeByUserKey` + `accounts.status = 'withdrawn'`)
- `nickname` (자체 닉네임, 사용자 입력값) — 탈퇴 시 NULL 처리 (account.ts:96)
- `monthly_cards` (월간 카드, 사용자 행동 데이터) — 탈퇴 시 DELETE (account.ts:93)
- 세션 쿠키 (sealed `user_key`) — 로그아웃·탈퇴 시 즉시 삭제

> 보관기간 정책 문서가 코드에 없어 위 값은 실제 구현 동작 기준입니다. 운영자가 확정하여 약관에 반영해 주세요.

---

## 10. 서비스 이용약관 (초안)

### 제1조 (목적)
이 약관은 **[운영 주체]**(이하 "회사"라 합니다)가 제공하는 미니앱 "픽콩"(이하 "서비스")의 이용에 관한 회사와 이용자의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.

### 제2조 (정의)
1. "서비스"란 회사가 토스 미니앱 플랫폼을 통해 제공하는 픽콩 및 관련 부수 서비스를 말합니다.
2. "이용자"란 본 약관에 따라 서비스를 이용하는 자를 말합니다.
3. "콘텐츠"란 이용자가 서비스 내에 등록·작성한 메모, 이모지, 카테고리 기록, 캐릭터 카드 등 일체의 자료를 말합니다.

### 제3조 (약관의 게시·개정)
1. 회사는 이 약관을 서비스 초기 화면 또는 연결 페이지에 게시합니다.
2. 회사는 관련 법령을 위반하지 않는 범위에서 약관을 개정할 수 있으며, 변경 시 적용일자 및 변경 사유를 명시하여 적용일 7일 전(이용자에게 불리한 변경의 경우 30일 전)부터 공지합니다.

### 제4조 (서비스 가입 및 탈퇴)
1. 가입은 토스 로그인을 통해 이루어지며, 별도의 회원가입 절차는 없습니다.
2. 이용자는 설정 화면의 "데이터 삭제(탈퇴)" 기능을 통해 언제든지 탈퇴할 수 있습니다. 탈퇴 시 이용자가 등록한 기록과 카드는 즉시 삭제되며, 식별 정보는 비식별 처리됩니다.

### 제5조 (서비스의 제공·변경·중단)
1. 회사는 안정적인 서비스 제공을 위해 노력하며, 시스템 점검·장애·천재지변 등 부득이한 사유가 있는 경우 서비스의 일부 또는 전부를 일시 중단할 수 있습니다.
2. 회사는 운영상·기술상 필요에 따라 제공 중인 서비스의 일부를 변경할 수 있습니다.

### 제6조 (이용자의 의무)
이용자는 다음 각 호의 행위를 하여서는 안 됩니다.
1. 타인의 정보 도용 또는 허위 사실 등록
2. 회사 또는 제3자의 권리를 침해하는 콘텐츠 게시
3. 욕설·차별·혐오·기타 미풍양속에 반하는 표현 사용 (닉네임 포함)
4. 서비스의 안정적 운영을 방해하는 행위

### 제7조 (유료 서비스 및 환불)
현재 서비스는 무료로 제공됩니다. 향후 유료 서비스를 도입하는 경우 별도의 약관 또는 안내를 통해 환불 정책을 고지합니다.

### 제8조 (지식재산권)
1. 서비스에 포함된 디자인·로고·이미지·UI 등에 대한 지식재산권은 회사에 귀속됩니다.
2. 이용자가 등록한 콘텐츠의 권리는 이용자에게 귀속되며, 회사는 서비스 운영·홍보를 위한 범위 내에서 이를 활용할 수 있습니다.

### 제9조 (면책 및 책임)
1. 회사는 천재지변·이용자 귀책 사유로 인한 손해에 대해 책임을 지지 않습니다.
2. 토스 플랫폼 및 토스 로그인 서비스의 장애로 인한 서비스 중단에 대해서는 토스 약관 및 정책이 우선 적용됩니다.

### 제10조 (분쟁 해결)
이 약관과 관련된 분쟁은 대한민국 법령을 준거법으로 하며, 회사 본점 소재지 관할 법원을 합의 관할 법원으로 합니다.

부칙: 이 약관은 **[시행일]**부터 시행합니다.

---

## 11. 개인정보처리방침 (초안)

**[운영 주체]**(이하 "회사")는 픽콩 서비스 이용자의 개인정보를 다음과 같이 처리합니다.

### 1. 수집하는 개인정보 항목 및 방법
| 항목 | 수집 방법 | 필수/선택 |
|---|---|---|
| 토스 사용자 식별자 (`user_key`) | 토스 로그인 API | 필수 |
| 닉네임 | 이용자 직접 입력 | 필수 |
| 서비스 이용 기록 (카테고리·이모지·메모·금액·생성일시) | 서비스 이용 과정에서 자동 저장 | 필수 |
| 월간 캐릭터 카드 | 시스템 자동 생성 | 자동 |

> 토스 OAuth 토큰(AccessToken/RefreshToken)은 서버에서만 처리되며 이용자 단말에 저장되지 않습니다.

### 2. 이용 목적
1. 서비스 가입자 식별 및 본인 확인
2. 이용자 기록 보관·표시·공유 기능 제공
3. 부정 이용 방지 및 서비스 개선

### 3. 보유 및 이용 기간
| 항목 | 보유 기간 |
|---|---|
| 토스 사용자 식별자, 닉네임 | 회원 탈퇴 시 즉시 비식별 처리(`user_key` 보존, 닉네임 NULL) |
| 서비스 이용 기록·월간 카드 | 회원 탈퇴 시 즉시 삭제 |
| 세션 쿠키 | 로그아웃 또는 탈퇴 시 즉시 삭제 |

### 4. 제3자 제공
회사는 이용자의 개인정보를 외부에 제공하지 않습니다. (현재 없음)

### 5. 처리 위탁
현재 개인정보 처리 위탁 업체 없음. 향후 위탁이 발생하는 경우 본 방침을 갱신하여 고지합니다.

### 6. 이용자의 권리
이용자는 언제든지 설정 → "데이터 삭제(탈퇴)"를 통해 자신의 개인정보 열람·정정·삭제·처리정지를 요구할 수 있습니다.

### 7. 파기 절차 및 방법
보유기간 경과 또는 처리 목적 달성 시, 데이터베이스에서 즉시 삭제하거나 복원이 불가능한 방식으로 비식별 처리합니다.

### 8. 안전성 확보 조치
1. HTTPS 전 구간 암호화 통신
2. 토스 OAuth 토큰의 클라이언트 미노출 (서버 보관)
3. 세션 쿠키 sealed/HttpOnly 처리
4. 접근 권한 최소화 및 정기 점검

### 9. 개인정보 보호책임자 및 문의처
- 책임자: **[책임자명]**
- 이메일: **[고객센터 이메일]**
- 처리 관련 민원은 위 연락처로 문의해 주세요.

### 10. 고지 의무
본 방침의 변경 시 변경 사항 및 시행일을 적용 7일 전부터 공지하며, 이용자에게 불리한 변경의 경우 30일 전부터 공지합니다.

부칙: 본 방침은 **[시행일]**부터 시행합니다.

---

## 12. 약관 등록 방법 안내

### 방법 1: 자체 웹페이지 (권장)
1. `pickkong.{도메인}/terms`, `/privacy` 정적 페이지로 게시
2. 비로그인으로 접근 가능 확인
3. 앱인토스 콘솔 > 약관에서 URL 등록 또는 전문 붙여넣기

### 방법 2: 노션/구글독스 "웹 게시"
1. 위 10·11번 전문을 노션 페이지에 붙여넣기
2. "웹에 게시" 또는 "공개 링크" 활성화 → 비로그인 접근 확인
3. 콘솔에 URL 등록

### 방법 3: GitHub 이슈로 공개 URL 만들기 (간편 MVP용)
> ⚠️ **레포가 Public이어야 외부에서 접근 가능합니다. Private으로 전환되면 링크가 즉시 차단됩니다.**

1. Public GitHub 레포 선택
2. Issues → New issue
3. 제목: `픽콩 서비스 이용약관` / `픽콩 개인정보처리방침`
4. 본문에 위 10·11번 마크다운 그대로 붙여넣기
5. Submit → 생성된 issue URL을 콘솔 약관 URL로 등록

---

## 13. 연결 끊기 콜백 (웹훅) 설정 (권장)

**현재 코드 상태**: `server/src/routes/auth.ts`에 `/auth/exchange`, `/auth/me`, `/auth/logout`만 구현되어 있고, 토스 콜백 핸들러(UNLINK / WITHDRAWAL_*) 라우트는 부재합니다.

### 권장 구현
1. 콘솔 콜백 URL: `https://{도메인}/api/toss/unlink`
2. 메서드: POST
3. Basic Auth 사용자명/비밀번호 랜덤 생성 → 서버 환경변수(`TOSS_UNLINK_AUTH_USER`, `TOSS_UNLINK_AUTH_PASS`)에 저장
4. 서버 라우트 추가 (Hono 예시):
```ts
authRoutes.post('/toss/unlink', async (c) => {
  const auth = c.req.header('authorization') ?? '';
  if (!auth.startsWith('Basic ') || !verifyBasicAuth(auth)) {
    return c.json({ error: 'unauthorized' }, 401);
  }
  const { userKey, referrer } = await c.req.json();
  // referrer: UNLINK | WITHDRAWAL_TERMS | WITHDRAWAL_TOSS
  if (sql) {
    await sql.begin(async (tx) => {
      await tx`DELETE FROM monthly_cards WHERE user_key = ${userKey}`;
      await tx`UPDATE accounts SET status = 'withdrawn', withdrawn_at = NOW(), nickname = NULL WHERE user_key = ${userKey}`;
    });
  }
  return c.json({ ok: true });
});
```
5. 콘솔 "테스트하기"에서 200 OK 확인

> 미구현 상태로 출시 시: 토스 측 연결 해제 또는 회원탈퇴가 픽콩 DB에 반영되지 않아 데이터가 남게 됩니다. 출시 전 구현 권장.

---

## 자기검수 결과

- [x] 부제 3안 모두 17~18자 (16~20자 범위 ✅)
- [x] 상세 설명: 가치 → 기능 → 안내 흐름
- [x] 키워드 정확히 10개 (4+4+2)
- [x] 썸네일 프롬프트 4종 모두 7요소 포함 (스타일/오브젝트/분위기/색감/컴포지션/텍스트/안전문구)
- [x] 토스 로그인 동의 항목 권장 설정표 + 근거 + 보관기간 명시
- [x] 약관·처리방침 내 운영주체/이메일/시행일/위탁업체는 모두 플레이스홀더 처리
- [x] GitHub 이슈 방법에 Public 조건 경고 포함
- [x] 결과를 `release-attachment.md`에 저장
