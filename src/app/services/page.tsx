import RecognitionBar from "@/components/RecognitionBar";
import ServicesPageContent from "@/components/ServicesPageContent";
import PageMain from "@/components/PageMain";
import PageMotion from "@/components/PageMotion";

export const metadata = {
  title: "Services — Wincore",
  description:
    "Digital-first branding, motion, AI-powered development, and WebGL experiences by Wincore.",
};

export default function ServicesPage() {
  return (
    <PageMain variant="inner">
      <RecognitionBar />
      <PageMotion>
        <div className="page-motion-item" data-page-motion="tier2">
          <ServicesPageContent />
        </div>
      </PageMotion>
    </PageMain>
  );
}
