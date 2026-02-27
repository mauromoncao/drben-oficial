import { useState, useEffect } from "react";
import { X, Shield, Cookie } from "lucide-react";

const CONSENT_KEY = "mm_lgpd_consent";
const CONSENT_VERSION = "1.0";

type ConsentState = {
  version: string;
  accepted: boolean;
  date: string;
  analytics: boolean;
  marketing: boolean;
};

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      // Pequeno delay para não aparecer imediatamente
      setTimeout(() => setVisible(true), 1500);
    } else {
      const consent: ConsentState = JSON.parse(stored);
      if (consent.version !== CONSENT_VERSION) {
        setTimeout(() => setVisible(true), 1500);
      }
    }
  }, []);

  function saveConsent(accepted: boolean, analyticsOk: boolean, marketingOk: boolean) {
    const consent: ConsentState = {
      version: CONSENT_VERSION,
      accepted,
      date: new Date().toISOString(),
      analytics: analyticsOk,
      marketing: marketingOk,
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    setVisible(false);
  }

  function acceptAll() {
    saveConsent(true, true, true);
  }

  function acceptSelected() {
    saveConsent(true, analytics, marketing);
  }

  function rejectAll() {
    saveConsent(false, false, false);
  }

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "#1a1a2e",
        borderTop: "2px solid #c8a45a",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.4)",
        padding: showDetails ? "1.5rem" : "1rem 1.5rem",
        fontFamily: "inherit",
      }}
    >
      {/* Versão compacta */}
      {!showDetails && (
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <Cookie size={22} color="#c8a45a" style={{ flexShrink: 0 }} />
          <p style={{ color: "#e2e8f0", fontSize: "0.9rem", flex: 1, margin: 0, lineHeight: 1.5 }}>
            Utilizamos cookies para melhorar sua experiência, analisar o tráfego e personalizar conteúdo, conforme nossa{" "}
            <a href="/politica-de-privacidade" style={{ color: "#c8a45a", textDecoration: "underline" }}>
              Política de Privacidade
            </a>
            . Ao continuar, você concorda com o uso de cookies essenciais.
          </p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", flexShrink: 0 }}>
            <button
              onClick={() => setShowDetails(true)}
              style={{
                background: "transparent",
                border: "1px solid #c8a45a",
                color: "#c8a45a",
                padding: "0.4rem 0.8rem",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: "0.85rem",
                whiteSpace: "nowrap",
              }}
            >
              Personalizar
            </button>
            <button
              onClick={rejectAll}
              style={{
                background: "transparent",
                border: "1px solid #64748b",
                color: "#94a3b8",
                padding: "0.4rem 0.8rem",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: "0.85rem",
                whiteSpace: "nowrap",
              }}
            >
              Recusar
            </button>
            <button
              onClick={acceptAll}
              style={{
                background: "#c8a45a",
                border: "none",
                color: "#1a1a2e",
                padding: "0.4rem 1rem",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              Aceitar todos
            </button>
          </div>
        </div>
      )}

      {/* Versão detalhada */}
      {showDetails && (
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Shield size={20} color="#c8a45a" />
              <h3 style={{ color: "#c8a45a", margin: 0, fontSize: "1rem" }}>Preferências de Cookies</h3>
            </div>
            <button onClick={() => setShowDetails(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
              <X size={18} />
            </button>
          </div>

          {/* Cookies essenciais */}
          <div style={{ background: "#0f0f1a", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ color: "#e2e8f0", margin: 0, fontSize: "0.9rem", fontWeight: 600 }}>🔒 Cookies Essenciais</p>
              <p style={{ color: "#64748b", margin: "0.2rem 0 0", fontSize: "0.8rem" }}>Necessários para o funcionamento do site (login, segurança, preferências).</p>
            </div>
            <span style={{ color: "#22c55e", fontSize: "0.8rem", fontWeight: 600 }}>Sempre ativo</span>
          </div>

          {/* Cookies analíticos */}
          <div style={{ background: "#0f0f1a", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ color: "#e2e8f0", margin: 0, fontSize: "0.9rem", fontWeight: 600 }}>📊 Cookies Analíticos</p>
              <p style={{ color: "#64748b", margin: "0.2rem 0 0", fontSize: "0.8rem" }}>Google Analytics — nos ajudam a entender como os visitantes usam o site.</p>
            </div>
            <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={analytics}
                onChange={e => setAnalytics(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: "#c8a45a", cursor: "pointer" }}
              />
            </label>
          </div>

          {/* Cookies de marketing */}
          <div style={{ background: "#0f0f1a", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ color: "#e2e8f0", margin: 0, fontSize: "0.9rem", fontWeight: 600 }}>🎯 Cookies de Marketing</p>
              <p style={{ color: "#64748b", margin: "0.2rem 0 0", fontSize: "0.8rem" }}>Google Ads — permitem exibir anúncios relevantes para você.</p>
            </div>
            <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={marketing}
                onChange={e => setMarketing(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: "#c8a45a", cursor: "pointer" }}
              />
            </label>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", flexWrap: "wrap" }}>
            <button
              onClick={rejectAll}
              style={{ background: "transparent", border: "1px solid #64748b", color: "#94a3b8", padding: "0.5rem 1rem", borderRadius: 6, cursor: "pointer", fontSize: "0.85rem" }}
            >
              Recusar todos
            </button>
            <button
              onClick={acceptSelected}
              style={{ background: "transparent", border: "1px solid #c8a45a", color: "#c8a45a", padding: "0.5rem 1rem", borderRadius: 6, cursor: "pointer", fontSize: "0.85rem" }}
            >
              Salvar seleção
            </button>
            <button
              onClick={acceptAll}
              style={{ background: "#c8a45a", border: "none", color: "#1a1a2e", padding: "0.5rem 1.2rem", borderRadius: 6, cursor: "pointer", fontSize: "0.85rem", fontWeight: 700 }}
            >
              Aceitar todos
            </button>
          </div>

          <p style={{ color: "#475569", fontSize: "0.75rem", marginTop: "0.75rem", textAlign: "center" }}>
            Saiba mais em nossa{" "}
            <a href="/politica-de-privacidade" style={{ color: "#c8a45a" }}>Política de Privacidade</a>
            {" "}e{" "}
            <a href="/termos-de-uso" style={{ color: "#c8a45a" }}>Termos de Uso</a>.
          </p>
        </div>
      )}
    </div>
  );
}
