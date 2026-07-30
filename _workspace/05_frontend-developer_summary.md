# Frontend Developer Summary — 차민호 ♡ 조성경 청첩장

> 산출 일자: 2026-04-29
> 산출물: `index.html`, `style.css`, `script.js`
> 입력: 컨셉 시트 v1, 카피 v1, 이미지 매니페스트 v1 (9장), 모션 명세 v1
> 목표: 모바일 우선 단일 페이지 + 즉시 배포 가능한 정적 사이트

---

## 1. 산출물 구조

```
wedding-invitation-letter/
├── index.html          # 382 lines — 시멘틱 HTML, 10개 섹션 + 모달/토스트/캔버스
├── style.css           # 1,204 lines — :root 토큰, 섹션별 패턴, reduced-motion 분기
├── script.js           # 668 lines — vanilla, 11개 setup* 모듈
├── images/             # 9장 (image-artist 산출물 그대로 사용)
│   ├── hero-illustration.png
│   ├── floral-divider.png
│   ├── floral-corner.png
│   ├── gallery-placeholder-1.png ~ 5.png
│   └── og-thumbnail.png
└── _workspace/
    └── 05_frontend-developer_summary.md  (이 파일)
```

## 2. 외부 의존성

| 항목 | 종류 | 비고 |
|------|------|------|
| Google Fonts CDN | `Nanum Myeongjo`, `Cormorant Garamond`, `Allura` | `<link>` 1회 로드, `display=swap` |
| Pretendard CDN | `cdn.jsdelivr.net/gh/orioncactus/pretendard` | 보조 sans, 정보성 텍스트(주소, 계좌번호) |
| Kakao JS SDK | (선택, 주석 처리됨) | `KAKAO_JS_KEY` 입력 시 활성화 |
| 애니메이션 라이브러리 | **없음** | Canvas 2D + IntersectionObserver + CSS 변수만 사용 |

## 3. 모션 명세 구현 매핑

### Must (필수, 모두 구현 완료)

| # | 명세 항목 | 구현 상태 | 위치 |
|---|----------|----------|------|
| 1-A | 꽃잎 파티클 Canvas (count 24, dusty rose 70% + sage 30%, opacity 0.18~0.32, 14~22s 낙하) | ✅ 완전 구현 | `script.js` setupPetals (L67~L160), `index.html` `.bg-petals` (L25) |
| 1-B | 그라디언트 메시 4-radial 60s ease-in-out alternate | ✅ 완전 구현 | `style.css` body::before / @keyframes meshDrift (L80~L110) |
| 2-1 | Hero step-in (eyebrow→일러스트 blur reveal→이름→amp→날짜→스크롤 인디) | ✅ 완전 구현 | `style.css` [data-hero-step] (L257~L295), `script.js` setupHero (L43~L51) |
| 2-2 | Greeting masked text reveal (단락 stagger 80~150ms) | ✅ 완전 구현 (단락 stagger 8단계) | `style.css` .reveal-line (L181~L205) |
| 2-3 | Couple-intro 좌/우 슬라이드인 + 부모 함자 fade | ✅ 완전 구현 | `style.css` .couple-card (L367~L385) |
| 2-4 | Calendar 진입 + 예식일 셀 펄스 + D-day 카운트업 | ✅ 완전 구현 | `style.css` @keyframes pulseDay (L478), `script.js` setupCalendar/countUp (L168~L235) |
| 2-5 | Gallery 첫 슬라이드 blur(4px→0) + scale(1.03→1.0) reveal | ✅ 완전 구현 | `style.css` .first-reveal (L529~L546), `script.js` setupReveal (L62) |
| 2-6 | Venue/Account/RSVP/Guestbook/Share 공통 fade-up | ✅ 완전 구현 | `style.css` .reveal (L173~L181) |
| 3-1 | D-day 카운트업 (0 → diff, 1400ms easeOutCubic) + aria-live | ✅ 완전 구현 | `script.js` countUp (L237~L245) |
| 3-2 | 갤러리 스와이프 (touch threshold 50px, drag follow, snap, 자동 5s, 사용자 인터랙션 시 10s 일시정지, viewport gating) | ✅ 완전 구현 + 키보드 ←/→ + 화살표 버튼 | `script.js` setupGallery (L249~L341) |
| 3-3 | 계좌 복사 + sage 체크마크 swap + 토스트 + clipboard 폴백 | ✅ 완전 구현 (6개 버튼, execCommand 폴백) | `script.js` setupCopy/showToast (L417~L460), `style.css` .copy-btn (L728~L758) |
| 3-4 | Smooth scroll | ✅ 구현 (CSS scroll-behavior: smooth, reduced-motion에서 auto) | `style.css` html (L52, L1183) |
| §5 | CSS 변수 토큰 (--ease-*, --dur-*, --stagger-*) | ✅ 완전 구현 (motion-spec §5 전부 :root에 동기화) | `style.css` :root (L9~L48) |
| 글로벌 | prefers-reduced-motion 분기 | ✅ 완전 구현 (CSS `*` 강등 + JS isReduced + 정적 SVG 4개 fallback + 페이지 reload-on-change) | `style.css` @media reduced-motion (L1175~L1204), `script.js` reducedMotion 헬퍼 (L34~L37, 각 setup에서 분기) |

### Should (권장, 모두 구현)

| # | 명세 항목 | 구현 상태 | 위치 |
|---|----------|----------|------|
| 3-5 | Lightbox 핀치 줌 (max 3.0, 더블탭 토글 2.4↔1, 팬, ESC/배경/✕ 닫기, 포커스 트랩) | ✅ 완전 구현 (touchstart/move 2-finger, double-tap 300ms, keyboard ←/→ 슬라이드 이동) | `script.js` setupLightbox (L347~L415) |
| 3-6 | 음악 토글 (페이드인 1500ms, 페이드아웃 600ms, 아이콘 swap, 이퀄라이저 3바, 리플) | ✅ 완전 구현 (volume fade + ripple animation + aria-pressed) | `script.js` setupMusic (L477~L510), `style.css` .music-toggle (L965~L1030) |
| 3-7 | 카카오 공유 (SDK feed + Web Share 폴백 + 링크 복사 폴백) | ✅ 완전 구현 (3단 폴백 체인) | `script.js` setupShare (L515~L555) |
| 3-8 | 햅틱 (8/15ms, navigator.vibrate 지원 체크) | ✅ 완전 구현 (계좌복사 15, 슬라이드 8, 라이트박스 15, 음악 10, 공유 15) | `script.js` haptic helper (L36) + 각 인터랙션 |

### Nice-to-have (시간 여유 시)

| # | 명세 항목 | 구현 상태 | 위치 |
|---|----------|----------|------|
| 3-9 | 스크롤 리빌 IO | ✅ 구현 (Must와 통합) | `script.js` setupReveal |
| 3-10 | 모서리 장식 패럴랙스 | ⏭️ 미구현 (성능 보수성 위해 생략, corner-deco는 정적 배치) | — |
| 3-11 | Hero 일러스트 ken-burns (18s) | ✅ 구현 (motion-spec §3-11 그대로) | `style.css` @keyframes kenBurns (L227~L230) |

## 4. Placeholder 일람 (사용자가 직접 채워야 할 위치)

| 항목 | 위치 (파일:라인) | 현재 값 | 사용자 작업 |
|------|----------------|--------|------------|
| Kakao JS SDK 키 | `script.js` L13 `KAKAO_JS_KEY` | `''` | https://developers.kakao.com/ 에서 JavaScript 키 발급 후 입력. `index.html` L237의 SDK script 주석도 해제. |
| RSVP 폼 URL | `script.js` L14 `RSVP_FORM_URL` | `''` | Tally / Google Form / FormSubmit 등 외부 폼 URL. 비어있으면 토스트 "참석 의사 폼은 준비 중입니다" 표시. |
| 방명록 폼 URL | `script.js` L15 `GUESTBOOK_URL` | `''` | 외부 방명록 폼 URL. 비어있으면 토스트 "방명록은 준비 중입니다" 표시. |
| BGM 음원 | `audio/bgm.mp3` | 파일 없음 | royalty-free MP3 파일을 `audio/bgm.mp3` 경로에 추가. `index.html` L23 audio 태그 src 참조. 파일 없으면 음악 토글 클릭 시 토스트로 안내. |
| 양가 계좌번호 6개 | `index.html` L218~L286 (각 `<p class="acc-num">` + `data-copy=` 속성) | `○○은행 ○○○-○○○○-○○○○` | 6명(신랑/신랑부모/신부/신부부모) 계좌번호로 교체. data-copy 속성도 함께 변경. |
| og:url | `index.html` L19 | `""` (빈 문자열) | 실제 배포 URL로 교체 (예: `https://your-domain.com/`). |
| 지도 좌표 | `style.css` `.map-static` | 정적 placeholder 디자인 | 카카오맵 SDK 사용 시 `script.js`에 좌표 + Map 렌더 로직 추가 (현재는 정적 placeholder + 외부 지도 앱 링크만). |

## 5. 접근성 체크리스트

- ✅ 모든 `<img>` alt 속성 (장식용은 `alt=""`로 시각적 노이즈 제거)
- ✅ 시멘틱 태그: `<main>`, `<section>`, `<article>`, `<header>`, `<footer>`, `<nav>` 대체로 `aria-label`
- ✅ 모든 `<section>` `aria-labelledby` 또는 `aria-label`
- ✅ 모든 인터랙티브 버튼 `aria-label` (계좌 복사 6개, 음악 토글, 갤러리 nav 2개, 라이트박스 닫기, 공유 2개)
- ✅ 토스트 `role="status" aria-live="polite"`
- ✅ D-day `aria-live="polite"` (카운트업 종료 시 최종 값만 읽힘 — 매 프레임 갱신은 textContent로 비-스크린리더 동작)
- ✅ 라이트박스 `role="dialog" aria-modal="true"` + 포커스 트랩 (close 버튼에 focus, 종료 시 prevFocus 복원)
- ✅ 키보드: 갤러리 ←/→, 라이트박스 ESC/←/→, 모든 버튼 Tab + Enter/Space
- ✅ `:focus-visible` outline (.btn 명시)
- ✅ 컬러 대비: text(#3A2E2A) on bg(#FBF7F3) ≈ 13:1 (WCAG AAA)
- ✅ 광과민성: 이퀄라이저 0.4s = 2.5Hz < 3Hz, 빠른 점멸 없음

## 6. 성능 최적화

- ✅ `viewport-fit=cover`, `theme-color` 메타 태그
- ✅ Hero 일러스트 `fetchpriority="high"` + 명시적 width/height (CLS 0)
- ✅ 갤러리 1번만 `loading="eager"`, 2~5번은 `loading="lazy"`
- ✅ 디바이더/코너 장식 `loading="lazy"`
- ✅ 폰트 `preconnect` + `display=swap`
- ✅ Canvas dpr 보정 (max 2 — 고DPR에서 메모리 폭증 방지)
- ✅ Canvas FPS 측정 후 미달 시 count 24→12 감소
- ✅ `document.visibilityState === 'hidden'` 시 RAF 일시정지
- ✅ 갤러리 자동 슬라이드 viewport 외 시 `clearInterval`
- ✅ `contain: layout style/paint/strict` (section, gallery-slide, lightbox)
- ✅ `will-change: background-position` body::before 1회만
- ✅ 모든 transition은 transform/opacity/filter만 (layout-trigger 없음)

## 7. 배포 가이드

### 로컬 미리보기

```bash
cd /Users/robin/Downloads/wedding-invitation-letter
python3 -m http.server 8080
# 브라우저에서 http://localhost:8080 접속
```

또는 Node 환경에서:

```bash
npx serve .
# or
npx http-server .
```

### GitHub Pages

1. 새 저장소 생성 후 모든 파일 push
2. Settings → Pages → Source: `Deploy from a branch` (`main` / `(root)`)
3. 배포 URL 확인 후 `index.html` L19 `og:url` 갱신 + `script.js` L19 `SHARE_IMAGE` 자동 계산됨
4. 카카오톡 공유 시 미리보기는 og:image (images/og-thumbnail.png) 자동 노출

### Netlify / Vercel

- 폴더를 그대로 drag-drop 배포 (정적 사이트, 빌드 명령 불필요)
- 커스텀 도메인 연결 후 og:url 갱신

### Cloudflare Pages

- GitHub 저장소 연결 → 빌드 명령 비움 → 출력 디렉토리 `/`

## 8. 테스트 체크리스트 (invitation-qa로 인계)

- [ ] iPhone Safari 14+ : Hero step-in, 꽃잎 파티클, 갤러리 스와이프
- [ ] Android Chrome 최신 : 핀치 줌, 햅틱
- [ ] 데스크톱 Chrome/Safari : max-width 480px 카드 + 좌우 그라디언트 여백
- [ ] 시스템 설정에서 "동작 줄이기" ON → 페이지 reload → 파티클·메시·ken-burns 모두 정지, 정적 SVG 꽃잎 4개 표시 확인
- [ ] 계좌 복사 6개 모두 동작 (HTTPS / file:// 양쪽 폴백 검증)
- [ ] 갤러리 ←/→ 키보드 / 자동 5s / 인터랙션 시 10s 일시정지
- [ ] D-day 숫자 카운트업 (오늘 기준 2026-10-17까지 일수)
- [ ] og:image 카카오톡 공유 미리보기 (실제 배포 URL 필요)
- [ ] Lighthouse Mobile ≥ 85 (Performance / Accessibility / Best Practices / SEO)

## 9. 변경 이력 / 협의 사항

- image-artist 산출물 9장 모두 사용 (hero-illustration.png, floral-divider.png × 2회 사용 — greeting/couple, floral-corner.png × 2회 사용 — calendar/account)
- motion-designer 명세의 §5 토큰을 :root에 그대로 옮김 (`--ease-emphasized`, `--dur-bg-mesh` 등 14개 변수)
- copy-writer의 모든 카피 문자열이 HTML에 정확히 사용됨 (인사말 4단락 8행, 부모 함자, 영문 보조, 토스트 메시지, 폼 라벨 등)
- 컨셉 시트의 sections_order(10개) 순서 그대로 구현
- typography 4종(Nanum Myeongjo / Cormorant Garamond / Allura / Pretendard) 모두 적용 — script="Allura" 클래스로 hero-eyebrow / amp / "Thank you" 스크립트 강조

---

> 다음 단계: `invitation-qa` 에이전트가 본 산출물을 검증한 뒤 issue list를 받아 부분 수정 진행.
