# Wedding Letter — 한국 모바일 청첩장 제작 하네스

> Claude Code 기반 멀티 에이전트 하네스로 한국 모바일 웨딩 청첩장을 컨셉부터 QA까지 자동 제작합니다. 6명의 전문가 에이전트가 파이프라인 + 팬아웃 패턴으로 협업하여 단일 페이지 정적 HTML을 생성합니다.

**Live demo**: https://revfactory.github.io/wedding-letter/ (Pages 활성화 후)

---

## 무엇을 만드나

- 모바일 우선 단일 페이지 청첩장 (`index.html` + `style.css` + `script.js`)
- 워터컬러 보태니컬 이미지 9장 (gpt-image-2로 생성)
- Canvas 꽃잎 파티클 · 그라디언트 메시 배경
- D-day 카운트업 · 갤러리 스와이프 · 핀치 줌 lightbox · 음악 토글 · 계좌 복사 · 햅틱
- `prefers-reduced-motion` 글로벌 분기 + 정적 SVG 폴백
- 외부 프레임워크 없는 vanilla JS — 어떤 정적 호스팅에서도 동작

---

## 빠른 시작

### 1. 청첩장 제작 (Claude Code에서)

```
청첩장 만들어줘
```

오케스트레이터(`wedding-invitation` 스킬)가 자동으로 트리거되어 6단계 워크플로우를 실행합니다. 신랑신부 정보·일시·장소를 묻거나 `auto mode`에서는 합리적 기본값으로 진행합니다.

### 2. 로컬 미리보기

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

### 3. 배포

- **GitHub Pages**: Settings → Pages → Source `main` / `/ (root)`
- **Vercel / Netlify**: 폴더 드래그&드롭
- **Cloudflare Pages**: 저장소 연결만으로 배포

> ⚠️ GitHub Pages 사용 시 `_workspace/` 디렉토리가 제외되지 않도록 루트의 `.nojekyll`(빈 파일)을 유지하세요.

---

## 팀 구성 — 6명의 전문가 에이전트

| 에이전트 | 역할 | 산출물 |
|---|---|---|
| `concept-director` | 컨셉/톤앤매너/팔레트/타이포 결정 | `_workspace/01_concept-director_concept-sheet.md` |
| `copy-writer` | 인사말, 부모 함자, 안내문 등 한국어 카피 | `_workspace/02_copy-writer_copy.md` |
| `image-artist` | gpt-image-2로 히어로/플로럴/장식 이미지 생성 | `_workspace/03_image-artist_manifest.md` + `images/` |
| `motion-designer` | 인터랙션 + 애니메이션 배경 명세 | `_workspace/04_motion-designer_motion-spec.md` |
| `frontend-developer` | 단일 페이지 HTML/CSS/JS 통합 구현 | `index.html` · `style.css` · `script.js` + `_workspace/05_frontend-developer_summary.md` |
| `invitation-qa` | 정합성/반응형/접근성/인터랙션/모션 검증 | `_workspace/06_invitation-qa_report.md` |

각 에이전트의 정의는 `.claude/agents/<name>.md`에 있습니다.

---

## 워크플로우 6단계

```
Phase 0: 컨텍스트 확인 (_workspace/ 존재 여부 → 초기/부분/재실행 분기)
   ↓
Phase 1: concept-director 단독 (사용자 인터뷰 → 컨셉 시트)
   ↓
Phase 2: copy-writer · image-artist · motion-designer 병렬 (팀 모드)
   ↓
Phase 3: frontend-developer 단독 (4개 산출물 → index.html 통합)
   ↓
Phase 4: invitation-qa 단독 (5개 카테고리 검증, FAIL 시 자동 수정 또는 재호출)
   ↓
Phase 5: 사용자 보고 + placeholder 안내 + 피드백 수집
```

세부 흐름과 에러 핸들링은 `.claude/skills/wedding-invitation/SKILL.md`에 정의되어 있습니다.

---

## 부분 재실행

청첩장을 한 번 만든 후 일부만 다시 만들고 싶을 때, `_workspace/`의 중간 산출물을 활용해 해당 에이전트만 재호출합니다.

| 사용자 요청 예시 | 재실행 대상 |
|---|---|
| "인사말만 다시" | copy-writer → frontend-developer → QA |
| "갤러리 사진 다시 뽑아줘" | image-artist → frontend-developer → QA |
| "꽃잎 너무 많아, 줄여줘" | motion-designer → frontend-developer → QA |
| "BGM 추가하고 음악 토글 넣어줘" | motion-designer → frontend-developer → QA |
| "계좌번호 추가" / "부모님 함자 수정" | copy-writer → frontend-developer → QA |
| "컨셉 바꿔서, 미니멀하게" | concept-director → 전체 cascade |
| "다시 처음부터" | `_workspace/` 백업 후 Phase 1부터 재실행 |

---

## 프로젝트 구조

```
wedding-letter/
├── index.html               # 메인 청첩장 페이지
├── style.css                # 스타일 (1,200+ lines)
├── script.js                # 인터랙션 + 애니메이션 (660+ lines)
├── images/                  # 이미지 자산 9장
│   ├── hero-illustration.png
│   ├── floral-divider.png
│   ├── floral-corner.png
│   ├── gallery-placeholder-1~5.png
│   └── og-thumbnail.png
├── _workspace/              # 중간 산출물 (재실행용으로 보존)
│   ├── 01_concept-director_concept-sheet.md
│   ├── 02_copy-writer_copy.md
│   ├── 03_image-artist_manifest.md
│   ├── 04_motion-designer_motion-spec.md
│   ├── 05_frontend-developer_summary.md
│   └── 06_invitation-qa_report.md
├── .claude/
│   ├── agents/              # 6명의 전문가 에이전트 정의
│   │   ├── concept-director.md
│   │   ├── copy-writer.md
│   │   ├── image-artist.md
│   │   ├── motion-designer.md
│   │   ├── frontend-developer.md
│   │   └── invitation-qa.md
│   └── skills/              # 7개 도메인 스킬
│       ├── wedding-invitation/         # 오케스트레이터
│       ├── wedding-concept-design/
│       ├── wedding-copywriting/
│       ├── wedding-imagery-gpt-image2/
│       ├── wedding-motion-design/
│       ├── wedding-mobile-frontend/
│       └── wedding-invitation-qa/
├── .nojekyll                # GitHub Pages Jekyll 비활성화
├── CLAUDE.md                # 프로젝트 지침
└── README.md
```

---

## 사용자가 채워야 할 항목

생성된 `index.html`에는 다음 항목이 placeholder로 들어갑니다. 완성된 `_workspace/05_frontend-developer_summary.md`에 정확한 위치(파일:라인)가 일람되어 있습니다.

| 항목 | 형태 |
|---|---|
| 신랑/신랑부/신랑모 계좌 (3) | `[은행명 000-000-000-000]` |
| 신부/신부부/신부모 계좌 (3) | `[은행명 000-000-000-000]` |
| 카카오 JS SDK 키 | `KAKAO_JS_KEY` 상수 |
| 카카오톡 공유 og:url | 배포 도메인 결정 후 |
| RSVP 외부 폼 URL | 구글 폼/네이버 폼 등 |
| 방명록 URL (선택) | |
| BGM 파일 (선택) | `audio/bgm.mp3` |

---

## 트렌드 가이드 (2025-2026)

`.claude/skills/wedding-concept-design/SKILL.md`에 큐레이션된 트렌드:

- **컬러**: Dusty Rose × Sage, Warm Earth, Mocha Mousse, Inky Plum 등
- **타이포**: Nanum Myeongjo / Noto Serif KR + Cormorant Garamond / Playfair Display + Allura(스크립트)
- **무드**: modern romantic, soft botanical, refined warmth, quiet luxury
- **모션**: 꽃잎 파티클, 그라디언트 메시, 워터컬러 blur reveal, IntersectionObserver scroll reveal

---

## 커스터마이징

### 에이전트 정의 수정

특정 에이전트의 행동을 바꾸고 싶다면 `.claude/agents/<name>.md`를 직접 편집하세요. 다음 호출부터 반영됩니다.

```
청첩장 만들 때 copy-writer가 더 격식 있는 어조를 쓰도록 정의 수정
```

### 스킬 수정

도메인 지식(트렌드, 템플릿, 색상 풀)은 `.claude/skills/wedding-*/SKILL.md`에서 관리합니다. 트렌드가 바뀌면 해당 스킬의 큐레이션 풀을 업데이트하세요.

### 새 에이전트/스킬 추가

`/harness:harness` 메타 스킬로 하네스 자체를 재구성할 수 있습니다.

---

## 기술 스택

- **AI**: Claude Code (Opus 4.7) + 6 specialized subagents
- **이미지 생성**: OpenAI gpt-image-2
- **프론트엔드**: Vanilla HTML/CSS/JS (no framework)
- **폰트**: Google Fonts (Nanum Myeongjo, Cormorant Garamond, Allura)
- **배포**: GitHub Pages (Jekyll 비활성화)

---

## 라이선스

코드: MIT  
이미지: 본 청첩장 한정 사용. 재배포·상업적 이용 시 별도 동의 필요.

---

## 문의

이슈/개선 제안: GitHub Issues
