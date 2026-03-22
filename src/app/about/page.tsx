import AboutTeaser from "@/components/AboutTeaser";
import AwardsStats from "@/components/AwardsStats";
import RecognitionBar from "@/components/RecognitionBar";
import PageMotion from "@/components/PageMotion";
import PageMain from "@/components/PageMain";

export const metadata = {
  title: "About — Wincore Agency",
  description: "Colombo-based, globally delivered. Meet Wincore Agency (Wincore Media).",
};

export default function AboutPage() {
  return (
    <PageMain>
      <PageMotion>
        <div className="page-motion-item" data-page-motion>
          <RecognitionBar />
        </div>
        <div className="page-motion-item" data-page-motion>
          <AboutTeaser />
        </div>
        <div className="page-motion-item" data-page-motion>
          <AwardsStats />
        </div>
      </PageMotion>
    </PageMain>
  );
}
