import Hero from "@/components/Hero";
import RecognitionBar from "@/components/RecognitionBar";
import WorkCarousel from "@/components/WorkCarousel";
import AwardsStats from "@/components/AwardsStats";
import ServiceCards from "@/components/ServiceCards";
import AboutTeaser from "@/components/AboutTeaser";
import PageMain from "@/components/PageMain";
import PageMotion from "@/components/PageMotion";

export default function Home() {
  return (
    <PageMain variant="home">
      <Hero />
      <PageMotion>
        <div className="page-motion-item" data-page-motion="tier2">
          <RecognitionBar />
        </div>
        <div className="page-motion-item" data-page-motion="tier1">
          <WorkCarousel />
        </div>
        <div className="page-motion-item" data-page-motion="tier2">
          <AwardsStats />
        </div>
        <div className="page-motion-item" data-page-motion="tier1">
          <ServiceCards />
        </div>
        <div className="page-motion-item" data-page-motion="tier1">
          <AboutTeaser />
        </div>
      </PageMotion>
    </PageMain>
  );
}
