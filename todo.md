# 작업 이력

## 오늘 진행 완료
- [x] 라이트박스 좌우 이동 화살표 스타일 보강
- [x] 한국어/영어 둘 다 Hero 이미지와 레이아웃 정리
- [x] 셔틀버스 안내 UI 정리
- [x] RSVP/방명록 제출 흐름을 Supabase 연동 기반으로 전환
- [x] 서버 API(`/api/rsvp`, `/api/guestbook`)로 저장/조회/삭제가 동작하도록 연결
- [x] 관리자 모드에서 RSVP 응답 목록이 이름·참석여부·인원·메시지 기준으로 보이도록 정리
- [x] FormSubmit 메일 전송 의존성 제거하고 DB 저장 중심 흐름으로 정리
- [x] 브라우저 캐시 문제 방지를 위해 스크립트 버전 갱신
- [x] GitHub에 최신 변경사항 푸시 완료
- [x] `/friends/` 애프터파티 버전 및 `/en/` 애프터파티 RSVP 필드 구조 반영
- [x] 방명록 삭제 버튼을 관리자 뷰에서만 보이도록 제한

## 현재 상태
- [x] 로컬 API 검증 결과: POST/GET가 정상 동작하며 Supabase에 데이터가 저장되는 것을 확인함
- [x] 배포용 GitHub 저장소 기준 최신 커밋 반영 완료
- [x] GitHub에 푸시해 Vercel 자동 재배포가 시작되도록 준비 완료
- [ ] 새 RSVP 필드(`side`, `meal`, `afterparty`)는 Supabase `rsvp` 테이블 컬럼 추가 SQL 적용 후 저장 검증 필요
- [x] Friends/EN 전용 AFTER PARTY 섹션 구성 및 실제 장소 정보 반영 완료
- [x] RSVP 모달 전환 및 셀렉트 UI(Choices.js) 리디자인 완료

## 남은 점검 포인트
- [x] Vercel 공개 페이지에서 실제 제출 테스트는 배포 완료 후 확인 가능
- [x] 관리자 모드에서 새 응답이 바로 보이는지 확인도 배포 후 확인 가능
- [x] 필요 시 관리자 UI를 더 보기 좋게 다듬기는 다음 작업으로 이어서 진행 가능
- [x] 방명록 관리자 뷰도 동일하게 정리 가능

## 다음에 바로 이어서 할 수 있는 작업
- Supabase SQL Editor에서 `rsvp` 테이블 컬럼(`side`, `meal`, `afterparty`) 추가
- 배포 완료 후 공개 페이지에서 실제 RSVP/방명록 제출 테스트
- [x] 페이지 맨 아래 "Copyright © Minho Cha. All rights reserved." 추가 한 것 진짜 페이지 완전 맨 아래로 (살짝 여백 아래만 주고)
- [x] select dropdown 스타일 리디자인 완료
- [x] 라이트박스 오픈 후 추가 확대(핀치/더블탭) 비활성화 완료
- [x] hero section 이미지 확대/축소 느낌(ken burns) 제거 완료
- [x] 첫 진입 인트로("Minho & Claire / 결혼식에 초대합니다") 후 hero 노출 애니메이션 추가 완료
- raffle 할 지 말 지?
- [x] rsvp modal 안에 에프터 파티 참석 미정 선택하는거 (거기 간략하게 에프터파티 장소 및 시간 (미리가도되는것도))


