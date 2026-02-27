import { useState, useEffect } from "react";

const GOLD      = "#E8B84B";
const NAVY      = "#19385C";
const DR_BEN_WA = "5586994820054";

const CHAT_MSGS = [
  { text: "Olá! Sou o Dr. Ben, assistente jurídico virtual do escritório Mauro Monção. 👋" },
  { text: "Posso te ajudar agora mesmo! Escolha como prefere falar comigo:" },
];

export default function WhatsAppFloat() {
  const [chatOpen, setChatOpen]       = useState(false);
  const [showBubble, setShowBubble]   = useState(false);
  const [visibleMsgs, setVisibleMsgs] = useState(0);

  /* Notificação após 3s */
  useEffect(() => {
    const t = setTimeout(() => setShowBubble(true), 3000);
    return () => clearTimeout(t);
  }, []);

  /* Anima mensagens ao abrir chat */
  useEffect(() => {
    if (!chatOpen) { setVisibleMsgs(0); return; }
    setVisibleMsgs(0);
    CHAT_MSGS.forEach((_, i) => {
      setTimeout(() => setVisibleMsgs(i + 1), (i + 1) * 700);
    });
  }, [chatOpen]);

  const handleChatOpen = () => { setChatOpen(true); setShowBubble(false); };

  return (
    <>
      {/* ══════════════════════════════
          PAINEL DO CHAT
      ══════════════════════════════ */}
      {chatOpen && (
        <div
          className="fixed bottom-32 right-4 sm:right-6 z-50 w-[320px] sm:w-[360px] rounded-3xl overflow-hidden shadow-2xl"
          style={{ background: NAVY, border: `2px solid ${GOLD}50` }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-5 py-4"
            style={{ background: "linear-gradient(135deg,#0f2a45,#19385C)", borderBottom: `1px solid ${GOLD}30` }}
          >
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2" style={{ borderColor: GOLD }}>
                <img src="/dr-ben.jpg" alt="Dr. Ben" className="w-full h-full object-cover object-top" />
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-[#19385C]" />
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-base leading-tight">Dr. Ben</p>
              <p className="text-green-400 text-xs font-medium">● Online agora</p>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-white/60 hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Mensagens */}
          <div className="px-4 py-5 space-y-3" style={{ minHeight: "110px" }}>
            {CHAT_MSGS.slice(0, visibleMsgs).map((msg, i) => (
              <div key={i} className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border" style={{ borderColor: `${GOLD}40` }}>
                  <img src="/dr-ben.jpg" alt="Dr. Ben" className="w-full h-full object-cover object-top" />
                </div>
                <div
                  className="rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm text-white leading-relaxed max-w-[240px]"
                  style={{ background: "rgba(255,255,255,0.10)" }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {visibleMsgs < CHAT_MSGS.length && (
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border" style={{ borderColor: `${GOLD}40` }}>
                  <img src="/dr-ben.jpg" alt="Dr. Ben" className="w-full h-full object-cover object-top" />
                </div>
                <div className="rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center" style={{ background: "rgba(255,255,255,0.10)" }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="px-4 pb-5 space-y-3">
            <a
              href={`https://wa.me/${DR_BEN_WA}?text=${encodeURIComponent("Olá Dr. Ben! Vim pelo site e gostaria de uma orientação jurídica.")}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 w-full px-5 py-3.5 rounded-2xl font-bold text-sm hover:brightness-110 transition-all shadow-md"
              style={{ background: "#25D366", color: "#fff" }}
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.387 0-4.594-.838-6.324-2.236l-.442-.37-3.063 1.027 1.027-3.063-.37-.442A9.96 9.96 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
                </svg>
              </div>
              <div className="text-left">
                <p className="font-bold leading-tight">WhatsApp Direto</p>
                <p className="text-white/80 text-xs font-normal">Fale agora com o Dr. Ben</p>
              </div>
              <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
            </a>

            <a
              href={`https://wa.me/${DR_BEN_WA}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 w-full px-5 py-3.5 rounded-2xl font-bold text-sm hover:brightness-110 border-2 transition-all"
              style={{ background: "transparent", borderColor: GOLD, color: GOLD }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: `${GOLD}20` }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: GOLD }}>
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="text-left">
                <p className="font-bold leading-tight">Iniciar Atendimento</p>
                <p className="text-xs font-normal" style={{ color: `${GOLD}99` }}>Chat jurídico inteligente</p>
              </div>
              <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ color: GOLD }}><path d="M9 18l6-6-6-6"/></svg>
            </a>

            <p className="text-center text-white/40 text-xs pt-1">🔒 Sigilo garantido · 24h disponível</p>
          </div>
        </div>
      )}

      {/* ══════════════════════════════
          DOIS AVATARES FLUTUANTES
      ══════════════════════════════ */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col items-center gap-3">

        {/* Bolinha de notificação */}
        {showBubble && !chatOpen && (
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl rounded-br-sm shadow-xl text-sm font-semibold text-white cursor-pointer animate-bounce"
            style={{ background: NAVY, border: `1.5px solid ${GOLD}60` }}
            onClick={handleChatOpen}
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
            Dr. Ben está online!
          </div>
        )}

        {/* ── AVATAR 1: CHAT (azul marinho + borda dourada) ── */}
        <div className="flex flex-col items-center gap-1 group">
          <button
            onClick={chatOpen ? () => setChatOpen(false) : handleChatOpen}
            className="relative"
            aria-label="Abrir chat com Dr. Ben"
          >
            {/* Anel pulsando dourado */}
            {!chatOpen && (
              <span
                className="absolute inset-0 rounded-full animate-ping opacity-25 pointer-events-none"
                style={{ border: `2px solid ${GOLD}` }}
              />
            )}
            {/* Círculo azul com foto */}
            <div
              className="w-14 h-14 rounded-full overflow-hidden border-[3px] shadow-2xl transition-transform hover:scale-105"
              style={{
                borderColor: GOLD,
                background: NAVY,
                boxShadow: chatOpen ? `0 0 20px ${GOLD}80` : `0 4px 20px rgba(0,0,0,0.35)`,
              }}
            >
              <img src="/dr-ben.jpg" alt="Dr. Ben Chat" className="w-full h-full object-cover object-top" />
            </div>
            {/* Ponto online */}
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-white" />
          </button>
          {/* Label */}
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: NAVY, color: GOLD, border: `1px solid ${GOLD}50` }}
          >
            Chat
          </span>
        </div>

        {/* ── AVATAR 2: WHATSAPP (verde + foto) ── */}
        <div className="flex flex-col items-center gap-1 group">
          <a
            href={`https://wa.me/${DR_BEN_WA}?text=${encodeURIComponent("Olá Dr. Ben! Vim pelo site e gostaria de uma orientação jurídica.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block"
            aria-label="WhatsApp Dr. Ben"
          >
            {/* Anel pulsando verde */}
            <span
              className="absolute inset-0 rounded-full animate-ping opacity-25 pointer-events-none"
              style={{ border: "2px solid #25D366" }}
            />
            {/* Círculo verde com foto */}
            <div
              className="w-14 h-14 rounded-full overflow-hidden border-[3px] shadow-2xl transition-transform hover:scale-105"
              style={{
                borderColor: "#25D366",
                background: "#25D366",
                boxShadow: "0 4px 20px rgba(37,211,102,0.45)",
              }}
            >
              <img src="/dr-ben.jpg" alt="Dr. Ben WhatsApp" className="w-full h-full object-cover object-top" />
            </div>
            {/* Ponto online */}
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-white animate-pulse" />
          </a>
          {/* Label */}
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
            style={{ background: "#25D366" }}
          >
            WhatsApp
          </span>
        </div>

      </div>
    </>
  );
}
