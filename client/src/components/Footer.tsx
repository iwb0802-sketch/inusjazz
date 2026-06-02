export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <span
              className="text-xl tracking-[0.2em] text-white"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
            >
              INUSMUSIC
            </span>
            <p className="mt-3 text-white/40 text-xs leading-relaxed">
              이너스뮤직 | 웨딩 전문 브랜드
              <br />
              사회자를 비교하고, 직접 선택하실 수 있습니다.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white/60 text-xs tracking-wider uppercase mb-4">Quick Links</h4>
            <div className="space-y-2">
              {[
                { label: "메인", href: "#hero" },
                { label: "사회자 소개", href: "#mc" },
                { label: "서비스", href: "#service" },
                { label: "후기", href: "#review" },
                { label: "견적 문의", href: "#package" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-white/40 text-sm hover:text-[#5BB5A2] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white/60 text-xs tracking-wider uppercase mb-4">Contact</h4>
            <div className="space-y-2 text-white/40 text-sm">
              <p>이메일: inusmusics@naver.com</p>
              <p>TEL: 02-423-2772</p>
              <a
                href="https://pf.kakao.com/_wxovaM/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-[#5BB5A2] hover:text-[#4da393] transition-colors"
              >
                카카오톡 상담하기 →
              </a>
            </div>
          </div>
        </div>

        {/* 사업자 정보 */}
        <div className="mt-10 pt-8 border-t border-white/5">
          <div className="text-white/30 text-xs leading-relaxed space-y-1">
            <p>대표자: 신유진 | 사업자등록번호: 299-90-00178</p>
            <p>사무실 주소: 서울 광진구 자양로 165 4층</p>
            <p>TEL: 02-423-2772</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © 2025 INUSMUSIC. All rights reserved.
          </p>
          <p className="text-white/20 text-xs">
            Premium Wedding Host Brand
          </p>
        </div>
      </div>
    </footer>
  );
}
