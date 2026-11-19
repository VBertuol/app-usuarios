// app/telas/TelaLogin.js
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { entrar, ApiErro } from '../servicos/api';
import estilo, { CORES } from '../estilos';

// Procura o nome do usuário na resposta do login, para o "Olá, <nome>".
// Se a sua API devolver o nome em outro campo, ajuste aqui.
function extrairNome(dados, email) {
  if (!dados) return '';
  if (dados.usuario && typeof dados.usuario === 'object' && dados.usuario.nome) {
    return dados.usuario.nome;
  }
  if (dados.user && typeof dados.user === 'object' && dados.user.nome) {
    return dados.user.nome;
  }
  if (typeof dados.nome === 'string' && dados.nome) {
    return dados.nome;
  }
  // Não achou o nome na resposta? Usa a parte do e-mail antes do @.
  return email.split('@')[0] || '';
}

export default function TelaLogin({ mensagemInicial, aoEntrar, irParaCadastro }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  async function fazerLogin() {
    if (carregando) return;
    if (!email.trim() || !senha) {
      setErro('Preencha o e-mail e a senha.');
      return;
    }
    setCarregando(true);
    setErro('');
    try {
      const resposta = await entrar(email.trim(), senha);
      const token = resposta.dados && resposta.dados.token;
      if (!token) {
        throw new ApiErro('A API não devolveu o token no login.', 0);
      }
      // O token e a senha não aparecem em lugar nenhum;
      // o token fica só na memória (estado do App.js).
      aoEntrar(token, extrairNome(resposta.dados, email.trim()));
    } catch (e) {
      // Mostra exatamente a mensagem que a API devolveu.
      setErro(e.message || 'Não foi possível entrar.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={estilo.tela}>
      <Text style={estilo.titulo}>Entrar</Text>
      <Text style={estilo.subtitulo}>Acesse a sua conta</Text>

      {!!mensagemInicial && !erro && (
        <Text style={estilo.textoAviso}>{mensagemInicial}</Text>
      )}
      {!!erro && <Text style={estilo.textoErro}>{erro}</Text>}

      <Text style={estilo.rotulo}>E-mail</Text>
      <TextInput
        style={estilo.campo}
        value={email}
        onChangeText={setEmail}
        placeholder="seu@email.com"
        placeholderTextColor={CORES.placeholder}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!carregando}
      />

      <Text style={estilo.rotulo}>Senha</Text>
      <TextInput
        style={estilo.campo}
        value={senha}
        onChangeText={setSenha}
        placeholder="Sua senha"
        placeholderTextColor={CORES.placeholder}
        secureTextEntry
        editable={!carregando}
        onSubmitEditing={fazerLogin}
      />

      <Pressable
        style={({ pressed }) => [estilo.botao, (carregando || pressed) && estilo.botaoDesabilitado]}
        onPress={fazerLogin}
        disabled={carregando}
      >
        <Text style={estilo.textoBotao}>{carregando ? 'Entrando...' : 'Entrar'}</Text>
      </Pressable>

      <Pressable style={estilo.botaoSecundario} onPress={irParaCadastro} disabled={carregando}>
        <Text style={estilo.textoBotaoSecundario}>Não tem conta? Cadastre-se</Text>
      </Pressable>
    </View>
  );
}
