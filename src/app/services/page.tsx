import RecognitionBar from "@/components/RecognitionBar";
import ServicesPageContent from "@/components/ServicesPageContent";
import PageMain from "@/components/PageMain";

export const metadata = {
  title: "Services — Wincore Agency",
  description:
    "Digital-first branding, motion, AI-powered development, and WebGL experiences by Wincore Agency.",
};

export default function ServicesPage() {
  return (
    <PageMain>
      <RecognitionBar />
      <ServicesPageContent />
    </PageMain>
  );
}
