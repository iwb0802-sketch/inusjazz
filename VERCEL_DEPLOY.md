# 이너스뮤직 스튜디오 — Vercel 배포 안내

이 프로젝트는 Vite 정적 사이트로 구성되어 있으며, Vercel에서 별도 서버나 환경 변수 없이 배포할 수 있습니다. 오디오 파일 처리와 MP3/WAV 생성은 사용자의 브라우저에서 수행됩니다.

## GitHub 연결 상태

현재 코드가 GitHub 저장소 `iwb0802-sketch/inusjazz`의 `inus-music-studio` 브랜치에 동기화되었습니다. 기존 `main` 브랜치의 파일을 보호하기 위해 별도 브랜치를 사용했습니다.

## Vercel에서 가져오기

Vercel 대시보드에서 **Add New → Project**를 선택한 뒤, GitHub의 `iwb0802-sketch/inusjazz` 저장소를 Import합니다. 배포 브랜치에는 `inus-music-studio`를 지정합니다. Vercel은 `vercel.json`을 읽어 `pnpm install --frozen-lockfile`, `pnpm build`, `dist/public` 출력 폴더를 자동 적용합니다.

정적 배포에는 별도 환경 변수가 필요하지 않습니다. Import 화면에서 설정을 확인한 다음에만 Deploy를 실행하세요. 향후 GitHub에서 이 브랜치에 변경을 푸시하면 Vercel에서 새 배포를 만들 수 있습니다.

## 주의 사항

Manus의 관리형 호스팅과 달리 Vercel 배포에는 Manus 전용 분석과 관리 기능이 포함되지 않습니다. 독립 배포를 위해 로고와 작업대 이미지 파일을 프로젝트 정적 경로에 포함했습니다.
