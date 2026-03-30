import ContactPageContent from "@/components/ContactPageContent";
import PageMain from "@/components/PageMain";
import PageMotion from "@/components/PageMotion";

export const metadata = {
  title: "Contact — Wincore",
  description: "Get in touch with Wincore. Based in Sri Lanka, serving global clients.",
};

export default function ContactPage() {
  return (
    <PageMain variant="inner">
      <PageMotion>
        <div className="page-motion-item" data-page-motion="tier2">
          <ContactPageContent />
        </div>
      </PageMotion>
    </PageMain>
  );
}
