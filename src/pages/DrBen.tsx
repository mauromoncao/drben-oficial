import { useState, useEffect } from "react";
import SEOHead, { buildServiceLD, buildBreadcrumbLD, buildOrganizationLD } from "@/components/SEOHead";
import {
  MessageCircle, Phone, ChevronDown, CheckCircle, Zap, Clock,
  Shield, Brain, ArrowRight, Sparkles, Lock,
  FileText, Users, HeartHandshake, Scale, Building2, Landmark,
  MessageSquare, AlertCircle, UserCheck, Search, SendHorizonal,
  ClipboardList, XCircle
} from "lucide-react";

const GOLD = "#E8B84B";
const NAVY = "#19385C";
const WA = "5586994820054"; // número bruto para wa.me
const WA_MSG = encodeURIComponent("Olá, Dr. Ben! Preciso de uma orientação jurídica.");

function StickyCTA() {
  const [v, setV] = useState(false);
  useEffect(() => {
    const h = () => setV(window.scrollY > 400);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 md:hidden transition-transform duration-300 ${v ? "translate-y-0" : "translate-y-full"}`}
      style={{ background: NAVY, borderTop: `2px solid ${GOLD}` }}>
      <div className="flex gap-2 p-3">
        <a href={`https://wa.me/${WA}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
          style={{ background: "#25D366", color: "#fff" }}>
          <MessageCircle className="w-4 h-4" />Falar com Dr. Ben
        </a>
        <a href="#fluxo" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
          style={{ background: GOLD, color: NAVY }}>
          <ClipboardList className="w-4 h-4" />Ver Fluxo
        </a>
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [o, setO] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden border transition-all"
      style={{ borderColor: o ? `${GOLD}40` : "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)" }}>
      <button onClick={() => setO(!o)} className="w-full flex items-center justify-between px-6 py-4 text-left">
        <span className="text-white font-semibold text-sm pr-4">{q}</span>
        <ChevronDown className="w-5 h-5 shrink-0 transition-transform"
          style={{ color: GOLD, transform: o ? "rotate(180deg)" : "rotate(0deg)" }} />
      </button>
      {o && <div className="px-6 pb-5"><p className="text-white/70 text-sm leading-relaxed">{a}</p></div>}
    </div>
  );
}

export default function DrBen() {
  return (
    <>
      <SEOHead
        title="Dr. Ben — Assistente Jurídico com Inteligência Artificial"
        description="Dr. Ben é o assistente jurídico IA do escritório Mauro Monção. Tire dúvidas tributárias, previdenciárias e empresariais de forma rápida e segura."
        canonical="https://mauromoncao.adv.br/dr-ben"
        keywords="assistente jurídico IA, chatbot advogado, dúvidas jurídicas online, Dr. Ben"
        jsonLd={[
          buildServiceLD({ name: "Dr. Ben — Assistente Jurídico com Inteligência Artificial", description: "Dr. Ben é o assistente jurídico IA do escritório Mauro Monção. Tire dúvidas tributárias, previdenciárias e empresariais de forma rápida e segura.", url: "https://mauromoncao.adv.br/dr-ben" }),
          buildBreadcrumbLD([{ name: "Início", url: "/" }, { name: "Soluções Jurídicas", url: "/solucoes-juridicas" }, { name: "Dr. Ben", url: "/dr-ben" }]),
          buildOrganizationLD(),
        ]}
      />

      <StickyCTA />

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section className="relative overflow-hidden text-white"
        style={{ minHeight: "100vh", display: "flex", alignItems: "center", background: `linear-gradient(135deg, #0b1e35 0%, ${NAVY} 55%, #0f2d4a 100%)` }}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: `linear-gradient(${GOLD} 1px,transparent 1px),linear-gradient(90deg,${GOLD} 1px,transparent 1px)`, backgroundSize: "60px 60px" }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${GOLD}10 0%, transparent 65%)`, transform: "translate(30%,-20%)" }} />

        <div className="container relative z-10 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT — copy */}
            <div>
              {/* Badge escritório */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8 border"
                style={{ background: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.75)" }}>
                <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: GOLD }}>
                  <Scale className="w-2.5 h-2.5" style={{ color: NAVY }} />
                </div>
                Mauro Monção Advogados Associados
              </div>

              {/* Headline */}
              <h1 className="font-serif font-bold leading-[1.1] mb-6" style={{ fontSize: "clamp(2.2rem,4.5vw,3.5rem)" }}>
                Conheça o{" "}
                <em className="not-italic" style={{ color: GOLD }}>Dr. Ben</em>
                <br />
                <span className="text-white">Seu Assistente</span>
                <br />
                <span className="text-white">Jurídico Virtual</span>
              </h1>

              {/* Apresentação oficial */}
              <p className="text-white/75 text-base leading-relaxed mb-10 max-w-xl">
                Dr. Ben é o assistente jurídico digital do Mauro Monção Advogados Associados,
                concebido para oferecer uma experiência de atendimento contemporânea, inteligente
                e altamente qualificada. Com uma proposta inovadora e orientada por eficiência,
                ele organiza o primeiro contato, facilita o acesso à informação e conduz o
                visitante, com fluidez e precisão, às soluções jurídicas mais adequadas,
                traduzindo tecnologia em excelência no relacionamento.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mb-10">
                <a href={`https://wa.me/${WA}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-full font-bold text-sm hover:brightness-110 transition-all shadow-lg"
                  style={{ background: GOLD, color: NAVY }}>
                  <MessageCircle className="w-4 h-4" />Iniciar Atendimento
                </a>
                <a href="#areas"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-full font-bold text-sm border-2 hover:bg-white/5 transition-all"
                  style={{ borderColor: "rgba(255,255,255,0.30)", color: "rgba(255,255,255,0.9)" }}>
                  <Scale className="w-4 h-4" />Áreas de Atuação
                </a>
              </div>

              {/* Atributos */}
              <div className="flex flex-wrap gap-6">
                {[
                  { icon: Shield, text: "Sigilo garantido" },
                  { icon: MessageSquare, text: "Texto ou áudio" },
                  { icon: Clock, text: "24h disponível" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-xs text-white/55">
                    <Icon className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.45)" }} />{text}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — foto redonda */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative flex flex-col items-center">
                {/* Status badge */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)" }}>
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#22c55e" }} />
                  Online agora · Resposta imediata
                </div>

                {/* Foto redonda com anel dourado */}
                <div className="relative">
                  <div className="absolute -inset-6 rounded-full blur-2xl opacity-20 pointer-events-none" style={{ background: GOLD }} />
                  <div className="relative rounded-full overflow-hidden shadow-2xl"
                    style={{ width: 280, height: 280, border: `3px solid ${GOLD}` }}>
                    <img src="/dr-ben.jpg" alt="Dr. Ben — Assistente Jurídico Digital"
                      className="w-full h-full object-cover object-top" />
                  </div>
                  {/* Label */}
                  <div className="absolute bottom-4 right-0 translate-x-1/4 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg"
                    style={{ background: `linear-gradient(135deg,#0b1e35,${NAVY})`, border: `1px solid ${GOLD}50`, color: GOLD }}>
                    Dr. Ben
                  </div>
                </div>

                {/* Chips de área */}
                <div className="flex flex-wrap justify-center gap-2 mt-8 max-w-xs">
                  {["Tributário","Previdenciário","Bancário","Imobiliário","Família","Público"].map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ background: `${GOLD}15`, color: GOLD, border: `1px solid ${GOLD}30` }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/30" />
        </div>
      </section>

      {/* ══════════════════════ STATS ══════════════════════ */}
      <section className="py-10" style={{ background:`${GOLD}0A`, borderTop:`1px solid ${GOLD}20`, borderBottom:`1px solid ${GOLD}20` }}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
            {[
              { v:"24h", l:"Disponível todos os dias" },
              { v:"< 1min", l:"Tempo médio de resposta" },
              { v:"8 áreas", l:"Do Direito cobertas" },
              { v:"100%", l:"Sigilo nas conversas" },
            ].map(({ v, l }) => (
              <div key={l} className="text-center">
                <p className="font-serif text-3xl font-black mb-1" style={{ color: GOLD }}>{v}</p>
                <p className="text-white/50 text-xs">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ FLUXO OPERACIONAL (POP) ══════════════════════ */}
      <section id="fluxo" className="py-20 bg-white">
        <div className="container max-w-5xl">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.25em] block mb-3" style={{ color: GOLD }}>Fluxo de Atendimento</span>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold mb-4" style={{ color: NAVY }}>
              Como Dr. Ben <span style={{ color: GOLD }}>conduz seu atendimento</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-base">
              Processo estruturado, ético e eficiente — do primeiro contato ao encaminhamento para o especialista.
            </p>
          </div>

          {/* Timeline fluxo */}
          <div className="relative">
            {/* Linha vertical */}
            <div className="absolute left-8 top-0 bottom-0 w-px hidden md:block" style={{ background: `linear-gradient(to bottom, ${GOLD}40, ${GOLD}10)` }} />

            <div className="space-y-6">
              {[
                {
                  n: "01", icon: MessageCircle, color: "#25D366",
                  title: "Abertura",
                  msg: '"Olá! Eu sou o Dr. Ben, assistente jurídico do escritório Mauro Monção Advogados. Posso te fazer algumas perguntas rápidas para entender como podemos ajudar?"',
                  desc: "Primeiro contato acolhedor e objetivo. Dr. Ben se identifica e solicita permissão para prosseguir.",
                },
                {
                  n: "02", icon: UserCheck, color: GOLD,
                  title: "Identificação",
                  msg: '"O atendimento é para você mesmo(a) ou para empresa/terceiro?" → "Você já é cliente do escritório ou este é o primeiro contato?"',
                  desc: "Duas perguntas simples para identificar perfil: pessoa física ou jurídica, cliente atual ou novo contato.",
                },
                {
                  n: "03", icon: Search, color: NAVY,
                  title: "Coleta da Demanda",
                  msg: '"Em poucas palavras, qual é o problema jurídico que você está enfrentando hoje?"',
                  desc: "Dr. Ben ouve sem opinar, apenas registra o relato para encaminhamento preciso ao especialista correto.",
                },
                {
                  n: "04", icon: ClipboardList, color: "#a855f7",
                  title: "Classificação da Área",
                  msg: '"Pelo que você descreveu, isso parece estar ligado a [ÁREA JURÍDICA]. Confere?"',
                  desc: "Com base no relato, Dr. Ben infere a área predominante (Tributário, Família, Imobiliário, Bancário, Público…) e confirma com o interessado.",
                },
                {
                  n: "05", icon: AlertCircle, color: "#ef4444",
                  title: "Avaliação de Urgência",
                  msg: '"Existe prazo próximo, risco imediato ou alguma situação urgente acontecendo agora?"',
                  desc: "Classifica internamente o nível de urgência: Baixa · Média · Alta · Crítica. Casos críticos têm encaminhamento prioritário.",
                },
                {
                  n: "06", icon: SendHorizonal, color: GOLD,
                  title: "Encaminhamento",
                  msg: '"Perfeito. Sua situação exige análise técnica especializada. Vou encaminhar seu atendimento para a equipe jurídica adequada."',
                  desc: "Dr. Ben registra todo o contexto e encaminha para o advogado especialista, que recebe o caso já qualificado.",
                },
              ].map(({ n, icon: Icon, color, title, msg, desc }) => (
                <div key={n} className="relative flex gap-6 md:pl-20">
                  {/* Ícone na linha */}
                  <div className="hidden md:flex absolute left-0 w-16 h-16 rounded-2xl items-center justify-center shadow-lg shrink-0"
                    style={{ background: `linear-gradient(135deg,#0f2340,${NAVY})`, border: `2px solid ${GOLD}30` }}>
                    <Icon className="w-6 h-6" style={{ color: GOLD }} />
                  </div>

                  {/* Card */}
                  <div className="flex-1 rounded-3xl p-6 border hover:shadow-md transition-all"
                    style={{ borderColor: `${GOLD}20`, background: "#fafaf9" }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-black" style={{ color: `${GOLD}80` }}>ETAPA {n}</span>
                      <h3 className="font-serif font-bold text-base" style={{ color: NAVY }}>{title}</h3>
                    </div>
                    {/* Balão de mensagem */}
                    <div className="rounded-2xl rounded-tl-sm p-4 mb-3 text-sm italic leading-relaxed"
                      style={{ background: `${NAVY}08`, borderLeft: `3px solid ${GOLD}`, color: NAVY }}>
                      {msg}
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ LIMITES ÉTICOS ══════════════════════ */}
      <section className="py-16 text-white" style={{ background: `linear-gradient(135deg,#0b1e35,${NAVY})` }}>
        <div className="container max-w-4xl">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-[0.25em] block mb-3" style={{ color: GOLD }}>Compliance · OAB · LGPD</span>
            <h2 className="font-serif text-2xl font-bold text-white">
              O que Dr. Ben <span style={{ color: GOLD }}>nunca fará</span>
            </h2>
            <p className="text-white/60 text-sm mt-2">Limites absolutos — por ética, por segurança e por respeito ao seu caso.</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "Solicitar CPF, CNPJ, RG ou documentos pessoais",
              "Solicitar número de processo judicial",
              "Solicitar envio de arquivos ou fotos",
              "Emitir parecer, opinião ou análise jurídica",
              "Prometer resultado, prazo ou êxito",
              "Negar, recusar ou descartar qualquer atendimento",
            ].map(item => (
              <div key={item} className="flex items-start gap-3 p-4 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(239,68,68,0.25)" }}>
                <XCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#ef4444" }} />
                <span className="text-white/75 text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-white/40 text-xs mt-8">
            Conforme Código de Ética e Disciplina da OAB · Lei Geral de Proteção de Dados (LGPD)
          </p>
        </div>
      </section>

      {/* ══════════════════════ ÁREAS ══════════════════════ */}
      <section id="areas" className="py-20 bg-white">
        <div className="container max-w-5xl">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.25em] block mb-3" style={{ color: GOLD }}>Especialidades</span>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold mb-4" style={{ color: NAVY }}>
              Dr. Ben direciona para <span style={{ color: GOLD }}>8 áreas do Direito</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Building2, area: "Direito Tributário", desc: "Impostos, planejamento fiscal, recuperação de créditos, reforma tributária" },
              { icon: HeartHandshake, area: "Direito Previdenciário", desc: "INSS, aposentadoria, benefícios, revisões e recursos" },
              { icon: Scale, area: "Direito Bancário", desc: "Juros abusivos, revisão de contratos, negativação indevida" },
              { icon: Landmark, area: "Advocacia Pública", desc: "Municípios, licitações, improbidade, responsabilidade de gestores" },
              { icon: FileText, area: "Direito Imobiliário", desc: "Compra, venda, regularização, escritura e contratos" },
              { icon: Users, area: "Família e Sucessões", desc: "Herança, inventário, divórcio, holding familiar, pensão" },
              { icon: Shield, area: "Planejamento Patrimonial", desc: "Proteção de bens, holding, estruturação societária" },
              { icon: Sparkles, area: "Outras Demandas", desc: "Orientação inicial e encaminhamento para especialista adequado" },
            ].map(({ icon: Icon, area, desc }) => (
              <div key={area} className="p-5 rounded-2xl border hover:shadow-md transition-all hover:scale-[1.02]"
                style={{ borderColor: `${GOLD}20`, background: "#fafaf9" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `linear-gradient(135deg,#0f2340,${NAVY})` }}>
                  <Icon className="w-5 h-5" style={{ color: GOLD }} />
                </div>
                <h3 className="font-bold text-sm mb-1" style={{ color: NAVY }}>{area}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ DIFERENCIAIS ══════════════════════ */}
      <section className="py-20 text-white" style={{ background: `linear-gradient(135deg,#0b1e35,${NAVY})` }}>
        <div className="container max-w-5xl">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.25em] block mb-3" style={{ color: GOLD }}>Por Que Dr. Ben</span>
            <h2 className="font-serif text-3xl font-bold text-white mb-4">
              Mais que um chatbot —{" "}
              <span style={{ color: GOLD }}>um assistente jurídico real</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Brain, title: "Treinado em Direito Brasileiro", text: "Desenvolvido com base na legislação, jurisprudência e prática jurídica nacional — não é um assistente genérico de IA." },
              { icon: Clock, title: "24 horas, 7 dias por semana", text: "Dúvidas jurídicas não têm horário. Dr. Ben está disponível inclusive fins de semana e feriados, sem tempo de espera." },
              { icon: Lock, title: "Sigilo e privacidade total", text: "Suas informações são tratadas com o mesmo sigilo profissional que rege a advocacia. Nenhum dado é compartilhado com terceiros." },
              { icon: CheckCircle, title: "Respaldado por advogados reais", text: "Dr. Ben atua em conjunto com a equipe do escritório Mauro Monção. Casos complexos são encaminhados para análise humana especializada." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-5 p-7 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${GOLD}20` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${GOLD}15` }}>
                  <Icon className="w-6 h-6" style={{ color: GOLD }} />
                </div>
                <div>
                  <h3 className="font-bold text-base mb-2 text-white">{title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ FAQ ══════════════════════ */}
      <section className="py-20" style={{ background: `linear-gradient(135deg,#07182e,${NAVY})` }}>
        <div className="container max-w-3xl">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.25em] block mb-3" style={{ color: GOLD }}>Dúvidas Frequentes</span>
            <h2 className="font-serif text-3xl font-bold text-white">Perguntas sobre o Dr. Ben</h2>
          </div>
          <div className="space-y-3">
            {[
              { q:"Dr. Ben substitui um advogado?", a:"Não. Dr. Ben realiza a qualificação inicial, esclarece dúvidas e direciona para o especialista certo. Para representação formal, elaboração de peças processuais ou análise jurídica do caso concreto, você será encaminhado para um advogado do escritório." },
              { q:"É gratuito conversar com Dr. Ben?", a:"Sim. A conversa com Dr. Ben é totalmente gratuita. O objetivo é garantir que você entenda sua situação e chegue ao especialista certo, sem burocracia." },
              { q:"Dr. Ben funciona a qualquer hora?", a:"Sim. Dr. Ben está disponível 24 horas por dia, 7 dias por semana, incluindo feriados. Resposta imediata, sem necessidade de agendamento." },
              { q:"Dr. Ben vai pedir meus documentos?", a:"Não. Dr. Ben está terminantemente proibido de solicitar CPF, CNPJ, RG, número de processo ou qualquer arquivo. O atendimento inicial é feito apenas com seu relato em texto ou áudio." },
              { q:"Como funciona o encaminhamento para o advogado?", a:"Após a qualificação, Dr. Ben registra internamente seu perfil, área jurídica e nível de urgência, e encaminha o atendimento para o advogado especialista — que recebe o caso já organizado para uma conversa mais eficiente." },
              { q:"Minhas informações ficam seguras?", a:"Absoluta confidencialidade. As conversas seguem o sigilo profissional da advocacia, em conformidade com a LGPD. Suas informações não são compartilhadas com terceiros em nenhuma hipótese." },
            ].map(item => <FaqItem key={item.q} q={item.q} a={item.a} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════ CTA FINAL ══════════════════════ */}
      <section className="py-24 relative overflow-hidden text-white" style={{ background: `linear-gradient(150deg,#07182e,${NAVY})` }}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: `linear-gradient(${GOLD} 1px,transparent 1px),linear-gradient(90deg,${GOLD} 1px,transparent 1px)`, backgroundSize: "60px 60px" }} />
        <div className="container relative z-10 max-w-3xl text-center">
          <div className="w-24 h-24 rounded-full mx-auto mb-6 overflow-hidden shadow-2xl" style={{ border: `3px solid ${GOLD}` }}>
            <img src="/dr-ben.jpg" alt="Dr. Ben" className="w-full h-full object-cover object-top" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold mb-6"
            style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}40`, color: GOLD }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#22c55e" }} />
            Dr. Ben está online agora
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-white mb-4 leading-snug">
            Sua dúvida jurídica merece<br />
            <span style={{ color: GOLD }}>uma resposta imediata.</span>
          </h2>
          <p className="text-white/70 text-base leading-relaxed mb-10 max-w-xl mx-auto">
            Fale com Dr. Ben agora — gratuitamente, sem compromisso, disponível 24 horas.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={`https://wa.me/${WA}?text=${WA_MSG}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base hover:brightness-110 transition-all shadow-lg"
              style={{ background: "#25D366", color: "#fff" }}>
              <MessageCircle className="w-5 h-5" />Iniciar Atendimento pelo WhatsApp
            </a>
            <a href="tel:+5586994820054"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base border-2 hover:bg-white/5 transition-all"
              style={{ borderColor: `${GOLD}50`, color: GOLD }}>
              <Phone className="w-5 h-5" />(86) 994820054
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════ OAB FOOTER ══════════════════════ */}
      <section className="py-8 border-t" style={{ background: "#07182e", borderColor: `${GOLD}15` }}>
        <div className="container text-center">
          <p className="text-white/40 text-xs leading-relaxed max-w-2xl mx-auto">
            Dr. Ben é um assistente de triagem e direcionamento jurídico desenvolvido pelo escritório Mauro Monção Advogados Associados.
            As informações coletadas servem apenas para direcionamento inicial — a análise jurídica do caso concreto será realizada
            exclusivamente por atendimento humano especializado. OAB e LGPD compliant.
          </p>
          <p className="text-white/25 text-xs mt-3">
            © {new Date().getFullYear()} Mauro Monção Advogados Associados · OAB/PI · CE · MA
          </p>
        </div>
      </section>
    </>
  );
}
