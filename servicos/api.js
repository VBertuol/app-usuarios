// app/servicos/api.js
// Todas as chamadas à API do app ficam neste arquivo.
// A API sempre responde { sucesso, mensagem, dados }.

// Online, o endereço vem da variável EXPO_PUBLIC_API_USUARIOS_URL (definida na Vercel);
// na máquina, sem a variável, continua o localhost.
const ENDERECO_API = process.env.EXPO_PUBLIC_API_USUARIOS_URL || 'http://localhost:3000';
// Se for testar no celular pelo Expo Go, troque pelo IP do seu PC,
// por exemplo: 'http://192.168.0.10:3000'

// O App.js registra aqui o que fazer quando uma rota fechada responder 401
// (limpar o token e voltar para a tela de login).
let acaoAoReceber401 = null;

export function definirAcaoAoReceber401(funcao) {
  acaoAoReceber401 = funcao;
}

// Erro que carrega a mensagem da API e o status HTTP da resposta.
export class ApiErro extends Error {
  constructor(mensagem, status) {
    super(mensagem);
    this.name = 'ApiErro';
    this.status = status;
  }
}

// Função interna que faz o pedido e trata a resposta.
async function pedir(caminho, { metodo = 'GET', corpo, token } = {}) {
  const cabecalhos = {};
  if (corpo !== undefined) {
    cabecalhos['Content-Type'] = 'application/json';
  }
  // O token só vai junto quando a tela o passa (rotas fechadas).
  if (token) {
    cabecalhos.Authorization = `Bearer ${token}`;
  }

  let resposta;
  try {
    resposta = await fetch(`${ENDERECO_API}${caminho}`, {
      method: metodo,
      headers: cabecalhos,
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });
  } catch (erroDeRede) {
    throw new ApiErro('Não foi possível conectar à API. Verifique se ela está rodando.', 0);
  }

  // O corpo pode não vir em JSON (por exemplo, erro do servidor); leitura protegida.
  let json = null;
  try {
    json = await resposta.json();
  } catch (erroDeJson) {
    json = null;
  }

  // 401 num pedido COM token = sessão expirada/inválida: avisa o App e interrompe.
  // (Se o próprio login responder 401, não há token, e cai no bloco de baixo,
  // mostrando a mensagem da API em vez de "sessão expirada".)
  if (resposta.status === 401 && token) {
    if (acaoAoReceber401) {
      acaoAoReceber401();
    }
    throw new ApiErro('Sua sessão expirou, entre de novo', 401);
  }

  if (!resposta.ok || !json || json.sucesso !== true) {
    const mensagem = (json && json.mensagem) || `Erro ${resposta.status} na API`;
    throw new ApiErro(mensagem, resposta.status);
  }

  // Devolve o corpo completo: { sucesso, mensagem, dados }
  return json;
}

export function cadastrarUsuario({ nome, sobrenome, email, usuario, senha }) {
  return pedir('/api/usuarios/cadastro', {
    metodo: 'POST',
    corpo: { nome, sobrenome, email, usuario, senha },
  });
}

export function entrar(email, senha) {
  return pedir('/api/usuarios/login', {
    metodo: 'POST',
    corpo: { email, senha },
  });
}

export function listarUsuarios(token) {
  return pedir('/api/usuarios', { token });
}

export function alterarUsuario(token, id, dados) {
  return pedir(`/api/usuarios/${id}`, {
    metodo: 'PUT',
    corpo: dados,
    token,
  });
}

export function excluirUsuario(token, id) {
  return pedir(`/api/usuarios/${id}`, {
    metodo: 'DELETE',
    token,
  });
}
