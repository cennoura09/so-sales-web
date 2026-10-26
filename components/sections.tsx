// Seções estáticas da landing page (renderizadas no servidor).
// Cada função corresponde a uma seção do handoff. Ver docs/handoff-mapping.md.
import Image from 'next/image';
import { brand, hero, services, caseStudy, contact } from '@/lib/content';
import { OpenWhatsappButton } from './WhatsappWidget';
import ContactForm from './ContactForm';
import Faq from './Faq';

// 1. Cabeçalho (dentro da faixa do hero)
export function Header() {
  return (
    <header className="wrap site-header">
      <a href="#top" className="brand">
        <span className="brand-mark">
          <Image src="/logo-sosales.png" alt="So Sales" width={40} height={46} priority />
        </span>
        <span className="brand-name">
          <b>{brand.name}</b>
          <small>{brand.tagline}</small>
        </span>
      </a>
      <nav className="main-nav" aria-label="Principal">
        <a href="#servicos">Serviços</a>
        <a href="#case">Resultados</a>
        <a href="#faq">Dúvidas</a>
      </nav>
      <a href="#contato" className="btn btn-primary btn-sm">
        {contact.submit}
      </a>
    </header>
  );
}

// 2. Hero
export function Hero() {
  return (
    <section className="wrap hero" id="top">
      <span className="eyebrow">{hero.eyebrow}</span>
      <h1 className="hero-title">
        {hero.titleStart} <span className="italic">{hero.titleEmphasis}</span>
      </h1>
      <p className="lead">{hero.lead}</p>
      <div className="row-buttons">
        <a href="#contato" className="btn btn-primary btn-md">
          {contact.submit}
        </a>
        <a href="#servicos" className="btn btn-ghost btn-md">
          Conhecer os planos
        </a>
        <OpenWhatsappButton className="btn btn-ghost btn-md" />
      </div>
    </section>
  );
}

// 3. Serviços: dois planos
export function Services() {
  return (
    <section className="wrap sec" id="servicos">
      <div className="svc-head">
        <h2>
          {services.titleStart} <span className="italic">{services.titleEmphasis}</span>
        </h2>
        <p>{services.lead}</p>
      </div>
      <div className="plans">
        {services.plans.map((plan) => (
          <article className="card" key={plan.id} aria-labelledby={`plan-${plan.id}`}>
            <div className="card-top">
              <h3 id={`plan-${plan.id}`}>{plan.name}</h3>
              <span className="tag">{plan.tag}</span>
            </div>
            <p className="card-desc">{plan.description}</p>
            <ul className="feats">
              {plan.items.map((item) => (
                <li key={item}>
                  <span className="dash" aria-hidden="true">
                    —
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="card-foot">
              <div>
                <div className="price-label">{plan.priceLabel}</div>
                <div className="price">{plan.price}</div>
              </div>
              <a href="#contato" className="btn btn-primary btn-card">
                Quero este plano
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// 4. Case de cliente
export function CaseStudy() {
  return (
    <section className="wrap sec case" id="case">
      <div>
        <span className="eyebrow">{caseStudy.eyebrow}</span>
        <h2>{caseStudy.title}</h2>
        <p className="case-body">{caseStudy.body}</p>
        <div className="result">
          <div>
            <div className="k">{caseStudy.previousLabel}</div>
            <div className="old">{caseStudy.previousValue}</div>
          </div>
          <div className="arrow" aria-hidden="true">
            →
          </div>
          <div>
            <div className="k">{caseStudy.newLabel}</div>
            <div className="new">{caseStudy.newValue}</div>
          </div>
        </div>
      </div>
      <div className="video">
        {caseStudy.videoUrl ? (
          <iframe
            src={caseStudy.videoUrl}
            title={caseStudy.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <span className="play" aria-hidden="true" />
            <span className="cap">{caseStudy.videoPlaceholder}</span>
          </>
        )}
      </div>
    </section>
  );
}

// 5. FAQ
export function FaqSection() {
  return (
    <section className="wrap sec faq" id="faq">
      <h2>
        Perguntas <span className="italic">frequentes.</span>
      </h2>
      <Faq />
    </section>
  );
}

// 6. Contato
export function ContactSection() {
  return (
    <section className="wrap sec contact" id="contato">
      <div>
        <h2>
          {contact.titleStart} <span className="italic">{contact.titleEmphasis}</span>
        </h2>
        <p className="intro">{contact.lead}</p>
        <div className="contact-links">
          <a href={`mailto:${brand.email}`}>{brand.email}</a>
          <a href={brand.instagram} target="_blank" rel="noopener">
            {brand.instagramHandle}
          </a>
        </div>
      </div>
      <ContactForm />
    </section>
  );
}

// 7. Rodapé
export function Footer() {
  return (
    <footer className="wrap site-footer">
      <span className="copy">
        © {brand.year} Assessoria {brand.name} · {brand.tagline}
      </span>
      <a href={brand.instagram} target="_blank" rel="noopener">
        Instagram
      </a>
      <a href={`mailto:${brand.email}`}>E-mail</a>
    </footer>
  );
}
