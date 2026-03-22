import WorkCarousel from "@/components/WorkCarousel";
import RecognitionBar from "@/components/RecognitionBar";
import PageMain from "@/components/PageMain";

export const metadata = {
  title: "Works — Wincore Agency",
  description: "Selected campaigns and immersive digital experiences by Wincore Agency.",
};

export default function WorksPage() {
  return (
    <PageMain>
      <RecognitionBar />
      <WorkCarousel />
    </PageMain>
  );
}
