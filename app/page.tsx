// Landing page "So Sales" — rota "/". Ver docs/routes.md e docs/handoff-mapping.md.
import { WhatsappProvider } from '@/components/WhatsappWidget';
import { CaseStudy, ContactSection, Footer, FaqSection, Header, Hero, Services } from '@/components/sections';

export default function HomePage() {
  return (
    <WhatsappProvider>
      <div className="band">
        <Header />
        <Hero />
      </div>

      <div className="band">
        <Services />
      </div>

      <div className="band">
        <CaseStudy />
      </div>

      <div className="band">
        <FaqSection />
      </div>

      <div className="band">
        <ContactSection />
      </div>

      <Footer />
    </WhatsappProvider>
  );
}
