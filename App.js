// app/App.js
import React, { useEffect, useState } from 'react';
import { definirAcaoAoReceber401 } from './servicos/api';
import TelaLogin from './telas/TelaLogin';
import TelaCadastro from './telas/TelaCadastro';
import TelaPrincipal from './telas/TelaPrincipal';
import TelaUsuarios from './telas/TelaUsuarios';
import TelaEditarUsuario from './telas/TelaEditarUsuario';

// Telas possíveis: 'login', 'cadastro', 'principal', 'usuarios', 'editar'
export default function App() {
  const [tela, setTela] = useState('login');

  // Sessão guardada só na memória: some quando o app é fechado.
  const [token, setToken] = useState('');
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState(null);

  // Mensagem que aparece no topo da tela de login
  // (vem do cadastro concluído ou de uma sessão expirada).
  const [mensagemLogin, setMensagemLogin] = useState('');

  // Qualquer rota fechada que responda 401 limpa a sessão
  // e volta para o login com a mensagem pedida.
  useEffect(() => {
    definirAcaoAoReceber401(() => {
      setToken('');
      setNomeUsuario('');
      setUsuarioEmEdicao(null);
      setMensagemLogin('Sua sessão expirou, entre de novo');
      setTela('login');
    });
  }, []);

  function entrarNoApp(novoToken, nome) {
    setToken(novoToken);
    setNomeUsuario(nome);
    setMensagemLogin('');
    setTela('principal');
  }

  function sair() {
    setToken('');
    setNomeUsuario('');
    setUsuarioEmEdicao(null);
    setMensagemLogin('');
    setTela('login');
  }

  // Se estiver numa tela fechada sem token, cai no login por segurança.
  const telaAtual =
    token || tela === 'login' || tela === 'cadastro' ? tela : 'login';

  switch (telaAtual) {
    case 'cadastro':
      return (
        <TelaCadastro
          aoCadastrar={(mensagem) => {
            setMensagemLogin(mensagem);
            setTela('login');
          }}
          aoVoltar={() => {
            setMensagemLogin('');
            setTela('login');
          }}
        />
      );
    case 'principal':
      return (
        <TelaPrincipal
          nome={nomeUsuario}
          irParaUsuarios={() => setTela('usuarios')}
          sair={sair}
        />
      );
    case 'usuarios':
      return (
        <TelaUsuarios
          token={token}
          aoVoltar={() => setTela('principal')}
          aoAbrirUsuario={(usuario) => {
            setUsuarioEmEdicao(usuario);
            setTela('editar');
          }}
        />
      );
    case 'editar':
      return (
        <TelaEditarUsuario
          token={token}
          usuario={usuarioEmEdicao}
          aoVoltar={() => setTela('usuarios')}
        />
      );
    default:
      return (
        <TelaLogin
          mensagemInicial={mensagemLogin}
          aoEntrar={entrarNoApp}
          irParaCadastro={() => {
            setMensagemLogin('');
            setTela('cadastro');
          }}
        />
      );
  }
}
