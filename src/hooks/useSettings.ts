// Stub compatível com o site-institucional
// Suporta tanto camelCase quanto snake_case usados pelas páginas copiadas

const BASE = {
  siteName: "Mauro Monção Advogados Associados",
  contactEmail: "contato@mauromoncao.adv.br",
  email: "contato@mauromoncao.adv.br",
  phoneOffice: "(86) 99519-8919",
  phone_office: "(86) 99519-8919",
  phoneWhatsapp: "5586994820054",
  phone_whatsapp: "5586994820054",
  whatsappCta: "Fale com um advogado agora",
  whatsapp_cta: "Fale com um advogado agora",
  whatsappMessage: "Olá! Gostaria de falar com um advogado sobre minha situação.",
  instagramUrl: "https://instagram.com/mauromoncao.adv",
  instagram_url: "https://instagram.com/mauromoncao.adv",
  address: "Parnaíba – PI",
  googleTagManagerId: "",
  // Vídeos (usados em algumas páginas)
  video_clinicas: null,
  video_irpf_autismo: null,
  video_planejamento: null,
  video_recuperacao: null,
  video_defesa: null,
  video_drben: null,
};

export const DEFAULT_SETTINGS = BASE;

export function useSettings() {
  return {
    settings: BASE as typeof BASE & Record<string, any>,
    isLoading: false,
  };
}
