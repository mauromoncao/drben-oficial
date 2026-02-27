/**
 * SEOHead — injeção dinâmica de meta tags, OG, Twitter Card e JSON-LD
 *
 * Uso:
 *   <SEOHead
 *     title="Título da Página"
 *     description="Descrição concisa com 150–160 chars."
 *     canonical="https://mauromoncao.adv.br/pagina"
 *     ogImage="/og-home.jpg"
 *     type="article"         // "website" | "article" | "profile"
 *     jsonLd={[...]}         // array de objetos JSON-LD
 *   />
 *
 * Notas:
 *  - Todos os parâmetros são opcionais; defaults são aplicados
 *  - useEffect garante limpeza ao desmontar (restaura defaults)
 *  - Funciona com SPA (React Router / Wouter) sem SSR
 */

import { useEffect } from "react";

const SITE_NAME   = "Mauro Monção Advogados Associados";
const SITE_URL    = "https://mauromoncao.adv.br";
const DEFAULT_IMG = `${SITE_URL}/logo-brand.png`;
const DEFAULT_DESC =
  "Advocacia estratégica em Direito Tributário, Planejamento Patrimonial, Previdenciário e Empresarial. Escritório Mauro Monção Advogados Associados — Piauí e Maranhão.";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "profile";
  noIndex?: boolean;
  keywords?: string;
  author?: string;
  publishedAt?: string;    // ISO date string — artigos de blog
  modifiedAt?: string;     // ISO date string
  jsonLd?: Record<string, any> | Record<string, any>[];
}

// ── helpers ──────────────────────────────────────────────────────────────────
function setMeta(name: string, content: string, attr = "name") {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function injectJsonLd(id: string, data: Record<string, any> | Record<string, any>[]) {
  removeJsonLd(id);
  const script = document.createElement("script");
  script.type  = "application/ld+json";
  script.id    = id;
  script.textContent = JSON.stringify(Array.isArray(data) ? data : [data]);
  document.head.appendChild(script);
}

function removeJsonLd(id: string) {
  document.getElementById(id)?.remove();
}

// ── component ────────────────────────────────────────────────────────────────
export default function SEOHead({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
  noIndex = false,
  keywords,
  author,
  publishedAt,
  modifiedAt,
  jsonLd,
}: SEOHeadProps) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | ${SITE_NAME}`
      : SITE_NAME;
    const desc  = description || DEFAULT_DESC;
    const image = ogImage || DEFAULT_IMG;
    const url   = canonical || window.location.href;

    // ── <title>
    document.title = fullTitle;

    // ── básicos
    setMeta("description",        desc);
    setMeta("robots",             noIndex ? "noindex,nofollow" : "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1");
    if (keywords) setMeta("keywords", keywords);
    if (author)   setMeta("author",   author);

    // ── canonical
    setLink("canonical", url);

    // ── Open Graph
    setMeta("og:type",        ogType,     "property");
    setMeta("og:title",       fullTitle,  "property");
    setMeta("og:description", desc,       "property");
    setMeta("og:image",       image,      "property");
    setMeta("og:url",         url,        "property");
    setMeta("og:site_name",   SITE_NAME,  "property");
    setMeta("og:locale",      "pt_BR",    "property");

    // ── Twitter Card
    setMeta("twitter:card",        "summary_large_image");
    setMeta("twitter:title",       fullTitle);
    setMeta("twitter:description", desc);
    setMeta("twitter:image",       image);

    // ── Article metas
    if (ogType === "article") {
      if (publishedAt) setMeta("article:published_time", publishedAt, "property");
      if (modifiedAt)  setMeta("article:modified_time",  modifiedAt,  "property");
      if (author)      setMeta("article:author",         author,      "property");
    }

    // ── JSON-LD
    if (jsonLd) injectJsonLd("seo-jsonld-page", jsonLd);

    return () => {
      // restaurar defaults ao sair da página
      document.title = SITE_NAME;
      setMeta("description", DEFAULT_DESC);
      setMeta("robots", "index,follow");
      removeJsonLd("seo-jsonld-page");
    };
  }, [title, description, canonical, ogImage, ogType, noIndex, keywords, author, publishedAt, modifiedAt, jsonLd]);

  return null; // não renderiza DOM visível
}

// ── JSON-LD builders (utilitários exportados) ─────────────────────────────
export const SITE_URL_EXPORT = SITE_URL;

export function buildOrganizationLD() {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": SITE_NAME,
    "alternateName": "Mauro Monção Adv.",
    "url": SITE_URL,
    "logo": `${SITE_URL}/logo-brand.png`,
    "description": DEFAULT_DESC,
    "foundingDate": "2015",
    "areaServed": ["Piauí", "Maranhão", "Brasil"],
    "address": [
      {
        "@type": "PostalAddress",
        "streetAddress": "Av. Leonardo de Carvalho Castelo Branco, nº 2835, Sala 12",
        "addressLocality": "Parnaíba",
        "addressRegion": "PI",
        "postalCode": "64215-700",
        "addressCountry": "BR"
      },
      {
        "@type": "PostalAddress",
        "streetAddress": "Av. dos Holandeses, nº 4, Ed. Balsas, Sala 1004",
        "addressLocality": "São Luís",
        "addressRegion": "MA",
        "postalCode": "65071-380",
        "addressCountry": "BR"
      }
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+55-86-99482-0054",
      "contactType": "customer service",
      "availableLanguage": "Portuguese"
    },
    "sameAs": [
      "https://www.instagram.com/mauromoncaoadv",
      "https://www.linkedin.com/company/mauro-moncao-advogados"
    ]
  };
}

export function buildWebSiteLD() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_NAME,
    "url": SITE_URL,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${SITE_URL}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function buildBreadcrumbLD(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`
    }))
  };
}

export function buildArticleLD(post: {
  title: string;
  slug: string;
  excerpt?: string;
  author?: string;
  publishedAt?: string;
  updatedAt?: string;
  featuredImage?: string;
  category?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "url": `${SITE_URL}/blog/${post.slug}`,
    "description": post.excerpt || "",
    "image": post.featuredImage || DEFAULT_IMG,
    "author": {
      "@type": "Person",
      "name": post.author || "Mauro Monção",
      "url": `${SITE_URL}/sobre`
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": { "@type": "ImageObject", "url": `${SITE_URL}/logo-brand.png` }
    },
    "datePublished": post.publishedAt || new Date().toISOString(),
    "dateModified": post.updatedAt || post.publishedAt || new Date().toISOString(),
    "mainEntityOfPage": { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}` }
  };
}

export function buildFAQLD(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
    }))
  };
}

export function buildServiceLD(service: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "description": service.description,
    "url": service.url.startsWith("http") ? service.url : `${SITE_URL}${service.url}`,
    "provider": {
      "@type": "LegalService",
      "name": SITE_NAME,
      "url": SITE_URL
    },
    "areaServed": "BR",
    "availableLanguage": "Portuguese"
  };
}
