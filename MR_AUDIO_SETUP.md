# 이너스뮤직 스튜디오 MR 만들기 설정

음원 편집 콘솔 상단의 **MR 만들기** 메뉴는 Vercel Blob에 원본을 직접 업로드하고 Replicate Demucs에서 보컬·반주를 분리합니다.

| 환경 변수 | 용도 |
|---|---|
| `INUS_AUDIO_PASSWORD` | 콘솔 MR 만들기 창의 공용 작업 비밀번호 |
| `REPLICATE_API_TOKEN` | 서버에서만 사용하는 Replicate API 토큰 |
| `INUS_AUDIO_BLOB_READ_WRITE_TOKEN` | Public Vercel Blob store의 직접 업로드 토큰 |

음원용 Blob store는 `INUS_AUDIO_BLOB` 접두사와 Public 접근 설정을 사용해야 Replicate가 업로드 파일을 읽을 수 있습니다.

## 로컬 검증 기록

2026-08-20 기준 음원 편집 콘솔 상단의 `AI STEM TOOLS · MR 만들기` 메뉴와 클릭 시 표시되는 보컬·MR 분리 모달이 정상 렌더링되는 것을 확인했습니다. 모달에는 비밀번호, 최대 24MB MP3·WAV·FLAC 업로드, 분리 진행 상태, 보컬·MR 재생 및 개별 다운로드 영역이 포함됩니다.
