import { useState, useRef, useEffect, useCallback } from "react";
import {
  X, Send, Loader2, ChevronDown,
  User, Phone, Minimize2, Bot
} from "lucide-react";

const GOLD = "#E8B84B";
const NAVY = "#19385C";
const WA = "5586994820054";
const WA_MSG = encodeURIComponent("Olá, Dr. Ben! Preciso de uma orientação jurídica.");

// Persistent session ID per browser tab
function getSessionId() {
  let id = sessionStorage.getItem("drben_session");
  if (!id) {
    id = `drben_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem("drben_session", id);
  }
  return id;
}

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MSG: ChatMsg = {
  role: "assistant",
  content:
    "Olá! Eu sou o **Dr. Ben**, assistente jurídico digital do escritório Mauro Monção Advogados Associados.\n\nEstou aqui para entender sua situação e encaminhar você ao especialista mais adequado. Posso fazer algumas perguntas rápidas?",
};

// Simple markdown: **bold** and line breaks
function renderContent(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part.split("\n").map((line, j, arr) => (
      <span key={`${i}-${j}`}>
        {line}
        {j < arr.length - 1 ? <br /> : null}
      </span>
    ));
  });
}

export default function DrBenChat() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [sessionId] = useState(getSessionId);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Show floating button after 3 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowBubble(true), 3000);
    return () => clearTimeout(t);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
    }
  }, [messages, open, minimized]);

  // Focus input when chat opens
  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open, minimized]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: text }),
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: data.reply || "Não consegui processar sua mensagem. Tente novamente." },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content:
            "Desculpe, tive uma instabilidade. Tente novamente ou fale pelo WhatsApp: (86) 99482-0054",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, sessionId]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* ── Floating launcher ── */}
      <div
        className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
        style={{
          opacity: showBubble ? 1 : 0,
          transform: showBubble ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.5s, transform 0.5s",
          pointerEvents: showBubble ? "auto" : "none",
        }}
      >
        {/* Hint bubble — only when chat is closed */}
        {!open && (
          <div
            className="px-4 py-2 rounded-2xl rounded-br-sm text-sm font-semibold shadow-lg cursor-pointer hover:brightness-110 transition-all"
            style={{
              background: NAVY,
              color: GOLD,
              border: `1px solid ${GOLD}40`,
              maxWidth: 200,
            }}
            onClick={() => { setOpen(true); setMinimized(false); }}
          >
            Fale com Dr. Ben
            <div className="text-white/60 text-xs font-normal mt-0.5">
              Assistente jurídico · 24h
            </div>
          </div>
        )}

        {/* Main button */}
        {!open && (
          <button
            onClick={() => { setOpen(true); setMinimized(false); }}
            className="relative w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all"
            style={{
              background: `linear-gradient(135deg, ${NAVY}, #0f2d4a)`,
              border: `2px solid ${GOLD}`,
            }}
            aria-label="Abrir chat Dr. Ben"
          >
            <Bot className="w-7 h-7" style={{ color: GOLD }} />
            {/* Online dot */}
            <span
              className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-gray-900 animate-pulse"
              style={{ background: "#22c55e" }}
            />
          </button>
        )}

        {/* ── Chat window ── */}
        {open && (
          <div
            className="flex flex-col rounded-3xl shadow-2xl overflow-hidden"
            style={{
              width: minimized ? 280 : "min(380px, calc(100vw - 24px))",
              height: minimized ? 56 : "min(600px, calc(100vh - 100px))",
              background: "#07182e",
              border: `1px solid ${GOLD}30`,
              boxShadow: `0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px ${GOLD}15`,
              transition: "width 0.3s, height 0.3s",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3 shrink-0 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${NAVY}, #0f2d4a)`,
                borderBottom: `1px solid ${GOLD}25`,
              }}
              onClick={() => setMinimized(m => !m)}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ border: `2px solid ${GOLD}`, background: `${NAVY}` }}
                >
                  <Bot className="w-5 h-5" style={{ color: GOLD }} />
                </div>
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-900 animate-pulse"
                  style={{ background: "#22c55e" }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm leading-none" style={{ color: GOLD }}>
                  Dr. Ben
                </p>
                <p className="text-white/50 text-xs mt-0.5">
                  Assistente Jurídico · Online agora
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={e => { e.stopPropagation(); setMinimized(m => !m); }}
                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 transition-all"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                  aria-label="Minimizar"
                >
                  {minimized ? (
                    <ChevronDown className="w-4 h-4 rotate-180" />
                  ) : (
                    <Minimize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={e => { e.stopPropagation(); setOpen(false); }}
                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 transition-all"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                  aria-label="Fechar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages + input (hidden when minimized) */}
            {!minimized && (
              <>
                {/* Messages list */}
                <div
                  className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: `${GOLD}30 transparent`,
                  }}
                >
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {/* Avatar */}
                      <div className="shrink-0 mt-1">
                        {msg.role === "assistant" ? (
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center"
                            style={{ border: `1px solid ${GOLD}40`, background: NAVY }}
                          >
                            <Bot className="w-4 h-4" style={{ color: GOLD }} />
                          </div>
                        ) : (
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center"
                            style={{ background: `${GOLD}20`, border: `1px solid ${GOLD}30` }}
                          >
                            <User className="w-3.5 h-3.5" style={{ color: GOLD }} />
                          </div>
                        )}
                      </div>

                      {/* Bubble */}
                      <div
                        className="max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
                        style={
                          msg.role === "assistant"
                            ? {
                                background: "rgba(255,255,255,0.06)",
                                color: "rgba(255,255,255,0.88)",
                                borderRadius: "4px 18px 18px 18px",
                                border: `1px solid ${GOLD}15`,
                              }
                            : {
                                background: `linear-gradient(135deg, ${GOLD}CC, ${GOLD})`,
                                color: NAVY,
                                fontWeight: 500,
                                borderRadius: "18px 4px 18px 18px",
                              }
                        }
                      >
                        {renderContent(msg.content)}
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {loading && (
                    <div className="flex gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1"
                        style={{ border: `1px solid ${GOLD}40`, background: NAVY }}
                      >
                        <Bot className="w-4 h-4" style={{ color: GOLD }} />
                      </div>
                      <div
                        className="px-4 py-3 rounded-2xl"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: `1px solid ${GOLD}15`,
                          borderRadius: "4px 18px 18px 18px",
                        }}
                      >
                        <div className="flex gap-1 items-center h-5">
                          {[0, 1, 2].map(i => (
                            <span
                              key={i}
                              className="w-1.5 h-1.5 rounded-full animate-bounce"
                              style={{ background: GOLD, animationDelay: `${i * 0.15}s` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* WhatsApp shortcut */}
                <div className="px-4 pb-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <a
                    href={`https://wa.me/${WA}?text=${WA_MSG}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-xl text-xs font-semibold hover:brightness-110 transition-all"
                    style={{
                      background: "#25D36618",
                      color: "#25D366",
                      border: "1px solid #25D36630",
                    }}
                  >
                    <Phone className="w-3 h-3" />
                    Prefere o WhatsApp? (86) 99482-0054
                  </a>
                </div>

                {/* Input */}
                <div className="px-3 pb-3 pt-1 flex gap-2 items-end shrink-0">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Digite sua mensagem..."
                    rows={1}
                    disabled={loading}
                    className="flex-1 resize-none rounded-2xl px-4 py-3 text-sm outline-none transition-all"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: `1px solid ${input ? GOLD + "60" : "rgba(255,255,255,0.12)"}`,
                      color: "rgba(255,255,255,0.9)",
                      maxHeight: 100,
                      lineHeight: 1.5,
                    }}
                    onInput={e => {
                      const t = e.target as HTMLTextAreaElement;
                      t.style.height = "auto";
                      t.style.height = Math.min(t.scrollHeight, 100) + "px";
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || loading}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 hover:brightness-110 disabled:opacity-40"
                    style={{ background: `linear-gradient(135deg, ${GOLD}, #d4a03c)` }}
                    aria-label="Enviar"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" style={{ color: NAVY }} />
                    ) : (
                      <Send className="w-4 h-4" style={{ color: NAVY }} />
                    )}
                  </button>
                </div>

                <div className="text-center pb-2">
                  <span className="text-white/20 text-[10px]">
                    Dr. Ben · Mauro Monção Advogados · OAB/PI
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
