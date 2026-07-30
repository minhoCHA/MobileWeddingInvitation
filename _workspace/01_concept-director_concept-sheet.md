---
couple:
  groom: "차민호"
  bride: "조성경"
ceremony:
  date: "2026-10-17 16:00"
  day_of_week: "토요일"
  venue: "삼청각 일화당"
  venue_short: "삼청각 일화당"
  hall: "삼청각"
  address: "서울특별시 강남구 테헤란로 521"
  formality: "호텔 정통 예식 (격식)"
parents:
  groom_father: "차재동"
  groom_mother: "지미숙"
  bride_father: "조권탁"
  bride_mother: "왕금희"
  groom_birth_order: "차남"
  bride_birth_order: "장녀"
gallery:
  count: 5
  composition: "커플 스냅 4장 + 풍경 1장"
  status: "placeholder (frontend는 images/gallery-01.jpg ~ gallery-05.jpg 경로로 처리)"
mood_keywords:
  - "modern romantic"
  - "soft botanical"
  - "refined warmth"
palette:
  primary: "#C9A2A2"        # dusty rose - 메인 강조 (이름, 날짜, 핵심 카피)
  secondary: "#A8B59C"      # soft sage - 보조 (디바이더, 보조 텍스트, 식물 모티프)
  accent: "#8B5A5A"         # deep rosewood - 액션(버튼, 링크, 호버)
  background: "#FBF7F3"     # warm ivory - 페이지 베이스
  surface: "#F2EAE2"        # light cream - 카드/섹션 분리
  text: "#3A2E2A"           # warm charcoal - 본문
  muted: "#8E7D75"          # warm taupe - 캡션/보조 텍스트
typography:
  korean_serif: "Nanum Myeongjo"          # 인사말, 본문 (Google Fonts)
  korean_sans: "Pretendard"               # 시간/주소/계좌번호 등 정보성 텍스트 (CDN)
  english_serif: "Cormorant Garamond"     # 신랑신부 영문명, 영문 날짜, 섹션 헤딩 (Google Fonts)
  english_script: "Allura"                # "&" "Save the Date" 등 부드러운 강조 (Google Fonts)
imagery_direction: |
  수채화 스타일 보태니컬 일러스트 + 미니멀 라인 디테일.
  더스티 로즈와 세이지 그린 톤의 부드러운 watercolor florals(장미, 유칼립투스, 작은 들꽃)를 메인 모티프로 사용.
  히어로는 신랑신부 사진이 들어갈 자리이지만 placeholder 상태이므로,
  대체 비주얼로 "ivory 배경 + 중앙 상단에 dusty rose 장미 한 송이 + 양옆 sage 유칼립투스 가지" 워터컬러 일러스트.
  섹션 디바이더는 가는 라인의 sage 식물 라인아트 또는 작은 rose 봉오리 spot illustration.
  과한 채도/그림자 금지, 종이에 번지는 듯한 자연스러운 텍스처 유지.
  AI 일러스트지만 인쇄물 청첩장의 우아함을 모바일에 그대로 옮긴 느낌.
layout_mood: |
  모바일 우선 풀스크린 단일 페이지, 넉넉한 화이트 스페이스(섹션 간 80~120px),
  가운데 정렬 기본, 텍스트는 1.7~1.9 행간으로 호흡 길게.
  히어로는 100vh 풀스크린 — 상단 영문명(Cormorant) + 중앙 보태니컬 일러스트 + 하단 한글 이름(Nanum Myeongjo) + "We're getting married" 스크립트(Allura).
  섹션마다 가는 1px sage 라인 디바이더 + 작은 식물 spot illustration로 분절.
  카드/박스 코너는 부드럽게 12~16px radius, 그림자 대신 surface 컬러로 면 분리.
  계좌·주소·RSVP 등 정보 박스는 ivory 위 cream surface로 살짝 구분.
  이미지는 4:5 또는 3:4 세로 비율 우선, 갤러리는 가로 스와이프 + 핀치 줌 lightbox.
motion_mood_hint: |
  "조용히 피어나는" 무드 — 빠르고 화려한 모션 금지, 모든 트랜지션 ease-out 600~900ms.
  배경 애니메이션: 옅은 dusty rose 꽃잎 파티클이 아주 천천히 떨어지는 Canvas 효과 (밀도 낮게, 8~12개, opacity 0.15~0.35),
  또는 sage/rose 그라디언트 메시가 매우 느리게 흐르는 CSS 애니메이션.
  스크롤 인터랙션: IntersectionObserver로 섹션 진입 시 fade-in + translateY(20px → 0) 부드럽게.
  이미지: 갤러리 진입 시 살짝 scale(1.02 → 1.0) blur(4px → 0) 워터컬러처럼 번지는 reveal.
  마이크로: 계좌 복사 버튼 탭 시 sage 체크 마크 fade in + 햅틱(가능 시), 카운트다운 숫자는 부드러운 flip.
  음악 토글 아이콘은 floating action 우상단, 재생 시 작은 ripple.
  prefers-reduced-motion: reduce 환경에서는 파티클·메시 애니메이션 모두 OFF, fade-in만 즉시 표시(0ms transition).
sections_order:
  - hero                # 풀스크린 + 신랑신부명 + 예식일
  - greeting            # 인사말
  - couple-intro        # 신랑신부 소개 + 부모 함자
  - calendar            # 캘린더 + D-day 카운트다운
  - gallery             # 갤러리 (5장 스와이프 + lightbox 핀치줌)
  - venue               # 오시는 길 (지도 + 주소 + 교통편)
  - account             # 마음 전하실 곳 (양가 계좌, 복사 버튼)
  - rsvp                # 참석 의사 전달
  - guestbook           # 방명록
  - share               # 카카오톡 공유 + 링크 복사
defaults_applied:
  - "신랑신부 이름 (사용자 미입력 → 합리적 기본값)"
  - "양가 부모 함자 (사용자 미입력 → 기본값)"
  - "예식일/장소 (사용자 미입력 → 기본값)"
  - "갤러리 사진 5장 placeholder 처리"
  - "분위기 키워드: modern romantic / soft botanical / refined warmth (트렌드 기반 큐레이션)"
  - "컬러 팔레트: Sage × Dusty Rose 융합 커스텀 5색 + surface/muted 보조 2색"
  - "폰트: Nanum Myeongjo + Cormorant Garamond + Allura(스크립트) + Pretendard(보조)"
---

# 컨셉 디렉션 노트 — "조용히 피어나는 가을의 약속"

## 톤앤매너

2026년 10월의 늦가을 토요일, 서울 강남 호텔 정통 예식의 격식을 유지하면서도 신랑신부의 따뜻한 인간미를 잃지 않는 **modern romantic + soft botanical**. 화려한 고채도 대신 더스티 로즈의 부드러운 분홍과 세이지 그린의 차분한 녹음을 페어링해, "꽉 찬 화려함"이 아닌 "여백 속에 피어나는 우아함"을 추구한다. 호텔 청첩장 특유의 무거움을 피하기 위해 영문 세리프와 스크립트를 절제해서 사용하고, 한글은 Nanum Myeongjo의 단정한 균형으로 어른 세대도 편안하게 읽을 수 있도록 한다.

## 핵심 비주얼 컨셉

- **컬러 키 무드**: ivory 배경(#FBF7F3) 위에 dusty rose(#C9A2A2)와 sage(#A8B59C)가 1:1로 균형을 이루고, 핵심 강조에는 deep rosewood(#8B5A5A)를 점처럼 사용. 인쇄물 청첩장을 모바일로 옮긴 듯한 종이 질감.
- **타이포 키 무드**: 한글 Nanum Myeongjo의 또박또박한 격식 + 영문 Cormorant Garamond의 가는 우아함 + Allura 스크립트로 "&" "Save the Date" 같은 한 단어만 손글씨처럼 강조. 세 폰트가 위계를 명확히 한다.
- **이미지 키 무드**: 워터컬러 보태니컬 일러스트 + 라인아트 디바이더. 사진(placeholder)이 빠지는 자리는 일러스트가 자연스럽게 메운다.
- **모션 키 무드**: "조용히 피어나는" — 천천히 떨어지는 옅은 꽃잎, 부드럽게 페이드되는 섹션, 워터컬러처럼 번지는 이미지 reveal.

## 카피라이터에게 가이드

- mood_keywords의 첫 번째 키워드 **"modern romantic"** 을 카피 톤의 중심에 둘 것. 너무 옛스러운 정중체("일가 친지를 모시고...")는 피하고, 동시에 너무 캐주얼한 반말체도 금지. **차분한 경어체 + 짧고 시적인 호흡**.
- 호텔 정통 예식이므로 부모님 함자는 풀네임으로 정중히 표기하되 "차남 차민호 / 장녀 조성경" 호칭을 명확히.
- 인사말은 4~6문장 내외로 짧게. "두 사람이 사랑으로 만나..." 같은 클리셰 대신 가을·약속·시작의 모티프를 한두 번 살짝 사용.
- 영문 한 줄(예: "We're getting married" / "Save the Date 10.17.2026")을 포인트로 삽입.
- "마음 전하실 곳" 안내문은 상투적인 부담 멘트 대신 짧고 담백하게.

## 이미지 아티스트에게 가이드

- imagery_direction을 모든 이미지에 일관되게 적용 — **워터컬러 보태니컬 + dusty rose & sage 듀오톤**.
- 컬러 팔레트의 background(#FBF7F3)를 모든 이미지의 베이스로 사용해 페이지에 자연스럽게 녹아들 것.
- 필수 이미지: ① 히어로 워터컬러 플로럴 일러스트 (세로 4:5, 인물 placeholder 대체), ② 섹션 디바이더용 sage 라인아트 식물 (가로 narrow), ③ 갤러리 placeholder 5장 (4:5 세로, 더스티 로즈/세이지 워터컬러 추상), ④ 카운트다운/캘린더 코너 장식 spot illustration (rose 봉오리, 유칼립투스 가지).
- gpt-image2로 생성. 모든 이미지에 동일 시드/스타일 키워드("watercolor botanical, dusty rose, sage green, ivory background, soft, paper texture, minimal line accents") 일관 적용.

## 모션 디자이너에게 가이드

- motion_mood_hint를 모션 명세의 베이스라인으로 사용.
- 배경 애니메이션 1순위: **꽃잎 파티클(Canvas)** — 밀도 낮게(8~12개), dusty rose 컬러, opacity 0.15~0.35, 낙하 속도 매우 느리게(40~80초/화면). 2순위: 세이지×로즈 그라디언트 메시 슬로우 모션.
- 인터랙션: 갤러리 가로 스와이프 + 핀치 줌 lightbox / 계좌 복사 버튼 / D-day 카운트다운 / 음악 토글 / RSVP 폼 / 카카오 공유.
- prefers-reduced-motion 분기 필수 — 파티클·메시 OFF, fade-in 즉시 표시.

## 프론트엔드 개발자에게 가이드

- layout_mood의 풀스크린 히어로 + 80~120px 섹션 간격 + 가운데 정렬 + 1.7~1.9 행간을 그대로 구현.
- sections_order 순서로 단일 index.html에 모두 포함.
- 폰트는 Google Fonts CDN(Nanum Myeongjo, Cormorant Garamond, Allura) + Pretendard CDN.
- 컬러 변수는 :root에 CSS 커스텀 프로퍼티로 정의(--color-primary, --color-secondary, --color-accent, --color-bg, --color-surface, --color-text, --color-muted).
- 모바일 우선 (375px 기준), 768px 이상에서 max-width 480px 정도로 중앙 정렬 카드 형태.
- 모션은 motion-designer 명세를 그대로 구현하되 prefers-reduced-motion 분기 필수.

## QA 체크포인트 (invitation-qa 참고)

- 신랑신부/부모 함자 오타 없는지
- 예식일/장소/주소 일치성
- 모바일 375px ~ 데스크톱 1440px 반응형
- prefers-reduced-motion 분기 동작
- 갤러리 5장 모두 로드, lightbox 핀치줌 동작
- 계좌 복사·카카오 공유·RSVP 폼 동작
- 컬러 대비 WCAG AA(텍스트 #3A2E2A on #FBF7F3 → 충분)
