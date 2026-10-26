// Conteúdo da landing page. Textos conforme docs/handoff-original/README.md.
// Qualquer alteração de copy deve ser feita aqui, não nos componentes.

export const brand = {
  name: 'So Sales',
  tagline: 'Marketing e Vendas',
  email: 'suportesosales.br@gmail.com',
  instagram: 'https://instagram.com/so.sales.br',
  instagramHandle: '@so.sales.br',
  city: 'Belo Horizonte',
  year: 2026,
} as const;

export const hero = {
  eyebrow: 'Assessoria para clínicas · Belo Horizonte',
  titleStart: 'Marketing e vendas da sua clínica,',
  titleEmphasis: 'geridos de ponta a ponta.',
  lead:
    'Organizamos o funil, planejamos as ofertas, roteirizamos os criativos e conduzimos a gestão de todo o processo — com acompanhamento próximo em cada etapa.',
} as const;

export const services = {
  titleStart: 'Dois formatos de assessoria,',
  titleEmphasis: 'uma gestão completa.',
  lead:
    'Em ambos, a So Sales assume a condução do processo e permanece ao seu lado com suporte contínuo — da estratégia à análise dos resultados.',
  plans: [
    {
      id: 'essencial',
      name: 'Essencial',
      tag: 'Gestão completa',
      description: 'Estrutura de aquisição e vendas conduzida pela nossa equipe.',
      items: [
        'Gestão de tráfego pago',
        'Estruturação da oferta',
        'Análise de métricas',
        'Organização de CRM e funil',
        '1 roteiro de criativo por semana',
        '1 reunião semanal de alinhamento',
      ],
      priceLabel: 'Investimento',
      price: 'Sob consulta',
    },
    {
      id: 'completo',
      name: 'Completo',
      tag: 'Gestão + orgânico',
      description: 'Tudo do Essencial, somado à construção da presença orgânica da clínica.',
      items: [
        'Tudo do plano Essencial',
        'Estratégia de perfil orgânico',
        '2 carrosséis por semana',
      ],
      priceLabel: 'Investimento',
      price: 'Sob consulta',
    },
  ],
} as const;

export const caseStudy = {
  eyebrow: 'Case de cliente',
  title: 'Funil estruturado, time comercial com visibilidade total.',
  body:
    'Reorganizamos o funil de vendas da clínica e demos ao time comercial clareza sobre cada etapa do processo. O resultado foi uma nova projeção de faturamento anual.',
  previousLabel: 'Projeção anterior',
  previousValue: 'R$ 900 mil',
  newLabel: 'Nova projeção anual',
  newValue: 'R$ 1,2 mi',
  videoPlaceholder: 'Vídeo do case (em breve)',
  // Preencher com o identificador do vídeo quando o cliente enviar. Vazio mantém o placeholder.
  videoUrl: '',
} as const;

export const faqs = [
  {
    q: 'Para quais clínicas a assessoria é indicada?',
    a: 'Atendemos clínicas de Belo Horizonte que desejam estruturar e escalar seu processo comercial.',
  },
  {
    q: 'O investimento em anúncios está incluso?',
    a: 'Não. O valor da assessoria cobre a gestão e a estratégia. A verba de mídia é investida diretamente pela clínica nas plataformas.',
  },
  {
    q: 'Em quanto tempo os resultados aparecem?',
    a: 'Os primeiros ajustes no funil costumam gerar efeito nas semanas iniciais. Resultados consistentes são construídos ao longo dos primeiros meses de acompanhamento.',
  },
  {
    q: 'Como funciona o acompanhamento?',
    a: 'Realizamos uma reunião semanal de alinhamento e mantemos suporte contínuo durante todo o processo, com análise de métricas e ajustes constantes.',
  },
  {
    q: 'Existe fidelidade contratual?',
    a: 'As condições de contrato são apresentadas no diagnóstico, de acordo com o formato escolhido.',
  },
] as const;

export const contact = {
  titleStart: 'Solicite um diagnóstico',
  titleEmphasis: 'da sua clínica.',
  lead:
    'Preencha o formulário e nossa equipe entrará em contato para entender o momento da sua clínica e indicar o formato mais adequado.',
  successTitle: 'Solicitação recebida.',
  successAgain: 'Enviar nova solicitação',
  submit: 'Solicitar diagnóstico',
  // Opções do campo "Faturamento mensal". O valor (value) é o que vai ao banco e ao CRM.
  revenueOptions: [
    { value: 'ate_20_mil', label: 'Até R$ 20 mil' },
    { value: '20_a_50_mil', label: 'R$ 20 mil – R$ 50 mil' },
    { value: '50_a_100_mil', label: 'R$ 50 mil – R$ 100 mil' },
    { value: 'acima_100_mil', label: 'Acima de R$ 100 mil' },
  ],
} as const;

export const whatsappWidget = {
  button: 'Falar no WhatsApp',
  title: 'Fale com a So Sales',
  lead: 'Preencha duas informações e continue a conversa no WhatsApp.',
  doneTitle: 'Tudo certo.',
  doneLead: 'Abrimos o WhatsApp com a sua mensagem pronta. Se a janela não abrir, use o botão abaixo.',
  doneLink: 'Abrir WhatsApp',
  submit: 'Continuar no WhatsApp',
} as const;
