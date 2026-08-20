# Inus Music MR 제작 도구 배포 설정

`/audio` 페이지는 Vercel Blob의 브라우저 직접 업로드와 Replicate Demucs API를 사용합니다. Vercel 프로젝트 설정에서 아래 환경 변수를 **Production·Preview**에 등록해야 합니다.

| 변수 | 용도 |
|---|---|
| `INUS_AUDIO_PASSWORD` | `/audio` 작업대 공용 비밀번호 |
| `REPLICATE_API_TOKEN` | 서버에서만 사용하는 Replicate API 토큰 |
| `INUS_AUDIO_BLOB_READ_WRITE_TOKEN` | 음원 전용 Blob store의 직접 업로드 토큰 |

Vercel Storage에서 **Public Blob store**를 연결해야 Replicate가 업로드 음원을 읽을 수 있습니다. 새 store의 **Custom Environment Variable Prefix**에는 `INUS_AUDIO_BLOB`을 입력하고, **Add a read-write token env var**를 체크하세요. 그러면 `INUS_AUDIO_BLOB_STORE_ID`, `INUS_AUDIO_BLOB_WEBHOOK_PUBLIC_KEY`, `INUS_AUDIO_BLOB_READ_WRITE_TOKEN`이 기존 가이드용 Blob 변수와 충돌 없이 생성됩니다. 원본은 `audio-source/` 경로에 저장되며, 운영 전 Vercel Blob의 수명 주기 정책으로 자동 삭제 기간을 설정하는 것을 권장합니다.

음원 분리 결과는 Replicate가 반환한 MP3 URL로 즉시 재생·다운로드됩니다. 결과를 장기 보관해야 한다면 다음 단계에서 출력 파일도 Blob에 복사하고 작업 이력을 데이터베이스에 저장하세요.

## 로컬 검증 기록

2026-08-20 기준 `/audio` 라우트에서 비밀번호 진입 화면과 Inus Music 브랜딩이 정상 렌더링되는 것을 확인했습니다. 실제 업로드·분리 요청은 Vercel 환경 변수와 Blob store 연결 후 검증해야 합니다.

동일한 로컬 검증에서 비밀번호 입력 후 Inus Music MR 제작 작업대, 파일 드롭 영역, HTDemucs 2스템 설명, 보컬·MR 결과 패널이 정상 전환·렌더링되는 것을 확인했습니다.
