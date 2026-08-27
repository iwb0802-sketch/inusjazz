/**
 * INUSMUSIC 웨딩 전문 브랜드 홈페이지
 * Design: Warm Dramatic Wedding - 풀스크린 히어로, 다크/라이트 교차, 대담한 타이포그래피
 * Brand Color: Mint (#5BB5A2) + Soft Gold (#d4b896)
 */
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import IntroSection from "@/components/sections/IntroSection";
import LiveBookingSection from "@/components/sections/LiveBookingSection";
import PackageSection from "@/components/sections/PackageSection";
import PricingSection from "@/components/sections/PricingSection";
import ProcessSection from "@/components/sections/ProcessSection";
import McSection from "@/components/sections/McSection";
import VoteOnVoiceSection from "@/components/sections/VoteOnVoiceSection";
import HiddenGemsSection from "@/components/sections/HiddenGemsSection";
import VideoGuideSection from "@/components/sections/VideoGuideSection";
import ReviewSection from "@/components/sections/ReviewSection";
import QnaSection from "@/components/sections/QnaSection";
import ServiceSection from "@/components/sections/ServiceSection";
import EventSection from "@/components/sections/EventSection";
import QuickLinksSection from "@/components/sections/QuickLinksSection";
import CtaSection from "@/components/sections/CtaSection";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import QuickNav from "@/components/QuickNav";
import InusCardPopup from "@/components/InusCardPopup";


export default function Home() {
  return (
    <div className="min-h-screen">
      <InusCardPopup />
      <Navbar />
      <HeroSection />
      <IntroSection />
      <ReviewSection />
      <LiveBookingSection />
      {/* 순서: 사회자 이름 노출 전에 VOTE ON VOICE 블라인드 투표 유도 */}
      <VoteOnVoiceSection />
      <McSection />
      {/* 숨은 강자 — 사회자 카드 직후에 배치 (맥락 연결) */}
      <HiddenGemsSection />
      <VideoGuideSection />
      <PackageSection />
      <ProcessSection />
      <PricingSection />
      {/* 이벤트 총정리 → 그 뒤에 바로가기 6종 */}
      <EventSection />
      <QuickLinksSection />
      <QnaSection />
      <ServiceSection />
      <CtaSection />
      <Footer />
      <FloatingButtons />
      <QuickNav />
    </div>
  );
}
