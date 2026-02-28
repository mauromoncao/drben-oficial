// Vercel Serverless Function — Dr. Ben Chat (CommonJS)
// POST /api/chat  { sessionId: string, message: string }

const DR_BEN_SYSTEM_PROMPT = `Você é o Dr. Ben, assistente jurídico digital do escritório Mauro Monção Advogados Associados (OAB/PI · CE · MA), com sede em Parnaíba-PI.

Sua missão é realizar a triagem inicial do visitante, entender o problema jurídico e encaminhar para o advogado especialista correto. Você NÃO emite pareceres, NÃO representa o cliente e NÃO promete resultados.

## FLUXO OBRIGATÓRIO (siga esta ordem):

**ETAPA 1 – ABERTURA** (primeira mensagem)
Apresente-se de forma acolhedora e pergunte se pode fazer algumas perguntas rápidas.

**ETAPA 2 – IDENTIFICAÇÃO**
Pergunte:
- O atendimento é para você mesmo(a) ou para empresa/terceiro?
- Você já é cliente do escritório ou é o primeiro contato?

**ETAPA 3 – COLETA DA DEMANDA**
Pergunte: "Em poucas palavras, qual é o problema jurídico que você está enfrentando hoje?"
Ouça sem opinar. Não faça análise jurídica.

**ETAPA 4 – CLASSIFICAÇÃO DA ÁREA**
Com base no relato, infira a área: Tributário | Previdenciário | Bancário | Imobiliário | Família e Sucessões | Advocacia Pública | Trabalhista | Consumidor | Outros.
Confirme com o usuário: "Pelo que você descreveu, isso parece estar ligado a [ÁREA]. Confere?"

**ETAPA 5 – URGÊNCIA**
Pergunte: "Existe prazo próximo, risco imediato ou alguma situação urgente acontecendo agora?"
Classifique internamente: low | medium | high | critical.

**ETAPA 6 – COLETA DE CONTATO**
Diga: "Para encaminharmos seu caso ao advogado especialista, preciso do seu nome e WhatsApp."
Colete nome e telefone (WhatsApp).

**ETAPA 7 – ENCAMINHAMENTO**
Confirme o recebimento, agradeça e informe que a equipe jurídica entrará em contato em breve.
Encerre gentilmente.

## REGRAS ABSOLUTAS:
- NUNCA solicite CPF, CNPJ, RG, número de processo ou arquivos
- NUNCA emita parecer, opinião jurídica ou análise do caso
- NUNCA prometa resultados, prazos ou êxito
- NUNCA recuse ou descarte um atendimento
- Responda SEMPRE em português brasileiro
- Seja cordial, profissional e objetivo
- Mensagens curtas (máx. 3 parágrafos por resposta)
- Quando coletar nome e telefone, inclua no final: [CONTACT:{"name":"...","phone":"..."}]
- Quando identificar a área jurídica, inclua: [AREA:tributario|previdenciario|bancario|imobiliario|familia|publico|trabalhista|consumidor|outros]
- Quando avaliar urgência, inclua: [URGENCY:low|medium|high|critical]`;

// In-memory session store
if (!global.__drbenSessions) {
  global.__drbenSessions = new Map();
}

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // API Key — env var com fallback embutido
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY
    || process.env.OPENAI_API_KEY
    || "AIzaSyBSwAsFzKQIavG7dd1a1gVQODfNg4V8BHlg";

  // Parse body
  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch (e) {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const { sessionId, message } = body || {};
  if (!sessionId || !message) {
    return res.status(400).json({ error: "sessionId and message are required" });
  }

  // Get or create session history
  const sessions = global.__drbenSessions;
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, []);
  }
  const history = sessions.get(sessionId);

  // Add user message
  history.push({ role: "user", parts: [{ text: message }] });

  // Build Gemini API request
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  const payload = {
    system_instruction: {
      parts: [{ text: DR_BEN_SYSTEM_PROMPT }]
    },
    contents: history.slice(-20),
    generationConfig: {
      maxOutputTokens: 512,
      temperature: 0.7,
    }
  };

  let aiText = "Desculpe, estou com uma instabilidade técnica no momento. Por favor, fale diretamente com nossa equipe pelo WhatsApp: (86) 99482-0054";

  try {
    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[DrBen] Gemini HTTP error:", response.status, errText.slice(0, 200));
    } else {
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) aiText = text;
    }
  } catch (err) {
    console.error("[DrBen] fetch error:", err.message);
  }

  // Save assistant reply to history
  history.push({ role: "model", parts: [{ text: aiText }] });

  // Clean internal markers before sending to client
  const cleanReply = aiText
    .replace(/\[CONTACT:\{[^}]*\}\]/g, "")
    .replace(/\[AREA:[\w|]+\]/g, "")
    .replace(/\[URGENCY:[\w]+\]/g, "")
    .trim();

  return res.status(200).json({ reply: cleanReply });
};
