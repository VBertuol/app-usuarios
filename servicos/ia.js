// app/servicos/ia.js
//
// Serviço de conversa com a API de IA.
// Esta API NÃO usa o token do login: é só um POST com a pergunta.

// Endereço da API de IA: online, vem da variável EXPO_PUBLIC_API_IA_URL (definida na Vercel).
const ENDERECO_IA = process.env.EXPO_PUBLIC_API_IA_URL || 'http://localhost:3001';

// Devolve um objeto simples para a tela:
// - sucesso true  -> resposta e tokens preenchidos
// - sucesso false -> mensagem explica o motivo (ex.: limite de uso atingido)
export async function perguntarIa(pergunta) {
  try {
    const respostaHttp = await fetch(`${ENDERECO_IA}/perguntar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pergunta }),
    });

    let corpo = null;
    try {
      corpo = await respostaHttp.json();
    } catch (ignorado) {
      corpo = null; // a resposta não era JSON
    }

    // Erro: a API avisou sucesso false, o HTTP falhou ou o corpo veio estranho.
    if (!respostaHttp.ok || !corpo || corpo.sucesso === false) {
      return {
        sucesso: false,
        resposta: null,
        tokens: null,
        mensagem:
          (corpo && corpo.mensagem) ||
          `A API de IA respondeu com erro (código ${respostaHttp.status}).`,
      };
    }

    return {
      sucesso: true,
      resposta: corpo.dados?.resposta ?? '(A IA não mandou texto na resposta.)',
      tokens: corpo.dados?.tokens ?? null,
      mensagem: corpo.mensagem ?? null,
    };
  } catch (erro) {
    // Caiu aqui antes de conversar com a API (sem internet, endereço errado etc.).
    return {
      sucesso: false,
      resposta: null,
      tokens: null,
      mensagem: 'Não consegui falar com a IA. Confira sua conexão e tente de novo.',
    };
  }
}
