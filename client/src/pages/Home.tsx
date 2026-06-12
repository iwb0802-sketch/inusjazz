/**
 * INUSMUSIC 웨딩 전문 브랜드 홈페이지
 * Design: Warm Dramatic Wedding - 풀스크린 히어로, 다크/라이트 교차, 대담한 타이포그래피
 * Brand Color: Mint (#5BB5A2) + Soft Gold (#d4b896)
 */
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import IntroSection from "@/components/sections/IntroSection";
import RecommendSection from "@/components/sections/RecommendSection";
import DifferenceSection from "@/components/sections/DifferenceSection";
import PackageSection from "@/components/sections/PackageSection";
import PricingSection from "@/components/sections/PricingSection";
import ProcessSection from "@/components/sections/ProcessSection";
import McSection from "@/components/sections/McSection";
import VideoSection from "@/components/sections/VideoSection";
import VideoGuideSection from "@/components/sections/VideoGuideSection";
import ReviewSection from "@/components/sections/ReviewSection";
import QnaSection from "@/components/sections/QnaSection";
import BookingSection from "@/components/sections/BookingSection";
import ServiceSection from "@/components/sections/ServiceSection";
import EventSection from "@/components/sections/EventSection";
import CtaSection from "@/components/sections/CtaSection";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import InusCardPopup from "@/components/InusCardPopup";


export default function Home() {
  return (
    <div className="min-h-screen">
      <InusCardPopup />
      <Navbar />
      <HeroSection />
      <IntroSection />
      <RecommendSection />
      <DifferenceSection />
      <PackageSection />
      <ProcessSection />
      <ReviewSection />
      <McSection />
      <VideoSection />
      <VideoGuideSection />
      <BookingSection />
      <PricingSection />
      <EventSection />
      <QnaSection />
      <ServiceSection />
      <CtaSection />
      <Footer />
      <FloatingButtons />
    </div>
  );
}
