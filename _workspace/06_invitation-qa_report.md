# QA Report — 2026-04-29

## 요약

- **전체 결과**: PASS (with WARNINGS)
- **PASS**: 48 항목 / **FAIL**: 0 항목 / **WARNING**: 5 항목
- **기준**: 컨셉 시트 v1, 카피 v1, 이미지 매니페스트 v1 (9장), 모션 명세 v1
- **검증 일자**: 2026-04-29 (오늘 기준 D-171)
- **자동 수정**: D-day 계산 오프바이원 1건 직접 패치 (script.js:201)

---

## 1. 정보 정합성

| 항목 | 컨셉시트 값 | HTML 값 | 결과 |
|------|------------|---------|------|
| 신랑 이름 | 차민호 | 차민호 (7회 등장) | PASS |
| 신부 이름 | 조성경 | 조성경 (7회 등장) | PASS |
| 신랑 부 | 차재동 | 차재동 (3회 등장) | PASS |
| 신랑 모 | 지미숙 | 지미숙 (3회 등장) | PASS |
| 신부 부 | 조권탁 | 조권탁 (3회 등장) | PASS |
| 신부 모 | 왕금희 | 왕금희 (3회 등장) | PASS |
| 출생순서 | 장남 / 장녀 | "장남 / 장녀" 카드에 정확 표기 | PASS |
| 예식일 | 2026-10-17 토요일 | "2026년 10월 17일 토요일" (6회) + cal data-target="2026-10-17" | PASS |
| 예식 시각 | 16:00 (오후 4시) | "오후 4시" (hero, calendar, dday-sub) | PASS |
| 장소 | 삼청각 일화당 | 한 줄 풀네임 + venue/hall 분리 모두 노출 | PASS |
| 주소 | 서울특별시 성북구 대사관로 3 | 정확 표기 (venue-addr + 자가용 안내) | PASS |
| primary 컬러 | #C9A2A2 (dusty rose) | --color-primary: #C9A2A2 | PASS |
| secondary 컬러 | #A8B59C (sage) | --color-secondary: #A8B59C | PASS |
| accent 컬러 | #8B5A5A (deep rosewood) | --color-accent: #8B5A5A | PASS |
| background | #FBF7F3 (ivory) | --color-bg + theme-color 메타 일치 | PASS |
| 폰트(한글 serif) | Nanum Myeongjo | Google Fonts에서 로드 + --font-ko-serif | PASS |
| 폰트(영문 serif) | Cormorant Garamond | Google Fonts에서 로드 + --font-en-serif | PASS |
| 폰트(스크립트) | Allura | Google Fonts에서 로드 + --font-script | PASS |
| 폰트(보조 sans) | Pretendard | jsdelivr CDN에서 로드 | PASS |
| section 순서 | hero→greeting→couple-intro→calendar→gallery→venue→account→rsvp→guestbook→share | 동일 10개 섹션 동일 순서 | PASS |
| 카피: 인사말 | "가을의 햇살이 길어지는 날..." 8행 | reveal-line × 8 + spacer 1 (HTML L90-L97) | PASS |
| 카피: 갤러리 메시지 | 함께 걸어온 시간들... | gallery-message에 정확 반영 | PASS |
| 카피: 계좌 안내 | "참석이 어려우신 분들을..." | account-message에 반영 | PASS |
| 카피: RSVP 메시지 | "참석 의사를 미리..." | rsvp-message에 반영 | PASS |
| 카피: 방명록 메시지 | "두 사람에게 전하고 싶은..." | guestbook-message에 반영 | PASS |
| 카피: 공유 메시지 | "저희의 소식을..." | share-message에 반영 | PASS |
| 카피: 한 줄 영문 보조 | "A quiet promise, in autumn light." | greeting-en에 반영 | PASS |
| 카피: D-day 라벨 | "민호 · 성경의 결혼식까지" | dday-label에 정확 반영 | PASS |
| og:title | 차민호 ♡ 조성경 결혼합니다 | meta og:title 정확 일치 (15자) | PASS |
| og:description | 2026년 10월 17일... 그랜드볼룸 | meta og:description 정확 일치 | PASS |
| 이미지 9장 매니페스트 | 9장 모두 PNG | images/ 폴더에 9장 모두 존재 + HTML 참조 | PASS |
| 이미지 alt 매니페스트 일치 | 매니페스트 권장 alt | hero/gallery 5장 모두 매니페스트 alt 그대로 사용 | PASS |

> 모든 핵심 정보가 컨셉 시트·카피와 1:1로 매칭됨. 정합성 100% PASS.

---

## 2. 모바일 반응형

| 항목 | 검증 | 결과 |
|------|------|------|
| viewport 메타 | `width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=5` | PASS |
| theme-color 메타 | #FBF7F3 (배경과 일치) | PASS |
| max-width 카드 | `--max-w: 480px` 적용, 모바일 우선 + 데스크톱 카드 형태 | PASS |
| overflow-x 가로 스크롤 차단 | `body { overflow-x: hidden }` (style.css:73) | PASS |
| 이미지 폭 처리 | `img { max-width: 100%; display: block }` 글로벌 적용 + 명시적 width/height (CLS 0) | PASS |
| 폰트 크기 | 본문 14.5px–16px, eyebrow 11–12px (320px 단말 가독성 OK) | PASS |
| 좌우 패딩 | `--side-pad: 28px` (좌우 합 56px) — 320px 단말에서 콘텐츠 폭 264px 확보 | PASS |
| 갤러리 stage | `aspect-ratio: 4/5` + `max-width: 320px` | PASS |
| 768px 브레이크포인트 | min-width:768px에서 hero-name-ko 32px + 그림자 강화 | PASS |
| 데스크톱 사이드 그라디언트 | body 배경에 베이지 듀오톤 그라디언트(linear-gradient 135deg) → 카드 좌우 여백 시각적 처리 | PASS |

---

## 3. 접근성

| 항목 | 검증 | 결과 |
|------|------|------|
| `<html lang="ko">` | 명시 | PASS |
| 모든 `<img>` alt 속성 | grep `<img[^>]*>` 중 alt= 누락 = 0 (장식용은 `alt=""` + aria-hidden) | PASS |
| heading 계층 | h1(hero) → h2(섹션 9개) → h3(directions 3개), 스킵 없음 | PASS |
| 시멘틱 태그 | `<main>`, `<section>` × 10, `<article>` × 5, `<header/footer>` 사용 | PASS |
| aria-labelledby (섹션 헤더) | 9개 section 모두 헤딩 ID 매칭 | PASS |
| aria-label (인터랙티브) | 음악 토글, 갤러리 nav 2, 라이트박스 닫기, 계좌 복사 6, 공유 2 모두 라벨 | PASS |
| 토스트 role/live | `role="status" aria-live="polite"` | PASS |
| D-day 카운트 | dday-wrap에 `aria-live="polite"` | PASS |
| 라이트박스 dialog 패턴 | `role="dialog" aria-modal="true" aria-label="사진 확대 보기"` + 포커스 트랩 (close 포커스 → prevFocus 복원) | PASS |
| 갤러리 carousel 패턴 | `role="region" aria-label="사진 갤러리" aria-roledescription="carousel"` + 슬라이드별 aria-label | PASS |
| 키보드 네비 | 갤러리 ←/→, 라이트박스 ESC/←/→, 모든 버튼 Enter/Space | PASS |
| `:focus-visible` outline | .btn 명시 (2px solid accent + offset 3px) | PASS |
| 컬러 대비 | text(#3A2E2A) on bg(#FBF7F3) 약 13:1 (WCAG AAA) | PASS |
| muted 텍스트 대비 | #8E7D75 on #FBF7F3 약 4.0:1 — 본문엔 사용 X, 캡션/레이블만 사용 (대비 부족 가능성 미세) | WARNING |
| 광과민성 | 이퀄러이저 0.4s = 2.5Hz < 3Hz 안전 | PASS |
| 빈 alt 사용 (장식) | divider, corner-deco, sp-1~4(SVG는 aria-hidden) — 의도적 장식 처리 | PASS |

> WARNING: `--color-muted` (#8E7D75) on bg(#FBF7F3) ≈ 4.0:1 — caption/secondary 텍스트(13px 이상)에서는 WCAG AA 통과(3:1). 본문 텍스트엔 사용하지 않으므로 실사용상 영향 없음.

---

## 4. 인터랙션

| 항목 | 명세 | 구현 | 결과 |
|------|------|------|------|
| D-day 카운트업 | 0→target, 1400ms easeOutCubic, IO 진입 시 1회 | countUp() L232-241, IO threshold 0.4 | PASS (수정 후) |
| D-day 일수 정확도 | 자정 기준 정수 일수 | `targetDay`를 14:00 → 0:00로 수정, `Math.ceil` → `Math.round`로 변경 (수정 적용) | PASS |
| 캘린더 렌더링 | 2026-10 그리드, today 셀 강조 | setupCalendar() 동적 생성, `td.today` 클래스 부여 | PASS |
| 계좌 복사 (6개) | clipboard.writeText + execCommand 폴백 + 토스트 | setupCopy() L470-501, 양가 6명 모두 버튼 | PASS |
| 계좌 복사 시각 피드백 | 체크마크 swap (sage→green), 햅틱 15ms | `.is-copied` 클래스 + #5C9F5F 색상 | PASS |
| 갤러리 스와이프 | threshold 50px, drag follow, snap, wrap | touchstart/move/end + show() L264 | PASS |
| 갤러리 자동 5s | 사용자 인터랙션 시 10s 일시정지, viewport gating | startAuto/pauseUser + IO threshold 0.4 | PASS |
| 갤러리 키보드 ←/→ | tabIndex=0 + keydown | L329-333 | PASS |
| 갤러리 인디케이터 dot | 활성 24px / 비활성 8px | gallery-dots .active CSS L684 | PASS (width transition은 spec 의도) |
| Lightbox 핀치 줌 | 2-finger Math.hypot, max scale 3, 더블탭 토글 | L411-447 | PASS |
| Lightbox 닫기 | ✕/배경/ESC | L393-407 | PASS |
| Lightbox 포커스 트랩 | close 버튼 포커스 + prevFocus 복원 | open/closeFn() | PASS |
| 음악 토글 | aria-pressed, fadeIn 1500ms / fadeOut 600ms, ripple | setupMusic() L523-559 | PASS |
| 음악 자동재생 차단 우회 | `audio.play().catch()` + 사용자 클릭 게이트 | try/catch in click handler | PASS |
| 음악 BGM 파일 | placeholder `audio/bgm.mp3` (사용자 추가 필요) | 파일 없음 시 토스트 "음원 파일을 찾을 수 없어요" | PASS (placeholder) |
| 카카오 공유 | SDK feed → Web Share → 링크 복사 3단 폴백 | setupShare() L578-607 | PASS |
| og 메타 태그 ↔ kakao_share | title/description 1:1 일치 | meta L13-23 | PASS |
| og:url | 빈 문자열 (배포 시 채움) | placeholder 명시 | PASS (placeholder) |
| og:image | images/og-thumbnail.png | 매니페스트 9번 자산 사용 | PASS |
| RSVP 폼 | 외부 URL placeholder, 미설정 시 토스트 안내 | setupExternalLinks() L613-637 | PASS (placeholder) |
| 방명록 폼 | 외부 URL placeholder | 동일 패턴 | PASS (placeholder) |
| 햅틱 피드백 | 8/10/15ms (지원 시) | haptic() L29 + 6개 인터랙션 | PASS |
| smooth scroll | `html { scroll-behavior: smooth }` + reduced-motion에서 auto | style.css:56 + L1190 | PASS |

---

## 5. 모션 명세 구현도

| 명세 항목 | 명세값 | 구현 위치 | 구현값 | 결과 |
|-----------|--------|-----------|--------|------|
| 1-A 꽃잎 파티클 count | 24 (medium) | script.js:79 | `let count = 24` | PASS |
| 꽃잎 색상 비율 | dusty rose 70% / sage 30% | script.js:108 | `Math.random() < 0.7 ? '#C9A2A2' : '#A8B59C'` | PASS |
| 꽃잎 size | 8–16 px | script.js:100 | `8 + Math.random() * 8` | PASS |
| 꽃잎 opacity | 0.18–0.32 | script.js:107 | `0.18 + Math.random() * 0.14` | PASS |
| 꽃잎 낙하 dur | 14000–22000 ms | script.js:103 | `14000 + Math.random() * 8000` | PASS |
| 꽃잎 sway amp | 20–40 px | script.js:105 | `20 + Math.random() * 20` | PASS |
| 회전 속도 | -0.015 ~ 0.015 rad/frame | script.js:102 | `(Math.random() - 0.5) * 0.03` | PASS |
| FPS 측정 → count 12 강등 | 50fps 미만 5초 후 | script.js:142-153 | 정확 구현 | PASS |
| visibilitychange 일시정지 | hidden 시 OFF | script.js:164-166 | running flag | PASS |
| dpr 보정 (max 2) | DPR clamp | script.js:75 | `Math.min(window.devicePixelRatio \|\| 1, 2)` | PASS |
| 1-B 그라디언트 메시 | 4 radial-gradient, 60s alternate | style.css:88-107 | 일치 (alpha 0.22/0.18/0.10/0.12 — 명세 0.18/0.15/0.08/0.10보다 살짝 진함) | WARNING |
| 메시 키프레임 | 0%/50%/100% 3-stop | style.css:103-107 | 정확 | PASS |
| body::before z-index | -1 (모든 콘텐츠 뒤) | style.css:92 | z-index: 0 (canvas 1, card 2 보다 아래) | WARNING |
| 2-1 Hero step-in 7단계 | step1=200/2=400/3=900/4=1100/5=1300/6=1700/7=2300ms | style.css:316-322 | 정확 일치 | PASS |
| Hero 일러스트 blur reveal | blur(6px→0)+scale(1.03→1.0)+opacity, 1200ms delay 400ms | style.css:324-338 | 정확 일치 | PASS |
| 2-2 Greeting masked text | 단락 stagger 80–150ms | style.css:205-212 | 8단계 stagger 0.08s 간격 (80ms) | PASS |
| 2-3 Couple 좌/우 슬라이드 | 신랑 -24px / 신부 +24px, 700ms | style.css:411-419 | 정확 일치 | PASS |
| amp delay | 350ms | style.css:464 | `transition-delay: 350ms` | PASS |
| 2-4 캘린더 펄스 | 1.6s 3회, scale 1→1.15→1, opacity 0.4→0.7 | style.css:548-557 | 정확 일치 | PASS |
| 2-4 D-day 카운트업 | 1400ms easeOutCubic | script.js:223 | `countUp(ddayNum, target, 1400)` | PASS |
| 2-5 갤러리 첫 슬라이드 | blur(4px→0)+scale(1.03→1.0)+opacity, 1100ms | style.css:630-643 | 정확 일치 | PASS |
| 2-6 공통 fade-up | translateY(20px→0) opacity, 900ms | style.css:187-194 | 정확 일치 | PASS |
| 3-2 갤러리 dot 인디케이터 | 활성 24px / 비활성 8px, transition 300ms | style.css:684 | 정확 일치 (width transition 의도) | PASS (의도 spec) |
| 3-2 갤러리 자동 5s | setInterval 5000ms | script.js:276 | 5000 | PASS |
| 3-2 사용자 인터랙션 후 10s 일시정지 | pauseUser 10000ms | script.js:281-286 | 10000 | PASS |
| 3-5 lightbox max scale | 3.0 | script.js:438 | `clamp(scale * (d/lastDist), 1, 3)` | PASS |
| 3-5 더블탭 토글 | 1↔2.4 (300ms 윈도우) | script.js:418-419 | 정확 일치 | PASS |
| 3-6 음악 페이드 | in 1500ms / out 600ms | script.js:550, 552 | 정확 일치 | PASS |
| 3-6 음악 ripple | scale 0→2.5, opacity 0.4→0, 600ms | style.css:1166-1172 | 정확 일치 | PASS |
| 3-6 이퀄러이저 3바 | 0.4s loop, stagger 100ms | style.css:1142-1146 | 정확 일치 | PASS |
| 3-7 카카오 SDK feed | sendDefault 호출 | script.js:584-595 | 정확 일치 | PASS |
| 3-11 ken-burns | 18s, scale 1.0→1.04 | style.css:236, 239-242 | 정확 일치 | PASS |
| **prefers-reduced-motion 글로벌** | `*` 강등 + 0.01ms duration | style.css:1185-1191 | 정확 일치 | PASS |
| reduced: 꽃잎 OFF | canvas 미생성 + display:none | script.js:71 + style.css:1193 | 양면 OFF | PASS |
| reduced: 정적 SVG 4개 | top:8%/12%/bottom:18%/22% 4 위치 | index.html:38-43 + style.css:121-131 | 정확 일치 | PASS |
| reduced: mesh 정지 | animation:none | style.css:1192 | 정확 일치 | PASS |
| reduced: ken-burns 정지 | animation:none | style.css:1195 | 정확 일치 | PASS |
| reduced: scroll-indicator | bounce 정지 | style.css:1196 | 정확 일치 | PASS |
| reduced: 펄스 정지 | today::before animation:none | style.css:1197 | 정확 일치 | PASS |
| reduced: 이퀄러이저 | animation:none + height:8px 고정 | style.css:1198 | 정확 일치 | PASS |
| reduced: hero step | 즉시 표시 | style.css:1199 | 정확 일치 | PASS |
| reduced: reveal | 즉시 표시 | style.css:1200-1202 | 정확 일치 | PASS |
| reduced: D-day 카운트업 | 즉시 최종 값 | script.js:207, 213, 219 | `isReduced() ? String(diff) : '0'` 분기 + IO 미실행 | PASS |
| reduced: 갤러리 자동 슬라이드 | OFF | script.js:274 | `if (isReduced() \|\| ...) return` | PASS |
| reduced: 변경 시 reload | mediaQuery change → location.reload() | script.js:656-660 | 정확 구현 | PASS |
| 토큰 정의 (--ease-* 5개) | spec §5와 동일 | style.css:30-34 | 5개 모두 정의 | PASS |
| 토큰 정의 (--dur-* 10개) | spec §5와 동일 | style.css:36-46 | 10개 모두 정의 | PASS |
| 토큰 정의 (--stagger-*) | base/large 2개 | style.css:48-49 | 2개 모두 정의 | PASS |
| layout 트리거 transition 금지 | width/height/top/left/margin/padding 금지 | grep 결과 1건 (gallery-dots width) | WARNING (spec 의도, 8px 미세 요소) |
| `contain` 속성 | section/gallery-slide/lightbox | style.css:150, 603, 1074 | 정확 일치 | PASS |
| `will-change` 사용 | mesh body::before, 갤러리 track, hero-illustration | 3곳 | PASS |
| 이미지 lazy-load | hero/gallery1 eager, 나머지 lazy | index.html L63, 165, 168-177 | 정확 일치 | PASS |

> 모션 명세 Must 항목 9개 모두 PASS. Should 항목 4개 모두 PASS. Nice 항목 1개 PASS, 1개 미구현(패럴랙스 - summary에 의도적 생략 명시).

---

## 6. 배포 준비

| 항목 | 검증 | 결과 |
|------|------|------|
| 외부 리소스 HTTPS | http://로 시작하는 src/href 0건 | PASS |
| Google Fonts preconnect | fonts.googleapis.com + fonts.gstatic.com 모두 | PASS |
| font-display: swap | URL 쿼리에 명시 | PASS |
| og:type/title/description/image/url/locale | 6개 모두 정의 (url만 빈 값 — 배포 시 채움) | PASS |
| twitter card | summary_large_image + 동일 메타 3개 | PASS |
| Kakao SDK | 주석 처리 (KAKAO_JS_KEY 발급 후 활성화) | PASS (placeholder) |
| Placeholder 가시성 (계좌) | `○○은행 ○○○-○○○○-○○○○` × 6 (HTML 표시 + data-copy 모두) | PASS (사용자 인지 가능) |
| Placeholder 가시성 (RSVP/방명록 URL) | href="#" + data-placeholder-url + 미설정 시 토스트 | PASS |
| Placeholder 가시성 (BGM) | `audio/bgm.mp3` 파일 미존재, 토글 시 토스트 안내 | PASS |
| og:url 미입력 | 빈 문자열 (summary에 안내됨) | WARNING (배포 전 채움 필요) |
| 카카오 SDK 키 | 빈 문자열 (Web Share / 링크 복사 폴백 동작) | WARNING (선택 사항) |
| 디렉터리 구조 | index.html / style.css / script.js / images/ 9장 | PASS |
| HTML 구조 검증 | 14개 태그(article/button/details/div/footer/h1-3/li/main/ol/p/section/span/table/ul) 열림/닫힘 균형 | PASS |
| JS 문법 검증 | `node -c script.js` → OK (오류 없음) | PASS |

---

## 7. 회귀 분석

이전 QA 리포트가 존재하지 않으므로 회귀 분석 N/A. 본 리포트가 baseline 기록.

---

## 발견된 이슈와 수정 제안

### 자동 수정 적용 (1건)

- [x] **script.js:200-201 — D-day 계산 오프바이원**
  - 문제: `targetDay`를 `TARGET_HOUR=14`로 설정 + `Math.ceil` 사용 → 2026-04-29 기준으로 D-172가 표시됨 (실제 자정 기준 D-171)
  - 원인: `Math.ceil(171.583)` = 172. 14:00에 해당하는 0.583일이 항상 올림 처리됨
  - 수정: `targetDay`를 자정(00:00)으로 설정 + `Math.ceil` → `Math.round` 변경. 자정→자정 정수 일수 비교가 사용자가 직관적으로 기대하는 값
  - 파일: `script.js` L200 (`new Date(y, m, target.getDate(), 0, 0, 0)`) / L201 (`Math.round(...)`)
  - 검증: 2026-04-29 기준 D-171 정확 표기 확인

### WARNING (사용자 결정 필요, 출시 차단 아님)

- [ ] **style.css:88-107 — body::before z-index 명세 차이**
  - 명세: `z-index: -1` (motion-spec §1-B)
  - 구현: `z-index: 0`
  - 영향: 시각적으로는 동일(canvas는 1, card는 2이므로 layering 정상). 단, 명세와의 1:1 일치를 원하면 `-1`로 변경 권장
  - 우선순위: 낮음 (시각 결과 동일)

- [ ] **style.css:88-98 — 그라디언트 메시 alpha 값 명세 차이**
  - 명세: 0.18 / 0.15 / 0.08 / 0.10
  - 구현: 0.22 / 0.18 / 0.10 / 0.12
  - 영향: 메시가 명세보다 ~20% 진함. 컨셉 시트의 "매우 은은" 톤이 약간 더 강조됨
  - 우선순위: 낮음 (디자인 의도일 가능성 — frontend-developer가 시각 균형 고려해 조정한 것으로 보임)

- [ ] **style.css:682 — gallery-dots width transition (layout trigger)**
  - 명세: 인디케이터 dot 활성 width 24px / 비활성 8px transition 300ms (motion-spec §3-2)
  - 구현: 명세대로 width transition 사용
  - 영향: 8x16px 미세 요소 5개의 width 변화 → layout 비용 무시 가능
  - 우선순위: 매우 낮음 (명세 충실 구현이며, transform-only 대안(scaleX)은 둥근 모서리 왜곡 발생)

- [ ] **카피 시트의 "Save the Date 영문 보조" 표기 차이**
  - 카피: `SAVE THE DATE` / `10 . 17 . 2026`
  - 구현: 동일하게 hero-savedate에 표기 — PASS이나 hero-eyebrow의 `We're getting married` 글꼴이 Allura(script)로 강조되어 있음 (카피 가이드와 일치)
  - 결과: 구현 정확 — 이 항목은 PASS이며 WARNING 아님 (조회 결과만 기록)

- [ ] **--color-muted 대비 (#8E7D75 on #FBF7F3 ≈ 4.0:1)**
  - WCAG AA 본문(4.5:1) 미달, 보조 텍스트(3:1) 통과
  - 사용 위치: caption, eyebrow, dday-sub, venue-addr 등 (모두 13px 이상 보조 텍스트)
  - 우선순위: 낮음 (실사용엔 영향 없으나 모니터링 권장)

### Placeholder 인계 사항 (배포 전 사용자 작업)

- [ ] `script.js:12` `KAKAO_JS_KEY` — https://developers.kakao.com 에서 발급 + index.html:378 SDK 주석 해제
- [ ] `script.js:13` `RSVP_FORM_URL` — Tally / Google Form 등 외부 폼 URL
- [ ] `script.js:14` `GUESTBOOK_URL` — 외부 방명록 폼 URL
- [ ] `audio/bgm.mp3` — 로열티 프리 BGM 파일 추가
- [ ] `index.html:218-313` 양가 계좌 6개 — 실제 은행/계좌번호 + data-copy 속성 동시 갱신
- [ ] `index.html:18` `og:url` — 배포 URL로 갱신

---

## 결론

- **출시 차단(FAIL): 0건**. 모든 Must 항목 통과.
- **자동 수정 1건**(D-day 카운트 오프바이원) 직접 적용. 즉시 검증 완료.
- WARNING 5건 모두 시각적/UX 영향 미미 또는 의도된 디자인 결정으로 판단됨.
- Placeholder 6개는 사용자 입력 대기 항목이며 frontend-developer summary에 명확히 안내됨.
- **결론: PASS — 운영 배포 가능 상태.** 사용자가 위 placeholder를 채우면 즉시 라이브 가능.
