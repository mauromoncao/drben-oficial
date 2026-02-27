// Vercel Serverless Function — Dr. Ben Chat
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
- Mensagens curtas (máx. 3 parágrafos por resposta)`;

// In-memory session store (funciona em serverless com warm instances)
const memStore = new Map();

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: "API key not configured", reply: "Desculpe, o assistente está em manutenção. Por favor, fale pelo WhatsApp: (86) 99482-0054" });
  }

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const { sessionId, message } = body || {};
  if (!sessionId || !message) {
    return res.status(400).json({ error: "sessionId and message are required" });
  }

  // Get or create session
  if (!memStore.has(sessionId)) {
    memStore.set(sessionId, []);
  }
  const history = memStore.get(sessionId);

  // Add user message to history
  history.push({ role: "user", parts: [{ text: message }] });

  // Build Gemini request
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  const payload = {
    system_instruction: {
      parts: [{ text: DR_BEN_SYSTEM_PROMPT }]
    },
    contents: history.slice(-20), // últimas 20 mensagens para contexto
    generationConfig: {
      maxOutputTokens: 512,
      temperature: 0.7,
    }
  };

  let aiText = "Desculpe, estou com uma instabilidade técnica no momento. Por favor, fale diretamente com nossa equipe pelo WhatsApp: (86) 99482-0054";

  try {
    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("[DrBen] Gemini error:", geminiRes.status, errText);
    } else {
      const data = await geminiRes.json();
      const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (candidate) aiText = candidate;
    }
  } catch (err) {
    console.error("[DrBen] fetch error:", err);
  }

  // Save assistant response to history
  history.push({ role: "model", parts: [{ text: aiText }] });

  // Clean markers from response shown to user
  const cleanResponse = aiText
    .replace(/\[CONTACT:\{[^}]+\}\]/g, "")
    .replace(/\[AREA:[\w]+\]/g, "")
    .replace(/\[URGENCY:[\w]+\]/g, "")
    .trim();

  return res.status(200).json({ reply: cleanResponse });
}
