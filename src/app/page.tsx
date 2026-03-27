import Hero from "@/components/Hero";
import RecognitionBar from "@/components/RecognitionBar";
import WorkCarousel from "@/components/WorkCarousel";
import AwardsStats from "@/components/AwardsStats";
import ServiceCards from "@/components/ServiceCards";
import AboutTeaser from "@/components/AboutTeaser";
import ContactFooter from "@/components/ContactFooter";
import PageMain from "@/components/PageMain";
import PageMotion from "@/components/PageMotion";

export default function Home() {
  return (
    <PageMain variant="home">
      <Hero />
      <PageMotion>
        <div className="page-motion-item" data-page-motion>
          <RecognitionBar />
        </div>
        <div className="page-motion-item" data-page-motion>
          <WorkCarousel />
        </div>
        <div className="page-motion-item" data-page-motion>
          <AwardsStats />
        </div>
        <div className="page-motion-item" data-page-motion>
          <ServiceCards />
        </div>
        <div className="page-motion-item" data-page-motion>
          <AboutTeaser />
        </div>
        <div className="page-motion-item relative z-20">
          <ContactFooter />
        </div>
      </PageMotion>
    </PageMain>
  );
}
