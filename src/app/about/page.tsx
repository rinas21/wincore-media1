import AboutPageContent from "@/components/AboutPageContent";
import PageMotion from "@/components/PageMotion";
import PageMain from "@/components/PageMain";

export const metadata = {
  title: "About — Wincore",
  description: "Colombo-based, globally delivered. Meet Wincore.",
};

export default function AboutPage() {
  return (
    <PageMain>
      <PageMotion>
        <AboutPageContent />
      </PageMotion>
    </PageMain>
  );
}
