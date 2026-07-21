# VOV 보완 작업 (12개 항목) - 진행 상황

## 완료 (2026-07-21)
- [x] 1. 인트로 화면 실시간 TOP5 위젯 (Contest.tsx intro)
- [x] 2. 현재월/업데이트시간/마감일 (VoiceKingBanner)
- [x] 3. 전체 순위 모달 (RankingModal.tsx: 월간/그랑프리/아카이브 탭)
- [x] 4. 순위변동 화살표 (전일 스냅샷 기반, rank_snapshots 테이블)
- [x] 5. 용어 분리 ("이번 회차 챔피언" vs "월간 실시간 순위")
- [x] 6. 챔피언 화면에 내 선택 사회자 현재 월간 순위 뱃지
- [x] 7. 프로필보기(아웃라인+안내문구) vs 상담하기(채워진 버튼) 구분 강화
- [x] 8. 링크 공유 버튼 (Web Share -> 클립보드 폴백)
- [x] 9. 월별 아카이브 (기존 champions 테이블 + /api/champions 신규)
- [x] 10. 월간/연간 분리 (기존 /api/grandprix)
- [x] 11. 하루1회 서버검증 (기존 /api/session)
- [x] 12. trackEvent(game_start/game_complete/profile_view/consult_click/full_ranking_view/share_link_click) + /api/track + /api/admin-stats

## 검증 완료
- bunx tsc --noEmit: 통과
- bun run build: 통과
- mb 로컬 QA: intro TOP5, 배너 메타/화살표/전체순위 모달(3탭), 게임 플레이 전체 흐름, 챔피언 화면 순위뱃지, 이미지저장+링크공유(클립보드 복사 확인) 전부 정상 동작

## 남은 단계
- [ ] ADMIN_STATS_KEY 시크릿 수집 대기중 (ask_secrets 호출함)
- [ ] Vercel 환경변수에 ADMIN_STATS_KEY 등록
- [ ] git add -A && commit && rebase origin/main && push
- [ ] vercel deploy --prod
- [ ] curl https://www.inusmc.co.kr/contest 200 확인
