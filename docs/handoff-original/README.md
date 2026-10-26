# Handoff: Landing Page — Assessoria So Sales | Marketing e Vendas

## Overview
Single-page landing page for **So Sales**, a marketing & sales advisory for clinics in Belo Horizonte. Goal: **lead generation** via a contact form ("Solicitar diagnóstico"). Language: **pt-BR**, formal tone.

## About the Design Files
The files in this bundle are **design references created in HTML** — a prototype showing intended look, copy and behavior, not production code to copy directly. Recreate it in the target codebase's environment (React/Next.js, Vue, Astro, etc.) using its established patterns. If no codebase exists, a static-friendly framework (e.g. Next.js or Astro + Tailwind/CSS modules) is recommended — the page is static except for the FAQ accordion and the form.

`So Sales LP.dc.html` uses a small proprietary runtime (`support.js`, `{{ }}` template holes, `<sc-for>`/`<sc-if>`). Ignore that runtime — read it as plain HTML with inline styles; the data arrays (plans, FAQ) live in the `<script>` class at the bottom.

## Fidelity
**High-fidelity.** Colors, type, spacing, copy and interactions are final. Recreate pixel-accurately.

## Global Layout
- Page background: `#0b0a09`. Every section has its own full-width background band with the brand gradient (see Tokens). Gradient bands are full-bleed; content is centered inside.
- Content container: `max-width: 1240px; margin: 0 auto; padding-inline: clamp(20px, 5vw, 64px)`.
- Section vertical padding: `clamp(64px, 8vw, 112px)` top & bottom (contact section bottom: `clamp(72px, 10vw, 140px)`).
- Fully fluid/responsive: all multi-column areas use `grid-template-columns: repeat(auto-fit, minmax(min(100%, Npx), 1fr))` so they collapse to one column on mobile. No fixed breakpoints required.
- Smooth scrolling for anchor links (`html { scroll-behavior: smooth }`).

## Sections (top to bottom)

### 1. Header (inside the hero gradient band)
- Flex row, `align-items:center; gap:20px; flex-wrap:wrap; padding-block:20px`.
- **Logo** (left, link to top): image `assets/logo-sosales.png` in a 40×46px box (`object-fit:contain`), gap 12px, then stacked text:
  - "So Sales" — 19px / 600 / letter-spacing -0.01em
  - "Marketing e Vendas" — 12px, uppercase, letter-spacing 0.08em, color `rgba(243,242,242,.75)`
- **Nav** (gap 24px, 15px, no underline): "Serviços" → `#servicos`, "Resultados" → `#case`, "Dúvidas" → `#faq`.
- **CTA button** "Solicitar diagnóstico" → `#contato` — primary button, small size (padding 11px 18px, 14px).

### 2. Hero
- Padding: `clamp(56px,9vw,128px)` top, `clamp(64px,9vw,120px)` bottom.
- Eyebrow: "Assessoria para clínicas · Belo Horizonte" — 12px uppercase, letter-spacing 0.14em, color `#ffd9bf`, margin-bottom 28px.
- H1: "Marketing e vendas da sua clínica, *geridos de ponta a ponta.*" — `clamp(40px, 6.4vw, 84px)`, weight 600, line-height 1.02, letter-spacing -0.025em, max-width 13em, `text-wrap: balance`. The second half is **italic, weight 400**.
- Lead paragraph: "Organizamos o funil, planejamos as ofertas, roteirizamos os criativos e conduzimos a gestão de todo o processo — com acompanhamento próximo em cada etapa." — `clamp(17px,1.6vw,20px)`, line-height 1.6, max-width 34em, color `rgba(243,242,242,.88)`, margin-bottom 40px.
- Buttons (gap 12px, wrap): Primary "Solicitar diagnóstico" → `#contato`; Secondary "Conhecer os planos" → `#servicos`. Both padding 15px 26px, 15px.

### 3. Serviços (`#servicos`)
- Header grid (2 cols, min 360px, gap 24px 64px, align-items end, margin-bottom `clamp(40px,6vw,64px)`):
  - H2: "Dois formatos de assessoria, *uma gestão completa.*"
  - Paragraph (17px, 1.6, 85% white, max 30em): "Em ambos, a So Sales assume a condução do processo e permanece ao seu lado com suporte contínuo — da estratégia à análise dos resultados."
- Plan cards grid (min 340px, gap 24px). Card: `padding: clamp(28px,3vw,40px); border-radius:4px; background: rgba(11,10,9,.55); border:1px solid rgba(243,242,242,.14); backdrop-filter: blur(6px)`; flex column, gap 24px.
  - Top row: name (26px/600) + tag on the right (12px uppercase, letter-spacing 0.1em, `#ffb27a`).
  - Description (16px, 1.55, 82% white).
  - Feature list: each item is a 2-col grid `18px 1fr`, gap 10px, 16px/1.45; bullet is an em dash "—" in `#ffb27a`. List gap 12px; list grows (`flex:1`) so footers align.
  - Footer: border-top 1px `rgba(243,242,242,.14)`, padding-top 20px; left: label "Investimento" (13px, 70% white) over "Sob consulta" (28px/600); right: primary button "Quero este plano" (padding 12px 20px, 14px) → `#contato`.
- **Plans data:**
  - **Essencial** — tag "Gestão completa" — "Estrutura de aquisição e vendas conduzida pela nossa equipe." — items: Gestão de tráfego pago; Estruturação da oferta; Análise de métricas; Organização de CRM e funil; 1 roteiro de criativo por semana; 1 reunião semanal de alinhamento.
  - **Completo** — tag "Gestão + orgânico" — "Tudo do Essencial, somado à construção da presença orgânica da clínica." — items: Tudo do plano Essencial; Estratégia de perfil orgânico; 2 carrosséis por semana.
  - Both prices: **"Sob consulta"** (client does not want prices displayed).

### 4. Case (`#case`)
- 2-col grid (min 400px, gap `clamp(40px,6vw,88px)`, align-items center).
- Left: eyebrow "Case de cliente"; H2 "Funil estruturado, time comercial com visibilidade total." (margin-bottom 24px); paragraph "Reorganizamos o funil de vendas da clínica e demos ao time comercial clareza sobre cada etapa do processo. O resultado foi uma nova projeção de faturamento anual." (margin-bottom 36px).
- Result row (flex, align-items end, gap 20px 32px, wrap):
  - "Projeção anterior" (13px, 70%) / "R$ 900 mil" — `clamp(26px,3vw,36px)`, 75% white, line-through (1px).
  - Arrow "→" 28px `#ffb27a`.
  - "Nova projeção anual" / "R$ 1,2 mi" — `clamp(40px,5vw,64px)`, 600, line-height 1, letter-spacing -0.02em.
- Right: **video placeholder**, 16:9, radius 4px. The client will provide a case video — implement as a responsive `<video>`/embed slot (show a neutral placeholder until supplied).

### 5. FAQ (`#faq`)
- Flex column, gap `clamp(32px,5vw,56px)`. H2 "Perguntas *frequentes.*" on top; the accordion spans the **full container width**.
- Accordion list: border-top 1px `rgba(243,242,242,.18)`; each item border-bottom same.
- Question button: full width, flex space-between, padding 22px 0, transparent, 19px/600, white; hover color `#ffd9bf`. Right icon "+" / "−" (24px, weight 400). `aria-expanded` reflects state.
- Answer: 16px/1.6, 85% white, max-width 60em, margin-bottom 22px.
- **Behavior:** single-open accordion; first item open by default; clicking the open item closes it.
- **Content:**
  1. Para quais clínicas a assessoria é indicada? — Atendemos clínicas de Belo Horizonte que desejam estruturar e escalar seu processo comercial.
  2. O investimento em anúncios está incluso? — Não. O valor da assessoria cobre a gestão e a estratégia. A verba de mídia é investida diretamente pela clínica nas plataformas.
  3. Em quanto tempo os resultados aparecem? — Os primeiros ajustes no funil costumam gerar efeito nas semanas iniciais. Resultados consistentes são construídos ao longo dos primeiros meses de acompanhamento.
  4. Como funciona o acompanhamento? — Realizamos uma reunião semanal de alinhamento e mantemos suporte contínuo durante todo o processo, com análise de métricas e ajustes constantes.
  5. Existe fidelidade contratual? — As condições de contrato são apresentadas no diagnóstico, de acordo com o formato escolhido.
  > FAQ answers are draft copy — confirm with the client before launch.

### 6. Contato (`#contato`)
- 2-col grid (min 380px, gap `clamp(40px,6vw,96px)`).
- Left: H2 "Solicite um diagnóstico *da sua clínica.*" — `clamp(36px,5vw,60px)`, line-height 1.05, letter-spacing -0.025em, margin-bottom 20px. Paragraph: "Preencha o formulário e nossa equipe entrará em contato para entender o momento da sua clínica e indicar o formato mais adequado." (max 28em, margin-bottom 32px). Links (17px, underlined, column gap 10px): `suportesosales.br@gmail.com` (mailto) and `@so.sales.br` → https://instagram.com/so.sales.br (new tab).
- Right: form card (same card style as plans, padding `clamp(24px,3vw,36px)`), internal grid `repeat(auto-fit, minmax(min(100%,220px),1fr))`, gap 18px.
  - Fields (label 13px, 85% white, gap 6px above input):
    - Nome — text, required, placeholder "Seu nome"
    - Nome da clínica — text, required, placeholder "Clínica"
    - WhatsApp — tel, required, placeholder "(31) 9 0000-0000"
    - Faturamento mensal — select, required: Selecione (empty) / Até R$ 20 mil / R$ 20 mil – R$ 50 mil / R$ 50 mil – R$ 100 mil / Acima de R$ 100 mil
    - Principal desafio hoje — textarea, 3 rows, full row, optional, placeholder "Ex.: poucos agendamentos, leads desqualificados…"
  - Input style: 16px, color `#f3f2f2`, background `rgba(243,242,242,.06)`, border 1px `rgba(243,242,242,.25)`, radius 2px, padding 12px 14px; focus border `#ffb27a`, no outline. Select `<option>` text color `#1a0f08`.
  - Submit: primary button "Solicitar diagnóstico", full row, left-aligned (padding 15px 26px).
- **Success state** (replaces the form): "Solicitação recebida." (26px/600) + "Obrigado, {nome}. Retornaremos em breve." (16px, 85%) + secondary button "Enviar nova solicitação" which resets the form.
- **To implement:** real submission (e.g. API route → e-mail to suportesosales.br@gmail.com, CRM webhook, or form service), WhatsApp mask/validation, loading + error states, spam protection, analytics conversion event.

### 7. Footer (no gradient, on `#0b0a09`)
- Flex wrap, gap 16px 32px, padding 32px top / 48px bottom, 14px, 70% white.
- Left: "© 2026 Assessoria So Sales · Marketing e Vendas"; right links: "Instagram", "E-mail" (80% white, no underline).

## Interactions & Behavior
- Anchor links smooth-scroll to sections.
- Buttons: Primary `background:#f3f2f2; color:#1a0f08; radius:2px; weight 600` → hover `#ffd9bf`, active `#ffb27a`. Secondary: transparent, border 1px `rgba(243,242,242,.45)` → hover background `rgba(243,242,242,.1)`.
- Links: `#f3f2f2`, hover `#ffd9bf`, underline offset 3px.
- Focus: `:focus-visible { outline: 2px solid #ffb27a; outline-offset: 2px }`.
- Text selection: `rgba(255,140,60,.35)`.
- No animations beyond hover color changes.

## State Management
- `openFaq: number` (default 0; -1 = all closed).
- Form: field values, `status: idle | submitting | success | error`.

## Design Tokens
**Colors**
- Background / black: `#0b0a09`
- Brand orange (gradient end): `#b8460b`
- Gradient mid stops: `#4a1c07`, `#140b06`
- Text: `#f3f2f2` (muted via opacity: .88, .85, .82, .75, .70, .60)
- Accent light (eyebrows, hover): `#ffd9bf`
- Accent (bullets, tags, focus): `#ffb27a`
- Button text: `#1a0f08`
- Card bg: `rgba(11,10,9,.55)`; hairlines: `rgba(243,242,242,.14)` / `.18` / `.25`

**Section gradient (horizontal, black left → orange right), applied to every section band:**
```css
background: linear-gradient(270deg, #b8460b 0%, #4a1c07 35%, #140b06 70%, #0b0a09 100%);
```

**Typography** — single family: **Source Serif 4** (Google Fonts; weights 400, 600, italic 400), fallback Georgia, serif. `-webkit-font-smoothing: antialiased`.
- H1: clamp(40px,6.4vw,84px) / 600 / lh 1.02 / ls -0.025em
- H2: clamp(32px,4vw,52px) / 600 / lh 1.08 / ls -0.02em (contact H2: clamp(36px,5vw,60px))
- Headline pattern: second clause in *italic 400*
- H3 (card titles): 26px / 600
- Body large: 17–20px / lh 1.6; body: 16px / lh 1.45–1.6
- Eyebrow: 12px uppercase, ls 0.14em
- Small labels: 13px

**Radius:** 2px (buttons, inputs), 4px (cards, video).
**Shadows:** none.

## Assets
- `assets/logo-sosales.png` — brand mark, cropped with transparent background (prepared from client file).
- `assets/logo-original.png` — original client logo (1024×1024, white background).
- Case video — pending from client.

## Files
- `So Sales LP.dc.html` — the design reference (open in a browser alongside `support.js` and `image-slot.js`).
- `support.js`, `image-slot.js` — prototype runtime only; do **not** port.
- `assets/` — logo files.
