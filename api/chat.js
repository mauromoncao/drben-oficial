// Vercel Serverless Function — Dr. Ben Chat (CommonJS)
// POST /api/chat  { sessionId: string, message: string }
//
// DR. BEN   = Assistente Jurídico — atende os CLIENTES no site
// MARA IA   = Assistente Pessoal  — avisa o DR. MAURO quando
//             Dr. Ben coleta o contato do cliente (Etapa 6)

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

// ── Configuração Evolution API (VPS Hostinger) ───────────────
const EVOLUTION_URL      = 'http://181.215.135.202:8080';
const EVOLUTION_KEY      = 'BenEvolution2026';
const EVOLUTION_INSTANCE = 'drben';
const DR_MAURO_WHATSAPP  = '5586999484761'; // número do Dr. Mauro

// ── MARA IA — Envia aviso ao Dr. Mauro via WhatsApp ─────────
async function maraAvisarDrMauro({ nome, telefone, area, urgencia, resumo }) {
  try {
    const urgenciaEmoji = { low: '🟢', medium: '🟡', high: '🔴', critical: '🚨' }[urgencia] || '🟡';
    const urgenciaLabel = { low: 'BAIXA', medium: 'MÉDIA', high: 'ALTA', critical: 'CRÍTICA' }[urgencia] || 'MÉDIA';

    const areaLabel = {
      tributario:    '🧾 Tributário',
      previdenciario:'👴 Previdenciário',
      bancario:      '🏦 Bancário',
      imobiliario:   '🏠 Imobiliário',
      familia:       '👨‍👩‍👧 Família e Sucessões',
      publico:       '⚖️ Advocacia Pública',
      trabalhista:   '👷 Trabalhista',
      consumidor:    '🛒 Consumidor',
      outros:        '📋 Outros',
    }[area] || '📋 ' + area;

    const hora = new Date().toLocaleTimeString('pt-BR', {
      timeZone: 'America/Fortaleza',
      hour: '2-digit', minute: '2-digit',
    });

    const whatsappLink = telefone
      ? `https://wa.me/55${telefone.replace(/\D/g, '')}`
      : null;

    const msg =
      `🤖 *MARA IA — Novo lead qualificado!*\n` +
      `_Dr. Ben concluiu a triagem às ${hora}_\n\n` +
      `👤 *Cliente:* ${nome || 'Não informado'}\n` +
      `📱 *WhatsApp:* ${telefone || 'Não informado'}\n` +
      `${areaLabel}\n` +
      `${urgenciaEmoji} *Urgência:* ${urgenciaLabel}\n` +
      (resumo ? `💬 *Resumo:* ${resumo}\n` : '') +
      (whatsappLink ? `\n👉 ${whatsappLink}` : '') +
      `\n\n_Toque no link para iniciar o atendimento._`;

    const res = await fetch(
      `${EVOLUTION_URL}/message/sendText/${EVOLUTION_INSTANCE}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': EVOLUTION_KEY },
        body: JSON.stringify({ number: DR_MAURO_WHATSAPP, text: msg }),
      }
    );

    const data = await res.json();
    console.log('[MARA IA] Dr. Mauro avisado:', JSON.stringify(data).slice(0, 100));
  } catch (e) {
    console.error('[MARA IA] Erro ao avisar Dr. Mauro:', e.message);
    // Não interrompe o fluxo do chat
  }
}

// ── Extrair marcadores do texto da IA ────────────────────────
function extrairMarcadores(texto) {
  const resultado = { contact: null, area: null, urgencia: null, resumo: null };

  // [CONTACT:{"name":"...","phone":"..."}]
  const contactMatch = texto.match(/\[CONTACT:(\{[^}]+\})\]/);
  if (contactMatch) {
    try { resultado.contact = JSON.parse(contactMatch[1]); } catch {}
  }

  // [AREA:tributario]
  const areaMatch = texto.match(/\[AREA:([\w|]+)\]/);
  if (areaMatch) resultado.area = areaMatch[1].split('|')[0];

  // [URGENCY:high]
  const urgenciaMatch = texto.match(/\[URGENCY:(\w+)\]/);
  if (urgenciaMatch) resultado.urgencia = urgenciaMatch[1];

  return resultado;
}

// ── Sessões em memória ───────────────────────────────────────
if (!global.__drbenSessions) global.__drbenSessions = new Map();
if (!global.__drbenTriagem)  global.__drbenTriagem  = new Map(); // dados acumulados por sessão

// ── Handler principal ────────────────────────────────────────
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')    return res.status(405).json({ error: 'Method not allowed' });

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY
    || process.env.OPENAI_API_KEY;

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const { sessionId, message } = body || {};
  if (!sessionId || !message) {
    return res.status(400).json({ error: 'sessionId and message are required' });
  }

  // Histórico da conversa
  const sessions = global.__drbenSessions;
  if (!sessions.has(sessionId)) sessions.set(sessionId, []);
  const history = sessions.get(sessionId);

  // Dados de triagem acumulados por sessão
  const triagem = global.__drbenTriagem;
  if (!triagem.has(sessionId)) {
    triagem.set(sessionId, { nome: null, telefone: null, area: null, urgencia: null, notificado: false });
  }
  const dadosTriagem = triagem.get(sessionId);

  // Adicionar mensagem do usuário ao histórico
  history.push({ role: 'user', parts: [{ text: message }] });

  // Chamar Gemini
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const payload = {
    system_instruction: { parts: [{ text: DR_BEN_SYSTEM_PROMPT }] },
    contents: history.slice(-20),
    generationConfig: { maxOutputTokens: 8192, temperature: 0.7 },
  };

  let aiText = 'Desculpe, estou com uma instabilidade técnica no momento. Por favor, fale diretamente com nossa equipe pelo WhatsApp: (86) 99482-0054';

  try {
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[Dr. Ben] Gemini erro:', response.status, errText.slice(0, 200));
    } else {
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) aiText = text;
    }
  } catch (err) {
    console.error('[Dr. Ben] fetch error:', err.message);
  }

  // Salvar resposta no histórico
  history.push({ role: 'model', parts: [{ text: aiText }] });

  // ── Extrair marcadores da resposta ────────────────────────
  const marcadores = extrairMarcadores(aiText);

  // Acumular dados de triagem à medida que chegam
  if (marcadores.area)    dadosTriagem.area    = marcadores.area;
  if (marcadores.urgencia) dadosTriagem.urgencia = marcadores.urgencia;
  if (marcadores.contact) {
    dadosTriagem.nome     = marcadores.contact.name  || dadosTriagem.nome;
    dadosTriagem.telefone = marcadores.contact.phone || dadosTriagem.telefone;
  }

  // ── MARA IA avisa Dr. Mauro quando contato foi coletado ───
  // Dispara UMA ÚNICA VEZ por sessão, assim que nome + telefone estiverem disponíveis
  if (dadosTriagem.nome && dadosTriagem.telefone && !dadosTriagem.notificado) {
    dadosTriagem.notificado = true;

    // Extrair resumo do problema do histórico (mensagem do usuário da etapa 3)
    const mensagensUsuario = history
      .filter(m => m.role === 'user')
      .map(m => m.parts[0].text);
    const resumo = mensagensUsuario.length > 1
      ? mensagensUsuario[Math.min(2, mensagensUsuario.length - 1)] // ~3ª mensagem = problema
      : mensagensUsuario[0];

    // Avisar em paralelo — não bloqueia resposta ao cliente
    maraAvisarDrMauro({
      nome:     dadosTriagem.nome,
      telefone: dadosTriagem.telefone,
      area:     dadosTriagem.area     || 'outros',
      urgencia: dadosTriagem.urgencia || 'medium',
      resumo:   resumo?.slice(0, 150),
    });

    console.log(`[Dr. Ben] Triagem completa — MARA IA avisando Dr. Mauro sobre ${dadosTriagem.nome}`);
  }

  // Limpar marcadores antes de enviar ao cliente
  const cleanReply = aiText
    .replace(/\[CONTACT:\{[^}]*\}\]/g, '')
    .replace(/\[AREA:[\w|]+\]/g, '')
    .replace(/\[URGENCY:\w+\]/g, '')
    .trim();

  return res.status(200).json({ reply: cleanReply });
};
