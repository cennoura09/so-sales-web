'use client';

import { useState } from 'react';
import { faqs } from '@/lib/content';

// Acordeão de perguntas frequentes. Um item aberto por vez; o primeiro abre por padrão.
// Clicar no item aberto o fecha (openIndex = -1 significa todos fechados).
export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="acc">
      {faqs.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div className="acc-item" key={item.q}>
            <button
              type="button"
              className="acc-q"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${i}`}
              id={`faq-button-${i}`}
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
            >
              <span>{item.q}</span>
              <span className="ico" aria-hidden="true">
                {isOpen ? '−' : '+'}
              </span>
            </button>
            {isOpen && (
              <p className="acc-a" id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-button-${i}`}>
                {item.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
