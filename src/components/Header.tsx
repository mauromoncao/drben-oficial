import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, Bot, BookOpen } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

const blogDropdown = [
  { href: "/blog",                        label: "Ver todos os Artigos" },
  { href: "/blog?cat=tributario",         label: "Tributário" },
  { href: "/blog?cat=previdenciario",     label: "Previdenciário" },
  { href: "/blog?cat=bancario",           label: "Bancário" },
  { href: "/blog?cat=imobiliario",        label: "Imobiliário" },
  { href: "/blog?cat=sucessorio",         label: "Sucessório" },
  { href: "/blog?cat=consumidor",         label: "Consumidor" },
];

const areasDropdown = [
  { href: "/areas-de-atuacao",                        label: "Ver todas as Áreas" },
  { href: "/areas-de-atuacao#tributario",             label: "Direito Tributário" },
  { href: "/areas-de-atuacao#planejamento-patrimonial", label: "Planejamento Patrimonial" },
  { href: "/areas-de-atuacao#advocacia-publica",      label: "Advocacia Pública Municipal" },
  { href: "/areas-de-atuacao#imobiliario",            label: "Direito Imobiliário" },
  { href: "/areas-de-atuacao#familia-sucessoes",      label: "Família e Sucessões" },
  { href: "/areas-de-atuacao#ambiental",              label: "Direito Ambiental" },
  { href: "/areas-de-atuacao#consumidor",             label: "Direito do Consumidor" },
  { href: "/areas-de-atuacao#previdenciario",         label: "Direito Previdenciário" },
];

const socialLinks = [
  {
    href: "https://www.instagram.com/mauromoncao.adv/",
    label: "Instagram",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    href: "https://www.youtube.com/@mauromoncao",
    label: "YouTube",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    href: "https://www.tiktok.com/@mauromoncao.adv",
    label: "TikTok",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.73a8.15 8.15 0 004.77 1.52V6.79a4.85 4.85 0 01-1-.1z" />
      </svg>
    ),
  },
  {
    href: "https://www.linkedin.com/in/mauromoncao",
    label: "LinkedIn",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [areasOpen, setAreasOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const [location] = useLocation();
  const { settings } = useSettings();
  const areasRef = useRef<HTMLDivElement>(null);
  const blogRef = useRef<HTMLDivElement>(null);
  const phone = settings.phone_whatsapp || "5586994820054"; // número bruto para wa.me

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (areasRef.current && !areasRef.current.contains(e.target as Node)) setAreasOpen(false);
      if (blogRef.current && !blogRef.current.contains(e.target as Node)) setBlogOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors hover:text-[#E8B84B] whitespace-nowrap ${
        location === href ? "text-[#E8B84B]" : "text-white/85"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="bg-[#19385C] sticky top-0 z-50 shadow-lg">
      <div className="container flex items-center justify-between h-[72px] gap-4">

        {/* ── LOGOMARCA REAL — só a imagem, sem texto inventado ── */}
        <Link href="/" className="flex items-center shrink-0">
          <img
            src="/logo-mm-crop.png"
            alt="Mauro Monção Advogados Associados"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* ── DESKTOP NAV ── */}
        <nav className="hidden xl:flex items-center gap-4 flex-1 justify-end">
          {navLink("/", "Início")}

          {/* Dropdown Áreas de Atuação */}
          <div className="relative" ref={areasRef}>
            <button
              onMouseEnter={() => setAreasOpen(true)}
              onClick={() => setAreasOpen(!areasOpen)}
              className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-[#E8B84B] whitespace-nowrap ${
                location.startsWith("/areas-de-atuacao") ? "text-[#E8B84B]" : "text-white/85"
              }`}
            >
              Áreas de Atuação
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${areasOpen ? "rotate-180" : ""}`} />
            </button>
            {areasOpen && (
              <div
                className="absolute top-full left-0 mt-2 w-64 bg-[#19385C] border border-[#E8B84B]/20 rounded-xl shadow-2xl py-2 z-50"
                onMouseLeave={() => setAreasOpen(false)}
              >
                {areasDropdown.map((item, idx) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setAreasOpen(false)}
                    className={`block px-4 py-2.5 text-sm transition-colors hover:bg-white/5 hover:text-[#E8B84B] ${
                      idx === 0
                        ? "text-[#E8B84B] font-bold border-b border-white/10 mb-1 text-xs uppercase tracking-wider"
                        : location === item.href ? "text-[#E8B84B] font-medium" : "text-white/75"
                    }`}
                  >
                    {idx === 0 ? `${item.label} →` : item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Soluções Jurídicas — link direto (LPs em construção) */}
          {navLink("/solucoes-juridicas", "Soluções Jurídicas")}

          {navLink("/sobre", "Sobre Nós")}

          {/* Blog dropdown */}
          <div className="relative" ref={blogRef}>
            <button
              onMouseEnter={() => setBlogOpen(true)}
              onClick={() => setBlogOpen(!blogOpen)}
              className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-[#E8B84B] whitespace-nowrap ${
                location.startsWith("/blog") ? "text-[#E8B84B]" : "text-white/85"
              }`}
            >
              Blog
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${blogOpen ? "rotate-180" : ""}`} />
            </button>
            {blogOpen && (
              <div
                className="absolute top-full left-0 mt-2 w-52 bg-[#19385C] border border-[#E8B84B]/20 rounded-xl shadow-2xl py-2 z-50"
                onMouseLeave={() => setBlogOpen(false)}
              >
                {blogDropdown.map((item, idx) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setBlogOpen(false)}
                    className={`block px-4 py-2.5 text-sm transition-colors hover:bg-white/5 hover:text-[#E8B84B] ${
                      idx === 0
                        ? "text-[#E8B84B] font-bold border-b border-white/10 mb-1 text-xs uppercase tracking-wider flex items-center gap-2"
                        : "text-white/75"
                    }`}
                  >
                    {idx === 0 ? <><BookOpen className="w-3.5 h-3.5" />{item.label}</> : item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {navLink("/faq", "FAQ")}
          {navLink("/contato", "Contato")}

          {/* Dr. Ben — Assistente Jurídico IA — destaque dourado */}
          <a
            href="/assistente-juridico"
            className="flex items-center gap-1.5 bg-[#E8B84B] text-[#19385C] px-3 py-1.5 rounded-full text-xs font-black hover:brightness-110 hover:scale-105 transition-all whitespace-nowrap shadow-md border-2 border-[#E8B84B]"
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#19385C] animate-pulse" />
            DR. BEN
          </a>

          {/* Tributoflix */}
          <a
            href="https://tributoflix.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 bg-red-700 text-white px-3 py-1.5 rounded text-xs font-black hover:bg-red-600 transition-colors whitespace-nowrap tracking-wide"
          >
            ▶ TRIBUTOFLIX
          </a>

          {/* CTA WhatsApp */}
          <a
            href={`https://wa.me/${phone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#E8B84B] text-[#19385C] px-4 py-2 rounded-full text-sm font-bold hover:brightness-110 transition-all whitespace-nowrap shadow-md"
          >
            Fale Conosco
          </a>

          {/* ── ÍCONES SOCIAIS DOURADOS ── */}
          <div className="flex items-center gap-2.5 border-l border-[#E8B84B]/20 pl-3">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.label}
                className="text-[#E8B84B] hover:text-[#F0CB6E] hover:scale-110 transition-all"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </nav>

        {/* Mobile toggle */}
        <button className="xl:hidden p-2 text-[#E8B84B]" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* ── MOBILE NAV ── */}
      {mobileOpen && (
        <div className="xl:hidden bg-[#19385C] border-t border-[#E8B84B]/20 px-4 pb-6">
          <div className="flex flex-col gap-0.5 pt-3">
            {[
              { href: "/", label: "Início" },
              { href: "/areas-de-atuacao", label: "Áreas de Atuação" },
              { href: "/solucoes-juridicas", label: "Soluções Jurídicas" },
              { href: "/sobre", label: "Sobre Nós" },
              { href: "/blog", label: "Blog" },
              { href: "/faq", label: "FAQ" },
              { href: "/contato", label: "Contato" },
              { href: "/assistente-juridico", label: "🤖 Dr. Ben — Assistente IA" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 border-b border-white/10 text-white/85 text-sm font-medium hover:text-[#E8B84B]"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={`https://wa.me/${phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 bg-[#E8B84B] text-[#19385C] text-center px-4 py-3 rounded-full text-sm font-bold"
            >
              Fale Conosco
            </a>
            <a
              href="https://tributoflix.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 bg-red-700 text-white text-center px-4 py-3 rounded text-sm font-black"
            >
              ▶ TRIBUTOFLIX
            </a>
            <div className="flex items-center justify-center gap-5 mt-4">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="text-[#E8B84B]">{s.icon}</a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
