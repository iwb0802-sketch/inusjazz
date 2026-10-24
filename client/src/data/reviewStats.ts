/**
 * 후기(리뷰) 증빙 데이터 — 단일 소스(Single Source of Truth)
 *
 * ⚠️ 후기 개수를 수정할 때는 이 파일만 고치면 됩니다.
 *
 * 새 캡처(증빙 스크린샷)를 반영할 때 하는 일:
 *   1. count 값을 새 캡처 숫자로 교체
 *   2. alt 텍스트의 숫자도 함께 맞춰서 수정 (스크린샷 설명과 숫자가 일치하도록)
 *   3. 필요하면 src(이미지 경로)도 새 캡처 이미지로 교체
 *   4. PROOF_AS_OF(기준일)도 캡처 날짜로 갱신
 * 나머지(합계, 반올림 표시, "4,100+" 류 문구)는 전부 자동 계산됩니다.
 */

export interface ProofImage {
  src: string;
  alt: string;
  label: string;
  source: string;
  count: number;
  url: string;
  linkLabel: string;
}

/* ── 후기 증빙 자료 — 위 3개: 숨고/후기게시판/스마트스토어, 아래 3개: 블로그(문자·카톡 모음)/블로그(고객 작성)/카페 ── */
export const PROOF_IMAGES: ProofImage[] = [
  {
    src: "/images/proof/proof-soomgo.jpg",
    alt: "숨고 프로필 리뷰수 890건",
    label: "출처 · 숨고",
    source: "숨고",
    count: 890,
    url: "https://soomgo.com/profile/users/4719699",
    linkLabel: "숨고 프로필에서 확인",
  },
  {
    src: "/images/proof/proof-blog.jpg",
    alt: "홈페이지 후기게시판 Total 598건",
    label: "출처 · 후기 게시판",
    source: "후기 게시판",
    count: 598,
    url: "http://musicin.godohosting.com/bbs/board.php?bo_table=forum",
    linkLabel: "후기 게시판에서 확인",
  },
  {
    src: "/images/proof/proof-smartstore.jpg",
    alt: "네이버 스마트스토어 리뷰 550건",
    label: "출처 · 스마트스토어",
    source: "네이버 스마트스토어",
    count: 550,
    url: "https://smartstore.naver.com/inus_store/products/5466083565",
    linkLabel: "스마트스토어에서 확인",
  },
  {
    src: "/images/proof/proof-singer-blog.jpg",
    alt: "블로그 사회자 후기글 1,011건",
    label: "출처 · 블로그 (문자·카톡 후기 모음)",
    source: "블로그(문자·카톡)",
    count: 1011,
    url: "https://blog.naver.com/PostList.naver?blogId=inusmusics&from=postList&categoryNo=71&parentCategoryNo=71",
    linkLabel: "블로그 후기글에서 확인",
  },
  {
    src: "/images/proof/proof-blog-personal.jpg",
    alt: "고객님이 직접 작성한 블로그 후기글 760건",
    label: "출처 · 블로그 (고객님 작성글)",
    source: "블로그(고객 작성)",
    count: 760,
    url: "https://search.naver.com/search.naver?ssc=tab.blog.all&sm=tab_jum&query=%EC%9D%B4%EB%84%88%EC%8A%A4%EB%AE%A4%EC%A7%81",
    linkLabel: "네이버 블로그 검색에서 확인",
  },
  {
    src: "/images/proof/proof-cafe.jpg",
    alt: "네이버 카페 고객 후기글 300건",
    label: "출처 · 카페",
    source: "카페",
    count: 300,
    url: "https://search.naver.com/search.naver?ssc=tab.cafe.all&sm=tab_jum&query=%EC%9D%B4%EB%84%88%EC%8A%A4%EB%AE%A4%EC%A7%81",
    linkLabel: "네이버 카페 검색에서 확인",
  },
];

/** 기준일 — 캡처/증빙 자료를 갱신한 날짜 */
export const PROOF_AS_OF = "2026.10.24";

/** 정확한 합계 (예: 4,109) */
export const PROOF_TOTAL = PROOF_IMAGES.reduce((sum, p) => sum + p.count, 0);

/** 마케팅 문구용 100 단위 내림 합계 (예: 4,109 → 4,100) */
export const PROOF_TOTAL_ROUNDED = Math.floor(PROOF_TOTAL / 100) * 100;

/** "4,100" 형태 (쉼표 포함, + 없음) */
export const PROOF_TOTAL_ROUNDED_LABEL = PROOF_TOTAL_ROUNDED.toLocaleString();

/** "4,100+" 형태 */
export const PROOF_TOTAL_DISPLAY = `${PROOF_TOTAL_ROUNDED_LABEL}+`;

/** "4,100건+" 형태 */
export const PROOF_TOTAL_DISPLAY_KO = `${PROOF_TOTAL_ROUNDED_LABEL}건+`;

/** 정확한 합계를 "4,109건" 형태로 */
export const PROOF_TOTAL_EXACT_LABEL = `${PROOF_TOTAL.toLocaleString()}건`;
