/**
 * 하단 플로팅 버튼 (A안)
 * 한 줄: [ ▶ 실황영상보기 ] [ 인스타·블로그·유튜브 pill ] [ 💬 카톡상담하기 ]
 * 히어로 섹션을 지나 스크롤하면 나타남
 */
import React, { useState, useEffect } from "react";
import { MessageCircle, Play, Globe } from "lucide-react";

// 네이버 블로그 아이콘 (SVG) - 초록색 stroke 윤곽선
const NaverBlogIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24">
    <path
      d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"
      fill="none"
      stroke="rgba(0,210,100,0.85)"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"
      fill="currentColor"
    />
  </svg>
);

// 유튜브 아이콘 (SVG) - 빨간색 stroke 윤곽선
const YoutubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path
      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
      fill="none"
      stroke="rgba(255,50,50,0.85)"
      strokeWidth="0.8"
      strokeLinejoin="round"
    />
    <path
      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
      fill="currentColor"
    />
  </svg>
);

// 인스타그램 아이콘 - 공식 그라데이션 SVG
const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="ig-grad1" cx="30%" cy="107%" r="150%">
        <stop offset="0%" stopColor="#fdf497" />
        <stop offset="5%" stopColor="#fdf497" />
        <stop offset="45%" stopColor="#fd5949" />
        <stop offset="60%" stopColor="#d6249f" />
        <stop offset="90%" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="6" ry="6" fill="url(#ig-grad1)" />
    <rect x="7" y="7" width="10" height="10" rx="3" ry="3" fill="none" stroke="white" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="2.5" fill="none" stroke="white" strokeWidth="1.5" />
    <circle cx="16.5" cy="7.5" r="0.8" fill="white" />
  </svg>
);

const snsLinks = [
  {
    label: "네이버블로그",
    href: "https://blog.naver.com/inusmusics",
    icon: NaverBlogIcon,
    isLucide: false,
  },
  {
    label: "인스타그램",
    href: "https://www.instagram.com/inusmusic/",
    icon: InstagramIcon,
    isLucide: false,
  },
  {
    label: "유튜브",
    href: "https://www.youtube.com/channel/UC1zF6ZTCwMxzK9fEqI9ESLA",
    icon: YoutubeIcon,
    isLucide: false,
  },
];

export default function FloatingButtons() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      setVisible(window.scrollY > heroHeight * 1.0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 pointer-events-none ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {/* 한 줄: 영상보기 | SNS 아이콘 | 카톡상담 - 가운데 정렬 */}
      <div className="flex justify-center items-stretch px-4 pb-6 gap-2">

        {/* 왼쪽: 실황영상보기 */}
        <a
          href="https://m.blog.naver.com/PostList.naver?blogId=inusmusics&categoryNo=20&proxyReferer=&noTrackingCode=true"
          target="_blank"
          rel="noopener noreferrer"
          className={`${visible ? 'pointer-events-auto' : 'pointer-events-none'} flex items-center gap-2 px-4 py-3 bg-[#2c1810]/90 backdrop-blur-sm border border-[#c9a96e]/30 text-[#f8f4ef] hover:bg-[#2c1810] hover:border-[#c9a96e]/60 transition-all duration-300 shadow-lg shadow-black/20 group shrink-0`}
        >
          <Play className="w-4 h-4 text-[#c9a96e] group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
          <span className="text-xs tracking-wide" style={{ fontFamily: "'Noto Serif KR', serif" }}>
            실황영상보기
          </span>
        </a>

        {/* 가운데: SNS 아이콘 - 왼쪽 버튼과 동일 스타일 */}
        <div className={`${visible ? 'pointer-events-auto' : 'pointer-events-none'} flex items-center gap-0 bg-[#2c1810]/90 backdrop-blur-sm border border-[#c9a96e]/30 shadow-lg shadow-black/20 shrink-0`}>
          {snsLinks.map((sns, i) => (
            <a
              key={sns.label}
              href={sns.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={sns.label}
              className={`flex items-center justify-center w-11 h-full text-[#c9a96e]/70 hover:text-[#c9a96e] hover:bg-[#2c1810] transition-all duration-200 active:scale-95 ${
                i < snsLinks.length - 1 ? "border-r border-[#c9a96e]/15" : ""
              }`}
            >
              {sns.isLucide
                ? (() => { const Icon = sns.icon as React.ComponentType<{className?: string; strokeWidth?: number}>; return <Icon className="w-[13px] h-[13px]" strokeWidth={1.5} />; })()
                : <sns.icon />
              }
            </a>
          ))}
        </div>

        {/* 오른쪽: 카톡상담하기 */}
        <a
          href="https://pf.kakao.com/_wxovaM/chat"
          target="_blank"
          rel="noopener noreferrer"
          className={`${visible ? 'pointer-events-auto' : 'pointer-events-none'} flex items-center gap-2 px-4 py-3 bg-[#c9a96e] text-[#1a1207] hover:bg-[#d4b87a] transition-all duration-300 shadow-lg shadow-black/20 group shrink-0`}
        >
          <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
          <span className="text-xs tracking-wide font-medium" style={{ fontFamily: "'Noto Serif KR', serif" }}>
            카톡상담하기
          </span>
        </a>

      </div>
    </div>
  );
}
